// Calibración del Juez M3. Los fixtures (codigo-{bueno,pobre,mediocre}.abap) son
// intencionalmente monolíticos — la calibración evalúa contenido, no estructura
// de archivos. El patrón Patrimonio (3 archivos REPORT+TOP+CLS) se aplica al
// output del LLM real vía contrato de concatenación documentado en
// qa/rubrics/m3-td-a-codigo.md §1. Ver PROP-014 en docs/memory/docs-evolution-proposal.md.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { juzgarOutputCodigo, PESOS_M3 } from './juez-m3';
import type { ScorecardM3 } from './juez-m3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TDS_DIR = join(__dirname, '..', 'fixtures', 'td-outputs');
const COD_DIR = join(__dirname, '..', 'fixtures', 'codigo-outputs');

function leer(dir: string, nombre: string): string {
  return readFileSync(join(dir, nombre), 'utf8');
}

type DimM3 = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7';

interface CasoCalibracionM3 {
  td_id: string;
  td: string;
  codigo: string;
  esperado: {
    D2: [number, number];
    D6: [number, number];
    score: [number, number];
    castigar?: DimM3[];
    banderas?: Partial<{
      contiene_select_star: boolean;
      contiene_for_all_entries_sin_guarda: boolean;
      contiene_pii: boolean;
      contiene_transporte: boolean;
      contiene_tests_unitarios: boolean;
      cabecera_completa: boolean;
    }>;
    tablas_sensibles_sin_auth_check_min?: number;
  };
}

const CASOS: CasoCalibracionM3[] = [
  {
    td_id: 'caso-1-codigo-bueno',
    td: leer(TDS_DIR, 'td-bueno.md'),
    codigo: leer(COD_DIR, 'codigo-bueno.abap'),
    esperado: {
      D2: [4, 5],
      D6: [4, 5],
      score: [4.0, 5.0],
      banderas: {
        contiene_select_star: false,
        contiene_pii: false,
        contiene_transporte: false,
        contiene_tests_unitarios: false,
        cabecera_completa: true,
      },
    },
  },
  {
    td_id: 'caso-2-codigo-pobre',
    td: leer(TDS_DIR, 'td-bueno.md'),
    codigo: leer(COD_DIR, 'codigo-pobre.abap'),
    // Múltiples violaciones hard-fail: no AUTH-CHECK, SELECT *, dyn SQL, PII, transporte, FAE sin guarda,
    // CL_GUI_ALV_GRID, REPORT puro, comentarios en inglés, sin cabecera.
    esperado: {
      D2: [1, 1],
      D6: [1, 2],
      score: [1.0, 2.0],
      castigar: ['D2', 'D3', 'D6', 'D7'],
      banderas: {
        contiene_select_star: true,
        contiene_for_all_entries_sin_guarda: true,
        contiene_pii: true,
        contiene_transporte: true,
        cabecera_completa: false,
      },
      tablas_sensibles_sin_auth_check_min: 1,
    },
  },
  {
    td_id: 'caso-3-codigo-mediocre',
    td: leer(TDS_DIR, 'td-mediocre.md'),
    codigo: leer(COD_DIR, 'codigo-mediocre.abap'),
    // Borderline: AUTH-CHECK presente pero sin IF sy-subrc; SELECT * en kna1 (tabla con PII);
    // cabecera presente pero bloque 3 "Ninguna" cuando debería marcar el supuesto de sy-datum.
    esperado: {
      D2: [2, 3],
      D6: [2, 3],
      score: [2.0, 3.8],
      castigar: ['D2', 'D6'],
      banderas: {
        contiene_select_star: true,
        contiene_transporte: false,
        contiene_tests_unitarios: false,
        cabecera_completa: true,
      },
    },
  },
];

