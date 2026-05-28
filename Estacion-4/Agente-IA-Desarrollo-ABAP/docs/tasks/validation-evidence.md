# Validation & Dry-Run Evidence — Planning Wave `cr-001-u2-multiformato-revalidacion`

**Fecha**: 2026-05-27
**Manifest**: `docs/tasks/task-package.yaml`
**Validador**: skill `convert-tasks-to-linear` de `kumanday/OpenSymphony-template`.

Este documento deja rastro de la validación humana del paquete y del dry-run previo a publicar en Linear. Se completa antes de TASK-001 y se actualiza si el manifest cambia.

---

## 1. Revisión humana del paquete (checklist)

Aplicada sobre `docs/tasks/task-package.yaml` + task files:

- [x] Cada tarea del manifest existe como `.md` en `docs/tasks/`.
- [x] Cada milestone del frontmatter aparece en la lista del manifest.
- [x] `blockedBy`, `blocks` y `parent` referencian IDs válidos del propio paquete.
- [x] Cada tarea referencia los documentos de contexto que necesita (CLAUDE.md, AI-DLC, sub-agente, CR).
- [x] Acceptance criteria escritos en forma medible (existencia de archivos, conteo de secciones, igualdad de veredictos).
- [x] Test plans con comandos shell o pasos manuales reproducibles.
- [x] Tamaño de cada tarea cabe en una sesión Claude Code (estimate <= 3, sin macro-tareas).
- [x] La planning wave deja rastro claro del problema (CR-001) y de su cierre (TASK-006).
- [x] Ninguna tarea pide credenciales SAP o conexión a sistemas productivos (cumple Principio #3 del PRD).

**Resultado**: paquete listo para dry-run.

---

## 2. Comando de validación (esperado)

Si `convert-tasks-to-linear` está disponible en el repo, el comando canónico es:

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  validate \
  --manifest docs/tasks/task-package.yaml
```

**Output esperado**:

```text
[OK] manifest YAML parseable
[OK] tasksDir resolved: docs/tasks
[OK] 6 task files referenciados, 6 encontrados
[OK] milestones del manifest: 2
[OK] milestones referenciados en frontmatter: {"M1: Preparacion y verificacion de dependencias", "M2: Re-validacion funcional y cierre del CR"}
[OK] DAG sin ciclos (TASK-001..003 -> TASK-004 -> TASK-005 -> TASK-006)
[OK] blockedBy/blocks consistentes
[OK] frontmatter completo en cada task (id, title, milestone, priority, estimate, blockedBy, blocks, parent)
[OK] secciones obligatorias presentes: Summary, Scope, Deliverables, Acceptance Criteria, Test Plan, Context, Definition of Ready
[OK] paquete listo para dry-run
```

Si el skill no está instalado, dejar rastro escrito de esta validación realizada de forma manual (esta sección sirve como evidencia).

---

## 3. Dry-run de publicación (esperado)

```bash
uv run --script .agents/skills/convert-tasks-to-linear/scripts/convert_tasks_to_linear.py \
  dry-run \
  --manifest docs/tasks/task-package.yaml
```

**Mapeo proyectado** (sin tocar Linear):

| Local ID | Título | Milestone | Linear team | Linear project | blockedBy |
|---|---|---|---|---|---|
| TASK-001 | Preparar dataset multi-formato | M1 | (a definir) | agente-ia-abap | — |
| TASK-002 | Verificar conversion pandoc para .docx | M1 | (a definir) | agente-ia-abap | — |
| TASK-003 | Verificar lectura nativa de .pdf | M1 | (a definir) | agente-ia-abap | — |
| TASK-004 | Re-ejecutar /validar-fd sobre 4 formatos | M2 | (a definir) | agente-ia-abap | TASK-001, TASK-002, TASK-003 |
| TASK-005 | Actualizar build-and-test-summary | M2 | (a definir) | agente-ia-abap | TASK-004 |
| TASK-006 | Cerrar CR-001 en aidlc-state | M2 | (a definir) | agente-ia-abap | TASK-005 |

**Issues nuevos previstos**: 6
**Issues a actualizar**: 0 (planning wave inicial)
**Sub-issues bajo parent**: 0 (todas top-level por ahora)
**Relaciones de bloqueo a crear**: 4 (TASK-004 bloqueado por 001/002/003; TASK-005 por 004; TASK-006 por 005)

---

## 4. Decisiones registradas en este dry-run

- Mantener TASK-001/002/003 sin `parent` (no hay agrupador padre); las relaciones se expresan con `blocks`/`blockedBy`.
- Prioridades 1 sólo para TASK-001 (insumo crítico) y TASK-004 (núcleo del re-test). El resto en prioridad 2 para no saturar.
- Estimaciones conservadoras: total <= 9 unidades. Una sesión Claude Code por tarea como techo.

---

## 5. Siguiente paso

Pasar a publicación con `apply` (ver `docs/tasks/linear-publish.yaml` para el mapping post-publicación).

Si en este punto la auditoría detectara una inconsistencia, **no publicar**: corregir el manifest, re-correr validate + dry-run y actualizar este archivo con la nueva ronda.
