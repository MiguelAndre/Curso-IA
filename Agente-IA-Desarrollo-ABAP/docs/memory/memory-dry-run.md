# Memory — Dry-run y formato de capsules

**Estación 7**: capa de memoria y codebase understanding.
**Modelo de referencia**: `opensymphony memory` (capture, related, search, docs, sync, lint).

Este documento define cómo capturamos memoria en el repo, da un dry-run sobre el primer issue de la planning wave `cr-001-u2-multiformato-revalidacion`, y deja la base para automatizar la captura cuando esté disponible la CLI.

---

## 1. Por qué capturar memoria

Cada tarea cerrada deja conocimiento operativo:

- Qué decisión técnica quedó probada.
- Qué invariant del codebase apareció.
- Qué validación fue útil.
- Qué review feedback se repitió.
- Qué docs quedaron desactualizadas.

Sin captura, el conocimiento muere en el chat de PR. Con captura, se vuelve consultable para futuras tareas y agentes.

---

## 2. Estructura local

```text
docs/memory/
├── README.md                       # (este archivo)
├── memory.yaml                     # índice de capsules
├── memory-dry-run.md               # registro de dry-runs
├── docs-evolution-proposal.md      # propuestas docs sync pendientes
└── capsules/
    ├── TASK-001.md
    ├── TASK-002.md
    └── ...
```

Cuando `opensymphony` esté instalado en el repo, este árbol pasará a `.opensymphony/memory/`. Mientras tanto, el formato manual sirve de base.

---

## 3. Formato de capsule (plantilla)

```markdown
---
issueId: TASK-001
linearId: DEV-101
title: Preparar dataset multi-formato
planningWave: cr-001-u2-multiformato-revalidacion
closedAt: 2026-MM-DD
pr: https://github.com/<org>/<repo>/pull/<n>
areas:
  - validador-fd
  - formato-fd
---

## Decisión validada
<qué decisión quedó probada y por qué>

## Invariant aparecido
<si esta tarea reveló un invariant del codebase, anotarlo aquí>

## Validación útil
<qué prueba, comando o checklist resultó valioso reusable>

## Review feedback recurrente
<si el AI o un humano marcó algo que ya se había marcado antes, citarlo>

## Docs impactadas
- [ ] `docs/X.md` — <qué actualizar>
- [ ] `CLAUDE.md` §N — <qué actualizar>

## Snippets / artefactos
<comandos, queries, fragmentos relevantes>
```

---

## 4. Dry-run sobre TASK-001 (ejemplo)

```bash
# Comando ideal (cuando opensymphony esté disponible)
opensymphony memory capture TASK-001 --dry-run
```

**Output proyectado** (manual, sin CLI):

```yaml
issueId: TASK-001
linearId: DEV-101  # pendiente publicar
title: Preparar dataset multi-formato
planningWave: cr-001-u2-multiformato-revalidacion
closedAt: TBD
sources:
  - linear narrative
  - PR description (Evidence)
  - workpad (sesión Claude Code)
  - aidlc-docs/aidlc-state.md (CR-001)
proposedCapsule: docs/memory/capsules/TASK-001.md
docsImpact:
  - docs/formato-fd-generico.md   # si el dataset reveló ambigüedades
  - docs/orquestacion/orquestacion-de-trabajo.md  # añadir referencia al dataset si se vuelve canónico
notes:
  - "Si se descubre que pandoc no maneja bien tablas complejas del .docx,
     anotar el patrón para futuros FDs y proponer límite documentado en
     formato-fd-generico.md"
warnings: []
```

---

## 5. Comandos de consulta (proyección)

Cuando la CLI exista, estos serán los comandos típicos para construir contexto de una tarea nueva sobre el mismo área:

```bash
opensymphony memory context --issue DEV-104
opensymphony memory related --issue DEV-104
opensymphony memory related --paths .claude/agents/validador-fd.md
opensymphony memory search "multi-formato pandoc"
opensymphony memory docs --area validador-fd
opensymphony memory sync-docs --since-last-sync --dry-run
opensymphony memory lint --public-docs
```

Mientras la CLI no esté, **el reemplazo manual** es:

- Búsqueda: `grep -r "<término>" docs/memory/capsules/`.
- Related by area: filtrar por `areas:` en el frontmatter.
- Docs impactados: revisar `docs/memory/docs-evolution-proposal.md`.

---

## 6. Reglas para llenar memoria

- **Capturar al cierre del issue**, no antes. Lo que captures pre-merge es ruido.
- **Una capsule por issue**. Si dos tareas comparten aprendizaje, referenciarlo, no duplicarlo.
- **Si la decisión es estable**, abrir item en `docs-evolution-proposal.md` para sincronizar a docs canónicos (ADR, `CLAUDE.md`, `formato-fd-generico.md`, etc.).
- **No subir PII**. Las capsules viven en el repo; aplican las mismas reglas que cualquier archivo versionado.
- **No copiar el PR completo**. El PR ya vive en GitHub. La capsule guarda *el aprendizaje*, no el diff.

---

## 7. Próximos pasos

- [ ] Cuando el primer issue del planning wave cierre, escribir su capsule en `docs/memory/capsules/`.
- [ ] Crear `docs/memory/memory.yaml` como índice (puede inicializarse vacío).
- [ ] Evaluar instalar la CLI `opensymphony` para automatizar capture y sync (decisión en `docs/memory/docs-evolution-proposal.md`).
