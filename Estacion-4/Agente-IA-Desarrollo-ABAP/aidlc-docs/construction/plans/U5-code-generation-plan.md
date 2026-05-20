# Code Generation Plan — U5 (Orquestador `/pipeline-abap`)

**Fecha**: 2026-05-20
**Unidad**: U5
**Insumos**: `requirements.md` FR-OR-01..03, IS8 · `application-design/components.md` § C5 · `application-design/services.md` §1 · `unit-of-work.md` § U5

---

## Dependencias

- ✅ U1 (CLAUDE.md + docs).
- ✅ U2 (sub-agente `validador-fd` invocable).
- ✅ U3 (sub-agente `fd-a-td` invocable).
- ✅ U4 (sub-agente `td-a-codigo` invocable).
- ✅ U6 (skill `template-alv` activable por contexto cuando aplica).
- Decisión Q1:A de Application Design: orquestador es slash command que invoca sub-agentes via tool `Agent`.

---

## Plan de generación

- [x] **Paso 1** — Crear `.claude/commands/pipeline-abap.md` (slash command orquestador):
  - Frontmatter con `description` y `argument-hint: <ruta-fd> <req-id>`.
  - Lógica:
    1. **Parsear argumentos** (ambos obligatorios para el pipeline completo).
    2. **Validar ruta del FD**.
    3. **Crear directorio** `outputs/<fecha>/<req-id>/`.
    4. **Persistir copia del FD** en `outputs/<fecha>/<req-id>/fd.md` para trazabilidad.
    5. **Etapa M1 — Validador**:
       - Invocar `validador-fd` via tool `Agent` con el FD.
       - Imprimir el reporte de validación.
       - Persistir como `validacion.md`.
       - Si RECHAZADO → detener pipeline, mensaje al usuario, fin.
       - Si APROBADO → **gate humano**: pausa explícita, pregunta al usuario "¿Continuar al Módulo 2 (FD→TD)?". Espera confirmación.
    6. **Etapa M2 — FD → TD**:
       - Invocar `fd-a-td` via tool `Agent` con el FD aprobado y `req-id`.
       - Imprimir el TD generado.
       - Confirmar persistencia de `td.md`.
       - **Gate humano**: pausa, pregunta "¿Continuar al Módulo 3 (TD→Código)? ¿O pides regenerar el TD con feedback?". Espera confirmación.
    7. **Etapa M3 — TD → Código**:
       - Invocar `td-a-codigo` via tool `Agent` con el TD aprobado y `req-id`.
       - Imprimir el código ABAP generado.
       - Confirmar persistencia de `codigo.abap`.
    8. **Resumen final** con todos los archivos persistidos + próximos pasos (importar, syntax check, tests, checklist, transporte).

- [x] **Paso 2** — Crear `aidlc-docs/construction/U5/code/U5-summary.md` con archivos generados, trazabilidad, compliance.

---

## Aspectos críticos del orquestador

| Aspecto | Implementación |
|---|---|
| **Gates humanos obligatorios** | Pausa entre M1→M2 y M2→M3 (FR-OR-02, Principio #6) |
| **Detención en M1 rechazado** | El orquestador NO invoca M2 si M1 devolvió RECHAZADO (FR-OR-03, Principio #2) |
| **Sin modo autopilot** | Cada gate exige confirmación humana explícita en chat |
| **Persistencia consolidada** | Todos los archivos del pipeline en una sola carpeta `outputs/<fecha>/<req-id>/` |
| **Resumen al cierre** | Lista clara de qué se generó + próximos pasos |
| **Regeneración desde gate M2** | Si el usuario pide ajustes al TD, el orquestador re-invoca `fd-a-td` con feedback |

---

## Compliance Security Baseline

| Regla | Aplicabilidad | Cumplimiento previsto |
|---|---|---|
| SECURITY-01, 02, 04 | N/A | N/A |
| SECURITY-03 (sin PII en outputs) | Aplicable indirecto — propaga lo que generen los sub-agentes | Compliant — cada sub-agente ya cumple SECURITY-03; el orquestador no agrega contenido |
| SECURITY-09, 10 | Aplicable indirecto — el código final lo genera U4 | Compliant — el orquestador no genera código por sí mismo |

---

## Esfuerzo estimado

~15–20 minutos.

---

## Resumen

2 archivos: el slash command `/pipeline-abap` (orquestador completo del flujo FD→TD→Código con 3 gates humanos) + summary U5. Sin sub-agente nuevo — el comando coordina los 3 sub-agentes existentes.
