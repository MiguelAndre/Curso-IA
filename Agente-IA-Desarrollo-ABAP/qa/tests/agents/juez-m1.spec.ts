import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { juzgarOutputValidador, PESOS_M1 } from './juez-m1';
import type { GroundTruthM1, ScorecardM1 } from './juez-m1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FDS_DIR = join(__dirname, '..', 'fixtures', 'fds');
const OUTPUTS_DIR = join(__dirname, '..', 'fixtures', 'validador-outputs');

function leer(dir: string, nombre: string): string {
  return readFileSync(join(dir, nombre), 'utf8');
}

interface CasoCalibracion {
  fd_id: string;
  fd: string;
  output: string;
  ground_truth: GroundTruthM1;
  esperado: {
    /** Rango aceptado para D1 (corrección del veredicto). */
    D1: [number, number];
    /** Score ponderado esperado. */
    score: [number, number];
    /** Si el output es de baja calidad, dimensiones que deberían castigarse. */
    castigar?: Array<'D2' | 'D3' | 'D4' | 'D5' | 'D6'>;
  };
}

const CASOS: CasoCalibracion[] = [
  {
    fd_id: 'caso-1-aprobado-bueno',
    fd: leer(FDS_DIR, 'fd-completo-alv.md'),
    output: leer(OUTPUTS_DIR, 'aprobado-bueno.md'),
    ground_truth: { tipo: 'SIN_DEVOLUCION' },
    esperado: { D1: [4, 5], score: [4.0, 5.0] },
  },
  {
    fd_id: 'caso-2-rechazado-bueno',
    fd: leer(FDS_DIR, 'fd-faltan-secciones.md'),
    output: leer(OUTPUTS_DIR, 'rechazado-bueno.md'),
    ground_truth: {
      tipo: 'CON_DEVOLUCION',
      motivos: [
        'Faltan secciones obligatorias (Autorizaciones, Tablas SAP)',
        'Objetivo y CA demasiado vagos',
      ],
    },
    esperado: { D1: [4, 5], score: [3.8, 5.0] },
  },
  {
    fd_id: 'caso-3-rechazado-pobre',
    fd: leer(FDS_DIR, 'fd-faltan-secciones.md'),
    output: leer(OUTPUTS_DIR, 'rechazado-pobre.md'),
    ground_truth: {
      tipo: 'CON_DEVOLUCION',
      motivos: [
        'Faltan secciones obligatorias (Autorizaciones, Tablas SAP)',
        'Objetivo y CA demasiado vagos',
      ],
    },
    // Veredicto correcto, pero report incompleto, no accionable, tono acusatorio y sin formato.
    esperado: {
      D1: [3, 5],
      score: [1.0, 3.5],
      castigar: ['D2', 'D4', 'D5', 'D6'],
    },
  },
];

test.describe('Calibración del Juez de M1', () => {
  test.setTimeout(180_000);

  for (const caso of CASOS) {
    test(`${caso.fd_id} — D1 y score dentro del rango esperado`, async () => {
      const scorecard: ScorecardM1 = await juzgarOutputValidador({
        fd_id: caso.fd_id,
        fd_content: caso.fd,
        output_validador: caso.output,
        ground_truth: caso.ground_truth,
        modelo_evaluado: 'fixture-canned',
      });

      const [d1Min, d1Max] = caso.esperado.D1;
      expect(
        scorecard.scores.D1_correccion_veredicto,
        `D1 fuera de rango. Razonamiento del Juez: ${scorecard.razonamiento}`,
      ).toBeGreaterThanOrEqual(d1Min);
      expect(scorecard.scores.D1_correccion_veredicto).toBeLessThanOrEqual(d1Max);

      const [sMin, sMax] = caso.esperado.score;
      expect(
        scorecard.score_ponderado,
        `Score ponderado fuera de rango. Razonamiento: ${scorecard.razonamiento}`,
      ).toBeGreaterThanOrEqual(sMin);
      expect(scorecard.score_ponderado).toBeLessThanOrEqual(sMax);

      if (caso.esperado.castigar) {
        for (const dim of caso.esperado.castigar) {
          const key =
            dim === 'D2'
              ? 'D2_completitud_gaps'
              : dim === 'D3'
                ? 'D3_precision_gaps'
                : dim === 'D4'
                  ? 'D4_accionabilidad'
                  : dim === 'D5'
                    ? 'D5_formato'
                    : 'D6_lenguaje';
          expect(
            scorecard.scores[key],
            `El Juez no castigó ${dim} para un output objetivamente pobre. Razonamiento: ${scorecard.razonamiento}`,
          ).toBeLessThanOrEqual(3);
        }
      }
    });
  }

  test('un output bueno obtiene score estrictamente mayor que uno pobre sobre el mismo FD', async () => {
    const fd = leer(FDS_DIR, 'fd-faltan-secciones.md');
    const gt: GroundTruthM1 = {
      tipo: 'CON_DEVOLUCION',
      motivos: ['Faltan secciones obligatorias (Autorizaciones, Tablas SAP)'],
    };

    const [bueno, pobre] = await Promise.all([
      juzgarOutputValidador({
        fd_id: 'diferenciador-bueno',
        fd_content: fd,
        output_validador: leer(OUTPUTS_DIR, 'rechazado-bueno.md'),
        ground_truth: gt,
      }),
      juzgarOutputValidador({
        fd_id: 'diferenciador-pobre',
        fd_content: fd,
        output_validador: leer(OUTPUTS_DIR, 'rechazado-pobre.md'),
        ground_truth: gt,
      }),
    ]);

    expect(
      bueno.score_ponderado,
      `El Juez NO diferencia calidad. bueno=${bueno.score_ponderado}, pobre=${pobre.score_ponderado}.\nRazonamiento bueno: ${bueno.razonamiento}\nRazonamiento pobre: ${pobre.razonamiento}`,
    ).toBeGreaterThan(pobre.score_ponderado);
  });

  test('los pesos suman 1.0 (consistencia de la rúbrica)', () => {
    const suma = Object.values(PESOS_M1).reduce((a, b) => a + b, 0);
    expect(Math.abs(suma - 1)).toBeLessThan(1e-9);
  });
});
