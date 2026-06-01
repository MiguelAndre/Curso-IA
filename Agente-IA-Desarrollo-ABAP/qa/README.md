# QA del Agente IA ABAP

Suite de aseguramiento de calidad del producto **Agente IA ABAP** (pipeline FD → TD → Código). Aplica los patrones de la Estación 8 del programa Hardcore AI: BDD/Gherkin, Persona + Juez, golden datasets y rúbricas.

> Este directorio es la implementación ejecutable del diseño documentado en [`docs/plan-evaluacion.md`](../docs/plan-evaluacion.md).

---

## 1. Filosofía: qué se prueba aquí

El producto **no** es una app web ni una API HTTP. Es un pipeline de sub-agentes ejecutado dentro de Claude Code (`/validar-fd`, `/generar-td`, `/generar-abap`, `/pipeline-abap`). Por eso la suite **no** prueba endpoints ni DOM — prueba **comportamiento del agente** sobre artefactos textuales.

Tres tipos de prueba:

| Tipo | Qué valida | Artefacto |
|---|---|---|
| **BDD/Gherkin** | Reglas del agente expresadas como spec ejecutable (CE/CS de M1, contratos de M2 y M3) | `tests/features/*.feature` |
| **Persona + Juez** | Calidad del output multi-turno (TD, código ABAP) contra rúbrica y golden dataset | `tests/agents/*.ts` |
| **Contract / Schema** | Que outputs tengan secciones obligatorias (`Decisiones y Supuestos`, cabecera `⚠️ VERIFICAR`) | step definitions reusables |

Los **principios no negociables** del PRD §6 son restricciones de testing también: ningún test puede tocar SAP, ni asumir credenciales, ni saltarse compuertas humanas.

---

## 2. Estructura

```
qa/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── tests/
│   ├── features/                       # .feature files (BDD)
│   │   └── validador-fd.feature        # M1 — validador
│   ├── steps/                          # step definitions (TS)
│   └── agents/                         # persona + juez (TS) — pendiente
├── rubrics/                            # rúbricas del juez por módulo — pendiente
└── playwright-report/                  # reporte HTML (gitignored)
```

Carpetas hermanas relacionadas (fuera de `qa/`):

- **`evaluacion/`** (gitignored) — dataset real anonimizado: FDs históricos + TDs + `.abap` de producción. Estructura definida en [`docs/plan-evaluacion.md §2.3`](../docs/plan-evaluacion.md).
- **`.claude/skills/testing/`** — steering file que el coding agent lee para generar tests siguiendo las convenciones del proyecto.

---

## 3. Cómo correr la suite

```bash
cd qa
npm install
npx playwright install            # primera vez

npm test                          # corre todos los feature files
npm run test:m1                   # solo tag @m1
npm run report                    # abre el último reporte HTML
```

Variables de entorno relevantes (en `.env`, gitignored):

| Variable | Para qué | Default |
|---|---|---|
| `CLAUDE_CODE_GIT_BASH_PATH` | Ruta a `bash.exe` de Git for Windows (requerido en Windows para invocar `claude` desde Node) | `C:\Users\<u>\AppData\Local\Programs\Git\bin\bash.exe` |
| `QA_MODEL` | Modelo para el sub-agente bajo prueba (Persona / Validador) | `claude-sonnet-4-6` |
| `QA_JUDGE_MODEL` | Modelo del Juez (más capaz para calibración) | `claude-opus-4-7` |
| `DATASET_DIR` | Carpeta del golden dataset | `../evaluacion/dataset` |
| `ANTHROPIC_API_KEY` | (Opcional · fallback) Sólo si se revierte al SDK directo. Hoy la suite no la lee. | — |

### Auth: CLI en lugar de SDK (W1)

Desde 2026-06-01 la suite **no usa `@anthropic-ai/sdk` ni `ANTHROPIC_API_KEY`**. Invoca la CLI `claude -p` como subprocess (wrapper en `tests/agents/claude-cli.ts`), que usa la suscripción Claude Pro/Max/Enterprise del usuario logueado localmente.

Pre-requisito: estar logueado en Claude Code (`claude` interactivo) con tu cuenta empresarial. La sesión OAuth/keychain queda guardada y los subprocesses la heredan.

Esto evita facturar tokens API contra una tarjeta separada. Ver capsule [`docs/memory/capsules/2026-06-01-qa-llm-real-w1.md`](../docs/memory/capsules/2026-06-01-qa-llm-real-w1.md).

---

## 4. Convenciones del proyecto que la suite respeta

