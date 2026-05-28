# Unit Test Execution

**Nota**: este producto NO tiene tests automatizados tradicionales (Q3:A — sin generación de tests, MoSCoW C3). Los "tests unitarios" son **escenarios manuales por unidad** documentados en cada `aidlc-docs/construction/U<n>/code/U<n>-summary.md`.

---

## Ejecución de tests por unidad

Cada unidad se prueba ejecutando los escenarios listados a continuación dentro de Claude Code. Para cada escenario, **revisar visualmente el output** contra el comportamiento esperado documentado.

### U1 — Configuración Base & Documentación

**Tests**: validar que los archivos existen y son legibles (cubierto por `build-instructions.md` §3, §4). No requiere ejecución de comandos adicional.

**Criterio de pass**: build exitoso (Step 5 de build-instructions).

---

### U2 — Módulo 1: Validador de FD (`/validar-fd`)

Crear archivos de prueba en `tests-manuales/fixtures/` (carpeta opcional, se puede usar cualquier ruta):

| # | Test | Input | Comando | Resultado esperado |
|---|---|---|---|---|
| U2-T1 | FD válido completo | FD con las 7 secciones obligatorias bien completadas | `/validar-fd tests-manuales/fixtures/fd-completo.md` | `Estado: ✅ APROBADO` sin observaciones |
| U2-T2 | FD con RN declarativo | FD con `RN3: Validar la fecha` sin condición→acción | `/validar-fd tests-manuales/fixtures/fd-rn-vago.md` | `Estado: ❌ RECHAZADO`, gap en sección 3 (CS-03) con recomendación |
| U2-T3 | FD sin Autorizaciones | FD con sección 7 vacía | `/validar-fd tests-manuales/fixtures/fd-sin-autorizaciones.md` | `Estado: ❌ RECHAZADO`, gap CE-07 |
| U2-T4 | FD en `.docx` | Cualquier archivo binario | `/validar-fd tests-manuales/fixtures/fd-binario.docx` | `Estado: ❌ RECHAZADO` con gap único de formato (BR-11) |
| U2-T5 | Código ABAP en lugar de FD | `.abap` con `REPORT z...` | `/validar-fd tests-manuales/fixtures/codigo-abap.abap` | Redirección a `/generar-td` (BR-12) — sin estado emitido |
| U2-T6 | FD con fechas ambiguas | FD válido pero menciona "fecha" sin precisar tipo | `/validar-fd tests-manuales/fixtures/fd-fechas-ambiguas.md` | `Estado: ✅ APROBADO` con observación menor CS-08 |

**Criterio de pass U2**: 6/6 escenarios devuelven el comportamiento esperado.

---

### U3 — Módulo 2: FD → TD (`/generar-td`)

| # | Test | Input | Comando | Resultado esperado |
|---|---|---|---|---|
| U3-T1 | FD ALV válido | FD del UC1 PRD (reporte materiales por proveedor) | `/generar-td tests-manuales/fixtures/fd-completo.md REQ-T-001` | TD con 9 secciones, §1 = `REPORTE_ALV`, §3 lista MARA/MARC/LFM1, §4 propone clase `ZCL_RPT_*` con `select_data/process_data/display_alv`. Aviso de modo directo presente. |
| U3-T2 | FD BAdI | FD de validación de cupo de cliente vía BAdI | `/generar-td tests-manuales/fixtures/fd-badi.md REQ-T-002` | TD con §1 = `BADI`, §3 identifica BAdI estándar con `⚠️ VERIFICAR:` |
| U3-T3 | Reverse engineering | `.abap` con código existente | `/generar-td tests-manuales/fixtures/codigo-legado.abap REQ-T-003` | TD con cabecera distintiva "🔄 Modo Reverse Engineering", RNs inferidas marcadas |
| U3-T4 | FD con contradicción interna | FD válido pero RN3 contradice RN5 | `/generar-td tests-manuales/fixtures/fd-contradiccion.md REQ-T-004` | TD con interpretación documentada en §8 y TBD explícito en §9 (BR-15) |
| U3-T5 | Sin req-id | FD válido | `/generar-td tests-manuales/fixtures/fd-completo.md` | TD impreso en chat, sin persistir archivo |
| U3-T6 | Persistencia | FD válido con req-id | `/generar-td tests-manuales/fixtures/fd-completo.md REQ-T-006` | `outputs/<fecha>/REQ-T-006/td.md` creado |

