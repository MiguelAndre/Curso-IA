---
name: testing
description: Convenciones de QA del Agente IA ABAP. Activa este skill cuando el contexto contenga keywords como "test", "tests", "QA", "feature file", "Gherkin", "BDD", "Playwright", "playwright-bdd", "Persona + Juez", "golden dataset", "rubrica", "evaluación pre-piloto", o cuando se trate de crear o modificar artefactos bajo `qa/` o `evaluacion/`. Provee el stack, la estructura de carpetas, las reglas de naming y los principios no negociables que aplican al código de pruebas.
---

# Skill: Testing — Convenciones de QA del Agente IA ABAP

## 1. Propósito

Este skill orienta al coding agent (Claude Code, Codex, etc.) cuando genera o modifica artefactos de **aseguramiento de calidad** del producto Agente IA ABAP. Es el equivalente a un steering file de Estación 8 (`.kiro/skills/testing.md` en la versión Kiro de la clase).

> Este skill **no escribe tests por sí solo**. Le dice al agente cómo escribirlos cuando se le pide hacerlo.

---

## 2. Activación

Triggers de contexto:

- Mención de Playwright, playwright-bdd, Gherkin, BDD, feature file, step definition.
- Tareas que tocan `qa/`, `evaluacion/`, `.claude/skills/testing/`.
- Solicitudes de "evaluar el agente", "patrón Persona + Juez", "rúbrica", "golden dataset".
- Implementación del [`docs/plan-evaluacion.md`](../../../docs/plan-evaluacion.md).

---

## 3. Stack canónico

| Componente | Tecnología |
|---|---|
| Test runner | `@playwright/test` |
| BDD/Gherkin | `playwright-bdd` (genera tests Playwright desde `.feature`) |
| Lenguaje | TypeScript (ESM, target ES2022) |
| Invocación del subagente bajo prueba | `claude` CLI headless (`claude -p "/validar-fd <ruta>"`) o Anthropic SDK con system prompt cargado desde `.claude/agents/<agente>.md` |
| Agente Persona/Juez | Anthropic SDK (`@anthropic-ai/sdk`) — modelos `claude-sonnet-4-6` o `claude-opus-4-7` según costo/exigencia |
| Reporte | HTML Playwright + traces on failure |
| Persistencia de hallazgos | Linear (reusa el mapping de `docs/tasks/linear-publish.yaml`) |

**No uses** otros runners (Vitest, Jest, Mocha) — el proyecto está alineado con la Estación 8 del programa.

---

## 4. Estructura de archivos (canónica)

```
qa/                                  # versionable
├── package.json
├── playwright.config.ts             # BDD + HTML report + traces on failure
├── tsconfig.json
├── tests/
│   ├── features/                    # .feature files (Gherkin en español)
│   │   ├── validador-fd.feature     # M1
│   │   ├── fd-a-td.feature          # M2
│   │   └── pipeline-abap.feature    # orquestador
│   ├── steps/                       # step definitions TypeScript
│   │   ├── common.steps.ts          # given/when transversales
│   │   ├── m1.steps.ts
│   │   ├── m2.steps.ts
│   │   └── m3.steps.ts
│   └── agents/                      # patrón Persona + Juez
│       ├── persona-consultor.ts
│       ├── persona-desarrollador.ts
│       ├── juez-m1.ts
│       ├── juez-m2.ts
│       └── juez-m3.ts
├── rubrics/                         # rúbricas del Juez (markdown)
│   ├── m1-validador.md
│   ├── m2-fd-a-td.md
│   └── m3-td-a-codigo.md
└── playwright-report/               # gitignored

evaluacion/                          # gitignored — dataset real anonimizado
├── dataset/<REQ-id>/
│   ├── fd-original.md
│   ├── td-real.md
│   └── codigo-produccion.abap
├── golden/                          # transcripts de referencia para calibrar al Juez
└── resultados/<REQ-id>.md
```

---

## 5. Reglas no negociables al escribir tests

Estas reglas heredan los Principios del PRD §6 y los hacen testeables.

### 5.1 Idioma

- Feature files, scenarios, steps y mensajes de assertion **en español**.
- Identificadores técnicos (`Playwright`, `expect`, nombres de tabla SAP, palabras reservadas ABAP) se mantienen.
- Excepción: tags Gherkin pueden ser cortos en inglés cuando es convención (`@happy-path`).

### 5.2 Principio #3 — el agente no toca SAP

- **Prohibido** mockear conexiones SAP, RFC, BAPIs, JCo. No hay conexión que mockear: el producto no se conecta a SAP.
- **Prohibido** generar tests que pretendan invocar `sapcli`, `STMS`, `SE38`, etc.
- Los tests operan **solo** sobre archivos del repositorio y outputs de los subagentes.

