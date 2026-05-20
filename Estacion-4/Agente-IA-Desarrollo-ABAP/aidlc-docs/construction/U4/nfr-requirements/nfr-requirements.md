# U4 — NFR Requirements

**Unidad**: U4 (Módulo 3: TD → Código ABAP)
**Fecha**: 2026-05-20
**Decisiones aplicadas**: Q1:B (lista ampliada de datos sensibles), Q2:A (umbrales PRD + buenas prácticas sin métricas formales), Q3:C (SLA ≤5 min blando), Q4:B (responsabilidad única explícita).

---

## 1. Resumen

U4 es la unidad con concentración de NFRs. Los NFRs aplican sobre **dos planos**:
- **El sub-agente que genera el código** (rendimiento, seguridad operativa, idioma).
- **El código ABAP generado** (seguridad SAP, mantenibilidad, calidad).

---

## 2. Seguridad

### NFR-U4-SEC-01 — AUTHORITY-CHECK obligatorio en datos sensibles (lista ampliada — Q1:B)

**Requerimiento**: el código generado por U4 DEBE incluir `AUTHORITY-CHECK OBJECT '...'` antes de cualquier acceso a tablas/datos clasificados como sensibles.

**Lista de dominios sensibles** (ampliada respecto al PRD para entorno corporativo SAP):

| Categoría | Tablas típicas | Severidad |
|---|---|---|
| Nómina | PA0008, PA0014, PA0015, PA2001, PA2002 | Crítica |
| Recursos Humanos | PA0001, PA0002, PA0006, HRP1000, HRP1001 | Crítica |
| Finanzas / Contabilidad | BSEG, BKPF, BSID, BSAD, BSIK, BSAK | Alta |
| Datos personales (PII) | KNA1 (campos NAME1/STRAS/TELF1/EMAIL), LFA1 (idem), ADRC | Alta |
| Clientes / Crédito | KNB1, KNVV, KNKK (cupo), KNVK | Media |
| Proveedores | LFB1, LFM1, LFC1 | Media |
| Márgenes / Costos / Precios | KONP, KONV, KOMP, EKKO con valoración, MBEW | Media |
| Otros dominios | tablas que el FD declare explícitamente sensibles | Según FD |

**Verificación pre-output (BR-05)**:
- Cada `SELECT` o acceso a tablas de la lista anterior está precedido por `AUTHORITY-CHECK` + verificación de `SY-SUBRC`.
- Si el objeto de autorización no fue declarado en el TD, el sub-agente lo infiere y marca con `⚠️ VERIFICAR:` para validación del desarrollador.

**Mapeo a Security Baseline**: cumple **SECURITY-10**.

---

### NFR-U4-SEC-02 — SQL seguro (sin SELECT *, sin dinámico inseguro)

**Requerimiento**: el código generado nunca contiene:
- `SELECT *` — campos explícitos siempre.
- Concatenación de strings para construir `WHERE` dinámico no parametrizado.
- `EXEC SQL` salvo justificación documentada en §8 del TD.

**Verificación pre-output (BR-06)**: el sub-agente reescribe si detecta alguna de estas formas en su draft interno.

**Mapeo a Security Baseline**: cumple **SECURITY-09**.

---

### NFR-U4-SEC-03 — Sin PII/secretos en código ni comentarios

**Requerimiento**: ningún literal en el código generado puede contener:
- Credenciales (usuario, contraseña, token, API key).
- Datos personales reales (nombre, DNI/cédula, email, teléfono).
- Datos reales de cliente/proveedor (número real, dirección real).
- Datos de nómina (salarios reales).

**Verificación pre-output (BR-07)**: si el sub-agente detecta un literal sospechoso, lo reemplaza por placeholder genérico y registra en cabecera "Decisiones del código".

**Mapeo a Security Baseline**: cumple **SECURITY-03** (sin PII/secretos en outputs).

---

### NFR-U4-SEC-04 — Sin transporte, sin escritura SAP, sin ejecución

