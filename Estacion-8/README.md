# Estación 8 — QA con IA: BDD, Persona + Juez y reporte consolidado

> Del producto implementado al producto **verificado**. Pirámide de pruebas · BDD/Gherkin · Page Object Model · patrón **Persona + Juez** con rúbricas · golden datasets · steering file de testing.

> 📦 Mi entrega vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/qa/`](../Agente-IA-Desarrollo-ABAP/qa/) y [`../Agente-IA-Desarrollo-ABAP/.claude/skills/testing/`](../Agente-IA-Desarrollo-ABAP/.claude/skills/testing/).

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Andrés Caicedo |
| Duración | ≈ 2 h (teoría + demo en vivo sobre 3 repos del instructor) |
| Foco | Pirámide de pruebas · BDD ejecutable · POM · patrón Persona + Juez · golden datasets · steering file de testing |
| Prerequisitos | Producto de Implementación corriendo en local (Estaciones 4–7) · Node.js 20+ · IDE agéntico con MCP habilitado · cuenta Linear gratuita · familiaridad con terminal y TS/JS |
| Commits relevantes | _(pendiente, se asigna al cerrar la estación)_ |

---

## 2. Tema y objetivo de aprendizaje

Garantizar — y **demostrar** — que el producto se comporta como el usuario espera, en tres capas distintas (web, API y agentes inteligentes), con IA generativa como copiloto del QA.

Cinco objetivos concretos:

1. Ubicar los esfuerzos de testing en la **pirámide correcta** (Unitarios · Integración · E2E · Performance) y reconocer el anti-patrón **Ice Cream Cone**.
2. Escribir y mantener **escenarios BDD/Gherkin** que sirven simultáneamente como spec del negocio y tests ejecutables.
3. Aplicar **Page Object Model** y patrones de API testing (request builders, contract testing) para que la suite escale sin volverse frágil.
4. Implementar el patrón **Persona + Juez** con **golden datasets** para evaluar agentes inteligentes — algo que un test binario pass/fail no captura.
5. Configurar el **stack de IA para QA**: Playwright + MCP + steering file, de modo que el coding agent genere tests siguiendo las convenciones del proyecto.

---

## 3. Conceptos clave

### 3.1 Pirámide de pruebas

| Capa | Qué prueba | Volumen ideal |
|---|---|---|
| **Unitarios** | Funciones puras, lógica aislada, sin I/O | Muchos (base ancha) |
| **Integración** | Contratos entre módulos / bases de datos / colas | Medio |
| **E2E (web/API/agentes)** | Usuario final ejerciendo el sistema completo | Pocos (cima) |
| **Performance / SLO** | Latencia, throughput, costo bajo carga | Selectivos |

**Anti-patrón Ice Cream Cone**: pocos unitarios + muchos E2E → suite frágil, lenta y costosa. Si tu CI tarda 40 min, probablemente estás acá.

### 3.2 BDD / TDD / Gherkin

- **TDD** = ciclo de diseño Red → Green → Refactor. Tests primero, código después.
- **BDD** = lenguaje compartido entre negocio y desarrollo. La spec ES el test.
- **Gherkin** = sintaxis ejecutable de BDD: `Given <contexto> · When <acción> · Then <resultado>`. Un `.feature` file contiene escenarios; cada escenario tiene un step definition que lo automatiza.

### 3.3 Patrones de diseño para testing

| Patrón | Para qué |
|---|---|
| **POM (Page Object Model)** | Encapsular la UI en clases reusables (`HomePage`, `LoginPage`). Los tests llaman métodos del page object, no selectores inline. |
| **Screenplay** | Actores con tareas (`User.attempts_to(Login.with(creds))`). Más expresivo que POM para flujos largos. |
| **Request builders** | Construir requests HTTP con fluent API (`api.users().post({...})`). |
| **Contract testing** | Verificar que API consumida y productora respetan el mismo schema (Pact, etc.). |

Sin patrones, los tests se vuelven frágiles: cambia un selector y rompen 30 tests.

### 3.4 Patrón Persona + Juez (LLM-as-Judge)

Para evaluar **agentes generativos**, los tests binarios pass/fail no alcanzan — la calidad es continua.

```text
Usuario real (humano)           Agente bajo prueba (LLM)
        │                                  │
        ▼                                  ▼
   Persona LLM                         Output (multi-turno)
   (system prompt: rol)                       │
        │                                     ▼
        └───── multi-turno ────────►   Juez LLM
                                       (system prompt: rúbrica)
                                              │
                                              ▼
                                       Scorecard JSON
                                       (scores 1-5 por dimensión)
