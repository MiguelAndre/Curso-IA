# Prompts: Estación 7

Estos prompts preparan tareas para ejecución con arneses y sistemas de orquestación.

## Crear plan de implementación

```text
use create-implementation-plan to convert my AI-DLC spec/tasks to OpenSymphony-ready tasks with the right schema.

Be sure each task has the required definition, acceptance criteria, test plan, and references any needed external context such as documentation files.

Ensure the dependencies between tasks and their grouping within milestones is well defined.
```

## Convertir tareas a Linear

```text
use the convert-tasks-to-linear skill to create all tasks in Linear project [project-slug]
put them all in Todo status
```

## Revisar PR con OpenHands

```text
Verify that this repo is ready for OpenSymphony's automated PR review flow.

Check:
- .github/workflows/ai-pr-review.yml
- .agents/skills/custom-codereview-guide.md
- AGENTS.md
- .github/pull_request_template.md
- docs/ai-pr-review-human-setup.md

Confirm the workflow is advisory, same-repo by default, requires PR Evidence, uses the AI_REVIEW_API_KEY secret, and documents the required GitHub variables and review-this label.
```

## Usar memoria para codebase understanding

```text
Use opensymphony memory to build context for issue [issue-id].

Run or propose the relevant commands:
- opensymphony memory context --issue [issue-id]
- opensymphony memory related --issue [issue-id]
- opensymphony memory related --paths [path]
- opensymphony memory search "[query]"
- opensymphony memory docs --area [area]

Summarize what prior work, invariants, validation patterns, and docs matter before implementation.
```

## Capturar memoria y sincronizar docs

```text
After issue [issue-id] is complete and its PR is merged, use opensymphony memory to preview capture and docs sync.

Run:
- opensymphony memory capture [issue-id] --dry-run
- opensymphony memory sync-docs --since-last-sync --dry-run
- opensymphony memory lint --public-docs

Report proposed capsules, docs impact, warnings, and the next safe command.
```
