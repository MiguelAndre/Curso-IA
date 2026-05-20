# U4 — Code Generation Summary

**Fecha**: 2026-05-20
**Unidad**: U4 — Módulo 3: TD → Código ABAP
**Plan**: `aidlc-docs/construction/plans/U4-code-generation-plan.md`

---

## Archivos generados

### Creados (3)

| Path | Tamaño aprox. | Tipo | Trazabilidad |
|---|---|---|---|
| `.claude/agents/td-a-codigo.md` | ~14 KB / 17 secciones | Sub-agente | FR-M3-01..12, IS4, BR-01..16, NFR-U4-SEC-01..04, NFR-U4-MAINT-01..04, NFR-U4-QUAL-01..03 |
| `.claude/commands/generar-abap.md` | ~5 KB | Slash command | IS7, persistencia, detección de regeneración, BR-12 prompt |
| `aidlc-docs/construction/U4/code/U4-summary.md` | este archivo | Documentación AI-DLC | resumen unidad |

---

## Trazabilidad detallada

### Requirements (`requirements.md`) cubiertos por U4

| ID | Cumplido por |
|---|---|
| IS4 | `.claude/agents/td-a-codigo.md` |
| IS7 | `.claude/commands/generar-abap.md` |
| FR-M3-01 (verifica TD con §8) | sub-agente §3 (rechazo canónico BR-01) |
| FR-M3-02 (código ABAP OO con ZCL) | sub-agente §5.2 (plantilla literal) + §6 |
| FR-M3-03 (convenciones de naming) | sub-agente §6 referenciando CLAUDE.md §5 |
| FR-M3-04 (`⚠️ VERIFICAR:`) | sub-agente §4 (5 categorías) + BR-04 |
| FR-M3-05 (AUTHORITY-CHECK en datos sensibles) | sub-agente §12 (lista ampliada Q1:B) + Pre-Output Checklist §11 check 3 |
| FR-M3-06 (cabecera "Decisiones del código") | sub-agente §5.1 (4 bloques Q5:A) + BR-02 |
| FR-M3-07 (entregable `.abap`) | sub-agente §5 + slash command persistencia |
| FR-M3-08 (ciclo de retroalimentación) | sub-agente §9 + slash command paso 3 |
| FR-M3-09 (referencia al checklist) | sub-agente §5.3 pie del archivo + BR-09 |
| FR-M3-10 (sin SQL inseguro) | Pre-Output Checklist §11 checks 1, 2, 4 + BR-06 |
| FR-M3-11 (sin PII/secretos) | Pre-Output Checklist §11 checks 5, 6 + BR-07 |
| FR-M3-12 (template ALV via skill) | sub-agente §7 (Q4:B) + BR-08 |

### NFR Requirements (`construction/U4/nfr-requirements/`) cubiertos

| NFR | Cumplido por |
|---|---|
| NFR-U4-SEC-01 (AUTHORITY-CHECK datos sensibles, lista ampliada Q1:B) | sub-agente §12 + Pre-Output Checklist check 3 |
| NFR-U4-SEC-02 (SQL seguro) | sub-agente §6 + Pre-Output Checklist checks 1, 2, 4 |
| NFR-U4-SEC-03 (sin PII) | sub-agente §11 checks 5, 6 + BR-07 |
| NFR-U4-SEC-04 (sin transporte/escritura SAP) | sub-agente §14 anti-patrones + BR-16 |
| NFR-U4-PERF-01 (SLA ≤5 min self-reported) | sub-agente §15 (heurística complejidad TD, Q2:B) |
| NFR-U4-PERF-02 (≤2h humanas) | Heredado pipeline — sin componente específico |
| NFR-U4-REL-01 (≥80% compilable) | Medido en evaluación pre-piloto |
| NFR-U4-REL-02 (escalamiento tras 2 ciclos) | sub-agente §9 + slash command paso 3 (prompt al usuario) + BR-12 |
| NFR-U4-MAINT-01 (naming) | sub-agente §6 + BR-14 |
| NFR-U4-MAINT-02 (responsabilidad única, Q4:B) | sub-agente §16 |
| NFR-U4-MAINT-03 (métodos cortos) | sub-agente §16 |
| NFR-U4-MAINT-04 (comentarios español) | Pre-Output Checklist check 10 + BR-15 |
| NFR-U4-QUAL-01..03 | sub-agente §6 + §11 + N/A sobre métricas formales (Q2:A) |
| NFR-U4-USAB-01 (output legible en chat) | slash command paso 6 imprime con highlight |
| NFR-U4-USAB-02 (mensajes accionables) | sub-agente §3 (rechazo canónico), §9 (escalamiento canónico); slash command resumen final |

### NFR Design (`construction/U4/nfr-design/`) cubierto

| Patrón | Materialización |
|---|---|
| Pre-Output Auto-Checklist (Q1:B) | sub-agente §11 (10 checks) |
| Marker-Based Risk Annotation | sub-agente §4 + §5.1 bloque 3 cabecera |
| Hard-Stop on Missing Trace Section | sub-agente §3 (BR-01) |
| Escalation After N Attempts | sub-agente §9 + slash command paso 3 (BR-12) |
| Self-Reported SLA Disclosure (Q2:B) | sub-agente §15 |
| Convention-Driven Skill Activation | sub-agente §7 (Q4:B) |
| Filesystem Versioning | sub-agente §8 + slash command paso 3 |
| Document-Side Permission Compensation | sub-agente §14 + referencia a CLAUDE.md §3 |

