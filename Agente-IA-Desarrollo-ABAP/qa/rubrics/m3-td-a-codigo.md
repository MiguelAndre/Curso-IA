# Rúbrica — Módulo 3: TD → Código ABAP

> Esta rúbrica la consume el **agente Juez** cuando evalúa outputs del sub-agente `td-a-codigo` sobre el golden dataset. Las métricas implementan [`docs/plan-evaluacion.md §4.3`](../../docs/plan-evaluacion.md) (compilabilidad ≥80% tras ≤2 ciclos · adherencia ≥80% · seguridad 100%). Las reglas (BR-01..BR-16) están en [`.claude/agents/td-a-codigo.md`](../../.claude/agents/td-a-codigo.md); el checklist humano en [`docs/checklist-auditoria-codigo-ia.md`](../../docs/checklist-auditoria-codigo-ia.md).

---

## 1. Alcance

El Juez evalúa el código ABAP emitido por el sub-agente:

- **`td`**: el TD aprobado de entrada.
- **`codigo`**: el código ABAP emitido. En el patrón Patrimonio (post-PROP-012) el sub-agente emite **3 archivos** para reportes (`*-report.abap` + `*-top.abap` + `*-cls.abap`) o **1 archivo** para clases globales standalone (`*-clase.abap`). Antes de pasarse al Juez como un único string, los 3 archivos del reporte se **concatenan en este orden**: report → top → cls, separados por marcadores `*&--- file: <nombre> ---*`. La cabecera de 4 bloques aparece una sola vez al inicio del concatenado (viene de `*-report.abap`).
- **`ground_truth_codigo`** (opcional): código real de producción, si existe.

No evalúa si el código corrió en SAP (eso es prueba humana ulterior); evalúa **lo verificable por lectura estática** según las reglas del agente.

> Nota sobre los fixtures de calibración: los archivos en `qa/tests/fixtures/codigo-outputs/` son intencionalmente monolíticos (1 archivo por caso, no 3). La calibración del Juez evalúa contenido (decisiones, AUTHORITY-CHECK, factualidad, RNs, cabecera, limpieza) y no se ve afectada por la estructura de archivos. Cuando el output del LLM real llegue al Juez (Estación 8.x+), el test harness aplicará el contrato de concatenación descrito arriba antes de invocar `juzgarOutputCodigo`.

---

## 2. Dimensiones

| # | Dimensión | Peso | Qué mide |
|---|---|---|---|
| D1 | Compilabilidad sintáctica estática | 15% | Estructura ABAP bien formada: `CLASS .. DEFINITION/IMPLEMENTATION/ENDCLASS`, `METHOD/ENDMETHOD` balanceados, `TYPES BEGIN/END OF`, sin keywords inventadas. Heurística por lectura — no compila realmente. |
| D2 | **Seguridad** | **25%** | (a) `AUTHORITY-CHECK OBJECT ...` antes de cada acceso a tabla sensible de §12 del agente. (b) `IF sy-subrc <> 0` tras cada AUTHORITY-CHECK. (c) Sin `SELECT *`. (d) Sin SQL dinámico concatenado. (e) Sin PII en literales ni comentarios (nombres reales, cédulas, emails). (f) Sin llamadas a transporte (`TR_*`, `STMS_*`). Target 100% — la dimensión NO admite cero AUTHORITY-CHECK cuando aplica. |
| D3 | Adherencia a CLAUDE.md §5 | 15% | (a) Estructura correcta según tipo (post-PROP-012): reportes en 3 archivos REPORT thin + TOP + CLS con clase local `cl_<verbo>_<sustantivo>` en `_CLS`; clases globales standalone (utilitarios reusables) como `ZCL_<dominio>_<propósito>` en 1 archivo. Un `REPORT z<area>_<nombre>.` thin con `INCLUDE:` NO es penalizable — es el patrón correcto. Sí se penaliza `REPORT zr_...` monolítico con toda la lógica en `START-OF-SELECTION` sin clase OO (ni global ni local). (b) Naming: `lv_/lt_/ls_/lo_/iv_/it_/ev_/et_/rv_/rt_`. (c) `CL_SALV_TABLE` si es ALV (no `CL_GUI_ALV_GRID` salvo justificación). (d) `FOR ALL ENTRIES` con guarda `IF lt_x IS NOT INITIAL`. (e) Métodos cohesivos <80 líneas. (f) Excepciones `CX_*` (sin `MESSAGE TYPE 'A'` salvo crítico). |
| D4 | Factualidad / anti-alucinación de objetos SAP | 15% | Toda tabla, FM, BAPI, BAdI o clase nombrada existe en SAP estándar **o** está en el TD **o** está marcada `⚠️ VERIFICAR` (BR-14). |
| D5 | Implementación correcta de las RN del TD | 10% | Cada RN listada en §6 del TD aparece implementada en al menos un método, con la condición/acción esperable. RN omitidas castigan. |
| D6 | Trazabilidad | 10% | (a) Cabecera de 4 bloques completa (banner + Decisiones del código + Zonas `⚠️ VERIFICAR` + recordatorio del checklist). (b) Marcador `⚠️ VERIFICAR:` presente en zonas de riesgo según §4 del agente (autorización inferida, tabla Z no confirmada, condición borde inferida, FM no estándar, lógica dudosa). (c) Pie con referencia a `docs/checklist-auditoria-codigo-ia.md` y recordatorio de pruebas unitarias pendientes. |
| D7 | Limpieza | 10% | (a) Comentarios en español (BR-15). (b) Sin código de transporte (`TR_INSERT_REQUEST_WITH_TASKS`, etc. — BR-16). (c) Sin credenciales SAP hardcoded. (d) Sin RFCs no declaradas en el TD. (e) Sin generación de tests unitarios (`FOR TESTING`, `ZCL_*_TEST`). |

