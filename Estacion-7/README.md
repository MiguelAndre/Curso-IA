# Estación 7 — Orquestación, code review y memoria

> Del backlog al cambio verificable. **Continuación de implementación con arneses**: taxonomía de sistemas de orquestación, **OpenSymphony** como ejemplo concreto para convertir AI-DLC en una cola en Linear, **code review automatizado** y **memoria de proyecto** que evoluciona con el código.

> 📦 Mi entrega vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/docs/orquestacion/`](../Agente-IA-Desarrollo-ABAP/docs/orquestacion/), [`../Agente-IA-Desarrollo-ABAP/docs/tasks/`](../Agente-IA-Desarrollo-ABAP/docs/tasks/), [`../Agente-IA-Desarrollo-ABAP/docs/memory/`](../Agente-IA-Desarrollo-ABAP/docs/memory/) y `../Agente-IA-Desarrollo-ABAP/.github/`.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Leonardo González |
| Duración | ≈ 2 h |
| Foco | Taxonomía de orquestación · OpenSymphony · review automatizado · memoria · documentación evolutiva |
| Prerequisitos | Artefactos AI-DLC de Inception + Construction, repo objetivo o sandbox, `PRODUCT.md`/`DESIGN.md` si hay UI, contexto del arnés (`AGENTS.md`) |
| Commit relevante | `a5ae5e8` — añade entregables de Estación 7 al proyecto en raíz |

---

## 2. Tema y objetivo de aprendizaje

Convertir intención (un FD, un CR, una feature) en una **cola coordinable, ejecutable y revisable**, sin perder trazabilidad entre el documento original, el código, las pruebas y las decisiones.

Cinco capas:

1. **Orquestación de trabajo** — separar arnés / gestor de tareas / workflow engine / cola / orquestador.
2. **OpenSymphony** como sistema ejemplo: planning wave, manifest, milestones, task files.
3. **Demo AI-DLC → Linear** usando los skills `create-implementation-plan` y `convert-tasks-to-linear`.
4. **Code review automatizado** (OpenHands PR Review) como capa de control temprano.
5. **Memoria evolutiva** — cada issue cerrado deja conocimiento; los aprendizajes estables sincronizan a docs canónicos.

---

## 3. Conceptos clave

### 3.1 Capas del sistema de orquestación

| Capa | Pregunta que responde |
|---|---|
| **Intención** | ¿Qué unidad/feature/CR entra? |
| **Contexto** | ¿Qué specs/docs/código debe leer el agente? |
| **Scope** | ¿Qué puede cambiar y qué queda reservado? |
| **Dependencias** | ¿Qué trabajo bloquea a otro? |
| **Ejecución (arnés)** | ¿Qué arnés toma la tarea? |
| **Validación** | ¿Qué prueba/evidencia decide avance? |
| **Review** | ¿Qué feedback llega antes del merge? |
| **Memoria** | ¿Qué aprendizaje queda disponible para futuras tareas? |

### 3.2 Contrato OpenSymphony

```text
docs/tasks/task-package.yaml        ← manifest de la planning wave
docs/tasks/milestones.md            ← lista de milestones
docs/tasks/001-*.md                 ← task files con frontmatter contractual
docs/tasks/002-*.md
...
```

`task-package.yaml` mantiene `planningWave`, `tasksDir`, `milestones`, `tasks`.

Cada task file lleva en frontmatter: `id`, `title`, `milestone`, `priority`, `estimate`, `blockedBy`, `blocks`, `parent`. Y en el cuerpo: **Summary · Scope · Deliverables · Acceptance Criteria · Test Plan · Context · Definition of Ready**.

### 3.3 AI PR Review

- Rol **advisory**: aprobación humana sigue siendo el gate de merge.
- Foco: correctness, seguridad, compatibilidad, migraciones, integridad de datos, concurrencia, retries, tests, mantenibilidad.
- Requisitos del PR: sección `## Evidence` con comandos ejecutados, output, AC cumplidos, riesgos conocidos.
- Implementación de referencia: **OpenHands PR Review** sobre PRs same-repo. Fork PRs requieren rediseño de seguridad explícito.

### 3.4 Memoria evolutiva

`opensymphony memory` convierte issues cerrados en **capsules** consultables:

