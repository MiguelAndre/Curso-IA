---
id: TASK-001
title: Preparar dataset multi-formato para re-test del Validador
milestone: "M1: Preparacion y verificacion de dependencias"
priority: 1
estimate: 2
blockedBy: []
blocks: [TASK-004]
parent: null
---

## Summary

Crear un dataset de prueba con un mismo FD representado en los 4 formatos que el CR-001 obliga a soportar (`.md`, `.txt`, `.pdf`, `.docx`). El dataset es el insumo de TASK-004; sin él, la re-validación no es reproducible.

## Scope

**Incluye**:

- Crear carpeta `outputs/dataset-cr-001/` (no se versiona; queda fuera de git por `.gitignore`).
- Tomar un FD existente del repo (sugerido: el más completo de `docs/ejemplos/` o uno sintético sencillo) y generar 4 versiones equivalentes en `.md`, `.txt`, `.pdf` y `.docx`.
- Verificar que las 4 versiones contienen las mismas 7 secciones obligatorias del formato genérico (`docs/formato-fd-generico.md`).

**Excluye**:

- Generar FDs nuevos con contenido distinto entre formatos (riesgo de falsos negativos en la re-validación).
- Tocar código del sub-agente o slash command.

## Deliverables

1. `outputs/dataset-cr-001/fd-base.md` — FD canónico (fuente).
2. `outputs/dataset-cr-001/fd-base.txt` — exportación a texto plano.
3. `outputs/dataset-cr-001/fd-base.pdf` — exportación PDF.
4. `outputs/dataset-cr-001/fd-base.docx` — exportación DOCX.
5. `outputs/dataset-cr-001/README.md` — descripción del dataset, fecha, herramienta usada para cada conversión.

## Acceptance Criteria

- AC1: Los 4 archivos existen en `outputs/dataset-cr-001/` y tienen tamaño > 0.
- AC2: Una inspección visual confirma que las 7 secciones del formato genérico están presentes en cada archivo.
- AC3: `outputs/dataset-cr-001/README.md` documenta qué herramienta produjo cada archivo y la fecha de conversión.

## Test Plan

```bash
# Verificar existencia y tamaño
ls -la outputs/dataset-cr-001/

# Verificar que las 7 secciones aparecen en el .md base
grep -E "^## (Objetivo|Alcance|Reglas de Negocio|Tablas SAP|Criterios de Aceptacion|Casos Borde|Autorizaciones)" outputs/dataset-cr-001/fd-base.md | wc -l
# Output esperado: 7
```

Inspección manual de `.pdf` y `.docx` con visor para confirmar las 7 secciones.

## Context

- `docs/formato-fd-generico.md` — define las 7 secciones obligatorias.
- `aidlc-docs/aidlc-state.md` — registro del CR-001 y su scope.
- `.claude/agents/validador-fd.md` §1, §5.1, §9 — comportamiento esperado del Validador frente a cada formato.

## Definition of Ready

- [x] Existe `docs/formato-fd-generico.md`.
- [x] CR-001 implementado en `validador-fd.md` y `validar-fd.md`.
- [x] El desarrollador tiene Word o LibreOffice disponible para producir `.docx` (o se usará pandoc).
