# Estación 4 — Diseñando el QUÉ con AI-DLC (Inception)

> Generar especificaciones ejecutables ANTES de escribir código. Aplicar el framework **AI-DLC** (Artificial Intelligence Development Lifecycle, AWS Labs v0.1.8) — combinación de DDD + BDD + TDD pensada para co-creación con agentes.

> 📦 El proyecto real construido durante esta estación (Agente IA para Desarrollo ABAP) vive en la **raíz del repo**: [`../Agente-IA-Desarrollo-ABAP/`](../Agente-IA-Desarrollo-ABAP/). Esta carpeta `Estacion-4/` conserva el material didáctico.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Christian Braatz |
| Fase AI-DLC | Inception (Diseñar el QUÉ) |
| Duración | ≈ 2 h teóricas + ejecución sobre tu producto |
| Prerequisitos | PRD de Estación 2 aprobado |
| Framework | `aidlc-rules/aws-aidlc-rules/core-workflow.md` v0.1.8 |

---

## 2. Tema y objetivo de aprendizaje

Pasar de PRD (documento de producto) a un **paquete de especificación ejecutable** que un agente pueda usar para implementar sin tomar decisiones de dominio. El framework AI-DLC produce 6 artefactos secuenciales que son la entrada obligatoria de la Estación 5 (Construction).

**Comparación de frameworks de especificación cubierta en clase**:

| Framework | Fortaleza | Cuándo elegirlo |
|---|---|---|
| **Open Spec** | Fluido, iterativo, brownfield-first | Refactors o sistemas legacy. |
| **Spec Kit** | Specs sirven al código y viceversa | Equipos junior, claridad sobre todo. |
| **AI-DLC** ← se usa en el curso | Nativo IA, trazabilidad integral, DDD integrado | Productos nuevos con agentes co-creadores. |

---

## 3. Conceptos clave

### 3.1 Las 6 actividades de Inception

| # | Actividad | Artefacto generado | Alimenta a |
|---|---|---|---|
| 00 | **Workspace Detection** | `workspace-detection.md` | Todas las siguientes |
| 01 | **Requirements Analysis** | `requirements-analysis.md` (insumos IS-*, FR-*, NFR-*) | User Stories, Application Design |
| 02 | **User Stories** | `user-stories.md` con escenarios Gherkin | Workflow Planning, Units Generation |
| 03 | **Workflow Planning** | `workflow-planning.md` (qué fases EXECUTE/SKIP) | Application Design |
| 04 | **Application Design** | `application-design.md` + `c4-model.md` + `components.md` + `services.md` + `unit-of-work*.md` | Units Generation |
| 05 | **Units Generation** | `units-generation.md` (descomposición U1..UN) | **Estación 5 (Construction)** |

### 3.2 Conceptos del dominio AI-DLC

- **Workspace Detection** — primer paso obligatorio. Decide greenfield vs brownfield, reverse engineering necesario, idioma, extensiones activas (Security Baseline, Property-Based Testing).
- **IS (Insumos)** — items específicos del PRD que se trackean uno a uno. Cada artefacto posterior los referencia.
- **Unit of Work** — agrupación lógica de archivos/componentes que se construye, revisa y aprueba como bloque. En productos pequeños puede ser un microservicio; en este proyecto fueron 6 unidades (U1..U6).
- **Extension Configuration** — flags opcionales: Security Baseline (reglas SECURITY-N), Property-Based Testing, etc.
- **Stage Progress** — tabla viva en `aidlc-state.md` con el estado de cada etapa (✅ Completada · 🟢 Pendiente · 🟡 En progreso · ⏭️ Omitida).
- **Change Request (CR)** — cambio sobre algo ya cerrado. Requiere re-ejecución parcial del workflow. Caso real en mi proyecto: CR-001 (Validador multi-formato).

### 3.3 Conceptos heredados de Estación 2 (que aquí se materializan)

