# Unit of Work Plan — Agente IA para Desarrollo ABAP

**Fecha**: 2026-05-19
**Insumos**: `requirements.md` + `application-design/` (5 artefactos) + `execution-plan.md`

---

## Pasos del plan

- [x] Paso 1 — Recoger respuestas a las 2 preguntas focalizadas (Q1:A, Q2:A)
- [x] Paso 2 — Generar `aidlc-docs/inception/application-design/unit-of-work.md` con las definiciones finales de U1..U6
- [x] Paso 3 — Generar `aidlc-docs/inception/application-design/unit-of-work-dependency.md` con la matriz de dependencias entre unidades
- [x] Paso 4 — Generar `aidlc-docs/inception/application-design/unit-of-work-story-map.md` mapeando los IDs de `requirements.md` (IS, FR, NFR) a cada unidad (no hay user stories formales — usamos los requirements como reemplazo)
- [x] Paso 5 — Documentar estrategia de organización de código (estructura de directorios) en `unit-of-work.md`
- [ ] Paso 6 — Presentar mensaje de completion y esperar aprobación

---

## Preguntas de planificación

Las 5 unidades U1..U5 ya fueron propuestas y aprobadas en `execution-plan.md`. Estas preguntas afinan dos decisiones de borde.

### Question 1 — Granularidad de U1 (Configuración Base + Documentación)
U1 agrupa: CLAUDE.md, settings.json, README, plantilla genérica FD, buenas prácticas SAP, checklist auditoría, plan de evaluación. ¿Mantenemos esta granularidad o la dividimos?

A) **Mantener U1 monolítica como está propuesta** (recomendado): un único push de "fundamentos" antes de los módulos. Aprobación atómica por el usuario.
B) **Dividir U1 en U1a (Configuración Base: CLAUDE.md + settings.json + README) y U1b (Documentos auxiliares: formato-fd-generico, checklist, plan-evaluacion)**: dos unidades para aprobar por separado.
C) **Dividir U1 en U1a (CLAUDE.md + settings.json), U1b (README + formato-fd-generico) y U1c (checklist + plan-evaluacion)**: tres unidades muy granulares.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Posición del Skill Template ALV (C6)
El Skill ALV (C6) puede vivir en su propia unidad o ir junto con otra. ¿Dónde lo ubicamos?

A) **Unidad propia (U-Skill o U4-bis)**: independiente porque es un componente con vida propia (extensible a futuros skills de BAdI/formulario). Habilita aprobarlo separado de los sub-agentes.
B) **Como parte de U1 (Configuración Base)**: porque el skill es contexto compartido, similar a CLAUDE.md.
C) **Como parte de U3 (FD→TD)** o **U4 (TD→Código)**: porque sólo es consumido por esos sub-agentes, y agruparlo evita una unidad extra muy pequeña.
X) Other (please describe after [Answer]: tag below)

[Answer]: A
