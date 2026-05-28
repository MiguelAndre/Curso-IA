# Vocabulario — IA / agentic

Glosario de los términos del dominio de IA, agentes, especificación y orquestación usados a lo largo del curso. Cada entrada lleva una definición operativa corta.

> Vocabulario SAP / ABAP del producto vive en [`../Agente-IA-Desarrollo-ABAP/CLAUDE.md`](../Agente-IA-Desarrollo-ABAP/CLAUDE.md). Acá solo entran términos transferibles a cualquier proyecto.

---

## Siglas

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

---

## Términos y conceptos

> Orden alfabético estricto.

| Término | Para qué sirve / qué significa |
|---|---|
| **Aggregate** | Grupo de entidades con una raíz que garantiza consistencia transaccional (DDD). |
| **Agente** | Sistema autónomo que recibe un objetivo, planifica, ejecuta tools, observa y corrige hasta converger en un artefacto verificable (no en texto). |
| **Arnés** | Capa estable que envuelve el modelo: loop, permisos, tools, UI, contexto repo-local. Claude Code, OpenHands, Factory son arneses. El modelo (Opus, GPT) hace inferencia; el arnés decide cuándo y con qué. |
| **Audit trail** | Rastro auditable de qué decidió el agente y por qué. En este proyecto: `aidlc-state.md` + `audit.md` + sección "Decisiones y Supuestos" en cada output. |
| **Bounded Context** | Límite donde un modelo de dominio es válido (DDD). Previene la corrupción del modelo entre contextos diferentes. |
| **Business Logic Model** | Flujos E2E (login, refresh, etc.) con estados transicionales explícitos. Producido en Functional Design (AI-DLC). |
| **Business Rule** | Regla numerada (`RULE-AUTH-01..N`) con condición · consecuencia · fuente. |
| **Capsule** | Unidad de memoria de un issue cerrado. Contiene decisión validada, invariant aparecido, validación útil, review feedback, docs impactadas. |
| **Codebase understanding** | Base de conocimiento viva sobre el repo. Construida con memory capsules + docs evolutivos. |
| **Context Engineering** | Diseñar el entorno (CLAUDE.md, AGENTS.md, hooks, permisos) en lugar de optimizar prompts individuales. Regla 80/20: el contexto produce 80% del resultado. |
| **Definition of Ready / Done** | Criterios objetivos para que una tarea pueda empezar (DoR) o cerrarse (DoD). |
| **Domain Entity** | Objeto con identidad única que persiste (ej. `Operator`). Concepto DDD. |
| **Dry-run** | Ejecutar un comando en modo simulación sin tocar el estado real. Útil para previsualizar `convert-tasks-to-linear apply` o `memory capture`. |
| **Evals** | Golden set de casos + rúbricas para medir calidad agentic (planning, tool selection, output format). |
| **Evidence section** | Sección obligatoria del PR que documenta intención, comandos, output, AC cumplidos, riesgos. Sin ella, el AI PR Review falla. |
| **Foundation model** | Modelo base masivo entrenado en datos generales (Claude, GPT, Gemini). Sirve para múltiples tareas. |
| **Gherkin** | Sintaxis de BDD: `Given <contexto> / When <acción> / Then <resultado>`. |
| **Harness** | Sinónimo en inglés de "Arnés". Ver entrada Arnés. |
| **Hook** | Script en `.claude/hooks/` que ejecuta código real automáticamente tras una acción del agente (PostToolUse, PreToolUse). Garantía determinista, no recomendación. |
| **Instructor advisory** | Línea en CLAUDE.md que el agente *interpreta* ("debería tener en cuenta"). Recomendación, no garantía. Lo opuesto a un hook. |
| **Insumo (IS)** | En AI-DLC: item específico del PRD que se trackea con ID a lo largo de toda la documentación. |
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
