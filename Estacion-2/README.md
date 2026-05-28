# Estación 2 — Co-crear el PRD con IA

> Pipeline de 3 prompts secuenciales (**PRD → Arquitectura → Backlog**) co-creados con un LLM humano-in-the-loop. Esta estación cubre el primero. Resultado: un PRD de 13 segmentos versionado, defendible y trazable, que alimenta todo el curso.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Cohorte | Hardcore AI 30X — Cohorte 2 |
| Duración | ≈ 1 semana entre Estación 1 y Estación 3 |
| Fechas | Commits clave `1ddb96c` (2026-05-13) y `b5769a3` (2026-05-14) |
| Prerequisitos | PVB o ISB refinado de Estación 1; documentos de research (overview, ICP, mercado, crítica) |
| Material | Slides + manual del estudiante (PDFs en Circle) |

---

## 2. Tema y objetivo

Reemplazar el proceso manual *"PRD nebuloso → desarrollo caótico"* con un **pipeline de tres prompts** donde:

1. **Prompt 1 — PRD**: convierte research en un PRD de 13 segmentos (lo que se hace en esta estación).
2. **Prompt 2 — Arquitectura**: PRD → especificación técnica (C4, NFRs, ADRs). Se ejecuta en Estaciones 4–5.
3. **Prompt 3 — Backlog**: arquitectura → epics + user stories en Gherkin. Estaciones 5–6.

Cada prompt requiere **aprobación humana segmento por segmento** antes de avanzar — esto elimina retrabajo masivo y deja un rastro de decisiones rastreable.

---

## 3. Conceptos clave

### 3.1 Los 13 segmentos del PRD

| # | Segmento | Qué contiene |
|---|---|---|
| 1 | **One-liner** | Frase de 2 oraciones + JTBD + misión (3 oraciones). |
| 2 | **Contexto / Problema** | Dolores con datos duros, causa raíz, ventana de oportunidad, alternativas existentes. |
| 3 | **ICP detallado** | Firmographics, 4+ buyer personas, pains, triggers, objeciones. |
| 4 | **UVP y diferenciadores** | Propuesta única, matriz 2×2 Mermaid, brecha de mercado. |
| 5 | **Casos de uso Top 5** | Actor, trigger, steps, resultado, KPI medible. |
| 6 | **Principios no negociables** | 4–6 restricciones de diseño, operacionales y prohibidas. |
| 7 | **User Journeys** | Happy paths (usuario final + operador) + 2 edge cases narrativos. |
| 8 | **MVP Scope (MoSCoW)** | Must · Should · Could · Won't. |
| 9 | **Módulos y features** | Arquitectura funcional, roles, flujos, diagrama Mermaid. |
| 10 | **Métricas de éxito** | North Star + KPIs (activación, retención, calidad) con baseline y meta. |
| 11 | **Plan de evaluación del agente** | Dataset, criterios QA, red-teaming. |
| 12 | **Riesgos y mitigaciones** | Tabla de 10 riesgos × (probabilidad, impacto, plan). |
| 13 | **Plan 30/60/90** | Entregas, validaciones, iteración por datos. |

### 3.2 Conceptos arquitectónicos introducidos (se profundizan en Estaciones 4–5)

- **C4 Model** — Niveles: L1 System Context · L2 Container · L3 Component · L4 Code.
- **NFRs** — Non-Functional Requirements: performance, seguridad, escalabilidad, mantenibilidad, observabilidad. Separados de features.
- **ADR** — Architecture Decision Record: formato *Contexto · Decisión · Consecuencias* por cada decisión técnica significativa.
- **Gherkin** — `Given <contexto> / When <acción> / Then <resultado>` como estructura de acceptance criteria.

### 3.3 Concepto operativo central

**Prompt-Driven Specification con paso 0 de conflictos**: antes del primer segmento, el agente identifica **conflictos en los inputs** (research que se contradice, supuestos sin evidencia, métricas ambiguas) y los resuelve con el humano. Sin este paso, todo el PRD construye sobre arena.

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `hcai-c2-e2-deck.pdf` | Slides de la estación con frameworks visuales de PRD, C4 y backlog. |
| `hcai-c2-e2-manual-estudiante.pdf` | Manual paso a paso con plantillas comentadas y ejemplos trabajados (~148 KB). |
| `Tarea/prompts-especificacion.md` | **El núcleo**: los 3 prompts con instrucciones de co-creación, paso 0 de conflictos y los 13 segmentos. |
| `Tarea/README.md` | Guía de uso: cómo poblar `docs/`, en qué orden ejecutar prompts, dónde queda cada output. |

---

## 5. Mi entrega (`Tarea/`)

### 5.1 Estructura

```
Tarea/
├── docs/                                  ← inputs
│   ├── hcai-c2-internal-solution-brief.md (23 KB — el ISB final de Estación 1)
│   └── investigacion-ia-desarrollo-abap.md (17 KB — deep research)
├── specs/
│   ├── prd.md (42 KB · 746 líneas — output principal)
│   └── README.md
├── prompts-especificacion.md
└── README.md
```