```

Componentes:

- **Persona** — LLM que simula al usuario real. Recibe un perfil (`consultor funcional novato`, `desarrollador apurado`) y genera inputs naturales multi-turno. Permite **mutation testing**: introducir defectos deliberados.
- **Juez** — LLM que evalúa la conversación o el output contra una **rúbrica** con dimensiones puntuadas 1–5.
- **Rúbrica** — Documento markdown con dimensiones, pesos, anclas verbales por nivel.
- **Scorecard** — JSON estructurado que devuelve el Juez. Permite reportes consolidados sin parsear prosa.
- **Golden dataset** — Conversaciones / outputs de referencia para **calibrar al Juez** antes de usarlo para decisiones go/no-go. Si correlación humano↔Juez < 0.8, la rúbrica necesita ajuste.

### 3.5 Stack de IA para QA

| Pieza | Función |
|---|---|
| **Playwright** | Test runner E2E para web/API + screenshots/videos/traces. |
| **playwright-bdd** | Genera tests Playwright desde `.feature` files (Gherkin ejecutable). |
| **Playwright MCP** | MCP server que permite al coding agent inspeccionar el DOM en vivo y generar locators precisos — no inventados. |
| **Coding agent** (Claude Code / Kiro / Cursor) | Genera tests, page objects, step definitions; corrige fallos usando traces. |
| **Steering file de testing** | Convenciones del proyecto que el agente lee sin repetirlas en cada prompt. En Kiro: `.kiro/skills/testing.md`. En Claude Code: `.claude/skills/testing/SKILL.md`. |

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `Clase-8.pdf` | Slides del instructor (versión completa). |
| `clase-8-estudiante.pdf` | Versión para el estudiante: bienvenida, qué se aprende, recorrido (6 secciones), antes-de-la-clase, tarea (5 ítems), artefactos esperados, herramientas, repos de la sesión, recursos. |

Repos demostrativos del instructor (no clonados — solo referenciados):

- `clase8/repos/qa-e2e` — Playwright E2E + Page Objects + BDD/Gherkin + steering file.
- `clase8/repos/qa-api` — Playwright API testing + request builders + tests del agente vía API.
- `clase8/repos/qa-agent-eval` — Patrón Persona + Juez + golden datasets + reporte en Linear.

Recursos externos referenciados:

- Playwright Docs — playwright.dev
- playwright-bdd — github.com/vitalets/playwright-bdd
- Page Object Model — martinfowler.com/bliki/PageObject.html
- Cucumber Gherkin Reference — cucumber.io/docs/gherkin/reference
- Evaluating LLM Agents (Anthropic) — anthropic.com/research
- Playwright MCP — github.com/microsoft/playwright-mcp

---

## 5. Mi entrega — suite QA del Agente IA ABAP

El producto **no es una app web ni una API HTTP**: es un pipeline de subagentes ejecutado dentro de Claude Code (`/validar-fd`, `/generar-td`, `/generar-abap`, `/pipeline-abap`). Por eso reinterpreté la tarea: en lugar de E2E web/API tradicional, construí una **suite de QA para subagentes** que aplica los mismos principios de la clase (pirámide, BDD, Persona + Juez, golden datasets, steering file).

La entrega vive en [`../Agente-IA-Desarrollo-ABAP/qa/`](../Agente-IA-Desarrollo-ABAP/qa/).

### 5.1 Estructura de la suite

```
Agente-IA-Desarrollo-ABAP/
├── .claude/skills/testing/SKILL.md          ← steering file de QA
└── qa/
    ├── package.json                          ← Playwright + playwright-bdd + Anthropic SDK + tsx
    ├── playwright.config.ts                  ← 3 proyectos: bdd / agents / lib
    ├── tsconfig.json                         ← noEmit + scripts/ + tests/ incluidos
    ├── .env.example                          ← ANTHROPIC_API_KEY, QA_MODEL, QA_JUDGE_MODEL
    ├── README.md                             ← propósito, stack, comandos, estado
    ├── rubrics/
    │   ├── m1-validador.md                   ← 6 dimensiones, peso 30% en corrección del veredicto
    │   ├── m2-fd-a-td.md                     ← 7 dim, peso 25% en factualidad (BR-14)
    │   └── m3-td-a-codigo.md                 ← 7 dim, peso 25% en seguridad (AUTH-CHECK + sin PII)
    ├── scripts/
    │   └── reporte-consolidado.ts            ← CLI: emite reporte go/no-go en markdown
    └── tests/
        ├── agents/
        │   ├── juez-m1.ts                    ← Juez ejecutable M1 (Opus 4.7, JSON con prefill)
        │   ├── juez-m1.spec.ts               ← calibración: 3 casos canónicos + diferenciador
        │   ├── juez-m2.ts                    ← Juez M2 con flags estructuradas
        │   ├── juez-m2.spec.ts               ← + guardia anti-falso-negativo en D2
        │   ├── juez-m3.ts                    ← Juez M3 + checklist de auditoría en system prompt
        │   ├── juez-m3.spec.ts               ← + 2 hard-fails (transporte, PII)
        │   ├── persona-consultor.ts          ← Persona Consultor SAP con 7 mutaciones
        │   └── persona-consultor.spec.ts     ← end-to-end Persona → M1 → Juez M1
        ├── features/
        │   ├── validador-fd.feature          ← 8 escenarios M1 (CE/CS/BR)
        │   ├── fd-a-td.feature               ← 8 escenarios M2 (BR-01..14)
        │   └── pipeline-abap.feature         ← 8 escenarios del orquestador
        ├── fixtures/
        │   ├── fds/                          ← 5 FDs canónicos (completo / faltante / vago / contradicción / trivial)
        │   ├── inputs/                       ← ABAP no-FD (para §5.2 redirección)
        │   ├── validador-outputs/            ← 3 outputs canónicos para calibrar Juez M1
        │   ├── td-outputs/                   ← 3 TDs canónicos para Juez M2
        │   ├── codigo-outputs/               ← 3 .abap canónicos para Juez M3
        │   └── scorecards-demo/casos.json    ← 5 scorecards sintéticos (demo del reporte)
        ├── lib/
        │   ├── metrics.ts                    ← funciones puras: sensibilidad, factualidad, go/no-go
        │   └── metrics.spec.ts               ← 10 unit tests sin LLM
        └── steps/
            ├── fixtures.ts                   ← BDD context compartido (playwright-bdd createBdd)
            ├── common.steps.ts               ← Givens transversales
            ├── runner.ts                     ← Anthropic SDK: invocarValidadorFd / FdATd
            ├── m1.steps.ts                   ← step definitions de validador-fd.feature
            ├── m2.steps.ts                   ← step definitions de fd-a-td.feature
            ├── orchestrator.ts               ← simulador del slash command /pipeline-abap (stub)
            └── pipeline.steps.ts             ← step definitions de pipeline-abap.feature
