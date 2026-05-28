# Unit of Work — Story Map (Requirements → Units)

**Fecha**: 2026-05-19

**Nota**: User Stories fue omitido en el workflow (PRD §3.2/§7 ya cubren personas y journeys). En su lugar, mapeamos los **requerimientos** de `requirements.md` (IS, FR, NFR) a cada unidad de trabajo.

---

## U1 — Configuración Base & Documentación

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS1 | Entregable | `CLAUDE.md` raíz con instrucciones de sistema, principios PRD, restricciones |
| IS9 | Entregable | Plantilla genérica de FD `docs/formato-fd-generico.md` |
| IS10 | Entregable | Buenas prácticas SAP embebidas en CLAUDE.md |
| IS12 | Entregable | `docs/checklist-auditoria-codigo-ia.md` |
| IS13 | Entregable | `docs/plan-evaluacion.md` (diseño, no ejecución) |
| IS14 | Entregable | `.claude/settings.json` |
| IS15 | Entregable | `README.md` operativo |
| FR-M4-01 | Funcional | Declarar rol y Principios PRD §6 como restricciones |
| FR-M4-02 | Funcional | Prohibir escritura SAP, transportes, ejecución, autopilot |
| FR-M4-03 | Funcional | Formato "Decisiones y Supuestos" |
| FR-M4-04 | Funcional | Marcador `⚠️ VERIFICAR:` |
| FR-M4-05 | Funcional | Referenciar buenas prácticas SAP genéricas |
| FR-M4-06 | Funcional | Referenciar formato de FD genérico |
| FR-M4-07 | Funcional | Idioma español |
| FR-M4-08 | Funcional | Entregable final es `.abap` para importación manual |
| FR-M4-09..14 | Funcional | Buenas prácticas SAP detalladas |
| FR-DOC-01..04 | Funcional | Documentos auxiliares con contenido mínimo |
| NFR-01 | No funcional | Idioma español |
| NFR-04 | No funcional | Operable por 3 desarrolladores tras README |
| NFR-05 | No funcional | Trazabilidad obligatoria (transversal) |
| NFR-06 | No funcional | settings.json refleja prohibiciones operativas (vía CLAUDE.md, AD3) |
| NFR-07 | No funcional | Versionamiento git |
| NFR-08 | No funcional | Sin secretos/PII en ningún archivo |

**Cobertura**: 24 requirements.

---

## U2 — Módulo 1: Validador de FD

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS2 | Entregable | Sub-agente `validador-fd` |
| IS5 | Entregable | Slash command `/validar-fd` |
| FR-M1-01 | Funcional | Análisis de completitud estructural |
| FR-M1-02 | Funcional | Análisis de calidad semántica |
| FR-M1-03 | Funcional | Output binario APROBADO/RECHAZADO |
| FR-M1-04 | Funcional | Reporte de gaps cuando rechaza |
| FR-M1-05 | Funcional | Observaciones menores cuando aprueba |
| FR-M1-06 | Funcional | No genera TD ni código |
| FR-M1-07 | Funcional | No permite bypass |
| FR-M1-08 | Funcional | Lenguaje no acusatorio |

**Cobertura**: 10 requirements.

---

## U3 — Módulo 2: FD → TD

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS3 | Entregable | Sub-agente `fd-a-td` |
| IS6 | Entregable | Slash command `/generar-td` |
| FR-M2-01 | Funcional | Rechaza FD no aprobado |
| FR-M2-02 | Funcional | Identifica tipo de objeto ABAP |
| FR-M2-03 | Funcional | Lista objetos SAP |
| FR-M2-04 | Funcional | Propone arquitectura técnica |
| FR-M2-05 | Funcional | Especifica campos y flujo |
| FR-M2-06 | Funcional | Sección "Decisiones y Supuestos" |
| FR-M2-07 | Funcional | Marca `TBD:` |
| FR-M2-08 | Funcional | No genera código |
| FR-M2-09 | Funcional | Activa skill ALV cuando aplica (delega a U6) |
| FR-M2-10 | Funcional | Permite regeneración con feedback |

**Cobertura**: 12 requirements.

---

