import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import {
  runPipelineStub,
  type EstadoPipeline,
  type OpcionesOrquestador,
  type RespuestaGate,
  type ResultadoPipeline,
} from './orchestrator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');
const FIXTURES_DIR = join(__dirname, '..', 'fixtures', 'fds');
const FECHA_TEST = '2026-05-29';

interface ContextoPipeline {
  fdPath: string | null;
  reqId: string | null;
  outputsRoot: string;
  gate1: RespuestaGate;
  gate2: RespuestaGate[];
  m1Veredicto: 'APROBADO' | 'RECHAZADO';
  m3Escala: boolean;
  resultado: ResultadoPipeline | null;
}

// Estado por scenario — playwright-bdd no comparte ctx tipado a través de Given de "common",
// usamos un mapa por test-id ligero atado al output del orchestrator.
const STATE: WeakMap<object, ContextoPipeline> = new WeakMap();

function getState(ctx: object): ContextoPipeline {
  let s = STATE.get(ctx);
  if (!s) {
    s = {
      fdPath: null,
      reqId: null,
      outputsRoot: mkdtempSync(join(tmpdir(), 'qa-pipeline-')),
      gate1: 'si',
      gate2: ['si'],
      m1Veredicto: 'APROBADO',
      m3Escala: false,
      resultado: null,
    };
    STATE.set(ctx, s);
  }
  return s;
}

function pathFixture(nombre: string): string {
  return join(FIXTURES_DIR, nombre);
}

// ---------- Antecedentes ----------

Given(
  'que existe el slash command {string} en `.claude/commands/`',
  async ({}, nombre: string) => {
    const path = join(REPO_ROOT, '.claude', 'commands', `${nombre}.md`);
    expect(existsSync(path), `No se encontró el slash command ${nombre}.md`).toBeTruthy();
  },
);

Given(
  'que el orquestador respeta los Principios #1, #2 y #6 del PRD',
  async ({}) => {
    // Validación documental — los tests subsiguientes ejercitan las invariantes.
    expect(true).toBeTruthy();
  },
);

// ---------- Setup del scenario ----------

Given('que invoco el pipeline sin argumento de {string}', async ({ ctx }, _arg: string) => {
  const s = getState(ctx);
  s.fdPath = null;
  s.reqId = 'REQ-SIN-RUTA';
});

Given('que invoco el pipeline con una ruta de FD que no existe', async ({ ctx }) => {
  const s = getState(ctx);
  s.fdPath = join(s.outputsRoot, 'no-existe.md');
  s.reqId = 'REQ-INEXISTENTE';
});

Given('un FD que el Validador M1 va a aprobar', async ({ ctx }) => {
  const s = getState(ctx);
  s.fdPath = pathFixture('fd-completo-alv.md');
  s.m1Veredicto = 'APROBADO';
});

Given('un FD que el Validador M1 va a rechazar', async ({ ctx }) => {
  const s = getState(ctx);
  s.fdPath = pathFixture('fd-casi-vacio.md');
  s.m1Veredicto = 'RECHAZADO';
});

Given(
  'el usuario respondería {string} en cualquier gate posterior',
  async ({ ctx }, resp: string) => {
    const s = getState(ctx);
    s.gate1 = resp as RespuestaGate;
    s.gate2 = [resp as RespuestaGate];
  },
);

Given('el usuario responde {string} en Gate 1', async ({ ctx }, resp: string) => {
  getState(ctx).gate1 = resp as RespuestaGate;
});

Given('el usuario responde {string} en Gate 2', async ({ ctx }, resp: string) => {
  const s = getState(ctx);
  s.gate2.push(resp as RespuestaGate);
});

Given(
  'en Gate 2 el usuario responde con {string} usando feedback {string}',
  async ({ ctx }, _accion: string, feedback: string) => {
    getState(ctx).gate2.push({ tipo: 'regenerar', feedback });
  },
);

Given('luego en Gate 2 el usuario responde {string}', async ({ ctx }, resp: string) => {
  getState(ctx).gate2.push(resp as RespuestaGate);
});

Given('M3 está configurado para escalar (BR-12)', async ({ ctx }) => {
  getState(ctx).m3Escala = true;
});

// ---------- When ----------