```

### 5.2 Decisiones técnicas clave

| Decisión | Razón |
|---|---|
| **SDK Anthropic en vez de `claude` CLI** | Determinista (`temperature: 0`), modelo pinneable (`QA_MODEL`), CI-friendly. El runner carga `.claude/agents/<agente>.md` como system prompt + `CLAUDE.md` + `formato-fd-generico.md` como contexto. |
| **3 rúbricas, una por módulo** | El producto tiene 3 subagentes con outputs distintos (binario / continuo / código). Una rúbrica única perdería resolución. Cada una alineada con `docs/plan-evaluacion.md §4.X`. |
| **Score ponderado calculado por el harness** | Los pesos viven en `PESOS_M1/M2/M3` (TS const). El LLM devuelve scores 1–5; el código aplica los pesos. Evita gaming y permite cambiar pesos sin re-prompt. |
| **Hard-fails como gates obligatorios** | `contiene_transporte`, `contiene_pii`, `tablas_sensibles_sin_auth_check`: cualquiera > 0 fuerza no-go aunque los promedios estén altos. Compliance no admite promedios. |
| **Pipeline orchestrator stub** | El slash command `/pipeline-abap` es un orquestador con gates humanos. Para testear sus invariantes (Principio #2, persistencia, regeneración versionada) sin gastar 3 LLM por escenario, escribí un simulador determinista que rutea outputs canónicos por la lógica del slash command. |
| **Persona Consultor con `temperature: 0`** | Tests reproducibles. Un spec verifica explícitamente que dos generaciones del mismo input devuelven bytes idénticos. |
| **Demo offline del reporte** | `npm run reporte:demo` produce el markdown desde 5 scorecards JSON pre-calculados (sin tocar API). Costo $0, formato visible. |

### 5.3 Resultados de validación local

| Comando | Tests | Tiempo | Costo |
|---|---|---|---|
| `npm run typecheck` | typecheck completo (incluyendo `scripts/`) | ~5 s | $0 |
| `npm run test:lib` | 10/10 métricas (sensibilidad, factualidad, go/no-go, hard-fails, reporte markdown) | 3.1 s | $0 |
| `npm run reporte:demo` | reporte consolidado markdown con decisión NO-GO trazable | <1 s | $0 |
| `npm run test:pipeline` | 8 escenarios del orquestador (stub) | _no corrido aún_ | $0 |
| `npm run test:m1` / `test:m2` | escenarios BDD con LLM real | _pendiente_ | ~$0.40–0.80 |
| `npm run test:juez` (M1+M2+M3) | calibración de los 3 Jueces | _pendiente_ | ~$1.50–2.50 |
| `npm run test:persona` | Persona → M1 → Juez (mutation testing end-to-end) | _pendiente_ | ~$1.00 |

---

## 6. Aporte al proyecto central

Esta estación agregó la **capa de aseguramiento de calidad** que faltaba al proyecto. Antes había `docs/plan-evaluacion.md` con métricas en papel; ahora el plan es **ejecutable**.

| Componente | Ubicación | Estado |
|---|---|---|
| Steering file de QA | `../Agente-IA-Desarrollo-ABAP/.claude/skills/testing/SKILL.md` | ✅ |
| 3 feature files BDD (24 escenarios) | `../Agente-IA-Desarrollo-ABAP/qa/tests/features/` | ✅ |
| 3 rúbricas alineadas con `plan-evaluacion.md §4` | `../Agente-IA-Desarrollo-ABAP/qa/rubrics/` | ✅ |
| Jueces ejecutables M1/M2/M3 + calibración | `../Agente-IA-Desarrollo-ABAP/qa/tests/agents/juez-*.ts` | ✅ |
| Persona Consultor con 7 mutaciones | `../Agente-IA-Desarrollo-ABAP/qa/tests/agents/persona-consultor.ts` | ✅ |
| Módulo de métricas + CLI de reporte consolidado | `../Agente-IA-Desarrollo-ABAP/qa/tests/lib/` · `qa/scripts/` | ✅ |
| Golden dataset estructural (16 fixtures canónicas) | `../Agente-IA-Desarrollo-ABAP/qa/tests/fixtures/` | ✅ |
| Pipeline orchestrator stub | `../Agente-IA-Desarrollo-ABAP/qa/tests/steps/orchestrator.ts` | ✅ |

### 6.1 Pendientes operativos (no técnicos)

| Pendiente | Dónde / Cómo | Esfuerzo |
|---|---|---|
| **Correr los tests con LLM real al menos una vez** para validar que la calibración del Juez pasa | `npm run test:juez` desde `qa/` con `ANTHROPIC_API_KEY` configurado | ~$5 una corrida completa |
| **Persona Desarrollador** (multi-turn UC3 / BR-12 — reporta errores para gatillar regeneración M3) | `qa/tests/agents/persona-desarrollador.ts` | Medio |
| **Golden dataset real** anonimizado (3–5 FDs históricos) | `evaluacion/dataset/<REQ-id>/` (gitignored) — protocolo en `docs/plan-evaluacion.md §2` | Medio (depende del Configurador del PRD) |
| **Workflow CI** (`.github/workflows/qa.yml`) | typecheck + `test:lib` + `test:pipeline` (los 3 son $0) como gate de cada PR | Bajo |
| **Integración con Linear** para issues de hallazgos del Juez | Reusar `docs/tasks/linear-publish.yaml` | Bajo |
| **Setup MCP Playwright** | No aplica — el producto no tiene UI/API HTTP que inspeccionar | N/A |
| **POM (Page Object Model)** | No aplica — el producto no tiene UI | N/A |

### 6.2 Decisiones de scope explícitas

- **No se construyeron page objects** (POM): el producto no tiene UI web. La equivalencia es el `runner.ts` que encapsula la "interfaz" a los subagentes (carga system prompts, gestiona historial, infiere veredicto).
- **No se usó Playwright MCP**: sin DOM que inspeccionar, su valor es nulo. Sustituido por carga directa del system prompt del subagente desde `.claude/agents/<nombre>.md`.
- **Los 3 feature files cubren los 3 subagentes + el orquestador** en lugar de "≥2 E2E web + ≥2 E2E API". La pirámide se respeta — la base son los 10 unit tests de `metrics.ts` (sin LLM), el medio son los escenarios BDD, la cima es la calibración del Juez.

---

## 7. Lecciones / takeaways

1. **El score ponderado lo calcula el harness, no el LLM.** Cuando se le pide al LLM Juez que devuelva un número agregado, "se ahorra tokens" y la matemática deja de ser auditable. Pedirle solo scores por dimensión (1–5) y aplicar los pesos en código mantiene la rúbrica versionable como única fuente de verdad.

2. **Compliance no admite promedios.** Una rúbrica con peso 25% en seguridad y promedio D2=4.5 puede parecer aceptable, pero si un caso tiene `contiene_transporte=true` o `contiene_pii=true`, el go/no-go debe bloquear sin importar el promedio. Los hard-fails se modelan como banderas booleanas separadas — un buen reporte muestra ambos: promedios para tendencia, banderas para gate.

3. **Mutation testing convierte la Persona en algo más que decoración.** Generar FDs procedurales con defectos deliberados (`omitir-autorizaciones`, `objetivo-vago`) cierra el loop end-to-end: Persona genera → M1 procesa → Juez califica. Si el Juez no detecta lo que la Persona inyectó, la rúbrica del Juez necesita ajuste antes de usarla para decisiones go/no-go.

4. **El stub del orquestador vale lo mismo que 16 horas de LLM real.** El slash command `/pipeline-abap` tiene invariantes (Principio #2 detiene el pipeline si M1 rechaza, regeneración versiona `td-vN.md`, escalamiento BR-12 no genera `codigo-v3.abap`) que son lógicas, no semánticas. Un simulador determinista que rutea outputs canónicos por la lógica del slash command testea esas invariantes en milisegundos sin gastar cuota — la pirámide aplica también al QA de agentes.

---

## Referencias rápidas

- Material del curso:
  - Guía estudiante: [`clase-8-estudiante.pdf`](clase-8-estudiante.pdf)
  - Slides completos: [`Clase-8.pdf`](Clase-8.pdf)
- Mi entrega en el proyecto central:
  - Suite QA: [`../Agente-IA-Desarrollo-ABAP/qa/`](../Agente-IA-Desarrollo-ABAP/qa/)
  - Steering file: [`../Agente-IA-Desarrollo-ABAP/.claude/skills/testing/SKILL.md`](../Agente-IA-Desarrollo-ABAP/.claude/skills/testing/SKILL.md)
  - Plan de evaluación que esta estación operativiza: [`../Agente-IA-Desarrollo-ABAP/docs/plan-evaluacion.md`](../Agente-IA-Desarrollo-ABAP/docs/plan-evaluacion.md)
- Recursos externos:
  - Playwright Docs: https://playwright.dev
  - playwright-bdd: https://github.com/vitalets/playwright-bdd
  - Page Object Model (Martin Fowler): https://martinfowler.com/bliki/PageObject.html
  - Gherkin Reference: https://cucumber.io/docs/gherkin/reference
  - Playwright MCP: https://github.com/microsoft/playwright-mcp
