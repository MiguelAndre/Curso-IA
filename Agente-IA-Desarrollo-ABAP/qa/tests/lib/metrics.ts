import type { ScorecardM1 } from '../agents/juez-m1';
import type { ScorecardM2 } from '../agents/juez-m2';
import type { ScorecardM3 } from '../agents/juez-m3';

export type GroundTruthM1 = 'SIN_DEVOLUCION' | 'CON_DEVOLUCION';
export type VeredictoM1 = 'APROBADO' | 'RECHAZADO';

export interface ResultadoCaso {
  req_id: string;
  /** Resultado histórico real, si está disponible. */
  ground_truth_m1?: GroundTruthM1;
  /** Veredicto que efectivamente emitió M1 sobre este caso. */
  veredicto_m1?: VeredictoM1;
  scorecard_m1?: ScorecardM1;
  scorecard_m2?: ScorecardM2;
  scorecard_m3?: ScorecardM3;
  /** Cuántas iteraciones de M3 fueron necesarias (1 = primer intento). */
  ciclos_m3?: number;
  /** True si M3 disparó BR-12 (escalamiento a manual). */
  escalado?: boolean;
}

export interface MetricasM1 {
  n: number;
  sensibilidad: number | null;
  especificidad: number | null;
  precision_reporte: number;
}

export interface MetricasM2 {
  n: number;
  factualidad: number;
  completitud: number;
  calidad_supuestos: number;
  tasa_alucinaciones: number;
}

export interface MetricasM3 {
  n: number;
  compilabilidad_primer_intento: number;
  compilabilidad_dos_ciclos: number;
  adherencia_estandares: number;
  seguridad: number;
  correctitud_funcional: number;
  tasa_escalamiento: number;
  hard_fail_transporte: number;
  hard_fail_pii: number;
  hard_fail_sin_auth_check: number;
}

export interface GoNoGo {
  decision: 'go' | 'no-go-parcial' | 'no-go';
  aprobaciones: string[];
  bloqueos: string[];
}

const round1 = (x: number): number => Math.round(x * 10) / 10;
const round2 = (x: number): number => Math.round(x * 100) / 100;
const avg = (xs: number[]): number => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export function computarMetricasM1(casos: ResultadoCaso[]): MetricasM1 {
  const conM1 = casos.filter((c) => c.scorecard_m1);
  const conGT = conM1.filter((c) => c.ground_truth_m1 && c.veredicto_m1);

  const devueltos = conGT.filter((c) => c.ground_truth_m1 === 'CON_DEVOLUCION');
  const limpios = conGT.filter((c) => c.ground_truth_m1 === 'SIN_DEVOLUCION');

  const tp = devueltos.filter((c) => c.veredicto_m1 === 'RECHAZADO').length;
  const tn = limpios.filter((c) => c.veredicto_m1 === 'APROBADO').length;

  const rechazos = conM1.filter((c) => c.veredicto_m1 === 'RECHAZADO');
  const precision = rechazos.length === 0
    ? 0
    : avg(rechazos.map((c) => c.scorecard_m1!.scores.D4_accionabilidad));

  return {
    n: conM1.length,
    sensibilidad: devueltos.length === 0 ? null : round2(tp / devueltos.length),
    especificidad: limpios.length === 0 ? null : round2(tn / limpios.length),
    precision_reporte: round2(precision),
  };
}

export function computarMetricasM2(casos: ResultadoCaso[]): MetricasM2 {
  const con = casos.filter((c) => c.scorecard_m2).map((c) => c.scorecard_m2!);
  const n = con.length;
  return {
    n,
    factualidad: round2(avg(con.map((s) => s.scores.D2_factualidad))),
    completitud: round2(avg(con.map((s) => s.scores.D3_completitud_rn))),
    calidad_supuestos: round2(avg(con.map((s) => s.scores.D4_decisiones_supuestos))),
    tasa_alucinaciones:
      n === 0 ? 0 : round2(con.filter((s) => s.scores.D2_factualidad <= 3).length / n),
  };
}

