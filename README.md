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

## Vocabulario (IA / agentic)

> Solo términos del dominio IA, agentes, especificación y orquestación. Vocabulario SAP/ABAP del producto vive en [`Agente-IA-Desarrollo-ABAP/CLAUDE.md`](Agente-IA-Desarrollo-ABAP/CLAUDE.md).

### Siglas

| Sigla | Significado | Una línea |
|---|---|---|
| **ADR** | Architecture Decision Record | Documento corto con *Contexto · Decisión · Consecuencias* por cada decisión arquitectónica relevante. |
| **AI-DLC** | Artificial Intelligence Development Lifecycle | Framework de AWS Labs (v0.1.8) para especificación + construcción co-creada con agentes. |
| **API** | Application Programming Interface | Contrato técnico (HTTP) entre cliente y servidor. |
| **BDD** | Behavior-Driven Development | Especificar comportamiento con escenarios `Given–When–Then` (Gherkin) antes de codificar. |
| **C4** | Context · Container · Component · Code | Modelo de Simon Brown para diagramar arquitectura en 4 niveles. |
| **CI/CD** | Continuous Integration / Continuous Deployment | Pipeline automatizado de build + test + deploy. |
| **CLI** | Command-Line Interface | Interfaz por línea de comandos (ej. `claude` ejecutable). |
| **CR** | Change Request | Cambio sobre algo ya cerrado. Requiere re-ejecución parcial del workflow. |
| **DDD** | Domain-Driven Design | Modelado del software alineado con el dominio del negocio. Entities, Value Objects, Aggregates, Bounded Contexts. |
| **DoR / DoD** | Definition of Ready / Definition of Done | Criterios objetivos para entrar a / salir de una tarea. |
| **ICP** | Ideal Customer Profile | Perfil específico del cliente objetivo. |
| **IDE** | Integrated Development Environment | Editor con tooling integrado. |
| **IS** | Insumo (terminología AI-DLC) | Item del PRD trackeado uno a uno (IS-1..IS-N). |
| **ISB** | Internal Solution Brief | Plantilla de 9 segmentos para problemas internos corporativos. |
| **JSON-RPC** | JSON Remote Procedure Call | Protocolo de RPC sobre JSON. Base técnica de MCP. |
| **JTBD** | Jobs To Be Done | Marco que pregunta "¿qué trabajo contrata el usuario al producto?". |
| **KPI** | Key Performance Indicator | Métrica con baseline + target. |
| **LLM** | Large Language Model | Modelo neural que predice el siguiente token. Claude, GPT, etc. |
| **LSP** | Language Server Protocol | Análogo a MCP pero para editores ↔ language servers. Inspiración técnica de MCP. |
| **MCP** | Model Context Protocol | Protocolo abierto (JSON-RPC) que conecta hosts (Claude Code, Cursor) con servers de tools. |
| **MoSCoW** | Must · Should · Could · Won't | Priorización del MVP en el PRD. |
| **MVP** | Minimum Viable Product | Versión mínima entregable que valida la hipótesis. |
| **NFR** | Non-Functional Requirement | Requerimiento no funcional (performance, seguridad, escalabilidad). Debe tener valor numérico verificable. |
| **PBT** | Property-Based Testing | Testing basado en propiedades en lugar de ejemplos. Extensión opcional de AI-DLC. |
| **PII** | Personally Identifiable Information | Datos personales. Sensibles para seguridad y compliance. |
| **PR** | Pull Request | Propuesta de merge revisable en GitHub. |
| **PRD** | Product Requirements Document | Documento de producto co-creado con 13 segmentos. |
| **PVB** | Product Vision Board | Plantilla de 9 segmentos para productos de mercado. |
| **RAG** | Retrieval-Augmented Generation | Inyectar documentos externos en el contexto antes de generar, sin reentrenar. |
| **ReAct** | Reasoning + Acting | Patrón de loop agentic: pensar → planificar → ejecutar → observar → corregir. |
| **ROI** | Return on Investment | Justificación económica del proyecto. |
| **SDD** | Spec-Driven Development | Producir specs ejecutables antes de código. Antídoto contra el vibe coding. |
| **SDK** | Software Development Kit | Set de librerías para construir sobre una plataforma. |
| **SDLC** | Software Development Life Cycle | Ciclo de vida del software (planeación → diseño → implementación → testing → deploy → mantenimiento). |
| **SHA** | Secure Hash Algorithm | Hash criptográfico. Usado para *pinning* de acciones de GitHub a un commit específico. |
| **TBD** | To Be Determined / To Be Done | Marcador explícito de información pendiente. Mejor que inventar. |
| **TDD** | Test-Driven Development | Red → Green → Refactor. Tests primero, código después. |
| **UC** | Use Case | Caso de uso. |
| **UI/UX** | User Interface / User Experience | Diseño visual e interacción. |
| **UVP** | Unique Value Proposition | Por qué este producto y no otro. |
| **XDD** | DDD + BDD + TDD | "Extreme-Driven Design": combinación que sustenta AI-DLC. |

