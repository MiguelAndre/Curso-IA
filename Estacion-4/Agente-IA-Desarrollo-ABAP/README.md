# Agente IA para Desarrollo ABAP

> Producto interno del equipo de desarrollo. Pipeline FD → TD → Código ABAP basado en Claude Code. Acompaña al desarrollador; no lo reemplaza.

**Documentos de referencia**: [`prd.md`](prd.md) (visión y métricas) · [`CLAUDE.md`](CLAUDE.md) (configuración del agente) · [`AGENTS.md`](AGENTS.md) (contrato del arnés) · [`docs/`](docs/) (formato FD, checklist, plan de evaluación, orquestación, memoria).

---

## 1. ¿Qué hace este producto?

Toma un **Documento Funcional (FD)** elaborado por un consultor funcional y lo transforma en **código ABAP listo para auditoría humana**, en tres pasos con revisión humana obligatoria en cada uno:

```
   FD            →   M1: Validador   →   M2: FD → TD   →   M3: TD → Código   →   .abap
(consultor)          (¿cumple?)         (Spec técnica)    (Código ABAP OO)      (desarrollador
                                                                                 importa y prueba)
```

- **No** transporta código automáticamente.
- **No** se conecta a SAP.
- **Sí** deja trazabilidad: cada output incluye "Decisiones y Supuestos" y marca `⚠️ VERIFICAR:` en zonas de riesgo.

---

## 2. Instalación y configuración inicial

### 2.1 Prerrequisitos

- **Claude Code** instalado y autenticado (el equipo ya tiene licencia activa — PRD §2.3).
- **Git** instalado.
- Acceso al repositorio del producto (este).

### 2.2 Configuración

1. Clonar el repositorio.
2. Abrir el directorio raíz con Claude Code (`claude code` en la carpeta).
3. Claude Code lee automáticamente `CLAUDE.md` y `.claude/settings.json`.
4. Verificar que los sub-agentes y comandos estén disponibles ejecutando `/agents` o `/help` en Claude Code.
5. (Opcional, primera vez) Leer `CLAUDE.md` completo para entender los Principios No Negociables del PRD §6.

### 2.3 Estructura del repositorio

```
.
├── CLAUDE.md                              # Configuración del agente (Módulo 4)
├── AGENTS.md                              # Contrato neutral del arnés (multi-tool)
├── README.md                              # Este documento
├── prd.md                                 # Product Requirements Document
├── .claude/
│   ├── settings.json
│   ├── agents/                            # Sub-agentes M1, M2, M3
│   ├── commands/                          # Slash commands
│   └── skills/template-alv/               # Skill activable para reportes ALV
├── .agents/
│   └── skills/custom-codereview-guide.md  # Guía custom para el AI PR Review
├── .github/
│   ├── workflows/ai-pr-review.yml         # Workflow AI PR Review (advisory)
│   └── pull_request_template.md           # Plantilla de PR con Evidence obligatoria
├── docs/
│   ├── formato-fd-generico.md             # Contrato de entrada del pipeline
│   ├── checklist-auditoria-codigo-ia.md   # Checklist post-generación
│   ├── plan-evaluacion.md                 # Plan de evaluación pre-piloto
│   ├── ai-pr-review-human-setup.md        # Pasos manuales para activar el AI review
│   ├── orquestacion/                      # Mapa de orquestación de trabajo
│   ├── tasks/                             # Planning waves OpenSymphony
│   ├── memory/                            # Capsules y propuestas de docs evolutivos
│   └── adr/                               # ADRs del producto
├── entregables/                           # C4 model, NFR matrix, ADRs maestros
├── outputs/                               # ⚠️ ignorado por git — outputs por requerimiento
└── aidlc-docs/                            # Documentación AI-DLC del proceso de construcción
```

---

## 3. Comandos disponibles