- **C4 Model** — niveles L1 (System Context), L2 (Container), L3 (Component). Generado por la actividad 04.
- **NFR matrix** — matriz de requerimientos no funcionales con valor numérico verificable.
- **ADR** — Architecture Decision Record con formato *Contexto · Decisión · Consecuencias*.

---

## 4. Material del curso

### 4.1 Documentos guía

| Archivo | Contenido |
|---|---|
| `estacion4-runbook.md` | Guía paso a paso de las 6 actividades, qué validar en cada una, qué prompt usar. |
| `estacion4-diseñando-el-que.pdf` | Slides de la sesión presencial. |
| `docs/prompts-ajit-arquitectura.md` | Prompts arquitectónicos (C4, NFRs, ADR) que se usan en la actividad 04. |
| `docs/adr-template.md` | Template estándar de ADR. |

### 4.2 Framework AI-DLC v0.1.8 (`aidlc-rules/`)

```
aidlc-rules/
├── aws-aidlc-rules/
│   └── core-workflow.md          ← el "cerebro" del framework; se copia como CLAUDE.md al workspace
└── aws-aidlc-rule-details/
    ├── common/                   ← ascii diagrams, validation, depth levels, error handling, sessions
    ├── inception/                ← workspace-detection, requirements, user-stories, workflow-planning,
    │                               application-design, units-generation, reverse-engineering
    ├── construction/             ← functional-design, nfr-requirements, nfr-design, infrastructure-design,
    │                               code-generation, build-and-test
    ├── extensions/
    │   ├── security/baseline/    ← reglas SECURITY-N
    │   └── testing/property-based/  ← extensión PBT
    └── operations/               ← operations.md
```

**No se modifica**. Es el contrato del framework. Para ejecutarlo sobre tu producto, se copia `core-workflow.md` como `CLAUDE.md` al workspace destino.

### 4.3 Proyecto de ejemplo: EntreVista AI

`agentic_interviewer_ai/` contiene un proyecto real con la fase Inception completa. **No es mi proyecto** — es el caso del instructor (plataforma de screenings conversacionales vía Telegram, 7 microservicios sobre Lambda + Claude Agent SDK + MongoDB Atlas + Pinecone + S3). Sirve como referencia de "cómo se ven artefactos bien generados".

Su arquitectura resultante:

```
telegram-bot → conversation-lambda (Claude Agent SDK)
                    ├── evaluation-lambda
                    ├── campaign-lambda (RAG + Pinecone)
                    └── compliance-lambda

dashboard (React) → auth-lambda + todos los lambdas anteriores

Almacenamiento: MongoDB Atlas · AWS S3 · Pinecone · AWS Secrets Manager
```

---

## 5. Cómo se ejecuta (resumen del runbook)

### 5.1 Setup

```bash
mkdir nombre_de_tu_producto
cd nombre_de_tu_producto

cp ../PRD_tu_producto.md PRD_tu_producto.md
cp ../aidlc-rules/aws-aidlc-rules/core-workflow.md ./CLAUDE.md
mkdir -p .aidlc-rule-details
cp -R ../aidlc-rules/aws-aidlc-rule-details/* .aidlc-rule-details/

cursor .   # o claude code
```

### 5.2 Prompt de inicio

```
Usando AI-DLC, construiremos un producto que consiste en [descripción].
Con base en el Product Requirements Document (PRD) @PRD_tu_producto.md.
```

El framework toma el control del ritmo: pregunta, valida, espera aprobación antes de avanzar. Tu rol es responder con criterio, no escribir.

### 5.3 Prompt de re-entrada (siguientes sesiones)

```
Confírmame en qué fase de AI-DLC nos encontramos, para avanzar.
```

---

## 6. Mi entrega — aplicación al proyecto ABAP

Mi entrega de Estación 4 **no vive en `Estacion-4/Tarea/`**. Vive en el proyecto en raíz, en `../Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/`, porque AI-DLC es parte integral del producto, no del material didáctico.

