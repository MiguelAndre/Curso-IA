# NFR Design Plan — U4 (Módulo 3: TD → Código ABAP)

**Fecha**: 2026-05-20
**Unidad**: U4
**Insumos**: `construction/U4/nfr-requirements/nfr-requirements.md` · `construction/U4/nfr-requirements/tech-stack-decisions.md` · `construction/U4/functional-design/*`

---

## Pasos del plan

- [x] Paso 1 — Recoger respuestas a las 2 preguntas focalizadas (defaults Q1:B, Q2:B aplicados)
- [x] Paso 2 — Generar `aidlc-docs/construction/U4/nfr-design/nfr-design-patterns.md`
- [x] Paso 3 — Generar `aidlc-docs/construction/U4/nfr-design/logical-components.md`
- [ ] Paso 4 — Presentar mensaje de completion

---

## Categorías de NFR Design — aplicabilidad

| Categoría | Aplica a U4 | Por qué |
|---|---|---|
| **Resilience patterns** | ⚠️ Parcial | No hay circuit breakers ni retries; sí hay BR-12 (escalamiento tras 2 ciclos). Se documenta como "escalation pattern". |
| **Scalability patterns** | ❌ No | Sin carga concurrente; cada sesión Claude Code es 1-a-1. |
| **Performance patterns** | ⚠️ Parcial | SLA blando ≤5 min se materializa como auto-reporte en cabecera. |
| **Security patterns** | ✅ Sí | El núcleo de U4. Materializar SECURITY-03/09/10 + lista ampliada Q1:B. |
| **Logical components** | ⚠️ Parcial | El sub-agente, el slash command, las validaciones pre-output, el skill ALV. |

---

## Preguntas focalizadas

### Question 1 — Implementación de las validaciones pre-output (SECURITY-03/09/10)
NFR-U4-SEC-01..04 exigen validaciones antes de imprimir/persistir el código (sin SELECT *, AUTHORITY-CHECK en datos sensibles, sin PII, etc.). ¿Cómo materializamos estas validaciones?

A) **Instrucciones explícitas en el system prompt del sub-agente**: el sub-agente "se auto-valida" leyendo su propio draft antes de output. Más simple, ya empezó en business-logic-model.md §11. (Confianza en el LLM.)
B) **Sección dedicada de auto-checklist en el system prompt + reglas claras de re-escritura**: el sub-agente tiene un protocolo explícito "antes de imprimir el código final, ejecuta esta lista de checks y reescribe lo que falle". Más estructurado, mayor probabilidad de cumplimiento consistente.
C) **Skills separados de validación**: crear `.claude/skills/validacion-seguridad-abap/` que el sub-agente activa explícitamente antes del output. Más modular pero más fricción y posible inconsistencia.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

### Question 2 — Materialización del SLA blando ≤5 min (NFR-U4-PERF-01)
¿Cómo se mide y reporta el tiempo de generación?

A) **Sin medición explícita**: el sub-agente no mide ni reporta. El usuario percibe el tiempo. Si tarda mucho, el agente no lo declara. (Sin overhead.)
B) **Auto-reporte en cabecera si supera el umbral**: el sub-agente estima si la generación tomó más de 5 min (basado en la complejidad del TD entrante) y, si cree que excedió, lo documenta en la cabecera "Decisiones del código". (Heurístico, basado en self-assessment.)
C) **Logging en archivo separado**: cada generación escribe duración en `outputs/<fecha>/<req-id>/metrics.json`. Más preciso pero overhead operativo.
X) Other (please describe after [Answer]: tag below)

[Answer]: B  *(default aplicado)*

---

## Notas

- **Idioma**: español heredado de NFR-01.
- **Persistencia**: filesystem `outputs/<fecha>/<req-id>/` heredado.
- **No se diseña**: scaling, queues, caches, circuit breakers — no aplican (categoría "Scalability" marcada N/A en NFR Requirements).