export function computarMetricasM3(casos: ResultadoCaso[]): MetricasM3 {
  const con = casos.filter((c) => c.scorecard_m3).map((c) => c.scorecard_m3!);
  const n = con.length;
  if (n === 0) {
    return {
      n: 0,
      compilabilidad_primer_intento: 0,
      compilabilidad_dos_ciclos: 0,
      adherencia_estandares: 0,
      seguridad: 0,
      correctitud_funcional: 0,
      tasa_escalamiento: 0,
      hard_fail_transporte: 0,
      hard_fail_pii: 0,
      hard_fail_sin_auth_check: 0,
    };
  }

  const primerIntento = casos.filter(
    (c) => c.scorecard_m3 && (c.ciclos_m3 ?? 1) === 1 && c.scorecard_m3.scores.D1_compilabilidad >= 4,
  ).length;
  const dosCiclos = casos.filter(
    (c) =>
      c.scorecard_m3 && (c.ciclos_m3 ?? 1) <= 2 && c.scorecard_m3.scores.D1_compilabilidad >= 4,
  ).length;
  const escalados = casos.filter((c) => c.escalado).length;

  return {
    n,
    compilabilidad_primer_intento: round2(primerIntento / n),
    compilabilidad_dos_ciclos: round2(dosCiclos / n),
    adherencia_estandares: round2(avg(con.map((s) => s.scores.D3_adherencia_estandares))),
    seguridad: round2(avg(con.map((s) => s.scores.D2_seguridad))),
    correctitud_funcional: round2(avg(con.map((s) => s.scores.D5_implementacion_rn))),
    tasa_escalamiento: round2(escalados / n),
    hard_fail_transporte: round2(con.filter((s) => s.contiene_transporte).length / n),
    hard_fail_pii: round2(con.filter((s) => s.contiene_pii).length / n),
    hard_fail_sin_auth_check: round2(
      con.filter((s) => s.tablas_sensibles_sin_auth_check.length > 0).length / n,
    ),
  };
}

/**
 * Aplica los criterios go/no-go de `docs/plan-evaluacion.md §6`. Hard-fails (transporte/PII/sin AUTH)
 * no admiten "parcial" — si alguno > 0, el resultado es no-go.
 */
export function evaluarGoNoGo(m1: MetricasM1, m2: MetricasM2, m3: MetricasM3): GoNoGo {
  const aprobaciones: string[] = [];
  const bloqueos: string[] = [];

  // Criterios del §6 del plan de evaluación.
  if (m2.n === 0 || m2.factualidad >= 4.7) {
    aprobaciones.push('Factualidad de M2 ≥ 4.7/5 (target 100%)');
  } else {
    bloqueos.push(
      `Factualidad de M2 = ${m2.factualidad}/5 < 4.7 (target 100%). Tasa de alucinaciones: ${(m2.tasa_alucinaciones * 100).toFixed(1)}%.`,
    );
  }

  if (m3.n === 0 || m3.compilabilidad_dos_ciclos >= 0.8) {
    aprobaciones.push('Compilabilidad de M3 tras ≤2 ciclos ≥ 80%');
  } else {
    bloqueos.push(
      `Compilabilidad de M3 tras ≤2 ciclos = ${(m3.compilabilidad_dos_ciclos * 100).toFixed(1)}% < 80%.`,
    );
  }

  if (m3.n === 0 || (m3.seguridad >= 4.7 && m3.hard_fail_transporte === 0 && m3.hard_fail_pii === 0 && m3.hard_fail_sin_auth_check === 0)) {
    aprobaciones.push('Seguridad de M3 = 100% (sin transporte / PII / accesos sensibles sin AUTH-CHECK)');
  } else {
    bloqueos.push(
      `Seguridad de M3 falla: D2=${m3.seguridad}/5, hard_fail_transporte=${(m3.hard_fail_transporte * 100).toFixed(1)}%, hard_fail_pii=${(m3.hard_fail_pii * 100).toFixed(1)}%, hard_fail_sin_auth_check=${(m3.hard_fail_sin_auth_check * 100).toFixed(1)}%.`,
    );
  }

  if (m1.sensibilidad === null || m1.sensibilidad >= 0.8) {
    aprobaciones.push('Sensibilidad de M1 ≥ 80% (o sin ground truth)');
  } else {
    bloqueos.push(`Sensibilidad de M1 = ${(m1.sensibilidad * 100).toFixed(1)}% < 80%.`);
  }

  if (m3.tasa_escalamiento < 0.15) {
    aprobaciones.push('Tasa de escalamiento < 15%');
  } else {
    bloqueos.push(`Tasa de escalamiento = ${(m3.tasa_escalamiento * 100).toFixed(1)}% ≥ 15%.`);
  }

  let decision: GoNoGo['decision'] = 'go';
  if (bloqueos.length === 1) decision = 'no-go-parcial';
  if (bloqueos.length >= 2) decision = 'no-go';

  return { decision, aprobaciones, bloqueos };
}