---

## Compliance Security Baseline (extensión activa)

| Regla | Estado | Justificación |
|---|---|---|
| SECURITY-01 (encryption) | N/A | U4 no introduce data stores. |
| SECURITY-02 (access logging red) | N/A | Sin red. |
| SECURITY-03 (no PII en outputs) | **Compliant** | Pre-Output Checklist checks 5, 6; BR-07; respuesta canónica al pedir literales sospechosos. |
| SECURITY-04 (HTTP headers) | N/A | Sin endpoints. |
| SECURITY-09 (SQL injection) | **Compliant** | Pre-Output Checklist checks 1, 2, 4; BR-06; reglas obligatorias §6. |
| SECURITY-10 (AUTHORITY-CHECK) | **Compliant** | Pre-Output Checklist check 3; lista ampliada §12; BR-05; verificación de SY-SUBRC. |

**Sin findings bloqueantes**. ✓

---

## Decisiones tomadas durante la generación

| # | Decisión | Justificación |
|---|---|---|
| 1 | Sub-agente con `tools: Read, Glob, Grep, Write` | `Write` necesario para persistencia versionada de `codigo-vN.abap`. `Read` para leer TD + versión previa en regeneración. `Glob` para detectar versión actual en `outputs/`. Sin Bash/Edit. |
| 2 | Slash command pregunta al usuario sobre el tipo de error en el 3er intento (en lugar de delegar la decisión al sub-agente) | Mantiene el control del usuario sobre BR-12 escalation. El sub-agente activa escalation solo si el usuario confirma "mismo tipo de error". |
| 3 | El sub-agente NO mide tiempo de wall-clock | No tiene acceso al reloj. La heurística SLA (§15) usa indicadores de complejidad del TD entrante como proxy. |
| 4 | Pre-Output Checklist embebido como sección numerada vs sub-skill | Q1:B aplicado — embebido en el prompt para máxima consistencia sin fricción de activación. |
| 5 | Lista ampliada de datos sensibles embebida como tabla en §12 | Q1:B aplicado — visible y editable junto con el system prompt. Cuando aparezcan estándares específicos del cliente, se ajusta en una iteración del Módulo 4. |
| 6 | Respuesta canónica ante pedidos prohibidos en §14 | Reduce variabilidad en cómo el sub-agente declina; el usuario recibe un mensaje consistente que cita Principios PRD. |
| 7 | El slash command imprime el código con triple-backtick `abap` | Habilita syntax highlighting en Claude Code; mejor experiencia de revisión. |

---

## Pruebas manuales sugeridas (Build and Test)

### Cobertura del flujo principal
1. **TD válido completo (REPORTE_ALV)** → genera `.abap` con clase `ZCL_RPT_*`, métodos `select_data`/`process_data`/`display_alv`, AUTHORITY-CHECK inferido marcado con `⚠️ VERIFICAR`.
2. **TD sin §8** → rechazo canónico, sin código generado, mensaje pidiendo regenerar TD.
3. **TD con TBDs bloqueantes en §9** → rechazo, mensaje listando TBDs.

### Cobertura de seguridad
4. **TD que accede a PA0008** (nómina) → código con AUTHORITY-CHECK + `IF sy-subrc <> 0`.
5. **TD que pide consulta de KNA1 con NAME1/EMAIL** → código con AUTHORITY-CHECK (categoría PII).
6. **TD con instrucción "haz SELECT \* para simplificar"** → sub-agente reescribe con campos explícitos (Pre-Output Checklist check 1).
7. **TD que sugiere literal con número de cliente real** → reemplazo por placeholder + nota en cabecera.

### Cobertura de regeneración / escalamiento
8. **Regeneración 1er ciclo con error específico** → `codigo-v2.abap` con cambio documentado en cabecera bloque 2.
9. **Regeneración 3er ciclo, mismo error** → BR-12 escalation, NO se genera `codigo-v3.abap`, mensaje al usuario.

### Cobertura de skill ALV
10. **TD declarando REPORTE_ALV** → patrón ALV correcto (ZCL_RPT_*, métodos del skill).
11. **TD con keywords ALV ambiguos** → activación del skill verificable.

### Cobertura de SLA
12. **TD voluminoso (> 5KB, > 10 RNs)** → nota de SLA self-reported en cabecera bloque 2.

### Cobertura de prohibiciones
13. **Usuario pide código que llame `TR_INSERT_REQUEST_WITH_TASKS`** → declinación canónica citando Principio #1/#6.
14. **Usuario pide credenciales SAP hardcoded** → declinación canónica citando NFR-08/SECURITY-03.

---

## Próxima unidad: U6 — Skill `template-alv`

- Dependencia U1 ✓.
- Independiente de U2/U3/U4 (cada uno la invoca por convención).
- Sin Functional Design / NFR — Code Generation directo según execution plan.

Tras U6, queda U5 (Orquestador `/pipeline-abap`) y finalmente Build and Test.
