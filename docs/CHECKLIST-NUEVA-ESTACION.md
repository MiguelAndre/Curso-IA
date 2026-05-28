# Checklist — incorporar una nueva estación al repo

Aplicar este checklist cada vez que se cierra una estación nueva del curso. Sirve para no olvidar pasos transversales (glosarios, README raíz, estado del proyecto).

> Para invocarlo automáticamente desde Claude Code: `/cerrar-estacion <N> "<tema>"`. El slash command vive en `.claude/commands/cerrar-estacion.md` y aplica este checklist guiándose por la plantilla `docs/PLANTILLA-ESTACION-README.md`.

---

## A. Estructura local de la estación

- [ ] Crear `Estacion-N/` con material del curso (slides PDF, runbook, prompts, ejemplos).
- [ ] Si hay entregable propio, crear `Estacion-N/Tarea/` con archivos producidos.
- [ ] Copiar [`PLANTILLA-ESTACION-README.md`](PLANTILLA-ESTACION-README.md) → `Estacion-N/README.md`.
- [ ] Rellenar las 7 secciones (metadatos · tema · conceptos clave · material · mi entrega · aporte al proyecto · lecciones).
- [ ] Verificar consistencia visual con otras estaciones (tablas, tono, longitud).

## B. Proyecto central (`Agente-IA-Desarrollo-ABAP/`)

- [ ] Identificar qué aporta esta estación al producto (nuevos sub-agentes, skills, docs, decisiones).
- [ ] Listar archivos a tocar **antes** de modificar — confirmar con humano.
- [ ] Si toca PRD/CLAUDE.md/AGENTS.md: dejar nota en `aidlc-docs/aidlc-state.md`.
- [ ] Si introduce CR (Change Request): registrarlo en `aidlc-state.md`.
- [ ] Si genera entregables grandes, considerar carpeta dedicada (ej. `docs/orquestacion/`, `docs/memory/`).

## C. Glosarios centrales

- [ ] Listar términos/siglas nuevas introducidas en la estación.
- [ ] Añadirlos a [`docs/VOCABULARIO.md`](VOCABULARIO.md) **en orden alfabético estricto** (revisar posición exacta).
- [ ] Si introdujo framework/metodología/protocolo nuevo: añadirlo a [`docs/FRAMEWORKS.md`](FRAMEWORKS.md) con repo oficial.
- [ ] Si introdujo arnés/herramienta nueva: actualizar "Stack técnico" del README raíz.
- [ ] Verificar que el "Resumen — qué usar en cada momento" de `FRAMEWORKS.md` siga vigente.

## D. README raíz

- [ ] Añadir fila a tabla "Índice rápido — navegación" (carpeta + tema + link al README).
- [ ] Añadir fila a tabla "Mi recorrido — qué hice, dónde quedó, con quién" (aporte + entregable + instructor).
- [ ] Si cambió el estado del producto: actualizar tabla "Estado del proyecto".
- [ ] Si cambió el conteo total de estaciones: actualizar el preámbulo ("7 estaciones" → "8 estaciones", etc.).

## E. Verificación de links

- [ ] `git status` — revisar todo lo nuevo/modificado.
- [ ] Verificar con Glob que los archivos referenciados existen:
  - `Estacion-N/` y `Estacion-N/README.md`
  - Archivos del proyecto central que apunten desde el README de la estación
- [ ] Lectura "ojos de primer visitante": ¿una persona que entra hoy entiende qué hace esta estación?

## F. Cierre

- [ ] **Commit único** con formato:
  ```
  Estación N: <título corto> + aporte al proyecto
  
  - <bullet 1>
  - <bullet 2>
  
  Co-Authored-By: ...
  ```
- [ ] Pedir confirmación humana antes de `git push origin main`.
- [ ] Push.
- [ ] Si hay tareas o follow-ups que no entran en esta estación, crear issues / abrir CR.

---

## Anti-patrones (NO hacer)

- ❌ Modificar el proyecto central sin listar archivos primero.
- ❌ Añadir términos al vocabulario sin revisar orden alfabético.
- ❌ Pushear sin confirmación humana.
- ❌ Crear archivos `*-v2.md`, `*-old.md`, `*-backup.md`. Usar git para versionar.
- ❌ Duplicar entregables del proyecto central en `Estacion-N/Tarea/`. Mejor referenciar.
- ❌ Inflar el README de la estación con info que ya está en `docs/VOCABULARIO.md` o `docs/FRAMEWORKS.md`. Referenciar.

---

## Referencias

- Plantilla: [`PLANTILLA-ESTACION-README.md`](PLANTILLA-ESTACION-README.md)
- Slash command: [`../.claude/commands/cerrar-estacion.md`](../.claude/commands/cerrar-estacion.md)
- Vocabulario: [`VOCABULARIO.md`](VOCABULARIO.md)
- Frameworks: [`FRAMEWORKS.md`](FRAMEWORKS.md)
- Ejemplos vivos: cualquier `Estacion-N/README.md` (estaciones 1–7).