### 5.2 Flujo seguido

1. Refiné el ISB (Estación 1).
2. Creé `docs/` con ISB + investigación.
3. Copié el Prompt 1 de `prompts-especificacion.md`.
4. Pegué en Claude Pro y adjunté todos los archivos de `docs/`.
5. Co-creé segmento por segmento (Paso 0 → §1 → §2 → ... → §13), aprobando antes de avanzar.
6. Consolidé el PRD en `specs/prd.md`.

### 5.3 Paso 0 — Conflictos resueltos

Antes del primer segmento, el agente detectó **6 conflictos en los inputs**:

- *"74–77% de tasa de éxito"* — clarifiqué que ese número es **post-retroalimentación**, no primer intento. Decisión: el pipeline debe contemplar ciclos de feedback explícitos (M3 permite hasta 2 ciclos).
- Conflicto en alcance del Validador → quedó como **gate obligatorio** (Principio #2 del PRD).
- Otras 4 ambigüedades resueltas con misma mecánica.

Sin este paso 0, el PRD habría incorporado supuestos falsos y la arquitectura de Estación 4 habría fallado al validar.

### 5.4 Índice del PRD generado

```
§ Decisiones de partida (Paso 0): 6 conflictos resueltos
§ 1  One-Liner + JTBD + Misión
§ 2  Contexto/Problema (2.1 dolores con datos, 2.2 causa raíz, 2.3 ventana, 2.4 alternativas)
§ 3  ICP detallado (3.1 perfil org, 3.2 4 buyer personas, 3.3 triggers, 3.4 objeciones)
§ 4  UVP y diferenciadores (4.1 UVP, 4.2 tabla competitiva, 4.3 brecha, 4.4 cuadrante Mermaid)
§ 5  Casos de uso Top 5 (UC1 pipeline happy path · UC2 FD rechazado · UC3 iteración código ·
                          UC4 BAdI · UC5 legacy)
§ 6  Principios no negociables (6 principios)
§ 7  User Journeys (4 journeys + edge cases)
§ 8  MVP Scope MoSCoW
§ 9  Módulos y features (3 módulos + módulo 4 base)
§ 10 Métricas de éxito (North Star + KPIs)
§ 11 Plan de evaluación del agente (dataset + red-teaming)
§ 12 Riesgos y mitigaciones
§ 13 Plan 30/60/90 días
```

---

## 6. Aporte al proyecto central

**El PRD de Estación 2 es exactamente el `prd.md` del proyecto en raíz** (`Agente-IA-Desarrollo-ABAP/prd.md`). 746 líneas, fecha 2026-05-13, versión 1.0. No fue regenerado en estaciones posteriores: ese PRD es el contrato fundacional del producto.

A partir de él se derivaron:

- `CLAUDE.md` — operacionalización del PRD con los 6 principios expandidos, 3 módulos (Validador, FD→TD, TD→Código), prohibiciones explícitas y buenas prácticas ABAP.
- `AGENTS.md` — contrato neutral multi-tool (creado en Estación 6).
- `docs/formato-fd-generico.md`, `docs/checklist-auditoria-codigo-ia.md`, `docs/plan-evaluacion.md` — contratos derivados.
- Todo `aidlc-docs/inception/` y `aidlc-docs/construction/` — desarrollos AI-DLC sobre el mismo PRD.

**El PRD es estratégico (qué, por qué, para quién). `CLAUDE.md` es operacional (cómo el agente lo implementa).**

---

## 7. Lecciones / takeaways

1. **El paso 0 de conflictos evita retrabajo masivo.** Resolver ambigüedades antes del §1 ahorra reescribir 13 segmentos cuando, varias semanas después, descubrís que un supuesto era falso. En mi caso, clarificar "74–77% post-retroalimentación" determinó la decisión arquitectónica de ciclos limitados en M3.

2. **Prompts secuenciales con aprobación humana comprimen iteraciones, no las expanden.** La entrega "de una vez" es tentadora pero genera el doble de trabajo. Segmento → aprobación → siguiente es más lento por segmento pero el total termina antes y con un rastro auditable.

3. **La validación del insumo (FD) es el 24% faltante del ciclo.** El PRD articula explícitamente en el Principio #2 que un FD ambiguo no avanza. No es burocracia: previene los 3 días de rework post-entrega que el ISB cuantificó en Estación 1.

---

## Referencias rápidas

- Los 3 prompts: [`Tarea/prompts-especificacion.md`](Tarea/prompts-especificacion.md)
- PRD generado: [`Tarea/specs/prd.md`](Tarea/specs/prd.md)
- PRD vivo en el proyecto: [`../Agente-IA-Desarrollo-ABAP/prd.md`](../Agente-IA-Desarrollo-ABAP/prd.md)
- Operacionalización: [`../Agente-IA-Desarrollo-ABAP/CLAUDE.md`](../Agente-IA-Desarrollo-ABAP/CLAUDE.md)
