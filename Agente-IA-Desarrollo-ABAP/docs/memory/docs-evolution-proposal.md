# Docs Evolution Proposal — Backlog de sincronización

**Estación 7**: outputs estables de la memoria → docs canónicos.

Este documento agrupa propuestas concretas de actualización de docs que nacen del trabajo terminado. Cada propuesta tiene origen, doc destino, evidencia y estado.

> Reglas: cualquier propuesta requiere PR humano para entrar a un doc canónico. La memoria propone; los humanos deciden.

---

## 1. Catálogo de docs canónicos

Estos son los documentos donde la memoria puede proponer cambios. Cualquier otro destino requiere abrir discusión primero.

| Documento | Área | Quién aprueba cambios |
|---|---|---|
| `CLAUDE.md` | Configuración del agente principal | Jefe de Tecnología + Desarrollador líder |
| `AGENTS.md` | Contrato del arnés (multi-tool) | Jefe de Tecnología |
| `prd.md` | Visión del producto | Stakeholder + Jefe de Tecnología (requiere CR formal) |
| `docs/formato-fd-generico.md` | Contrato de entrada | Jefe de Tecnología + Líder funcional |
| `docs/checklist-auditoria-codigo-ia.md` | Checklist post-generación | Desarrolladores ABAP |
| `docs/plan-evaluacion.md` | Plan de evaluación pre-piloto | Jefe de Tecnología |
| `docs/orquestacion/orquestacion-de-trabajo.md` | Mapa del sistema | Desarrollador líder |
| `entregables/ADR-*.md` | ADRs | Desarrollador líder |
| `aidlc-docs/inception/application-design/*` | Application Design | Quien lo creó + Desarrollador líder |
| `README.md` | Operación | Cualquier desarrollador con PR review |

---

## 2. Formato de cada propuesta

```markdown
### PROP-<n> — <título corto>

- **Origen**: <issueId/capsuleId/PR>
- **Doc destino**: <ruta del doc>
- **Cambio propuesto**: <descripción concreta>
- **Evidencia**: <archivos, commits, fragmentos>
- **Riesgo de no hacerlo**: <qué se rompe si esto no se sincroniza>
- **Estado**: `pending` | `in-pr` | `merged` | `rejected`
- **Owner**: <persona o "TBD">
```

---

## 3. Backlog actual

> Plantilla inicial. Las propuestas reales aparecerán a medida que se cierren issues de la planning wave.

### PROP-001 — Documentar el dataset canónico de tests del Validador

- **Origen**: TASK-001 (próximamente al cerrarse)
- **Doc destino**: `docs/formato-fd-generico.md`
- **Cambio propuesto**: añadir sección "Dataset de referencia para tests" apuntando a `outputs/dataset-cr-001/`, con instrucciones para regenerarlo (porque `outputs/` no se versiona).
- **Evidencia**: comparison.md de TASK-004.
- **Riesgo de no hacerlo**: cada desarrollador reinventa el dataset y los re-tests pierden comparabilidad.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-002 — Documentar dependencia de pandoc

- **Origen**: TASK-002 (próximamente)
- **Doc destino**: `README.md` §2.1 (Prerrequisitos)
- **Cambio propuesto**: añadir `pandoc >= 2.0` a prerrequisitos cuando se procesen FDs `.docx`.
- **Evidencia**: comentarios del issue TASK-002.
- **Riesgo de no hacerlo**: el slash command `/validar-fd` fallará silenciosamente para `.docx` en máquinas nuevas.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-003 — Anotar comportamiento esperado de Read sobre PDFs grandes

- **Origen**: TASK-003 (próximamente)
- **Doc destino**: `.claude/agents/validador-fd.md` §5.1
- **Cambio propuesto**: documentar límites empíricos de páginas que el `Read` nativo procesa sin truncar, según lo descubierto en TASK-003.
- **Evidencia**: outputs de la sesión.
- **Riesgo de no hacerlo**: FDs largos en PDF pueden recibir veredictos sesgados sin que el desarrollador lo sepa.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-004 — Decisión sobre instalar CLI `opensymphony` en el repo

