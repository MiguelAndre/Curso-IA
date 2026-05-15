# Clase 3: Ingeniería de Software Agéntica — Claude Code, OpenCode y Antigravity

**Programa:** Hardcore AI | 30X · **Instructor:** Carlos Alarcón · **Duración:** 2h

## 👋 Bienvenida

Ya tienes tu PRD y tech specs de la Clase 2. Hoy das el salto a la implementación, pero no de cualquier forma: aprendes el método operativo de la ingeniería de software agéntica. La sesión es una demostración continua sobre código real — observas, anotas y luego replicas en tu proyecto entre clases.

## 🎯 De qué se trata

Cómo convertir specs en producto sin caer en vibe coding ni perder el control del agente. Trabajamos tres herramientas complementarias: **Claude Code** como terminal táctica, **OpenCode** como capa portable para configurar MCP y Skills, y **Antigravity** para orquestación visual y paralela. El diferencial no está en mejores prompts — está en diseñar el entorno (`CLAUDE.md`, `AGENTS.md`, hooks, permisos) que hace al agente producir resultados verificables.

## 📚 Qué vas a aprender

- Diferenciar copiloto, agente autónomo y LLM wrapper, y cuándo usar cada enfoque.
- Configurar Claude Code con permisos, memoria de proyecto, hooks y subagentes.
- Diseñar el contexto operativo (`CLAUDE.md`, `AGENTS.md`, `.mcp.json`) para que cualquier agente lo entienda sin repeticiones.
- Conectar tu agente a sistemas externos vía MCP y extenderlo con Skills versionables.
- Orquestar trabajo paralelo con Antigravity y revisar artefactos en lugar de leer chat.

## 🗺 Recorrido de la sesión

1. **Apertura y contexto** — Por qué el método importa: el 45% del código generado por IA tiene vulnerabilidades activas y el vibe coding produce desastres en producción documentados por CTOs reales.
2. **Fundamentos agénticos** — Estado del arte 2026, **bucle ReAct** (pensar → planificar → ejecutar → observar → corregir), **del commit al artifact** como nueva unidad de trabajo, **Context Engineering** vs Prompt Engineering.
3. **Claude Code como terminal agéntica** — Instalación y modos de permiso (Plan/Normal/Auto-Accept), `CLAUDE.md` y Auto Memory, flujos reales de debug y refactor, **subagentes y Agent Teams** para paralelismo dentro de Claude, **hooks deterministas** vs instrucciones advisory, headless con `claude -p` para CI/CD.
4. **OpenCode con MCP y Skills** — `opencode.json` con modelos cloud y locales, `AGENTS.md` como estándar cross-tool que también leen Cursor, Windsurf y Copilot, **instalación en vivo de 6 MCPs** (GitHub, Context7, PostgreSQL, Vercel, Sequential Thinking, Excalidraw), los **3 Skills del codelab** + **1 propio creado en terminal** y versionado en el repo.
5. **Antigravity y paralelismo real** — **Mission Control** (Agent Manager + Editor basado en Monaco), sesiones con flujo estructurado (analiza → plan → aprobación → implementa → verifica), **dos sesiones paralelas** sobre el mismo repo con ramas independientes, decision matrix sobre cuándo usar cada herramienta.

## 🎬 Qué vas a observar en vivo

- **El bucle ReAct en acción** — El agente recibe una pregunta sobre un repo que no conoce, decide qué archivos leer primero e itera con Read y Grep antes de responder. La diferencia con un autocomplete sofisticado.
- **`CLAUDE.md` vs sin contexto** — Mismo prompt en un proyecto bien configurado vs uno vacío. La evidencia visual de por qué el context engineering pesa más que el prompting.
- **Hooks ejecutándose sin permiso** — Un `PostToolUse` que formatea código automáticamente después de cada edición. Los hooks son código, no instrucciones.
- **Seis MCPs configurados en vivo** — En menos de diez minutos el agente pasa de ciego a contextualizado: consulta BD, ve issues, dibuja diagramas.
- **Dos sesiones de Antigravity en paralelo** — Dos agentes en el mismo repo, ramas independientes, PRs separados, sin interferirse.

## 📋 Antes de la clase

