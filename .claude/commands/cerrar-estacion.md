---
description: Cierra una estación del curso aplicando el checklist (README + glosarios + README raíz + commit). Uso: /cerrar-estacion <N> "<tema corto>"
argument-hint: "<numero> \"<tema corto>\""
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /cerrar-estacion

Aplica el flujo completo descrito en `docs/CHECKLIST-NUEVA-ESTACION.md` para incorporar una nueva estación al repo `Curso-IA`. Mantiene la estructura consistente con las estaciones 1–7 ya escritas.

---

## Argumentos esperados

- `<N>` — número de estación (ej. `8`).
- `<tema>` — descripción corta entre comillas (ej. `"MLOps y observabilidad"`).

Si los argumentos faltan o son ambiguos, **pregunta** antes de actuar.

---

## Flujo a ejecutar

### Paso 1 — Verificar precondiciones

1. Confirmar que existe `Estacion-N/` con material del curso. Si no existe o está vacía, **detener** y reportar.
2. Leer `docs/PLANTILLA-ESTACION-README.md` para tener el esqueleto en contexto.
3. Leer `docs/CHECKLIST-NUEVA-ESTACION.md` para tener el checklist en contexto.
4. Hacer `git status` y `git log -- Estacion-N/` para entender el estado actual.

### Paso 2 — Inventariar el material

Lanzar **sub-agente Explore** con un prompt similar a los usados para Estaciones 1–7 (ver `Estacion-3/README.md` como ejemplo de profundidad). El prompt debe pedir:

- Metadatos (instructor, duración, fechas de commits, prerequisitos).
- Tema y objetivo en términos concretos.
- Conceptos clave con definiciones operativas (no solo nombres).
- Material del curso (lista de archivos con contenido real, no genérico).
- Entregables propios en `Estacion-N/Tarea/` si existen.
- Aporte al proyecto central `Agente-IA-Desarrollo-ABAP/`.
- 2–4 lecciones / takeaways.

### Paso 3 — Componer `Estacion-N/README.md`

A partir del reporte del Explore y siguiendo la plantilla:

- Las 7 secciones obligatorias.
- Tono y formato consistente con las estaciones 1–7.
- Paths exactos en lugar de descripciones vagas.
- Longitud objetivo: 200–600 líneas según densidad real.

### Paso 4 — Glosarios centrales

- Identificar términos/siglas nuevos que aparecen en esta estación y no están en `docs/VOCABULARIO.md`.
- Añadirlos **en orden alfabético estricto** — recalcular posición exacta (no asumir).
- Si introdujo framework/protocolo nuevo: añadirlo a `docs/FRAMEWORKS.md` con repo oficial verificado (usar WebFetch para confirmar URL si no está claro).
- Si introdujo arnés/modelo nuevo: actualizar "Stack técnico" del README raíz.

### Paso 5 — Aporte al proyecto central

Si la estación incorpora algo al `Agente-IA-Desarrollo-ABAP/`:

1. **Listar** los archivos a crear/modificar antes de actuar.
2. **Pedir confirmación** al humano (no modificar el proyecto central de forma silenciosa).
3. Si toca PRD/CLAUDE.md/AGENTS.md, dejar nota correspondiente en `aidlc-docs/aidlc-state.md`.

### Paso 6 — Actualizar README raíz

- Añadir fila a "Índice rápido — navegación".
- Añadir fila a "Mi recorrido — qué hice, dónde quedó, con quién".
- Actualizar tabla "Estado del proyecto" si corresponde.
- Si el conteo total de estaciones cambió, actualizar el preámbulo.

### Paso 7 — Verificación

- `git status` final.
- Verificar links con Glob (que cada path nuevo exista).
- Lectura rápida del README nuevo con ojos de primer visitante.

### Paso 8 — Commit y push

- Stage solo los archivos relevantes (no usar `-A` indiscriminado para evitar arrastrar artefactos locales).
- Commit con formato:

  ```
  Estación N: <título corto> + aporte al proyecto

  - <bullet 1>
  - <bullet 2>
  ...

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

- **Pedir confirmación humana** antes de `git push origin main`. Sin push automático.

---

## Reglas duras

- **Nunca pushear sin confirmación humana explícita.**
- **Nunca modificar el proyecto central** (`Agente-IA-Desarrollo-ABAP/`) sin listar archivos antes y pedir aprobación.
- **Nunca añadir vocabulario al final** sin recalcular el orden alfabético — verificar posición exacta.
- **Si el material en `Estacion-N/` no está completo** (faltan slides, runbook, etc.), parar y reportar lo que falta.
- **Si una sección del README no aplica** ("la estación no tuvo Tarea", "no aporta al proyecto central"), escribir "N/A — <razón>" en lugar de inventar contenido.
- **Idioma**: español. Identificadores técnicos en su idioma original.
- **Sin emojis** salvo `⚠️` para riesgos / trade-offs.

---

## Ejemplos de invocación

```text
/cerrar-estacion 8 "MLOps y observabilidad"
/cerrar-estacion 9 "Evals y red teaming"
/cerrar-estacion 12 "Capstone y cierre"
```

---

## Output esperado (lo que el usuario debe ver al final)

1. Resumen ejecutivo: qué se creó, qué se modificó, qué quedó pendiente.
2. Commit hash y mensaje.
3. Estado del repo (`git status` limpio).
4. Pregunta: *"¿Hago push a origin/main?"*.
