# Estación 6 — Tarea: Scaffolding agencial del Agente IA ABAP

📦 **Los entregables de esta estación viven dentro del proyecto central**, no en esta carpeta.

Proyecto: [`../../Agente-IA-Desarrollo-ABAP/`](../../Agente-IA-Desarrollo-ABAP/)

---

## Checklist Estación 6 vs. estado del proyecto

El runbook pide cuatro entregables. Estos son los apuntadores reales en el repo:

| Entregable Estación 6 | Ubicación en el proyecto | Estado |
|---|---|---|
| **1. Ficha del arnés y modelo(s)** | [`docs/arnes/ficha-claude-code.md`](../../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md) | ✅ |
| **2. `AGENTS.md` / `CLAUDE.md` actualizados** | [`AGENTS.md`](../../Agente-IA-Desarrollo-ABAP/AGENTS.md) · [`CLAUDE.md`](../../Agente-IA-Desarrollo-ABAP/CLAUDE.md) | ✅ |
| **3. `PRODUCT.md` y `DESIGN.md`** | N/A — el producto no tiene UI propia, opcionales según runbook §3 | — |
| **4. Lista de validaciones disponibles** | Sección "Validación" de la ficha de arnés | ✅ |

---

## Pila de diseño agencial aplicada

La Estación 6 propone una pila de 4 capas. Cómo se materializa en este producto:

| Capa | Concepto general | En este proyecto |
|---|---|---|
| **Skills** | Hábitos del agente | `.claude/skills/template-alv/` (reportes ALV) · `.agents/skills/custom-codereview-guide.md` (AI PR Review) |
| **`PRODUCT.md`** | Criterio (audiencia, propósito, tono) | Cubierto por [`prd.md`](../../Agente-IA-Desarrollo-ABAP/prd.md) — el PRD ya incluye personas, tono y propósito |
| **`DESIGN.md`** | Memoria visual (tokens, componentes) | N/A — sin UI |
| **Lint** | Hace revisable el estándar | Linter de markdown vía `.markdownlint-cli2.yaml` en `aidlc-rules/` |

---

## Material didáctico de la estación

El material del curso queda en la carpeta padre `Estacion-6/`:

- `../README.md` — guía general.
- `../estacion6-runbook.md` — runbook para preparar el repo.
- `../design-standards-live-demo.md` — guion del live coding.
- `../prompts.md` — prompts para instalar skills de diseño.
- `../slides/estacion6-slides.md` — storyboard de slides.
