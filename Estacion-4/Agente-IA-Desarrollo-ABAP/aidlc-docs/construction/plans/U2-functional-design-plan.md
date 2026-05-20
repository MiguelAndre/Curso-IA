# Functional Design Plan — U2 (Módulo 1: Validador de FD)

**Fecha**: 2026-05-19
**Unidad**: U2
**Insumos**: `requirements.md` FR-M1-01..08, `application-design/component-methods.md` § C2, `unit-of-work.md` § U2, `docs/formato-fd-generico.md`

---

## Pasos del plan

- [ ] Paso 1 — Recoger respuestas a las 3 preguntas focalizadas (abajo)
- [ ] Paso 2 — Generar `aidlc-docs/construction/U2/functional-design/business-logic-model.md` (flujo de validación, criterios, output)
- [ ] Paso 3 — Generar `aidlc-docs/construction/U2/functional-design/business-rules.md` (reglas de aprobación/rechazo)
- [ ] Paso 4 — Generar `aidlc-docs/construction/U2/functional-design/domain-entities.md` (entidades: FD, Gap, ResultadoValidacion)
- [ ] Paso 5 — Presentar mensaje de completion y esperar aprobación

---

## Preguntas de diseño funcional

### Question 1 — Formato del output del validador
Sabemos que el output es binario y debe ser legible. ¿Qué formato concreto produce?

A) **Markdown estructurado** con secciones fijas: `## Estado` (APROBADO/RECHAZADO), `## Resumen`, `## Gaps detectados` (si rechazado, con lista numerada), `## Observaciones menores` (si aprobado). Persistible como `validacion.md`.
B) **JSON estructurado** (estado, gaps[], observaciones[]) + un resumen markdown adicional. Útil si en el futuro automatizamos con Anthropic API.
C) **Solo markdown libre**: el validador redacta una respuesta narrativa, sin estructura fija. El estado APROBADO/RECHAZADO aparece destacado pero el resto es prosa.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Granularidad de los gaps en el rechazo
¿Cómo de específicos deben ser los gaps reportados?

A) **Gap por sección + recomendación accionable**: "Sección 3 (Reglas de Negocio) — Falta especificar el comportamiento cuando la fecha no tiene rango. Recomendación: agregar regla 'RN-N: si la fecha desde es vacía, usar fecha actual menos 30 días'." (alto valor, mayor longitud)
B) **Gap por sección sin recomendación**: "Sección 3 (Reglas de Negocio) — Incompleta: falta detalle sobre fechas vacías." (más corto, deja la solución al consultor)
C) **Lista plana de gaps sin agruparlos por sección**: "Faltan reglas para fechas vacías; falta autorización Z explícita; ..." (más simple para parsear, menos contextual)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Manejo de FDs en formato no-markdown
Algunos FDs llegan como `.docx`, `.txt` o PDF. ¿Cómo los maneja el validador?

A) **Rechazar formato no soportado**: si el FD no es `.md` o texto plano interpretable como markdown, devuelve `RECHAZADO` con gap "Formato no soportado. Convertir a markdown siguiendo `docs/formato-fd-generico.md`."
B) **Aceptar texto plano simple** (`.txt`, `.md`); ignorar otros formatos. Si llega un `.docx`/PDF, instruye al desarrollador a convertirlo antes (no intenta procesar binarios).
C) **Tolerante**: acepta cualquier texto legible y aplica los criterios. La estructura markdown no es obligatoria, sólo facilita el parsing.
X) Other (please describe after [Answer]: tag below)

[Answer]: Debe poder leer cualquier formato y escribir un archivo markdow

---

## Notas sobre lo que NO se pregunta (ya está decidido en requirements/design)

- ✅ Output binario APROBADO/RECHAZADO — FR-M1-03.
- ✅ Sin bypass — FR-M1-07.
- ✅ Lenguaje no acusatorio — FR-M1-08.
- ✅ Validador no genera TD ni código — FR-M1-06.
- ✅ Análisis estructural (7 secciones de `formato-fd-generico.md`) — FR-M1-01.
- ✅ Análisis de calidad semántica (descripciones genéricas, criterios no verificables, casos borde sin definir) — FR-M1-02.
- ✅ Idioma español — NFR-01, FR-M4-07.
- ✅ Componente: sub-agente `validador-fd` + slash command `/validar-fd` — `components.md` § C2.
