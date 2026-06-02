# Frameworks, protocolos y prácticas usados en el curso

Cada uno con qué es, para qué sirve, cuándo usarlo y dónde se aplica en este repo.

> Los **tres patrones de contexto** del curso (`AGENTS.md`, `CLAUDE.md` y `settings.json + hooks`) no son frameworks externos sino convenciones de Claude Code y arneses compatibles. Su explicación operativa aparece en [Context Engineering](#context-engineering--estación-3) y en la entrada [Arnés del vocabulario](VOCABULARIO.md#términos-y-conceptos).

---

## Filosofía transversal

### Spec-Driven Development (SDD) — transversal a todo el curso

Producir specs **ejecutables** antes de código. Antídoto contra el *vibe coding* (codificar a sentimiento). Es la filosofía que sustenta todo el resto del curso.

**Para qué sirve**: que el agente tenga un contrato claro contra el que ejecutar; que el reviewer humano tenga un oracle objetivo contra el que validar.

**Cuándo usarlo**: siempre. Es el paraguas que cubre AI-DLC, ISB/PVB, PRD prompt-driven, OpenSymphony.

---

## Frameworks de definición de producto

### Product Vision Board (PVB) — Estación 1

Plantilla visual de **9 segmentos** para definir un producto orientado al mercado: Problema, Segmento target, Moat, Arena competitiva, UX paradigm, AI Decision Triangle, Modelo económico, Métricas, Riesgos. Apta para startups o ideas propias.

**Para qué sirve**: forzar decisiones explícitas sobre quién, qué y por qué, antes de cualquier código.

**Cuándo usarlo**: producto pensado para venderse externamente o crear un mercado.

### Internal Solution Brief (ISB) — Estación 1

Plantilla de **9 segmentos** equivalente al PVB pero para **problemas internos corporativos**: Problema de negocio · Stakeholders · Estado actual · Estado futuro · Criterios de éxito · Restricciones · Enfoque técnico · Riesgos · Límites de alcance.

**Para qué sirve**: justificar un proyecto interno con cuantificación dura y autorización de sponsor.

**Cuándo usarlo**: caso interno corporativo (lo que se usó para el caso ABAP).

### PRD prompt-driven (3 prompts secuenciales) — Estación 2

Pipeline propio del curso: **Prompt 1 → PRD · Prompt 2 → Arquitectura · Prompt 3 → Backlog**. Cada prompt requiere aprobación humana segmento por segmento. Antes del Prompt 1 va un **paso 0 de análisis de conflictos** que resuelve ambigüedades en los inputs.

**Para qué sirve**: convertir research/ISB en PRD ejecutable de 13 segmentos sin retrabajo masivo.

**Cuándo usarlo**: cuando el insumo (ISB/PVB + research) ya es estable y se busca un PRD defendible.

---

## Frameworks de especificación ejecutable

### AI-DLC (Artificial Intelligence Development Lifecycle) — Estaciones 4–5

Framework de **AWS Labs**, versión `v0.1.8` en este curso. Recorre Inception (6 actividades: Workspace Detection · Requirements · User Stories · Workflow Planning · Application Design · Units Generation) y Construction (5 actividades por unidad: Functional Design · NFR Requirements · NFR Design · Infrastructure Design · Code Generation + Tests). Combina DDD + BDD + TDD ("XDD").

**Para qué sirve**: producir specs ejecutables que un agente pueda implementar sin decidir cosas de dominio. Tiene audit trail integral (`aidlc-state.md`, `audit.md`).

**Cuándo usarlo**: producto nuevo (greenfield) con agente co-creador y necesidad de trazabilidad total. Es el que se usa en este curso.

**Repo oficial**: https://github.com/awslabs/aidlc-workflows

### OpenSpec — alternativa mencionada en Estación 4

Framework MIT-licenciado que impone una **máquina de estados de 3 fases** sobre cualquier cambio: **propose → apply → archive**. Antes de codificar nada, el cambio se propone como spec; al implementarse, se aplica; cuando estabiliza, se archiva. Esa rigidez es su propuesta de valor.

**Para qué sirve**: ordenar el flujo de cambios incrementales sobre un código existente (brownfield-first), evitando que el agente arranque a codificar sin pasar por el estado "proposal".

**Cuándo usarlo**: refactors, migraciones o evolución de sistemas legacy donde no se puede rehacer desde cero pero se quiere disciplina spec-first.

**Repo oficial**: https://github.com/Fission-AI/OpenSpec

### Spec Kit — alternativa mencionada en Estación 4

Toolkit open-source de **GitHub** para Spec-Driven Development con agentes de código (90k+ stars). Define un workflow de 5 comandos secuenciales: `/speckit.constitution` (principios del proyecto) → `/speckit.specify` (requisitos) → `/speckit.plan` (plan técnico) → `/speckit.tasks` (desglose) → `/speckit.implement` (ejecución). Comandos opcionales de validación: `/speckit.clarify`, `/speckit.analyze`, `/speckit.checklist`. Soporta 30+ arneses (Claude Code, Cursor, Copilot, etc.) y requiere Python 3.11+.

**Para qué sirve**: estandarizar el flujo "spec → plan → tareas → código" como comandos versionables del proyecto, en cualquier arnés compatible.

**Cuándo usarlo**: greenfield (0-to-1), exploración creativa de soluciones y modernización iterativa, cuando el equipo quiere comandos cross-tool en lugar de un workflow Claude-only.

**Repo oficial**: https://github.com/github/spec-kit

---

## Frameworks de arquitectura

### C4 Model — Estaciones 2 y 4

Modelo de **Simon Brown** para diagramar arquitectura en 4 niveles: **L1 System Context** (qué interactúa con el sistema) · **L2 Container** (componentes lógicos principales) · **L3 Component** (dentro de cada container) · **L4 Code** (clases, métodos).

**Para qué sirve**: comunicar arquitectura sin perderse en detalles ni quedarse demasiado alto.

**Cuándo usarlo**: en el PRD/arquitectura, antes de codificar. En este proyecto vive en `Agente-IA-Desarrollo-ABAP/entregables/c4-model.md`.

**Repo**: https://c4model.com

### ADR (Architecture Decision Record) — Estación 5

Formato corto por decisión: **Contexto · Decisión · Consecuencias** (con ⚠️ obligatorio en Consecuencias para forzar trade-offs explícitos).

**Para qué sirve**: dejar rastro de por qué se eligió A sobre B, accesible meses después.

**Cuándo usarlo**: cada vez que una decisión arquitectónica tiene trade-offs y un agente futuro podría querer revisarla.

**Repo**: https://adr.github.io

### Google DESIGN.md — Estación 6

Estándar de **Google Labs** (en alpha) que describe sistemas de diseño en un archivo combinando **YAML con tokens** (colores, tipografía, espaciado, componentes) y **prosa markdown** que explica el racional. Diseñado para que agentes de IA tengan "comprensión persistente y estructurada" del sistema visual.

**Para qué sirve**: que un agente que genera UI produzca outputs coherentes con la identidad visual del producto sin re-explicarla en cada prompt.

**Cuándo usarlo**: productos con UI (no aplica al caso ABAP, sí se usó en el live coding de Estación 6). Soporta CLI con `lint` (detecta referencias rotas, contraste WCAG), `diff` y export a Tailwind / DTCG.

**Repo oficial**: https://github.com/google-labs-code/design.md

---

## Frameworks de ingeniería del comportamiento

### DDD (Domain-Driven Design) — Nivelación + Estación 5

Modelado del software alineado con el dominio del negocio. Conceptos: **Bounded Contexts**, **Ubiquitous Language**, **Entities**, **Value Objects**, **Aggregates**, **Domain Events**.

**Para qué sirve**: separar lógica de negocio de infraestructura. El vocabulario del dominio aparece literal en el código.

**Cuándo usarlo**: en Functional Design (Estación 5) cuando se traducen reglas de negocio a estructuras de código.

### BDD (Behavior-Driven Development) — Nivelación + Estación 2

Especificar comportamiento con **Gherkin** (`Given <contexto> / When <acción> / Then <resultado>`) en colaboración entre dev + QA + producto antes de codificar.

**Para qué sirve**: que los acceptance criteria sean ejecutables, no interpretables.

**Cuándo usarlo**: en User Stories (Estación 4) y Test Plans (Estaciones 5 y 7).

**Repo**: https://cucumber.io/docs/gherkin/reference/

### TDD (Test-Driven Development) — Nivelación

Ciclo **Red → Green → Refactor**: test fallido → código mínimo que pasa → refactor con red de seguridad.

**Para qué sirve**: diseño desacoplado guiado por pruebas; documentación viva.

**Cuándo usarlo**: en Code Generation (Estación 5) y en cualquier feature donde el comportamiento sea verificable.

### Persona + Juez (LLM-as-Judge) — Estación 8

Patrón de evaluación de agentes generativos: una **Persona** (LLM con rol de usuario) genera inputs naturales contra el agente bajo prueba; un **Juez** (LLM con rúbrica como system prompt) evalúa el output y devuelve un **scorecard** JSON con scores 1–5 por dimensión + banderas hard-fail. La rúbrica versionada es la única fuente de verdad — los pesos los aplica el harness en código, no el LLM (evita gaming). Antes de usar al Juez para decisiones go/no-go, debe **calibrarse** contra un **golden dataset** (correlación humano↔Juez ≥ 0.8).

**Para qué sirve**: medir calidad continua de outputs de agentes (que no son pass/fail binarios). Reemplaza tests pass/fail con evaluación multi-dimensional.

**Cuándo usarlo**: cuando el output del sistema es generado por LLM (texto, código, decisiones razonadas) y la pirámide de pruebas tradicional no captura calidad — agentes inteligentes, chatbots, asistentes especializados.

**Referencias**: Anthropic — Evaluating LLM Agents (https://www.anthropic.com/research) · Playwright + playwright-bdd para el harness ejecutable.

---

## Frameworks de priorización y planificación

### MoSCoW — Estación 2

Priorización del scope del MVP: **Must · Should · Could · Won't**.

**Para qué sirve**: dejar explícito qué entra al MVP y qué se descarta (no "luego veremos").

**Cuándo usarlo**: §8 del PRD y al definir cada planning wave.

**Referencia**: https://www.agilebusiness.org/dsdm-project-framework/moscow-prioririsation.html

### JTBD (Jobs To Be Done) — Estaciones 1 y 2

Marco que pregunta: *"¿qué trabajo contrata el usuario al producto?"*. Cambia el foco de features a outcomes.

**Para qué sirve**: que el problema esté centrado en el usuario, no en el producto.

**Cuándo usarlo**: §1 del PRD (One-liner + JTBD + Misión).

**Referencia**: https://jobs-to-be-done.com/

---

## Frameworks operativos del agente

### ReAct (Reasoning + Acting) — Nivelación + Estación 3

Patrón del loop agentic: **Pensar → Planificar → Ejecutar → Observar → Corregir**. El agente alterna razonamiento y acción hasta convergencia.

**Para qué sirve**: que el agente sea verificable en cada paso (no caja negra).

**Cuándo usarlo**: implícito en Claude Code; visible vía `Bash(git diff)` + introspección entre acciones.

**Paper original**: Yao et al., 2022 — [arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)

### Context Engineering — Estación 3

Práctica de **diseñar el entorno** en lugar de optimizar prompts individuales. Regla 80/20: el contexto produce el 80% del resultado.

En este curso se materializa con **tres patrones de contexto** que actúan como una pila:

- **`AGENTS.md`** — contrato neutral del repo, leído por cualquier arnés compatible (Claude Code, Codex, OpenHands, etc.).
- **`CLAUDE.md`** — configuración específica de Claude Code: rol del agente, principios, prohibiciones operativas, formato de outputs.
- **`settings.json + hooks`** — permisos `allow`/`deny` + scripts deterministas (PostToolUse, PreToolUse) que se ejecutan automáticamente y son **garantía**, no recomendación.

**Para qué sirve**: que el agente funcione consistentemente entre sesiones sin re-explicar todo cada vez.

**Cuándo usarlo**: en el bootstrap del repo, antes de la primera tarea real.

---

## Frameworks de orquestación

### OpenSymphony — Estación 7

Sistema de orquestación autónoma que ejecuta agentes de código (vía **OpenHands**) para implementar issues de Linear de principio a fin. Convierte artefactos AI-DLC en **planning waves publicables**: `task-package.yaml` + `milestones.md` + task files con contrato estándar (frontmatter `id/title/milestone/priority/estimate/blockedBy/blocks/parent` + secciones Summary/Scope/Deliverables/AC/Test Plan/Context/DoR). Cada issue tiene su propio espacio de trabajo donde el agente sigue un flujo planificación → implementación → validación → PR.

**Para qué sirve**: pasar de "tengo specs aprobadas" a "tengo una cola en Linear con dependencias, milestones y AC". Incluye además: AI PR Review advisory (OpenHands), memoria evolutiva (`opensymphony memory`) y docs sync.

**Cuándo usarlo**: cuando hay un cambio sustantivo (CR, feature) que necesita coordinarse en una cola revisable. En este proyecto: planning wave `cr-001-u2-multiformato-revalidacion`.

**Skills principales del template**: `create-implementation-plan` (AI-DLC → task package) · `convert-tasks-to-linear` (task package → Linear) · skills operacionales (commit, push, pull, land, linear).

**Repo oficial**: https://github.com/kumanday/OpenSymphony-template

---

## Frameworks de operación e infraestructura

### Terraform — Estación 9

**HashiCorp**. Herramienta de **IaC declarativa**: describís el estado final deseado en HCL, Terraform calcula el diff vs el state actual y aplica los cambios. Soporta 3000+ providers (AWS, GCP, Azure, GitHub, Cloudflare, etc.) cuyos schemas se consultan en vivo vía **Terraform MCP Server**.

**Flujo canónico**: `init` (descarga providers) → `plan` (diff revisable) → `apply` (ejecuta cambios) → `destroy` (limpieza). `import` adopta recursos preexistentes en el state. Drift detection con `plan -detailed-exitcode`.

**Para qué sirve**: pasar de "configuración invisible en consolas web" a infraestructura versionada en git, revisable en PR, idempotente y rollbackeable.

**Cuándo usarlo**: cualquier proyecto donde la configuración cloud, SaaS o de repo deba ser auditable y reproducible. En este proyecto: gestión del repositorio de GitHub (settings, branch protection, labels) como código — el producto no usa cloud propio (ver `Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md`).

**Repo oficial**: https://github.com/hashicorp/terraform · Registry: https://registry.terraform.io

#### Complemento: LocalStack

Emulador local de AWS (Docker container en `localhost:4566`) que intercepta el SDK de AWS. Permite correr `terraform apply` contra una "nube local" sin costo ni credenciales reales. Cambiar entre LocalStack y AWS real se hace modificando solo el endpoint del provider — el mismo `.tf` sirve para ambos.

**Cuándo usarlo**: para iterar IaC sin gastar dinero ni arriesgar recursos reales. No aplica cuando el provider no es AWS (ej. GitHub).

**Repo oficial**: https://github.com/localstack/localstack · Docs: https://docs.localstack.cloud

---

## Protocolos relacionados

### MCP (Model Context Protocol) — Nivelación + Estación 3

Protocolo abierto (JSON-RPC 2.0) que estandariza la conexión entre hosts (Claude Code, Cursor, Claude Desktop) y servers de tools (GitHub, PostgreSQL, Context7, etc.). Análogo a LSP pero para agentes — LSP fue su inspiración técnica.

**Para qué sirve**: extender el agente con capacidades sin acoplarlo a integraciones específicas. Se puede cambiar de proveedor y los servers siguen funcionando.

**Cuándo usarlo**: cuando el agente necesita leer/escribir contra sistemas externos (GitHub Issues, base de datos, docs corporativos).

> No es un framework sino un **protocolo**. Aparece acá por relevancia operativa: define cómo se hablan los arneses con sus tools.

---

## Resumen — qué usar en cada momento

```text
Idea inicial            → PVB (mercado) o ISB (interno)               · Estación 1
Producto cuantificado   → PRD prompt-driven (3 prompts secuenciales)  · Estación 2
Arquitectura            → C4 Model + ADRs                              · Estación 2 + 5
Identidad visual        → Google DESIGN.md                             · Estación 6 (si hay UI)
Especificación nueva    → AI-DLC (greenfield)                          · Estación 4-5
Especificación legacy   → OpenSpec / Spec Kit                          · Estación 4 (alternativas)
Modelado de dominio     → DDD                                          · Estación 5
Acceptance criteria     → BDD + Gherkin                                · Estación 4 (user stories)
Tests                   → TDD                                          · Estación 5
QA de agentes LLM       → Persona + Juez (rúbrica + golden dataset)    · Estación 8
Infraestructura como código → Terraform (+ LocalStack para dev sin costo) · Estación 9
Priorización del MVP    → MoSCoW                                       · Estación 2
Bootstrap del agente    → Context Engineering (AGENTS.md+CLAUDE.md)    · Estación 3
Loop del agente         → ReAct                                        · Estación 3 (implícito)
Tools del agente        → MCP                                          · Estación 3
Orquestación de cola    → OpenSymphony                                 · Estación 7
Filosofía transversal   → Spec-Driven Development                      · todas
```
