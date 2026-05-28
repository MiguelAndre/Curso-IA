---
id: TASK-002
title: Verificar conversion pandoc para .docx en el entorno local
milestone: "M1: Preparacion y verificacion de dependencias"
priority: 2
estimate: 1
blockedBy: []
blocks: [TASK-004]
parent: null
---

## Summary

El slash command `/validar-fd` (CR-001) convierte `.docx` a markdown vía `pandoc` antes de pasarlo al sub-agente. Esta tarea confirma que `pandoc` está instalado, accesible en el `PATH` y produce markdown legible para el Validador.

## Scope

**Incluye**:

- Verificar `pandoc --version`.
- Convertir el `.docx` del dataset (TASK-001) a markdown con el mismo comando que usa el slash command.
- Comparar la salida con el `.md` canónico (mismas 7 secciones detectables).

**Excluye**:

- Modificar el slash command. Si la conversión falla, abrir defecto separado.

## Deliverables

1. `outputs/dataset-cr-001/fd-base-from-docx.md` — output de la conversión pandoc.
2. Comentario en el issue Linear con `pandoc --version` y los comandos ejecutados.

## Acceptance Criteria

- AC1: `pandoc --version` responde con versión >= 2.0.
- AC2: La conversión produce un `.md` con tamaño > 0.
- AC3: Las 7 secciones detectables en el `.md` original también aparecen en el `.md` derivado.

## Test Plan

```bash
pandoc --version

pandoc outputs/dataset-cr-001/fd-base.docx \
  -f docx -t markdown \
  -o outputs/dataset-cr-001/fd-base-from-docx.md

grep -E "^## (Objetivo|Alcance|Reglas de Negocio|Tablas SAP|Criterios de Aceptacion|Casos Borde|Autorizaciones)" outputs/dataset-cr-001/fd-base-from-docx.md | wc -l
# Esperado: 7
```

## Context

- `.claude/commands/validar-fd.md` — declara la conversión `.docx` -> markdown vía pandoc.
- `aidlc-docs/aidlc-state.md` — referencia al CR-001 multi-formato.

## Definition of Ready

- [x] TASK-001 ha producido `outputs/dataset-cr-001/fd-base.docx`.
- [ ] Pandoc instalado y accesible (se valida en esta misma tarea).
