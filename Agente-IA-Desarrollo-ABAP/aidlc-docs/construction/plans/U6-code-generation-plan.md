# Code Generation Plan — U6 (Skill `template-alv`)

**Fecha**: 2026-05-20
**Unidad**: U6
**Insumos**: `requirements.md` IS11 (modificado por AD4) · `application-design/components.md` § C6 · `unit-of-work.md` § U6

---

## Dependencias

- ✅ U1 (CLAUDE.md — referenciado para buenas prácticas SAP §5).
- ⚠️ U3, U4 referencian este skill — pero U3/U4 ya están construidos sin depender de su contenido (sólo del nombre).

---

## Plan de generación

- [x] **Paso 1** — Crear `.claude/skills/template-alv/SKILL.md` con:
  - Frontmatter YAML: `name: template-alv`, `description` con triggers de activación contextual (palabras clave: "reporte ALV", "ALV", "SALV", "CL_GUI_ALV_GRID", "lista interactiva", "field catalog").
  - Cuerpo del skill en español cubriendo:
    1. Propósito del skill.
    2. Cuándo se activa.
    3. Patrón canónico de clase para reporte ALV: `ZCL_RPT_<nombre>` con métodos `select_data`, `process_data`, `display_alv`.
    4. Field catalog mínimo: tipos, columnas, formato.
    5. Variantes de display (sort, filter, layout, exportación).
    6. Patrón de pantalla de selección.
    7. Manejo de eventos básicos (PAI/PBO en SALV moderno).
    8. Ejemplos de código (snippets) para cada método clave.
    9. Anti-patrones específicos de ALV (qué NO usar).

- [x] **Paso 2** — Crear `aidlc-docs/construction/U6/code/U6-summary.md` con archivos generados, trazabilidad, compliance.

---

## Compliance Security Baseline

| Regla | Aplicabilidad | Cumplimiento previsto |
|---|---|---|
| SECURITY-01, 02, 04 | N/A | N/A |
| SECURITY-03 (sin PII en outputs) | Aplicable | Los ejemplos de código del skill no contienen datos reales |
| SECURITY-09 (SQL injection) | Aplicable indirectamente — los snippets de `select_data` usan campos explícitos | Compliant — los ejemplos siguen convenciones de CLAUDE.md §5.1 |
| SECURITY-10 (AUTHORITY-CHECK) | Aplicable indirectamente — los snippets muestran cómo incluir AUTHORITY-CHECK donde aplica | Compliant — los ejemplos incluyen el patrón de chequeo |

---

## Esfuerzo estimado

~15 minutos.

---

## Resumen

2 archivos: el skill `SKILL.md` (pieza pequeña pero crítica para UC1 — reporte ALV) + summary U6. Sin sub-agente ni slash command; el skill se activa por contexto.
