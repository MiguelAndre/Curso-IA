# AI Learning Journey — Curso Hardcore AI 30X (Cohorte 2)

Repositorio con notas, laboratorios y entregables prácticos de mi formación en **Inteligencia Artificial aplicada al desarrollo de software**.

Programa intensivo organizado en **7 estaciones progresivas** que van desde la concepción de un producto hasta su orquestación con agentes, precedidas por una **Nivelación** de fundamentos.

---

## 🎯 Proyecto central del curso

📁 [`Agente-IA-Desarrollo-ABAP/`](Agente-IA-Desarrollo-ABAP/)

A lo largo de las 7 estaciones se construyó **un único producto real**: un **Agente IA para Desarrollo ABAP** que toma documentos funcionales (FD) y los transforma en código ABAP listo para auditoría humana, dentro de Claude Code.

Cada estación aportó una capa al mismo producto:

| Estación | Aporte concreto al producto |
|---|---|
| 1 | ISB cuantificado + research del caso real |
| 2 | PRD v1.0 (13 segmentos, 746 líneas) |
| 3 | Repo agent-ready: `AGENTS.md`, `CLAUDE.md`, skills, sub-agente, MCPs, ejemplos end-to-end |
| 4 | AI-DLC Inception completo (6 actividades, U1..U6) |
| 5 | AI-DLC Construction (functional design, NFR, build & test con 53 verificaciones) |
| 6 | Ficha de arnés Claude Code · `AGENTS.md` neutral multi-tool |
| 7 | Orquestación OpenSymphony, AI PR Review advisory, memoria evolutiva |

El proyecto está en la raíz porque es transversal a todo el curso. Las carpetas `Estacion-N/` contienen el material didáctico de cada sesión más el README detallado de mi recorrido.

---

## Índice rápido

| # | Carpeta | Tema | Mi recorrido detallado |
|---|---|---|---|
| 0 | [`Nivelación/`](Nivelación/) | 6 PDFs de fundamentos (IA generativa, ingeniería moderna, MCP, skills) | [`Nivelación/README.md`](Nivelación/README.md) |
| 1 | [`Estacion-1/`](Estacion-1/) | Product Vision Board / Internal Solution Brief | [`Estacion-1/README.md`](Estacion-1/README.md) |
| 2 | [`Estacion-2/`](Estacion-2/) | Co-crear el PRD con IA (3 prompts secuenciales) | [`Estacion-2/README.md`](Estacion-2/README.md) |
| 3 | [`Estacion-3/`](Estacion-3/) | Ingeniería de Software Agéntica (Claude Code, OpenCode, Antigravity) | [`Estacion-3/README.md`](Estacion-3/README.md) |
| 4 | [`Estacion-4/`](Estacion-4/) | AI-DLC Inception — Diseñar el QUÉ | [`Estacion-4/README.md`](Estacion-4/README.md) |
| 5 | [`Estacion-5/`](Estacion-5/) | AI-DLC Construction — Diseñar el CÓMO | [`Estacion-5/README.md`](Estacion-5/README.md) |
| 6 | [`Estacion-6/`](Estacion-6/) | Scaffolding y mapa agencial (ficha de arnés, AGENTS.md) | [`Estacion-6/README.md`](Estacion-6/README.md) |
| 7 | [`Estacion-7/`](Estacion-7/) | Orquestación, AI PR Review y memoria evolutiva | [`Estacion-7/README.md`](Estacion-7/README.md) |

> Cada `Estacion-N/README.md` tiene la misma estructura: metadatos · tema y objetivo · conceptos clave · material del curso · mi entrega · aporte al proyecto central · lecciones.

---

## Cómo navegar este repo

- **Si querés ver el producto terminado** → entrá a [`Agente-IA-Desarrollo-ABAP/`](Agente-IA-Desarrollo-ABAP/) y leé su [`README.md`](Agente-IA-Desarrollo-ABAP/README.md).
- **Si querés ver el recorrido didáctico** → entrá a cualquier `Estacion-N/README.md`. Están escritos como una bitácora con el mismo formato.
- **Si querés entender el PRD del producto** → [`Agente-IA-Desarrollo-ABAP/prd.md`](Agente-IA-Desarrollo-ABAP/prd.md).
- **Si querés entender cómo opera Claude Code en el proyecto** → [`Agente-IA-Desarrollo-ABAP/CLAUDE.md`](Agente-IA-Desarrollo-ABAP/CLAUDE.md) + [`Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md`](Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md).
- **Si querés ver el estado AI-DLC** → [`Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md`](Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md).
- **Si querés ver la cola de trabajo pendiente (CR-001)** → [`Agente-IA-Desarrollo-ABAP/docs/tasks/`](Agente-IA-Desarrollo-ABAP/docs/tasks/).

