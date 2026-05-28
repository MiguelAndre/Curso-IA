# AGENTS.md — Contrato del arnés para el repositorio

> Este archivo es el contrato neutral que cualquier arnés de código (Claude Code, Codex, OpenHands, Factory, OpenCode, etc.) debe leer al entrar al repo. La configuración específica de Claude Code vive en `CLAUDE.md`; este documento referencia y resume lo que aplica a **cualquier agente** que opere aquí.

---

## 1. Identidad del repo

- **Producto**: Agente IA para Desarrollo ABAP — pipeline FD → TD → Código ABAP.
- **Naturaleza**: producto interno, configuración de Claude Code (sub-agentes + slash commands + skills + docs).
- **Documento maestro**: [`prd.md`](prd.md).
- **Configuración del agente principal**: [`CLAUDE.md`](CLAUDE.md).
- **Diseño de aplicación**: [`aidlc-docs/inception/application-design/`](aidlc-docs/inception/application-design/).
- **Estado AI-DLC**: [`aidlc-docs/aidlc-state.md`](aidlc-docs/aidlc-state.md).

---

## 2. Principios no negociables (PRD §6)

Todo agente que opere sobre este repo debe respetar estos principios. Son restricciones de sistema, no preferencias:

1. **El desarrollador ABAP es el garante final**. Todo código generado se revisa, se prueba y se aprueba humanamente antes de cualquier transporte.
2. **FD sin calidad suficiente no avanza**. El Módulo 1 (Validador) es un gate obligatorio.
3. **Operar exclusivamente en el ambiente de desarrollo**. Sin conexión ni credenciales SAP.
4. **Las compuertas de calidad existentes se conservan**. Tests unitarios y pruebas funcionales no se reducen porque el código sea generado por IA.
5. **Trazabilidad total**. Cada output expone su razonamiento en "Decisiones y Supuestos" y marca `⚠️ VERIFICAR:` en zonas de riesgo.
6. **La IA sugiere, el humano ejecuta**. Sin autopilot entre módulos.

Detalle completo y prohibiciones explícitas: ver `CLAUDE.md` §2 y §3.

---

## 3. Idioma de operación

- Outputs, comentarios de código y mensajes al usuario: **español**.
- Identificadores técnicos ABAP mantienen convenciones SAP (palabras reservadas en inglés).
- Esta regla aplica a cualquier arnés.

---

## 4. Estructura del repositorio

```text
.
├── AGENTS.md                  # este archivo
├── CLAUDE.md                  # configuración específica de Claude Code
├── prd.md                     # Product Requirements Document
├── README.md                  # guía operativa de los 5 casos de uso
├── .claude/
│   ├── agents/                # sub-agentes M1, M2, M3
│   ├── commands/              # slash commands /validar-fd, /generar-td, /generar-abap, /pipeline-abap
│   ├── skills/                # template-alv
│   └── settings.json
├── .agents/
│   └── skills/
│       └── custom-codereview-guide.md   # guía para AI PR Review
├── .github/
│   ├── workflows/ai-pr-review.yml
│   └── pull_request_template.md
├── docs/                      # documentos de referencia
│   ├── formato-fd-generico.md
│   ├── checklist-auditoria-codigo-ia.md
│   ├── plan-evaluacion.md
│   ├── orquestacion/
│   ├── tasks/                 # planning waves OpenSymphony
│   ├── memory/                # capsules y propuestas docs
│   ├── adr/
│   └── ai-pr-review-human-setup.md
├── entregables/               # C4 model, NFR matrix, ADR-001
├── aidlc-docs/                # AI-DLC artifacts (inception, construction, plans)
├── aidlc-rules/               # reglas AI-DLC
└── outputs/                   # runtime; ignorado por git
```

---

## 5. Contratos de entrada/salida

### 5.1 Entrada: Documento Funcional (FD)

Formato definido en `docs/formato-fd-generico.md`. Secciones obligatorias:

1. Objetivo
2. Alcance
3. Reglas de Negocio
4. Tablas SAP involucradas
5. Criterios de Aceptación
6. Casos Borde
7. Autorizaciones

Formatos aceptados (CR-001): `.md`, `.txt`, `.pdf`, `.docx`. El slash command `/validar-fd` normaliza a markdown antes de procesar.

### 5.2 Handshake interno: Documento Técnico (TD)

Producido por M2, consumido por M3. Debe incluir:

