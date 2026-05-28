# PR Evidence — Ejemplo y guía de ejecución

> Esta guía muestra cómo abrir un PR para una tarea de la planning wave `cr-001-u2-multiformato-revalidacion` cumpliendo el contrato de Evidence que exige el AI PR Review.

---

## 1. Flujo desde Linear al PR

1. **Tomar el issue**: en Linear, mover `DEV-XXX` (mapeado en `docs/tasks/linear-publish.yaml`) de `Todo` a `In Progress`. Asignárselo.
2. **Leer el task file**: `docs/tasks/00X-*.md` para entender Summary, Scope, AC y Test Plan.
3. **Crear branch**: `git checkout -b cr-001/<TASK-id>-<slug>` (ej. `cr-001/TASK-001-dataset-multiformato`).
4. **Ejecutar la tarea** dentro del scope declarado. Capturar comandos y outputs reales en una nota local.
5. **Commit pequeño y enfocado**: un PR por tarea, no más.
6. **Abrir PR usando `.github/pull_request_template.md`**. Llenar todas las secciones, especialmente `## Evidence`.
7. **Esperar al AI PR Review** (advisory). Resolver comentarios `blocker`/`major`.
8. **Pedir revisión humana**. Branch Protection exige 1 approval mínimo.
9. **Merge**. Mover issue Linear a `Done`.
10. **Memory capture**: escribir `docs/memory/capsules/TASK-XXX.md` siguiendo `docs/memory/memory-dry-run.md`.

---

## 2. Ejemplo completo: PR para TASK-001

> Reemplazar valores entre `<...>` por reales al momento de abrir.

### Título del PR

```text
[TASK-001] Preparar dataset multi-formato para re-test del Validador
```

### Cuerpo del PR (relleno)

```markdown
## Intención

Producir un dataset reproducible con un mismo FD en `.md`, `.txt`, `.pdf`, `.docx`
para que TASK-004 pueda re-validar el comportamiento multi-formato del Validador
sin ambigüedad entre representaciones.

## Issue / Tarea origen

- Linear: https://linear.app/<org>/issue/DEV-101
- Task file: `docs/tasks/001-preparar-dataset-multiformato.md`
- Planning wave: `cr-001-u2-multiformato-revalidacion`

## Scope tocado

- `outputs/dataset-cr-001/fd-base.md` (nuevo)
- `outputs/dataset-cr-001/fd-base.txt` (nuevo)
- `outputs/dataset-cr-001/fd-base.pdf` (nuevo)
- `outputs/dataset-cr-001/fd-base.docx` (nuevo)
- `outputs/dataset-cr-001/README.md` (nuevo)

> Nota: estos archivos viven en `outputs/` que está en `.gitignore`. El PR no
> los versiona; sí versiona el `docs/tasks/comparison-evidence-trail.md` que
> referencia el dataset y describe cómo regenerarlo.

## Decisiones técnicas

1. **FD canónico tomado de `docs/ejemplos/fd-reporte-materiales.md`**: ya estaba
   en el repo, no se inventó contenido nuevo (evita ruido en la re-validación).
2. **`.docx` generado desde `.md` con pandoc**: evita diferencias semánticas
   entre formatos. Alternativa rechazada: usar Word manualmente (riesgo de
   reformateo no determinista).
3. **`.pdf` generado con `pandoc + wkhtmltopdf`**: produce un PDF buscable
   (no escaneo). Necesario para que TASK-003 verifique lectura nativa.

## Evidence

### Comandos ejecutados

```bash
mkdir -p outputs/dataset-cr-001

cp docs/ejemplos/fd-reporte-materiales.md outputs/dataset-cr-001/fd-base.md

pandoc outputs/dataset-cr-001/fd-base.md \
  -f markdown -t plain \
  -o outputs/dataset-cr-001/fd-base.txt

pandoc outputs/dataset-cr-001/fd-base.md \
  -f markdown -t docx \
  -o outputs/dataset-cr-001/fd-base.docx

pandoc outputs/dataset-cr-001/fd-base.md \
  -f markdown -t pdf \
  --pdf-engine=wkhtmltopdf \
  -o outputs/dataset-cr-001/fd-base.pdf

ls -la outputs/dataset-cr-001/

grep -E "^## (Objetivo|Alcance|Reglas de Negocio|Tablas SAP|Criterios de Aceptacion|Casos Borde|Autorizaciones)" \
  outputs/dataset-cr-001/fd-base.md | wc -l
```

### Output / resultados

```text
$ ls -la outputs/dataset-cr-001/
-rw-r--r-- 1 user 1049089 12453 May 27 14:02 fd-base.docx
-rw-r--r-- 1 user 1049089  8190 May 27 14:01 fd-base.md
-rw-r--r-- 1 user 1049089 84112 May 27 14:03 fd-base.pdf
-rw-r--r-- 1 user 1049089  6920 May 27 14:02 fd-base.txt

