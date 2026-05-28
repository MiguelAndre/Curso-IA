# Demo: AI-DLC a Linear con OpenSymphony

Esta demo aparece después de introducir la orquestación de trabajo. OpenSymphony se usa como ejemplo concreto de un patrón transferible: convertir intención y contexto en una cola trazable, revisable y ejecutable.

## Fuentes reales

AI-DLC source:

```text
c2/Estación 5/agentic_interviewer_ai/aidlc-docs
```

Unidad de ejemplo:

- Proyecto: EntreVista AI
- Unit 6: `auth-lambda`
- Repo objetivo: `entrevista-auth`
- Historia principal: US-18, Authenticate Into Dashboard
- Construction plan: `construction/plans/auth-lambda-code-generation-plan.md`
- Motivo de elección: Wave 1, servicio pequeño, fundacional para dashboard

Skills usados:

- `create-implementation-plan`
- `convert-tasks-to-linear`

Fuente de los skills:

- `kumanday/OpenSymphony-template/.agents/skills/create-implementation-plan`
- `kumanday/OpenSymphony-template/.agents/skills/convert-tasks-to-linear`

## Contrato OpenSymphony

`create-implementation-plan` debe generar:

```text
docs/tasks/task-package.yaml
docs/tasks/milestones.md
docs/tasks/001-*.md
docs/tasks/002-*.md
...
```

`task-package.yaml` es la fuente canónica para Linear:

```yaml
planningWave: entrevista-auth-lambda-implementation
tasksDir: docs/tasks
milestones:
  - "M1: Auth Lambda Foundation"
  - "M2: Auth Business Logic"
tasks:
  - id: TASK-001
    file: docs/tasks/001-*.md
```

Cada tarea debe incluir el frontmatter requerido por OpenSymphony:

```yaml
id: TASK-001
title: Current Gateway Inventory
milestone: "M1: Auth Lambda Foundation"
priority: 3
estimate: 3
blockedBy: []
blocks: []
parent: null
```

Y las secciones:

- Summary
- Scope
- Deliverables
- Acceptance Criteria
- Test Plan
- Context
- Definition of Ready

## Paso 1: crear plan de implementación

Prompt de demo:

```text
use create-implementation-plan to convert the AI-DLC artifacts in c2/Estación 5/agentic_interviewer_ai/aidlc-docs into OpenSymphony-ready tasks.

Planning wave: entrevista-auth-lambda-implementation.
Target unit: Unit 6 auth-lambda, repo entrevista-auth.

Use these AI-DLC inputs:
- aidlc-state.md
- audit.md
- inception/application-design/unit-of-work.md
- inception/application-design/unit-of-work-dependency.md
- inception/application-design/unit-of-work-story-map.md
- inception/application-design/services.md
- inception/application-design/components.md
- inception/user-stories/stories.md
- construction/plans/auth-lambda-code-generation-plan.md
- construction/auth-lambda/functional-design/business-logic-model.md
- construction/auth-lambda/functional-design/business-rules.md
- construction/auth-lambda/functional-design/domain-entities.md
- construction/auth-lambda/nfr-requirements/nfr-requirements.md
- construction/auth-lambda/nfr-requirements/tech-stack-decisions.md
- construction/auth-lambda/nfr-design/logical-components.md
- construction/auth-lambda/nfr-design/nfr-design-patterns.md
- construction/auth-lambda/infrastructure-design/infrastructure-design.md
- construction/auth-lambda/infrastructure-design/deployment-architecture.md

Create docs/tasks/task-package.yaml, docs/tasks/milestones.md, and issue-ready task files with the exact OpenSymphony task contract.
Be sure each task has definition, acceptance criteria, test plan, context references, dependencies, and milestone grouping.
```

## Paso 2: revisar el paquete

Revisión rápida:

- `docs/tasks/task-package.yaml` existe.
- Todos los task files declarados en el manifest existen.
- Los milestones del manifest coinciden con el frontmatter de cada tarea.
- `blockedBy`, `blocks` y `parent` usan IDs válidos del mismo manifest.
- Cada tarea referencia los artefactos AI-DLC que necesita leer.
- Los test plans son verificables por comando, revisión o evidencia manual.

## Paso 3: validar y hacer dry-run

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  validate \
  --manifest docs/tasks/task-package.yaml
```

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  dry-run \
  --manifest docs/tasks/task-package.yaml
```

## Paso 4: publicar a Linear

Prompt de demo:

```text
use the convert-tasks-to-linear skill to create all tasks in Linear project [project-slug]
put them all in Todo status
```

Comando:

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  apply \
  --manifest docs/tasks/task-package.yaml \
  --project-slug [project-slug]
```

Si el proyecto tiene más de un team:

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  apply \
  --manifest docs/tasks/task-package.yaml \
  --project-slug [project-slug] \
  --team-key [TEAMKEY]
```

## Paso 5: verificar resultado

Después de publicar:

- `docs/tasks/linear-publish.yaml` existe.
- Cada `TASK-*` tiene issue identifier, URL e issueId.
- Linear muestra milestones con los mismos nombres del manifest.
- Cada issue está en Todo.
- Las relaciones de blockers existen.
- Los sub-issues respetan `parent`.
- El project overview contiene el resumen de la planning wave.

## Paso 6: ejecutar, revisar y capturar memoria

Después de publicar tareas, el flujo continúa con una tarea pequeña:

1. El arnés implementa desde issue y task file.
2. El PR incluye `Evidence`.
3. OpenHands PR Review comenta riesgos de correctness, seguridad, compatibilidad, tests y mantenibilidad.
4. Un humano decide merge.
5. OpenSymphony captura memoria de la tarea completada.
6. La memoria sincroniza docs cuando el conocimiento se vuelve estable.

Comandos de memoria:

```bash
opensymphony memory init --dry-run
opensymphony memory status
opensymphony memory context --issue COE-123
opensymphony memory capture COE-123 --dry-run
opensymphony memory sync-docs --since-last-sync --dry-run
```

Para explorar codebase understanding:

```bash
opensymphony memory related --paths crates/opensymphony-openhands
opensymphony memory search "reconnect recovery"
opensymphony memory docs --area authentication
```

## Cierre de la demo

La cadena completa queda así:

```text
AI-DLC docs -> create-implementation-plan -> task-package.yaml -> validate -> dry-run -> Linear -> arnés -> PR -> AI review -> memory capture -> docs sync
```

La clase debe quedarse con el patrón: orquestar trabajo, ejecutar con evidencia, revisar temprano y convertir aprendizaje en memoria documental.