- **Origen**: estación 7 (decisión de adopción)
- **Doc destino**: `entregables/ADR-002-adopcion-opensymphony.md` (nuevo ADR)
- **Cambio propuesto**: abrir ADR-002 que registre si adoptamos OpenSymphony como sistema de orquestación + memoria, o si mantenemos solo el contrato `task-package.yaml` documental.
- **Evidencia**: este documento + `docs/memory/memory-dry-run.md`.
- **Riesgo de no hacerlo**: ambigüedad sobre si los comandos `opensymphony memory ...` son reales o aspiracionales.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-005 — Documentar SHA pinning de GitHub Actions como práctica del repo

- **Origen**: capsule `docs/memory/capsules/2026-06-01-ai-pr-review-setup.md` (decisión #1)
- **Doc destino**: `AGENTS.md` §8 (contrato del review) o sección nueva sobre operación CI
- **Cambio propuesto**: dejar explícito que cualquier `uses:` en workflows del repo debe pinear a SHA completo + comentario `# vX — YYYY-MM-DD`, nunca a tag móvil (`@v1`, `@main`). Incluir el patrón de verificación previo (`WebFetch` o `gh api repos/...`) para asegurar que el action existe antes de pinear.
- **Evidencia**: el placeholder `All-Hands-AI/openhands-pr-review-action` no existía (404) y nadie lo había verificado; el SHA pinning fue el cambio clave del setup productivo.
- **Riesgo de no hacerlo**: futuros workflows pueden volver a usar tags móviles (riesgo supply-chain) o pinear a actions inexistentes.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-006 — Documentar generación de OAuth token para CI con suscripción Pro/Max

- **Origen**: capsule `docs/memory/capsules/2026-06-01-ai-pr-review-setup.md` (decisión #2)
- **Doc destino**: `README.md` §2 (Prerrequisitos) o nuevo `docs/operacion/secrets-ci.md`
- **Cambio propuesto**: documentar `claude setup-token` como el método default para que cualquier workflow del repo que necesite invocar Claude reuse la suscripción del owner en lugar de facturar por token. Incluir período de rotación recomendado y referencia al setup doc del AI PR Review.
- **Evidencia**: `Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md` §2.1.
- **Riesgo de no hacerlo**: el próximo workflow (ej. CI de QA con LLM real) puede defaultear a API key y consumir tokens facturables sin necesidad.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-008 — Documentar la decisión W1 (CLI como motor) en plan-evaluacion.md

- **Origen**: capsule `docs/memory/capsules/2026-06-01-qa-llm-real-w1.md` (decisión #1)
- **Doc destino**: `docs/plan-evaluacion.md` (sección de "Stack de ejecución")
- **Cambio propuesto**: agregar sección explicando que la suite Persona+Juez se ejecuta vía CLI `claude -p` (no SDK) para usar la suscripción Pro/Max/Enterprise; documentar `--temperature` como limitación conocida (test de determinismo skipped); registrar las opciones W2 (claude-agent-sdk) y W3 (API key) como alternativas si W1 se vuelve insuficiente.
- **Evidencia**: ejecución del 2026-06-01 con 22/23 tests verdes en 11.4 min, costo $0 USD.
- **Riesgo de no hacerlo**: futuros lectores del plan-evaluacion no entienden por qué el README de qa habla de CLI mientras el plan original (Estación 8) describía SDK.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-009 — Patrón "CLI como motor" en AGENTS.md

- **Origen**: capsule `docs/memory/capsules/2026-06-01-qa-llm-real-w1.md` (invariant)
- **Doc destino**: `Agente-IA-Desarrollo-ABAP/AGENTS.md` (sección operativa)
- **Cambio propuesto**: documentar que cualquier script Node del repo que necesite invocar Claude **debe** usar el wrapper `qa/tests/agents/claude-cli.ts` (o equivalente) en lugar de `@anthropic-ai/sdk`, salvo justificación explícita. Razón: alinear todo el repo a usar la suscripción sin facturar API tokens.
- **Evidencia**: `claude-cli.ts` ya existe y está probado; PROP-006 propone el mismo patrón para CI.
- **Riesgo de no hacerlo**: futuros scripts pueden defaultear al SDK por costumbre y romper el contrato implícito de "este repo no factura tokens API".
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-007 — Regla: workflows productivos siempre en `.github/workflows/` de la raíz

- **Origen**: capsule `docs/memory/capsules/2026-06-01-ai-pr-review-setup.md` (invariant)
- **Doc destino**: `AGENTS.md` (sección operativa) o `Agente-IA-Desarrollo-ABAP/AGENTS.md` cuando el producto migre a su repo propio
- **Cambio propuesto**: documentar que GitHub Actions descubre workflows **únicamente** en `.github/workflows/` de la raíz del repo; cualquier workflow productivo del producto vive ahí, no en subdirectorios. Cuando el producto migre a repo propio, los workflows se mueven con él.
- **Evidencia**: durante toda la etapa post-Estación 7 el workflow vivió en `Agente-IA-Desarrollo-ABAP/.github/workflows/` y nunca se disparó hasta el `git mv` a raíz (commit 3a58e2e).
- **Riesgo de no hacerlo**: futuros workflows (ej. `qa.yml` para Estación 8) pueden volver a quedar invisibles si se colocan en subdirectorio.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

### PROP-014 — Alinear fixtures de Juez (`codigo-{bueno,pobre,mediocre}.abap`) al patrón 3 archivos

> Spin-off detectado al cerrar PROP-013. Los 3 fixtures de `qa/tests/fixtures/codigo-outputs/` y sus consumidores en `qa/tests/agents/juez-m3.spec.ts` aún representan código monolítico (clase global `ZCL_RPT_*`), no el patrón Patrimonio. **No es bloqueante para PROP-013** porque la evaluación Persona+Juez puede mirar contenido y reglas independientemente de la estructura de archivos, pero conviene decidir.

- **Origen**: cierre de PROP-013 (commit `<pendiente>`). El grep de coherencia detectó `codigo-bueno.abap` (734 líneas, clase `ZCL_RPT_*`) y sus análogos `codigo-pobre.abap`, `codigo-mediocre.abap` usados como referencia por el Juez.
- **Doc destino**:
  1. `qa/tests/fixtures/codigo-outputs/` — los 3 fixtures actuales.
  2. `qa/tests/agents/juez-m3.spec.ts` — referencias en los specs.
- **Decisión pendiente**:
  - **(opción A — alinear)**: regenerar los 3 fixtures como sets de 3 archivos cada uno (`codigo-{bueno,pobre,mediocre}-{report,top,cls}.abap`). El Juez evalúa el set completo. Más realista, mucho más mantenimiento.
  - **(opción B — desacoplar)**: dejar los fixtures monolíticos como están y documentar que el Juez evalúa contenido (decisiones, AUTHORITY-CHECK, calidad de comentarios, etc.) independientemente de si el código vive en 1 o 3 archivos. Recomendado si el output del LLM real ya viene en 3 archivos y el Juez los concatena lógicamente antes de evaluar.
- **Riesgo de no hacerlo**: si el LLM real empieza a generar 3 archivos (post-PROP-012) y los fixtures del Juez siguen siendo monolíticos, las comparaciones de calidad pueden distorsionarse o requerir adapters para reconciliar formatos.
- **Estado**: `pending`
- **Owner**: Desarrollador líder + responsable de QA

---

## 4. Cierre de propuestas

Cuando una propuesta llega a `merged`:

1. Mover el bloque al final de este archivo bajo "Histórico".
2. Anotar el PR que la mergeó.
3. Si la decisión afecta el contrato del arnés, considerar reflejarla también en `AGENTS.md`.

---

## 5. Histórico

### PROP-010 — Eliminar doble canal de comentado en `ai-pr-review.yml` ✅ merged

- **Origen**: AI PR Review en PR #1 (capsule `2026-06-01-ai-pr-review-smoke-test.md`)
- **Doc destino**: `.github/workflows/ai-pr-review.yml`
- **Cambio aplicado**: removido `use_sticky_comment: true`. El agente postea via `gh pr comment` como único canal. Comentario explicativo agregado en el workflow apuntando a esta PROP.
- **Mergeado en**: commit `0c5d7bf`
- **Estado**: `merged`

### PROP-011 — Reescribir `docs/ai-pr-review-human-setup.md` con los 5 pasos completos ✅ merged

- **Origen**: capsule `2026-06-01-ai-pr-review-smoke-test.md` (los 5 hallazgos del smoke)
- **Doc destino**: `Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md`
- **Cambio aplicado**: reescrito en 9 secciones. §2 enumera los 5 pasos críticos en orden estricto (GitHub App + Secret + Workflow sync + allowed-tools + Evidence regex), cada uno con su test de verificación. §5 incluye una guía rápida síntoma → causa → paso. Documentados los gotchas de copy-paste de la UI.
- **Mergeado en**: commit `0c5d7bf`
- **Estado**: `merged`

### PROP-012 — Patrón de modularización ABAP de Patrimonio (3 archivos REPORT + TOP + CLS, clases locales `cl_*`) ✅ merged

- **Origen**: corrida demo del 2026-06-01 (`outputs/2026-06-01/REQ-DEMO-001/codigo.abap`) confrontada con 3 ejemplos canónicos de programas reales de Patrimonio (1 clase global de logging, 1 report con FTP, 1 report ALV de extensión de materiales) analizados localmente. El código fuente no se versiona en este repo público por confidencialidad corporativa.
- **Doc destino**: `.claude/skills/template-alv/SKILL.md`, `CLAUDE.md`, `.claude/agents/td-a-codigo.md`, y el árbol de outputs en `CLAUDE.md` §7.
- **Cambio aplicado** (alcance estricto + coherencia, en un solo lote):
  - **`template-alv/SKILL.md`**: §3.1–3.3 cambian la clase del reporte de `ZCL_RPT_*` a `cl_<verbo>_<sustantivo>` (local). §6 reescrita: anatomía REPORT + TOP + CLS, con `PARAMETERS`/`SELECT-OPTIONS`/`SELECTION-SCREEN` ubicados en `_TOP` (event handlers `AT SELECTION-SCREEN` en `_REPORT` si aplican). §7 anti-patrones actualizado para hablar de "data globals dispersos" en lugar de "variables globales fuera de la clase". `description` del frontmatter actualizado para reflejar la nueva convención.
  - **`CLAUDE.md`**: §5.3 ahora apunta a `cl_<verbo>_<sustantivo>` local en `_CLS`. §5.5 distingue clases globales `ZCL_*` reusables (1 archivo standalone) vs clases locales `cl_*` embebidas en `_CLS`. §5.6 agrega regla de 3 archivos para reportes ejecutables. §7 árbol de outputs reemplaza `codigo.abap` por `codigo-report.abap` + `codigo-top.abap` + `codigo-cls.abap`.
  - **`td-a-codigo.md`**: §1 output principal describe los 3 archivos (más `codigo-clase.abap` para clases globales standalone). §5.1 añade ubicación de la cabecera (solo en `_REPORT` o `-clase`). §5.2 reescrita con esqueleto de los 3 archivos + §5.2bis para clase global. §5.3 añade ubicación del pie. "Reglas estructurales" sustituye el "Un solo archivo" por el contrato 3 archivos. §8 persistencia reescrita para versionar archivo por archivo. §11 Pre-Output Checklist agrega check 11 (estructura de archivos correcta).
- **Decisión Q2:C superada**: el cuestionario inicial Q2:C definía "un solo `.abap`" como default conservador hasta que la empresa aportara su convención. Los 3 ejemplos canónicos de Patrimonio confirman la convención y reemplazan el default.
- **Mergeado en**: commit `245cf7c`
- **Estado**: `merged`

### PROP-013 — Adaptar QA stub (orchestrator.ts + pipeline-abap.feature) al patrón 3 archivos de PROP-012 ✅ merged

- **Origen**: cierre de PROP-012 (commit `245cf7c`). La verificación de coherencia post-merge dejó referencias a `codigo.abap` (singular) en `qa/tests/steps/orchestrator.ts` y `qa/tests/features/pipeline-abap.feature`.
- **Decisión**: opción **B (simplificación)** — el stub escribe un único archivo marcador `codigo-report.abap` (suficiente para probar el contrato del orquestador: M3 corrió y persistió). La fidelidad del patrón 3 archivos se valida en otro layer (Persona+Juez del LLM real), no en el unit test del orquestador.
- **Cambio aplicado**:
  - `qa/tests/steps/orchestrator.ts` L207–208: `writeFileSync(join(carpeta, 'codigo-report.abap'), ...)` y `r.archivos_persistidos.push('codigo-report.abap')`. El `CODIGO_FIXTURE` (`codigo-bueno.abap`) se mantiene intacto — su contenido es irrelevante para el contrato del stub.
  - `qa/tests/features/pipeline-abap.feature`: 4 aserciones (L41, 77, 92, 104) cambian `"codigo.abap"` → `"codigo-report.abap"`. Título del escenario BR-12 actualizado: `no genera codigo-v3.abap` → `no genera archivos codigo-*-v3.abap` para consistencia con el versionado por archivo de PROP-012.
- **Mergeado en**: commit `<pendiente — completar tras commit con SHA real>`
- **Estado**: `merged`