$ grep ... | wc -l
7
```

### Acceptance Criteria cumplidos

- [x] AC1: existen los 4 archivos en `outputs/dataset-cr-001/` con tamaño > 0.
- [x] AC2: las 7 secciones del formato genérico aparecen en el `.md` base
  (verificado por grep; verificación visual de los otros 3 formatos
  documentada en `outputs/dataset-cr-001/README.md`).
- [x] AC3: `outputs/dataset-cr-001/README.md` documenta herramientas
  (pandoc 3.1.11, wkhtmltopdf 0.12.6) y fecha (2026-05-27).

## Riesgos conocidos

- `wkhtmltopdf` está deprecado upstream; futuras tareas pueden requerir
  cambiar a `weasyprint` o `prince`. Anotado en PROP candidate para docs.
- El `.docx` generado por pandoc no incluye headers/footers, lo cual puede
  diferir de FDs reales del consultor. Mitigación: TASK-002 prueba la conversión
  inversa para confirmar fidelidad de las 7 secciones.

## Notas para reviewer humano

- Validar que el FD canónico elegido (`fd-reporte-materiales.md`) es el
  representativo del tipo de FD que el equipo recibe habitualmente.
- Revisar que `outputs/` sigue ignorado en `.gitignore` después de este PR.

## Límites de cobertura

- No probamos PDFs escaneados (sólo PDFs vectoriales / buscables).
- No probamos `.docx` con macros, control de cambios activo, o tablas complejas
  embebidas — quedan para una iteración futura si aparece un FD real con esas
  características.

## Principios del PRD aplicables

- [x] **#1** Sin merge automático (este PR exige approval humano).
- [ ] **#2** N/A — no se modifica el Validador.
- [x] **#3** Sin conexión SAP — sólo conversión local de archivos.
- [x] **#4** Pruebas humanas intactas — TASK-004 ejecuta `/validar-fd` real.
- [x] **#5** Trazabilidad — dataset documentado paso a paso.
- [ ] **#6** N/A — no afecta el pipeline.

## Memoria y docs

- [ ] Memory capsule prevista: `docs/memory/capsules/TASK-001.md` (al cerrar).
- [x] Propuesta de docs sync registrada: `PROP-001` y `PROP-002` en
  `docs/memory/docs-evolution-proposal.md`.
```

---

## 3. Qué espera ver el AI PR Review en este PR

Según `.agents/skills/custom-codereview-guide.md`, el AI prestará atención a:

- Que **Evidence existe y está completa**. (Bloquearía si no, gracias a `AI_REVIEW_REQUIRE_EVIDENCE=true`).
- Que el PR **no toca zonas sensibles** sin justificarlo (en este caso no modifica `.claude/`, `CLAUDE.md`, etc.).
- Que ningún comando ejecutado expone secrets o intenta conectar a SAP.
- Que los AC del task file se mapean a checkmarks reales del PR.

Comentarios esperados (en este ejemplo): probablemente `[nit]` o `[needs-human · minor]` sobre la elección de `wkhtmltopdf`. Nada bloqueante.

---

## 4. Qué espera ver el reviewer humano

- El PR cabe en una revisión < 10 min.
- Los AC del task file se cumplen y se referencian con evidencia concreta.
- El diff no introduce archivos fuera de scope.
- Si el AI marca algo `[blocker]`, está resuelto o explícitamente disputado en el hilo.

---

## 5. Tras el merge

```bash
# Cerrar el issue Linear (manual o vía CLI Linear si está instalada)
# Capturar la memoria
cat > docs/memory/capsules/TASK-001.md <<'EOF'
---
issueId: TASK-001
linearId: DEV-101
title: Preparar dataset multi-formato
planningWave: cr-001-u2-multiformato-revalidacion
closedAt: 2026-05-27
pr: <url del PR>
areas:
  - validador-fd
  - formato-fd
---

## Decisión validada
El dataset canónico debe nacer del mismo `.md` y derivarse a otros formatos
con pandoc. Generar a mano cada formato introduce variabilidad no controlada.

## Invariant aparecido
`outputs/` está en `.gitignore`. Los datasets reproducibles se documentan en
`docs/` con instrucciones para regenerarlos, no se versionan los binarios.

## Validación útil
`grep -E "^## (Objetivo|...|Autorizaciones)" | wc -l` como smoke test
estructural para FDs en markdown.

## Docs impactadas
- [ ] `docs/formato-fd-generico.md` — anexo sobre dataset (PROP-001).
- [ ] `README.md` — prerrequisito pandoc (PROP-002).
EOF
```

Actualizar el índice de memoria:

```yaml
# docs/memory/memory.yaml
capsules:
  - issueId: TASK-001
    linearId: DEV-101
    file: docs/memory/capsules/TASK-001.md
    closedAt: 2026-05-27
    areas: [validador-fd, formato-fd]
    pr: <url>
```

---

## 6. Referencias

- `.github/pull_request_template.md` — plantilla canónica.
- `.agents/skills/custom-codereview-guide.md` — qué mira el AI review.
- `docs/ai-pr-review-human-setup.md` — setup del workflow.
- `docs/memory/memory-dry-run.md` — formato de capsules.
- `docs/tasks/001-preparar-dataset-multiformato.md` — task file de origen.
