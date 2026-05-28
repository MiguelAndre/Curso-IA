# Code Generation Plan — U3 (Módulo 2: FD → TD)

**Fecha**: 2026-05-19
**Unidad**: U3
**Insumos**: `requirements.md` FR-M2-01..10 · `application-design/components.md` § C3 · `unit-of-work.md` § U3 · `construction/U3/functional-design/*`

---

## Dependencias

- ✅ U1 (CLAUDE.md, docs/formato-fd-generico.md).
- ✅ U2 (validador-fd existente — referenciable desde el AVISO de modo directo en BR-02).
- ✅ Functional Design U3 aprobado.
- ⏳ U6 (skill template-alv) — todavía no existe; el sub-agente lo invoca por convención (`Read .claude/skills/template-alv/SKILL.md`) y, si no existe en el sistema, sigue con su contexto base.

---

## Plan de generación

- [x] **Paso 1** — Crear `.claude/agents/fd-a-td.md` (sub-agente):
  - Frontmatter: `name: fd-a-td`, `description` orientada a invocación por orquestador, `tools: Read, Glob, Grep, Write` (Write para persistir el TD).
  - System prompt en español cubriendo:
    - Flujo principal (§2 de business-logic-model.md).
    - Identificación de tipo de objeto ABAP (§3).
    - Identificación de objetos SAP con BR-14 anti-alucinación (§4).
    - Diseño de arquitectura técnica (§5) — patrón ALV cuando aplica.
    - Mapeo RN → implementación (§6).
    - Estructura del TD con 9 secciones obligatorias (§7).
    - Modo directo con aviso (§8, Q1:B, BR-02).
    - Modo reverse engineering automático (§9, Q3:A, BR-09).
    - Skill `template-alv` activación explícita + fallback (§10, Q4:B, BR-08).
    - Persistencia condicional (§11, BR-10).
    - Ciclo de retroalimentación + versionado (§12, BR-11).
    - 15 BR completas.
    - No-objetivos (§13).

- [x] **Paso 2** — Crear `.claude/commands/generar-td.md` (slash command):
  - Frontmatter con `description` y `argument-hint: <ruta-fd-o-codigo> [req-id]`.
  - Lógica:
    1. Parsear argumentos (1 obligatorio + 1 opcional).
    2. Validar que la ruta exista.
    3. Invocar al sub-agente `fd-a-td` via tool `Agent` con:
       - Ruta del input.
       - `req-id` si fue pasado.
       - Flag implícito `invocado_directo=true` (porque este comando NO es el orquestador).
    4. Imprimir el TD completo en chat.
    5. Si `<req-id>` presente y el sub-agente persistió `td.md`, confirmar la ruta. Si no, persistir aquí con `Write`.
    6. Resumen al final con próximo paso (`/generar-abap`).

- [x] **Paso 3** — Crear `aidlc-docs/construction/U3/code/U3-summary.md` con archivos generados, trazabilidad, compliance.

---

## Compliance Security Baseline

| Regla | Aplicabilidad a U3 | Cumplimiento previsto |
|---|---|---|
| SECURITY-01, 02, 04 | N/A | N/A |
| SECURITY-03 (sin PII en outputs) | Aplica — el TD podría referenciar tablas y campos sensibles | Compliant: el TD describe objetos por nombre técnico (MARA, KNA1), no copia valores; respeta el formato no acusatorio heredado |
| SECURITY-09, 10 | N/A para U3 — no genera código ABAP | N/A en esta unidad |

---

## Esfuerzo estimado

~15–20 minutos.

---

## Resumen

2 archivos a generar (sub-agente + slash command) + 1 summary. El sub-agente es más complejo que U2 porque maneja 3 modos (normal / directo / reverse engineering) y delega contexto al skill ALV cuando aplica. El slash command es el front del modo directo (`Q1:B` → aviso al inicio del TD).
