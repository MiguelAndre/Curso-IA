# Runbook Estudiante: Estación 7

**Agentes de código · Orquestación, review y memoria**

Este runbook acompaña la sesión desde el concepto hacia una implementación concreta. Primero diseña el sistema de orquestación de trabajo. Luego usa OpenSymphony como ejemplo para convertir artefactos AI-DLC en tareas publicables. Después agrega review automatizado y memoria evolutiva como capas de calidad y continuidad.

## Resultado esperado

Al terminar tendrás:

- Un mapa de orquestación de trabajo.
- Una planning wave generada desde artefactos AI-DLC.
- Tareas publicadas en Linear en estado Todo.
- Un PR con evidence.
- Revisión automatizada del PR o setup documentado.
- Captura o dry-run de memoria.
- Propuesta de documentación que debe evolucionar.

## 1. Diseña la orquestación de trabajo

Antes de ejecutar comandos, define el sistema:

- Intención: qué unidad, feature o cambio entra al flujo.
- Contexto: qué specs, docs, código y decisiones debe leer el agente.
- Scope: qué puede cambiar y qué queda reservado.
- Dependencias: qué trabajo bloquea a otro.
- Ejecución: qué arnés toma la tarea.
- Validación: qué prueba o evidencia decide avance.
- Review: qué feedback llega antes del merge.
- Memoria: qué aprendizaje queda disponible para futuras tareas.

En la demo de clase usaremos:

```text
c2/Estación 5/agentic_interviewer_ai/aidlc-docs
```

Unidad:

- Unit 6: `auth-lambda`
- Repo objetivo: `entrevista-auth`
- Planning wave: `entrevista-auth-lambda-implementation`

## 2. Ubica OpenSymphony como ejemplo

OpenSymphony modela una planning wave como paquete revisable:

```text
docs/tasks/task-package.yaml
docs/tasks/milestones.md
docs/tasks/001-*.md
docs/tasks/002-*.md
...
```

`task-package.yaml` conserva:

- `planningWave`
- `tasksDir`
- `milestones`
- `tasks`

Cada task file conserva:

- id, título, milestone, prioridad, estimación,
- blockers y parent,
- summary, scope, deliverables,
- acceptance criteria,
- test plan,
- context,
- definition of ready.

## 3. Convierte AI-DLC en trabajo publicable

Usa `create-implementation-plan` como ejemplo de descomposición operable.

La revisión humana del paquete debe confirmar:

- Cada tarea del manifest existe.
- Cada milestone del frontmatter existe en el manifest.
- `blockedBy`, `blocks` y `parent` apuntan a IDs válidos.
- Cada tarea referencia los documentos AI-DLC que necesita.
- Los acceptance criteria son medibles.
- Los test plans tienen comandos o evidencia manual clara.
- Las tareas caben en sesiones ejecutables por agentes.

## 4. Publica el trabajo en Linear

Usa `convert-tasks-to-linear` como ejemplo de publicación controlada.

Evidencia esperada:

- Validación del paquete.
- Preview o dry-run revisado.
- Issues creados o actualizados.
- Milestones correctos.
- Blockers representados.
- Sub-issues bajo el parent correcto.
- Mapping local en `docs/tasks/linear-publish.yaml`.

Los comandos viven en `opensymphony-linear-demo.md`. En clase importan como manifestación de un patrón: el sistema publica trabajo trazable sin perder relaciones, contexto ni criterios de validación.

## 5. Ejecuta una tarea con arnés

Después de publicar, elige una tarea pequeña y ejecútala:

1. Lee el issue de Linear y el task file correspondiente.
2. Pide un plan corto antes de editar.
3. Revisa scope, dependencias y validación.
4. Aprueba implementación.
5. Ejecuta tests o validación.
6. Registra evidencia en Linear y en el PR.

## 6. Usa code review automatizado como control de calidad

El review automatizado reduce bugs y deuda técnica cuando revisa señales concretas:

- intención del cambio,
- diff,
- evidencia,
- tests,
- riesgos,
- patterns ya acordados,
- áreas sensibles del codebase.

OpenSymphony usa OpenHands PR Review como ejemplo. El flujo debe conservar:

- rol advisory,
- approval humano,
- PR evidence,
- comentarios accionables,
- foco en correctness, seguridad, compatibilidad, tests y mantenibilidad.

Setup a revisar:

- `.github/workflows/ai-pr-review.yml`
- `.agents/skills/custom-codereview-guide.md`
- `AGENTS.md`
- `.github/pull_request_template.md`
- `docs/ai-pr-review-human-setup.md`

## 7. Construye memoria y codebase understanding

Cada issue completado debe dejar conocimiento reusable:

- qué decisión quedó validada,
- qué invariant apareció,
- qué validación fue útil,
- qué review feedback se repitió,
- qué docs quedaron afectadas,
- qué área del codebase ganó contexto.

En OpenSymphony, `opensymphony memory` sirve como ejemplo de esta práctica. Permite capturar issues completados, consultar contexto relacionado y sincronizar conocimiento estable hacia docs.

Comandos de apoyo:

```bash
opensymphony memory context --issue COE-456
opensymphony memory related --issue COE-456
opensymphony memory related --paths crates/opensymphony-openhands
opensymphony memory search "subscription credential refresh"
opensymphony memory docs --area authentication
opensymphony memory capture COE-123 --dry-run
opensymphony memory sync-docs --since-last-sync --dry-run
opensymphony memory lint --public-docs
```

## 8. Checklist de entrega

- [ ] Mapa de orquestación de trabajo.
- [ ] `docs/tasks/task-package.yaml`.
- [ ] `docs/tasks/milestones.md`.
- [ ] Task files con contrato OpenSymphony.
- [ ] Validación y dry-run revisados.
- [ ] Tareas en Linear en Todo.
- [ ] `docs/tasks/linear-publish.yaml`.
- [ ] PR con Evidence.
- [ ] AI PR review ejecutado o setup documentado.
- [ ] Captura o dry-run de memoria.
- [ ] Propuesta de docs sync o actualización documental.
