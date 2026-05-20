# Code Generation Plan — U1 (Configuración Base & Documentación)

**Fecha**: 2026-05-19
**Unidad**: U1
**Insumos**: `requirements.md` (IS1, IS9, IS10, IS12, IS13, IS14, IS15 + FR-M4-* + FR-DOC-* + NFR-01/04/05/06/07/08), `application-design/components.md` (C1, C7, C8, C9, C10, C11), `unit-of-work.md`

**Nota sobre el tipo de proyecto**: U1 es "configuración + documentación" — no aplica el ciclo tradicional Business Logic / API Layer / Repository / Frontend / DB Migrations. La estructura del plan se adapta al tipo de artefactos que genera el producto.

---

## Stories/Requirements implementados por U1

Ver `unit-of-work-story-map.md` § U1 — 31 IDs cubiertos.

---

## Dependencias

- **Otras unidades**: ninguna (U1 es la base; todas las demás dependen de ella).
- **Archivos existentes**:
  - ✅ `.claude/settings.json` ya existe (greenfield para Estación 4, pero el archivo de settings ya tiene bloque `attribution`). Hay que **modificar in-place** preservando el bloque existente.
  - ✅ `prd.md`, `aidlc-rules/`, `aidlc-docs/` ya existen — no se tocan.

---

## Plan de generación (numerado)

- [x] **Paso 1** — Crear `CLAUDE.md` en la raíz del workspace con secciones:
  - Rol del agente (FR-M4-01)
  - 6 Principios No Negociables del PRD §6 como restricciones de sistema (FR-M4-01)
  - Prohibiciones explícitas: sin escritura SAP, sin transportes, sin ejecución, sin autopilot (FR-M4-02, NFR-06 vía documentación per AD3)
  - Formato obligatorio "Decisiones y Supuestos" en todos los outputs (FR-M4-03)
  - Marcador `⚠️ VERIFICAR:` para zonas de incertidumbre en código (FR-M4-04)
  - Idioma español obligatorio (FR-M4-07, NFR-01)
  - Buenas prácticas SAP genéricas: SQL optimizado, AUTHORITY-CHECK, ABAP OO con ZCL, ALV estándar, naming Z*/Y*, excepciones CX_* (FR-M4-05, FR-M4-09..14)
  - Referencia a `docs/formato-fd-generico.md` como contrato de entrada (FR-M4-06)
  - Referencia a `docs/checklist-auditoria-codigo-ia.md` para auditoría del código generado
  - Recordatorio del entregable final `.abap` para importación manual (FR-M4-08)
  - Convenciones de naming de outputs en `outputs/<fecha>-<req_id>/`

- [x] **Paso 2** — Crear `docs/formato-fd-generico.md` con (FR-DOC-01):
  - Secciones mínimas obligatorias: Objetivo, Alcance, Reglas de Negocio, Tablas SAP involucradas, Criterios de Aceptación, Casos Borde, Autorizaciones
  - Ejemplos de descripciones aceptables vs ambiguas para cada sección
  - Plantilla copyable que un consultor puede usar directamente

- [x] **Paso 3** — Crear `docs/checklist-auditoria-codigo-ia.md` con (FR-DOC-02, PRD §11.3, IS12):
  - Los 7 ítems mínimos del PRD §11.3 (existencia de tablas/módulos, AUTHORITY-CHECK, SELECT con campos específicos, sin SQL dinámico, condiciones de borde, naming, `⚠️ VERIFICAR` revisado)
  - Declaración explícita de responsabilidad: "Al marcar todos los ítems, el desarrollador asume garantía de calidad del código para transporte"

- [x] **Paso 4** — Crear `docs/plan-evaluacion.md` con (FR-DOC-03, PRD §11, IS13):
  - Criterios de selección del dataset (3–5 FDs históricos de complejidad media, FD original disponible, código en producción disponible)
  - Proceso de comparación (TD generado vs especificación real; código generado vs producción)
  - Métricas por módulo: M1 (sensibilidad, especificidad, precisión del reporte); M2 (factualidad, completitud, calidad de supuestos); M3 (compilabilidad, adherencia, correctitud, seguridad)
  - Formato del reporte de hallazgos
  - **Aclaración explícita**: en Estación 4 sólo se diseña; la ejecución va al Día 1–30 del Plan de Entrega del PRD §13

- [x] **Paso 5** — Crear `README.md` operativo con (FR-DOC-04, IS15, M8 del PRD):
  - Descripción corta del producto + referencia al PRD
  - Cómo abrir el proyecto en Claude Code
  - Cómo invocar cada slash command (`/validar-fd`, `/generar-td`, `/generar-abap`, `/pipeline-abap`)
  - Operacionalización paso a paso de los 5 casos de uso del PRD §5
  - Estructura del directorio `outputs/`
  - Troubleshooting básico: qué hacer si M1 rechaza, si M3 falla syntax check tras 2 ciclos
  - Referencia a documentos clave (CLAUDE.md, formato-fd, checklist, plan-evaluacion)

- [x] **Paso 6** — Modificar `.claude/settings.json` **in-place** preservando el bloque `attribution` (decisión AD3 — sin restricciones explícitas de permissions en settings; las restricciones operativas viven en CLAUDE.md). *Nota: JSON no admite comentarios; la referencia a AD3 queda en `application-design.md` y en este plan.*

- [x] **Paso 7** — Crear `.gitignore` agregando `outputs/` para evitar versionar TDs/códigos de requerimientos reales (NFR-08 — protección frente a versionado accidental de PII/secretos).

- [x] **Paso 8** — Crear resumen markdown en `aidlc-docs/construction/U1/code/U1-summary.md` documentando: archivos creados/modificados, trazabilidad a requirements, cumplimiento Security Baseline, próxima unidad.

---

## Compliance Security Baseline (extensión activa)

| Regla | Aplicabilidad a U1 | Cumplimiento |
|---|---|---|
| SECURITY-01 | N/A — sin data stores | N/A |
| SECURITY-02 | N/A — sin red | N/A |
| SECURITY-03 (no PII en outputs/logs) | Aplica — los docs no deben contener PII | Compliant: documentos genéricos sin datos reales |
| SECURITY-04 | N/A — sin endpoints | N/A |
| SECURITY-09 (SQL injection) | Aplica indirectamente — las buenas prácticas en CLAUDE.md prohíben SQL dinámico inseguro | Compliant vía FR-M4-09 en Paso 1 |
| SECURITY-10 (AUTHORITY-CHECK) | Aplica indirectamente — las buenas prácticas en CLAUDE.md exigen AUTHORITY-CHECK | Compliant vía FR-M4-10 en Paso 1 |
| Resto SECURITY-N | Por evaluar al revisar reglas completas | Pendiente — se evaluará en compliance summary final |

---

## Esfuerzo estimado

~30 minutos para los 8 pasos.

---

## Resumen

8 archivos a generar (7 nuevos + 1 modificación), todos de configuración/documentación. Sin código ejecutable en esta unidad. El output principal es **CLAUDE.md** (el corazón del producto) y los 4 documentos de referencia. Una vez aprobado U1, todas las demás unidades (U2..U6) pueden referenciarlo.
