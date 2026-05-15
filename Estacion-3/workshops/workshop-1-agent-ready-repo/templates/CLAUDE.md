# Instrucciones específicas para Claude Code

> **Source of truth del proyecto:** [`AGENTS.md`](./AGENTS.md). Léelo siempre primero.
> Este archivo añade configuración propia de Claude Code que no es portable a otros agentes.

---

## Cómo arrancar una sesión

Al inicio de cualquier sesión nueva:

1. Lee `AGENTS.md` completo
2. Revisa el último commit con `git log -1` para entender en qué estábamos
3. Si hay cambios staged o unstaged, pregúntame qué quiero hacer con ellos antes de tocar nada nuevo

---

## Comportamientos esperados

**Sobre commits:**
- {{ej. NO hagas commits automáticamente. Deja los cambios staged y yo decido cuándo commitear.}}
- {{ej. Si te pido "commitea", usa Conventional Commits.}}
- {{ej. Mensaje del commit en español, primera línea < 70 chars.}}

**Sobre cambios grandes:**
- {{ej. Si un cambio toca más de 5 archivos, muéstrame el plan antes de implementar.}}
- {{ej. Si una decisión arquitectónica no está en AGENTS.md, pregúntame antes de tomarla por mí.}}

**Sobre dependencias:**
- {{ej. Para instalar una librería nueva, primero verifica si ya tenemos algo equivalente con `grep -r 'nombre-similar' package.json`}}
- {{ej. Prefiere dependencias mantenidas con > 500k descargas/semana. Justifica si recomiendas una más pequeña.}}

**Sobre el modelo:**
- {{ej. Para tareas de exploración y lectura masiva, usa el subagente Explore (Haiku) — más barato.}}
- {{ej. Para refactors arquitectónicos, mantén Sonnet u Opus.}}

---

## Hooks activos

Los hooks definidos en `.claude/settings.json` son:

- **`PostToolUse` con matcher `Edit|Write`** → ejecuta `.claude/hooks/post-edit-lint.sh` para correr lint/formato automáticamente
- {{añade aquí cada hook que tengas activo, con una línea de descripción}}

> Si añades o quitas hooks, actualiza esta lista para que el agente sepa qué automatización está corriendo en cada paso.

---

## Skills disponibles

Los Skills personalizados de este proyecto viven en `.claude/skills/`. Para invocarlos:

```
/<nombre-del-skill> [argumentos]
```

Lista actual:
- {{ej. `/review-prisma` — revisa esquemas Prisma buscando índices faltantes y constraints débiles}}
- {{añade los Skills que vayas creando}}

---

## Subagentes disponibles

Los subagentes custom de este proyecto viven en `.claude/agents/`. Para invocarlos, pídelo explícitamente:

- {{ej. `code-reviewer` — modelo Haiku, solo lectura, revisa código buscando bugs, security smells y oportunidades de mejora}}
- {{ej. `test-writer` — modelo Sonnet, escribe tests unitarios siguiendo nuestras convenciones de naming}}

---

## MCPs activos

Los servidores MCP configurados en `.mcp.json`:

- {{ej. `github` — para issues, PRs, code reviews}}
- {{ej. `context7` — docs actualizadas de librerías que usamos}}
- {{ej. `postgres` — queries directas a la BD del proyecto}}

> Si necesitas información que estos MCPs proveen, úsalos antes de adivinar.
