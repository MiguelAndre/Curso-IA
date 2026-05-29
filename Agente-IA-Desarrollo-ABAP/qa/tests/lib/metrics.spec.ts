import { test, expect } from '@playwright/test';
import {
  computarMetricasM1,
  computarMetricasM2,
  computarMetricasM3,
  evaluarGoNoGo,
  emitirReporte,
  type ResultadoCaso,
} from './metrics';
import type { ScorecardM1 } from '../agents/juez-m1';
import type { ScorecardM2 } from '../agents/juez-m2';
import type { ScorecardM3 } from '../agents/juez-m3';

function scM1(D1: number, D4: number = 4): ScorecardM1 {
  return {
    fd_id: 'x',
    modelo_evaluado: 'x',
    scores: {
      D1_correccion_veredicto: D1,
      D2_completitud_gaps: 4,
      D3_precision_gaps: 4,
      D4_accionabilidad: D4,
      D5_formato: 4,
      D6_lenguaje: 4,
    },
    score_ponderado: 4,
    razonamiento: '',
    gaps_omitidos: [],
    gaps_inventados: [],
    tono_acusatorio: false,
  };
}

function scM2(D2: number, D3: number = 4, D4: number = 4): ScorecardM2 {
  return {
    fd_id: 'x',
    modelo_evaluado: 'x',
    scores: {
      D1_tipo_objeto: 5,
      D2_factualidad: D2,
      D3_completitud_rn: D3,
      D4_decisiones_supuestos: D4,
      D5_tbds: 4,
      D6_estructura: 5,
      D7_limpieza: 5,
    },
    score_ponderado: 4,
    razonamiento: '',
    objetos_no_verificables: [],
    rn_omitidas: [],
    decisiones_count: 2,
    tbds_count: 1,
    contiene_codigo_abap: false,
  };
}

function scM3(opts: {
  D1?: number;
  D2?: number;
  D3?: number;
  D5?: number;
  transporte?: boolean;
  pii?: boolean;
  sinAuth?: string[];
} = {}): ScorecardM3 {
  return {
    td_id: 'x',
    modelo_evaluado: 'x',
    scores: {
      D1_compilabilidad: opts.D1 ?? 5,
      D2_seguridad: opts.D2 ?? 5,
      D3_adherencia_estandares: opts.D3 ?? 5,
      D4_factualidad: 5,
      D5_implementacion_rn: opts.D5 ?? 5,
      D6_trazabilidad: 5,
      D7_limpieza: 5,
    },
    score_ponderado: 5,
    razonamiento: '',
    rn_omitidas: [],
    objetos_no_verificables: [],
    tablas_sensibles_sin_auth_check: opts.sinAuth ?? [],
    contiene_select_star: false,
    contiene_for_all_entries_sin_guarda: false,
    contiene_pii: opts.pii ?? false,
    contiene_transporte: opts.transporte ?? false,
    contiene_tests_unitarios: false,
    cabecera_completa: true,
    verificar_count: 2,
  };
}

test.describe('metrics — computarMetricasM1', () => {
  test('sensibilidad y especificidad sobre dataset balanceado', () => {
    const casos: ResultadoCaso[] = [
      // 3 históricamente devueltos: 3 rechazados por el agente
      { req_id: 'R1', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5, 5) },
      { req_id: 'R2', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5, 4) },
      { req_id: 'R3', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(4, 4) },
      // 2 históricamente limpios: 2 aprobados por el agente
      { req_id: 'A1', ground_truth_m1: 'SIN_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(5) },
      { req_id: 'A2', ground_truth_m1: 'SIN_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(4) },
    ];
    const m = computarMetricasM1(casos);
    expect(m.n).toBe(5);
    expect(m.sensibilidad).toBe(1);
    expect(m.especificidad).toBe(1);
    expect(m.precision_reporte).toBeCloseTo(4.33, 1);
  });

  test('sensibilidad detecta falsos negativos del validador', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'R1', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5) },
      { req_id: 'R2', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(1) },
      { req_id: 'R3', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(1) },
    ];
    const m = computarMetricasM1(casos);
    expect(m.sensibilidad).toBeCloseTo(1 / 3, 2);
  });

  test('dataset sin ground truth devuelve sensibilidad/especificidad null', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'X', scorecard_m1: scM1(5), veredicto_m1: 'APROBADO' },
    ];
    const m = computarMetricasM1(casos);
    expect(m.sensibilidad).toBeNull();
    expect(m.especificidad).toBeNull();
  });
});

test.describe('metrics — computarMetricasM2', () => {
  test('factualidad y tasa de alucinaciones', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'A', scorecard_m2: scM2(5) },
      { req_id: 'B', scorecard_m2: scM2(5) },
      { req_id: 'C', scorecard_m2: scM2(2) },
    ];
    const m = computarMetricasM2(casos);
    expect(m.n).toBe(3);
    expect(m.factualidad).toBeCloseTo(4.0, 2);
    expect(m.tasa_alucinaciones).toBeCloseTo(1 / 3, 2);
  });
});