### Términos y conceptos

| Término | Para qué sirve / qué significa |
|---|---|
| **Agente** | Sistema autónomo que recibe un objetivo, planifica, ejecuta tools, observa y corrige hasta converger en un artefacto verificable (no en texto). |
| **Arnés** | Capa estable que envuelve el modelo: loop, permisos, tools, UI, contexto repo-local. Claude Code, OpenHands, Factory son arneses. El modelo (Opus, GPT) hace inferencia; el arnés decide cuándo y con qué. |
| **Aggregate** | Grupo de entidades con una raíz que garantiza consistencia transaccional (DDD). |
| **Audit trail** | Rastro auditable de qué decidió el agente y por qué. En este proyecto: `aidlc-state.md` + `audit.md` + sección "Decisiones y Supuestos" en cada output. |
| **Bounded Context** | Límite donde un modelo de dominio es válido (DDD). Previene la corrupción del modelo entre contextos diferentes. |
| **Business Logic Model** | Flujos E2E (login, refresh, etc.) con estados transicionales explícitos. Producido en Functional Design. |
| **Business Rule** | Regla numerada (`RULE-AUTH-01..N`) con condición · consecuencia · fuente. |
| **Capsule** | Unidad de memoria de un issue cerrado. Contiene decisión validada, invariant aparecido, validación útil, review feedback, docs impactadas. |
| **Codebase understanding** | Base de conocimiento viva sobre el repo. Construida con memory capsules + docs evolutivos. |
| **Context Engineering** | Diseñar el entorno (CLAUDE.md, AGENTS.md, hooks, permisos) en lugar de optimizar prompts individuales. Regla 80/20: el contexto produce 80% del resultado. |
| **Definition of Ready / Done** | Criterios objetivos para que una tarea pueda empezar (DoR) o cerrarse (DoD). |
| **Domain Entity** | Objeto con identidad única que persiste (ej. `Operator`). Concepto DDD. |
| **Dry-run** | Ejecutar un comando en modo simulación sin tocar el estado real. Útil para previsualizar `convert-tasks-to-linear apply` o `memory capture`. |
| **Evidence section** | Sección obligatoria del PR que documenta intención, comandos, output, AC cumplidos, riesgos. Sin ella, el AI PR Review falla. |
| **Evals** | Golden set de casos + rúbricas para medir calidad agentic (planning, tool selection, output format). |
| **Foundation model** | Modelo base masivo entrenado en datos generales (Claude, GPT, Gemini). Sirve para múltiples tareas. |
| **Gherkin** | Sintaxis de BDD: `Given <contexto> / When <acción> / Then <resultado>`. |
| **Hook** | Script en `.claude/hooks/` que ejecuta código real automáticamente tras una acción del agente (PostToolUse, PreToolUse). Garantía determinista, no recomendación. |
| **Harness** | Sinónimo en inglés de "arnés". Ver arriba. |
| **Insumo (IS)** | En AI-DLC: item específico del PRD que se trackea con ID a lo largo de toda la documentación. |
| **Instructor advisory** | Línea en CLAUDE.md que el agente *interpreta* ("debería tener en cuenta"). Recomendación, no garantía. Lo opuesto a un hook. |
| **Linear** | Gestor de tareas externo donde se publica la planning wave de OpenSymphony. |
| **Memory capture** | Acción de convertir un issue cerrado en capsule consultable. `opensymphony memory capture --dry-run` para previsualizar. |
| **Milestone** | Hito que agrupa varias tareas dentro de una planning wave. Tiene Definition of Done propia. |
| **Moat** | Ventaja defensible que perdura aunque alguien copie la idea. Tres tipos: Data Moat (datos únicos), Distribution Moat (canal embebido), Trust Moat (compliance/reliability). |
| **OpenSymphony** | Sistema de orquestación que convierte AI-DLC artifacts en planning waves publicables (Linear, GitHub Issues, etc.). |
| **Planning wave** | Paquete de trabajo coherente (manifest + milestones + task files) que se ejecuta como bloque. |
| **Proveedor** | Quién sirve la inferencia (Anthropic API, AWS Bedrock, OpenAI). Distinto del modelo y del arnés. |
| **Reverse engineering** | Modo de AI-DLC para entrar a un código existente (brownfield) y producir specs desde él. No usado en este proyecto (greenfield). |
| **Same-repo only** | Política de seguridad del AI PR Review: solo PRs internos disparan el workflow; PRs de forks no, para evitar exfiltración de secrets. |
| **Sandbox** | Entorno aislado donde correr el agente sin afectar producción. |
| **Sesión paralela** | Dos agentes en el mismo repo, en ramas/workspaces independientes. Antigravity soporta esto nativamente. |
| **Skill** | Módulo procedimental versionable que encapsula un patrón recurrente. Vive en `.claude/skills/<nombre>/SKILL.md` con frontmatter (`name`, `description`, `tools`). |
| **Slash command** | Trigger en Claude Code que invoca una skill o sub-agente: `/validar-fd`, `/generar-td`, `/pipeline-abap`. |
| **Sub-agente** | Agente especializado con rol, tools y modelo propios. Reside en `.claude/agents/<nombre>.md`. Permite delegación. |
| **Superficie de trabajo** | Dónde corre el arnés (CLI, IDE, web, cloud). |
| **Task file** | Archivo `00X-*.md` con frontmatter (id, milestone, blockedBy, etc.) y secciones Summary/Scope/Deliverables/AC/Test Plan/Context/DoR. |
| **Tool calling** | Capacidad del modelo de invocar funciones registradas (Read, Write, Bash, MCP servers, etc.). |
| **Ubiquitous Language** | Vocabulario compartido entre dev y experto de dominio (DDD). Aparece literal en el código. |
| **Unit of Work** | En AI-DLC: agrupación lógica de archivos/componentes que se construye, revisa y aprueba como bloque. En este proyecto: U1..U6. |
| **Value Object** | Objeto sin identidad, definido por su valor (`HashedPassword`, `JWTAccessToken`). Concepto DDD. |
| **Vibe coding** | Anti-patrón: codificar sin specs claras, "a sentimiento". Lo que SDD intenta eliminar. |
| **Workflow engine** | Componente que descompone intención en unidades operables. `create-implementation-plan` cumple esta función en OpenSymphony. |
| **Workspace Detection** | Primera actividad de AI-DLC Inception. Decide greenfield vs brownfield, idioma, extensiones, reverse engineering. |

