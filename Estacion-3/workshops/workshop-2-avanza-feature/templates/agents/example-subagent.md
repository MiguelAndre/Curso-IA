---
name: {{NOMBRE_DEL_SUBAGENTE}}
description: {{Una oración explicando qué hace este subagente y cuándo invocarlo. Esta descripción la lee Claude Code para decidir si activarlo automáticamente cuando la tarea calza.}}
model: {{sonnet | haiku | opus}}
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
context: {{shared | fork}}
---

# {{NOMBRE_DEL_SUBAGENTE}}

> Subagente custom para {{describe el dominio: implementar features pequeñas / revisar PRs / escribir tests / etc.}}

## Cuándo se usa

{{Describe los disparadores para invocar este subagente.

Ejemplo:
- Cuando hay una feature scope ya aprobada en docs/features/
- Cuando el cambio toca solo capas de aplicación (no schema de BD ni infra)
- Cuando los tests del módulo afectado pasan en main}}

## Qué hace

{{Describe el flujo que sigue el subagente. Sé específico.

Ejemplo:
1. Lee el scope en docs/features/<feature>.md
2. Lee AGENTS.md para entender convenciones del proyecto
3. Lee los archivos relacionados con la feature (handler, validador, types)
4. Implementa siguiendo los criterios de aceptación del scope
5. Añade los tests listados en la sección "Tests que la validan" del scope
6. Ejecuta `npm test` para confirmar que pasan
7. Devuelve un resumen de qué archivos tocó y qué tests añadió}}

## Qué NO hace

{{Lista explícita de cosas fuera de scope para este subagente.

Ejemplo:
- No toca prisma/schema.prisma (si la feature requiere cambios de schema, abortar y reportar)
- No instala dependencias nuevas (si una librería falta, reportar y esperar)
- No hace commits — deja todo staged
- No modifica .github/workflows/ ni archivos de configuración del proyecto}}

## Convenciones del proyecto que aplica

{{Resume las convenciones críticas del proyecto que el subagente debe respetar.
No copies todo AGENTS.md — solo las relevantes para el dominio del subagente.

Ejemplo:
- Naming: ver AGENTS.md sección 3
- Tests: Vitest, naming "should X when Y" en inglés, dependencias reales por defecto
- Validación: Zod en la frontera; tipos derivados con z.infer
- Errores HTTP: 400 con mensaje descriptivo, 401 sin body, 403 con razón, 404 sin body}}

## Output esperado

{{Describe qué formato de respuesta debe dar el subagente al terminar.

Ejemplo:
Al terminar, el subagente devuelve un mensaje con esta estructura:

### Archivos modificados
- `src/app/api/customers/[id]/notes/route.ts` (nuevo)
- `src/lib/validators/note.ts` (nuevo)
- `src/types/note.ts` (nuevo)
- `tests/api/notes.test.ts` (nuevo)

### Tests añadidos
- 3 happy paths · 2 casos de error · 1 edge case
- `npm test` pasa: 6/6 ok

### Riesgos detectados
- (si aplica) "El campo content puede tener emojis multi-byte. Validar con Buffer.byteLength en vez de length."}}