test.describe('Calibración del Juez de M3', () => {
  test.setTimeout(180_000);

  for (const caso of CASOS) {
    test(`${caso.td_id} — dimensiones, score y banderas en rango esperado`, async () => {
      const sc: ScorecardM3 = await juzgarOutputCodigo({
        td_id: caso.td_id,
        td_content: caso.td,
        codigo_output: caso.codigo,
        modelo_evaluado: 'fixture-canned',
      });

      const checkRango = (
        valor: number,
        rango: [number, number],
        etiqueta: string,
      ): void => {
        expect(
          valor,
          `${etiqueta} fuera de rango. Razonamiento del Juez: ${sc.razonamiento}`,
        ).toBeGreaterThanOrEqual(rango[0]);
        expect(valor).toBeLessThanOrEqual(rango[1]);
      };

      checkRango(sc.scores.D2_seguridad, caso.esperado.D2, 'D2');
      checkRango(sc.scores.D6_trazabilidad, caso.esperado.D6, 'D6');
      checkRango(sc.score_ponderado, caso.esperado.score, 'score_ponderado');

      if (caso.esperado.castigar) {
        const map: Record<DimM3, keyof ScorecardM3['scores']> = {
          D1: 'D1_compilabilidad',
          D2: 'D2_seguridad',
          D3: 'D3_adherencia_estandares',
          D4: 'D4_factualidad',
          D5: 'D5_implementacion_rn',
          D6: 'D6_trazabilidad',
          D7: 'D7_limpieza',
        };
        for (const dim of caso.esperado.castigar) {
          expect(
            sc.scores[map[dim]],
            `El Juez no castigó ${dim}. Razonamiento: ${sc.razonamiento}`,
          ).toBeLessThanOrEqual(3);
        }
      }

      if (caso.esperado.banderas) {
        for (const [k, v] of Object.entries(caso.esperado.banderas)) {
          expect(
            sc[k as keyof ScorecardM3],
            `Bandera ${k} incorrecta. Razonamiento: ${sc.razonamiento}`,
          ).toBe(v);
        }
      }

      if (caso.esperado.tablas_sensibles_sin_auth_check_min !== undefined) {
        expect(
          sc.tablas_sensibles_sin_auth_check.length,
          `Esperaba ≥ ${caso.esperado.tablas_sensibles_sin_auth_check_min} tablas sensibles sin AUTH-CHECK. Lista: ${sc.tablas_sensibles_sin_auth_check.join(', ') || 'vacía'}. Razonamiento: ${sc.razonamiento}`,
        ).toBeGreaterThanOrEqual(caso.esperado.tablas_sensibles_sin_auth_check_min);
      }
    });
  }

  test('un código bueno obtiene score estrictamente mayor que uno pobre sobre el mismo TD', async () => {
    const td = leer(TDS_DIR, 'td-bueno.md');

    const [bueno, pobre] = await Promise.all([
      juzgarOutputCodigo({
        td_id: 'diferenciador-bueno',
        td_content: td,
        codigo_output: leer(COD_DIR, 'codigo-bueno.abap'),
      }),
      juzgarOutputCodigo({
        td_id: 'diferenciador-pobre',
        td_content: td,
        codigo_output: leer(COD_DIR, 'codigo-pobre.abap'),
      }),
    ]);

    expect(
      bueno.score_ponderado,
      `El Juez NO diferencia calidad. bueno=${bueno.score_ponderado}, pobre=${pobre.score_ponderado}.\nRazonamiento bueno: ${bueno.razonamiento}\nRazonamiento pobre: ${pobre.razonamiento}`,
    ).toBeGreaterThan(pobre.score_ponderado);

    // Castigos múltiples deben producir gap holgado.
    expect(bueno.score_ponderado - pobre.score_ponderado).toBeGreaterThanOrEqual(2.0);
  });

  test('hard-fail: el Juez SIEMPRE detecta llamada a transporte como contiene_transporte=true', async () => {
    const sc = await juzgarOutputCodigo({
      td_id: 'hard-fail-transporte',
      td_content: leer(TDS_DIR, 'td-bueno.md'),
      codigo_output: leer(COD_DIR, 'codigo-pobre.abap'),
    });
    expect(
      sc.contiene_transporte,
      `Falso negativo crítico: el Juez no detectó la llamada a TR_INSERT_REQUEST_WITH_TASKS. Razonamiento: ${sc.razonamiento}`,
    ).toBe(true);
    expect(
      sc.scores.D2_seguridad,
      'Con transporte detectado, D2 debe ser ≤ 2 obligatoriamente',
    ).toBeLessThanOrEqual(2);
  });

  test('hard-fail: el Juez SIEMPRE detecta PII en literales o comentarios', async () => {
    const sc = await juzgarOutputCodigo({
      td_id: 'hard-fail-pii',
      td_content: leer(TDS_DIR, 'td-bueno.md'),
      codigo_output: leer(COD_DIR, 'codigo-pobre.abap'),
    });
    expect(
      sc.contiene_pii,
      `Falso negativo crítico: el Juez no detectó el literal con nombre/dirección/teléfono reales. Razonamiento: ${sc.razonamiento}`,
    ).toBe(true);
  });

  test('los pesos suman 1.0 (consistencia de la rúbrica)', () => {
    const suma = Object.values(PESOS_M3).reduce((a, b) => a + b, 0);
    expect(Math.abs(suma - 1)).toBeLessThan(1e-9);
  });
});
