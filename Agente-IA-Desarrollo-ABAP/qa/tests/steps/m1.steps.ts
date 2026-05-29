import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { invocarValidadorFd, insistirAprobacion } from './runner';

const FIXTURES_DIR = join(__dirname, '..', 'fixtures', 'fds');
const INPUTS_DIR = join(__dirname, '..', 'fixtures', 'inputs');

function cargarFd(nombre: string): string {
  return readFileSync(join(FIXTURES_DIR, nombre), 'utf8');
}

// ---------- Givens que arman el FD del scenario ----------

Given(
  'un FD que omite la sección {string}',
  async ({ ctx }, _seccion: string) => {
    // Fixture pre-armada: omite "Autorizaciones", "Tablas SAP involucradas" y tiene Objetivo corto.
    ctx.fdContent = cargarFd('fd-faltan-secciones.md');
  },
);

Given('omite la sección {string}', async ({ ctx }, _seccion: string) => {
  // No-op: el fixture cargado en el step anterior ya cubre las omisiones del scenario.
  expect(ctx.fdContent).not.toBe('');
});

Given(
  'tiene un Objetivo vacío (menos de 50 caracteres de contenido)',
  async ({ ctx }) => {
    expect(ctx.fdContent).not.toBe('');
  },
);

Given('un FD con seis secciones estructurales faltantes o vacías', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-casi-vacio.md');
});

Given(
  'un FD que cumple las siete secciones obligatorias del formato genérico',
  async ({ ctx }) => {
    ctx.fdContent = cargarFd('fd-completo-alv.md');
  },
);

Given('cuyo Objetivo tiene verbo accionable y resultado medible', async ({ ctx }) => {
  expect(ctx.fdContent).toMatch(/Objetivo/i);
});

Given('cuyas Reglas de Negocio tienen formato condición → acción', async ({ ctx }) => {
  expect(ctx.fdContent).toMatch(/RN\d+:/);
});

Given(
  'cuyas Tablas SAP están nombradas técnicamente (p. ej. MARA, MARC)',
  async ({ ctx }) => {
    expect(ctx.fdContent).toMatch(/\b[A-Z]{3,8}\b/);
  },
);

Given('cuyos Criterios de Aceptación son verificables', async ({ ctx }) => {
  expect(ctx.fdContent).toMatch(/CA\d+:/);
});

Given('un FD con las siete secciones presentes', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-vago.md');
});

Given(
  'cuyo Objetivo dice únicamente {string}',
  async ({ ctx }, _frase: string) => {
    expect(ctx.fdContent).not.toBe('');
  },
);

Given(
  'cuyos Criterios de Aceptación son frases como {string}',
  async ({ ctx }, _frase: string) => {
    expect(ctx.fdContent).not.toBe('');
  },
);

Given('un FD que fue RECHAZADO previamente con gaps bloqueantes', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-casi-vacio.md');
  ctx.respuesta = await invocarValidadorFd(ctx.fdContent);
  expect(ctx.respuesta.veredicto).toBe('RECHAZADO');
});

Given(
  'un input que es un programa ABAP existente y no un Documento Funcional',
  async ({ ctx }) => {
    ctx.inputCrudo = readFileSync(join(INPUTS_DIR, 'codigo-abap-no-fd.abap'), 'utf8');
    ctx.fdContent = ctx.inputCrudo;
  },
);

Given(
  'un FD mínimo pero completo para un reporte ALV de una sola tabla',
  async ({ ctx }) => {
    ctx.fdContent = cargarFd('fd-trivial-completo.md');
  },
);

Given('un FD que cumple todas las CE y todas las CS bloqueantes', async ({ ctx }) => {
  ctx.fdContent = cargarFd('fd-completo-alv.md');
});

Given('presenta la observación menor {string}', async ({ ctx }, _obs: string) => {
  expect(ctx.fdContent).not.toBe('');
});

// ---------- Whens ----------

When(
  'invoco el sub-agente {string} con ese FD',
  async ({ ctx }, _agente: string) => {
    ctx.respuesta = await invocarValidadorFd(ctx.fdContent);
  },
);

When(
  'invoco el sub-agente {string} con ese input',
  async ({ ctx }, _agente: string) => {
    ctx.respuesta = await invocarValidadorFd(ctx.fdContent);
  },
);

When('el usuario solicita {string}', async ({ ctx }, mensaje: string) => {
  expect(ctx.respuesta).not.toBeNull();
  ctx.respuesta = await insistirAprobacion(ctx.respuesta!, ctx.fdContent, mensaje);
});

// ---------- Thens ----------

Then('el veredicto debe ser {string}', async ({ ctx }, esperado: string) => {
  expect(ctx.respuesta).not.toBeNull();
  expect(ctx.respuesta!.veredicto).toBe(esperado);
});