### 5.3 Principio #1 y #6 — gates humanos no se suprimen en tests

- No escribir tests que "aprueben automáticamente" un FD rechazado para seguir el pipeline.
- Los tests del orquestador (`/pipeline-abap`) deben validar que **se detiene** ante rechazo de M1, no que continúa.

### 5.4 Trazabilidad obligatoria (Principio #5)

- Cada scenario debe referenciar la(s) regla(s) que valida vía tags: `@ce-04`, `@cs-01`, `@br-09`, `@principio-2`.
- Step definitions que verifican outputs de M2/M3 deben assertear la **presencia de la sección "Decisiones y Supuestos"** y de la cabecera `⚠️ VERIFICAR:` donde aplique.

### 5.5 Datos sensibles

- Cualquier FD, TD o código real va en `evaluacion/` (gitignored).
- En `qa/` solo viven: feature files con FDs **fabricados**, rúbricas, steps, código del Juez/Persona.
- Si necesitás un FD de ejemplo en un feature, fabricalo en el step o en una fixture pública.

---

## 6. Patrones que el agente debe seguir

### 6.1 Feature files

- Cabecera `# language: es` obligatoria.
- `Característica`, `Antecedentes`, `Escenario`, `Esquema del escenario`, `Ejemplos` (sintaxis española de Gherkin).
- Tags por módulo (`@m1`/`@m2`/`@m3`/`@pipeline`) + tags por regla (`@ce-XX`, `@cs-XX`, `@br-XX`, `@principio-N`).
- Mensajes Then en presente declarativo: "el veredicto debe ser RECHAZADO".

### 6.2 Step definitions

- Un archivo por módulo (`m1.steps.ts`, `m2.steps.ts`, `m3.steps.ts`) más `common.steps.ts`.
- Steps que invocan al subagente devuelven el output crudo a un fixture compartido (`world` de playwright-bdd) para que los Then lo asserteen.
- Sin lógica de negocio en steps — solo I/O y assertions.

### 6.3 Patrón Persona + Juez

- **Persona** = LLM con system prompt de "consultor funcional" o "desarrollador ABAP", que genera FDs/feedback simulando al humano.
- **Juez** = LLM con system prompt que carga la rúbrica del módulo bajo prueba (`rubrics/m1-validador.md`, etc.), recibe `(output_agente, ground_truth)` y devuelve un scorecard JSON con scores por dimensión y razonamiento.
- Antes de usar al Juez para decidir go/no-go, **calibrarlo** contra el golden dataset hasta que sus scores correlen con la evaluación humana.

### 6.4 Rúbricas

- Una por módulo bajo prueba.
- Estructura: dimensiones explícitas (factualidad, completitud, adherencia, seguridad, ausencia de alucinaciones), escala 1-5, anclas verbales por nivel, ejemplos del dataset.
- Las dimensiones deben corresponderse con las métricas de [`docs/plan-evaluacion.md §4`](../../../docs/plan-evaluacion.md) — la suite es la implementación ejecutable de ese plan.

---

## 7. Comandos esperados

```bash
cd qa
npm install
npx playwright install            # primera vez

npm test                          # corre todo
npm run test:m1                   # solo @m1
npm run report                    # abre el HTML
```

CI futuro: workflow en `.github/workflows/qa.yml` que corre `npm test` con `ANTHROPIC_API_KEY` desde secrets y publica el report como artifact.

---

## 8. Anti-patrones (cosas que NO hacer)

- ❌ Mockear el subagente bajo prueba (defeats the purpose — lo que se prueba es su comportamiento, no su entorno).
- ❌ Tests binarios "pass/fail" para evaluar agentes generativos — usar Juez con scorecard multi-dimensional.
- ❌ Hardcodear FDs reales (con datos del cliente) en `qa/`. Siempre en `evaluacion/`.
- ❌ Crear feature files sin referencia a reglas (`@ce-XX`, etc.) — pierde trazabilidad.
- ❌ Aprobar un test cuando el output del agente "se parece" — el Juez debe assertear contra rúbrica, no contra similitud textual.
- ❌ Saltarse la calibración del Juez con golden dataset antes de usarlo en decisiones go/no-go.

---

## 9. Referencias

- [`docs/plan-evaluacion.md`](../../../docs/plan-evaluacion.md) — plan de evaluación pre-piloto (diseño).
- [`docs/checklist-auditoria-codigo-ia.md`](../../../docs/checklist-auditoria-codigo-ia.md) — checklist humana de auditoría, base para rúbricas de M3.
- [`prd.md`](../../../prd.md) §6 — Principios No Negociables.
- [`qa/README.md`](../../../qa/README.md) — README operacional de la suite.
- [Estación 8 del curso](../../../../Estacion-8/) — clase de origen.