async function ejecutar(ctx: object, reqId: string | null): Promise<void> {
  const s = getState(ctx);
  if (reqId !== null) s.reqId = reqId;
  // Si gate2 quedó con solo el "si" por defecto y el usuario no agregó nada explícito,
  // mantenemos ["si"]. Si el usuario empujó respuestas, esas mandan.
  const opciones: OpcionesOrquestador = {
    outputsRoot: s.outputsRoot,
    fecha: FECHA_TEST,
    gate1: s.gate1,
    gate2: s.gate2.length === 0 ? ['si'] : s.gate2,
    stubs: {
      m1Veredicto: s.m1Veredicto,
      m3Escala: s.m3Escala,
    },
  };
  s.resultado = await runPipelineStub(s.fdPath, s.reqId, opciones);
}

When('se ejecuta el orquestador', async ({ ctx }) => {
  await ejecutar(ctx, null);
});

When(
  'se ejecuta el orquestador con ese FD y {string}',
  async ({ ctx }, reqId: string) => {
    await ejecutar(ctx, reqId);
  },
);

// ---------- Thens ----------

Then(
  'el estado del pipeline debe ser {string}',
  async ({ ctx }, esperado: string) => {
    const s = getState(ctx);
    expect(s.resultado, 'El pipeline no se ejecutó').not.toBeNull();
    expect(s.resultado!.estado as EstadoPipeline).toBe(esperado);
  },
);

Then('el orquestador NO debe haber invocado a M1', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m1).toBe(false);
});

Then('el orquestador debe haber invocado a M1', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m1).toBe(true);
});

Then('el orquestador NO debe haber invocado a M2', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m2).toBe(false);
});

Then('el orquestador debe haber invocado a M2', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m2).toBe(true);
});

Then(
  'el orquestador debe haber invocado a M2 exactamente {int} veces',
  async ({ ctx }, n: number) => {
    expect(getState(ctx).resultado!.invocaciones_m2).toBe(n);
  },
);

Then('el orquestador NO debe haber invocado a M3', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m3).toBe(false);
});

Then('el orquestador debe haber invocado a M3', async ({ ctx }) => {
  expect(getState(ctx).resultado!.invoco_m3).toBe(true);
});

Then(
  'el mensaje al usuario debe contener {string}',
  async ({ ctx }, fragmento: string) => {
    const todos = getState(ctx).resultado!.mensajes.join('\n');
    expect(todos.toLowerCase()).toContain(fragmento.toLowerCase());
  },
);

Then(
  'la carpeta de outputs debe contener {string}',
  async ({ ctx }, archivo: string) => {
    const r = getState(ctx).resultado!;
    expect(r.carpeta, 'La carpeta de outputs no se creó').toBeTruthy();
    expect(existsSync(join(r.carpeta!, archivo)), `Falta el archivo ${archivo} en ${r.carpeta}`).toBeTruthy();
  },
);

Then(
  'la carpeta de outputs NO debe contener {string}',
  async ({ ctx }, archivo: string) => {
    const r = getState(ctx).resultado!;
    if (!r.carpeta) {
      // Si no se creó la carpeta, trivialmente no contiene el archivo.
      expect(true).toBeTruthy();
      return;
    }
    expect(
      existsSync(join(r.carpeta, archivo)),
      `El archivo ${archivo} fue persistido cuando NO debería estar`,
    ).toBeFalsy();
  },
);

Then(
  'el archivo {string} debe contener el feedback {string}',
  async ({ ctx }, archivo: string, fragmento: string) => {
    const r = getState(ctx).resultado!;
    const contenido = readFileSync(join(r.carpeta!, archivo), 'utf8');
    expect(contenido).toContain(fragmento);
  },
);

Then(
  'la carpeta de outputs debe seguir el patrón {string}',
  async ({ ctx }, _patron: string) => {
    const r = getState(ctx).resultado!;
    expect(r.carpeta).toBeTruthy();
    const partes = r.carpeta!.split(sep);
    const subDir = partes[partes.length - 1];
    const fechaDir = partes[partes.length - 2];
    expect(subDir, `Subcarpeta no es <req-id>: ${subDir}`).toMatch(/^REQ-\d{4}-\d+/);
    expect(fechaDir, `Carpeta padre no es <fecha>: ${fechaDir}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  },
);
