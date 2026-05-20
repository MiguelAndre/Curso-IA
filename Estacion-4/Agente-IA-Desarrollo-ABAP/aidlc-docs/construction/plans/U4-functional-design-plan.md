# Functional Design Plan — U4 (Módulo 3: TD → Código ABAP)

**Fecha**: 2026-05-19
**Unidad**: U4
**Insumos**: `requirements.md` FR-M3-01..12 + NFR-02, NFR-03 + SECURITY-03/09/10 · `application-design/components.md` § C4 · `unit-of-work.md` § U4

---

## Pasos del plan

- [x] Paso 1 — Recoger respuestas a las 5 preguntas focalizadas (defaults Q1:A, Q2:C, Q3:A, Q4:B, Q5:A aplicados)
- [x] Paso 2 — Generar `aidlc-docs/construction/U4/functional-design/business-logic-model.md` (flujo, generación ABAP OO, marcadores de riesgo)
- [x] Paso 3 — Generar `aidlc-docs/construction/U4/functional-design/business-rules.md`
- [x] Paso 4 — Generar `aidlc-docs/construction/U4/functional-design/domain-entities.md` (TD, ArchivoABAP, ZonaVerificar, AuthorityCheck, DecisionCodigo)
- [ ] Paso 5 — Presentar mensaje de completion

---

## Preguntas de diseño funcional

### Question 1 — Verificación de la entrada (TD trae §8 Decisiones y Supuestos)
FR-M3-01 exige que M3 verifique que el TD trae "Decisiones y Supuestos". ¿Qué hace si no la trae?

A) **Rechazar y regresar a M2**: si el TD no trae §8, M3 emite un mensaje claro y NO genera código. Pide ejecutar `/generar-td` para regenerar el TD con la sección obligatoria.
B) **Generar §8 vacía e intentar igual**: M3 sigue adelante pero registra como Decisión del código que el TD entrante estaba incompleto. (Más permisivo, menos seguro.)
C) **Modo directo análogo a U3**: si el TD se invoca directo sin aprobación previa, emite un AVISO al usuario pero genera. Si vía orquestador → rechaza (porque ya pasó el gate humano post-M2).
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

### Question 2 — Estructura del archivo `.abap` generado
¿Qué estructura mínima tiene cada `.abap` que M3 produce?

A) **Una sola clase `ZCL_*` en un solo archivo** con cabecera "Decisiones del código", declaración de la clase, implementación, y al pie referencia al checklist. Sin objetos auxiliares en el mismo archivo.
B) **Multi-archivo: clase principal + clases auxiliares + tipos** en archivos separados con nombres `ZCL_<x>.abap`, `ZIF_<y>.abap`, etc. Más cercano a la estructura real de Eclipse/ADT.
C) **Mismo archivo con bloques separados por comentarios `*&---*`**: clase principal, clases helper (si las hay), tipos locales (`TYPES BEGIN OF`...), todo en un solo `.abap` con secciones bien marcadas.
X) Other (please describe after [Answer]: tag below)

[Answer]: C  *(default aplicado)*

### Question 3 — Generación de pruebas unitarias (`ABAP Unit`)
El PRD MoSCoW deja "Generación automática de pruebas unitarias" como **C3 — Fase 2** (fuera de scope MVP). Pero podríamos incluir algo mínimo. ¿Qué hacemos?

A) **Sin generación de tests** — alineado con MoSCoW C3. M3 sólo genera código de producción; las pruebas las escribe el desarrollador manualmente (compuerta del Principio #4).
B) **Generar esqueleto de test unitario** sin lógica: una clase `ZCL_<X>_TEST` con métodos vacíos para cada método público de la clase principal. Sirve de andamiaje. Documentado como "tests TODO".
C) **Generar tests básicos** para los métodos públicos con casos happy path y al menos un caso borde de los CBs del FD. Requiere que el TD venga con CBs bien especificados.
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

### Question 4 — Activación del skill `template-alv` (igual que U3)
¿Cómo activa M3 el skill ALV cuando el TD describe un reporte ALV?

A) **Activación automática** (confiar en Claude Code).
B) **Activación explícita con fallback** (mismo patrón que U3): si detecta keywords ALV, asume activación automática y, como fallback, hace `Read .claude/skills/template-alv/SKILL.md`.
C) **Activación obligatoria explícita**: M3 siempre lee el skill `Read .claude/skills/template-alv/SKILL.md` cuando el TD §1 tiene "REPORTE_ALV", sin depender de activación automática.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

### Question 5 — Estructura de la cabecera "Decisiones del código" en el `.abap`
La cabecera al inicio del archivo es obligatoria (FR-M3-06). ¿Qué incluye exactamente?

A) **Cabecera estándar con 4 bloques**: (1) banner generado-por-IA + fecha + req-id, (2) Decisiones del código (lista numerada de decisiones técnicas), (3) lista de zonas `⚠️ VERIFICAR:` referenciadas por número de línea aproximado, (4) referencia al checklist al pie. Todo entre comentarios `*&---*`.
B) **Cabecera mínima**: sólo banner generado-por-IA + fecha + req-id + referencia al checklist. Las decisiones quedan distribuidas como comentarios cerca de su uso.
C) **Cabecera amplia con manifest YAML**: incluye un bloque comentado tipo YAML con `requerimiento_id`, `fd_origen`, `td_origen`, `version_codigo`, `decisiones[]`, `verificar[]`, `checklist_url`. Más estructurado, parseable por herramientas.
X) Other (please describe after [Answer]: tag below)

[Answer]: A  *(default aplicado)*

---

## Notas sobre lo ya decidido (no se pregunta)

- ✅ FR-M3-02..14: clases `ZCL_*`, convenciones, etc.
- ✅ FR-M3-04: marcador `⚠️ VERIFICAR:`.
- ✅ FR-M3-05: AUTHORITY-CHECK en datos sensibles (SECURITY-10).
- ✅ FR-M3-07: entregable `.abap`.
- ✅ FR-M3-08: ciclo de retroalimentación con regeneración versionada (`codigo-vN.abap`).
- ✅ FR-M3-09: referencia al checklist al pie.
- ✅ FR-M3-10: sin SQL inseguro (SECURITY-09).
- ✅ FR-M3-11: sin PII/secretos (SECURITY-03).
- ✅ FR-M3-12: aplica template ALV vía skill cuando corresponde.
- ✅ Idioma español de comentarios (NFR-01).
