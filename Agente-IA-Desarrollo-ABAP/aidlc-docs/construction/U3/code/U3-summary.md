# U3 — Code Generation Summary

**Fecha**: 2026-05-19
**Unidad**: U3 — Módulo 2: FD → TD
**Plan**: `aidlc-docs/construction/plans/U3-code-generation-plan.md`

---

## Archivos generados

### Creados (3)

| Path | Tamaño aprox. | Tipo | Trazabilidad |
|---|---|---|---|
| `.claude/agents/fd-a-td.md` | ~10 KB | Sub-agente | FR-M2-01..10, IS3, BR-01..15 (U3), 3 modos (normal/directo/reverse) |
| `.claude/commands/generar-td.md` | ~3.5 KB | Slash command | IS6, modo directo Q1:B, persistencia condicional Q5:A |
| `aidlc-docs/construction/U3/code/U3-summary.md` | este archivo | Documentación AI-DLC | resumen unidad |

---

## Trazabilidad detallada

### Requirements (`requirements.md`) cubiertos por U3

| ID | Cumplido por |
|---|---|
| IS3 | `.claude/agents/fd-a-td.md` |
| IS6 | `.claude/commands/generar-td.md` |
| FR-M2-01 (rechaza FD no aprobado) | sub-agente §8 BR-02 (en modo directo emite AVISO; en orquestador asume aprobación) |
| FR-M2-02 (identifica tipo objeto) | sub-agente §3 (6 tipos + heurísticas) |
| FR-M2-03 (lista objetos SAP) | sub-agente §4 (tablas, FMs, BAdIs, clases) |
| FR-M2-04 (propone arquitectura) | sub-agente §5 (clase + métodos + flujo) |
| FR-M2-05 (campos y flujo) | sub-agente §7 TD §5 (Pantalla selección, estructuras, output) |
| FR-M2-06 (Decisiones y Supuestos) | sub-agente §7 TD §8 + BR-04 |
| FR-M2-07 (marca TBD) | sub-agente §7 TD §9 + BR-05 |
| FR-M2-08 (no genera código) | sub-agente §13 BR-03 + §14 anti-patrones |
| FR-M2-09 (template ALV) | sub-agente §10 — activación explícita + fallback (Q4:B) |
| FR-M2-10 (regeneración con feedback) | sub-agente §12 + BR-11 (versionado `td-vN.md`) |

### Functional Design U3 → Code

| Artefacto FD | Materialización en código |
|---|---|
| `business-logic-model.md` §2 (flujo) | sub-agente §2 (numeración 1..12) |
| `business-logic-model.md` §3 (tipo objeto) | sub-agente §3 |
| `business-logic-model.md` §4 (objetos SAP + anti-alucinación) | sub-agente §4 + BR-14 |
| `business-logic-model.md` §5 (arquitectura) | sub-agente §5 |
| `business-logic-model.md` §6 (mapeo RN) | sub-agente §6 |
| `business-logic-model.md` §7 (9 secciones TD) | sub-agente §7 (template literal) |
| `business-logic-model.md` §8 (modo directo) | sub-agente §8 |
| `business-logic-model.md` §9 (reverse engineering) | sub-agente §9 |
| `business-logic-model.md` §10 (skill ALV) | sub-agente §10 |
| `business-logic-model.md` §11 (persistencia) | sub-agente §11 + slash command paso 3 y 5 |
| `business-logic-model.md` §12 (regeneración) | sub-agente §12 |
| `business-rules.md` BR-01..15 | sub-agente §13 |
| `domain-entities.md` E1..E9 | implícito en el system prompt |

---

## Compliance Security Baseline

| Regla | Estado | Justificación |
|---|---|---|
| SECURITY-01 (encryption) | N/A | U3 no introduce data stores. |
| SECURITY-02 (access logging en red) | N/A | U3 no introduce red. |
| SECURITY-03 (no PII en outputs) | Compliant | El TD describe objetos SAP por nombre técnico (MARA, KNA1, etc.), no copia valores literales. El sub-agente no transcribe datos sensibles. |
| SECURITY-04 (HTTP headers) | N/A | U3 no introduce endpoints. |
| SECURITY-09 (SQL injection) | N/A para U3 | El TD no genera SQL; eso es U4. |
| SECURITY-10 (AUTHORITY-CHECK) | N/A para U3 | El TD declara que se requiere AUTHORITY-CHECK pero no lo implementa; eso es U4. |

**Sin findings bloqueantes**. ✓

---

## Decisiones tomadas durante la generación

| # | Decisión | Justificación |
|---|---|---|
| 1 | Sub-agente con `tools: Read, Glob, Grep, Write` | `Write` necesario para persistir `td.md` y versiones. `Glob`/`Grep` permiten al sub-agente verificar existencia de archivos del dataset/templates. Sin `Bash`/`Edit`. |
| 2 | El slash command crea el directorio `outputs/<fecha>/<req-id>/` antes de invocar al sub-agente | Garantiza que el sub-agente pueda usar `Write` sin error. |
| 3 | La instrucción de "modo directo" se pasa **en el prompt** del Agent invocation, no como flag estructurado | Claude Code no soporta flags semánticos al sub-agente; el contrato se pasa por contexto. |
| 4 | Si el sub-agente persistió, el comando sólo confirma; si no, persiste el comando | Robustez: el archivo termina siempre persistido aunque el sub-agente olvide el paso. |
| 5 | Anti-patrones explícitos en §14 del sub-agente | Previene errores comunes del LLM (generar código de ejemplo, inventar nombres). |

---

## Pruebas manuales sugeridas (Build and Test)

1. **FD válido completo (REPORTE_ALV)** → TD con 9 secciones, métodos `select_data`/`process_data`/`display_alv`, sin TBDs.
2. **FD válido con autorización ambigua** → TD aprobado con TBD en §9 sobre objeto de autorización exacto.
3. **FD con `RN` inferida** → TD con `RN<n>` mapeada a un método específico, sin inventar FM.
4. **`/generar-td` directo con FD ok** → TD trae el AVISO de modo directo al inicio.
5. **`/generar-td` con archivo `.abap` legado** → TD trae cabecera "🔄 Modo Reverse Engineering" y RNs inferidas del código.
6. **Regeneración con feedback** → `td-v2.md` con cambio documentado en §8 referenciando v1.
7. **FD sin `<req-id>`** → solo chat, no persiste.

---

## Próxima unidad: U4 — Módulo 3: TD → Código ABAP

- Dependencia U1 ✓.
- Dependencia U3 ✓ (en runtime — M3 verifica que el TD trae §8 Decisiones y Supuestos).
- Stages previos para U4 (per execution-plan): **Functional Design + NFR Requirements + NFR Design** (sólo U4 lleva NFR stages).
