# Workshop 2 · Avanza una feature con tu agente

> Hardcore AI · 30X · Clase 3 — Ingeniería de Software Agéntica
> **Duración:** 90 minutos · **Modalidad:** Hands-on sobre tu propio repo
> **Pre-requisito:** Haber completado el [Workshop 1](../workshop-1-agent-ready-repo/) — tu repo debe estar agent-ready

---

## 🎯 Objetivo

Al terminar este workshop habrás avanzado **una pieza real** de tu producto usando el agente que configuraste en el Workshop 1, aprendiendo en el camino a **delegar con criterio**: cuándo usar un subagente ligero, cuándo lanzar un Agent Team paralelo, y cuándo entregarle la tarea a Antigravity.

La meta no es terminar la feature. Es entender cómo delegar para que el agente haga el 70% del trabajo correctamente y tú resuelvas el 30% que requiere criterio humano. Esa proporción es la que vas a estar refinando durante el resto del programa.

---

## ✅ Pre-requisitos

Antes de empezar este workshop debes tener:

- [ ] **Completado el Workshop 1** — tu repo tiene `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, al menos 1 hook funcional, todo commiteado
- [ ] **Una idea clara de qué feature pequeña vas a avanzar hoy** — un endpoint, una función, un componente. NO "todo el módulo de pagos"
- [ ] **Antigravity instalado y autenticado** — sin esto el bloque 4 no es viable
- [ ] **Un terminal y tu IDE de preferencia abiertos** sobre tu repo
- [ ] **Este kit clonado o descomprimido en una ubicación accesible** (vas a copiar y leer templates)

---

## 📦 Cómo usar este kit

Este repo tiene dos carpetas:

### `templates/`

Archivos para que el estudiante copie a su repo y personalice durante el workshop.

```
templates/
├── feature-scope.md            ← Hoja de scope para acotar tu feature antes de delegar
├── reflection.md               ← Template del commit message extendido al cierre
└── agents/
    └── example-subagent.md     ← Subagente custom adaptable a tu dominio