### 6.1 Artefactos generados

```
Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/
├── requirements/
│   ├── requirements.md                       ← IS-1..IS-15, FR-M1..M4, FR-DOC, NFR-01..08
│   └── requirement-verification-questions.md
├── application-design/
│   ├── application-design.md                 ← documento maestro
│   ├── c4-model.md                           ← L1 + L2 en Mermaid
│   ├── components.md                         ← C1..C11
│   ├── component-dependency.md
│   ├── component-methods.md
│   ├── services.md
│   ├── unit-of-work.md                       ← decomposición U1..U6
│   ├── unit-of-work-dependency.md
│   └── unit-of-work-story-map.md
└── plans/
    ├── application-design-plan.md
    ├── execution-plan.md
    └── unit-of-work-plan.md
```

> **User Stories** fue **omitida** (decisión documentada en `aidlc-state.md`): el PRD §3.2 (personas) + §7 (4 user journeys) ya cubrían el mismo objetivo.

### 6.2 Decisiones clave de la Inception

- **Greenfield** confirmado (no había código previo).
- **Idioma del proyecto**: español.
- **Extensiones activas**: Security Baseline (SI), Property-Based Testing (NO — no hay lógica algorítmica).
- **Q1:A** — U1 monolítica (configuración base como una sola unidad).
- **Q2:A** — U6 como unidad propia para el skill `template-alv`.
- **AD3** — `.claude/settings.json` permissive: restricciones operativas en CLAUDE.md, no en permisos técnicos.
- **AD4** — el patrón ALV se promueve de "embebido en M2/M3" a skill independiente (U6).

### 6.3 Construction también se ejecutó en Estación 4

Tras cerrar Inception, mantuve el workflow abierto y ejecuté **Construction completa** sobre las 6 unidades dentro del mismo proyecto. Esos artefactos viven en `aidlc-docs/construction/` y se documentan formalmente en [Estación 5](../Estacion-5/).

### 6.4 Cambio de scope abierto: CR-001

Tras cerrar el workflow, abrí un **Change Request** sobre U2 (Validador): pasar de "solo `.md`/`.txt`" a "leer `.md`/`.txt`/`.pdf`/`.docx` y normalizar a markdown". El código del CR está implementado; el re-test pendiente se convirtió en la planning wave de Estación 7.

---

## 7. Lecciones / takeaways

1. **AI-DLC fuerza decisiones explícitas que de otro modo quedan implícitas.** Cada question del framework (Q1, Q2, AD-N) obliga a tomar postura *antes* de implementar. Eso elimina ambigüedades que normalmente se descubren a mitad de codificación.

2. **El audit trail vale tanto como el resultado.** `aidlc-state.md` + `audit.md` documentan no solo "qué se decidió" sino "por qué y cuándo". Cuando viene el CR-001 dos semanas después, esos archivos permiten reabrir el contexto sin reinterpretar nada.

3. **Inception no es burocracia; es seguro contra retrabajo.** El upfront cost de 6 actividades parece alto, pero las decisiones quedan trazadas. Cualquier change request posterior cuesta horas, no días, porque sabés exactamente qué requirements/components/units toca.

---

## Referencias rápidas

- Runbook: [`estacion4-runbook.md`](estacion4-runbook.md)
- Framework: [`aidlc-rules/aws-aidlc-rules/core-workflow.md`](aidlc-rules/aws-aidlc-rules/core-workflow.md)
- Prompts arquitectónicos: [`docs/prompts-ajit-arquitectura.md`](docs/prompts-ajit-arquitectura.md)
- Proyecto ejemplo (instructor): [`agentic_interviewer_ai/`](agentic_interviewer_ai/)
- Mi entrega: [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/inception/)
- Estado del workflow: [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md)
- Repo oficial AI-DLC: https://github.com/awslabs/aidlc-workflows
