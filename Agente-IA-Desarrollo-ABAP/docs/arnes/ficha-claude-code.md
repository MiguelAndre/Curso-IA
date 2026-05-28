# Ficha del arnés — Claude Code

> Entregable de la **Estación 6** (Hardcore AI 30X). Describe en una sola página cómo opera el arnés sobre este repo: modelo, contexto, permisos, validación y evidencia. Mantenida por el Configurador (Jefe de Tecnología + Desarrollador líder).

**Fecha**: 2026-05-27
**Producto**: Agente IA para Desarrollo ABAP — pipeline FD → TD → Código ABAP.

---

## 1. Arnés y modelo

| Aspecto | Valor | Notas |
|---|---|---|
| **Arnés** | Claude Code | CLI + extensiones IDE (VS Code, JetBrains). |
| **Modelo principal** | Claude Opus 4.x (familia 4) | Modelo de razonamiento para sub-agentes de validación y generación. |
| **Modelo alternativo** | Claude Sonnet 4.6 / Haiku 4.5 | Para tareas de menor complejidad o presupuesto ajustado. |
| **Proveedor / API** | Anthropic API | Configurada vía Claude Code (no se accede al API en este repo directamente). |
| **Contexto** | 1M tokens (Opus 4.7 1M context) | Suficiente para leer todo `aidlc-docs/` + sub-agentes + comandos en una sola sesión. |
| **Multimodalidad** | Sí (imágenes, PDFs nativos) | Crítico para CR-001 (lectura nativa de FDs en `.pdf`). |
| **Tool calling** | Sí (`Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, sub-agentes, slash commands, MCP) | Tools no restringidas técnicamente; las restricciones son operativas (ver §2). |
| **Idioma de operación** | Español | Todos los outputs, mensajes y comentarios. Identificadores ABAP siguen convención SAP (inglés). |
| **Superficie de trabajo** | Repositorio local + sesión Claude Code | Sin ejecución sobre SAP. |

---

## 2. Permisos

### 2.1 Configuración técnica

- `.claude/settings.json` mantiene perfil **permissive** (decisión AD3 del Application Design). No hay `allow`/`deny` explícitos para tools.
- El bloque `attribution` declara el license tag para PRs.
- Permisos locales por máquina viven en `.claude/settings.local.json` (ignorado por git).

### 2.2 Prohibiciones operativas (no técnicas)

Aunque las tools no están restringidas en `settings.json`, **estas operaciones están prohibidas operativamente** (CLAUDE.md §3). El agente debe rechazarlas:

- Ejecutar `Bash` que toque ambientes SAP (RFC, sapcli, JCo, etc.).
- Conectar a hostnames `*.sap*`, `*.gtosystems*` o endpoints corporativos.
- Solicitar, almacenar o procesar credenciales SAP.
- Generar código que invoque BAPIs/RFCs con credenciales hardcoded.
- Automatizar transportes (STMS, transport_request).
- Asumir acceso a datos reales de producción.

### 2.3 Gates humanos no negociables

Entre cada módulo del pipeline (M1 → M2 → M3), el orquestador `/pipeline-abap` **pausa y espera aprobación humana explícita**. No existe modo autopilot. Fundamentos: Principios #1 y #6 del PRD.

---

## 3. Validación

Antes de mergear un PR sustantivo, se ejecutan estas validaciones (orden recomendado):

### 3.1 Validaciones automatizadas

| Validación | Dónde corre | Bloqueante |
|---|---|---|
| **Sub-agente `validador-fd` (M1)** | Sesión Claude Code, antes de cada FD nuevo | ✅ Sí — output binario APROBADO/RECHAZADO |
| **Lint markdown** | `aidlc-rules/.markdownlint-cli2.yaml` sobre docs cambiados | Advisory |
| **AI PR Review** | `.github/workflows/ai-pr-review.yml` sobre cada PR | Advisory (no es gate de merge) |
| **Sección `## Evidence` en PR** | `.github/workflows/ai-pr-review.yml` verifica que exista | ✅ Sí (si `AI_REVIEW_REQUIRE_EVIDENCE=true`) |

### 3.2 Validaciones humanas (no se reducen — Principio #4)

| Validación | Responsable | Bloqueante |
|---|---|---|
| **Syntax check ABAP en Eclipse** | Desarrollador ABAP | ✅ Sí |
| **Pruebas unitarias del desarrollador** | Desarrollador ABAP | ✅ Sí |
| **Pruebas funcionales con consultor** | Consultor funcional + Desarrollador | ✅ Sí (antes de transportar) |
| **Checklist de auditoría** | Desarrollador ABAP | ✅ Sí — [`docs/checklist-auditoria-codigo-ia.md`](../checklist-auditoria-codigo-ia.md) |
| **Branch Protection (1 approval mínimo)** | Reviewer humano del PR | ✅ Sí |

### 3.3 Ciclo de retroalimentación

Si M3 falla syntax check o pruebas, el desarrollador regenera con feedback puntual. **Máximo 2 ciclos**; tras eso, escalar a desarrollo manual desde el TD (PRD §7 Journey 4).

---

## 4. Evidencia

Toda acción del agente debe dejar rastro auditable. Estos son los lugares donde queda traza:

| Tipo de evidencia | Ubicación | Persiste |
|---|---|---|
| **Outputs por requerimiento** | `outputs/<YYYY-MM-DD>-<REQ-id>/` — fd.md, validacion.md, td.md, codigo.abap | Local (en `.gitignore`) — puede contener PII |
| **Decisiones del agente** | Sección "Decisiones y Supuestos" en cada TD y `.abap` (Principio #5) | Versionado si el doc lo es |
| **Marcas de incertidumbre** | Comentarios `⚠️ VERIFICAR:` en código generado | Versionado con el `.abap` |
| **PR Evidence** | Sección `## Evidence` del PR (plantilla `.github/pull_request_template.md`) | GitHub PR |
| **AI PR Review comments** | Comentarios del workflow en el PR | GitHub PR |
| **Memory capsules** | [`docs/memory/capsules/`](../memory/) (estación 7) | Versionado |
| **AI-DLC audit trail** | [`aidlc-docs/audit.md`](../../aidlc-docs/audit.md) + [`aidlc-state.md`](../../aidlc-docs/aidlc-state.md) | Versionado |
| **ADRs** | [`entregables/ADR-*.md`](../../entregables/) | Versionado |
| **Excel del piloto** | Externo a este repo | Operación |

---

## 5. Referencias rápidas

- [PRD v1.0](../../prd.md) — visión, métricas, principios.
- [CLAUDE.md](../../CLAUDE.md) — configuración específica del arnés Claude Code.
- [AGENTS.md](../../AGENTS.md) — contrato neutral multi-tool.
- [docs/orquestacion/orquestacion-de-trabajo.md](../orquestacion/orquestacion-de-trabajo.md) — mapa de orquestación.
- [docs/ai-pr-review-human-setup.md](../ai-pr-review-human-setup.md) — setup del AI PR Review.
- [docs/checklist-auditoria-codigo-ia.md](../checklist-auditoria-codigo-ia.md) — checklist humano post-generación.

---

## 6. Cambios a esta ficha

Esta ficha se actualiza cuando:

- Cambia el modelo principal o el proveedor.
- Cambia `settings.json` de forma estructural (no solo `local`).
- Se incorpora una validación nueva (automatizada o humana).
- Se cambia un Principio del PRD (requiere CR formal).

Cambios pasan por PR humano con review.
