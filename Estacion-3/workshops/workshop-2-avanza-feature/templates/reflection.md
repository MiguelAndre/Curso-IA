# Reflexión · Workshop 2

> Template del commit message extendido al cerrar el workshop.
> Copia este contenido al editor de commit (`git commit`) o usa
> `git commit -F templates/reflection.md` y edítalo desde ahí.

---

feat({{módulo}}): {{descripción corta de la feature, < 70 chars}}

## Qué delegué

{{Describe en 1-2 líneas qué le pediste al agente.
Ejemplo: "Delegué la implementación del endpoint POST /api/customers/:id/notes
al subagente Plan, con el scope completo en docs/features/customer-notes.md
como input. En paralelo, lancé en Antigravity la generación de los tests E2E."}}

## A quién (qué herramienta de delegación)

{{Lista las herramientas que usaste y para qué.

- Subagente integrado: {{Plan / Explore / General-purpose}} — para {{qué}}
- Subagente custom: {{nombre}} — para {{qué}}
- Agent Team: {{cuántos teammates, qué hacía cada uno}}
- Antigravity: {{qué tarea ejecutó en paralelo}}}}

## Qué hizo bien el agente

{{Lista 2-3 cosas concretas que el agente resolvió correctamente.
Esto te sirve para reforzarlas en futuros prompts.

Ejemplo:
- Detectó que el schema Prisma tenía la relación Customer→Notes y reusó la sintaxis correcta
- Aplicó la convención de naming en español del AGENTS.md sin que se lo recordara
- Añadió validación de longitud con Zod siguiendo el patrón existente en otros endpoints}}

## Qué hice yo a mano (y por qué)

{{Lista 1-3 cosas que tuviste que ajustar manualmente, con la razón.

Ejemplo:
- Ajusté el handler para usar `getServerSession()` en vez de `getUser()` — el agente usó la API legacy porque no estaba documentada en AGENTS.md la migración
- Reemplacé el commit message generado por uno más específico — el agente tendía a ser genérico
- Añadí logging estructurado con pino — el agente usó console.log por defecto}}

## Una cosa que haría diferente la próxima vez

{{Una sola — la más importante. Esto es lo que vas a llevarte al W3 (si lo hay)
o a la implementación de la Clase 4.

Ejemplo: "Antes de delegar, voy a actualizar AGENTS.md con un ejemplo concreto
del patrón de auth con `getServerSession()`. Esto le ahorra al agente
adivinar y a mí los 5 minutos de reimplementación manual."}}

---

🤝 Workshop 2 · Hardcore AI 30X · Clase 3
