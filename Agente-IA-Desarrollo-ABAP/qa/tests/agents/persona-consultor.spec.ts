import { test, expect } from '@playwright/test';
import { generarFd, type Mutacion, type SolicitudFd } from './persona-consultor';
import { invocarValidadorFd } from '../steps/runner';
import { juzgarOutputValidador, type GroundTruthM1 } from './juez-m1';

interface CasoPersona {
  nombre: string;
  solicitud: SolicitudFd;
  esperado: {
    veredicto: 'APROBADO' | 'RECHAZADO';
    /** Reglas CE-XX/CS-XX que el output del validador debe mencionar. */
    reglas_esperadas: string[];
    /** D1 mínimo del Juez (corrección del veredicto). */
    D1_min: number;
    /** Smoke checks sobre el FD generado (regex que debe / no debe matchear). */
    smoke?: {
      debe_contener?: RegExp[];
      no_debe_contener?: RegExp[];
    };
  };
}

const CASOS: CasoPersona[] = [
  {
    nombre: 'control — FD limpio sin mutaciones',
    solicitud: {
      dominio: 'compras',
      titulo: 'Reporte de pedidos abiertos por proveedor',
      tipo_objeto: 'REPORTE_ALV',
      mutaciones: [],
      req_id: 'REQ-PERSONA-CTRL',
    },
    esperado: {
      veredicto: 'APROBADO',
      reglas_esperadas: [],
      D1_min: 4,
      smoke: {
        debe_contener: [
          /#+ .*Objetivo/i,
          /#+ .*Alcance/i,
          /#+ .*Reglas de Negocio/i,
          /#+ .*Tablas SAP/i,
          /#+ .*Criterios de Aceptaci[oó]n/i,
          /#+ .*Casos Borde/i,
          /#+ .*Autorizaciones/i,
        ],
      },
    },
  },
  {
    nombre: 'mutación estructural — omitir Autorizaciones y Casos Borde',
    solicitud: {
      dominio: 'ventas',
      titulo: 'Reporte de facturas vencidas por cliente',
      tipo_objeto: 'REPORTE_ALV',
      mutaciones: ['omitir-autorizaciones', 'omitir-casos-borde'],
      req_id: 'REQ-PERSONA-EST',
    },
    esperado: {
      veredicto: 'RECHAZADO',
      reglas_esperadas: ['CE-06', 'CE-07'],
      D1_min: 4,
      smoke: {
        no_debe_contener: [
          /^#+ .*Autorizaciones/im,
          /^#+ .*Casos Borde/im,
        ],
      },
    },
  },
  {
    nombre: 'mutación semántica — Objetivo vago y CA no verificables',
    solicitud: {
      dominio: 'materiales',
      titulo: 'Listado de materiales por centro',
      tipo_objeto: 'REPORTE_ALV',
      mutaciones: ['objetivo-vago', 'ca-no-verificables'],
      req_id: 'REQ-PERSONA-SEM',
    },
    esperado: {
      veredicto: 'RECHAZADO',
      reglas_esperadas: ['CS-01', 'CS-05'],
      D1_min: 4,
    },
  },
  {
    nombre: 'mutación BR-14 — tablas descriptivas no técnicas',
    solicitud: {
      dominio: 'finanzas',
      titulo: 'Reporte de partidas abiertas de clientes',
      tipo_objeto: 'REPORTE_ALV',
      mutaciones: ['tablas-descriptivas-no-tecnicas'],
      req_id: 'REQ-PERSONA-BR14',
    },
    esperado: {
      veredicto: 'RECHAZADO',
      reglas_esperadas: ['CS-04'],
      D1_min: 3,
    },
  },
];

test.describe('Persona Consultor → M1 → Juez M1 (mutation testing)', () => {
  test.setTimeout(300_000);

  for (const caso of CASOS) {
    test(caso.nombre, async () => {
      // 1. Persona genera el FD con las mutaciones pedidas.
      const fd = await generarFd(caso.solicitud);

      // 2. Smoke checks sobre el FD generado — separan errores de la Persona de errores de M1.
      expect(fd.length, 'FD vacío o demasiado corto').toBeGreaterThan(300);
      expect(fd).toMatch(/^#\s+FD/);
      if (caso.esperado.smoke?.debe_contener) {
        for (const re of caso.esperado.smoke.debe_contener) {
          expect(fd, `FD no contiene patrón ${re}`).toMatch(re);
        }
      }
      if (caso.esperado.smoke?.no_debe_contener) {
        for (const re of caso.esperado.smoke.no_debe_contener) {
          expect(fd, `FD contiene patrón ${re} cuando NO debería`).not.toMatch(re);
        }
      }

      // 3. M1 procesa el FD generado por la Persona.
      const validacion = await invocarValidadorFd(fd);

      // 4. Veredicto esperado.
      expect(
        validacion.veredicto,
        `M1 emitió ${validacion.veredicto}, esperaba ${caso.esperado.veredicto}.\nFD generado:\n${fd}\n\nOutput M1:\n${validacion.output}`,
      ).toBe(caso.esperado.veredicto);

      // 5. Si se espera rechazo, las reglas esperadas deben aparecer en el reporte de gaps.
      for (const regla of caso.esperado.reglas_esperadas) {
        expect(
          validacion.output,
          `M1 rechazó pero no reportó la regla ${regla} (mutación deliberada). Output:\n${validacion.output}`,
        ).toMatch(new RegExp(regla, 'i'));
      }

      // 6. Juez M1 evalúa el comportamiento del validador.
      const gt: GroundTruthM1 =
        caso.esperado.veredicto === 'RECHAZADO'
          ? {
              tipo: 'CON_DEVOLUCION',
              motivos: caso.solicitud.mutaciones.map((m) => `Mutación deliberada: ${m}`),
            }
          : { tipo: 'SIN_DEVOLUCION' };

      const sc = await juzgarOutputValidador({
        fd_id: caso.solicitud.req_id ?? caso.nombre,
        fd_content: fd,
        output_validador: validacion.output,
        ground_truth: gt,
        modelo_evaluado: process.env.QA_MODEL ?? 'claude-sonnet-4-6',
      });

      expect(
        sc.scores.D1_correccion_veredicto,
        `Juez asignó D1=${sc.scores.D1_correccion_veredicto}, esperaba ≥ ${caso.esperado.D1_min}. Razonamiento: ${sc.razonamiento}`,
      ).toBeGreaterThanOrEqual(caso.esperado.D1_min);
    });
  }

  test('la Persona aplica las mutaciones de forma determinista (temperature=0)', async () => {
    const solicitud: SolicitudFd = {
      dominio: 'logística',
      titulo: 'Reporte de entregas atrasadas',
      tipo_objeto: 'REPORTE_ALV',
      mutaciones: ['omitir-autorizaciones'],
      req_id: 'REQ-DETERMINISMO',
    };
    const [fd1, fd2] = await Promise.all([generarFd(solicitud), generarFd(solicitud)]);
    // Con temperature=0 y mismos inputs, los dos outputs deben ser idénticos.
    expect(fd1).toBe(fd2);
  });
});