```bash
opensymphony memory capture <issue> --dry-run
opensymphony memory context --issue <issue>
opensymphony memory related --paths <path>
opensymphony memory search "<query>"
opensymphony memory docs --area <area>
opensymphony memory sync-docs --since-last-sync --dry-run
opensymphony memory lint --public-docs
```

Las capsules viven en `.opensymphony/memory/` (o `docs/memory/` si todavía no hay CLI). Los aprendizajes estables se promueven a docs canónicos vía propuestas en `docs-evolution-proposal.md`.

### 3.5 Cadena completa

```text
Linear issue → arnés → PR (con Evidence) → AI PR Review → merge → memory capture → docs sync → codebase understanding
```

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `README.md` | Guía general, qué hay, qué se aprende, tarea. |
| `estacion7-runbook.md` | Runbook estudiante: 8 secciones desde "diseña la orquestación" hasta "checklist de entrega". |
| `opensymphony-linear-demo.md` | Demo paso a paso: AI-DLC → `task-package.yaml` → validate → dry-run → Linear → memory dry-run. |
| `code-review-and-memory.md` | Guía conceptual: por qué importa el review automatizado, qué pedir al sistema, OpenSymphony como ejemplo, codebase understanding. |
| `prompts.md` | Prompts reutilizables: crear plan, convertir a Linear, revisar PR con OpenHands, usar memoria, capturar memoria + docs sync. |
| `slides/` | Storyboard de slides. |

---

## 5. Mi entrega — aplicación al proyecto ABAP

Como la planning wave necesitaba trabajo pendiente real, elegí el **CR-001** que estaba abierto desde Estación 4 (Validador multi-formato `.md`/`.txt`/`.pdf`/`.docx`) como caso piloto. Todo el paquete vive en el proyecto en raíz.

### 5.1 Planning wave creada

`planningWave: cr-001-u2-multiformato-revalidacion` con 2 milestones y 6 tareas:

| ID | Título | Milestone | Blocks |
|---|---|---|---|
| TASK-001 | Preparar dataset multi-formato | M1 | TASK-004 |
| TASK-002 | Verificar conversión pandoc para `.docx` | M1 | TASK-004 |
| TASK-003 | Verificar lectura nativa de `.pdf` | M1 | TASK-004 |
| TASK-004 | Re-ejecutar `/validar-fd` sobre 4 formatos | M2 | TASK-005 |
| TASK-005 | Actualizar `build-and-test-summary` con CR-001 | M2 | TASK-006 |
| TASK-006 | Marcar CR-001 cerrado en `aidlc-state.md` | M2 | — |

### 5.2 Archivos producidos

```
../Agente-IA-Desarrollo-ABAP/
├── AGENTS.md                                       (Estación 6, reforzado aquí)
├── docs/
│   ├── orquestacion/orquestacion-de-trabajo.md     ← mapa del sistema
│   ├── tasks/
│   │   ├── task-package.yaml                       ← manifest OpenSymphony
│   │   ├── milestones.md
│   │   ├── 001-preparar-dataset-multiformato.md
│   │   ├── 002-verificar-conversion-pandoc-docx.md
│   │   ├── 003-verificar-lectura-pdf-nativa.md
│   │   ├── 004-reejecutar-validar-fd-cuatro-formatos.md
│   │   ├── 005-actualizar-build-and-test-summary.md
│   │   ├── 006-cerrar-cr-001-aidlc-state.md
│   │   ├── validation-evidence.md                  ← validate + dry-run
│   │   ├── linear-publish.yaml                     ← mapping TASK-* ↔ Linear (TBD hasta publicar)
│   │   └── pr-evidence-example.md                  ← guía + ejemplo de PR con Evidence
│   ├── memory/
│   │   ├── memory-dry-run.md                       ← formato de capsules + dry-run
│   │   ├── memory.yaml                             ← índice
│   │   └── docs-evolution-proposal.md              ← backlog de propuestas docs sync
│   └── ai-pr-review-human-setup.md                 ← secrets, vars, SHA pinning, branch protection
├── .github/
│   ├── workflows/ai-pr-review.yml                  ← workflow advisory
│   └── pull_request_template.md                    ← plantilla con Evidence obligatoria
└── .agents/skills/custom-codereview-guide.md       ← guía custom del AI review
```