---

## Frameworks y metodologías usados en el curso

Los frameworks aparecen en distintas estaciones. Acá cada uno con qué es, para qué sirve y dónde se usa en este repo.

### Frameworks de definición de producto

#### **Product Vision Board (PVB)** — Estación 1

Plantilla visual de **9 segmentos** para definir un producto orientado al mercado: Problema, Segmento target, Moat, Arena competitiva, UX paradigm, AI Decision Triangle, Modelo económico, Métricas, Riesgos. Apta para startups o ideas propias.

**Para qué sirve**: forzar decisiones explícitas sobre quién, qué y por qué, antes de cualquier código.

**Cuándo elegirlo**: producto pensado para venderse externamente o crear un mercado.

#### **Internal Solution Brief (ISB)** — Estación 1

Plantilla de **9 segmentos** equivalente al PVB pero para **problemas internos corporativos**: Problema de negocio · Stakeholders · Estado actual · Estado futuro · Criterios de éxito · Restricciones · Enfoque técnico · Riesgos · Límites de alcance.

**Para qué sirve**: justificar un proyecto interno con cuantificación dura y autorización de sponsor.

**Cuándo elegirlo**: caso interno corporativo (lo que usé para el caso ABAP).

#### **PRD prompt-driven (3 prompts secuenciales)** — Estación 2

Pipeline propio del curso: **Prompt 1 → PRD · Prompt 2 → Arquitectura · Prompt 3 → Backlog**. Cada prompt requiere aprobación humana segmento por segmento. Antes del Prompt 1 va un **paso 0 de análisis de conflictos** que resuelve ambigüedades en los inputs.

**Para qué sirve**: convertir research/ISB en PRD ejecutable de 13 segmentos sin retrabajo masivo.

**Cuándo elegirlo**: cuando el insumo (ISB/PVB + research) ya es estable y querés un PRD defendible.

### Frameworks de especificación ejecutable

#### **AI-DLC (Artificial Intelligence Development Lifecycle)** — Estaciones 4–5