```

### `examples/`

Referencias pedagógicas que no se copian — se leen.

```
examples/
├── good-vs-bad-prompts.md      ← 5 pares de prompts comparados con explicación
└── delegation-patterns.md      ← Tabla de decisión: cuándo usar cada herramienta de delegación
```

---

## 🗺 Estructura del workshop

Los 90 minutos están distribuidos en 6 bloques. El instructor te lleva por el primer ejemplo en vivo (un caso completo end-to-end con su propio repo) y luego trabajas con sus indicaciones, mientras él circula resolviendo dudas.

### Bloque 1 · Elige una feature pequeña · 10 min

Decide qué vas a avanzar hoy. La regla más importante es **scope realista**:

- ✅ Un endpoint REST con su validación + un test happy path
- ✅ Un componente React con su estado interno + una prop opcional
- ✅ Un schema Prisma con un campo nuevo + migración
- ❌ "El módulo de autenticación completo"
- ❌ "Refactorizar la base de datos"
- ❌ "Toda la página de checkout"

Copia `templates/feature-scope.md` a `docs/features/` en tu repo (créala si no existe) y llena las 6 secciones. Esto te toma 5-7 min y es la base de la conversación con el agente.

> 💡 **Por qué importa:** los participantes que delegan sin scope claro terminan con código que el agente "imaginó" — el resto del workshop debería ser delegar, no negociar el alcance.

### Bloque 2 · Planificar (no implementar) · 15 min

Abre Claude Code en tu repo. NO pidas implementación todavía. Pídele un **plan**.

```
Usando el scope en docs/features/<tu-feature>.md, dame un plan
de implementación paso a paso. NO escribas código aún. Solo el plan:
qué archivos vas a tocar, qué orden seguirás, qué tests añadirás,
qué riesgos ves.
```

Revisa el plan con criterio:
- ¿Toca archivos que están en `deny` de tu `settings.json`? Ajusta el scope.
- ¿Asume cosas que no están en tu `AGENTS.md`? Añade ese contexto antes de proceder.
- ¿El orden de implementación tiene sentido? ¿O salta lógica que debería ser primero?

Solo cuando el plan se ve sólido, apruébalo verbalmente: `"perfecto, procede"`. Aún no implementes — vienen pasos.

### Bloque 3 · Implementar con un subagente · 25 min

Aquí está la diferencia con un prompt directo: vas a **delegar** la implementación.

**Opción A — Subagente integrado (más simple):**
```
Lanza el subagente Plan para que implemente el plan que acabamos
de aprobar. Quiero que el subagente trabaje aislado y me devuelva
el resultado para revisión.
```

**Opción B — Subagente custom (más control):**
Crea o usa el subagente custom (puedes empezar con `templates/agents/example-subagent.md` adaptado a tu dominio). Por ejemplo:

```
Crea .claude/agents/feature-implementer.md con modelo Sonnet,
tools [Read, Edit, Write, Bash(npm test)], y la instrucción de
implementar features pequeñas siguiendo nuestras convenciones de
AGENTS.md. Luego invócalo sobre el scope actual.
```

Mientras corre, observa:
- ¿Qué archivos lee antes de tocar nada?
- ¿Cuándo decide implementar vs cuándo pregunta?
- ¿Corre tests al terminar o se queda esperando?

Al final, revisa el código generado en tu IDE. Marca lo que aceptas y lo que vas a ajustar a mano en el Bloque 5.

### Bloque 4 · Sesión paralela en Antigravity · 20 min

Mientras la sesión local termina (o al cerrarla), abre Antigravity y crea un **workspace nuevo** apuntando a tu repo (mismo repo, sesión completamente aparte).

Lanza una **segunda tarea independiente** sobre tu producto. Algo que pueda correr en paralelo sin colisionar con lo del Bloque 3:

- Si en el Bloque 3 implementaste backend → en Antigravity pide la UI correspondiente
- Si implementaste un componente → pide los tests E2E (esqueleto) para esa interacción
- Si tocaste lógica de dominio → pide la documentación de esa función para `docs/`

Observa la **superficie distinta** de Antigravity:
- El plan se aprueba como un artefacto, no como un prompt
- Los cambios se revisan como diffs visuales bloque por bloque
- No interactúas con la sesión en tiempo real — pasa de "pair programming" a "delegación asíncrona"

Mientras Antigravity trabaja, vuelve a tu sesión local y empieza la revisión del Bloque 5.

### Bloque 5 · Revisión crítica · 15 min

Revisa lo que produjeron las dos sesiones. Esta es la parte más importante del workshop.

Para cada output, evalúa con 4 preguntas:

1. **¿El código sirve tal cual?** Si sí, pasa al siguiente. Si no, ¿por qué?
2. **¿Qué entendió bien el agente?** Identifica los aciertos para reforzarlos en futuros prompts.
3. **¿Qué entendió mal?** Identifica si fue por contexto faltante en `AGENTS.md` o por un prompt ambiguo.
4. **¿Qué ajustarías tú a mano vs qué prompt mejorado le pedirías al agente?** No todo se debe pedir de nuevo — a veces es más rápido editar la última milla manualmente.

Aplica los ajustes que decidas a mano. No vuelvas a delegar lo mismo — pasa al cierre.

### Bloque 6 · Cierre y reflexión · 5 min

Copia `templates/reflection.md` y úsalo como base para tu commit message extendido. La estructura te obliga a articular qué aprendiste:

- Qué delegaste y a quién
- Qué hizo bien el agente
- Qué hiciste tú a mano y por qué
- Una cosa que harías diferente la próxima vez

Stage tus cambios, escribe el commit message con la reflexión, y empújalo a tu rama. **No hagas push a `main`** — usa una rama feature para que el código quede revisable.

En los últimos minutos del workshop, 2-3 voluntarios comparten su reflexión en la sala. El objetivo es contagiar criterio sobre la delegación, no presumir el código.

---

## 🎁 Entregable

Al terminar el workshop tu repo debe tener:

- [ ] `docs/features/<tu-feature>.md` con el scope completo (Bloque 1)
- [ ] **Commit nuevo** en una rama feature con el avance implementado por el agente + los ajustes manuales
- [ ] **Commit message extendido** siguiendo `templates/reflection.md` (las 4 secciones)
- [ ] **Screenshot de Antigravity** mostrando la sesión paralela ejecutada (puede ir en el commit message o adjunto a una entrega aparte)

Adicionalmente, si creaste un subagente custom, debe quedar en `.claude/agents/<nombre>.md` versionado.

---

## 🚨 Troubleshooting

### "Mi feature está terminando todavía en el Bloque 5 y no me da tiempo"

Recortaste mal el scope en el Bloque 1. Para esta vez, **commitea el avance parcial** con la reflexión documentando qué quedó pendiente. Para la próxima, parte features en piezas más pequeñas — un endpoint con un solo método HTTP, un componente sin lógica de negocio, etc.

### "El subagente no respeta mi `AGENTS.md`"

Dos causas comunes:
1. El subagente custom tiene su propio prompt en el frontmatter — puede sobrescribir el contexto general. Revisa el campo `description` y el body del archivo `.claude/agents/<nombre>.md`.
2. El `AGENTS.md` describe el qué pero no el cómo. Reforzar con ejemplos: en vez de "Usa Conventional Commits", añadir un ejemplo concreto: `feat(checkout): añadir validación de cupón expirado`.

### "Antigravity no me deja conectar el workspace"

Verifica que estás autenticado con cuenta personal `@gmail.com` (no Workspace). Si necesitas usar cuenta corporativa, contacta al equipo del programa — algunos dominios tienen restricciones específicas.

### "El plan del agente es demasiado optimista (subestima el trabajo)"

Pídele explícitamente que sea conservador: `"para cada paso, enumera los riesgos y casos borde que estás asumiendo"`. Esto fuerza al agente a hacer visible su modelo mental, y suele revelar suposiciones que no son ciertas.

### "El código generado es funcional pero no idiomático"

Es señal de que `AGENTS.md` no tiene suficientes ejemplos de estilo. Después del workshop, abre `examples/AGENTS.md` del Workshop 1 y compara con el tuyo — probablemente le falten secciones de "patrones a evitar" o "decisiones ya tomadas".

---

## 📚 Recursos

- [Workshop 1 · Configura tu agente sobre tu proyecto](../workshop-1-agent-ready-repo/) — pre-requisito
- Codelab de Clase 3: https://harcoreai.carlos-alarcon.com/
- Docs Antigravity: https://antigravity.google/docs
- Patrón "Agent Teams" en Claude Code: https://code.claude.com/docs/agent-teams

---

## 🔜 Hacia la Clase 4

Lo que practicaste hoy es el flujo de delegación básico — un subagente, una sesión paralela. En la **Clase 4** vas a aplicar este flujo sobre tu producto completo para iniciar la implementación formal. Las clases 5 a 7 traen DDD, BDD y TDD que **enriquecerán cómo le hablas al agente** — pero el flujo de delegación que aprendiste hoy es la base que no cambia.
