# Rúbrica — Módulo 2: FD → TD

> Esta rúbrica la consume el **agente Juez** cuando evalúa outputs del sub-agente `fd-a-td` sobre el golden dataset. Las métricas implementan [`docs/plan-evaluacion.md §4.2`](../../docs/plan-evaluacion.md) (factualidad 100% / completitud ≥90% / calidad de supuestos ≥4/5). Las reglas (BR-01..BR-15) están definidas en [`.claude/agents/fd-a-td.md`](../../.claude/agents/fd-a-td.md).

---

## 1. Alcance

El Juez evalúa **un output del agente FD→TD** dado:

- **`fd`**: el FD aprobado de entrada (o código ABAP, en modo reverse).
- **`output`**: el TD completo emitido por el sub-agente.
- **`ground_truth_td`** (opcional): TD real histórico (rara vez disponible).
- **`ground_truth_codigo`** (opcional): código de producción que verifica factualidad de objetos SAP.

No evalúa el código ABAP — eso es responsabilidad de la rúbrica de M3.

---

## 2. Dimensiones

| # | Dimensión | Peso | Qué mide |
|---|---|---|---|
| D1 | Identificación del tipo de objeto ABAP | 10% | §1 del TD declara el tipo correcto (REPORTE_ALV, BADI, USER_EXIT, FORMULARIO, CONVERSION, WORKFLOW, OTRO) con justificación (BR-07). |
| D2 | Factualidad / anti-alucinación de objetos SAP | **25%** | Cada tabla / FM / BAPI / BAdI / clase nombrada en §3 existe en SAP estándar **o** está mencionada en el FD **o** está marcada `⚠️ VERIFICAR:` (BR-14). Métrica más crítica — target 100%. |
| D3 | Completitud del mapeo RN → Implementación | 20% | §6 mapea cada RN del FD a método / condición / acción concretos. Mapeos vagos o RNs omitidas castigan. Target ≥90% de RNs mapeadas. |
| D4 | Calidad de Decisiones y Supuestos | 15% | §8 no vacía (BR-04), con razón + alternativa rechazada en al menos una decisión, supuestos explícitos sobre interpretación del FD. |
| D5 | Calidad de TBDs | 10% | §9 lista la información no resuelta con pregunta concreta para el consultor (BR-05). Si el FD tiene contradicciones internas y §9 dice "Ninguno", castigo fuerte (BR-15). |
| D6 | Adherencia estructural BR-01 | 10% | Las 9 secciones obligatorias están presentes; las que no aplican dicen explícitamente "No aplica para este tipo de objeto." |
| D7 | Limpieza: BR-03 + BR-13 + formato | 10% | Sin código ABAP compilable (BR-03), redacción en español (BR-13), usa el template del agente §7 (cabeceras, separadores). |

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

### D1 — Identificación del tipo de objeto

- **5**: Tipo correcto, justificación de 1 frase apoyada en el FD (verbos del Objetivo, tablas, RNs).
- **3**: Tipo correcto pero justificación genérica o ausente.
- **1**: Tipo incorrecto (p. ej. clasifica como REPORTE_ALV un FD que describe un BAdI).

### D2 — Factualidad / anti-alucinación de objetos SAP **(más crítica)**

- **5**: 100% de objetos en §3 son verificables. Toda mención no obvia trae `⚠️ VERIFICAR:` o referencia explícita al FD.
- **4**: 1 mención sin marca pero el objeto existe (false negative del marker — no inventó, solo no marcó).
- **3**: 1–2 nombres no estándar sin marca (`ZTBL_*` o `Z_FM_*` que no aparecen en el FD).
- **2**: ≥3 nombres no verificables sin marca, o invención de BAPIs/BAdIs estándar inexistentes (`BAPI_PEDIDO_CREATE`).
- **1**: Lista de tablas / FMs masivamente inventada; el TD no es confiable para construir nada.

### D3 — Completitud del mapeo RN → Implementación

- **5**: 100% de las RNs del FD aparecen mapeadas en §6 con método + condición + acción específicos.
- **4**: ≥90% mapeadas; alguna con detalle insuficiente.
- **3**: 70–89% mapeadas, o varios mapeos vagos ("se valida en el método principal").
- **2**: 50–69% mapeadas.
- **1**: <50% mapeadas, o §6 es una lista de RNs copiadas del FD sin implementación.

### D4 — Calidad de Decisiones y Supuestos (§8)

