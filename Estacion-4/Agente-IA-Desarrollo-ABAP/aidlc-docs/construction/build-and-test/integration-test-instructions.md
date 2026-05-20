# Integration Test Instructions

**Purpose**: validar las interacciones entre las 6 unidades del producto cuando se ejecuta el pipeline end-to-end.

**Naturaleza**: tests manuales en Claude Code (sin tooling automatizado en MVP).

---

## Escenarios de integración

### IT-1 — Pipeline end-to-end con FD ALV (UC1 del PRD)

**Descripción**: prueba el flujo completo desde un FD aprobado hasta el código ABAP, atravesando U2 → U3 → U4 con activación transitiva de U6 (skill ALV), orquestado por U5.

**Setup**:
1. Crear `tests-manuales/fixtures/fd-materiales-por-proveedor.md` con un FD válido del UC1 PRD §5 (reporte ALV de materiales por proveedor con filtros de fechas y estado).
2. El FD debe tener las 7 secciones obligatorias bien completas (sin gaps estructurales ni semánticos).

**Test Steps**:
```
/pipeline-abap tests-manuales/fixtures/fd-materiales-por-proveedor.md REQ-IT-001
```

1. Confirmar setup inicial: carpeta `outputs/<fecha>/REQ-IT-001/` creada, `fd.md` copiado.
2. M1 (validador-fd) se invoca via tool `Agent`. Reporte impreso en chat + persistido como `validacion.md`. Estado = APROBADO.
3. Gate 1/3: responder `sí`.
4. M2 (fd-a-td) se invoca. TD generado con 9 secciones. **Activación transitiva de U6**: §1 = REPORTE_ALV, §4 muestra clase `ZCL_RPT_*` con métodos del skill (`select_data`/`process_data`/`display_alv`). Persistido como `td.md`.
5. Gate 2/3: responder `sí`.
6. M3 (td-a-codigo) se invoca. Código ABAP generado con cabecera 4 bloques, métodos ALV completos, AUTHORITY-CHECK donde aplica con `⚠️ VERIFICAR:` si fue inferido. Persistido como `codigo.abap`.
7. Resumen final con 6 próximos pasos.

**Expected Results**:
- ✅ 4 archivos en `outputs/<fecha>/REQ-IT-001/`: `fd.md`, `validacion.md`, `td.md`, `codigo.abap`.
- ✅ 3 gates humanos respondidos `sí`, sin saltos.
- ✅ `td.md` muestra patrón ALV (evidencia activación de U6).
- ✅ `codigo.abap` con clase `ZCL_RPT_*`, métodos `select_data`/`process_data`/`display_alv`/`handle_authority_check`, sin `SELECT *`, con AUTHORITY-CHECK.
- ✅ Resumen final muestra rutas correctas y próximos pasos.

**Cleanup**: opcional — los archivos en `outputs/` están en `.gitignore` y se pueden eliminar libremente.

---

### IT-2 — Detención por M1 (UC2 del PRD)

**Descripción**: M1 rechaza el FD, el orquestador no debe invocar M2 ni M3 (FR-OR-03).

**Setup**:
1. Crear `tests-manuales/fixtures/fd-incompleto.md` con un FD que **falte la sección 6 (Casos Borde)** y tenga RNs declarativas vagas.

**Test Steps**:
```
/pipeline-abap tests-manuales/fixtures/fd-incompleto.md REQ-IT-002
```

**Expected Results**:
- ✅ `outputs/<fecha>/REQ-IT-002/` contiene **solo** `fd.md` y `validacion.md`. **No** debe haber `td.md` ni `codigo.abap`.
- ✅ `validacion.md` con `Estado: ❌ RECHAZADO` y gaps específicos (CE-06 para Casos Borde, CS-03 para RNs vagas) con recomendaciones accionables.
- ✅ El orquestador imprime el mensaje "Pipeline detenido en M1" con referencia a PRD §7 Journey 3.
- ✅ M2 y M3 nunca se invocan (verificar en transcript de la sesión).

---

### IT-3 — Regeneración desde Gate 2 (con feedback)

**Descripción**: usuario aprueba M1 pero pide regenerar el TD con feedback específico antes de avanzar a M3.

**Setup**: usar el mismo `fd-materiales-por-proveedor.md` de IT-1 (FD válido).

**Test Steps**:
```
/pipeline-abap tests-manuales/fixtures/fd-materiales-por-proveedor.md REQ-IT-003
```

1. M1 APROBADO. Gate 1: `sí`.
2. M2 genera `td.md`. Gate 2: responder `regenerar: el patrón ALV debe usar CL_SALV_TABLE en vez de CL_GUI_ALV_GRID si el TD lo propuso así`.
3. M2 re-invocado con feedback → genera `td-v2.md`.
4. Gate 2 re-evaluado con la nueva versión. Responder `sí`.
5. M3 procede con `td-v2.md`. Genera `codigo.abap`.

**Expected Results**:
- ✅ `outputs/<fecha>/REQ-IT-003/` contiene: `fd.md`, `validacion.md`, `td.md`, `td-v2.md`, `codigo.abap`.
- ✅ `td-v2.md` registra en §8 el cambio respecto a `td.md` ("Versión 2: cambio de CL_GUI_ALV_GRID a CL_SALV_TABLE solicitado por el desarrollador").
- ✅ `codigo.abap` se generó **desde `td-v2.md`** (no desde `td.md`), reflejando el feedback.

---

### IT-4 — Pipeline con skill ALV fallback explícito