**Requerimiento** (BR-16): el código generado NO incluye:
- Llamadas a FMs de transporte (`TR_INSERT_REQUEST_WITH_TASKS`, etc.).
- Credenciales SAP hardcoded.
- `OPEN DATASET` a paths del servidor SAP sin justificación documentada.
- RFCs salvo cuando el TD lo declare explícitamente.

**Mapeo a Principios PRD**: cumple Principios #1, #3, #6.

---

## 3. Rendimiento

### NFR-U4-PERF-01 — Tiempo de generación del agente ≤5 min (Q3:C)

**Requerimiento**: el primer intento de generación de un `.abap` típico no debe exceder los **5 minutos** de cómputo del LLM. Es un SLA **blando**: no se cancela si se excede, pero se documenta.

**Acción si se excede**: el sub-agente agrega en cabecera "Decisiones del código":
> Nota: la generación de este código tomó más de 5 min. Posibles causas: complejidad del TD por encima del promedio; revisar si el alcance puede dividirse en múltiples objetos.

**Métrica de seguimiento**: registro de duraciones en el Excel del piloto (columna opcional).

---

### NFR-U4-PERF-02 — Tiempo activo del desarrollador ≤2h por requerimiento

**Requerimiento** (heredado de NFR-02): el ciclo completo desde recibir el FD hasta entregar el `.abap` aprobado debe completarse en ≤2 horas activas del desarrollador.

**Aplicabilidad a U4**: el tiempo de revisión del código generado (incluyendo la corrida del checklist de auditoría) debe ser razonable. Si el código generado obliga sistemáticamente a > 2h de revisión, es señal de baja calidad y dispara ajuste del prompt (Iteración del Módulo 4).

---

## 4. Confiabilidad

### NFR-U4-REL-01 — Tasa de compilación ≥80% tras ≤2 ciclos

**Requerimiento** (heredado de NFR-03): en el dataset de evaluación, ≥80% de los `.abap` generados pasan syntax check tras un máximo de 2 ciclos de retroalimentación.

**Métrica**: medida durante la evaluación pre-piloto (`docs/plan-evaluacion.md`).

---

### NFR-U4-REL-02 — Escalamiento tras 2 ciclos sin éxito (BR-12)

**Requerimiento**: si tras 2 regeneraciones del mismo error el código sigue fallando, el sub-agente NO genera una tercera versión. Emite mensaje de escalamiento manual.

**Métrica de seguimiento**: tasa de escalamiento <15% (PRD §10.5).

---

## 5. Mantenibilidad

### NFR-U4-MAINT-01 — Convenciones de naming y estructura (heredado de CLAUDE.md §5)

**Requerimiento**: aplicar siempre las convenciones de `CLAUDE.md` §5.5 — Z*/Y*, prefijos `lv_`/`lt_`/`ls_`/`lo_`/`iv_`/`it_`/etc., métodos < 50 líneas, ALV con `CL_SALV_TABLE`, excepciones `CX_*`.

---

### NFR-U4-MAINT-02 — Responsabilidad única por método público (Q4:B)

**Requerimiento**: cada método público de la clase principal debe:
- Tener **una responsabilidad clara** (verbo + objeto sin "y/o").
- Ser **invocable independientemente** salvo en cadenas documentadas (constructor → métodos → cleanup).
- NO asumir estado interno de métodos previos no documentados.

**Verificación**: durante la generación, si un método público quedaría haciendo dos cosas, dividirlo. Si dos métodos comparten estado interno implícito, documentar en `" Pre-condiciones:` (forma soft, no obligatoria por método).

---

### NFR-U4-MAINT-03 — Métodos cortos

**Requerimiento**: idealmente < 50 líneas por método; máximo flexible 80 líneas. Si se excede, dividir en helpers privados.

**Origen**: CLAUDE.md §5.6, Q2:A (sin métricas formales pero como guía).

---

### NFR-U4-MAINT-04 — Comentarios en español

**Requerimiento** (heredado de NFR-01): todos los comentarios `"` y `*` están en español. Identificadores ABAP en sus convenciones estándar.

---

## 6. Calidad del código generado (Q2:A)

