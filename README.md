# AI Learning Journey — Curso Hardcore AI 30X (Cohorte 2)

Repositorio con notas, laboratorios y entregables prácticos de mi formación en **Inteligencia Artificial aplicada al desarrollo de software**.

Programa intensivo organizado en **9 estaciones progresivas** que van desde la concepción de un producto hasta su puesta en operación con IaC, precedidas por una **Nivelación** de fundamentos.

---

## 🎯 Proyecto central del curso

📁 [`Agente-IA-Desarrollo-ABAP/`](Agente-IA-Desarrollo-ABAP/)

A lo largo de las 9 estaciones se construyó **un único producto real**: un **Agente IA para Desarrollo ABAP** que toma documentos funcionales (FD — el documento de especificación de negocio que entrega el consultor funcional) y los transforma en código ABAP listo para auditoría humana, dentro de Claude Code.

El proyecto está en la raíz porque es transversal a todo el curso. Las carpetas `Estacion-N/` contienen el material didáctico de cada sesión más el README detallado de mi recorrido.

---

## Índice rápido — navegación

| # | Carpeta | Tema | README detallado |
|---|---|---|---|
| 0 | [`Nivelación/`](Nivelación/) | 6 PDFs de fundamentos (IA generativa, ingeniería moderna, MCP, skills) | [Nivelación/README.md](Nivelación/README.md) |
| 1 | [`Estacion-1/`](Estacion-1/) | Product Vision Board / Internal Solution Brief | [Estacion-1/README.md](Estacion-1/README.md) |
| 2 | [`Estacion-2/`](Estacion-2/) | Co-crear el PRD con IA (3 prompts secuenciales) | [Estacion-2/README.md](Estacion-2/README.md) |
| 3 | [`Estacion-3/`](Estacion-3/) | Ingeniería de Software Agéntica (Claude Code, OpenCode, Antigravity) | [Estacion-3/README.md](Estacion-3/README.md) |
| 4 | [`Estacion-4/`](Estacion-4/) | AI-DLC Inception — Diseñar el QUÉ | [Estacion-4/README.md](Estacion-4/README.md) |
| 5 | [`Estacion-5/`](Estacion-5/) | AI-DLC Construction — Diseñar el CÓMO | [Estacion-5/README.md](Estacion-5/README.md) |
| 6 | [`Estacion-6/`](Estacion-6/) | Scaffolding y mapa agencial (ficha de arnés, AGENTS.md) | [Estacion-6/README.md](Estacion-6/README.md) |
| 7 | [`Estacion-7/`](Estacion-7/) | Orquestación, AI PR Review y memoria evolutiva | [Estacion-7/README.md](Estacion-7/README.md) |
| 8 | [`Estacion-8/`](Estacion-8/) | QA con IA: BDD, Persona + Juez y reporte consolidado | [Estacion-8/README.md](Estacion-8/README.md) |
| 9 | [`Estacion-9/`](Estacion-9/) | Producción y Operación: IaC con Terraform e IA generativa | [Estacion-9/README.md](Estacion-9/README.md) |

> Cada `Estacion-N/README.md` tiene la misma estructura: metadatos · tema y objetivo · conceptos clave · material del curso · mi entrega · aporte al proyecto central · lecciones.

---

## Mi recorrido — qué hice, dónde quedó, con quién