**Descripción**: validar que U3/U4 invocan el skill template-alv como fallback si la activación automática no lo carga.

**Setup**: usar FD ALV de IT-1 pero con menos keywords (FD que dice "consulta de materiales por proveedor en formato listado" sin mencionar "ALV" o "SALV" explícitamente).

**Test Steps**:
```
/pipeline-abap tests-manuales/fixtures/fd-listado-sin-keyword-alv.md REQ-IT-004
```

**Expected Results**:
- ✅ M2 identifica el tipo de objeto como `REPORTE_ALV` por contexto (consulta tabular con filtros + output al usuario).
- ✅ Si Claude Code no activó el skill automáticamente, el sub-agente lo invoca con `Read .claude/skills/template-alv/SKILL.md` (verificable en el transcript del Agent tool).
- ✅ TD y código resultantes siguen el patrón del skill.

> Este test puede pasar implícitamente si la activación automática funcionó — observar el transcript para confirmar qué mecanismo se usó.

---

### IT-5 — Invocación standalone de un módulo (UC5)

**Descripción**: usuario invoca M2 directo con código ABAP existente (reverse engineering) sin pasar por el orquestador.

**Setup**: usar `tests-manuales/fixtures/codigo-legado.abap` (programa ABAP existente, p. ej. un reporte clásico de los 2000s).

**Test Steps**:
```
/generar-td tests-manuales/fixtures/codigo-legado.abap REQ-IT-005
```

**Expected Results**:
- ✅ M2 detecta automáticamente que el input es código ABAP, no FD (BR-09).
- ✅ TD generado con cabecera distintiva "🔄 Modo Reverse Engineering".
- ✅ §6 marca RNs como `(inferida del código)`.
- ✅ §9 lista TBDs sobre intención de negocio original.
- ✅ Persistido en `outputs/<fecha>/REQ-IT-005/td.md`.

---

### IT-6 — Datos sensibles + AUTHORITY-CHECK

**Descripción**: validar que U4 inserta AUTHORITY-CHECK cuando el TD describe acceso a tablas de la lista ampliada (Q1:B).

**Setup**: TD generado previamente (o creado a mano) que describa una consulta a PA0008 (nómina) o BSEG (contabilidad).

**Test Steps**:
```
/generar-abap tests-manuales/fixtures/td-nomina.md REQ-IT-006
```

**Expected Results**:
- ✅ Código generado incluye `AUTHORITY-CHECK OBJECT '...'` antes del `SELECT FROM PA0008`.
- ✅ Verificación de `SY-SUBRC <> 0` con `RAISE EXCEPTION` o equivalente.
- ✅ Si el TD no declaró objeto de autorización exacto, el código lo infiere y marca con `⚠️ VERIFICAR:` en línea anterior.
- ✅ La cabecera bloque 3 lista la zona `⚠️ VERIFICAR:` con número de línea aproximado.

---

## Setup del entorno de tests de integración

### Fixtures recomendadas

Crear `tests-manuales/fixtures/` con los siguientes FDs/códigos de ejemplo:

| Archivo | Contenido | Usado en |
|---|---|---|
| `fd-materiales-por-proveedor.md` | FD UC1 del PRD, ALV completo y válido | IT-1, IT-3, U3-T1 |
| `fd-incompleto.md` | FD con sección 6 vacía + RNs declarativas | IT-2, U2-T6 |
| `fd-listado-sin-keyword-alv.md` | FD ALV pero sin la palabra "ALV" explícita | IT-4 |
| `codigo-legado.abap` | Programa ABAP clásico (REPORT zr_...) | IT-5, U2-T5, U3-T3 |
| `td-nomina.md` | TD válido que requiere acceso a PA0008 | IT-6, U4-T4 |
| `td-sin-decisiones.md` | TD sin §8 | U4-T2 |
| `td-tbd-bloqueante.md` | TD con TBD bloqueante | U4-T3 |
| `td-con-pii.md` | TD que sugiere literal con apariencia PII | U4-T9 |
| `fd-contradiccion.md` | FD válido con RN3 contradiciendo RN5 | U3-T4 |
| `fd-badi.md` | FD que pide implementar un BAdI | U3-T2 |

> Estas fixtures NO se versionan necesariamente en git — pueden ser locales del desarrollador que ejecuta los tests, o pueden vivir en una carpeta dedicada `tests-manuales/` agregada a `.gitignore` si contienen información parcialmente real.

---

## Ejecución y verificación

Como los tests son manuales, no hay un comando único. Proceso:

1. Asegurar que el build está exitoso (`build-instructions.md` §5).
2. Asegurar que las fixtures están creadas.
3. Ejecutar cada escenario IT-1..IT-6 en orden.
4. Para cada escenario, anotar PASS/FAIL en `tests-manuales/resultados-<fecha>.md` con observaciones.
5. Resumir en `build-and-test-summary.md`.

---

## Cleanup

- Eliminar `outputs/REQ-IT-*/` cuando ya no sean útiles para diagnóstico.
- Mantener `tests-manuales/fixtures/` para regresiones futuras.

---

## Criterios de pass de Integration Tests

**Pass total**: IT-1..IT-6 todos con comportamiento esperado.

**Pass parcial aceptable**: IT-1, IT-2 (los más críticos) deben pasar; IT-4 puede fallar la activación automática pero pasar con fallback; IT-3, IT-5, IT-6 son secundarios y un fallo aislado se documenta para iteración de Módulo 4 (CLAUDE.md ajustes).