### NFR-U4-QUAL-01 — Compilabilidad

El código generado **debe compilar** en SAP S/4HANA Cloud (versión vigente del cliente). Es la métrica primaria; las demás son secundarias.

### NFR-U4-QUAL-02 — Sin advertencias críticas en ATC (Code Inspector)

**Requerimiento blando**: el código no debe disparar advertencias críticas del Code Inspector / ABAP Test Cockpit (ATC). Métricas como `SELECT *`, missing AUTHORITY-CHECK en SY-tablas sensibles, modulos largos — son los que ATC chequea.

**Verificación**: queda en el checklist de auditoría humana (`docs/checklist-auditoria-codigo-ia.md`).

### NFR-U4-QUAL-03 — Sin métricas estáticas formales en MVP (Q2:A)

**No se aplican** umbrales numéricos formales de complejidad ciclomática, anidamiento, longitud. Las guías existen (CLAUDE.md §5) y el LLM las usa como referencia, pero **no hay enforcement automático** en Estación 4.

**Plan**: si en el piloto se observa código con problemas sistemáticos de complejidad, se agrega métricas formales en una iteración posterior del Módulo 4.

---

## 7. Usabilidad (del agente)

### NFR-U4-USAB-01 — Output legible en chat

**Requerimiento**: el `.abap` impreso en chat debe mostrar:
- Cabecera de 4 bloques claramente delimitada.
- Sintaxis ABAP destacada (Claude Code lo hace automáticamente con triple-backtick `abap`).
- Marcadores `⚠️ VERIFICAR:` visibles (emoji incluido para destacar).
- Pie con referencia al checklist al final, antes del cierre.

---

### NFR-U4-USAB-02 — Mensajes de error/escalamiento accionables

**Requerimiento**: cuando el sub-agente rechaza (BR-01) o escala (BR-12), el mensaje al usuario incluye:
- Por qué (regla violada).
- Qué se espera (acción concreta).
- Qué archivo modificar (con ruta) o qué comando ejecutar.

---

## 8. Inventario de NFRs vs Security Baseline

| NFR ID | Mapeo Security Baseline | Aplicabilidad | Cumplimiento previsto |
|---|---|---|---|
| NFR-U4-SEC-01 | SECURITY-10 | ✅ Aplica | Verificación pre-output del sub-agente |
| NFR-U4-SEC-02 | SECURITY-09 | ✅ Aplica | Verificación pre-output del sub-agente |
| NFR-U4-SEC-03 | SECURITY-03 | ✅ Aplica | Verificación pre-output del sub-agente |
| NFR-U4-SEC-04 | Principios PRD #1/#3/#6 | ✅ Aplica | Listado explícito en CLAUDE.md §3 prohibiciones |
| NFR-U4-PERF-01 | — | ✅ Aplica | SLA blando documentado |
| NFR-U4-PERF-02 | — | ✅ Aplica (heredado NFR-02) | Medido en piloto |
| NFR-U4-REL-01 | — | ✅ Aplica (heredado NFR-03) | Medido en evaluación pre-piloto |
| NFR-U4-REL-02 | — | ✅ Aplica | BR-12 implementa |
| NFR-U4-MAINT-01..04 | — | ✅ Aplica | CLAUDE.md §5 + sub-agente |
| NFR-U4-QUAL-01..03 | — | ✅ Aplica | Verificación en runtime / piloto |
| NFR-U4-USAB-01..02 | — | ✅ Aplica | Formato del sub-agente |

---

## 9. Verificación

Estos NFRs se verifican en:

- **Generación misma** (pre-output del sub-agente): NFR-U4-SEC-01..04, NFR-U4-MAINT-01..04, NFR-U4-USAB-01..02.
- **Build and Test** (en esta sesión): casos de prueba que ejerciten las reglas.
- **Evaluación pre-piloto** (Día 1–30 del plan de entrega): NFR-U4-REL-01, NFR-U4-QUAL-01..02.
- **Piloto activo**: NFR-U4-PERF-02 (tiempo activo del desarrollador), NFR-U4-REL-02 (tasa de escalamiento).
