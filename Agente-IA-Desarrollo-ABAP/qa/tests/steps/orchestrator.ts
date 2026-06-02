import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_BASE = join(__dirname, '..', 'fixtures');

export type EstadoPipeline =
  | 'argumentos-invalidos'
  | 'fd-no-encontrado'
  | 'rechazado-m1'
  | 'pausado-gate-1'
  | 'pausado-gate-2'
  | 'completado'
  | 'escalado-m3';

export type RespuestaGate =
  | 'si'
  | 'no'
  | 'detener'
  | { tipo: 'regenerar'; feedback: string };

export interface StubsPipeline {
  /** Output canónico de M1 (validador). Si no se pasa, se infiere por veredicto. */
  m1Output?: string;
  /** Veredicto que el stub de M1 debe emitir. */
  m1Veredicto?: 'APROBADO' | 'RECHAZADO';
  /** Output canónico de M2 (TD primera versión). */
  m2Output?: string;
  /** Outputs canónicos de M2 para regeneraciones (uno por cada `regenerar:` en Gate 2). */
  m2OutputsRegeneracion?: string[];
  /** Output canónico de M3. */
  m3Output?: string;
  /** Si true, M3 emite escalamiento BR-12 en vez de código. */
  m3Escala?: boolean;
}

export interface OpcionesOrquestador {
  outputsRoot: string;
  /** Fecha YYYY-MM-DD que el orquestador usa para la subcarpeta. */
  fecha: string;
  gate1: RespuestaGate;
  /** Gate 2 puede repetirse si hay regeneraciones. Lista las respuestas en orden. */
  gate2: RespuestaGate[];
  stubs: StubsPipeline;
}

export interface ResultadoPipeline {
  estado: EstadoPipeline;
  mensajes: string[];
  carpeta?: string;
  archivos_persistidos: string[];
  /** Indicadores de invocación, para que los tests asserten gates. */
  invoco_m1: boolean;
  invoco_m2: boolean;
  invoco_m3: boolean;
  /** Cuenta de invocaciones de M2 (incluyendo regeneraciones). */
  invocaciones_m2: number;
}

const APROBADO_FIXTURE = join(FIXTURES_BASE, 'validador-outputs', 'aprobado-bueno.md');
const RECHAZADO_FIXTURE = join(FIXTURES_BASE, 'validador-outputs', 'rechazado-bueno.md');
const TD_FIXTURE = join(FIXTURES_BASE, 'td-outputs', 'td-bueno.md');
const CODIGO_FIXTURE = join(FIXTURES_BASE, 'codigo-outputs', 'codigo-bueno.abap');

function defaultM1Output(veredicto: 'APROBADO' | 'RECHAZADO'): string {
  return readFileSync(veredicto === 'APROBADO' ? APROBADO_FIXTURE : RECHAZADO_FIXTURE, 'utf8');
}

function isAfirmativa(r: RespuestaGate): boolean {
  return r === 'si';
}

function isRegenerar(r: RespuestaGate): r is { tipo: 'regenerar'; feedback: string } {
  return typeof r === 'object' && r !== null && r.tipo === 'regenerar';
}

/**
 * Simulador del orquestador `/pipeline-abap`. Aplica la lógica del slash command:
 * argumentos obligatorios → existencia del FD → copia a outputs/<fecha>/<req-id>/ →
 * M1 → Gate 1 → M2 → Gate 2 (con regeneraciones) → M3 → resumen.
 *
 * No invoca LLMs reales — toma outputs canónicos de `opciones.stubs`. Útil para
 * testear las invariantes del orquestador (gates, persistencia, Principio #2) sin
 * pagar llamadas por cada scenario.
 */
