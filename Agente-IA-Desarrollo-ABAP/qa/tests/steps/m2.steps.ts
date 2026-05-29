import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { invocarFdATd } from './runner';

const FIXTURES_DIR = join(__dirname, '..', 'fixtures', 'fds');
const INPUTS_DIR = join(__dirname, '..', 'fixtures', 'inputs');

function cargarFd(nombre: string): string {
  return readFileSync(join(FIXTURES_DIR, nombre), 'utf8');
}

// ---------- Givens ----------

Given(
  'un FD aprobado para un reporte ALV de materiales por proveedor',
  async ({ ctx }) => {
    ctx.fdContent = cargarFd('fd-completo-alv.md');
  },
);

Given('un FD aprobado mínimo para un reporte ALV trivial', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-trivial-completo.md');
});

Given('un FD aprobado para un reporte ALV trivial', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-trivial-completo.md');
});

Given(
  'un FD aprobado con contradicción interna entre RN y Casos Borde',
  async ({ ctx }) => {
    ctx.fdContent = cargarFd('fd-contradiccion.md');
  },
);

// ---------- Whens ----------

When(
  'invoco el sub-agente {string} en modo pipeline (FD ya validado)',
  async ({ ctx }, _agente: string) => {
    // Si el contexto cargó un input ABAP (escenario reverse), úsalo en lugar del FD.
    const input =
      ctx.fdContent !== '' ? ctx.fdContent : ctx.inputCrudo;
    const respuesta = await invocarFdATd(input, { directo: false });
    ctx.respuesta = { output: respuesta.output, veredicto: 'SIN_VEREDICTO' };
  },
);

When(
  'invoco el sub-agente {string} en modo directo (sin pasar por el Validador)',
  async ({ ctx }, _agente: string) => {
    const respuesta = await invocarFdATd(ctx.fdContent, { directo: true });
    ctx.respuesta = { output: respuesta.output, veredicto: 'SIN_VEREDICTO' };
  },
);

// ---------- Thens ----------

Then(
  'el TD debe declarar el tipo de objeto {string} en la sección 1',
  async ({ ctx }, tipo: string) => {
    const out = ctx.respuesta!.output;
    // La sección 1 declara el tipo. Aceptamos el literal del enum o su forma legible.
    const matchEnum = new RegExp(tipo, 'i').test(out);
    const matchHumano = /reporte\s+alv/i.test(out);
    expect(matchEnum || matchHumano, `No se encontró tipo "${tipo}" ni "Reporte ALV" en el output`).toBeTruthy();
  },
);

Then(
  'el TD debe contener las 9 secciones obligatorias del agente',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    for (let i = 1; i <= 9; i++) {
      expect(
        new RegExp(`##\\s*${i}\\.`).test(out),
        `Falta la sección ${i} en el TD`,
      ).toBeTruthy();
    }
  },
);

Then(
  'el TD debe proponer una clase con nombre que matchee {string}',
  async ({ ctx }, patron: string) => {
    expect(ctx.respuesta!.output).toMatch(new RegExp(patron));
  },
);

Then(
  'el TD debe listar las tablas SAP mencionadas en el FD (MARA, EKKO, EKPO, MSEG, LFA1)',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    for (const t of ['MARA', 'EKKO', 'EKPO', 'MSEG', 'LFA1']) {
      expect(out, `Falta la tabla ${t} en el TD`).toMatch(new RegExp(`\\b${t}\\b`));
    }
  },
);

Then(
  'el TD debe tener una sección "Decisiones y Supuestos" con al menos 1 entrada',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    expect(out).toMatch(/Decisiones y Supuestos/i);
    // Al menos un ítem numerado o con viñeta luego del header.
    const seccion = out.split(/Decisiones y Supuestos/i)[1] ?? '';
    expect(seccion).toMatch(/^[\s\S]*?(\d+\.\s+|-\s+|\*\s+)/);
  },
);

Then('el TD debe incluir la sección {string}', async ({ ctx }, titulo: string) => {
  const out = ctx.respuesta!.output;
  // Aceptar variaciones: el agente puede usar "##" o "###" y abreviar.
  const tokens = titulo.split(/\s+/).filter((t) => t.length > 2);
  const patron = new RegExp(tokens.slice(0, 3).join('.*'), 'i');
  expect(out, `No se encontró la sección "${titulo}" (patrón: ${patron})`).toMatch(patron);
});

Then('el TD no debe contener {string}', async ({ ctx }, prohibido: string) => {
  const out = ctx.respuesta!.output;
  // Sensibilidad: buscamos el literal sin importar mayúsculas/minúsculas.
  expect(out.toLowerCase()).not.toContain(prohibido.toLowerCase());
});

