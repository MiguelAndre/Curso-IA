# U4 — Tech Stack Decisions

**Unidad**: U4
**Fecha**: 2026-05-20

---

## 1. Contexto

U4 vive en **dos planos** tecnológicos:

1. **El sub-agente** (Módulo 3): es configuración de Claude Code. No tiene tech stack tradicional.
2. **El código ABAP generado**: corre en SAP S/4HANA Cloud del cliente.

Este documento registra las decisiones de tech stack en ambos planos.

---

## 2. Tech Stack del sub-agente

| Decisión | Valor | Origen |
|---|---|---|
| Plataforma del agente | Claude Code (CLI/IDE) | Q1:A inicial del cuestionario |
| Modelo LLM | Por defecto del usuario (no fijado por el sub-agente) | Convención Claude Code; el usuario puede usar fast mode con Opus 4.6 o el modelo por defecto |
| Tools del sub-agente | `Read`, `Glob`, `Grep`, `Write` | Decisión de Plan de Code Generation U4 (a definir en Code Generation) |
| Lenguaje del prompt | Español | NFR-01, Q6:A |
| Persistencia | Filesystem local (`outputs/<fecha>/<req-id>/`) | Q5:A |
| Versionado | Git | NFR-07 |

**Alternativas rechazadas**:

| Alternativa | Por qué se rechazó |
|---|---|
| Automatización vía Anthropic API | Q1:A — fuera de scope MVP; se mantiene operación interactiva en Claude Code |
| RAG sobre documentación interna | C4 del PRD — Fase 2 / Plan B |
| MCP de solo lectura a SAP | C1 del PRD — Fase 2, requiere aprobación Seguridad |

---

## 3. Tech Stack del código ABAP generado

| Decisión | Valor | Justificación |
|---|---|---|
| Lenguaje | ABAP OO (no ABAP procedural clásico) | CLAUDE.md §5.3, FR-M4-11 |
| Versión SAP target | S/4HANA Cloud (SAP Rise) | PRD §2.1 — contexto del cliente |
| Patrón ALV | `CL_SALV_TABLE` (SALV moderno) | CLAUDE.md §5.4, mejor mantenibilidad que `CL_GUI_ALV_GRID` |
| Manejo de excepciones | Clases `CX_*` | CLAUDE.md §5.3, FR-M4-14 |
| Acceso a datos | `SELECT` con campos explícitos; `FOR ALL ENTRIES` con guarda | SECURITY-09, CLAUDE.md §5.1 |
| Autorización | `AUTHORITY-CHECK OBJECT 'X'` + verificación `SY-SUBRC` | SECURITY-10, lista ampliada Q1:B |
| Pruebas unitarias | **No generadas en Estación 4** (Q3:A, MoSCoW C3) | Compuerta del desarrollador (Principio #4) |

**Alternativas rechazadas para el código generado**:

| Alternativa | Por qué se rechazó |
|---|---|
| ABAP procedural (`REPORT zr_...`) | CLAUDE.md §5.3 prioriza ABAP OO; sólo se permite con justificación documentada en §8 del TD |
| `CL_GUI_ALV_GRID` (ALV clásico) | CLAUDE.md §5.4 prefiere SALV moderno; sólo si el TD lo exige explícitamente |
| ABAP RAP (RESTful Application Programming) | Fuera de scope MVP; el equipo del PRD no lo solicita; se evaluaría en Fase 2 |
| ABAP CDS Views | El alcance del piloto se concentra en reportes/BAdIs/conversiones, no CDS. Si el TD lo requiere, se permite, pero no es el default. |

---

## 4. Tech Stack de los documentos auxiliares

| Documento | Formato | Justificación |
|---|---|---|
| TD entrante a U4 | Markdown (`.md`) | Heredado de U3 (Q2:C) |
| `.abap` generado | Texto plano (`.abap`) | Importable directo a Eclipse/ADT |
| Cabecera "Decisiones del código" | Comentarios ABAP `*` y `*&---*` (Q5:A) | Estándar SAP, no requiere parsers externos |
| Persistencia | Filesystem (`outputs/<fecha>/<req-id>/`) | Q5:A |
| Versionado | Git | NFR-07, `.gitignore` excluye `outputs/` |

---

## 5. Dependencias técnicas

| Dependencia | Versión | Crítica |
|---|---|---|
| Claude Code | Versión vigente con soporte de sub-agentes + slash commands + skills | Sí — base de operación |
| Git | Cualquier 2.x | Sí — versionamiento del repo |
| SAP S/4HANA Cloud | Versión del cliente | Sí — para validar el código generado (fuera del scope del agente; cliente del proceso) |
| Eclipse ADT / SE80 / SE38 | Versión compatible con la versión SAP del cliente | Sí — fase post-agente; el desarrollador la usa para syntax check y pruebas |

---

## 6. Decisiones que NO se toman en U4

| Decisión | Dónde se toma |
|---|---|
| Versión exacta de SAP S/4HANA Cloud del cliente | Fuera de scope — el cliente la informa al activar el agente |
| Estándares específicos del cliente para ABAP | Q4:C del cuestionario inicial — se aportarán post-MVP |
| Selección de objeto de autorización exacto en cada caso | Se decide caso por caso; el sub-agente infiere + marca `⚠️ VERIFICAR:` |
| Estrategia de transporte | Fuera de scope (Principio #1 — humano decide) |
| Estrategia de pruebas unitarias | Q3:A — el desarrollador la define manualmente |
| Estrategia de monitoreo del código en producción | Fuera de scope — `aidlc-rules/aws-aidlc-rule-details/operations/operations.md` es placeholder |

---

## 7. Riesgos de tech stack y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Claude Code introduce cambios incompatibles en el formato de sub-agentes/skills | Mantener `aidlc-rules/VERSION` actualizado; revisar release notes; los archivos están en git y son revertibles. |
| Modelo LLM cambia y degrada calidad | El proceso es **modelo-agnóstico** (no asume capacidades específicas de un modelo); la evaluación pre-piloto detecta regresiones. |
| SAP S/4HANA Cloud actualiza convenciones (deprecaciones de FMs) | El sub-agente marca FMs no estándar con `⚠️ VERIFICAR:`; el desarrollador valida en cada generación. |
| Estándares específicos del cliente no se incorporan a tiempo | Q4:C — el agente arranca con baseline genérico; los estándares se cargan en `CLAUDE.md` cuando estén disponibles. |