export async function runPipelineStub(
  fdPath: string | null,
  reqId: string | null,
  opciones: OpcionesOrquestador,
): Promise<ResultadoPipeline> {
  const r: ResultadoPipeline = {
    estado: 'completado',
    mensajes: [],
    archivos_persistidos: [],
    invoco_m1: false,
    invoco_m2: false,
    invoco_m3: false,
    invocaciones_m2: 0,
  };

  // 0. Validar argumentos
  if (!fdPath || !reqId) {
    r.estado = 'argumentos-invalidos';
    r.mensajes.push(
      'Uso: `/pipeline-abap <ruta-fd> <req-id>`. Ambos argumentos son obligatorios para el pipeline completo.',
    );
    return r;
  }
  if (!existsSync(fdPath)) {
    r.estado = 'fd-no-encontrado';
    r.mensajes.push(`No pude encontrar el FD en \`${fdPath}\`. Verifica la ruta relativa al workspace.`);
    return r;
  }

  // 0.3 Preparar carpeta
  const carpeta = join(opciones.outputsRoot, opciones.fecha, reqId);
  mkdirSync(carpeta, { recursive: true });
  r.carpeta = carpeta;

  // 0.4 Persistir copia del FD
  const fdContent = readFileSync(fdPath, 'utf8');
  const fdDest = join(carpeta, 'fd.md');
  writeFileSync(fdDest, fdContent);
  r.archivos_persistidos.push('fd.md');

  // 1. M1 — Validador
  r.invoco_m1 = true;
  const veredicto = opciones.stubs.m1Veredicto ?? 'APROBADO';
  const m1Output = opciones.stubs.m1Output ?? defaultM1Output(veredicto);
  writeFileSync(join(carpeta, 'validacion.md'), m1Output);
  r.archivos_persistidos.push('validacion.md');
  r.mensajes.push(m1Output);

  if (veredicto === 'RECHAZADO') {
    r.estado = 'rechazado-m1';
    r.mensajes.push(
      '## ❌ Pipeline detenido en M1\n\nEl Validador rechazó el FD. **El pipeline NO continúa** (Principio #2 — FD sin calidad no avanza, sin excepciones).',
    );
    return r;
  }

  // 1.3 Gate 1
  if (!isAfirmativa(opciones.gate1)) {
    r.estado = 'pausado-gate-1';
    r.mensajes.push(
      `Pipeline pausado. Para retomar, ejecuta \`/generar-td outputs/${opciones.fecha}/${reqId}/fd.md ${reqId}\`.`,
    );
    return r;
  }

  // 2. M2 — FD → TD (con posibles regeneraciones)
  const tdBase = opciones.stubs.m2Output ?? readFileSync(TD_FIXTURE, 'utf8');
  r.invoco_m2 = true;
  r.invocaciones_m2 = 1;
  writeFileSync(join(carpeta, 'td.md'), tdBase);
  r.archivos_persistidos.push('td.md');

  let versionTd = 1;
  for (const respuesta of opciones.gate2) {
    if (isRegenerar(respuesta)) {
      versionTd += 1;
      const regenIdx = versionTd - 2;
      const regen =
        opciones.stubs.m2OutputsRegeneracion?.[regenIdx] ?? tdBase;
      const archivo = `td-v${versionTd}.md`;
      writeFileSync(
        join(carpeta, archivo),
        `<!-- Regenerado con feedback: ${respuesta.feedback} -->\n\n${regen}`,
      );
      r.archivos_persistidos.push(archivo);
      r.invocaciones_m2 += 1;
      continue;
    }
    if (respuesta === 'detener') {
      r.estado = 'pausado-gate-2';
      r.mensajes.push(
        `Pipeline pausado tras M2. Archivos persistidos en \`outputs/${opciones.fecha}/${reqId}/\`.`,
      );
      return r;
    }
    if (isAfirmativa(respuesta)) {
      break;
    }
    // 'no' y casos no-afirmativos termina pausado.
    r.estado = 'pausado-gate-2';
    return r;
  }

  // Si el bucle terminó sin un 'si' explícito (p. ej. solo regeneraciones), pausar.
  if (!opciones.gate2.some((g) => g === 'si')) {
    r.estado = 'pausado-gate-2';
    return r;
  }

  // 3. M3 — TD → Código
  r.invoco_m3 = true;
  if (opciones.stubs.m3Escala) {
    r.estado = 'escalado-m3';
    r.mensajes.push(
      '⚠️ **Límite de iteraciones alcanzado**: he intentado 2 veces corregir este error sin éxito. Conforme al PRD §7 Journey 4, se recomienda escalar a desarrollo manual desde el TD.',
    );
    return r;
  }
  const codigoOutput = opciones.stubs.m3Output ?? readFileSync(CODIGO_FIXTURE, 'utf8');
  writeFileSync(join(carpeta, 'codigo-report.abap'), codigoOutput);
  r.archivos_persistidos.push('codigo-report.abap');

  r.mensajes.push('## 🎉 Pipeline FD→TD→Código completado');
  return r;
}
