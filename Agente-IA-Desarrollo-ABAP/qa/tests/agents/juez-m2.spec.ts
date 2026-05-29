import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { juzgarOutputFdATd, PESOS_M2 } from './juez-m2';
import type { ScorecardM2 } from './juez-m2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FDS_DIR = join(__dirname, '..', 'fixtures', 'fds');
const TDS_DIR = join(__dirname, '..', 'fixtures', 'td-outputs');

function leer(dir: string, nombre: string): string {
  return readFileSync(join(dir, nombre), 'utf8');
}

interface CasoCalibracionM2 {
  fd_id: string;
  fd: string;
  td: string;
  esperado: {
    D2: [number, number];
    D3: [number, number];
    D5?: [number, number];
    score: [number, number];
    castigar?: Array<'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7'>;
    contiene_codigo_abap?: boolean;
  };
}

const CASOS: CasoCalibracionM2[] = [
  {
    fd_id: 'caso-1-td-bueno',
    fd: leer(FDS_DIR, 'fd-completo-alv.md'),
    td: leer(TDS_DIR, 'td-bueno.md'),
    // TD ejemplar: factualidad alta, todas las RN mapeadas, §8 sustanciosa, §9 con pregunta concreta.
    esperado: {
      D2: [4, 5],
      D3: [4, 5],
      D5: [4, 5],
      score: [4.0, 5.0],
      contiene_codigo_abap: false,
    },
  },
  {
    fd_id: 'caso-2-td-pobre',
    fd: leer(FDS_DIR, 'fd-completo-alv.md'),
    td: leer(TDS_DIR, 'td-pobre.md'),
    // TD malo: inventa ZTBL_PROVEEDORES_EXT, BAPI_MATERIAL_GET_LIST_BY_VENDOR (no existe),
    // omite RN2 y RN3, §8 trivial, §9 "Ninguno" sin justificación, contiene código ABAP compilable.
    esperado: {
      D2: [1, 2],
      D3: [1, 2],
      score: [1.0, 2.8],
      castigar: ['D2', 'D3', 'D4', 'D7'],
      contiene_codigo_abap: true,
    },
  },
  {
    fd_id: 'caso-3-td-mediocre',
    fd: leer(FDS_DIR, 'fd-contradiccion.md'),
    td: leer(TDS_DIR, 'td-mediocre.md'),
    // TD borderline: factualidad OK, RNs mapeadas, pero §9 dice "Ninguno" ignorando
    // la contradicción RN1 (incluir todos los activos) vs CB1 (excluir bloqueados ventas).
    // Castigo claro en D5.
    esperado: {
      D2: [3, 5],
      D3: [3, 5],
      D5: [1, 2],
      score: [2.5, 4.0],
      castigar: ['D5'],
    },
  },
];

test.describe('Calibración del Juez de M2', () => {
  test.setTimeout(180_000);

  for (const caso of CASOS) {
    test(`${caso.fd_id} — dimensiones y score dentro del rango esperado`, async () => {
      const sc: ScorecardM2 = await juzgarOutputFdATd({
        fd_id: caso.fd_id,
        fd_content: caso.fd,
        td_output: caso.td,
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

      checkRango(sc.scores.D2_factualidad, caso.esperado.D2, 'D2');
      checkRango(sc.scores.D3_completitud_rn, caso.esperado.D3, 'D3');
      if (caso.esperado.D5) checkRango(sc.scores.D5_tbds, caso.esperado.D5, 'D5');
      checkRango(sc.score_ponderado, caso.esperado.score, 'score_ponderado');

      if (caso.esperado.castigar) {
        const dimKey: Record<string, keyof ScorecardM2['scores']> = {
          D1: 'D1_tipo_objeto',
          D2: 'D2_factualidad',
          D3: 'D3_completitud_rn',
          D4: 'D4_decisiones_supuestos',
          D5: 'D5_tbds',
          D6: 'D6_estructura',
          D7: 'D7_limpieza',
        };
        for (const dim of caso.esperado.castigar) {
          expect(
            sc.scores[dimKey[dim]],
            `El Juez no castigó ${dim}. Razonamiento: ${sc.razonamiento}`,
          ).toBeLessThanOrEqual(3);
        }
      }

      if (caso.esperado.contiene_codigo_abap !== undefined) {
        expect(
          sc.contiene_codigo_abap,
          `Detección de código ABAP incorrecta. Razonamiento: ${sc.razonamiento}`,
        ).toBe(caso.esperado.contiene_codigo_abap);
      }
    });
  }

  test('un TD bueno obtiene score estrictamente mayor que uno pobre sobre el mismo FD', async () => {
    const fd = leer(FDS_DIR, 'fd-completo-alv.md');

    const [bueno, pobre] = await Promise.all([
      juzgarOutputFdATd({
        fd_id: 'diferenciador-bueno',
        fd_content: fd,
        td_output: leer(TDS_DIR, 'td-bueno.md'),
      }),
      juzgarOutputFdATd({
        fd_id: 'diferenciador-pobre',
        fd_content: fd,
        td_output: leer(TDS_DIR, 'td-pobre.md'),
      }),
    ]);

    expect(
      bueno.score_ponderado,
      `El Juez NO diferencia calidad. bueno=${bueno.score_ponderado}, pobre=${pobre.score_ponderado}.\nRazonamiento bueno: ${bueno.razonamiento}\nRazonamiento pobre: ${pobre.razonamiento}`,
    ).toBeGreaterThan(pobre.score_ponderado);

    // Diferencia mínima esperada — castigos múltiples deberían producir gap holgado.
    expect(bueno.score_ponderado - pobre.score_ponderado).toBeGreaterThanOrEqual(1.5);
  });

  test('un TD con alucinaciones detectables nunca obtiene D2 ≥ 4 (sin falsos negativos en factualidad)', async () => {
    const sc = await juzgarOutputFdATd({
      fd_id: 'sin-falsos-negativos-d2',
      fd_content: leer(FDS_DIR, 'fd-completo-alv.md'),
      td_output: leer(TDS_DIR, 'td-pobre.md'),
    });
    expect(
      sc.scores.D2_factualidad,
      `D2 = ${sc.scores.D2_factualidad}. Objetos no verificables detectados: ${sc.objetos_no_verificables.join(', ') || 'ninguno'}. Razonamiento: ${sc.razonamiento}`,
    ).toBeLessThanOrEqual(3);
    expect(
      sc.objetos_no_verificables.length,
      'El Juez no listó ningún objeto no verificable a pesar del castigo a D2',
    ).toBeGreaterThan(0);
  });

  test('los pesos suman 1.0 (consistencia de la rúbrica)', () => {
    const suma = Object.values(PESOS_M2).reduce((a, b) => a + b, 0);
    expect(Math.abs(suma - 1)).toBeLessThan(1e-9);
  });
});
