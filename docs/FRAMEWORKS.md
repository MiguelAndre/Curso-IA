# Frameworks y metodologías usados en el curso

Los frameworks aparecen en distintas estaciones del curso. Cada uno con qué es, para qué sirve, cuándo elegirlo y dónde se usa en este repo.

---

## Frameworks de definición de producto

### Product Vision Board (PVB) — Estación 1

Plantilla visual de **9 segmentos** para definir un producto orientado al mercado: Problema, Segmento target, Moat, Arena competitiva, UX paradigm, AI Decision Triangle, Modelo económico, Métricas, Riesgos. Apta para startups o ideas propias.

**Para qué sirve**: forzar decisiones explícitas sobre quién, qué y por qué, antes de cualquier código.

**Cuándo elegirlo**: producto pensado para venderse externamente o crear un mercado.

### Internal Solution Brief (ISB) — Estación 1

Plantilla de **9 segmentos** equivalente al PVB pero para **problemas internos corporativos**: Problema de negocio · Stakeholders · Estado actual · Estado futuro · Criterios de éxito · Restricciones · Enfoque técnico · Riesgos · Límites de alcance.

**Para qué sirve**: justificar un proyecto interno con cuantificación dura y autorización de sponsor.

**Cuándo elegirlo**: caso interno corporativo (lo que se usó para el caso ABAP).

### PRD prompt-driven (3 prompts secuenciales) — Estación 2

Pipeline propio del curso: **Prompt 1 → PRD · Prompt 2 → Arquitectura · Prompt 3 → Backlog**. Cada prompt requiere aprobación humana segmento por segmento. Antes del Prompt 1 va un **paso 0 de análisis de conflictos** que resuelve ambigüedades en los inputs.

**Para qué sirve**: convertir research/ISB en PRD ejecutable de 13 segmentos sin retrabajo masivo.

**Cuándo elegirlo**: cuando el insumo (ISB/PVB + research) ya es estable y se busca un PRD defendible.

---

## Frameworks de especificación ejecutable

### AI-DLC (Artificial Intelligence Development Lifecycle) — Estaciones 4–5

Framework de **AWS Labs**, versión `v0.1.8` en este curso. Recorre Inception (6 actividades: Workspace Detection · Requirements · User Stories · Workflow Planning · Application Design · Units Generation) y Construction (5 actividades por unidad: Functional Design · NFR Requirements · NFR Design · Infrastructure Design · Code Generation + Tests). Combina DDD + BDD + TDD ("XDD").

**Para qué sirve**: producir specs ejecutables que un agente pueda implementar sin decidir cosas de dominio. Tiene audit trail integral (`aidlc-state.md`, `audit.md`).

**Cuándo elegirlo**: producto nuevo (greenfield) con agente co-creador y necesidad de trazabilidad total. Es el que se usa en este curso.

**Repo oficial**: https://github.com/awslabs/aidlc-workflows

### Open Spec — mencionado en Estación 4 como alternativa

Framework **fluido e iterativo, brownfield-first**. Trabaja sobre código existente y produce specs incrementales.

**Para qué sirve**: refactors, migraciones o sistemas legacy donde no se puede rehacer desde cero.

**Cuándo elegirlo**: hay código que ya funciona pero falta documentación viva que sirva al agente.

### Spec Kit — mencionado en Estación 4 como alternativa

Framework donde **las specs sirven al código y el código sirve a las specs**: cada cambio actualiza ambos lados. Énfasis pedagógico.

**Para qué sirve**: equipos junior o contextos donde la claridad de spec es el bottleneck.

**Cuándo elegirlo**: cuando entrenar al equipo en pensamiento spec-first es prioridad.

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

---

## Frameworks de priorización y planificación

### MoSCoW — Estación 2

Priorización del scope del MVP: **Must · Should · Could · Won't**.

**Para qué sirve**: dejar explícito qué entra al MVP y qué se descarta (no "luego veremos").

**Cuándo usarlo**: §8 del PRD y al definir cada planning wave.

### JTBD (Jobs To Be Done) — Estaciones 1 y 2

Marco que pregunta: *"¿qué trabajo contrata el usuario al producto?"*. Cambia el foco de features a outcomes.

**Para qué sirve**: que el problema esté centrado en el usuario, no en el producto.

**Cuándo usarlo**: §1 del PRD (One-liner + JTBD + Misión).

---

## Frameworks operativos del agente

### ReAct (Reasoning + Acting) — Nivelación + Estación 3

Patrón del loop agentic: **Pensar → Planificar → Ejecutar → Observar → Corregir**. El agente alterna razonamiento y acción hasta convergencia.

**Para qué sirve**: que el agente sea verificable en cada paso (no caja negra).

**Cuándo usarlo**: implícito en Claude Code; visible vía `Bash(git diff)` + introspección entre acciones.

### Context Engineering — Estación 3

Práctica de **diseñar el entorno** (CLAUDE.md, AGENTS.md, hooks, permisos) en lugar de optimizar prompts individuales. Regla 80/20: el contexto produce el 80% del resultado.

**Para qué sirve**: que el agente funcione consistentemente entre sesiones sin re-explicar todo cada vez.

**Cuándo usarlo**: en el bootstrap del repo (`AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`).

### Spec-Driven Development (SDD) — transversal a todo el curso

Producir specs **ejecutables** antes de código. Antídoto contra el *vibe coding* (codificar a sentimiento).

**Para qué sirve**: que el agente tenga un contrato claro contra el que ejecutar; que el reviewer humano tenga un oracle contra el que validar.

**Cuándo usarlo**: siempre. Es la filosofía que sustenta AI-DLC, ISB/PVB, PRD, OpenSymphony.

---

## Frameworks de orquestación y operación

### OpenSymphony — Estación 7

Sistema de orquestación que convierte artefactos AI-DLC en **planning waves publicables**: `task-package.yaml` + `milestones.md` + task files con contrato estándar (frontmatter `id/title/milestone/priority/estimate/blockedBy/blocks/parent` + secciones Summary/Scope/Deliverables/AC/Test Plan/Context/DoR).

**Para qué sirve**: pasar de "tengo specs aprobadas" a "tengo una cola en Linear con dependencias, milestones y AC". Incluye además: AI PR Review advisory (OpenHands), memoria evolutiva (`opensymphony memory`) y docs sync.

**Cuándo usarlo**: cuando hay un cambio sustantivo (CR, feature) que necesita coordinarse en una cola revisable. En este proyecto: planning wave `cr-001-u2-multiformato-revalidacion`.

**Skills incluidos**: `create-implementation-plan` (AI-DLC → task package) · `convert-tasks-to-linear` (task package → Linear).

### MCP (Model Context Protocol) — Nivelación + Estación 3

Más que framework, es **protocolo abierto** (JSON-RPC 2.0) que estandariza la conexión entre hosts (Claude Code, Cursor, Claude Desktop) y servers de tools (GitHub, PostgreSQL, Context7, etc.). Análogo a LSP pero para agentes.

**Para qué sirve**: extender el agente con capacidades sin acoplarlo a integraciones específicas. Se puede cambiar de proveedor y los servers siguen funcionando.

**Cuándo usarlo**: cuando el agente necesita leer/escribir contra sistemas externos (GitHub Issues, base de datos, docs corporativos).

---

## Resumen — qué framework usar en cada momento

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
