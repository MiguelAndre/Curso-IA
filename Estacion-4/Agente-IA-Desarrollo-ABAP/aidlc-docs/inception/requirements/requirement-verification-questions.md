# Preguntas de Aclaración — Requirements Analysis

**Insumo principal**: `prd.md` (PRD v1.0 aprobado, co-creado segmento por segmento)

El PRD es muy completo en cuanto al "qué" y el "por qué" del producto. Sin embargo, hay decisiones operativas y de alcance que necesito aclarar antes de redactar el documento de requerimientos de la Estación 4 y antes de proponer el Workflow Planning.

Por favor responde cada pregunta colocando la letra elegida después del tag `[Answer]:`. Si ninguna opción aplica, elige **Other** y describe tu preferencia.

Cuando termines, responde `done` en el chat.

---

## Question 1 — Alcance del entregable de Estación 4
¿Qué entregable concreto debemos construir en esta Estación 4?

A) Configuración completa del agente en Claude Code (CLAUDE.md + sub-agentes + skills + slash commands + settings.json) — sin automatización por API. Los desarrolladores operan el pipeline en sesiones interactivas de Claude Code.
B) Solo los **prompts/instrucciones** del pipeline (M1 Validador, M2 FD→TD, M3 TD→Código) como archivos de plantilla, sin sub-agentes ni skills — empaquetado mínimo para que el equipo los pegue manualmente.
C) Configuración completa de Claude Code + un script de automatización por **Anthropic API** que pueda ejecutar el pipeline end-to-end sobre un FD dado (extensión C2 del PRD).
D) Configuración completa de Claude Code + harness de evaluación (dataset de 3–5 FDs históricos, scripts de comparación TD/código generado vs. producción) — alineado con el Segmento 11 del PRD.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2 — Reutilización de artefactos de Estación 3
La Estación 3 ya generó configuración del agente y un ejemplo end-to-end (ver commits `b071d3c`, `ad42fd0`). ¿Qué hacemos con esos artefactos?

A) **Reutilizar y refinar**: copiar la configuración de Estación 3 a Estación 4 como punto de partida y mejorarla siguiendo AI-DLC.
B) **Reescribir desde cero**: ignorar Estación 3 y construir todo nuevamente con el rigor del workflow AI-DLC.
C) **Referenciar pero no copiar**: leer los artefactos de Estación 3 como contexto pero producir todo nuevo en Estación 4.
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3 — Estructura de implementación en Claude Code
¿Cómo prefieres estructurar el pipeline FD→TD→Código dentro de Claude Code?

A) **Tres sub-agentes** (`.claude/agents/`): uno por módulo (validador-fd, fd-a-td, td-a-codigo), invocables con la tool `Agent` o referenciables por nombre.
B) **Tres slash commands** (`.claude/commands/`): un comando por módulo (`/validar-fd`, `/generar-td`, `/generar-abap`), invocables desde el chat.
C) **Tres skills** (`.claude/skills/`): cada módulo como un skill con `SKILL.md` activable bajo demanda.
D) **Mixto**: sub-agentes para los módulos M2/M3 (trabajo profundo, contexto largo) + slash commands como atajos para el usuario.
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 4 — Estándares ABAP de la empresa (insumo del Módulo 4)
El PRD menciona "estándares ABAP de la empresa" como parte de la Configuración Base. ¿Tenemos ese contenido disponible para incorporar?

A) Sí, tengo los estándares documentados — los aporto en una iteración posterior y el agente los incorpora.
B) Sí, pero parciales — incorporamos lo que existe y dejamos placeholders `<<TBD>>` donde falte.
C) No — el agente arranca con buenas prácticas SAP genéricas (SQL optimizado, AUTHORITY-CHECK, ABAP OO con clases ZCL, ALV estándar, naming Z*/Y*) y los estándares específicos de la empresa se cargan después.
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 5 — Formato institucional del FD
El Módulo 1 (Validador) requiere el formato estándar del FD como referencia. ¿Cómo procedemos?

A) Tengo una plantilla concreta del FD de la empresa — la aporto y el Validador la usa directamente.
B) Tengo una descripción del formato pero no un ejemplo — la convertimos en checklist de validación.
C) Definimos un formato genérico de FD ABAP (objetivo, alcance, reglas de negocio, tablas SAP involucradas, criterios de aceptación, casos borde, autorizaciones) y el equipo lo adopta.
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 6 — Idioma de los prompts del agente
¿En qué idioma deben estar redactados los prompts/instrucciones del agente?

A) Español — el equipo opera en español y los FDs llegan en español.
B) Inglés — mejor desempeño documentado de LLMs con instrucciones técnicas en inglés.
C) Bilingüe — instrucciones de sistema en inglés, outputs y mensajes al usuario en español.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7 — Templates por tipo de objeto (S1 del MoSCoW)
El PRD marca S1 (templates por tipo de objeto: reporte ALV, BAdI, formulario, conversión) como "Should Have". ¿Lo incluimos en este alcance o lo dejamos para después?

A) Incluir los 4 templates (ALV, BAdI, formulario, conversión) como parte del MVP de Estación 4.
B) Incluir solo el de **reporte ALV** (caso de referencia del PRD — UC1) y los demás quedan para iteraciones posteriores.
C) No incluir templates — el agente opera con un prompt genérico para todos los tipos en el MVP.
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8 — Checklist de auditoría de código IA (S2 del MoSCoW)
¿Incluimos el checklist de auditoría (S2) como entregable de esta estación?

A) Sí, como archivo independiente (p. ej. `docs/checklist-auditoria-codigo-ia.md`) referenciado desde el Módulo 3.
B) Sí, embebido directamente en el output del Módulo 3 (cada código generado viene con su checklist al pie).
C) No, S2 queda fuera del alcance — se construye en una iteración posterior.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9 — Extensión Security Baseline (opt-in obligatorio AI-DLC)
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10 — Extensión Property-Based Testing (opt-in obligatorio AI-DLC)
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)
B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 11 — Validación previa (evaluación pre-piloto del Segmento 11)
El PRD pide evaluar el pipeline con 3–5 FDs históricos antes del piloto. ¿Incluimos esa evaluación como parte de Estación 4?

A) Sí, completa — incluir dataset de evaluación, scripts de comparación y reporte de hallazgos como parte de Construction/Build & Test.
B) Sí, parcial — incluir solo el **diseño** del plan de evaluación (qué medir, cómo comparar) sin ejecutarlo en esta estación.
C) No — la evaluación queda fuera del alcance de Estación 4 y se ejecuta como Día 1–30 del Plan de Entrega del PRD.
X) Other (please describe after [Answer]: tag below)

[Answer]: B
