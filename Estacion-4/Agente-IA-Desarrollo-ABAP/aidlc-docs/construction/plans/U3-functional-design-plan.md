# Functional Design Plan — U3 (Módulo 2: FD → TD)

**Fecha**: 2026-05-19
**Unidad**: U3
**Insumos**: `requirements.md` FR-M2-01..10, `application-design/components.md` § C3, `unit-of-work.md` § U3

---

## Pasos del plan

- [x] Paso 1 — Recoger respuestas a las 4 preguntas focalizadas (defaults Q1:B, Q2:A, Q3:A, Q4:B aplicados)
- [x] Paso 2 — Generar `aidlc-docs/construction/U3/functional-design/business-logic-model.md` (flujo, identificación de objetos, estructura del TD)
- [x] Paso 3 — Generar `aidlc-docs/construction/U3/functional-design/business-rules.md` (reglas de M2)
- [x] Paso 4 — Generar `aidlc-docs/construction/U3/functional-design/domain-entities.md` (entidades: FD aprobado, TD, ObjetoSAP, Decision, Supuesto)
- [ ] Paso 5 — Presentar mensaje de completion

---

## Preguntas de diseño funcional

### Question 1 — Verificación de aprobación del FD
FR-M2-01 dice que M2 debe rechazar la ejecución si el FD no viene aprobado por M1. ¿Cómo lo verifica?

A) **M2 invoca a M1 internamente**: si M2 recibe un FD sin validación previa, llama al sub-agente `validador-fd` primero. Si M1 rechaza, M2 propaga el rechazo. (Más robusto pero acopla M2 a M1.)
B) **M2 confía en el orquestador**: M2 asume que cuando es invocado por `/pipeline-abap`, el FD ya pasó por M1. Cuando es invocado directamente vía `/generar-td`, M2 emite un **aviso prominente** "⚠️ Modo directo — no se validó cadena de aprobación. El desarrollador asume garantía del input." y procede. (Más simple, alineado con services.md §3.)
C) **M2 busca cabecera de aprobación en el FD**: el orquestador, tras aprobación de M1, agrega una cabecera del estilo `<!-- VALIDADO: APROBADO 2026-05-19 -->` al FD. M2 verifica la cabecera. Sin cabecera → rechaza.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

### Question 2 — Estructura del TD generado (orden de secciones)
¿Qué orden y secciones obligatorias tendrá el TD producido por M2?

A) **Orden técnico estándar** (recomendado):
   1. Tipo de objeto ABAP
   2. Resumen funcional (1 párrafo, eco del Objetivo del FD)
   3. Objetos SAP involucrados (tablas, FMs, BAdIs, clases)
   4. Arquitectura técnica (clases, métodos, flujo)
   5. Campos y estructuras (selección, intermedias, output)
   6. Reglas de negocio mapeadas a implementación (cada RN del FD → cómo se implementa)
   7. Criterios de aceptación técnicos (cómo se verifica cada CA)
   8. Decisiones y Supuestos (obligatorio — Principio #5)
   9. TBD (si aplica)
B) **Orden por preguntas TD clásico** (qué/por qué/cómo): qué se construye, por qué (Objetivo del FD), cómo (todo lo demás). Más narrativo, menos estructurado.
C) **Orden minimalista**: sólo (a) tipo de objeto, (b) objetos SAP, (c) arquitectura, (d) Decisiones y Supuestos. El resto va embebido en (c).
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

### Question 3 — Modo reverse engineering (UC5 — código legado como input)
El PRD UC5 menciona que M2 puede recibir código ABAP existente como input para generar un TD descriptivo. ¿Cómo se activa?

A) **Detección automática**: si M2 recibe un input que parece código ABAP (`.abap`, `REPORT`, `CLASS ZCL_*`, etc.), entra en modo reverse engineering automáticamente y produce un TD descriptivo. No requiere flag.
B) **Flag explícito en el comando**: `/generar-td <ruta> --reverse` o `/generar-td-legado <ruta>` activa el modo. Sin flag, M2 espera un FD; si recibe código, redirige.
C) **No soportado en MVP de Estación 4**: UC5 queda fuera del scope de U3. Si llega código ABAP, M2 redirige al desarrollador a documentar manualmente.
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

### Question 4 — Activación del skill `template-alv`
La decisión AD4 dice que el skill ALV se activa por contexto. En la práctica, ¿el sub-agente lo activa explícitamente o confía en la activación automática?

A) **Activación automática**: confiar en que Claude Code detecta "ALV" en el contexto y activa el skill `template-alv` solo. El sub-agente no hace nada especial. (Loose coupling, alineado con AD4.)
B) **Activación explícita con fallback**: si el sub-agente detecta keywords ALV ("reporte ALV", "SALV", "CL_GUI_ALV_GRID"), instruye en su prompt: "Lee `.claude/skills/template-alv/SKILL.md`". Garantiza que el contexto del template se aplique aunque la activación automática falle.
C) **Sin acoplamiento**: ignorar el skill por ahora. M2 hace su propia versión del template ALV embebido en su prompt (duplicación con U6). El skill queda como contexto adicional opcional.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

---

## Notas sobre lo ya decidido (no se pregunta)

- ✅ M2 produce un TD en markdown, persistido en `outputs/<fecha>-<req-id>/td.md` + impresión inline (Q2:C).
- ✅ M2 NO genera código (FR-M2-08).
- ✅ M2 permite regeneración con feedback (FR-M2-10) → versionado `td-v2.md`, `td-v3.md`.
- ✅ Sección "Decisiones y Supuestos" obligatoria (FR-M2-06, Principio #5).
- ✅ Marcador `TBD:` para información no resuelta (FR-M2-07).
- ✅ Idioma español (NFR-01).
