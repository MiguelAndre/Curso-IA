---
id: TASK-004
title: Re-ejecutar /validar-fd sobre los 4 formatos del dataset
milestone: "M2: Re-validacion funcional y cierre del CR"
priority: 1
estimate: 3
blockedBy: [TASK-001, TASK-002, TASK-003]
blocks: [TASK-005]
parent: null
---

## Summary

Núcleo del re-test del CR-001. Ejecutar `/validar-fd` sobre las 4 representaciones del mismo FD y verificar que el veredicto es consistente. Cualquier divergencia entre formatos es defecto.

## Scope

**Incluye**:

- 4 ejecuciones del slash command, una por formato del dataset.
- Comparación lado a lado de los 4 veredictos.
- Registro de tiempos, tokens (si visible) y observaciones cualitativas (claridad del reporte de gaps, fidelidad de la conversión).

**Excluye**:

- Modificaciones al Validador. Esta tarea valida; no implementa.

## Deliverables

1. `outputs/dataset-cr-001/run-md.md` — output del Validador para `.md`.
2. `outputs/dataset-cr-001/run-txt.md` — output del Validador para `.txt`.
3. `outputs/dataset-cr-001/run-pdf.md` — output del Validador para `.pdf`.
4. `outputs/dataset-cr-001/run-docx.md` — output del Validador para `.docx`.
5. `outputs/dataset-cr-001/comparison.md` — tabla de comparación de veredictos.

## Acceptance Criteria

- AC1: Existen los 4 archivos `run-*.md`.
- AC2: Los 4 veredictos son idénticos (`APROBADO` o `RECHAZADO` consistente).
- AC3: Si hay reporte de gaps, las gaps citan las mismas secciones en los 4 formatos.
- AC4: `comparison.md` contiene una tabla con columnas: formato, veredicto, secciones-faltantes, observaciones.

## Test Plan

En sesión Claude Code, ejecutar secuencialmente:

```text
/validar-fd outputs/dataset-cr-001/fd-base.md
/validar-fd outputs/dataset-cr-001/fd-base.txt
/validar-fd outputs/dataset-cr-001/fd-base.pdf
/validar-fd outputs/dataset-cr-001/fd-base.docx
```

Copiar cada output a su archivo correspondiente y producir la tabla de comparación.

## Context

- `aidlc-docs/construction/build-and-test/integration-test-instructions.md` — pauta original de los tests de integración del Validador.
- `aidlc-docs/aidlc-state.md` — CR-001 multi-formato, re-test pendiente.
- `.claude/agents/validador-fd.md` — sub-agente bajo prueba.

## Definition of Ready

- [ ] TASK-001 completada (dataset existe).
- [ ] TASK-002 completada (pandoc verificado).
- [ ] TASK-003 completada (lectura PDF verificada).