- Tipo de objeto ABAP.
- Objetos SAP involucrados.
- Arquitectura técnica.
- Campos y flujo de datos.
- "Decisiones y Supuestos" (obligatoria — Principio #5).
- TBD si quedó algo sin resolver.

### 5.3 Salida: archivo `.abap`

- Texto plano importable en Eclipse/SE38/SE80.
- Cabecera "Decisiones del código" obligatoria.
- Comentarios en español.
- Marcas `⚠️ VERIFICAR:` en zonas de riesgo.
- Referencia al checklist `docs/checklist-auditoria-codigo-ia.md` al pie.

---

## 6. Cómo operar (resumen)

| Comando | Qué hace | Cuándo usarlo |
|---|---|---|
| `/validar-fd <ruta>` | M1 — Valida FD. Output binario. | Antes de procesar un FD nuevo. Obligatorio. |
| `/generar-td <fd-aprobado> <req-id>` | M2 — FD → TD. | Tras aprobar el FD. |
| `/generar-abap <td-aprobado> <req-id>` | M3 — TD → Código ABAP. | Tras aprobar el TD. |
| `/pipeline-abap <fd> <req-id>` | Orquestador completo con gates humanos. | Flujo típico (UC1/UC4). |

Detalle completo en `README.md`.

---

## 7. Orquestación de trabajo y planning waves

Para cambios sustantivos (CR, features), usar la mecánica descrita en [`docs/orquestacion/orquestacion-de-trabajo.md`](docs/orquestacion/orquestacion-de-trabajo.md):

1. Generar `docs/tasks/task-package.yaml` + `milestones.md` + task files (skill `create-implementation-plan`).
2. Validar humanamente el paquete (`docs/tasks/validation-evidence.md`).
3. Publicar a Linear (`convert-tasks-to-linear` → `docs/tasks/linear-publish.yaml`).
4. Ejecutar tareas con arnés.
5. PR con Evidence (ver plantilla en `.github/pull_request_template.md` y ejemplo en `docs/tasks/pr-evidence-example.md`).
6. AI PR Review (advisory).
7. Merge humano.
8. Memory capture (`docs/memory/`).

---

## 8. AI PR Review

Este repo ejecuta un AI PR Review **advisory** sobre cada PR. Es una segunda mirada técnica; **la aprobación humana sigue siendo el gate de merge**.

- Workflow: `.github/workflows/ai-pr-review.yml`.
- Guía custom: `.agents/skills/custom-codereview-guide.md`.
- Setup humano (secrets, variables, branch protection): `docs/ai-pr-review-human-setup.md`.
- Plantilla de PR: `.github/pull_request_template.md` (incluye sección Evidence obligatoria).
- Label para re-correr el review: `review-this`.

Foco del review: correctness, seguridad, compatibilidad, migraciones, tests, mantenibilidad, adherencia a los Principios del PRD.

---

## 9. Memoria evolutiva

Toda tarea completada debe dejar capsule en `docs/memory/` siguiendo el formato de `docs/memory/memory-dry-run.md`. Los aprendizajes estables sincronizan hacia `docs/`, ADRs o `CLAUDE.md` según corresponda. Propuestas pendientes viven en `docs/memory/docs-evolution-proposal.md`.

---

## 10. Cosas que un agente NO debe hacer

- No tocar `outputs/` desde el control de versiones (está en `.gitignore` por contener datos sensibles).
- No modificar `prd.md` salvo change request explícito aprobado.
- No saltar gates humanos del pipeline.
- No simular conexión SAP.
- No reducir o comentar pruebas humanas.
- No mergear PRs sin AI review + aprobación humana.
- No agregar features, abstracciones o refactors fuera del scope de la tarea actual.

---

## 11. Referencias rápidas

- [PRD](prd.md)
- [CLAUDE.md](CLAUDE.md) — config específica Claude Code
- [README.md](README.md) — guía operativa
- [docs/formato-fd-generico.md](docs/formato-fd-generico.md)
- [docs/checklist-auditoria-codigo-ia.md](docs/checklist-auditoria-codigo-ia.md)
- [docs/plan-evaluacion.md](docs/plan-evaluacion.md)
- [docs/orquestacion/orquestacion-de-trabajo.md](docs/orquestacion/orquestacion-de-trabajo.md)
- [docs/tasks/](docs/tasks/) — planning waves
- [docs/ai-pr-review-human-setup.md](docs/ai-pr-review-human-setup.md)
- [aidlc-docs/](aidlc-docs/) — AI-DLC artifacts