---

## Visión general del curso

El curso combina material teórico (PDFs), manuales prácticos (Markdown), ejercicios hands-on y un proyecto real. La columna vertebral son tres herramientas (**Claude Code**, **OpenCode/Cursor**, **Antigravity**) sobre tres patrones de contexto (**AGENTS.md**, **CLAUDE.md** y **settings.json + hooks**).

**Principios transversales**:

- **Context Engineering > Prompt Engineering** (80% del resultado viene del contexto).
- **Spec-Driven Development** como antídoto contra el vibe coding.
- **Delegación inteligente** — saber cuándo usar sub-agentes, sesiones paralelas o criterio humano.
- **Trazabilidad y auditoría** integradas en cada artefacto.

---

## Matriz de progresión

| Estación | Qué hice | Entregable principal |
|---|---|---|
| Nivelación | Lectura de 6 PDFs fundamentales | Vocabulario base |
| **Estación 1** | Definí ISB del caso ABAP + research | [`Estacion-1/Tarea/`](Estacion-1/Tarea/) |
| **Estación 2** | Co-creé PRD v1.0 con paso 0 de conflictos | [`Estacion-2/Tarea/specs/prd.md`](Estacion-2/Tarea/specs/prd.md) |
| **Estación 3** | Configuré agente + 5 skills + sub-agente + 6 MCPs | [`Estacion-3/Tarea/`](Estacion-3/Tarea/) |
| **Estación 4** | AI-DLC Inception completa (6 actividades) | [`Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/`](Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/) |
| **Estación 5** | AI-DLC Construction sobre U1..U6 + build & test | [`Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/) |
| **Estación 6** | Ficha de arnés + AGENTS.md neutral | [`Agente-IA-Desarrollo-ABAP/docs/arnes/`](Agente-IA-Desarrollo-ABAP/docs/arnes/) |
| **Estación 7** | Planning wave OpenSymphony + AI PR Review + memoria | [`Agente-IA-Desarrollo-ABAP/docs/tasks/`](Agente-IA-Desarrollo-ABAP/docs/tasks/) |

---

## Estado del proyecto

| Aspecto | Estado |
|---|---|
| Workflow AI-DLC | ✅ CERRADO (Inception + Construction completas) |
| CR-001 (Validador multi-formato) | 🟡 Implementado, re-test pendiente — planning wave creada |
| Pipeline funcional | ✅ M1 → M2 → M3 + orquestador `/pipeline-abap` |
| Sub-agentes | ✅ `validador-fd`, `fd-a-td`, `td-a-codigo` |
| AI PR Review | ✅ Setup creado · ⚠️ secrets/vars/SHA pinning en GitHub pendientes |
| Memoria evolutiva | ✅ Plantillas y dry-run · capsules reales al cerrar primer issue |
| Plan de evaluación pre-piloto | ✅ Diseñado (ejecución en Día 1–30 del PRD) |

---

## Tecnologías y herramientas

- **Arneses**: Claude Code (principal), Cursor, OpenCode, Antigravity, Codex (referencias).
- **Protocolos**: MCP (Model Context Protocol).
- **Frameworks de especificación**: PVB, ISB, PRD prompt-driven, **AI-DLC v0.1.8** (AWS Labs).
- **Orquestación**: OpenSymphony, Linear.
- **Modelos**: Claude Opus 4.x, Sonnet 4.6, Haiku 4.5.
- **Stack del caso ABAP**: SAP S/4HANA Cloud, ABAP OO, ALV, BAdI, SmartForms.
- **Stack del caso EntreVista AI (ejemplo del instructor)**: AWS Lambda, MongoDB Atlas, Pinecone, Telegram Bot API.
- **Control de versiones**: Git, GitHub.

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

---

## Instructores

| Estación | Instructor |
|---|---|
| Nivelación | Material self-paced |
| Estación 1 | José Alanya (tutoría) |
| Estación 2 | Hardcore AI 30X (material) |
| Estación 3 | Carlos Alarcón |
| Estación 4 | Christian Braatz |
| Estación 5 | Christian Braatz |
| Estación 6 | Leonardo González |
| Estación 7 | Leonardo González |