**Criterio de pass U3**: 6/6 con comportamiento esperado, incluyendo sección §8 obligatoria en todos los TDs.

---

### U4 — Módulo 3: TD → Código ABAP (`/generar-abap`)

| # | Test | Input | Comando | Resultado esperado |
|---|---|---|---|---|
| U4-T1 | TD ALV válido | `outputs/<fecha>/REQ-T-001/td.md` (de U3-T1) | `/generar-abap outputs/<fecha>/REQ-T-001/td.md REQ-T-001` | `codigo.abap` con cabecera 4 bloques, clase `ZCL_RPT_*`, métodos del patrón, AUTHORITY-CHECK inferido con `⚠️ VERIFICAR:` |
| U4-T2 | TD sin §8 | TD modificado a mano sin sección 8 | `/generar-abap tests-manuales/fixtures/td-sin-decisiones.md REQ-T-002` | Mensaje canónico de rechazo (BR-01), sin código generado |
| U4-T3 | TD con TBD bloqueante | TD con §9 marcando un TBD como bloqueante | `/generar-abap tests-manuales/fixtures/td-tbd-bloqueante.md REQ-T-003` | Rechazo con mensaje específico listando el TBD |
| U4-T4 | Acceso a PA0008 (nómina) | TD que requiere consultar PA0008 | `/generar-abap tests-manuales/fixtures/td-nomina.md REQ-T-004` | Código con `AUTHORITY-CHECK` + `IF sy-subrc <> 0` antes del SELECT |
| U4-T5 | Pre-Output Checklist - SELECT * | TD que pide datos generales de MARA | `/generar-abap tests-manuales/fixtures/td-generico.md REQ-T-005` | Código con `SELECT matnr, mtart, ...` campos explícitos. **NO** debe haber `SELECT *` |
| U4-T6 | Regeneración 1er ciclo | Tras U4-T1, mismo req-id + descripción de error en chat | `/generar-abap outputs/<fecha>/REQ-T-001/td.md REQ-T-001` (usuario: "falló con field MARC-MTART") | `codigo-v2.abap` generado, cambio documentado en cabecera bloque 2 |
| U4-T7 | Regeneración 3er intento mismo error | Tras 2 ciclos previos del mismo tipo de error | `/generar-abap outputs/<fecha>/REQ-T-001/td.md REQ-T-001` (mismo error) | Mensaje de escalamiento (BR-12), NO se genera `codigo-v3.abap` |
| U4-T8 | Petición prohibida | Usuario pide código con `TR_INSERT_REQUEST_WITH_TASKS` | (sesión Claude Code con el sub-agente activo) | Respuesta canónica declinando (Principio #1, #6) |
| U4-T9 | Literal con apariencia PII | TD que sugiere literal de email/nombre real | `/generar-abap tests-manuales/fixtures/td-con-pii.md REQ-T-009` | Código con placeholders genéricos, nota en cabecera (Pre-Output Checklist check 5) |

**Criterio de pass U4**: 9/9 con comportamiento esperado, incluyendo todos los Pre-Output Checks (1–10).

---

### U6 — Skill `template-alv`

El skill se prueba **transitivamente** vía U3 y U4. No tiene tests directos porque se activa por contexto.

| # | Test | Resultado esperado |
|---|---|---|
| U6-T1 | TD ALV en U3 — skill activado | El TD generado por U3-T1 incluye estructura `ZCL_RPT_*` con métodos `select_data/process_data/display_alv` |
| U6-T2 | Código ALV en U4 — skill activado | El código generado por U4-T1 sigue el esqueleto completo del skill (§3 de SKILL.md): constructor, `ejecutar`, `handle_authority_check`, etc. |
| U6-T3 | Activación por fallback | Si el contexto activo no carga el skill automáticamente, el sub-agente lo invoca con `Read .claude/skills/template-alv/SKILL.md` |

**Criterio de pass U6**: 3/3.

---

### U5 — Orquestador `/pipeline-abap`

| # | Test | Input | Comando | Resultado esperado |
|---|---|---|---|---|
| U5-T1 | Happy path completo | FD válido | `/pipeline-abap tests-manuales/fixtures/fd-completo.md REQ-T-PIPE-1` | 4 archivos en `outputs/<fecha>/REQ-T-PIPE-1/` (fd, validacion, td, codigo). 3 gates humanos respondidos `sí`. Resumen final con 6 próximos pasos |
| U5-T2 | FD rechazado por M1 | FD incompleto | `/pipeline-abap tests-manuales/fixtures/fd-incompleto.md REQ-T-PIPE-2` | Solo `fd.md` y `validacion.md` persistidos. Pipeline detenido. Mensaje claro con próximos pasos para reenviar al consultor |
| U5-T3 | Usuario detiene en Gate 1 | FD válido, usuario responde `no` post-M1 | `/pipeline-abap tests-manuales/fixtures/fd-completo.md REQ-T-PIPE-3` | Solo `fd.md` y `validacion.md` persistidos. Mensaje de pausa con instrucción para retomar |
| U5-T4 | Regenerar TD en Gate 2 | FD válido, usuario responde `regenerar: <feedback>` post-M2 | `/pipeline-abap tests-manuales/fixtures/fd-completo.md REQ-T-PIPE-4` | `td.md` + `td-v2.md` persistidos. Gate 2 re-evaluado. Continuación normal tras aprobar v2 |
| U5-T5 | Args faltantes | Sin args | `/pipeline-abap` | Mensaje de uso con ejemplo |
| U5-T6 | Ruta de FD inexistente | Ruta inválida | `/pipeline-abap docs/no-existe.md REQ-T-PIPE-6` | Mensaje de error claro |

**Criterio de pass U5**: 6/6 con comportamiento esperado, incluyendo los 3 gates humanos en cada caso aplicable.

---

## Comando de ejecución (resumen)

No hay un comando bash que ejecute todos los tests — son **manuales en Claude Code**. Proceso recomendado:

1. Abre Claude Code en la raíz del repo (per `build-instructions.md`).
2. Crea fixtures en `tests-manuales/fixtures/` (FDs de prueba representativos de cada escenario).
3. Ejecuta cada escenario de U2, U3, U4, U5 en orden.
4. Para cada test, anota PASS/FAIL en una hoja o en un archivo local `tests-manuales/resultados-<fecha>.md`.
5. Al finalizar, actualiza `aidlc-docs/construction/build-and-test/build-and-test-summary.md` con el conteo final.

**Total escenarios**: U2: 6 + U3: 6 + U4: 9 + U6: 3 + U5: 6 = **30 escenarios manuales**.

---

## Criterios de cobertura

| Aspecto | Test que lo cubre |
|---|---|
| Output binario APROBADO/RECHAZADO de M1 | U2-T1, U2-T2 |
| 7 reglas CE de M1 | U2-T2..T6 (cada una toca al menos una) |
| 9 reglas CS de M1 | U2-T2 (CS-03), U2-T3 (CS-07 implícita), U2-T6 (CS-08) |
| Sin bypass M1 | Implícito en cualquier rechazo — el agente no acepta forzado |
| 9 secciones del TD obligatorias | U3-T1..T6 |
| Modo directo M2 | U3-T1..T6 (todos vienen del slash command directo) |
| Modo reverse engineering | U3-T3 |
| Pre-Output Checklist M3 (10 checks) | U4-T1..T9 (cobertura distribuida) |
| Lista ampliada datos sensibles | U4-T4 |
| Sin SQL inseguro | U4-T5 |
| Sin PII | U4-T9 |
| Ciclo retroalimentación | U4-T6 |
| Escalamiento BR-12 | U4-T7 |
| Anti-patrones declinados | U4-T8 |
| Skill ALV activado | U6-T1, U6-T2 |
| Orquestación completa | U5-T1 |
| Detención por M1 | U5-T2 |
| Gates humanos | U5-T1..T4 |
| Regeneración desde Gate 2 | U5-T4 |
| Manejo de args | U5-T5, U5-T6 |

**Cobertura total**: todos los FR-M1, FR-M2, FR-M3, FR-OR + Pre-Output Checklist completo + escenarios de modo directo y reverse engineering.