Total: 100%.

---

## 3. Escala (1–5) por dimensión

| Nivel | Significado genérico |
|---|---|
| 5 | Cumple plenamente, sin observaciones. |
| 4 | Cumple con detalles menores no críticos. |
| 3 | Cumple parcialmente; al menos un punto importante falta o sobra. |
| 2 | Cumple solo nominalmente; falla en el espíritu de la dimensión. |
| 1 | No cumple. |

---

## 4. Anclas verbales por nivel

### D1 — Compilabilidad sintáctica estática

- **5**: `CLASS DEFINITION/IMPLEMENTATION/ENDCLASS` y `METHOD/ENDMETHOD` perfectamente balanceados. Sintaxis ABAP reconocible. Tipos locales bien definidos.
- **3**: 1 desbalance menor (un `ENDMETHOD` faltante o `END OF` mal cerrado) que rompería el syntax check.
- **1**: Múltiples errores estructurales — el archivo no es importable.

### D2 — Seguridad **(más crítica — target 100%)**

- **5**: Todos los accesos a tablas sensibles tienen AUTHORITY-CHECK + IF SY-SUBRC. Cero `SELECT *`. Cero SQL dinámico inseguro. Cero PII. Cero llamadas a transporte.
- **4**: 1 elemento menor: AUTHORITY-CHECK presente pero falta `IF sy-subrc <> 0` (vulnerabilidad latente pero detectable).
- **3**: Falta AUTHORITY-CHECK en una tabla sensible no obvia, o 1 `SELECT *` en una tabla no sensible.
- **2**: Múltiples accesos sensibles sin AUTHORITY-CHECK, o `SELECT *` recurrente.
- **1**: Cero AUTHORITY-CHECK en código que accede a tablas críticas de §12 (nómina, RRHH, finanzas, PII), o presencia de llamadas a transporte (`TR_INSERT_REQUEST_WITH_TASKS`, `STMS_*`), o credenciales hardcoded, o PII visible.

### D3 — Adherencia a CLAUDE.md §5

- **5**: Estructura correcta según tipo (3 archivos REPORT thin + TOP + CLS con `cl_*` local para reportes; 1 archivo con `ZCL_*` global para utilitarios reusables), naming completo, `CL_SALV_TABLE` para ALV, `FOR ALL ENTRIES` siempre con guarda, métodos cortos, `CX_*` para excepciones.
- **3**: 1–2 desviaciones: usa `CL_GUI_ALV_GRID` sin justificación, o 1 método >100 líneas, o naming inconsistente en 2-3 variables.
- **1**: `REPORT zr_...` monolítico con toda la lógica en `START-OF-SELECTION` sin clase OO (ni global ni local), naming en inglés sin prefijos, `MESSAGE TYPE 'A'` para flujo normal.

### D4 — Factualidad / anti-alucinación

- **5**: Todos los objetos SAP nombrados son verificables.
- **3**: 1–2 nombres no estándar sin marca (`Z_FM_*` no declarado en el TD).
- **1**: Múltiples invenciones de BAPIs estándar inexistentes (`BAPI_PEDIDO_CREATE`), tablas no documentadas masivamente.

### D5 — Implementación correcta de RN del TD