- **5**: Al menos 2 decisiones técnicas con razón + alternativa rechazada (formato del CLAUDE.md §4.1); ≥1 supuesto explícito sobre interpretación del FD.
- **4**: 2 decisiones documentadas pero sin alternativa rechazada; supuestos presentes.
- **3**: 1 decisión sin alternativa, supuestos genéricos.
- **2**: §8 presente pero trivial ("Se usa SALV porque es estándar").
- **1**: §8 vacía o ausente (viola BR-04).

### D5 — Calidad de TBDs (§9)

- **5**: TBDs específicos con "Pregunta para el consultor" concreta; o "Ninguno" cuando el FD realmente no deja dudas.
- **4**: TBDs presentes pero alguna pregunta es genérica.
- **3**: TBDs sin pregunta clara o demasiado abstractos.
- **2**: §9 dice "Ninguno" cuando el FD tiene contradicciones detectables o información obviamente faltante.
- **1**: §9 ausente, o información crítica no resuelta presentada como si fuera cierta.

### D6 — Adherencia estructural BR-01

- **5**: 9 secciones presentes; secciones no aplicables marcadas explícitamente "No aplica para este tipo de objeto."
- **4**: 9 secciones presentes; alguna marcada como N/A sin justificación.
- **3**: 7–8 secciones (falta 1–2 sin marca de N/A).
- **2**: 5–6 secciones.
- **1**: <5 secciones — el TD no respeta el contrato.

### D7 — Limpieza: BR-03 + BR-13 + formato

- **5**: Sin código ABAP compilable; español consistente; encabezados de §1..§9 según template; tablas markdown bien formadas.
- **3**: 1 fragmento que parece ABAP compilable (p. ej. `SELECT ... FROM ...` ejecutable en lugar de descripción), o 1 sección con encabezado en inglés.
- **1**: Múltiples bloques ABAP compilables (`REPORT z`, `CLASS zcl_` con `IMPLEMENTATION`, `ENDMETHOD`), o redacción mayoritariamente en inglés.

---

## 5. Métricas derivadas

A partir de los scores por scenario del dataset:

| Métrica del `plan-evaluacion.md §4.2` | Cómo se calcula |
|---|---|
| **Factualidad** | Promedio de D2 sobre el dataset. Target ≥ 4.7/5 (equivalente a 100% — la rúbrica permite tolerar el caso de "no marcado pero existe"). |
| **Completitud** | Promedio de D3. Target ≥ 4.5/5 (~90% RNs mapeadas). |
| **Calidad de supuestos** | Promedio de D4. Target ≥ 4.0/5. |

Adicionalmente:

- **Tasa de alucinaciones**: cuenta de scorecards con D2 ≤ 3 dividida por total. Target ≤ 0%.
- **Tasa de TDs con código ABAP**: cuenta de scorecards con D7 ≤ 2. Target ≤ 0%.

---

## 6. Output esperado del Juez

```json
{
  "fd_id": "REQ-2025-018",
  "modelo_evaluado": "claude-sonnet-4-6",
  "scores": {
    "D1_tipo_objeto": 5,
    "D2_factualidad": 5,
    "D3_completitud_rn": 4,
    "D4_decisiones_supuestos": 5,
    "D5_tbds": 5,
    "D6_estructura": 5,
    "D7_limpieza": 5
  },
  "score_ponderado": 4.85,
  "razonamiento": "Tipo correcto (REPORTE_ALV). Todas las tablas (MARA, EKKO, EKPO, MSEG, LFA1) están en el FD. RN3 se mapea con detalle parcial — castigo leve en D3.",
  "objetos_no_verificables": [],
  "rn_omitidas": [],
  "decisiones_count": 3,
  "tbds_count": 2,
  "contiene_codigo_abap": false
}
```

---

## 7. Calibración

Antes de usar al Juez para decisiones go/no-go (`plan-evaluacion.md §6`):

1. Tomar 3 TDs: uno claramente bueno (humano-aprobado), uno claramente malo (con alucinaciones de tablas o código embebido), uno borderline (FD con contradicción → §9 debió listar TBDs).
2. Evaluarlos manualmente con esta rúbrica.
3. Correr al Juez sobre los mismos 3 TDs.
4. Verificar correlación ≥ 0.8 entre score humano y Juez en D1+D2+D3 (las tres dimensiones más críticas para go/no-go).
5. Verificar que el Juez **siempre** asigna D2 ≤ 3 cuando hay alucinaciones, sin falsos negativos.
6. Si no se cumplen 4 o 5, ajustar este markdown (anclas, ejemplos, pesos) hasta lograrlo.

La calibración se documenta en `evaluacion/resultados/calibracion-juez-m2.md`.
