# Unit of Work — Decomposición del producto

**Fecha**: 2026-05-19
**Decisiones**: Q1:A (U1 monolítica), Q2:A (U6 unidad propia para el skill)
**Total de unidades**: 6 (U1..U6)

---

## Terminología

- **Producto**: monolito lógico (un único repositorio con configuración Claude Code).
- **Unit of Work**: agrupación lógica de archivos/componentes que se construyen, revisan y aprueban como bloque.
- No hay "servicios desplegables" porque no hay despliegue tradicional — todo vive en el repo y se ejecuta dentro de sesiones Claude Code.

---

## Definición de las 6 unidades

### U1 — Configuración Base & Documentación

**Propósito**: sentar el contexto permanente y los documentos de referencia que consumen todas las demás unidades.

**Componentes incluidos** (de `components.md`):
- C1 — `CLAUDE.md`
- C11 — `.claude/settings.json`
- C7 — `docs/formato-fd-generico.md`
- C8 — `docs/checklist-auditoria-codigo-ia.md`
- C9 — `docs/plan-evaluacion.md`
- C10 — `README.md`

**Criterio de aceptación**:
- `CLAUDE.md` declara rol, los 6 Principios del PRD, prohibiciones explícitas, formato "Decisiones y Supuestos" / "⚠️ VERIFICAR", buenas prácticas SAP, idioma español.
- `docs/formato-fd-generico.md` lista las secciones mínimas del FD.
- `docs/checklist-auditoria-codigo-ia.md` tiene al menos los 7 ítems del PRD §11.3.
- `docs/plan-evaluacion.md` define dataset, comparación, métricas y formato de reporte.
- `README.md` documenta operación de los 5 casos de uso y troubleshooting básico.
- `.claude/settings.json` válido (permissive según AD3).

**Trazabilidad**: IS1, IS9, IS10, IS12, IS13, IS14, IS15 + FR-DOC-01..04 + FR-M4-01..14 + NFR-01, NFR-04, NFR-05, NFR-06, NFR-08.

---

### U2 — Módulo 1: Validador de FD

**Propósito**: implementar el sub-agente y el slash command para validar la calidad del FD de entrada.

**Componentes incluidos**:
- C2 — `.claude/agents/validador-fd.md`
- Slash command — `.claude/commands/validar-fd.md`

**Criterio de aceptación**:
- Sub-agente con instrucciones claras: análisis estructural contra `docs/formato-fd-generico.md` + análisis semántico.
- Output binario `APROBADO`/`RECHAZADO` con reporte de gaps cuando rechaza.
- Sin bypass; lenguaje no acusatorio.
- Slash command `/validar-fd <ruta>` invoca el sub-agente correctamente.

**Trazabilidad**: IS2, IS5 + FR-M1-01..08.

---

### U3 — Módulo 2: FD → TD

**Propósito**: implementar el sub-agente y el slash command para generar la Especificación Técnica desde un FD aprobado.

**Componentes incluidos**:
- C3 — `.claude/agents/fd-a-td.md`
- Slash command — `.claude/commands/generar-td.md`

**Criterio de aceptación**:
- Verifica aprobación del FD antes de generar.
- Identifica tipo de objeto, objetos SAP, arquitectura técnica, campos.
- Incluye sección "Decisiones y Supuestos" y marca `TBD:` lo no resuelto.
- Persiste en `outputs/<fecha>-<req_id>/td.md` y también imprime inline.
- Permite regeneración con feedback (`td-v2.md`).
- Activa el skill C6 cuando el contexto contiene ALV.

**Trazabilidad**: IS3, IS6 + FR-M2-01..10.

---

### U4 — Módulo 3: TD → Código ABAP

**Propósito**: implementar el sub-agente y el slash command para generar código ABAP desde un TD aprobado.

**Componentes incluidos**:
- C4 — `.claude/agents/td-a-codigo.md`
- Slash command — `.claude/commands/generar-abap.md`

**Criterio de aceptación**:
- Verifica que el TD trae "Decisiones y Supuestos".
- Genera clases `ZCL_*` con convenciones de la empresa (genéricas).
- Marca `⚠️ VERIFICAR:` en zonas de riesgo (autorización, tablas Z, condiciones borde).
- AUTHORITY-CHECK donde aplica (SECURITY-10).
- Sin SELECT *, sin SQL dinámico inseguro (SECURITY-09).
- Sin PII/secretos (SECURITY-03).
- Cabecera "Decisiones del código".
- Persiste en `outputs/<fecha>-<req_id>/codigo.abap`.
- Referencia al checklist al pie.
- Permite regeneración con descripción de error.