| Comando | Qué hace | Cuándo usarlo |
|---|---|---|
| `/validar-fd <ruta-fd>` | Invoca el Módulo 1. Aprueba o rechaza un FD con reporte de gaps si rechaza. | Antes de procesar un FD nuevo. **Obligatorio**. |
| `/generar-td <ruta-fd-aprobado> <req-id>` | Invoca el Módulo 2. Genera la Especificación Técnica desde un FD aprobado. | Después de aprobar el FD. |
| `/generar-abap <ruta-td-aprobado> <req-id>` | Invoca el Módulo 3. Genera código ABAP a partir de un TD aprobado. | Después de aprobar el TD. |
| `/pipeline-abap <ruta-fd> <req-id>` | Orquestador: ejecuta M1 → gate humano → M2 → gate humano → M3. | **Recomendado** para el flujo típico (UC1, UC4). |

> **Notas**:
> - `<req-id>` es libre, p. ej. `REQ-2026-042`. Define el nombre de la carpeta `outputs/<fecha>-<req-id>/`.
> - Los comandos directos (`/validar-fd`, `/generar-td`, `/generar-abap`) son útiles para casos especiales (UC5 — objeto legado, regeneración con feedback puntual).

---

## 4. Los 5 casos de uso operacionalizados

### UC1 — Pipeline completo: reporte Z nuevo (happy path)

**Cuándo**: el consultor te entrega un FD para un reporte Z nuevo (p. ej. reporte de materiales por proveedor).

1. Verifica que el FD esté en formato markdown (ver `docs/formato-fd-generico.md`).
2. Ejecuta:
   ```
   /pipeline-abap docs/ejemplos/fd-materiales-por-proveedor.md REQ-2026-042
   ```
