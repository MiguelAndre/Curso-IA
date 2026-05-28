---
id: TASK-003
title: Verificar lectura nativa de .pdf por Claude Code
milestone: "M1: Preparacion y verificacion de dependencias"
priority: 2
estimate: 1
blockedBy: []
blocks: [TASK-004]
parent: null
---

## Summary

El slash command `/validar-fd` (CR-001) confía en la capacidad nativa de Claude Code para leer PDFs vía la tool `Read`. Esta tarea verifica en sesión que la lectura del `.pdf` del dataset produce contenido completo y consultable por el sub-agente `validador-fd`.

## Scope

**Incluye**:

- Abrir una sesión Claude Code en la raíz del repo.
- Ejecutar `/validar-fd outputs/dataset-cr-001/fd-base.pdf` y registrar si la tool `Read` consume el archivo sin truncar.
- Si el PDF excede el limite documentado, dejar registro de la pagina maxima leida.

**Excluye**:

- Modificar el sub-agente; si el PDF no se lee bien, abrir defecto separado.

## Deliverables

1. Transcripción (o copy/paste) de los primeros mensajes de la sesión con el output del `Read` sobre el `.pdf`.
2. Comentario en el issue Linear con número de páginas del PDF y resultado.

## Acceptance Criteria

- AC1: El sub-agente `validador-fd` produce un veredicto (`APROBADO`/`RECHAZADO`) sobre el `.pdf`.
- AC2: El veredicto coincide con el del `.md` base (mismo dataset = mismo resultado).
- AC3: Si hay truncamiento por tamaño, queda documentado en el reporte.

## Test Plan

Manual, en sesión Claude Code:

```text
/validar-fd outputs/dataset-cr-001/fd-base.pdf
```

Comparar contra:

```text
/validar-fd outputs/dataset-cr-001/fd-base.md
```

Ambos veredictos deben coincidir.

## Context

- `.claude/agents/validador-fd.md` §5.1 — instrucciones de lectura de PDF.
- `.claude/commands/validar-fd.md` — orquesta la entrada al sub-agente.

## Definition of Ready

- [x] TASK-001 ha producido `outputs/dataset-cr-001/fd-base.pdf`.
- [x] Claude Code disponible en la maquina del desarrollador.