Then(
  'el TD no debe contener bloques de código en lenguaje {string}',
  async ({ ctx }, fence: string) => {
    expect(ctx.respuesta!.output).not.toContain(fence);
  },
);

Then('el TD debe contener un AVISO de modo directo al inicio', async ({ ctx }) => {
  const out = ctx.respuesta!.output;
  // El template del agente §8 dice: "AVISO — Modo directo".
  const primerasLineas = out.split('\n').slice(0, 30).join('\n');
  expect(primerasLineas).toMatch(/AVISO.*modo\s+directo/i);
});

Then('el aviso debe mencionar que el FD no pasó por el Validador', async ({ ctx }) => {
  expect(ctx.respuesta!.output).toMatch(/validador|módulo\s+1|pas[óo]\s+previamente/i);
});

Then(
  'el TD debe completarse igualmente (el agente no se niega — BR-02)',
  async ({ ctx }) => {
    // Heurística: que el output sea sustancialmente largo y tenga al menos la sección 1.
    expect(ctx.respuesta!.output.length).toBeGreaterThan(500);
    expect(ctx.respuesta!.output).toMatch(/##\s*1\./);
  },
);

Then('el TD debe contener la cabecera {string}', async ({ ctx }, frase: string) => {
  expect(ctx.respuesta!.output).toMatch(new RegExp(frase, 'i'));
});

Then(
  'el TD debe marcar las Reglas de Negocio como {string}',
  async ({ ctx }, marca: string) => {
    expect(ctx.respuesta!.output).toMatch(new RegExp(marca, 'i'));
  },
);

Then(
  'el TD debe incluir una recomendación de validar con el área de negocio',
  async ({ ctx }) => {
    expect(ctx.respuesta!.output).toMatch(/validar.*(negocio|consultor|área)/i);
  },
);

Then('el TD debe incluir al menos un TBD en la sección 9', async ({ ctx }) => {
  const out = ctx.respuesta!.output;
  const seccion9 = out.split(/##\s*9\./i)[1] ?? '';
  expect(seccion9, 'No se encontró la sección 9 en el output').not.toBe('');
  expect(seccion9).toMatch(/TBD\s*\d|TBD[: ]/i);
});

Then('cada TBD debe incluir una {string}', async ({ ctx }, etiqueta: string) => {
  const out = ctx.respuesta!.output;
  const seccion9 = out.split(/##\s*9\./i)[1] ?? '';
  expect(seccion9).toMatch(new RegExp(etiqueta, 'i'));
});

Then(
  'cada tabla SAP listada en la sección 3 debe estar en el FD original o estar marcada con "⚠️ VERIFICAR"',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    const seccion3 = (out.split(/##\s*3\./i)[1] ?? '').split(/##\s*4\./i)[0] ?? '';
    // Tablas que tienen aspecto SAP estándar: 3-8 mayúsculas, posiblemente con dígitos.
    const candidatas = [...seccion3.matchAll(/\b([A-Z]{3,8}\d?)\b/g)].map((m) => m[1]);
    const tablasDelFd = new Set(
      [...ctx.fdContent.matchAll(/\b([A-Z]{3,8}\d?)\b/g)].map((m) => m[1]),
    );
    for (const t of new Set(candidatas)) {
      const enFd = tablasDelFd.has(t);
      // Verificar si en el contexto inmediato de la tabla en sección 3 aparece "⚠️ VERIFICAR".
      const idx = seccion3.indexOf(t);
      const contexto = seccion3.slice(Math.max(0, idx - 200), idx + 200);
      const marcada = /⚠️\s*VERIFICAR/i.test(contexto);
      expect(
        enFd || marcada,
        `Tabla "${t}" aparece en el TD pero no está en el FD ni está marcada con "⚠️ VERIFICAR"`,
      ).toBeTruthy();
    }
  },
);

Then(
  'el TD debe contener palabras frecuentes en español (artículos, conectores)',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output.toLowerCase();
    const marcadores = [' que ', ' para ', ' del ', ' con ', ' los ', ' las '];
    const presentes = marcadores.filter((m) => out.includes(m)).length;
    expect(presentes, 'El output no parece estar en español').toBeGreaterThanOrEqual(3);
  },
);

Then(
  'el TD no debe tener encabezados de sección en inglés (Decisions, Assumptions, Tables)',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    expect(out).not.toMatch(/##\s*Decisions\b/i);
    expect(out).not.toMatch(/##\s*Assumptions\b/i);
    expect(out).not.toMatch(/##\s*Tables\b/i);
  },
);
