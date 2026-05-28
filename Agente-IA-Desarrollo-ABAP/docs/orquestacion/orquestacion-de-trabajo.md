# Mapa de Orquestación de Trabajo — Agente IA ABAP

**Fecha**: 2026-05-27
**Estación 7**: Agentes de código · Orquestación, review y memoria
**Producto**: Pipeline FD → TD → Código ABAP (ver `prd.md`, `CLAUDE.md`)

---

## 1. Idea central

Convertir intención (un FD que llega del consultor) en trabajo coordinable, ejecutable y revisable, sin perder trazabilidad entre el documento original, el código generado, las pruebas y las decisiones humanas.

El producto vive como configuración de Claude Code; aun así, cada cambio sobre la configuración (sub-agentes, slash commands, skills, docs) se trata como un cambio de software: tiene scope, dependencias, validación, review y memoria.

---

## 2. Capas del sistema

| Capa | Pregunta que responde | En nuestro proyecto |
|---|---|---|
| **Intención** | ¿Qué unidad/feature entra? | FD del consultor + AI-DLC unit-of-work (U1..U6) o un Change Request (CR-001) |
| **Contexto** | ¿Qué debe leer el agente? | `CLAUDE.md`, `prd.md`, `docs/formato-fd-generico.md`, `aidlc-docs/`, ADRs |
| **Scope** | ¿Qué puede cambiar? | Restringido a `.claude/`, `docs/`, `aidlc-docs/<U>` salvo permiso explícito |
| **Dependencias** | ¿Qué bloquea a qué? | Orden U1 → U2 → U3 → U4 → U6 → U5 (ver `aidlc-docs/inception/application-design/unit-of-work.md`) |
| **Gestor de tareas** | ¿Dónde vive cada tarea? | Linear (cola publicada con `convert-tasks-to-linear`) + `docs/tasks/` (manifest local) |
| **Cola de trabajo** | ¿Qué se ejecuta ahora? | Tareas Linear en estado *Todo* del planning wave activo |
| **Arnés** | ¿Quién ejecuta? | Claude Code con sub-agentes `validador-fd`, `fd-a-td`, `td-a-codigo` y comandos `/validar-fd`, `/generar-td`, `/generar-abap`, `/pipeline-abap` |
| **Validación** | ¿Qué prueba pasa? | Syntax check + pruebas unitarias del desarrollador + pruebas funcionales con consultor + checklist `docs/checklist-auditoria-codigo-ia.md` |
| **Review** | ¿Qué se mira antes de merge? | AI PR Review advisory + revisión humana obligatoria (Principio #1 del PRD) |
| **Memoria** | ¿Qué queda para la próxima? | Capsules de issues completadas + sync a `docs/`/ADRs cuando estabiliza |

---

## 3. Flujo end-to-end

```text
Consultor entrega FD
        │
        ▼
AI-DLC artefacto (aidlc-docs/) ──► create-implementation-plan
        │                              │
        │                              ▼
        │                  docs/tasks/task-package.yaml
        │                  docs/tasks/milestones.md
        │                  docs/tasks/00X-*.md
        │                              │
        │                              ▼
        │                  validate + dry-run del manifest
        │                              │
        │                              ▼
        │                  convert-tasks-to-linear ──► Linear (Todo)
        │                                                 │
        │                                                 ▼
        ▼                                          Arnés toma issue
   /pipeline-abap ◄─────────────────────────────── (Claude Code)
        │                                                 │
        │                                                 ▼
        ▼                                          PR con Evidence
   outputs/<fecha>-<REQ>/                                 │
   fd.md, validacion.md,                                  ▼
   td.md, codigo.abap                              AI PR Review (advisory)
                                                          │
                                                          ▼
                                                  Revisión humana
                                                          │
                                                          ▼
                                                       Merge
                                                          │
                                                          ▼
                                                  Memory capture
                                                          │
                                                          ▼
                                                  Docs sync (cuando estabiliza)
```

---

## 4. Separación de roles

- **Arnés (Claude Code)**: ejecuta tareas dentro de una sesión con sub-agentes y comandos definidos en `.claude/`.
- **Gestor de tareas (Linear)**: mantiene la cola pública con milestones, blockers y sub-issues.
- **Workflow engine (OpenSymphony skills + AI-DLC)**: descompone intención en unidades operables. `create-implementation-plan` y `convert-tasks-to-linear` materializan el contrato.
- **Cola de trabajo (Linear board)**: refleja qué está en Todo, In Progress, In Review, Done.
- **Orquestador local (`/pipeline-abap`)**: encadena M1 → gate humano → M2 → gate humano → M3 dentro de la sesión.
- **Review (AI PR Review + humano)**: dos capas, AI advisory + humano gate de merge.
- **Memoria (`opensymphony memory`)**: convierte trabajo completado en contexto durable para futuras tareas.

> Estas capas son **intercambiables**. Si mañana cambias Linear por GitHub Issues o Beads, el contrato `task-package.yaml` no cambia; sólo el adaptador de publicación.

---

## 5. Señales que deben quedar trazables

Para que el sistema funcione como cola coordinable, cada tarea debe dejar rastro de:

1. Origen del cambio (FD, CR, refactor, bug).
2. Documentos AI-DLC que la justifican.
3. Scope tocado (archivos, sub-agentes, docs).
4. Dependencias declaradas (`blockedBy`, `blocks`, `parent`).
5. Acceptance criteria medibles.
6. Test plan ejecutable.
7. Evidence en el PR (comandos, output, riesgos, notas para reviewer).
8. Decisión de merge (humano explícito).
9. Memoria capturada (qué se aprendió, qué invariant apareció).
10. Docs que necesitan actualizarse.

---

## 6. Mapeo a entregables Estación 7

| Capa | Entregable concreto en este repo |
|---|---|
| Manifest | `docs/tasks/task-package.yaml` |
| Milestones | `docs/tasks/milestones.md` |
| Task files | `docs/tasks/00X-*.md` |
| Validación | `docs/tasks/validation-evidence.md` |
| Publicación a Linear | `docs/tasks/linear-publish.yaml` |
| Contrato del arnés | `AGENTS.md` (referencia a `CLAUDE.md`) |
| AI PR Review | `.github/workflows/ai-pr-review.yml`, `.github/pull_request_template.md`, `.agents/skills/custom-codereview-guide.md`, `docs/ai-pr-review-human-setup.md` |
| PR Evidence | `docs/tasks/pr-evidence-example.md` |
| Memoria | `docs/memory/memory-dry-run.md` |
| Docs evolutivos | `docs/memory/docs-evolution-proposal.md` |

---

## 7. Invariantes del sistema (no negociables)

Heredados del PRD §6 y trasladados a la orquestación:

- **Principio 1** — Ningún PR se mergea sin revisión humana. AI PR Review es advisory.
- **Principio 2** — Ningún FD entra al pipeline sin validación de M1 (gate del Validador). Igual aplica a CRs: si el CR no tiene scope claro, no entra a la cola.
- **Principio 3** — Ninguna tarea de la cola puede tocar SAP directamente.
- **Principio 4** — Las compuertas de calidad humanas (syntax check, pruebas unitarias, pruebas funcionales) no se reducen porque haya AI review.
- **Principio 5** — Toda tarea completada deja rastro: PR con Evidence + memoria capturada.
- **Principio 6** — Entre módulos del pipeline, esperar aprobación humana explícita. Sin autopilot.

---

## 8. Métricas de salud de la cola

- Lead time por tarea (entry → done).
- % de tareas que pasan AI review sin rework.
- % de tareas que necesitan más de 2 ciclos en M3.
- % de tareas con Evidence completa al primer push.
- Cobertura de memoria: % de issues `Done` con capsule capturada.
- Drift de docs: items en `docs-evolution-proposal.md` sin resolver.

---

## 9. Referencias

- `prd.md` — visión y métricas del producto.
- `CLAUDE.md` — configuración del agente y restricciones operativas.
- `aidlc-docs/inception/application-design/unit-of-work.md` — descomposición U1..U6.
- `aidlc-docs/aidlc-state.md` — estado AI-DLC actual (incluye CR-001 pendiente).
- `Estacion-7/estacion7-runbook.md` — runbook que origina este mapa.
- `Estacion-7/code-review-and-memory.md` — fundamentos de review y memoria.
