# NFR Requirements Plan — U4 (Módulo 3: TD → Código ABAP)

**Fecha**: 2026-05-20
**Unidad**: U4
**Insumos**: `requirements.md` NFR-02, NFR-03, NFR-08 + SECURITY-03/09/10 · `construction/U4/functional-design/*`

---

## Pasos del plan

- [x] Paso 1 — Recoger respuestas a las 4 preguntas focalizadas (defaults Q1:B, Q2:A, Q3:C, Q4:B aplicados)
- [x] Paso 2 — Generar `aidlc-docs/construction/U4/nfr-requirements/nfr-requirements.md`
- [x] Paso 3 — Generar `aidlc-docs/construction/U4/nfr-requirements/tech-stack-decisions.md`
- [ ] Paso 4 — Presentar mensaje de completion

---

## Notas sobre lo ya decidido (no se pregunta)

- ✅ NFR-02: pipeline diseñado para ≤2h activas del desarrollador.
- ✅ NFR-03: tasa de compilabilidad ≥80% tras ≤2 ciclos en dataset de evaluación.
- ✅ NFR-08: sin PII/secretos en outputs.
- ✅ SECURITY-03 aplica como blocking (Q9:A del cuestionario inicial).
- ✅ SECURITY-09 aplica como blocking.
- ✅ SECURITY-10 aplica como blocking.
- ✅ Tech stack del agente: Claude Code (definido en Q1:A inicial).
- ✅ Tech stack del código generado: ABAP OO sobre SAP S/4HANA Cloud.

---

## Preguntas focalizadas

### Question 1 — Clasificación de "datos sensibles" para AUTHORITY-CHECK
El PRD menciona "nómina, finanzas, RRHH, datos personales" como dominios sensibles que requieren AUTHORITY-CHECK obligatorio. ¿Ampliamos la lista?

A) **Lista del PRD literal**: solo nómina, finanzas, RRHH, datos personales. Para otros dominios (materiales, proveedores, ventas, compras) el AUTHORITY-CHECK queda a criterio del FD si lo solicita explícitamente.
B) **Lista ampliada (recomendado para entorno corporativo)**: nómina, finanzas, RRHH, datos personales + tablas con campos clave de cliente (KNA1, KNB1), proveedor (LFA1, LFB1), márgenes/costos (KONP, KOMP, EKKO con valoración), datos contables (BSEG, BKPF). Para otros dominios, AUTHORITY-CHECK si el FD lo solicita.
C) **Política conservadora**: AUTHORITY-CHECK en TODA tabla de negocio (no técnicas como T100, TVARV) con marca `⚠️ VERIFICAR:` para que el desarrollador valide el objeto exacto.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

### Question 2 — Métricas de calidad del código generado
¿Qué umbrales aplicamos para considerar "código de calidad"?

A) **Umbrales del PRD + buenas prácticas**: ≥80% compilable tras ≤2 ciclos (NFR-03); métodos < 50 líneas; sin SELECT *; AUTHORITY-CHECK en datos sensibles. Sin métricas adicionales formales.
B) **Umbrales del PRD + métricas adicionales declaradas**: agregar (a) complejidad ciclomática < 10 por método, (b) profundidad de anidamiento ≤ 4 niveles, (c) longitud máxima de método: 80 líneas. Pero sin enforcement automático (el LLM las usa como guía).
C) **Solo NFR-03 binario**: el código compila o no compila. Las demás "métricas" son recomendaciones soft sin medición.
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

### Question 3 — Tiempo de generación esperado por requerimiento (SLA del agente, no del pipeline humano)
NFR-02 habla del **tiempo total del desarrollador** (≤2h activas). ¿Y el tiempo de cómputo del agente para generar el código?

A) **Sin SLA formal**: el LLM toma el tiempo que necesite. Si tarda 10 min en un caso complejo, está bien.
B) **SLA blando ≤2 min** por primer intento de generación de un `.abap` típico. Si se excede, el sub-agente debe documentarlo en cabecera "Decisiones del código" y posiblemente sugerir simplificar el alcance.
C) **SLA blando ≤5 min** por primer intento. Más holgado, deja margen para casos complejos sin penalizar al usuario.
X) Other (please describe after [Answer]: tag below)

[Answer]: C  *(default aplicado)*

### Question 4 — Mantenibilidad — convenciones que el agente debe respetar
Las convenciones de naming están en CLAUDE.md §5.5 (genéricas). ¿Algún requisito de mantenibilidad adicional para U4?

A) **Solo lo que está en CLAUDE.md** — naming Z*/Y*, prefijos lv_/lt_/etc., métodos < 50 líneas, comentarios en español. Lo demás es estilo libre del LLM.
B) **Agregar regla de modularización**: cada método público de la clase principal debe ser invocable independientemente (no asume estado interno de métodos previos salvo en cadena documentada). Cumple Principio de Responsabilidad Única.
C) **Agregar regla de modularización + documentación inline**: todo método público lleva al inicio un comentario `" Propósito: ...` y `" Pre-condiciones: ...` y `" Post-condiciones: ...`. Más sobrecarga pero mucho más mantenible.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

---

## Categorías de NFR que se documentan automáticamente (sin pregunta)

| Categoría | Decisión |
|---|---|
| Scalability | N/A — no hay carga concurrente; cada invocación es una sesión Claude Code. |
| Performance | NFR-02 (≤2h humanas) heredado; el SLA del agente lo define Q3. |
| Availability | N/A — sin infraestructura desplegada. |
| Security | SECURITY-03/09/10 enforced (Q9:A inicial). Refinado en Q1 de este plan. |
| Reliability | NFR-03 (≥80% compilable tras ≤2 ciclos) heredado. BR-12 escala a manual tras 2 ciclos sin éxito. |
| Maintainability | Q4 de este plan. |
| Usability | Lenguaje no acusatorio, español, salidas estructuradas — heredado de U2/U3 y CLAUDE.md. |
