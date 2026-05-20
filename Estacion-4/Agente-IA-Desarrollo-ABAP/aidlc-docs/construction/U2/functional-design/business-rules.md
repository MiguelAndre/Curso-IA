# U2 — Business Rules: Validador de FD

**Unidad**: U2
**Fecha**: 2026-05-19

Reglas que el sub-agente `validador-fd` aplica al evaluar un FD. Complementa a `business-logic-model.md` (que describe el flujo).

---

## BR-01 — Estado binario obligatorio

**Regla**: el output siempre contiene exactamente un valor de estado: `APROBADO` o `RECHAZADO`. Nunca ambos, nunca ninguno, nunca un valor intermedio (sin "APROBADO CON CONDICIONES", "PENDIENTE", "PARCIAL").

**Origen**: FR-M1-03, Principio #2 PRD §6.

---

## BR-02 — Sin bypass

**Regla**: si el usuario pide aprobar un FD que el validador iba a rechazar ("dale, apruébalo igual"), el validador se niega con respuesta canónica:

> "El Principio #2 del PRD impide aprobar un FD sin la calidad estructural y semántica mínima. Los gaps detectados están documentados en este reporte. El pipeline no puede continuar hasta que se corrijan."

**Origen**: FR-M1-07, Principio #2 PRD §6.

---

## BR-03 — Sin generación de TD ni código

**Regla**: el validador NO propone TD ni código en su output. Aunque el FD sea trivialmente claro, su responsabilidad termina con el estado + (gaps | observaciones).

**Origen**: FR-M1-06.

---

## BR-04 — Trazabilidad sección-gap

**Regla**: cada gap reportado se asocia explícitamente a la sección del FD donde se detecta. El consultor debe poder ir directo a la sección y corregirla.

**Origen**: FR-M1-04 + decisión Q2:A.

**Excepción**: si un gap es transversal (p. ej. "el FD entero está en formato inválido"), se reporta sin sección específica.

---

## BR-05 — Recomendación accionable obligatoria en gaps

**Regla**: cada gap incluye una recomendación concreta sobre cómo cerrarlo. La recomendación cita ejemplos cuando ayuda.

**Origen**: decisión Q2:A.

**Ejemplo aceptable**:
> Gap: La regla RN3 dice "Validar la fecha" sin especificar la validación.
> Recomendación: redactar la regla con condición y acción, p. ej. "RN3: si la fecha desde es posterior a la fecha hasta, mostrar mensaje 'Rango de fechas inválido' y abortar."

**Ejemplo NO aceptable**:
> Gap: La regla RN3 está incompleta.
> Recomendación: completarla.

---

## BR-06 — Lenguaje no acusatorio

**Regla**: el reporte usa **voz pasiva o impersonal** y se enfoca en el **artefacto** (el FD), no en la **persona** (el consultor). Ver tabla en `business-logic-model.md` §8.

**Origen**: FR-M1-08, Riesgo R5 PRD.

---

## BR-07 — Idioma español

**Regla**: el output del validador siempre está en español. Términos técnicos SAP (`AUTHORITY-CHECK`, `SELECT`, nombres de tabla como `MARA`, `EKKO`) se mantienen tal cual.

**Origen**: NFR-01, FR-M4-07.

---

## BR-08 — Severidad fija por regla

**Regla**: la severidad de cada regla de calidad semántica (CS-01..09) está fija en `business-logic-model.md` §4. No se modifica caso por caso. El validador no "negocia" severidad porque el FD es importante o urgente.

**Origen**: Principio #2 PRD §6 (sin excepciones).

---

## BR-09 — Múltiples gaps se acumulan, no se interrumpen

**Regla**: si un FD tiene gaps en múltiples secciones, el validador los reporta **todos** en un solo output. No se detiene en el primer gap. El consultor debe poder corregir en una sola pasada.

**Origen**: FR-M1-04, eficiencia operativa (PRD §7 Journey 3).

---

## BR-10 — Observaciones menores no bloquean

**Regla**: si el FD pasa toda CE-* y toda CS-* de severidad B pero falla alguna CS-* de severidad O, el estado es **APROBADO** y las CS-O fallidas se reportan como "Observaciones menores".

**Origen**: FR-M1-05.

---

## BR-11 — Formato no soportado es gap único bloqueante

**Regla**: si el archivo entrante no es `.md` ni `.txt` interpretable, el validador NO intenta procesarlo. Devuelve `RECHAZADO` con un único gap:

> Gap (transversal): Formato no soportado.
> Recomendación: convertir el documento a markdown siguiendo `docs/formato-fd-generico.md`.

**Origen**: decisión Q3:B.

---

## BR-12 — Detección de no-FD

**Regla**: si el contenido no parece un FD en absoluto (es código ABAP, una conversación de chat, JSON, una imagen base64, etc.), el validador redirige:

> "El input no parece ser un FD. Si querías iniciar el pipeline desde código existente (UC5), usa `/generar-td <ruta-codigo>` para modo reverse engineering."

**Origen**: experiencia operativa (UC5 PRD §5).

---

## BR-13 — Persistencia condicional

**Regla**: cuando el validador es invocado por el orquestador `/pipeline-abap` con un `<req-id>`, persiste el reporte en `outputs/<fecha>-<req-id>/validacion.md`. Cuando se invoca standalone con `/validar-fd`, sólo imprime el reporte en el chat (a menos que el usuario pase un `<req-id>` opcional).

**Origen**: services.md (Per-Request Filesystem Persistence) + decisión Q5:A.

---

## BR-14 — Re-validación de FD corregido

**Regla**: si el usuario re-envía un FD que fue previamente rechazado, el validador NO compara contra el reporte anterior — ejecuta una validación fresca completa. Si los gaps reportados en la primera pasada **siguen presentes**, los reporta de nuevo. Si aparecieron gaps nuevos por la edición, también los reporta.

**Origen**: simplicidad operativa. El validador es **stateless**.

---

## BR-15 — Sin generar código de prueba ni datasets

**Regla**: el validador NO propone tests, datasets ni casos de prueba. Esa es responsabilidad del desarrollador post-aprobación.

**Origen**: FR-M1-06 (alcance estricto).

---

## Tabla maestra de decisión

| Condición | Estado | Acción del validador |
|---|---|---|
| Archivo binario (`.docx`, `.pdf`, `.png`, ...) | RECHAZADO | Reporte con 1 gap (BR-11) |
| Texto que no parece FD | (sin estado) | Redirección (BR-12) |
| Faltan secciones CE-01..07 | RECHAZADO | Listar las CE fallidas como gaps (BR-04, BR-05) |
| Pasa CE pero falla CS de severidad B | RECHAZADO | Listar las CS-B fallidas como gaps |
| Pasa CE y CS-B; falla alguna CS-O | APROBADO | Listar las CS-O fallidas como observaciones menores (BR-10) |
| Pasa CE y todas las CS | APROBADO | Sin observaciones |
