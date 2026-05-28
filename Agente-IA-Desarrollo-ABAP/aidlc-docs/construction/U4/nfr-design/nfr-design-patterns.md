# U4 — NFR Design Patterns

**Unidad**: U4
**Fecha**: 2026-05-20
**Decisiones aplicadas**: Q1:B (auto-checklist estructurado en system prompt), Q2:B (auto-reporte de SLA en cabecera si excede).

---

## 1. Catálogo de patrones aplicados

| Patrón | Categoría NFR | Aplicación en U4 |
|---|---|---|
| Pre-Output Auto-Checklist | Security + Quality | §2 |
| Marker-Based Risk Annotation | Security + Trazabilidad | §3 |
| Hard-Stop on Missing Trace Section | Security + Trazabilidad | §4 |
| Escalation After N Attempts | Resilience | §5 |
| Self-Reported SLA Disclosure | Performance | §6 |
| Convention-Driven Skill Activation | Maintainability + Performance | §7 |
| Filesystem Versioning | Reliability + Maintainability | §8 |
| Document-Side Permission Compensation | Security | §9 |

---

## 2. Patrón: **Pre-Output Auto-Checklist** (Q1:B)

**Propósito**: garantizar consistencia de las validaciones de seguridad (SECURITY-03/09/10) y calidad antes de emitir el `.abap`.

**Diseño**:
El system prompt del sub-agente incluye una sección dedicada **"Antes de imprimir el código, valida estos puntos y reescribe lo que falle"**:

```markdown
### Pre-Output Checklist (ejecutar mentalmente sobre tu draft antes de emitir)

1. ¿Hay algún `SELECT *`? → reescribir con campos explícitos.
2. ¿Algún `FOR ALL ENTRIES` sin `IF lt_x IS NOT INITIAL` previo? → agregar guarda.
3. ¿Algún acceso a tabla de la lista ampliada Q1:B sin AUTHORITY-CHECK + IF SY-SUBRC? → insertar AUTHORITY-CHECK con `⚠️ VERIFICAR:` si el objeto fue inferido.
4. ¿Algún SQL dinámico construido por concatenación de strings sin sanitización? → reescribir.
5. ¿Algún literal con apariencia de PII (nombre real, DNI, email, número de cliente real, salario, etc.)? → reemplazar por placeholder.
6. ¿Algún comentario con datos reales? → reemplazar por placeholder genérico.
7. ¿Cabecera de 4 bloques completa (banner, decisiones, verificar, checklist)?
8. ¿Pie con referencia a `docs/checklist-auditoria-codigo-ia.md` presente?
9. ¿Recordatorio de pruebas pendientes presente?
10. ¿Comentarios en español?

Si alguno falla y puedes corregirlo, reescribe el bloque. Si no puedes corregirlo (ej. el TD pide explícitamente algo prohibido), declina el output y emite mensaje al usuario explicando por qué.
```

**Trade-off**: confiamos en la disciplina del LLM. La consistencia se mide en evaluación pre-piloto (`docs/plan-evaluacion.md` §4.3).

**Alternativa rechazada (Q1:C)**: skills separados de validación — agregan fricción y posible inconsistencia de activación.

---

## 3. Patrón: **Marker-Based Risk Annotation**

**Propósito**: hacer visible al desarrollador, durante la auditoría, las decisiones del agente con incertidumbre.

**Diseño**:
- Cada zona de riesgo se marca con `⚠️ VERIFICAR:` en la línea inmediatamente anterior al código riesgoso.
- 5 categorías documentadas en `business-logic-model.md` §4 (autorizaciones inferidas, tablas Z, condiciones borde, FMs no estándar, lógica de transformación).
- Las marcas se **listan en la cabecera del archivo** (bloque 3 de la cabecera estándar Q5:A) con número de línea aproximado.

**Por qué funciona**: el desarrollador no tiene que leer todo el código para saber qué auditar — la cabecera le da el mapa.

---

## 4. Patrón: **Hard-Stop on Missing Trace Section**