### 5.3 Decisiones de la implementación

- **AGENTS.md neutral + CLAUDE.md específico**: el contrato del arnés se separa en dos archivos. AGENTS.md es para cualquier arnés (Claude/Codex/OpenHands); CLAUDE.md mantiene lo específico de Claude Code.
- **CR-001 como caso real**: en lugar de un planning wave de juguete, usé un CR pendiente real del proyecto. Eso obliga a que los task files sean ejecutables, no decorativos.
- **AI PR Review en modo `same-repo only`**: PRs desde forks no disparan el review. Decisión de seguridad documentada en `ai-pr-review-human-setup.md`.
- **Memory sin CLI todavía**: como la CLI `opensymphony` no está instalada, dejé el formato y el dry-run documentados. La captura real se hará manualmente con la plantilla cuando cierre el primer issue.

---

## 6. Aporte al proyecto central

Esta estación agregó la **capa de orquestación, review y memoria** que faltaba al proyecto. Tras Estación 7, el repo está listo para:

- Generar nuevas planning waves automáticamente desde AI-DLC artifacts.
- Publicar a Linear con `convert-tasks-to-linear`.
- Recibir AI PR Review advisory en cada PR.
- Capturar memoria por issue cerrado y sincronizar a docs canónicos.

### 6.1 Pendientes operativos (no técnicos)

| Pendiente | Dónde | Estimado |
|---|---|---|
| Setup humano del AI PR Review en GitHub (secrets, vars, label, branch protection, SHA pinning) | `../Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md` | ~1 h |
| Publicar planning wave a Linear y completar `linear-publish.yaml` | comando `convert-tasks-to-linear apply` | ~30 min |
| Ejecutar TASK-001..006 y cerrar CR-001 | Claude Code sobre el repo | ≤ 9 unidades de esfuerzo |
| Capturar memoria del primer issue cerrado | `docs/memory/capsules/` | continuo |

---

## 7. Lecciones / takeaways

1. **Orquestación es separación de responsabilidades.** Cuando se distinguen arnés / gestor de tareas / workflow / cola / review / memoria, cada capa se puede cambiar sin romper las demás. Linear se podría reemplazar por GitHub Issues sin tocar el `task-package.yaml`.

2. **Evidence en cada PR convierte el review en señal de alta calidad.** Sin Evidence (comandos, output, AC cumplidos), el AI review tiene que adivinar; con Evidence, comenta sobre el cambio real. Por eso el workflow falla si la sección falta.

3. **Memoria evolutiva es lo que hace que el siguiente PR sea más fácil que el anterior.** Cada issue cerrado deja una capsule. Cuando empieza la siguiente tarea sobre el mismo área, el agente puede consultar contexto previo (decisiones probadas, invariants, review feedback recurrente) en lugar de redescubrir todo.

---

## Referencias rápidas

- Material del curso:
  - Runbook: [`estacion7-runbook.md`](estacion7-runbook.md)
  - Demo: [`opensymphony-linear-demo.md`](opensymphony-linear-demo.md)
  - Guía conceptual: [`code-review-and-memory.md`](code-review-and-memory.md)
  - Prompts: [`prompts.md`](prompts.md)
- Mi entrega (en el proyecto central):
  - Mapa de orquestación: [`../Agente-IA-Desarrollo-ABAP/docs/orquestacion/orquestacion-de-trabajo.md`](../Agente-IA-Desarrollo-ABAP/docs/orquestacion/orquestacion-de-trabajo.md)
  - Planning wave: [`../Agente-IA-Desarrollo-ABAP/docs/tasks/`](../Agente-IA-Desarrollo-ABAP/docs/tasks/)
  - Memoria: [`../Agente-IA-Desarrollo-ABAP/docs/memory/`](../Agente-IA-Desarrollo-ABAP/docs/memory/)
  - AI PR Review setup: [`../Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md`](../Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md)
  - Workflow: [`../Agente-IA-Desarrollo-ABAP/.github/workflows/ai-pr-review.yml`](../Agente-IA-Desarrollo-ABAP/.github/workflows/ai-pr-review.yml)