Framework de **AWS Labs**, versión `v0.1.8` en este curso. Recorre Inception (6 actividades: Workspace Detection · Requirements · User Stories · Workflow Planning · Application Design · Units Generation) y Construction (5 actividades por unidad: Functional Design · NFR Requirements · NFR Design · Infrastructure Design · Code Generation + Tests). Combina DDD + BDD + TDD ("XDD").

**Para qué sirve**: producir specs ejecutables que un agente pueda implementar sin decidir cosas de dominio. Tiene audit trail integral (`aidlc-state.md`, `audit.md`).

**Cuándo elegirlo**: producto nuevo (greenfield) con agente co-creador y necesidad de trazabilidad total. Es el que se usa en este curso.

**Repo oficial**: https://github.com/awslabs/aidlc-workflows

#### **Open Spec** — mencionado en Estación 4 como alternativa

Framework **fluido e iterativo, brownfield-first**. Trabaja sobre código existente y produce specs incrementales.

**Para qué sirve**: refactors, migraciones o sistemas legacy donde no podés rehacer desde cero.

**Cuándo elegirlo**: hay código que ya funciona pero falta documentación viva que sirva al agente.

#### **Spec Kit** — mencionado en Estación 4 como alternativa

Framework donde **las specs sirven al código y el código sirve a las specs**: cada cambio actualiza ambos lados. Énfasis pedagógico.

**Para qué sirve**: equipos junior o contextos donde la claridad de spec es el bottleneck.

**Cuándo elegirlo**: cuando entrenar al equipo en pensamiento spec-first es prioridad.

### Frameworks de arquitectura

#### **C4 Model** — Estaciones 2 y 4

Modelo de **Simon Brown** para diagramar arquitectura en 4 niveles: **L1 System Context** (qué interactúa con el sistema) · **L2 Container** (componentes lógicos principales) · **L3 Component** (dentro de cada container) · **L4 Code** (clases, métodos).

**Para qué sirve**: comunicar arquitectura sin perderse en detalles ni quedarse demasiado alto.

**Cuándo usarlo**: en el PRD/arquitectura, antes de codificar. En este proyecto vive en `Agente-IA-Desarrollo-ABAP/entregables/c4-model.md`.

**Repo**: https://c4model.com

#### **ADR (Architecture Decision Record)** — Estación 5

Formato corto por decisión: **Contexto · Decisión · Consecuencias** (con ⚠️ obligatorio en Consecuencias para forzar trade-offs explícitos).

**Para qué sirve**: dejar rastro de por qué se eligió A sobre B, accesible meses después.

**Cuándo usarlo**: cada vez que una decisión arquitectónica tiene trade-offs y un agente futuro podría querer revisarla.

**Repo**: https://adr.github.io

### Frameworks de ingeniería del comportamiento

#### **DDD (Domain-Driven Design)** — Nivelación + Estación 5

Modelado del software alineado con el dominio del negocio. Conceptos: **Bounded Contexts**, **Ubiquitous Language**, **Entities**, **Value Objects**, **Aggregates**, **Domain Events**.

**Para qué sirve**: separar lógica de negocio de infraestructura. El vocabulario del dominio aparece literal en el código.

**Cuándo usarlo**: en Functional Design (Estación 5) cuando estás traduciendo reglas de negocio a estructuras de código.

#### **BDD (Behavior-Driven Development)** — Nivelación + Estación 2

Especificar comportamiento con **Gherkin** (`Given <contexto> / When <acción> / Then <resultado>`) en colaboración entre dev + QA + producto antes de codificar.

**Para qué sirve**: que los acceptance criteria sean ejecutables, no interpretables.

**Cuándo usarlo**: en User Stories (Estación 4) y Test Plans (Estaciones 5 y 7).

**Repo**: https://cucumber.io/docs/gherkin/reference/

#### **TDD (Test-Driven Development)** — Nivelación

Ciclo **Red → Green → Refactor**: test fallido → código mínimo que pasa → refactor con red de seguridad.

**Para qué sirve**: diseño desacoplado guiado por pruebas; documentación viva.

**Cuándo usarlo**: en Code Generation (Estación 5) y en cualquier feature donde el comportamiento sea verificable.

### Frameworks de priorización y planificación

#### **MoSCoW** — Estación 2

Priorización del scope del MVP: **Must · Should · Could · Won't**.

**Para qué sirve**: dejar explícito qué entra al MVP y qué se descarta (no "luego veremos").