| # | Mi aporte concreto al proyecto | Entregable principal | Instructor |
|---|---|---|---|
| 0 | Lectura de 6 PDFs fundamentales | Vocabulario base | Material self-paced |
| 1 | Definí ISB del caso ABAP + research del problema | [`Estacion-1/Tarea/`](Estacion-1/Tarea/) | José Alanya (tutoría) |
| 2 | Co-creé PRD v1.0 (13 segmentos, 746 líneas) con paso 0 de conflictos | [`Estacion-2/Tarea/specs/prd.md`](Estacion-2/Tarea/specs/prd.md) | Hardcore AI 30X (material) |
| 3 | Configuré repo agent-ready: `AGENTS.md`, `CLAUDE.md`, 5 skills, sub-agente, 6 MCPs, ejemplos end-to-end | [`Estacion-3/Tarea/`](Estacion-3/Tarea/) | Carlos Alarcón |
| 4 | AI-DLC Inception completa (6 actividades, U1..U6) | [`Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/`](Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/) | Christian Braatz |
| 5 | AI-DLC Construction (functional design, NFR, build & test con 53 verificaciones) | [`Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/) | Christian Braatz |
| 6 | Ficha de arnés Claude Code + `AGENTS.md` neutral multi-tool | [`Agente-IA-Desarrollo-ABAP/docs/arnes/`](Agente-IA-Desarrollo-ABAP/docs/arnes/) | Leonardo González |
| 7 | Planning wave OpenSymphony + AI PR Review advisory + memoria evolutiva | [`Agente-IA-Desarrollo-ABAP/docs/tasks/`](Agente-IA-Desarrollo-ABAP/docs/tasks/) | Leonardo González |
| 8 | Suite QA: 3 feature files BDD (24 escenarios) + 3 rúbricas + Jueces M1/M2/M3 + Persona Consultor + reporte consolidado go/no-go | [`Agente-IA-Desarrollo-ABAP/qa/`](Agente-IA-Desarrollo-ABAP/qa/) | Andrés Caicedo |
| 9 | ADR-002 (no IaC cloud, sí IaC del repo GitHub) + Terraform con provider `integrations/github` (3 módulos: repo + branch-protection + labels) + skill `iac` + validate.sh con drift detection | [`Agente-IA-Desarrollo-ABAP/infra/`](Agente-IA-Desarrollo-ABAP/infra/) · [`Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md`](Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md) | Andrés Caicedo |

---

## Cómo navegar este repo

- **Para ver el producto terminado** → entrá a [`Agente-IA-Desarrollo-ABAP/`](Agente-IA-Desarrollo-ABAP/) y leé su [`README.md`](Agente-IA-Desarrollo-ABAP/README.md).
- **Para ver el recorrido didáctico** → entrá a cualquier `Estacion-N/README.md`. Están escritos como una bitácora con el mismo formato.
- **Para entender el PRD del producto** → [`Agente-IA-Desarrollo-ABAP/prd.md`](Agente-IA-Desarrollo-ABAP/prd.md).
- **Para entender cómo opera Claude Code en el proyecto** → [`Agente-IA-Desarrollo-ABAP/CLAUDE.md`](Agente-IA-Desarrollo-ABAP/CLAUDE.md) + [`Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md`](Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md).
- **Para ver el estado AI-DLC** → [`Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md`](Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md).
- **Para ver la cola de trabajo pendiente (CR-001)** → [`Agente-IA-Desarrollo-ABAP/docs/tasks/`](Agente-IA-Desarrollo-ABAP/docs/tasks/).
- **Para incorporar una estación nueva** → en Claude Code, abrir este repo y ejecutar `/cerrar-estacion <N> "<tema>"`. El flujo está en [`docs/CHECKLIST-NUEVA-ESTACION.md`](docs/CHECKLIST-NUEVA-ESTACION.md) y la plantilla en [`docs/PLANTILLA-ESTACION-README.md`](docs/PLANTILLA-ESTACION-README.md).

---

## Visión general del curso

El curso combina material teórico (PDFs), manuales prácticos (Markdown), ejercicios hands-on y un proyecto real. La columna vertebral son tres herramientas (**Claude Code**, **OpenCode/Cursor**, **Antigravity**) sobre tres patrones de contexto (**AGENTS.md**, **CLAUDE.md** y **settings.json + hooks**).

**Principios transversales**:

- **Context Engineering > Prompt Engineering** (80% del resultado viene del contexto).
- **Spec-Driven Development** como antídoto contra el vibe coding.
- **Delegación inteligente** — saber cuándo usar sub-agentes, sesiones paralelas o criterio humano.
- **Trazabilidad y auditoría** integradas en cada artefacto.

---

## Estado del proyecto

| Aspecto | Estado |
|---|---|
| Workflow AI-DLC | ✅ CERRADO (Inception + Construction completas) |
| CR-001 (Validador multi-formato) | ✅ **Cerrado** (2026-06-01, 4/4 APROBADO `.md`/`.txt`/`.pdf`/`.docx` — ver [capsule](Agente-IA-Desarrollo-ABAP/docs/memory/capsules/2026-06-01-cr-001-retest.md)) |
| Pipeline funcional | ✅ M1 → M2 → M3 + orquestador `/pipeline-abap` |
| Sub-agentes | ✅ `validador-fd`, `fd-a-td`, `td-a-codigo` |
| AI PR Review | ✅ Workflow productivo en `.github/workflows/ai-pr-review.yml` con `anthropics/claude-code-action@v1` (SHA pinned) · ⚠️ Pendiente sólo configuración en GitHub UI: secret `CLAUDE_CODE_OAUTH_TOKEN`, branch protection, label `review-this` ([guía](Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md)) |
| Memoria evolutiva | ✅ Plantillas + dry-run + **4 capsules reales** (`ai-pr-review-setup`, `qa-llm-real-w1`, `ai-pr-review-smoke-test`, `cr-001-retest` — 2026-06-01) · backlog `docs-evolution-proposal.md` con PROP-001..009 `pending` + PROP-010/011 `merged` |
| Plan de evaluación pre-piloto | ✅ Diseñado · ✅ Operativizado (suite QA ejecutable en `qa/` — Estación 8) |
| Suite de QA (BDD + Persona + Juez + reporte go/no-go) | ✅ Construida · ✅ **Corrida real contra LLM** (2026-06-01, 22/23 verdes, $0 USD vía CLI con suscripción — ver [capsule](Agente-IA-Desarrollo-ABAP/docs/memory/capsules/2026-06-01-qa-llm-real-w1.md)) · ✅ **CI workflow** ([`.github/workflows/qa.yml`](.github/workflows/qa.yml)) — 2 jobs (`test-agents` con LLM real + `test-lib` puro) · ⚠️ Pendiente: golden dataset real anonimizado |
| IaC del repo GitHub (Estación 9) | ✅ Decidida vía [ADR-002](Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md) (no infra cloud, sí gestión del repo como código) · ✅ Terraform con provider `integrations/github` v6.12.1 (3 módulos: repo + branch-protection + labels) · ✅ `fmt + init + validate` limpios sin warnings (Terraform v1.15.5) · ⚠️ Pendiente: `plan/apply` real (requiere `GITHUB_TOKEN` con scopes `repo` + `admin:org`) |

---

## Stack técnico

Solo herramientas y plataformas usadas en el repo. Los frameworks/metodologías (AI-DLC, OpenSymphony, MCP, DDD, BDD, etc.) viven en [`docs/FRAMEWORKS.md`](docs/FRAMEWORKS.md).

- **Arneses de código**: Claude Code (principal), Cursor, OpenCode, Antigravity, Codex (referencias).
- **Modelos**: Claude Opus 4.x, Sonnet 4.6, Haiku 4.5.
- **IDE / Editor**: VS Code, Cursor, Eclipse for ABAP Development Tools.
- **Stack del caso ABAP** (producto central): SAP S/4HANA Cloud, ABAP OO, ALV (`CL_SALV_TABLE`), BAdI, SmartForms.
- **Stack del caso EntreVista AI** (ejemplo del instructor): AWS Lambda, MongoDB Atlas, Pinecone, Telegram Bot API.
- **Stack de QA** (Estación 8): Playwright + playwright-bdd, Anthropic SDK (Persona + Juez ejecutables), tsx, golden datasets en JSON.
- **Stack de IaC** (Estación 9): Terraform v1.15.5 + provider `integrations/github` v6.12.1; LocalStack referenciado pero no aplica (provider GitHub, no AWS).
- **Control de versiones**: Git, GitHub.

---

## Referencias profundas

Para no inflar este README, el material de referencia vive en archivos dedicados:

- 📖 **[Vocabulario IA / agentic](docs/VOCABULARIO.md)** — 42 siglas + 62 términos del dominio IA, agentes, especificación, orquestación y QA, ordenados alfabéticamente. Vocabulario SAP/ABAP del producto vive en [`Agente-IA-Desarrollo-ABAP/CLAUDE.md`](Agente-IA-Desarrollo-ABAP/CLAUDE.md).
- 🧰 **[Frameworks y metodologías](docs/FRAMEWORKS.md)** — qué es, para qué sirve y cuándo elegir cada framework usado en el curso: PVB · ISB · PRD prompt-driven · AI-DLC · Open Spec · Spec Kit · C4 Model · ADR · DDD · BDD · TDD · Persona + Juez · MoSCoW · JTBD · ReAct · Context Engineering · SDD · OpenSymphony · MCP. Cierra con tabla *"qué framework usar en cada momento"*.

---

## Recursos externos del curso

- Codelab (Estación 3): https://harcoreai.carlos-alarcon.com/
- Claude Code: https://code.claude.com/docs
- Anthropic Skills: https://github.com/anthropics/skills
- AI-DLC framework: https://github.com/awslabs/aidlc-workflows
- C4 Model: https://c4model.com
- ADR examples: https://adr.github.io
- Gherkin: https://cucumber.io/docs/gherkin/reference/
- Antigravity: https://antigravity.google/docs
- `anthropics/claude-code-action` (action oficial usada por `.github/workflows/ai-pr-review.yml` y `qa.yml`): https://github.com/anthropics/claude-code-action
