# Instrucciones específicas para Claude Code · Basic CRM 30X

> **Source of truth del proyecto:** [`AGENTS.md`](./AGENTS.md). Léelo siempre primero.
> Este archivo añade configuración propia de Claude Code que no es portable a otros agentes.

---

## Cómo arrancar una sesión

Al inicio de cualquier sesión nueva:

1. Lee `AGENTS.md` completo — tiene el contexto del producto, arquitectura y convenciones
2. Revisa el último commit con `git log -1 --stat` para entender en qué estábamos
3. Si hay cambios staged o unstaged, pregúntame qué quiero hacer con ellos antes de tocar nada nuevo
4. Si vamos a tocar el módulo de pagos, lee primero `src/app/api/webhooks/stripe/README.md` antes de cualquier cambio

---

## Comportamientos esperados

**Sobre commits:**
- NO hagas commits automáticamente. Deja los cambios staged y yo decido cuándo commitear.
- Si te pido "commitea", usa Conventional Commits en español. Primera línea < 70 chars.
- Para refactors grandes, usa scope: `refactor(payments): ...`, `refactor(auth): ...`.

**Sobre cambios grandes:**
- Si un cambio toca más de 3 archivos, muéstrame el plan antes de implementar.
- Si una decisión arquitectónica no está en AGENTS.md, pregúntame antes de tomarla por mí.
- Para refactors que afecten tipos compartidos (`src/types/`), avísame que se viene una propagación de cambios.

**Sobre dependencias:**
- Para instalar una librería nueva: primero verifica si ya tenemos algo equivalente con `grep -r '"nombre-similar"' package.json`.
- Prefiere dependencias mantenidas con > 500k descargas/semana en npm.
- Si recomiendas una dependencia más pequeña, justifica por qué (bundle size, mantención, etc.).
- Package manager: `pnpm`, no `npm`.

**Sobre el modelo:**
- Para tareas de exploración y lectura masiva, usa el subagente `Explore` (Haiku) — más barato.
- Para refactors arquitectónicos, mantén Sonnet u Opus.
- Para escribir tests siguiendo el patrón del proyecto, usa el subagente custom `test-writer`.

---

## Hooks activos

Los hooks definidos en `.claude/settings.json` son:

- **`PostToolUse` con matcher `Edit|Write`** → ejecuta `.claude/hooks/post-edit-lint.sh` que corre Prettier sobre el archivo modificado
- **`PreToolUse` con matcher `Bash`** → ejecuta `.claude/hooks/pre-tool-block.sh` que bloquea comandos destructivos y pide confirmación para operaciones de alto impacto (git push, npm install, etc.)

---

## Skills disponibles

Los Skills personalizados de este proyecto viven en `.claude/skills/`. Para invocarlos:

```
/<nombre-del-skill> [argumentos]
```

Lista actual:

- `/review-prisma` — revisa el esquema Prisma buscando índices faltantes en columnas frecuentemente consultadas, constraints débiles (campos string sin maxLength), y relaciones sin `onDelete` definido
- `/audit-ui` — audita un componente React/Tailwind buscando problemas de accesibilidad (sin aria, contraste, semántica HTML), responsividad y consistencia con shadcn/ui
- `/generate-api-docs` — genera documentación de un endpoint API en formato OpenAPI 3, leyendo el handler y los esquemas Zod

---

## Subagentes disponibles

Los subagentes custom de este proyecto viven en `.claude/agents/`. Para invocarlos, pídelo explícitamente:

- `code-reviewer` — modelo Haiku, solo lectura (`Read, Grep, Glob`), revisa código buscando bugs, security smells y oportunidades de mejora. Genera un reporte con severidades (alta/media/baja).
- `test-writer` — modelo Sonnet, escribe tests unitarios siguiendo las convenciones del proyecto (Vitest, naming en inglés con `should [X] when [Y]`, dependencias reales por defecto).

---

## MCPs activos

Los servidores MCP configurados en `.mcp.json`:

- `github` — para issues, PRs, reviews, GitHub Actions
- `context7` — docs actualizadas de Next.js 16, Prisma 6, React 19, Tailwind 4
- `postgres` — queries directas a la BD del proyecto (lectura sobre la BD de dev, no producción)
- `vercel` — deploys, logs de producción, variables de entorno
- `sequential-thinking` — razonamiento paso a paso para tareas multi-step
- `excalidraw` — diagramación visual cuando necesitamos explicar arquitectura

> Si necesitas información que estos MCPs proveen, úsalos antes de adivinar. Ejemplo: para saber si la versión de Next.js que usamos soporta un feature específico, consulta context7 en vez de adivinar.
