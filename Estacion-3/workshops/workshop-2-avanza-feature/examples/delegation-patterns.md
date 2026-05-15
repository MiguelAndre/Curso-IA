# Patrones de delegación · Cuándo usar cada herramienta

> Tabla de decisión para elegir la herramienta de delegación correcta
> según el tipo de tarea. Léelo antes del workshop para que cuando estés
> en el bloque 3 sepas qué usar sin perder tiempo.

---

## Las cuatro superficies de delegación

| Superficie | Qué es | Costo en tokens | Cuándo brilla |
|------------|--------|----------------|---------------|
| **Prompt directo** | Le pides al agente principal que haga la tarea sin delegar | Alto — usa el modelo principal | Tareas pequeñas y bien acotadas donde quieres iterar en tiempo real |
| **Subagente integrado** (`Explore`, `Plan`, `General-purpose`) | El agente principal lanza un subagente con un modelo o configuración específica | Variable — Explore (Haiku) es barato, General-purpose hereda el modelo | Lectura masiva, planificación detallada, exploración sin tocar nada |
| **Subagente custom** (`.claude/agents/<nombre>.md`) | Subagente con frontmatter y prompt diseñado por ti para una tarea recurrente | Variable según el modelo definido | Procesos repetibles del proyecto (code review, test writing, schema audit) |
| **Sesión paralela en Antigravity** | Un agente independiente trabajando en otra parte del repo, en otra rama | Alto — es una sesión completa aparte | Trabajo que puede correr en paralelo sin colisionar |

> **No están en esta tabla los Agent Teams porque Claude Code los ofrece pero son configuración avanzada y los workshops del programa no los exploran. Para 30X, queda con las 4 superficies anteriores.**

---

## Tabla de decisión por tipo de tarea

| Tarea | Mejor opción | Por qué | Alternativa |
|-------|-------------|---------|-------------|
| **Búsqueda exploratoria** (encontrar archivos relacionados, identificar patrones, mapear deudas) | Subagente `Explore` | Solo lectura, modelo Haiku barato, devuelve lista estructurada al padre | Prompt directo si es algo muy puntual (1-2 archivos) |
| **Plan de implementación detallado** antes de tocar código | Subagente `Plan` | Diseñado para planificación, devuelve pasos numerados con riesgos | Prompt directo con la instrucción "no implementes, solo plan" |
| **Implementación de una feature acotada** | Prompt directo con scope explícito en `docs/features/<feature>.md` | El agente principal mantiene contexto fluido contigo | Subagente custom si la feature sigue un patrón repetitivo |
| **Refactor multi-archivo de un patrón** | Subagente custom con tools restringidas | Restringes lo que puede tocar, mantienes el contexto principal limpio | Sesión Antigravity si es trabajo largo (>20 min) |
| **Code review crítico antes de un PR** | Subagente custom `code-reviewer` con modelo Haiku, solo lectura | Modelo barato + solo lectura = puedes correrlo varias veces sin culpa | Prompt directo en una nueva sesión limpia |
| **Generación de tests** para código existente | Subagente custom `test-writer` con tools `[Read, Write, Bash(npm test)]` | El subagente puede iterar hasta que los tests pasan sin contaminar el padre | Prompt directo si solo es 1-2 tests |
| **Documentación de un módulo** | Sesión paralela en Antigravity | Tarea independiente, no necesita interactividad, output es prosa | Subagente custom con tools `[Read, Write]` |
| **Migración de schema + impacto en código** | Prompt directo paso a paso | Es una tarea de alta sensibilidad — necesitas ver cada cambio | Plan → Plan → Implementación coordinada |
| **Feature completa con backend + frontend + tests** | Múltiples sesiones paralelas en Antigravity | Cada capa avanza independientemente, integras tú al final | Subagentes secuenciales si Antigravity no está disponible |
| **Audit de seguridad de un endpoint** | Subagente custom con modelo Sonnet u Opus | Necesitas un modelo serio, pero queda aislado del contexto principal | Prompt directo si tienes el contexto cargado |
| **Generación de un diagrama** (Mermaid, etc.) | Prompt directo | Es interactivo — iteras el diagrama en vivo hasta que sirve | — |
| **Análisis de logs de producción** | Subagente `Explore` con MCP `vercel` o equivalente | Lectura masiva sin tocar nada, modelo barato | Prompt directo si los logs son < 100 líneas |

---

## Heurísticas rápidas (para cuando no tienes tiempo de pensar)

### ¿Es solo lectura?
→ Casi siempre **`Explore` (Haiku)**. Es barato y la tarea no toca nada.

### ¿Es trabajo largo (> 15 min) e independiente?
→ **Sesión paralela en Antigravity**. Mientras corre, sigue trabajando aquí.

### ¿Es un proceso que repites cada semana?
→ Vuélvelo **subagente custom**. Inversión inicial alta, vale la pena al tercer uso.

### ¿Es algo que necesitas en este momento y se acaba en 2 min?
→ **Prompt directo** sin más. La sobreingeniería de delegar cuesta más que la tarea.

### ¿Necesitas coordinar varias piezas que se tocan entre sí?
→ **Prompt directo con plan paso a paso**. La delegación a subagentes pierde el hilo entre capas.

---

## Anti-patrones de delegación

| Anti-patrón | Por qué duele |
|------------|---------------|
| Delegar a un subagente custom mal definido (sin scope claro) | El subagente improvisa, el resultado es peor que un prompt directo |
| Usar Antigravity para tareas de < 10 min | El overhead de crear workspace y aprobar planes pesa más que el ahorro |
| Lanzar 5 sesiones paralelas en Antigravity | Imposible revisar bien, las ramas chocan al integrar |
| Convertir todo en subagente "para ahorrar contexto" | El contexto fragmentado pierde coherencia. Algunas tareas necesitan estar en la mente del agente principal. |
| Pedirle a un subagente Haiku una decisión arquitectónica | Haiku es para tareas simples — para decisiones serias usa Sonnet u Opus, aunque sea más caro |

---

## La pregunta que evita el 80% de los errores

Antes de decidir cómo delegar, hazte una pregunta:

> *"Si la tarea sale mal, ¿prefiero verlo en vivo (mismo contexto), o prefiero verlo al final como un PR para revisar?"*

- **Verlo en vivo** → prompt directo o subagente integrado
- **Verlo como PR al final** → subagente custom o sesión paralela en Antigravity

Esa pregunta ya resuelve la mayoría de los casos.