3. M1 valida. Si aprueba, sigue. Si rechaza, devuelve los gaps al consultor — pipeline detenido.
4. Revisa el TD que muestra M2 en chat (y queda en `outputs/<fecha>-REQ-2026-042/td.md`). Aprueba o pide ajustes.
5. Revisa el `.abap` que muestra M3 (queda en `outputs/<fecha>-REQ-2026-042/codigo.abap`).
6. Importa el `.abap` en Eclipse. Pasa **syntax check** y **pruebas unitarias** (Principio #4).
7. Coordina **pruebas funcionales** con el consultor.
8. Aprueba con el [`checklist`](docs/checklist-auditoria-codigo-ia.md). Transporta.
9. Registra en el Excel del piloto: `Generado por agente: Sí` · `Horas de ajuste: <N>h`.

### UC2 — FD incompleto: validación rechaza y guía la corrección

**Cuándo**: M1 rechaza el FD entregado.

1. Ejecuta `/validar-fd <ruta-fd>` (o `/pipeline-abap` y M1 corre primero).
2. M1 produce un reporte de gaps con checklist específico (p. ej. "Falta detalle en sección 6 Casos Borde").
3. Reenvía el reporte al consultor.
4. Mientras el consultor completa el FD, **no quedas bloqueado** — toma el siguiente ticket con FD completo (PRD §7 Journey 3).
5. Cuando el consultor responde con FD actualizado, re-valida. Si aprueba, sigue con el pipeline.

### UC3 — Código generado requiere iteración (ciclo de retroalimentación)

**Cuándo**: el código de M3 falla syntax check o pruebas unitarias en el primer intento (esperable ~50% del tiempo — PRD §10.5).

1. Importa el código en Eclipse. Identifica el error específico.
2. En la sesión Claude Code, describe el error al sub-agente `td-a-codigo`:
   ```
   El código falla con: "field MARC-MTART not found in structure". El método select_data no parece estar haciendo el join correcto.
   ```
3. M3 regenera incorporando la corrección (versión `codigo-v2.abap`).
4. Repite hasta máximo **2 ciclos**.
5. Si tras 2 ciclos sigue fallando con el mismo error → **escala a desarrollo manual** desde el TD (PRD §7 Journey 4). Registra en el Excel: `Generado por agente: Parcial` · motivo del escalamiento.

### UC4 — Validación de negocio: BAdI / User Exit

**Cuándo**: el FD describe una regla de negocio que debe implementarse vía BAdI o User Exit.

1. Ejecuta `/pipeline-abap docs/ejemplos/fd-badi.md REQ-...` igual que UC1.
2. M2 identifica el BAdI o User Exit aplicable y el método a implementar.
3. Verifica con SE19/SE18 que el BAdI exista y esté disponible en tu sistema. Si no, `⚠️ VERIFICAR` y ajusta.
4. M3 genera la implementación del método del BAdI.
5. Valida punto de extensión, prueba e importa.

### UC5 — Documentación técnica de objeto ABAP legado

**Cuándo**: necesitas modificar un objeto Z existente y no tiene TD documentado.

1. Crea un archivo temporal con el código ABAP existente:
   ```
   echo "$(<programa-legacy.abap)" > outputs/temporal/codigo-legado.abap
   ```
2. Invoca M2 directamente con el código como input (modo reverse engineering):
   ```
   /generar-td outputs/temporal/codigo-legado.abap REQ-2026-LEG
   ```
3. M2 genera un TD descriptivo desde el código existente.
4. Complementa el TD con el contexto de negocio que falte (los cambios solicitados).
5. Continúa con `/generar-abap` para producir la versión modificada.

---

## 5. Troubleshooting

### El validador rechaza FDs que para mí están bien

- Revisa los gaps específicos del reporte. Probablemente falta una sección estructural (las 7 obligatorias del formato genérico).
- Si crees que el validador es muy estricto, registra el caso y discute con el Jefe de Tecnología — ajustar el validador es decisión de configuración (Módulo 4).

### M3 falla syntax check más de 2 veces seguidas

- Aplica la regla de UC3: **escala a manual** después de 2 ciclos.
- Registra el motivo (módulos no públicos, tablas no accesibles, lógica fuera de alcance LLM).
- Este patrón **debe documentarse** — es input para Fase 2 (MCP de solo lectura a SAP Development).

### El agente sugiere algo que viola un Principio del PRD

- **Niégate y reporta**. Cita el Principio violado.
- Si la sugerencia incluye conectar a SAP, ejecutar transporte, o saltarse el Validador, el agente está fallando. Reporta al Jefe de Tecnología para ajustar `CLAUDE.md`.

### No encuentro un sub-agente o comando

- Verifica que estás abriendo Claude Code en la **raíz del repo** (donde está `CLAUDE.md`).
- Ejecuta `/agents` para listar sub-agentes disponibles.
- Ejecuta `/help` para listar comandos.

### Los outputs están desordenados

- Verifica que estás pasando un `<req-id>` consistente entre M1/M2/M3 o usando `/pipeline-abap` que lo encadena automáticamente.
- Estructura esperada: `outputs/<YYYY-MM-DD>-<REQ-id>/` con `fd.md`, `validacion.md`, `td.md`, `codigo.abap`.

---

## 6. Métricas del piloto

Mantén actualizado el Excel del piloto (PRD §10) con cada requerimiento procesado:

| Columna | Qué registrar |
|---|---|
| Fecha llegada | Cuándo entró a la cola |
| Fecha inicio | Cuándo el desarrollador lo tomó |
| Fecha entrega | Cuándo se entregó a pruebas funcionales |
| Fecha fin | Cuándo se cerró post-producción |
| **Generado por agente** | `Sí` / `Parcial` / `No` |
| **Horas de ajuste al código IA** | Target ≤2h |
| Devolución post-entrega | `Sí` / `No` (con motivo si Sí) |

---

## 7. Orquestación de tareas, review automatizado y memoria

Para cambios sustantivos (Change Requests, features nuevas) el flujo no se queda en el pipeline FD→TD→Código: se descompone en una cola revisable.

### 7.1 De AI-DLC a tareas publicables

- `docs/orquestacion/orquestacion-de-trabajo.md` — mapa del sistema (arnés, gestor de tareas, workflow, cola, review, memoria) aplicado a este producto.
- `docs/tasks/task-package.yaml` — manifest OpenSymphony de la planning wave activa (`cr-001-u2-multiformato-revalidacion`).
- `docs/tasks/milestones.md` — milestones de la wave.
- `docs/tasks/00X-*.md` — task files con contrato OpenSymphony (Summary, Scope, Deliverables, Acceptance Criteria, Test Plan, Context, Definition of Ready).
- `docs/tasks/validation-evidence.md` — evidencia de la validación humana y del dry-run previo a publicar.
- `docs/tasks/linear-publish.yaml` — mapping local `TASK-*` ↔ Linear issue (identifier, URL, issueId).
- `docs/tasks/pr-evidence-example.md` — guía + ejemplo completo de cómo abrir un PR de tarea con la sección Evidence que exige el AI review.

### 7.2 AI PR Review (advisory)

Sobre cada PR corre un AI PR Review **advisory**. La aprobación humana sigue siendo el gate de merge (Principio #1 del PRD).

- `.github/workflows/ai-pr-review.yml` — workflow.
- `.github/pull_request_template.md` — plantilla con sección Evidence obligatoria.
- `.agents/skills/custom-codereview-guide.md` — guía custom (foco en Principios del PRD y zonas sensibles del repo).
- `docs/ai-pr-review-human-setup.md` — pasos manuales para activarlo (secrets, variables, label `review-this`, branch protection, SHA pinning).

### 7.3 Memoria evolutiva

Cada tarea cerrada deja una capsule consultable en futuras tareas. Los aprendizajes estables sincronizan a docs canónicos vía propuestas explícitas.

- `docs/memory/memory.yaml` — índice de capsules.
- `docs/memory/memory-dry-run.md` — formato de capsules + dry-run.
- `docs/memory/docs-evolution-proposal.md` — backlog de propuestas de docs sync pendientes.

### 7.4 Contrato neutral del arnés

- `AGENTS.md` — contrato neutral que cualquier arnés (Claude Code, Codex, OpenHands, etc.) debe leer al entrar al repo. `CLAUDE.md` queda como la configuración específica de Claude Code.

---

## 8. Referencias

### Operación

- [PRD v1.0](prd.md) — visión, métricas, casos de uso.
- [CLAUDE.md](CLAUDE.md) — configuración del agente y restricciones operativas.
- [AGENTS.md](AGENTS.md) — contrato neutral del arnés.
- [docs/formato-fd-generico.md](docs/formato-fd-generico.md) — contrato de entrada.
- [docs/checklist-auditoria-codigo-ia.md](docs/checklist-auditoria-codigo-ia.md) — checklist de auditoría.
- [docs/plan-evaluacion.md](docs/plan-evaluacion.md) — plan de evaluación pre-piloto (diseño).

### Orquestación, review y memoria

- [docs/orquestacion/orquestacion-de-trabajo.md](docs/orquestacion/orquestacion-de-trabajo.md)
- [docs/tasks/task-package.yaml](docs/tasks/task-package.yaml) · [milestones.md](docs/tasks/milestones.md) · [validation-evidence.md](docs/tasks/validation-evidence.md) · [linear-publish.yaml](docs/tasks/linear-publish.yaml) · [pr-evidence-example.md](docs/tasks/pr-evidence-example.md)
- [docs/ai-pr-review-human-setup.md](docs/ai-pr-review-human-setup.md)
- [.agents/skills/custom-codereview-guide.md](.agents/skills/custom-codereview-guide.md)
- [docs/memory/memory-dry-run.md](docs/memory/memory-dry-run.md) · [docs-evolution-proposal.md](docs/memory/docs-evolution-proposal.md)

### Diseño y AI-DLC

- [entregables/ADR-001-claude-code-como-plataforma.md](entregables/ADR-001-claude-code-como-plataforma.md)
- [entregables/c4-model.md](entregables/c4-model.md) · [entregables/nfr-matrix.md](entregables/nfr-matrix.md)
- [aidlc-docs/](aidlc-docs/) — documentación AI-DLC del proceso de construcción.

---

## 9. Contribuciones y mantenimiento

- Cambios a `CLAUDE.md`, sub-agentes, comandos o skills se versionan vía git.
- El **Configurador** (Jefe de Tecnología + Desarrollador líder) mantiene la configuración. Los demás desarrolladores la consumen.
- Cualquier ajuste post-piloto pasa por: hallazgo documentado → ajuste de Módulo 4 → re-evaluación con un caso del piloto.
