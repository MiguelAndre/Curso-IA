# Code Generation Plan — U2 (Módulo 1: Validador de FD)

**Fecha**: 2026-05-19
**Unidad**: U2
**Insumos**: `requirements.md` FR-M1-01..08 · `application-design/components.md` § C2 · `unit-of-work.md` § U2 · `construction/U2/functional-design/*` (business-logic-model.md, business-rules.md, domain-entities.md)

---

## Dependencias

- ✅ **U1 ya completada y aprobada**: `CLAUDE.md`, `docs/formato-fd-generico.md` referenciados por el sub-agente.
- ✅ Functional Design U2 aprobado.

---

## Plan de generación

- [x] **Paso 1** — Crear `.claude/agents/validador-fd.md` (sub-agente). Contenido:
  - Frontmatter YAML con `name`, `description` (corta, para que Claude Code lo invoque), `model` por defecto, `tools` mínimas (Read, Glob, Grep — necesarias para leer el FD y el formato genérico).
  - System prompt en español que implementa el sub-agente según:
    - Reglas CE-01..07 (completitud estructural) — `business-logic-model.md` §3
    - Reglas CS-01..09 (calidad semántica) — `business-logic-model.md` §4
    - Regla maestra de decisión — `business-logic-model.md` §5
    - Templates de output APROBADO/RECHAZADO — `business-logic-model.md` §6
    - 15 reglas de negocio (BR-01..15) — `business-rules.md`
    - Lenguaje no acusatorio — `business-logic-model.md` §8
    - Casos especiales (FD inline, idioma, no-FD) — `business-logic-model.md` §9
  - Referencias a `CLAUDE.md` (contexto) y `docs/formato-fd-generico.md` (contrato de entrada).

- [x] **Paso 2** — Crear `.claude/commands/validar-fd.md` (slash command). Contenido:
  - Frontmatter con `description` (visible en `/help`).
  - Prompt que recibe argumentos `<ruta-fd> [req-id]` y delega al sub-agente `validador-fd` via tool `Agent`.
  - Lógica de persistencia: si `req-id` está presente, persiste el output en `outputs/<fecha>-<req-id>/validacion.md`; si no, sólo imprime en chat.
  - Manejo de errores: si la ruta no existe, mensaje claro al usuario.

- [x] **Paso 3** — Crear summary en `aidlc-docs/construction/U2/code/U2-summary.md` con archivos generados, trazabilidad, compliance.

---

## Compliance Security Baseline

| Regla | Aplicabilidad a U2 | Cumplimiento previsto |
|---|---|---|
| SECURITY-01, 02, 04 | N/A — sin data stores, red, endpoints | N/A |
| SECURITY-03 (sin PII en outputs) | Aplicable — el reporte de validación puede mencionar datos del FD | Compliant: el validador refiere por sección, no copia data sensible literal |
| SECURITY-09, 10 | N/A para U2 — el validador no genera código | N/A en esta unidad |

---

## Esfuerzo estimado

~15–20 minutos.

---

## Resumen

2 archivos a generar (sub-agente + slash command) + 1 summary de unidad. El sub-agente es el núcleo de U2 — encapsula las 7 CE + 9 CS + 15 BR en un prompt operativo. El slash command es la fachada para el usuario.