**Trazabilidad**: IS4, IS7 + FR-M3-01..12. **NFRs aplicables sólo a esta unidad**: NFR-08 + reglas SECURITY-03/09/10.

---

### U5 — Orquestador `/pipeline-abap`

**Propósito**: implementar el slash command que ejecuta el pipeline FD→TD→Código en una sesión con gates humanos obligatorios.

**Componentes incluidos**:
- C5 — `.claude/commands/pipeline-abap.md`

**Criterio de aceptación**:
- Invoca C2 con `Agent(subagent_type="validador-fd", ...)`.
- Si APROBADO → muestra resultado y pregunta al usuario si continuar.
- Si RECHAZADO → detiene pipeline.
- Pausa explícita entre M1→M2, M2→M3 (3 gates total).
- Crea `outputs/<fecha>-<req_id>/` y persiste validacion.md, fd.md (copia), td.md, codigo.abap.
- Resumen final con próximos pasos.

**Trazabilidad**: IS8 + FR-OR-01..03.

---

### U6 — Skill Template ALV

**Propósito**: skill activable que enriquece el contexto cuando el FD/TD describe un reporte ALV.

**Componentes incluidos**:
- C6 — `.claude/skills/template-alv/SKILL.md`

**Criterio de aceptación**:
- `description` en frontmatter dispara activación automática cuando el contexto contiene "ALV", "SALV", "reporte ALV", "CL_GUI_ALV_GRID" o sinónimos.
- Documenta patrón: clase `ZCL_RPT_<nombre>` con métodos `select_data`, `process_data`, `display_alv`.
- Field catalog mínimo, variantes, layout, exportación.
- Ejemplos de código de los métodos clave.

**Trazabilidad**: IS11 (modificado por AD4 — pasa de embebido en M2/M3 a skill independiente).

---

## Estrategia de organización del código (greenfield)

```
Agente-IA-Desarrollo-ABAP/                  # workspace root
│
├── CLAUDE.md                               # U1
├── README.md                               # U1
│
├── .claude/                                # raíz Claude Code
│   ├── settings.json                       # U1
│   ├── agents/
│   │   ├── validador-fd.md                 # U2
│   │   ├── fd-a-td.md                      # U3
│   │   └── td-a-codigo.md                  # U4
│   ├── commands/
│   │   ├── validar-fd.md                   # U2
│   │   ├── generar-td.md                   # U3
│   │   ├── generar-abap.md                 # U4
│   │   └── pipeline-abap.md                # U5
│   └── skills/
│       └── template-alv/
│           └── SKILL.md                    # U6
│
├── docs/                                   # documentos de referencia
│   ├── formato-fd-generico.md              # U1
│   ├── checklist-auditoria-codigo-ia.md    # U1
│   └── plan-evaluacion.md                  # U1
│
├── outputs/                                # generado en runtime (no se versiona)
│   └── <fecha>-<requerimiento_id>/
│       ├── fd.md
│       ├── validacion.md
│       ├── td.md
│       ├── codigo.abap
│       └── decisiones.md
│
├── prd.md                                  # ya existe — insumo
├── aidlc-rules/                            # ya existe — reglas AI-DLC
└── aidlc-docs/                             # ya existe — documentación AI-DLC
```

**Notas**:
- `outputs/` debe agregarse a `.gitignore` para evitar versionar TDs/códigos de requerimientos reales que pueden contener información sensible.
- Los archivos de `.claude/` y `docs/` SÍ se versionan — son la "configuración del producto".

---

## Orden recomendado de implementación

`U1 → U2 → U3 → U4 → U6 → U5`

**Justificación del orden**:
1. **U1 primero**: provee CLAUDE.md y docs referenciados por los sub-agentes. Sin U1, los sub-agentes no compilan semánticamente.
2. **U2 → U3 → U4 secuencial**: refleja el flujo lógico del pipeline. Permite probar cada módulo standalone con un input controlado antes de pasar al siguiente.
3. **U6 antes de U5**: U6 es pequeña pero la queremos antes de probar el orquestador, para que los tests con FDs ALV ya tengan el skill activo.
4. **U5 al final**: depende de U2, U3, U4 existiendo para poder invocarlos.

**Paralelización posible**: en un escenario con múltiples desarrolladores, U2/U3/U4/U6 pueden hacerse en paralelo después de U1. En esta sesión iremos secuenciales.