- **Idioma español** en feature files, steps, mensajes de assertion y reportes.
- **Tags Gherkin** por módulo: `@m1`, `@m2`, `@m3`, `@pipeline`, `@principio-N`.
- **Sin mocks de SAP** — no se mockea ninguna llamada externa porque el producto no tiene ninguna.
- **Trazabilidad**: cada scenario referencia las reglas que valida (CE-XX, CS-XX, BR-XX, Principio #N) en comentarios o en el título.
- **Golden dataset versionado solo en hash**: el dataset real vive en `evaluacion/` (gitignored). En `qa/` solo se versiona el inventario y los hashes, no el contenido.

---

## 5. Estado actual

- [x] Scaffolding Playwright + playwright-bdd
- [x] Steering file de testing (`.claude/skills/testing/SKILL.md`)
- [x] Primer feature file: `validador-fd.feature` (M1) — 8 escenarios cubriendo CE/CS/BR y Principios #2/#5
- [x] Runner SDK Anthropic (`tests/steps/runner.ts`) — carga `validador-fd.md` / `fd-a-td.md` como system prompt + `CLAUDE.md` + `formato-fd-generico.md` como contexto
- [x] Step definitions para M1 (`tests/steps/m1.steps.ts` + `common.steps.ts`)
- [x] Fixtures FD (`tests/fixtures/fds/*.md`, `tests/fixtures/inputs/*.abap`)
- [x] Rúbrica de M1 (`rubrics/m1-validador.md`)
- [x] Feature file de M2: `fd-a-td.feature` — 8 escenarios cubriendo BR-01/02/03/05/09/13/14 y skill ALV
- [x] Step definitions para M2 (`tests/steps/m2.steps.ts`)
- [x] Juez ejecutable de M1 (`tests/agents/juez-m1.ts`) — carga rúbrica + def. del validador, devuelve scorecard JSON, score ponderado calculado por el harness con los pesos oficiales
- [x] Spec de calibración del Juez M1 (`tests/agents/juez-m1.spec.ts`) — 3 casos (aprobado bueno, rechazado bueno, rechazado pobre) + test diferenciador
- [x] Rúbrica de M2 (`rubrics/m2-fd-a-td.md`) — 7 dimensiones, peso 25% en factualidad (la más alta, alineada con target 100% de `plan-evaluacion.md §4.2`)
- [x] Juez ejecutable de M2 (`tests/agents/juez-m2.ts`)
- [x] Spec de calibración del Juez M2 (`tests/agents/juez-m2.spec.ts`) — 3 TDs canónicos (bueno / pobre con alucinaciones + código ABAP / mediocre que omite TBD en FD con contradicción) + diferenciador + guardia anti-falso-negativo en D2
- [x] Rúbrica de M3 (`rubrics/m3-td-a-codigo.md`) — 7 dimensiones, peso 25% en seguridad (AUTH-CHECK + SQL seguro + sin PII + sin transporte — target 100%)
- [x] Juez ejecutable de M3 (`tests/agents/juez-m3.ts`) — carga rúbrica + def. agente + checklist de auditoría humana
- [x] Spec de calibración del Juez M3 (`tests/agents/juez-m3.spec.ts`) — 3 archivos `.abap` canónicos (bueno con AUTH-CHECK + SALV + cabecera 4 bloques / pobre con SELECT * + PII + transporte + FAE sin guarda / mediocre AUTH-CHECK sin IF sy-subrc) + diferenciador + 2 hard-fails (transporte, PII)
- [x] Feature file de pipeline (`tests/features/pipeline-abap.feature`) — 8 escenarios sobre las invariantes del orquestador: argumentos obligatorios, Principio #2 (rechazo M1 detiene), Gates 1 y 2, regeneración versionada (`td-v2.md`), escalamiento BR-12, estructura `outputs/<fecha>/<req-id>/`
- [x] Orquestador stub (`tests/steps/orchestrator.ts`) + step definitions (`tests/steps/pipeline.steps.ts`) — simulador rápido y gratis que rutea outputs canónicos por la lógica del slash command
- [x] Agente Persona Consultor (`tests/agents/persona-consultor.ts`) — genera FDs con mutaciones deliberadas (omitir-autorizaciones, objetivo-vago, ca-no-verificables, tablas-descriptivas-no-tecnicas, contradiccion-rn-cb, etc.)
- [x] Spec end-to-end **Persona → M1 → Juez M1** (`tests/agents/persona-consultor.spec.ts`) — 4 casos de mutation testing (test de determinismo `temperature=0` skipped bajo W1: la CLI no expone `--temperature`)
- [x] **Wrapper CLI** (`tests/agents/claude-cli.ts`) — invoca `claude -p` como subprocess. Usa la suscripción Pro/Max/Enterprise sin facturar API tokens.
- [x] **Ejecución contra LLM real** (2026-06-01): 22/23 tests verdes, 1 skipped — primera corrida completa de Persona + 3 Jueces fuera del modo demo.
- [x] **Módulo de métricas** (`tests/lib/metrics.ts`) — funciones puras que computan sensibilidad/especificidad/factualidad/seguridad/etc. y aplican el go/no-go de `plan-evaluacion.md §6`
- [x] **Tests del módulo de métricas** (`tests/lib/metrics.spec.ts`) — 9 tests sin LLM con scorecards sintéticos
- [x] **CLI de reporte consolidado** (`scripts/reporte-consolidado.ts`) — genera reporte markdown desde JSON de casos o desde golden dataset. Demo offline con `npm run reporte:demo`
- [ ] Persona Desarrollador (multi-turn UC3 — reporta errores para gatillar regeneración M3 y eventualmente BR-12)
- [ ] Workflow CI (`.github/workflows/qa.yml`) + integración con Linear para issues de hallazgos
- [ ] Golden dataset inventariado (`evaluacion/dataset/<REQ-id>/`)
- [ ] Reporte consolidado contra targets de `plan-evaluacion.md §6` (go/no-go)
- [ ] Workflow CI (`.github/workflows/qa.yml`)
- [ ] Integración con Linear para issues de hallazgos