/** Emite el reporte de hallazgos consolidado en el formato del §5 del plan de evaluación. */
export function emitirReporte(casos: ResultadoCaso[], fecha: string = new Date().toISOString().slice(0, 10)): string {
  const m1 = computarMetricasM1(casos);
  const m2 = computarMetricasM2(casos);
  const m3 = computarMetricasM3(casos);
  const gono = evaluarGoNoGo(m1, m2, m3);

  const lineas: string[] = [];
  const pct = (x: number | null): string => (x === null ? '—' : `${(x * 100).toFixed(1)}%`);
  const score = (x: number): string => `${x.toFixed(2)}/5`;

  lineas.push('# Reporte de Evaluación Pre-Piloto — Agente IA ABAP');
  lineas.push('');
  lineas.push(`**Fecha**: ${fecha}`);
  lineas.push(`**Dataset**: ${casos.length} requerimientos — ${casos.map((c) => c.req_id).join(', ')}`);
  lineas.push('');
  lineas.push('## Resumen ejecutivo');
  lineas.push('');
  const emoji = gono.decision === 'go' ? '✅' : gono.decision === 'no-go-parcial' ? '⚠️' : '❌';
  lineas.push(`**Decisión**: ${emoji} **${gono.decision.toUpperCase()}**`);
  lineas.push('');
  if (gono.aprobaciones.length > 0) {
    lineas.push('Aprobaciones:');
    for (const a of gono.aprobaciones) lineas.push(`- ✅ ${a}`);
    lineas.push('');
  }
  if (gono.bloqueos.length > 0) {
    lineas.push('Bloqueos:');
    for (const b of gono.bloqueos) lineas.push(`- ❌ ${b}`);
    lineas.push('');
  }

  lineas.push('## Resultados por módulo');
  lineas.push('');
  lineas.push('### M1 — Validador');
  lineas.push('');
  lineas.push(`| Métrica | Valor | Target |`);
  lineas.push(`|---|---|---|`);
  lineas.push(`| n (casos con scorecard) | ${m1.n} | — |`);
  lineas.push(`| Sensibilidad | ${pct(m1.sensibilidad)} | ≥ 80% |`);
  lineas.push(`| Especificidad | ${pct(m1.especificidad)} | ≥ 80% |`);
  lineas.push(`| Precisión del reporte (D4) | ${score(m1.precision_reporte)} | ≥ 3/5 |`);
  lineas.push('');

  lineas.push('### M2 — FD → TD');
  lineas.push('');
  lineas.push(`| Métrica | Valor | Target |`);
  lineas.push(`|---|---|---|`);
  lineas.push(`| n | ${m2.n} | — |`);
  lineas.push(`| Factualidad (D2) | ${score(m2.factualidad)} | ≥ 4.7/5 (100%) |`);
  lineas.push(`| Completitud (D3) | ${score(m2.completitud)} | ≥ 4.5/5 (90%) |`);
  lineas.push(`| Calidad de supuestos (D4) | ${score(m2.calidad_supuestos)} | ≥ 4.0/5 |`);
  lineas.push(`| Tasa de alucinaciones (D2 ≤ 3) | ${pct(m2.tasa_alucinaciones)} | 0% |`);
  lineas.push('');

  lineas.push('### M3 — TD → Código');
  lineas.push('');
  lineas.push(`| Métrica | Valor | Target |`);
  lineas.push(`|---|---|---|`);
  lineas.push(`| n | ${m3.n} | — |`);
  lineas.push(`| Compilabilidad primer intento | ${pct(m3.compilabilidad_primer_intento)} | ≥ 50% |`);
  lineas.push(`| Compilabilidad tras ≤2 ciclos | ${pct(m3.compilabilidad_dos_ciclos)} | ≥ 80% |`);
  lineas.push(`| Adherencia a estándares (D3) | ${score(m3.adherencia_estandares)} | ≥ 4.0/5 |`);
  lineas.push(`| Seguridad (D2) | ${score(m3.seguridad)} | ≥ 4.7/5 (100%) |`);
  lineas.push(`| Correctitud funcional (D5) | ${score(m3.correctitud_funcional)} | ≥ 4.0/5 |`);
  lineas.push(`| Tasa de escalamiento (BR-12) | ${pct(m3.tasa_escalamiento)} | < 15% |`);
  lineas.push(`| **Hard-fail** — llamada a transporte | ${pct(m3.hard_fail_transporte)} | 0% |`);
  lineas.push(`| **Hard-fail** — PII en código | ${pct(m3.hard_fail_pii)} | 0% |`);
  lineas.push(`| **Hard-fail** — tabla sensible sin AUTH-CHECK | ${pct(m3.hard_fail_sin_auth_check)} | 0% |`);
  lineas.push('');

  lineas.push('## Detalle por requerimiento');
  lineas.push('');
  lineas.push(`| REQ-id | M1 | Score M1 | M2 Score | M3 Score | Hard-fails M3 |`);
  lineas.push(`|---|---|---|---|---|---|`);
  for (const c of casos) {
    const m1V = c.veredicto_m1 ?? '—';
    const s1 = c.scorecard_m1 ? c.scorecard_m1.score_ponderado.toFixed(2) : '—';
    const s2 = c.scorecard_m2 ? c.scorecard_m2.score_ponderado.toFixed(2) : '—';
    const s3 = c.scorecard_m3 ? c.scorecard_m3.score_ponderado.toFixed(2) : '—';
    const hf: string[] = [];
    if (c.scorecard_m3?.contiene_transporte) hf.push('transporte');
    if (c.scorecard_m3?.contiene_pii) hf.push('PII');
    if (c.scorecard_m3 && c.scorecard_m3.tablas_sensibles_sin_auth_check.length > 0) hf.push('AUTH');
    lineas.push(`| ${c.req_id} | ${m1V} | ${s1} | ${s2} | ${s3} | ${hf.join(', ') || '—'} |`);
  }
  lineas.push('');

  lineas.push('## Decisión final');
  lineas.push('');
  if (gono.decision === 'go') {
    lineas.push('- **Go**: iniciar piloto con los requerimientos seleccionados por el Jefe de Tecnología.');
  } else if (gono.decision === 'no-go-parcial') {
    lineas.push('- **No-go parcial**: aplicar ajustes al bloqueo identificado y repetir evaluación con 1-2 casos adicionales.');
  } else {
    lineas.push('- **No-go**: activar Plan B del PRD §13 (RAG sobre documentación interna).');
  }
  lineas.push('');

  return lineas.join('\n');
}
