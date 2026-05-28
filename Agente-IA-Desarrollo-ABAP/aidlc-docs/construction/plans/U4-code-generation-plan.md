# Code Generation Plan — U4 (Módulo 3: TD → Código ABAP)

**Fecha**: 2026-05-20
**Unidad**: U4
**Insumos**: `requirements.md` FR-M3-01..12 · `application-design/components.md` § C4 · `construction/U4/functional-design/*` · `construction/U4/nfr-requirements/*` · `construction/U4/nfr-design/*`

---

## Dependencias

- ✅ U1 (CLAUDE.md + docs/checklist-auditoria-codigo-ia.md + buenas prácticas SAP §5).
- ✅ U2, U3 (en runtime — M3 espera TD aprobado por humano post-M2).
- ✅ Functional Design U4 aprobado.
- ✅ NFR Requirements U4 aprobado.
- ✅ NFR Design U4 aprobado.
- ⏳ U6 (skill template-alv) — no existe todavía; el sub-agente lo invoca por convención.

---

## Plan de generación

- [x] **Paso 1** — Crear `.claude/agents/td-a-codigo.md` (sub-agente):
  - Frontmatter: `name: td-a-codigo`, `description` orientada a invocación por orquestador post-M2, `tools: Read, Glob, Grep, Write`.
  - System prompt en español con secciones derivadas del Functional Design + NFR Design:
    - §1 Rol y entradas (TD aprobado, req-id, modo).
    - §2 Flujo principal (verificación §8 → identificación → riesgos → estructura → buenas prácticas → marcadores → validaciones → output).
    - §3 Verificación de §8 del TD entrante con respuesta canónica de rechazo (BR-01).
    - §4 Identificación de zonas de riesgo (5 categorías).
    - §5 Estructura del `.abap` con plantilla literal (Q2:C blocks + Q5:A cabecera de 4 bloques).
    - §6 Aplicación de buenas prácticas SAP (referencia a CLAUDE.md §5).
    - §7 Skill ALV con activación explícita + fallback (Q4:B / BR-08).
    - §8 Persistencia condicional + versionado de regeneraciones (BR-10, BR-11).
    - §9 Ciclo de retroalimentación + límite 2 ciclos + escalamiento manual (BR-12).
    - §10 Sin generación de tests + recordatorio canónico al pie (Q3:A / BR-13).
    - **§11 Pre-Output Checklist (LC3, Q1:B)** — 10 checks explícitos a ejecutar antes del output.
    - **§12 Lista ampliada de datos sensibles (LC5, Q1:B)** — 7 categorías con tablas específicas.
    - §13 BR-01..16.
    - **§14 Anti-patrones (LC4)** — lista explícita.
    - §15 Heurística SLA self-reported (LC6, Q2:B) — criterios de complejidad del TD.
    - §16 Mantenibilidad: responsabilidad única por método público (Q4:B / NFR-U4-MAINT-02).

- [x] **Paso 2** — Crear `.claude/commands/generar-abap.md` (slash command):
  - Frontmatter con `description` y `argument-hint: <ruta-td> [req-id]`.
  - Lógica:
    1. Parsear argumentos.
    2. Validar ruta del TD.
    3. Crear directorio `outputs/<fecha>/<req-id>/` si hay `req-id`.
    4. Invocar al sub-agente `td-a-codigo` via tool `Agent` con:
       - Ruta del TD.
       - `req-id` si fue pasado.
       - Instrucción "Estás siendo invocado directamente — aplica las verificaciones de §3 (BR-01) sobre el TD entrante".
       - Si hay regeneración detectable (archivo `codigo.abap` o `codigo-vN.abap` ya existe en `outputs/<fecha>/<req-id>/`), pasar también la versión previa para BR-11/BR-12 tracking.
    5. Imprimir el `.abap` generado en chat.
    6. Confirmar persistencia.
    7. Resumen al final con próximos pasos: importar a Eclipse, syntax check, pruebas unitarias, checklist auditoría, transporte.

- [x] **Paso 3** — Crear `aidlc-docs/construction/U4/code/U4-summary.md` con archivos generados, trazabilidad, compliance.

---

## Compliance Security Baseline (esperado)

| Regla | Estado esperado |
|---|---|
| SECURITY-01 (encryption) | N/A — sin data stores |
| SECURITY-02 (red) | N/A |
| SECURITY-03 (sin PII en outputs) | **Compliant** — Pre-Output Checklist checks 5 y 6 |
| SECURITY-04 (HTTP headers) | N/A |
| SECURITY-09 (SQL injection) | **Compliant** — Pre-Output Checklist checks 1, 2, 4; LC5 + LC1 prompt |
| SECURITY-10 (AUTHORITY-CHECK) | **Compliant** — Pre-Output Checklist check 3 + LC5 lista ampliada (Q1:B) |

---

## Esfuerzo estimado

~25–35 minutos. U4 es el sub-agente más grande del producto (~12–15 KB).

---

## Resumen

3 archivos: sub-agente `td-a-codigo` (núcleo del producto, encapsula 16 secciones), slash command `/generar-abap` (front del modo directo), summary U4 (trazabilidad). El sub-agente concentra todas las decisiones de Functional Design + NFR Requirements + NFR Design.
