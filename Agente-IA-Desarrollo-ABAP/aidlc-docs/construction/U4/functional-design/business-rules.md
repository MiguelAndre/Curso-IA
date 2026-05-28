# U4 — Business Rules: TD → Código ABAP

**Unidad**: U4
**Fecha**: 2026-05-20

---

## BR-01 — Rechazo si TD sin §8 (Q1:A)

**Regla**: si el TD entrante no contiene §8 "Decisiones y Supuestos" con contenido sustantivo, M3 NO genera código. Emite el mensaje canónico de §3 de `business-logic-model.md` y termina.

**Origen**: FR-M3-01, Principio #5, decisión Q1:A.

**Sin bypass**: aunque el usuario insista, no se genera. Misma respuesta canónica que U2/U3 para insistencias.

---

## BR-02 — Cabecera estándar de 4 bloques (Q5:A / FR-M3-06)

**Regla**: cada archivo `.abap` empieza con la cabecera estándar:
1. Banner generado-por-IA + req-id + fechas + versión.
2. Decisiones del código (lista numerada).
3. Zonas marcadas con `⚠️ VERIFICAR:` (lista con referencia aproximada).
4. Referencia al checklist de auditoría.

Cada bloque separado por `*&---*` (línea de 72 guiones, convención SAP).

**Origen**: Q5:A, FR-M3-06, Principio #5.

---

## BR-03 — Sin modo bypass de la cabecera

**Regla**: no es opcional. Aunque el código sea de 10 líneas, la cabecera de 4 bloques está presente.

**Origen**: BR-02, Principio #5.

---

## BR-04 — `⚠️ VERIFICAR:` para zonas de riesgo (FR-M3-04)

**Regla**: cada zona con confianza < 100% se marca con un comentario `⚠️ VERIFICAR:` en la línea inmediatamente anterior al código de riesgo. Formato:

```abap
" ⚠️ VERIFICAR: <descripción específica del riesgo>
<código>
```

Categorías obligatorias a marcar:
- Autorizaciones inferidas (no confirmadas en FD/TD).
- Tablas Z/Y no confirmadas.
- Condiciones de borde inferidas.
- FMs/BAPIs no estándar SAP universal.
- Lógica de transformación con múltiples interpretaciones posibles.

**Mejor sobre-marcar que omitir**.

**Origen**: FR-M3-04, Principio #5.

---

## BR-05 — `AUTHORITY-CHECK` obligatorio en datos sensibles (SECURITY-10 / FR-M3-05)

**Regla**: cada acceso a datos sensibles (nómina, finanzas, RRHH, datos personales) debe estar precedido por `AUTHORITY-CHECK OBJECT '...' ...`. El objeto se toma del TD si está declarado. Si no, se infiere y se marca con `⚠️ VERIFICAR:`.

Si después del AUTHORITY-CHECK no se valida `SY-SUBRC`, es violación. Siempre:

```abap
AUTHORITY-CHECK OBJECT 'Z_X' ID 'ACTVT' FIELD '03'.
IF sy-subrc <> 0.
  RAISE EXCEPTION TYPE cx_<...>.  " o MESSAGE específico
ENDIF.
```

**Origen**: SECURITY-10, FR-M3-05, CLAUDE.md §5.2.

---

## BR-06 — Sin SQL inseguro (SECURITY-09 / FR-M3-10)

**Regla**: el código generado NUNCA contiene:
- `SELECT *` — usar campos explícitos siempre.
- Concatenación de strings para construir `WHERE` dinámico.
- `EXEC SQL` sin justificación documentada en §8 del TD.

`FOR ALL ENTRIES` se usa SIEMPRE con guarda no-vacía:
```abap
IF lt_keys IS NOT INITIAL.
  SELECT ... FROM ... FOR ALL ENTRIES IN lt_keys WHERE ...
ENDIF.
```

**Origen**: SECURITY-09, FR-M3-10, CLAUDE.md §5.1.

---

## BR-07 — Sin PII/secretos en código ni en comentarios (SECURITY-03 / FR-M3-11)

**Regla**: ningún literal en el código generado puede contener:
- Credenciales (usuario, contraseña, token, API key).
- Datos personales (nombre propio real, DNI/cédula real, email real, teléfono real).
- Datos de cliente real (número de cliente real, dirección real).
- Datos de nómina (salarios reales).

Si se detecta uno durante la generación, reescribir con placeholder genérico y registrar en cabecera "Decisiones del código".

**Origen**: SECURITY-03, FR-M3-11, NFR-08.

---

## BR-08 — Skill `template-alv` activación explícita + fallback (Q4:B)

**Regla**: igual que U3 BR-08. Si TD §1 es `REPORTE_ALV` o el contexto tiene keywords ALV → asumir activación automática y, si el output sale genérico, invocar `Read .claude/skills/template-alv/SKILL.md` como fallback.