- [ ] Ten a mano tu PRD y tus tech specs de la Clase 2 — los vas a usar como input.
- [ ] Instala Git, Node.js 20+ y una terminal funcional (macOS, Linux o WSL2; Windows nativo no soporta Claude Code).
- [ ] Crea cuentas en Claude (Pro/Max/Teams), Google personal `@gmail.com` y GitHub.
- [ ] Instala y autentica **Claude Code**, **OpenCode** y **Google Antigravity** antes de la sesión.
- [ ] Ten un repositorio pequeño propio para practicar (puedes usar `basic_crm_30x` como base).
- [ ] Revisa previamente el codelab: [harcoreai.carlos-alarcon.com](https://harcoreai.carlos-alarcon.com/).

## ✅ Tu tarea

1. **Configura tu agent-ready repo:** crea `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json` con permisos allow/deny, y un hook `PostToolUse` que ejecute lint o tests después de cada edición.
2. **Instala los 6 MCP servers del codelab** sobre tu proyecto (GitHub, Context7, PostgreSQL/Neon, Vercel, Sequential Thinking, Excalidraw). Verifica con `claude mcp list` y consolida en `.mcp.json`.
3. **Adopta los 3 Skills del codelab:** instala `ui-audit`, `generate-api-docs` y `review-pr` en `.claude/skills/`. Invoca cada uno al menos una vez sobre tu proyecto.
4. **Crea un Skill propio versionable** específico de tu dominio (ej. `/audit-prisma`, `/check-rls`, `/validate-env`). Frontmatter completo con `allowed-tools` mínimo y `context: fork` si la tarea es pesada.
5. **Crea un subagente custom** en `.claude/agents/` (ej. `test-writer` con modelo Sonnet, o `code-reviewer` con Haiku).
6. **Lanza dos sesiones paralelas en Antigravity** sobre tu proyecto y entrega los dos artefactos (planes + diffs) como evidencia del flujo asíncrono.

## 🛠 Qué vas a producir

| Artefacto | Formato |
|-----------|---------|
| Configuración cross-tool y contexto Claude | `AGENTS.md` · `CLAUDE.md` |
| Permisos y hooks del proyecto | `.claude/settings.json` · `.claude/hooks/<nombre>.sh` |
| Configuración OpenCode y MCPs | `opencode.json` · `.mcp.json` con 6 servers |
| Skills del codelab + 1 propio | `.claude/skills/<4 skills>/SKILL.md` |
| Subagente custom | `.claude/agents/<nombre>.md` |
| Artefactos de Antigravity | 2 planes + 2 diffs visuales (sesiones paralelas) |

## 🤖 Herramientas que vas a usar

| Herramienta | Qué hace y dónde la vas a usar |
|-------------|--------------------------------|
| **Claude Code** | Terminal agéntica principal. La verás en acción durante la primera mitad de la sesión y la usarás como herramienta primaria para implementar la tarea. |
| **OpenCode** | Capa portable cross-modelo (cloud y local). Demos de `opencode.json` y `AGENTS.md` como estándar cross-tool. |
| **Antigravity** | Mission Control para delegar tareas asíncronamente y revisar artefactos. La usarás para las dos sesiones paralelas. |
| **6 MCP Servers** | GitHub, Context7, PostgreSQL/Neon, Vercel, Sequential Thinking y Excalidraw — extienden lo que el agente puede hacer. |
| **3 Skills + 1 propio** | `/ui-audit`, `/generate-api-docs`, `/review-pr` + un Skill custom de tu dominio. |
| **Subagentes** | Explore (Haiku, lectura), Plan, General-purpose + uno custom que crearás en `.claude/agents/`. |
| **GitHub Actions con Claude** | `anthropics/claude-code-action@v1` para reviews automáticos al mencionar `@claude` en un PR. |

## 📦 Repositorio base

`hardcore-ai/basic_crm_30x` — CRM Next.js 16 + Prisma + Tailwind, sobre el que el instructor configura todo el stack agéntico. Clónalo antes de la sesión: `git clone https://github.com/hardcore-ai/basic_crm_30x.git`.

## 📚 Recursos para profundizar

- **Codelab oficial:** [harcoreai.carlos-alarcon.com](https://harcoreai.carlos-alarcon.com/) — todos los comandos, snippets y prompts en formato web navegable.
- **Docs Claude Code:** [code.claude.com/docs](https://code.claude.com/docs) — referencia completa de la CLI, settings, hooks y skills.
- **Discord Anthropic:** [anthropic.com/discord](https://anthropic.com/discord) — canal `#claude-code` con la comunidad activa.
- **Skills oficiales:** `github.com/anthropics/skills` — ejemplos canónicos que puedes adaptar a tu proyecto.
- **MCP marketplaces:** [mcp.so](https://mcp.so), [smithery.ai](https://smithery.ai) y la lista curada `awesome-mcp-servers` en GitHub.
- **Antigravity Docs:** [antigravity.google/docs](https://antigravity.google/docs) — guías oficiales, planes y FAQ.