**Cuándo usarlo**: §8 del PRD y al definir cada planning wave.

#### **JTBD (Jobs To Be Done)** — Estaciones 1 y 2

Marco que pregunta: *"¿qué trabajo contrata el usuario al producto?"*. Cambia el foco de features a outcomes.

**Para qué sirve**: que el problema esté centrado en el usuario, no en el producto.

**Cuándo usarlo**: §1 del PRD (One-liner + JTBD + Misión).

### Frameworks operativos del agente

#### **ReAct (Reasoning + Acting)** — Nivelación + Estación 3

Patrón del loop agentic: **Pensar → Planificar → Ejecutar → Observar → Corregir**. El agente alterna razonamiento y acción hasta convergencia.

**Para qué sirve**: que el agente sea verificable en cada paso (no caja negra).

**Cuándo usarlo**: implícito en Claude Code; visible vía `Bash(git diff)` + introspección entre acciones.

#### **Context Engineering** — Estación 3

Práctica de **diseñar el entorno** (CLAUDE.md, AGENTS.md, hooks, permisos) en lugar de optimizar prompts individuales. Regla 80/20: el contexto produce el 80% del resultado.

**Para qué sirve**: que el agente funcione consistentemente entre sesiones sin re-explicar todo cada vez.

**Cuándo usarlo**: en el bootstrap del repo (`AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`).

#### **Spec-Driven Development (SDD)** — transversal a todo el curso

Producir specs **ejecutables** antes de código. Antídoto contra el *vibe coding* (codificar a sentimiento).

**Para qué sirve**: que el agente tenga un contrato claro contra el que ejecutar; que el reviewer humano tenga un oracle contra el que validar.

**Cuándo usarlo**: siempre. Es la filosofía que sustenta AI-DLC, ISB/PVB, PRD, OpenSymphony.

### Frameworks de orquestación y operación

#### **OpenSymphony** — Estación 7

Sistema de orquestación que convierte artefactos AI-DLC en **planning waves publicables**: `task-package.yaml` + `milestones.md` + task files con contrato estándar (frontmatter `id/title/milestone/priority/estimate/blockedBy/blocks/parent` + secciones Summary/Scope/Deliverables/AC/Test Plan/Context/DoR).

**Para qué sirve**: pasar de "tengo specs aprobadas" a "tengo una cola en Linear con dependencias, milestones y AC". Incluye además: AI PR Review advisory (OpenHands), memoria evolutiva (`opensymphony memory`) y docs sync.

**Cuándo usarlo**: cuando hay un cambio sustantivo (CR, feature) que necesita coordinarse en una cola revisable. En este proyecto: planning wave `cr-001-u2-multiformato-revalidacion`.

**Skills incluidos**: `create-implementation-plan` (AI-DLC → task package) · `convert-tasks-to-linear` (task package → Linear).

#### **MCP (Model Context Protocol)** — Nivelación + Estación 3

Más que framework, es **protocolo abierto** (JSON-RPC 2.0) que estandariza la conexión entre hosts (Claude Code, Cursor, Claude Desktop) y servers de tools (GitHub, PostgreSQL, Context7, etc.). Análogo a LSP pero para agentes.

**Para qué sirve**: extender el agente con capacidades sin acoplarlo a integraciones específicas. Cambias de proveedor y los servers siguen funcionando.

**Cuándo usarlo**: cuando el agente necesita leer/escribir contra sistemas externos (GitHub Issues, base de datos, docs corporativos).

### Resumen — qué framework usar en cada momento

```text
Idea inicial            → PVB (mercado) o ISB (interno)               · Estación 1
Producto cuantificado   → PRD prompt-driven (3 prompts secuenciales)  · Estación 2
Arquitectura            → C4 Model + ADRs                              · Estación 2 + 5
Especificación nueva    → AI-DLC (greenfield)                          · Estación 4-5
Especificación legacy   → Open Spec / Spec Kit                         · Estación 4 (mencionados)
Modelado de dominio     → DDD                                          · Estación 5
Acceptance criteria     → BDD + Gherkin                                · Estación 4 (user stories)
Tests                   → TDD                                          · Estación 5
Priorización del MVP    → MoSCoW                                       · Estación 2
Bootstrap del agente    → Context Engineering                          · Estación 3
Loop del agente         → ReAct                                        · Estación 3 (implícito)
Tools del agente        → MCP                                          · Estación 3
Orquestación de cola    → OpenSymphony                                 · Estación 7
Filosofía transversal   → Spec-Driven Development                      · todas
```

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