**Origen**: Q4:B, FR-M3-12.

---

## BR-09 — Referencia al checklist al pie (FR-M3-09)

**Regla**: cada archivo `.abap` termina con el bloque de cierre referenciando `docs/checklist-auditoria-codigo-ia.md` y declarando responsabilidad del desarrollador (texto canónico en `business-logic-model.md` §12).

**Origen**: FR-M3-09, IS12.

---

## BR-10 — Persistencia condicional

**Regla**: con `<req-id>` → persiste en `outputs/<fecha>/<req-id>/codigo.abap`. Sin `<req-id>` → sólo chat.

**Origen**: Q5:A (heredada de Application Design).

---

## BR-11 — Versionado en regeneraciones (FR-M3-08)

**Regla**: cada regeneración con feedback de error específico produce `codigo-v2.abap`, `codigo-v3.abap`, ... preservando versiones anteriores. La cabecera "Decisiones del código" registra el cambio respecto a la versión previa.

**Origen**: FR-M3-08 + services.md §4.

---

## BR-12 — Límite de 2 ciclos con mismo error → escalar a manual (PRD §7 Journey 4)

**Regla**: si tras 2 regeneraciones con el mismo tipo de error el código sigue fallando, el sub-agente:
1. NO genera una tercera versión.
2. Emite el mensaje canónico de escalamiento (`business-logic-model.md` §9).
3. Sugiere continuar manualmente desde el TD aprobado.

**Origen**: PRD §7 Journey 4, PRD §10.5 (tasa de escalamiento <15%).

---

## BR-13 — Sin generación de tests unitarios (Q3:A / MoSCoW C3)

**Regla**: M3 no genera clases `*_TEST` ni métodos `FOR TESTING`. En lugar de tests, agrega al final del archivo el recordatorio canónico de `business-logic-model.md` §10.

**Origen**: Q3:A, MoSCoW C3 (Fase 2), Principio #4 (no reducir compuertas).

---

## BR-14 — Buenas prácticas SAP obligatorias

**Regla**: las prácticas de `CLAUDE.md` §5 son obligatorias, no sugerencias:
- Clases `ZCL_*` con métodos cohesivos.
- Naming `Z*`/`Y*`, prefijos `lv_`/`lt_`/`ls_`/`lo_`/`iv_`/`it_`/etc.
- Excepciones `CX_*`, no `MESSAGE TYPE 'A'` salvo crítico declarado.
- Métodos cortos (< 50 líneas idealmente).
- ALV con `CL_SALV_TABLE`.

**Origen**: FR-M3-03, FR-M4-09..14.

---

## BR-15 — Idioma español de comentarios

**Regla**: TODOS los comentarios del código (`"`, `*`) están en español. Identificadores ABAP siguen sus convenciones estándar (palabras reservadas en inglés). Nombres de variables y métodos en inglés (`select_data`, `process_data`) — convención técnica.

**Origen**: NFR-01, FR-M4-07, CLAUDE.md §1.

---

## BR-16 — Sin transporte, sin escritura SAP, sin ejecución

**Regla**: M3 NO sugiere ni genera código que:
- Llame a `TR_INSERT_REQUEST_WITH_TASKS` u otros FMs de transporte.
- Use credenciales SAP hardcoded.
- Use `OPEN DATASET` para acceder a paths del servidor SAP sin justificación documentada.
- Use RFCs salvo cuando el TD lo declare explícitamente.

**Origen**: Principios #1, #3, #6 del PRD.

---

## Tabla maestra de comportamiento

| Situación | Comportamiento |
|---|---|
| TD trae §8 con contenido | Procesa normal, genera código |
| TD sin §8 o §8 vacía | RECHAZA (BR-01), pide regenerar TD |
| TD §9 con TBD bloqueante | RECHAZA, especifica qué TBD resolver |
| TD declara REPORTE_ALV | Activa skill `template-alv` (BR-08) |
| Zona de riesgo detectada | Marca con `⚠️ VERIFICAR:` línea por línea (BR-04) |
| Acceso a datos sensibles | Inserta AUTHORITY-CHECK + verifica SY-SUBRC (BR-05) |
| SELECT * en draft interno | Reescribe con campos explícitos antes de output (BR-06) |
| Literal con apariencia PII | Reemplaza por placeholder, registra en cabecera (BR-07) |
| Sin `<req-id>` | Sólo chat (BR-10) |
| Con `<req-id>` | Chat + persiste en `outputs/<fecha>/<req-id>/codigo.abap` (BR-10) |
| Regeneración con error | Nueva versión `codigo-vN.abap` con cambio en cabecera (BR-11) |
| 2do ciclo del mismo error | Escala a manual (BR-12) |
| Petición de tests | Declina + recordatorio al pie (BR-13) |
| Petición de transporte automático | RECHAZA citando Principios #1, #3, #6 (BR-16) |