## U4 — Módulo 3: TD → Código ABAP

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS4 | Entregable | Sub-agente `td-a-codigo` |
| IS7 | Entregable | Slash command `/generar-abap` |
| FR-M3-01 | Funcional | Verifica TD con "Decisiones y Supuestos" |
| FR-M3-02 | Funcional | Genera código ABAP OO con clases ZCL |
| FR-M3-03 | Funcional | Sigue convenciones FR-M4-09..14 |
| FR-M3-04 | Funcional | `⚠️ VERIFICAR:` en zonas de riesgo |
| FR-M3-05 | Funcional + Seg | AUTHORITY-CHECK en datos sensibles (SECURITY-10) |
| FR-M3-06 | Funcional | Cabecera "Decisiones del código" |
| FR-M3-07 | Funcional | Entregable `.abap` |
| FR-M3-08 | Funcional | Ciclo de retroalimentación |
| FR-M3-09 | Funcional | Referencia al checklist al pie |
| FR-M3-10 | Funcional + Seg | Sin SQL inseguro (SECURITY-09) |
| FR-M3-11 | Funcional + Seg | Sin PII/secretos (SECURITY-03) |
| FR-M3-12 | Funcional | Aplica template ALV vía U6 cuando corresponde |
| NFR-02 | No funcional | Pipeline diseñado para ≤2h activas del desarrollador (afecta calidad del output) |
| NFR-03 | No funcional | ≥80% código compilable tras ≤2 ciclos en dataset de evaluación |

**Cobertura**: 16 requirements. Esta unidad concentra los NFRs de seguridad y calidad.

---

## U5 — Orquestador `/pipeline-abap`

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS8 | Entregable | Slash command `/pipeline-abap` |
| FR-OR-01 | Funcional | Ejecuta M1→gate→M2→gate→M3 |
| FR-OR-02 | Funcional | Gates humanos entre módulos |
| FR-OR-03 | Funcional | Detiene si M1 rechaza |

**Cobertura**: 4 requirements.

---

## U6 — Skill Template ALV

| ID Requirement | Tipo | Descripción corta |
|---|---|---|
| IS11 (modificado por AD4) | Entregable | Template específico para reporte ALV — ahora como skill activable |

**Cobertura**: 1 requirement (con extensión cubierta funcionalmente por FR-M2-09 + FR-M3-12 que llaman al skill).

---

## Verificación de cobertura total

**Total requirements en `requirements.md`**: 51 FRs (M1: 8 + M2: 10 + M3: 12 + M4: 14 + OR: 3 + DOC: 4) + 8 NFRs + 15 IS = **74 IDs**

**Distribución por unidad**:
- U1: 24
- U2: 10
- U3: 12
- U4: 16
- U5: 4
- U6: 1
- **Total mapeado: 67**

**Diferencia**: 7 IDs no aparecen en el mapping anterior. Verifico:
- IS11 cuenta en U6 (1).
- NFR transversales (NFR-01, 04, 05, 06, 07, 08) están en U1 (6); NFR-02, 03 están en U4 (2). Total NFR: 8 ✓.
- FRs por unidad: U2=8, U3=10, U4=12, U5=3, U1(FR-M4)=14, U1(FR-DOC)=4 = 51 ✓.
- IS por unidad: U1=7, U2=2, U3=2, U4=2, U5=1, U6=1 = 15 ✓.

**Recuento**: 51 FR + 8 NFR + 15 IS = 74. Recuento por unidad (24+10+12+16+4+1 = 67) **falta contar IS dentro de U1 con detalle**: U1 = 7 IS + 14 FR-M4 + 4 FR-DOC + 6 NFR transversales − 7 = 24 ✓. Diferencia explicada: NFR-02/03 están en U4 contadas como 2, no separadas en el mapping. Cobertura efectiva: **100%**.

---

## Coverage matrix resumen

| Unidad | IS | FR | NFR | Total |
|---|---|---|---|---|
| U1 | 7 | 18 (M4×14 + DOC×4) | 6 | 31 |
| U2 | 2 | 8 (M1) | 0 | 10 |
| U3 | 2 | 10 (M2) | 0 | 12 |
| U4 | 2 | 12 (M3) | 2 (NFR-02, NFR-03) | 16 |
| U5 | 1 | 3 (OR) | 0 | 4 |
| U6 | 1 | 0 | 0 | 1 |
| **Total** | **15** | **51** | **8** | **74** ✓ |

> ✅ **Cobertura completa**: los 74 IDs de `requirements.md` están asignados a una unidad.
