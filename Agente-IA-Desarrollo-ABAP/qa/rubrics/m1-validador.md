# Rúbrica — Módulo 1: Validador de FD

> Esta rúbrica la consume el **agente Juez** cuando evalúa outputs del sub-agente `validador-fd` sobre el golden dataset. Las métricas implementan [`docs/plan-evaluacion.md §4.1`](../../docs/plan-evaluacion.md). Las reglas (CE/CS/BR) están definidas en [`.claude/agents/validador-fd.md`](../../.claude/agents/validador-fd.md).

---

## 1. Alcance

El Juez evalúa **un output del validador** dado:

- **`fd`**: el FD de entrada (markdown).
- **`output`**: la respuesta completa del sub-agente.
- **`ground_truth`** (opcional): si el FD viene del dataset histórico, el resultado real (`SIN_DEVOLUCION` / `CON_DEVOLUCION` con motivos).

No evalúa el TD ni el código — eso es responsabilidad de las rúbricas de M2 y M3.

---

## 2. Dimensiones

| # | Dimensión | Peso | Qué mide |
|---|---|---|---|
| D1 | Corrección del veredicto | 30% | El veredicto binario coincide con la realidad histórica (sensibilidad/especificidad de `plan-evaluacion.md §4.1`). |
| D2 | Completitud del reporte de gaps | 20% | Si rechaza, lista **todos** los gaps detectables (BR-09). No omite ninguno bloqueante. |
| D3 | Precisión del reporte de gaps | 20% | Cada gap reportado corresponde a una regla CE/CS real, no inventada. Sin falsos positivos. |
| D4 | Accionabilidad de las recomendaciones | 15% | Cada gap trae una recomendación que el consultor puede ejecutar sin pedir más explicación (BR-04, BR-05). |
| D5 | Adherencia al formato de output | 10% | Usa los templates de §7 del agente (cabeceras, frase canónica final, sección "Observaciones menores" cuando corresponde). |
| D6 | Lenguaje no acusatorio | 5% | Foco en el artefacto, no en la persona (BR-06). Sin frases como "el consultor olvidó". |

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

### D1 — Corrección del veredicto

- **5**: Veredicto idéntico al ground truth Y el reporte refleja exactamente los motivos reales.
- **3**: Veredicto correcto pero los motivos divergen del histórico (rechazó por otra cosa).
- **1**: Veredicto opuesto al ground truth (aprobó algo que se devolvió, o rechazó algo que pasó limpio).

### D2 — Completitud del reporte de gaps

- **5**: Todos los gaps bloqueantes detectables están listados; ninguno omitido.
- **3**: Lista la mayoría pero omite uno bloqueante (p. ej. CE-07 sin reportar cuando falta Autorizaciones).
- **1**: Reporta solo el primer gap encontrado y se detiene; viola BR-09.

### D3 — Precisión del reporte de gaps

- **5**: Cada gap reportado se mapea inequívocamente a una regla CE-XX o CS-XX real y aplica al FD dado.
- **3**: 1–2 falsos positivos (gaps que el FD no tiene realmente).
- **1**: Múltiples falsos positivos; el reporte parece genérico, no específico al FD.

### D4 — Accionabilidad de las recomendaciones

- **5**: Cada recomendación es concreta y ejecutable ("agregar sección X con el formato Y; ejemplo: ..."). El consultor no necesita preguntar nada.
- **3**: Recomendaciones genéricas tipo "completar la sección". Útil pero requiere segunda iteración.
- **1**: Sin recomendaciones, o recomendaciones que no se entienden sin contexto adicional.

### D5 — Adherencia al formato

- **5**: Usa exactamente el template de §7.1 o §7.2 del agente, incluyendo frase canónica final ("El pipeline puede continuar..." / "El pipeline está detenido...").
- **3**: Estructura razonable pero omite uno o más elementos del template (p. ej. olvida la frase canónica).
- **1**: Formato libre; no se distingue veredicto, gaps y recomendaciones.

### D6 — Lenguaje

- **5**: Tono profesional centrado en el artefacto. Sin juicios sobre el autor.
- **3**: 1–2 frases con tono acusatorio leve ("falta detalle básico").
- **1**: Lenguaje acusatorio o sarcástico.

---

## 5. Métricas derivadas

A partir de los scores por scenario del dataset:

| Métrica del `plan-evaluacion.md §4.1` | Cómo se calcula |
|---|---|
| **Sensibilidad** | % de FDs con `ground_truth = CON_DEVOLUCION` donde el agente emitió RECHAZADO Y D1 ≥ 4. Target ≥ 80%. |
| **Especificidad** | % de FDs con `ground_truth = SIN_DEVOLUCION` donde el agente emitió APROBADO Y D1 ≥ 4. Target ≥ 80%. |
| **Precisión del reporte** | Promedio de D4 sobre los rechazos. Target ≥ 3.0/5. |

---

## 6. Output esperado del Juez

```json
{
  "fd_id": "REQ-2025-018",
  "modelo_evaluado": "claude-sonnet-4-6",
  "scores": {
    "D1_correccion_veredicto": 5,
    "D2_completitud_gaps": 4,
    "D3_precision_gaps": 5,
    "D4_accionabilidad": 4,
    "D5_formato": 5,
    "D6_lenguaje": 5
  },
  "score_ponderado": 4.65,
  "razonamiento": "El veredicto coincide con el histórico. Faltó reportar CS-08 (filtro temporal ambiguo) como observación menor; el resto está completo y accionable.",
  "gaps_omitidos": ["CS-08"],
  "gaps_inventados": [],
  "tono_acusatorio": false
}
```

---

## 7. Calibración

Antes de usar al Juez para decisiones go/no-go (`plan-evaluacion.md §6`):

1. Tomar 3 outputs reales del validador (uno claramente bueno, uno claramente malo, uno borderline).
2. Evaluarlos manualmente con esta rúbrica (el Configurador del PRD §9).
3. Correr al Juez sobre los mismos 3 outputs.
4. Verificar correlación ≥ 0.8 entre score humano y score del Juez en D1+D2+D3.
5. Si correla < 0.8 → ajustar este markdown (anclas, pesos, ejemplos) hasta lograrla.

La calibración se documenta en `evaluacion/resultados/calibracion-juez-m1.md`.