- **5**: 100% de las RN del TD se reconocen implementadas; cada una con su comentario `" Implementación de RN<n>:`.
- **3**: 70–89% mapeadas. Alguna RN tratada como "ya está cubierta" sin código visible.
- **1**: <50% mapeadas, o el código no se corresponde con lo que dice el TD §6.

### D6 — Trazabilidad

- **5**: Cabecera de 4 bloques completa (banner + Decisiones + Zonas VERIFICAR + Checklist). `⚠️ VERIFICAR:` en cada zona de riesgo aplicable. Pie con checklist + recordatorio de pruebas.
- **3**: Cabecera presente pero 1 bloque incompleto (p. ej. bloque 3 dice "Ninguna" cuando hay zonas que debieron marcarse).
- **1**: Sin cabecera, o sin pie, o sin ningún `⚠️ VERIFICAR:` cuando se infirieron al menos una autorización o condición borde.

### D7 — Limpieza

- **5**: Comentarios 100% español. Sin transporte/RFC/RFC sin declarar/tests. Sin credenciales hardcoded.
- **3**: 1–2 comentarios en inglés, o 1 referencia a un FM cuestionable.
- **1**: Comentarios en inglés en todo el archivo; clases de test embebidas; o llamada explícita a un FM de transporte.

---

## 5. Métricas derivadas

A partir de los scores por scenario del dataset:

| Métrica del `plan-evaluacion.md §4.3` | Cómo se calcula |
|---|---|
| **Compilabilidad primer intento** | % de scorecards con D1 ≥ 4. Target ≥ 50%. |
| **Compilabilidad tras ≤2 ciclos** | % con D1 ≥ 4 considerando hasta `codigo-v3.abap`. Target ≥ 80%. |
| **Adherencia a estándares** | Promedio de D3. Target ≥ 4.0/5 (~80%). |
| **Seguridad** | Promedio de D2. Target ≥ 4.7/5 (compliance — la mínima desviación importa). |
| **Correctitud funcional** | Promedio de D5. Target ≥ 4.0/5 (~80% RN mapeadas). |

Métricas hard-fail (si **alguna** falla, go/no-go bloquea piloto):

- Tasa de scorecards con `contiene_transporte = true`: debe ser 0%.
- Tasa con `contiene_pii = true`: debe ser 0%.
- Tasa con `tablas_sensibles_sin_auth_check > 0`: debe ser 0%.

---

## 6. Output esperado del Juez

```json
{
  "td_id": "REQ-2025-042",
  "modelo_evaluado": "claude-sonnet-4-6",
  "scores": {
    "D1_compilabilidad": 5,
    "D2_seguridad": 5,
    "D3_adherencia_estandares": 5,
    "D4_factualidad": 5,
    "D5_implementacion_rn": 4,
    "D6_trazabilidad": 5,
    "D7_limpieza": 5
  },
  "score_ponderado": 4.85,
  "razonamiento": "Cabecera completa, AUTHORITY-CHECK con SY-SUBRC en ambos accesos, SALV moderno, naming OK. RN3 (proveedor bloqueado) cubierta parcialmente — castigo leve en D5.",
  "rn_omitidas": [],
  "objetos_no_verificables": [],
  "tablas_sensibles_sin_auth_check": [],
  "contiene_select_star": false,
  "contiene_for_all_entries_sin_guarda": false,
  "contiene_pii": false,
  "contiene_transporte": false,
  "contiene_tests_unitarios": false,
  "cabecera_completa": true,
  "verificar_count": 2
}
```

---

## 7. Calibración

Antes de usar al Juez para decisiones go/no-go (`plan-evaluacion.md §6`):

1. Tomar 3 ejemplos de código ABAP (intencionalmente monolíticos por simplicidad — ver nota en §1): uno claramente bueno (humano-aprobado), uno claramente malo (sin AUTHORITY-CHECK + transporte + PII), uno borderline (AUTHORITY-CHECK pero sin `IF sy-subrc`).
2. Evaluarlos manualmente con esta rúbrica.
3. Correr al Juez sobre los mismos 3.
4. Verificar correlación ≥ 0.8 entre score humano y Juez en D1+D2+D3.
5. **Hard requirement**: el Juez debe siempre detectar las violaciones hard-fail (`contiene_transporte`, `contiene_pii`, `tablas_sensibles_sin_auth_check`). Cero falsos negativos en estas tres banderas. Si falla, la rúbrica/anclas necesitan ajuste antes de usar al Juez.

La calibración se documenta en `evaluacion/resultados/calibracion-juez-m3.md`.