Then(
  'el output debe listar el gap {string} asociado a la sección {string}',
  async ({ ctx }, regla: string, seccion: string) => {
    const out = ctx.respuesta!.output;
    expect(out, `No se encontró referencia a la regla ${regla} en el output`).toMatch(
      new RegExp(regla, 'i'),
    );
    expect(out, `No se encontró referencia a la sección "${seccion}" en el output`).toMatch(
      new RegExp(seccion.split(' ').slice(0, 2).join('.*'), 'i'),
    );
  },
);

Then(
  'el output debe listar el gap {string} en la sección {string}',
  async ({ ctx }, regla: string, seccion: string) => {
    const out = ctx.respuesta!.output;
    expect(out).toMatch(new RegExp(regla, 'i'));
    expect(out).toMatch(new RegExp(seccion.split(' ').slice(0, 2).join('.*'), 'i'));
  },
);

Then('cada gap debe incluir una {string} accionable', async ({ ctx }, etiqueta: string) => {
  const out = ctx.respuesta!.output;
  // Una "Recomendación" por cada bloque de gap.
  const gaps = (out.match(/\*\*Gap[^\n]*\*\*/g) ?? []).length;
  const recos = (out.match(new RegExp(`\\*\\*${etiqueta}`, 'g')) ?? []).length;
  expect(recos, `Esperaba al menos ${gaps} recomendaciones; encontré ${recos}`).toBeGreaterThanOrEqual(gaps);
});

Then(
  'el output debe terminar con la frase canónica {string}',
  async ({ ctx }, frase: string) => {
    const out = ctx.respuesta!.output;
    expect(out, `Faltó la frase canónica "${frase}"`).toContain(frase);
  },
);

Then('el output debe listar los seis gaps en la misma respuesta', async ({ ctx }) => {
  const out = ctx.respuesta!.output;
  const gaps = (out.match(/\*\*Gap[^\n]*\*\*/g) ?? []).length;
  expect(gaps, `Esperaba 6 gaps; encontré ${gaps}`).toBeGreaterThanOrEqual(6);
});

Then('el output no debe pedir aclaraciones al usuario antes de reportar', async ({ ctx }) => {
  const out = ctx.respuesta!.output;
  expect(out).not.toMatch(/¿(podrías|me\s+aclarás|necesito\s+más)/i);
});

Then(
  'el output no debe contener ningún diseño técnico (TD ni código ABAP)',
  async ({ ctx }) => {
    const out = ctx.respuesta!.output;
    expect(out).not.toMatch(/CL_SALV_TABLE|REPORT\s+z|CLASS\s+zcl_/i);
    expect(out).not.toMatch(/Arquitectura técnica/i);
  },
);

Then('el sub-agente debe negarse', async ({ ctx }) => {
  expect(ctx.respuesta!.veredicto).not.toBe('APROBADO');
});

Then('el output debe contener la frase canónica', async ({ ctx }, frase: string) => {
  // playwright-bdd pasa los docstrings (""" ... """) como último parámetro.
  expect(ctx.respuesta!.output).toContain(frase.trim());
});

Then('el output no debe cambiar el veredicto a {string}', async ({ ctx }, vered: string) => {
  expect(ctx.respuesta!.veredicto).not.toBe(vered);
});

Then(
  'el sub-agente no debe emitir veredicto {string} ni {string}',
  async ({ ctx }, a: string, b: string) => {
    expect([a, b]).not.toContain(ctx.respuesta!.veredicto);
  },
);

Then(
  'debe redirigir al usuario al caso UC5 sugiriendo {string}',
  async ({ ctx }, sugerencia: string) => {
    expect(ctx.respuesta!.output).toContain(sugerencia);
  },
);

Then('el output no debe contener bloques de código ABAP', async ({ ctx }) => {
  expect(ctx.respuesta!.output).not.toMatch(/```abap|REPORT\s+z|CLASS\s+zcl_/i);
});

Then(
  'el output no debe contener una sección {string} ni {string}',
  async ({ ctx }, a: string, b: string) => {
    const out = ctx.respuesta!.output;
    expect(out).not.toMatch(new RegExp(a, 'i'));
    expect(out).not.toMatch(new RegExp(b, 'i'));
  },
);

Then('el output debe incluir una sección {string}', async ({ ctx }, seccion: string) => {
  expect(ctx.respuesta!.output).toMatch(new RegExp(seccion, 'i'));
});

Then('debe mencionar la regla {string}', async ({ ctx }, regla: string) => {
  expect(ctx.respuesta!.output).toMatch(new RegExp(regla, 'i'));
});
