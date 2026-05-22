# AI Learning Journey — Curso Hardcore AI (Cohorte 2)

Repositorio con notas, laboratorios y entregables prácticos de mi formación en **Inteligencia Artificial aplicada al desarrollo de software**.

Programa intensivo organizado en **6 estaciones progresivas** que van desde la concepción de un producto hasta su implementación con agentes de IA, precedidas por una **Nivelación** de fundamentos.

---

## Índice rápido

| # | Carpeta | Tema | Entregable principal |
|---|---------|------|----------------------|
| 0 | [`Nivelación/`](#nivelación--fundamentos) | IA generativa, agentes de código, MCP | Lectura previa |
| 1 | [`Estacion-1/`](#estación-1--introducción-y-product-vision-board) | Definir el producto (PVB / ISB) | PVB o ISB completado |
| 2 | [`Estacion-2/`](#estación-2--co-crear-el-prd-con-ia) | Co-creación del PRD con IA | `specs/prd.md` |
| 3 | [`Estacion-3/`](#estación-3--ingeniería-de-software-agéntica) | Claude Code, OpenCode, Antigravity | Repo agent-ready + 1 feature |
| 4 | [`Estacion-4/`](#estación-4--diseñando-el-qué-ai-dlc-inception) | AI-DLC Inception (Diseñar el QUÉ) | 6 artefactos de Inception |
| 5 | [`Estacion-5/`](#estación-5--diseñando-el-cómo-construction) | Construction (Diseñar el CÓMO) | Código + tests + deploy de la Unidad 1 |
| 6 | [`Estacion-6/`](#estación-6--implementando-scaffolding-y-mapa-agencial) | Scaffolding, modelos, arneses y orquestación | `AGENTS.md` + `PRODUCT.md` + `DESIGN.md` |

---

## Visión general del curso

El curso combina material teórico (PDFs), manuales prácticos (Markdown), ejercicios hands-on y proyectos reales. La columna vertebral son tres herramientas: **Claude Code**, **OpenCode/Cursor** y **Antigravity**, sobre tres patrones de contexto: **AGENTS.md**, **CLAUDE.md** y **settings.json + hooks**.

**Principios transversales:**
- **Context Engineering > Prompt Engineering** (80% del resultado viene del contexto).
- **Spec-Driven Development** como antídoto contra el "vibe coding".
- **Delegación inteligente** — saber cuándo usar subagentes, sesiones paralelas o criterio humano.
- **Trazabilidad y auditoría** integradas en cada artefacto.

---

## Nivelación — Fundamentos

📁 `Nivelación/`

Material introductorio (autoestudio previo al inicio del programa). Establece el vocabulario y contexto compartido.

| Archivo | Contenido |
|---------|-----------|
| `Nivelación-1-Fundamentos-de-IA-generativa.pdf` | Modelos foundation, prompting básico |
| `Documento1-Guía-de-Nivelación-Ingeniería-de-Software-Moderna.pdf` | Prácticas modernas de desarrollo |
| `Documento-2-Current-Landscape-El-Estado-del-Arte-de-los-Agentes-de-Código-(Abril-2026).pdf` | Estado del arte de agentes autónomos |
| `Documento3-AI-Native-Builder-Playbook.pdf` | Patrones de diseño para builders nativos de IA |
| `MCPsySkills.pdf` / `mcp_skills_es.docx.pdf` | Guía del protocolo MCP (Model Context Protocol) |

---

## Estación 1 — Introducción y Product Vision Board

📁 `Estacion-1/`

**Tema:** Definir la idea de producto o problema empresarial mediante un **Product Vision Board (PVB)** o un **Internal Solution Brief (ISB)**.

### Archivos principales

| Archivo | Para qué sirve |
|---------|----------------|
| `hcai-c2-product-vision-board.md` | Template del PVB (para ideas propias o startups) |
| `hcai-c2-internal-solution-brief.md` | Template del ISB (para problemas internos) |
| `hcai-c2-product-vision-board.pdf` | Guía visual con conceptos, errores y prompts |
| `hcai-c2-banco-productos.pdf` | Catálogo de productos predefinidos |
| `hcai-c2-e1-slides.pdf` | Slides de la sesión |
| `README.md` | Instrucciones de la estación |

### Estructura del PVB (9 segmentos)
Problema · Segmento target · Moat (Data/Distribution/Trust) · Arena competitiva · UX Paradigm · AI Decision Triangle · Modelo económico · Métricas · Riesgos.

### Estructura del ISB (9 segmentos)
Problema de negocio · Stakeholders · Estado actual · Estado futuro · Criterios de éxito · Restricciones · Enfoque técnico · Riesgos · Límites de alcance.

### `Tarea/`
Entregable: PVB o ISB completado + deep research de validación y crítica.
- `hcai-c2-internal-solution-brief.md` (+ variantes 1 y 2)
- `investigacion-ia-desarrollo-abap.md` — Investigación del caso real (Agente IA para desarrollo ABAP)

---

## Estación 2 — Co-crear el PRD con IA

📁 `Estacion-2/`

**Tema:** Transformar el PVB/ISB en un **PRD v1** mediante co-creación estructurada con LLMs. Pipeline de tres prompts: **PRD → Arquitectura → Backlog** (esta estación cubre el primero).

### Archivos principales

| Archivo | Contenido |
|---------|-----------|
| `hcai-c2-e2-deck.pdf` | Slides de la sesión |
| `hcai-c2-e2-manual-estudiante.pdf` | Manual del estudiante |

### `Tarea/`

```
Tarea/
├── docs/                          ← Inputs (PVB refinado, overview, mercado, ICP, crítica)
├── specs/                         ← Outputs (PRD, arquitectura, backlog)
├── prompts-especificacion.md      ← Los 3 prompts secuenciales
└── README.md                      ← Flujo y estructura esperada
```

**Prompts incluidos:**
1. **Prompt 1 — PRD:** 13 segmentos (One-liner, Contexto, ICP, Riesgos, etc.)
2. **Prompt 2 — Arquitectura:** C4 model, NFRs, ADRs
3. **Prompt 3 — Backlog:** Historias de usuario en Gherkin

---

## Estación 3 — Ingeniería de Software Agéntica

📁 `Estacion-3/`

**Tema:** Implementación práctica con **Claude Code**, **OpenCode** y **Antigravity**. Diferenciar copiloto vs agente autónomo, configurar permisos, memoria, hooks, subagentes y MCPs. Orquestar sesiones paralelas.

**Instructor:** Carlos Alarcón

### Archivos principales

| Archivo | Contenido |
|---------|-----------|
| `clase-3-estudiante.md` | Manual de la clase (2 horas) |
| `codelab_page/` | Codelab interactivo desplegado: https://harcoreai.carlos-alarcon.com/ |
| `workshops/workshop-1-agent-ready-repo/` | Workshop 1 (90 min): hacer tu repo "agent-ready" |
| `workshops/workshop-2-avanza-feature/` | Workshop 2 (90 min): implementar feature con delegación |

### Fundamentos enseñados
- Del "commit" al "artifact" como nueva unidad de trabajo.
- **Bucle ReAct:** pensar → planificar → ejecutar → observar → corregir.
- **Context Engineering** (80%) vs Prompt Engineering (20%).
- **Hooks deterministas** vs instrucciones advisory.
- **MCPs instalados en vivo:** GitHub, Context7, PostgreSQL, Vercel, Sequential Thinking, Excalidraw.

### `Tarea/` — Proyecto real (Agente IA Desarrollo ABAP)

| Archivo | Contenido |
|---------|-----------|
| `AGENTS.md` | Documento de orientación cross-tool del proyecto |
| `CLAUDE.md` | Instrucciones operativas de Claude Code |
| `.mcp.json` | Configuración de MCPs |
| `.claude/settings.json` | Permisos allow/deny |
| `.claude/skills/` | 4 Skills versionadas: `abap-fd-validator`, `generate-api-docs`, `review-pr`, `abap-object-templates` |
| `.claude/agents/abap-code-reviewer.md` | Subagente custom de revisión ABAP |
| `prd.md` | PRD del producto interno (Agente FD→TD→Código ABAP) |
| `examples/` | Ejemplos: FD, validación, TD, código ABAP generado, revisión |

**Entregable:** repo agent-ready + 1 feature implementada con subagente + 1 sesión paralela en Antigravity + `reflection.md`.

---

## Estación 4 — Diseñando el QUÉ (AI-DLC Inception)

📁 `Estacion-4/`

**Tema:** Framework **AI-DLC** (Artificial Intelligence Development Lifecycle) — fase **Inception**. Generar especificaciones ejecutables ANTES de escribir código. Combina DDD + BDD + TDD (XDD).

**Instructor:** Christian Braatz

### Archivos principales

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Guía de la estación |
| `estacion4-runbook.md` | Guía paso a paso de las 6 actividades de Inception |
| `estacion4-diseñando-el-que.pdf` | Slides |
| `docs/prompts-ajit-arquitectura.md` | Prompts para diseño arquitectónico |
| `docs/adr-template.md` | Template para Architecture Decision Records |
| `aidlc-rules/` | Framework AI-DLC v0.1.8 (NO modificar) |

### Los 3 frameworks de especificación comparados
- **Open Spec** — fluido, iterativo, brownfield-first.
- **Spec Kit** — specs sirven al código y viceversa, ideal para juniors.
- **AI-DLC** — nativo para IA, trazabilidad integral, DDD integrado. **Es el que se usa en el curso.**

### Las 6 actividades de Inception

| # | Actividad | Artefacto |
|---|-----------|-----------|
| 00 | Workspace Detection | `workspace-detection.md` |
| 01 | Requirements Analysis | `requirements-analysis.md` |
| 02 | User Stories | `user-stories.md` |
| 03 | Workflow Planning | `workflow-planning.md` |
| 04 | Application Design | `application-design.md` |
| 05 | Units Generation | `units-generation.md` → **entrada de Estación 5** |

### Proyectos incluidos

#### `agentic_interviewer_ai/` — Ejemplo guía
**EntreVista AI** — plataforma de screenings conversacionales vía Telegram. Arquitectura de 7 microservicios (Lambda + Claude Agent SDK + MongoDB Atlas + Pinecone + S3).

Contiene PRD y todos los artefactos de Inception en `aidlc-docs/inception/` (requirements, user-stories, application-design con C4 model, plans).

#### `Agente-IA-Desarrollo-ABAP/` — Proyecto real del equipo
Aplicación completa del framework AI-DLC al **Agente IA para desarrollo ABAP** (transforma documentos funcionales validados en código ABAP listo para revisión humana).

```
Agente-IA-Desarrollo-ABAP/
├── CLAUDE.md
├── prd.md
├── docs/
│   ├── formato-fd-generico.md
│   ├── checklist-auditoria-codigo-ia.md
│   ├── plan-evaluacion.md
│   └── adr/ADR-001-claude-code-como-plataforma.md
├── aidlc-docs/
│   ├── inception/ (requirements, user-stories, application-design, plans)
│   ├── construction/ (U1–U6, functional-design, code, nfr, build-and-test)
│   └── audit.md
└── entregables/ (c4-model.md, nfr-matrix.md, ADR-001)
```

---

## Estación 5 — Diseñando el CÓMO (Construction)

📁 `Estacion-5/`

**Tema:** Fase **Construction** del AI-DLC. Tomar los 6 artefactos de Inception (Estación 4) y convertirlos en **código funcional, pruebas y despliegue**, unidad por unidad.

**Instructor:** Christian Braatz

### Archivos principales

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Guía general de la estación |
| `estacion5-runbook.md` | Runbook paso a paso de las 5 actividades de Construction |
| `estacion5-diseñando-el-como.pdf` | Slides de la sesión |
| `docs/prompts-ajit-arquitectura.md` | Prompts para diseño arquitectónico (C4, NFRs, ADR) |
| `docs/adr-template.md` | Template para documentar decisiones arquitectónicas |
| `aidlc-rules/` | Framework AI-DLC v0.1.8 (no modificar) — `core-workflow.md` se copia como `CLAUDE.md` |

### Las 5 actividades de Construction (por unidad)

| # | Actividad | Artefacto | Regla de oro |
|---|-----------|-----------|--------------|
| 01 | Diseño funcional | `domain-entities.md` · `business-rules.md` · `business-logic-model.md` | No generar código antes de aprobar el `business-logic-model.md` |
| 02 | NFR Requirements | `nfr-requirements.md` | Cada NFR necesita un valor numérico verificable |
| 03 | NFR Design (ADR) | `nfr-design.md` | Todo ADR debe declarar ⚠️ en Consecuencias |
| 04 | Infrastructure Design | `infrastructure-design.md` · `deployment-architecture.md` | Todo componente del `application-design.md` debe aparecer en el diagrama |
| 05 | Code Generation + Tests | Código fuente + suite de tests | Los tests de integración se trazan a escenarios Gherkin de `user-stories.md` |

> **Flujo por unidad:** `Diseño funcional → NFR Requirements → NFR Design (ADR) → Infrastructure Design → Code Generation → Tests`

### Proyecto de ejemplo — EntreVista AI · Unidad 1 (`auth-lambda`)

La carpeta `agentic_interviewer_ai/` contiene Inception completa **más** los artefactos de Construction para la Unidad 1, como referencia de "cómo se ve bien":

| Artefacto | Qué muestra |
|-----------|-------------|
| `functional-design/domain-entities.md` | Entities (`Operator`, `RefreshToken`), Value Objects (`HashedPassword`, `JWTAccessToken`), Aggregates |
| `functional-design/business-rules.md` | 6 reglas numeradas (RULE-AUTH-01 a RULE-AUTH-06) con condición, consecuencia y fuente |
| `functional-design/business-logic-model.md` | Flujos E2E: Login, Refresh, Logout, Change Password |
| `nfr-requirements/nfr-requirements.md` | 6 NFRs con valores numéricos (P95 < 500 ms, bcrypt factor 10, 99.5% disponibilidad…) |
| `nfr-design/nfr-design-patterns.md` | 3 ADRs: degraded mode Redis→MongoDB, JWT RS256 + Secrets Manager, rate limiting granular |
| `infrastructure-design/infrastructure-design.md` | Mapa de servicios AWS (API Gateway, Lambda, MongoDB Atlas, Secrets Manager, VPC) |
| `infrastructure-design/deployment-architecture.md` | Diagrama Mermaid completo de despliegue |

**Prompt de re-entrada al framework** (con `CLAUDE.md` en el workspace):

```
Confírmame en qué fase de AI-DLC nos encontramos, para avanzar.
```

---

## Estación 6 — Implementando (Scaffolding y mapa agencial)

📁 `Estacion-6/`

**Tema:** Cambia el nivel de zoom. AI-DLC ya entregó el contrato; ahora se construye el **scaffolding operativo** alrededor de la implementación: arneses, modelos, proveedores de inferencia, skills de diseño, estándares visuales y orquestación general. La implementación con AI-DLC queda como ejercicio aplicado.

**Instructor:** Leonardo González · **Duración:** ~2 h

### Archivos principales

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Guía general de la estación |
| `estacion6-runbook.md` | Runbook para preparar el repo para ejecución con agentes |
| `design-standards-live-demo.md` | Guion del live coding: convertir `PRODUCT.md` + `DESIGN.md` + storyboard en slides HTML/PDF |
| `prompts.md` | Prompts para instalar skills de diseño y crear `PRODUCT.md` / `DESIGN.md` |
| `slides/estacion6-slides.md` | Storyboard Markdown que alimenta los slides generados en vivo |

### Estructura del módulo (5 bloques)

| # | Bloque | Duración | Foco |
|---|--------|----------|------|
| 1 | Scaffolding y diseño UX agencial | 25 min | Live coding: skills de diseño + `PRODUCT.md` + `DESIGN.md` → slides HTML/PDF |
| 2 | Modelos, proveedores e inferencia | 20 min | Separar modelo, proveedor, API y superficie de trabajo; comparar contexto, cache, multimodalidad, tool calling |
| 3 | Benchmarks y señales de capacidad | 15 min | Leer Terminal Bench y Artificial Analysis como señales parciales |
| 4 | Arneses y agent labs | 25 min | Ubicar Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2 y Pi |
| 5 | Orquestación general | 25 min | Alcance, contexto, dependencias, ejecución y evidencia — puente conceptual a Estación 7 |

### Concepto clave: la pila de diseño agencial

- **Skills** → dan hábitos al agente (accesibilidad, performance, anti-patrones).
- **`PRODUCT.md`** → da criterio (audiencia, propósito, tono, contexto).
- **`DESIGN.md`** → da memoria visual (tokens, roles, componentes, racional).
- **Lint** (`npx @google/design.md lint DESIGN.md`) → hace revisable el estándar.

Skills de diseño instaladas en el demo: **Impeccable**, **Make Interfaces Feel Better**, **Web Design Guidelines**, **Userinterface Wiki**, **Accessibility / Best Practices / Core Web Vitals / Performance / SEO**, **React Best Practices**, **Imagegen** y el estándar **Google DESIGN.md**.

### Entregable

Scaffolding operativo del repo:

1. Ficha del arnés y modelo(s) con características relevantes (contexto, permisos, validación, evidencia).
2. `AGENTS.md` / `CLAUDE.md` o equivalente actualizado.
3. `PRODUCT.md` y `DESIGN.md` si hay UI, slides o material visual.
4. Lista de validaciones disponibles (tests, lint, build, demo, revisión manual).

### Recursos clave

- Artículo: [Fixing Visual AI Slop](https://trilogyai.substack.com/p/fixing-visual-ai-slop)
- Demo site: [design.trilogyai.co](https://design.trilogyai.co/) — Repo: [trilogy-group/design](https://github.com/trilogy-group/design)
- Estándar: [Google DESIGN.md](https://github.com/google-labs-code/design.md)

---

## Matriz de progresión

| Estación | Qué haces | Entregable |
|----------|-----------|-----------|
| Nivelación | Lectura de 5 PDFs fundamentales | Conocimiento base |
| **Estación 1** | Defines PVB o ISB | PVB/ISB + research |
| **Estación 2** | Co-creas PRD con IA | `specs/prd.md` |
| **Estación 3** | Configuras agente + implementas feature | `AGENTS.md`, `CLAUDE.md`, rama feature |
| **Estación 4** | Especificación con AI-DLC Inception | 6 artefactos ejecutables |
| **Estación 5** | Construcción real (Construction) | Código + tests + deploy de la Unidad 1 |
| **Estación 6** | Scaffolding y mapa agencial | `AGENTS.md` + `PRODUCT.md` + `DESIGN.md` + ficha de arnés |

---

## Recursos externos mencionados

- **Codelab oficial:** https://harcoreai.carlos-alarcon.com/
- **Claude Code:** https://code.claude.com/docs
- **Anthropic Skills:** https://github.com/anthropics/skills
- **AI-DLC framework:** https://github.com/awslabs/aidlc-workflows
- **C4 Model:** https://c4model.com
- **ADR examples:** https://adr.github.io
- **Gherkin:** https://cucumber.io/docs/gherkin/reference/
- **Antigravity:** https://antigravity.google/docs

---

## Tecnologías y herramientas

- **Editores/Agentes:** Claude Code, Cursor, OpenCode, Antigravity
- **Protocolos:** MCP (Model Context Protocol)
- **Frameworks de especificación:** PVB, ISB, PRD prompt-driven, AI-DLC
- **Stack del caso ABAP:** SAP S/4HANA Cloud, ABAP OO, ALV, BAdI, SmartForms
- **Stack del caso EntreVista AI:** AWS Lambda, MongoDB Atlas, Pinecone, Telegram Bot API, React
- **Control de versiones:** Git, GitHub