test.describe('metrics — computarMetricasM3', () => {
  test('compilabilidad y hard-fails', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'A', scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
      { req_id: 'B', scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 2, escalado: false },
      { req_id: 'C', scorecard_m3: scM3({ D1: 2, transporte: true, pii: true, sinAuth: ['KNA1'] }), ciclos_m3: 1, escalado: false },
      { req_id: 'D', scorecard_m3: scM3({ D1: 1 }), ciclos_m3: 3, escalado: true },
    ];
    const m = computarMetricasM3(casos);
    expect(m.n).toBe(4);
    expect(m.compilabilidad_primer_intento).toBeCloseTo(0.25, 2);
    expect(m.compilabilidad_dos_ciclos).toBeCloseTo(0.5, 2);
    expect(m.tasa_escalamiento).toBeCloseTo(0.25, 2);
    expect(m.hard_fail_transporte).toBeCloseTo(0.25, 2);
    expect(m.hard_fail_pii).toBeCloseTo(0.25, 2);
    expect(m.hard_fail_sin_auth_check).toBeCloseTo(0.25, 2);
  });
});

test.describe('metrics — evaluarGoNoGo', () => {
  test('dataset ideal devuelve go', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'A', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5), scorecard_m2: scM2(5), scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
      { req_id: 'B', ground_truth_m1: 'SIN_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(5), scorecard_m2: scM2(5), scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
    ];
    const m1 = computarMetricasM1(casos);
    const m2 = computarMetricasM2(casos);
    const m3 = computarMetricasM3(casos);
    const gono = evaluarGoNoGo(m1, m2, m3);
    expect(gono.decision).toBe('go');
    expect(gono.bloqueos).toHaveLength(0);
  });

  test('un solo bloqueo da no-go-parcial', () => {
    const casos: ResultadoCaso[] = [
      // Factualidad de M2 falla (D2 = 3), pero el resto está bien.
      { req_id: 'A', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5), scorecard_m2: scM2(3), scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
      { req_id: 'B', ground_truth_m1: 'SIN_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(5), scorecard_m2: scM2(3), scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
    ];
    const m1 = computarMetricasM1(casos);
    const m2 = computarMetricasM2(casos);
    const m3 = computarMetricasM3(casos);
    const gono = evaluarGoNoGo(m1, m2, m3);
    expect(gono.decision).toBe('no-go-parcial');
    expect(gono.bloqueos.some((b) => b.includes('Factualidad'))).toBe(true);
  });

  test('hard-fail de transporte fuerza no-go independientemente de scores', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'A', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5), scorecard_m2: scM2(5), scorecard_m3: scM3({ D2: 5, transporte: true }), ciclos_m3: 1, escalado: false },
    ];
    const m1 = computarMetricasM1(casos);
    const m2 = computarMetricasM2(casos);
    const m3 = computarMetricasM3(casos);
    const gono = evaluarGoNoGo(m1, m2, m3);
    expect(gono.decision).not.toBe('go');
    expect(gono.bloqueos.some((b) => b.includes('Seguridad'))).toBe(true);
  });

  test('múltiples bloqueos dan no-go', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'A', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(1), scorecard_m2: scM2(2), scorecard_m3: scM3({ D2: 2, transporte: true, pii: true }), ciclos_m3: 3, escalado: true },
      { req_id: 'B', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'APROBADO', scorecard_m1: scM1(1), scorecard_m2: scM2(2), scorecard_m3: scM3({ D2: 2 }), ciclos_m3: 3, escalado: true },
    ];
    const m1 = computarMetricasM1(casos);
    const m2 = computarMetricasM2(casos);
    const m3 = computarMetricasM3(casos);
    const gono = evaluarGoNoGo(m1, m2, m3);
    expect(gono.decision).toBe('no-go');
    expect(gono.bloqueos.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe('metrics — emitirReporte', () => {
  test('produce markdown con todas las secciones requeridas por plan-evaluacion.md §5', () => {
    const casos: ResultadoCaso[] = [
      { req_id: 'REQ-001', ground_truth_m1: 'CON_DEVOLUCION', veredicto_m1: 'RECHAZADO', scorecard_m1: scM1(5), scorecard_m2: scM2(5), scorecard_m3: scM3({ D1: 5 }), ciclos_m3: 1, escalado: false },
    ];
    const md = emitirReporte(casos, '2026-05-29');
    expect(md).toContain('# Reporte de Evaluación Pre-Piloto');
    expect(md).toContain('**Fecha**: 2026-05-29');
    expect(md).toContain('## Resumen ejecutivo');
    expect(md).toContain('## Resultados por módulo');
    expect(md).toContain('### M1 — Validador');
    expect(md).toContain('### M2 — FD → TD');
    expect(md).toContain('### M3 — TD → Código');
    expect(md).toContain('## Detalle por requerimiento');
    expect(md).toContain('## Decisión final');
    expect(md).toContain('REQ-001');
  });
});