**Propósito**: prevenir generaciones "caja negra" (Principio #5 del PRD).

**Diseño** (BR-01 de U4):
- Si el TD entrante no trae §8 "Decisiones y Supuestos" con contenido sustantivo → RECHAZAR generación.
- Si el TD §9 trae TBDs marcados como bloqueantes → RECHAZAR generación.

**Trade-off**: sacrifica throughput (algunos casos serán bloqueados antes de generar código) por trazabilidad garantizada. Aceptable porque el PRD prioriza calidad sobre velocidad bruta.

---

## 5. Patrón: **Escalation After N Attempts** (variante de Circuit Breaker)

**Propósito**: evitar loops infinitos cuando el LLM no puede resolver un error técnico específico.

**Diseño** (BR-12 de U4):
- Estado tracked: `RegenerationContext.intento_numero` y `tipo_error_previo`.
- Trigger: si `intento_numero == 3` y `tipo_error_actual == tipo_error_previo` → no generar `codigo-v3.abap`.
- Acción: emitir mensaje de escalamiento manual al usuario (PRD §7 Journey 4) sugiriendo desarrollo desde el TD aprobado.

**Métricas**:
- Tasa de escalamiento <15% (NFR-U4-REL-02, PRD §10.5).
- Acumulación de escalamientos del mismo tipo es evidencia para Fase 2 (MCP de solo lectura).

---

## 6. Patrón: **Self-Reported SLA Disclosure** (Q2:B)

**Propósito**: materializar NFR-U4-PERF-01 (SLA blando ≤5 min) sin overhead de logging.

**Diseño**:
- El sub-agente NO mide tiempo formalmente (no tiene acceso al reloj del wall).
- Heurísticamente, basándose en la complejidad del TD entrante (longitud, número de objetos SAP, número de RNs, número de TBDs), el sub-agente estima si la generación habrá tomado más de 5 min.
- Si su estimación indica > 5 min, agrega en la cabecera bloque 2 "Decisiones del código":

```
*&   N. Nota de SLA: la generación de este código probablemente excedió 5 min
*&      por la complejidad del TD entrante (N tablas, M reglas de negocio, K TBDs).
*&      Considera dividir el alcance en múltiples objetos en iteraciones futuras.
```

**Trade-off**: es un self-assessment, no una medición real. Pero levanta el flag para que el equipo lo discuta en la evaluación pre-piloto si se vuelve sistemático.

**Alternativa rechazada (Q2:C)**: logging en `metrics.json` — overhead operativo no justificado para el MVP.

---

## 7. Patrón: **Convention-Driven Skill Activation**

**Propósito**: aplicar el patrón ALV especializado sin acoplar U4 al skill U6.

**Diseño** (BR-08 de U4):
1. El sub-agente detecta keywords ALV en el contexto.
2. Asume que Claude Code activa el skill `template-alv` automáticamente.
3. Si su output se ve genérico (sin `ZCL_RPT_*`, sin métodos `select_data`/`process_data`/`display_alv`), invoca explícitamente `Read .claude/skills/template-alv/SKILL.md`.
4. Si el skill no existe (U6 aún no construida), aplica patrón base y declara en cabecera "Patrón ALV aplicado desde contexto base; cuando el skill esté disponible se enriquecerá."

**Trade-off**: loose coupling. U4 no depende de U6 para funcionar, sólo se enriquece con ella.

---

## 8. Patrón: **Filesystem Versioning** (heredado de U3)

**Propósito**: trazabilidad histórica de regeneraciones con feedback.

**Diseño**:
- Cada regeneración produce nuevo archivo: `codigo-v2.abap`, `codigo-v3.abap`, etc.
- Las versiones anteriores se preservan **read-only conceptualmente** (no se modifican).
- La cabecera de la nueva versión registra qué cambió respecto a la anterior.

**Trade-off**: pequeño consumo de disco por versión. Aceptable porque `outputs/` está en `.gitignore` y no se versiona en git.

---

## 9. Patrón: **Document-Side Permission Compensation** (AD3 mitigation)

**Propósito**: compensar la decisión Q3:C (settings permissive) con prohibiciones documentadas claras.

**Diseño** (`CLAUDE.md` §3):
- `CLAUDE.md` lista explícitamente las operaciones prohibidas (escritura SAP, transportes, ejecución, credenciales SAP, etc.).
- El sub-agente de U4 referencia estas prohibiciones en su §3 (Prohibiciones explícitas) y agrega anti-patrones específicos del código generado en su §14.
- Cuando el usuario pide algo prohibido, el sub-agente responde con la respuesta canónica:

```
Esa acción está prohibida por el Principio #X del PRD. Como sub-agente que genera código ABAP, no puedo:
- Llamar a FMs de transporte.
- Generar código con credenciales SAP hardcoded.
- Acceder a paths del servidor SAP sin justificación.
- Generar RFCs no declaradas en el TD.
```

**Trade-off**: la defensa es documental, no técnica. Funciona porque el entorno del agente no tiene credenciales SAP — la documentación es el verdadero punto de control + revisión humana obligatoria.

---

## 10. Patrones explícitamente NO aplicados (categoría N/A)

| Patrón | Por qué no aplica |
|---|---|
| Circuit Breaker tradicional con timeouts | No hay servicios externos; el sub-agente vive en Claude Code. |
| Retry con exponential backoff | No hay llamadas a APIs externas falibles. |
| Caching | Cada generación es nueva; no hay invocaciones repetidas con mismo input. |
| Rate Limiting | Sin carga concurrente. |
| Bulkhead pattern | Sin recursos compartidos a aislar. |
| Sharding / Scaling horizontal | Sin throughput a escalar. |
| Saga / Compensating transactions | No hay transacciones distribuidas. |
| Health Checks / Service Discovery | Sin infraestructura. |

> Estos N/A se documentan para dejar claro **por qué no se diseñaron** — no por omisión sino por inaplicabilidad al modelo de producto (configuración Claude Code, no aplicación desplegada).
