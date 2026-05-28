# Estación 5 — Tarea: Construction del Agente IA ABAP

📦 **Los entregables de esta estación viven dentro del proyecto central**, no en esta carpeta.

Ruta canónica: [`../../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](../../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/)

---

## Por qué los artefactos viven ahí

La fase **Construction** del AI-DLC es parte integral del producto, no del material didáctico. Mover una copia a `Estacion-5/Tarea/` duplicaría archivos y abriría espacio para divergencia. Esta carpeta es solo un **punto de entrada** que apunta al lugar real.

---

## Mapa de entregables Estación 5

Las 5 actividades de Construction se ejecutaron sobre 6 unidades (U1..U6). Esto es lo que produjo cada actividad y dónde encontrarla:

| Actividad | Artefacto | Ubicación |
|---|---|---|
| **01 — Diseño funcional** | `domain-entities.md` · `business-rules.md` · `business-logic-model.md` | `aidlc-docs/construction/U2..U4/functional-design/` |
| **02 — NFR Requirements** | `nfr-requirements.md` · `nfr-matrix.md` · `tech-stack-decisions.md` | `aidlc-docs/construction/U4/nfr-requirements/` |
| **03 — NFR Design (ADR)** | `nfr-design-patterns.md` · `logical-components.md` | `aidlc-docs/construction/U4/nfr-design/` |
| **04 — Infrastructure Design** | N/A — no aplica (producto sin infraestructura cloud) | — |
| **05 — Code Generation + Tests** | Sub-agentes + slash commands + skills | `aidlc-docs/construction/U1..U6/code/U*-summary.md` |
| **Build & Test (cierre)** | 5 docs + 53 verificaciones manuales | `aidlc-docs/construction/build-and-test/` |
| **Plans por unidad** | `U*-code-generation-plan.md` | `aidlc-docs/construction/plans/` |

---

## Estado actual

- **Workflow AI-DLC**: ✅ CERRADO el 2026-05-20.
- **Construction de las 6 unidades**: ✅ Completada.
- **Build & Test**: ✅ 53 verificaciones manuales documentadas.
- **CR-001 (U2 multi-formato)**: 🟡 Implementado, re-test pendiente — ver planning wave en [`../../Agente-IA-Desarrollo-ABAP/docs/tasks/`](../../Agente-IA-Desarrollo-ABAP/docs/tasks/).

---

## Material didáctico de la estación

El material del curso (runbook, slides) queda en la carpeta padre `Estacion-5/`:

- `../README.md` — guía general de la estación.
- `../estacion5-runbook.md` — runbook paso a paso de las 5 actividades.
- `../estacion5-diseñando-el-como.pdf` — slides.
