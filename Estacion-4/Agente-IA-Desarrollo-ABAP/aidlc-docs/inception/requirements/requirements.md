# Requirements — Agente IA para Desarrollo ABAP (Estación 4)

**Versión**: 1.0
**Fecha**: 2026-05-19
**Insumos**: `prd.md` (PRD v1.0 aprobado) + respuestas a `requirement-verification-questions.md`
**Profundidad**: Standard
**Extensiones activas**: Security Baseline (Yes), Property-Based Testing (No)

---

## 1. Intent Analysis

| Atributo | Valor |
|---|---|
| **User request** | "Usando AI-DLC, construiremos un producto que consiste en un agente IA para el Desarrollo de código ABAP, partiendo de una especificación funcional que devuelve una especificación técnica y con ella generar el código ABAP." |
| **Request Type** | New Project (greenfield) |
| **Request Clarity** | Clear — PRD v1.0 aprobado como contrato de producto |
| **Scope Estimate** | Multiple Components (4 módulos del pipeline + template ALV + checklist auditoría + plan de evaluación) |
| **Complexity Estimate** | Moderate |
| **Risk Level** | Medio — agente sin acceso de escritura a SAP (Principios #1, #3, #6 del PRD); riesgo principal es calidad del código generado, mitigado por revisión humana obligatoria |

---

## 2. Alcance de la Estación 4 (basado en Q1, Q2, Q11)

### 2.1 Dentro del alcance (IN-SCOPE)

| # | Entregable | Decisión origen |
|---|---|---|
| IS1 | `CLAUDE.md` raíz con instrucciones de sistema, principios no negociables del PRD, restricciones de seguridad | Q1:A |
| IS2 | Sub-agente `validador-fd` en `.claude/agents/validador-fd.md` (Módulo 1) | Q3:D |
| IS3 | Sub-agente `fd-a-td` en `.claude/agents/fd-a-td.md` (Módulo 2) | Q3:D |
| IS4 | Sub-agente `td-a-codigo` en `.claude/agents/td-a-codigo.md` (Módulo 3) | Q3:D |
| IS5 | Slash command `/validar-fd` en `.claude/commands/validar-fd.md` (atajo a IS2) | Q3:D |
| IS6 | Slash command `/generar-td` en `.claude/commands/generar-td.md` (atajo a IS3) | Q3:D |
| IS7 | Slash command `/generar-abap` en `.claude/commands/generar-abap.md` (atajo a IS4) | Q3:D |
| IS8 | Slash command orquestador `/pipeline-abap` que ejecuta IS5 → IS6 → IS7 secuencialmente con gates de aprobación | Q1:A |
| IS9 | Plantilla de FD genérica `docs/formato-fd-generico.md` (objetivo, alcance, reglas de negocio, tablas SAP, criterios de aceptación, casos borde, autorizaciones) | Q5:C |
| IS10 | Buenas prácticas SAP genéricas embebidas en CLAUDE.md (SQL optimizado, AUTHORITY-CHECK, ABAP OO con clases ZCL, ALV estándar, naming Z*/Y*) | Q4:C |
| IS11 | Template específico para reporte ALV (UC1 del PRD) — instrucciones especializadas para sub-agentes M2/M3 cuando el FD describe un reporte ALV | Q7:B |
| IS12 | `docs/checklist-auditoria-codigo-ia.md` — checklist de auditoría referenciable | Q8:A |
| IS13 | Diseño del plan de evaluación pre-piloto: documento `docs/plan-evaluacion.md` con dataset esperado, criterios de comparación, métricas y formato de reporte | Q11:B |
| IS14 | `settings.json` con permissions y configuración mínima para operar el pipeline | Q1:A |
| IS15 | README operativo `README.md` con guía de uso del pipeline para los 3 desarrolladores ABAP | Q1:A (onboarding M8 del PRD) |

### 2.2 Fuera del alcance (OUT-OF-SCOPE) en Estación 4

| # | Excluido | Razón |
|---|---|---|
| OS1 | Automatización del pipeline via Anthropic API | Q1:A (extensión C2 del PRD, no incluida) |
| OS2 | Templates BAdI, formulario, conversión | Q7:B (solo ALV en MVP) |
| OS3 | Ejecución de la evaluación pre-piloto sobre FDs históricos | Q11:B (solo diseño) |
| OS4 | Conexión MCP a SAP Development | C1 del PRD — Fase 2 |
| OS5 | Generación automática de pruebas unitarias ABAP | C3 del PRD — Fase 2 |
| OS6 | RAG sobre documentación interna | C4 del PRD — Fase 2 |
| OS7 | Estándares ABAP específicos de la empresa | Q4:C (se incorporan en iteración posterior) |
| OS8 | Plantilla concreta de FD de la empresa | Q5:C (se usa formato genérico) |
| OS9 | Reutilización directa (copy) de artefactos de Estación 3 | Q2:C (se referencia pero no se copia) |
| OS10 | Transporte automático, acceso de escritura SAP, modo autopilot | Principios #1, #3, #6 del PRD — no negociable |

---

## 3. Requerimientos Funcionales

> **Convención**: cada FR está trazado a un módulo del PRD (M1/M2/M3/M4) y a un caso de uso (UC1..UC5) cuando aplica.

### 3.1 Módulo 4 — Configuración Base (CLAUDE.md)

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-M4-01 | El CLAUDE.md DEBE declarar el rol del agente, el flujo del pipeline (FD→TD→Código) y los seis Principios No Negociables del PRD (Segmento 6) como restricciones de sistema. | PRD §6 |
| FR-M4-02 | El CLAUDE.md DEBE prohibir explícitamente: acceso de escritura a SAP, ejecución de transportes, ejecución de código en cualquier ambiente SAP, modo autopilot. | PRD §6 P1, P3, P6 |
| FR-M4-03 | El CLAUDE.md DEBE definir el formato obligatorio "Decisiones y Supuestos" en cada output (sección al pie con interpretaciones del agente). | PRD §6 P5, §9 M2 |
| FR-M4-04 | El CLAUDE.md DEBE definir el marcador `⚠️ VERIFICAR:` para zonas de incertidumbre en el código (autorizaciones no confirmadas, tablas Z no verificadas, condiciones de borde inferidas). | PRD §6 P5, §9 M3 |
| FR-M4-05 | El CLAUDE.md DEBE referenciar las buenas prácticas SAP genéricas (FR-M4-09..FR-M4-14) como contexto permanente. | Q4:C |
| FR-M4-06 | El CLAUDE.md DEBE referenciar el formato de FD genérico de IS9 como contrato de entrada del Validador. | Q5:C |
| FR-M4-07 | Las instrucciones del agente DEBEN estar redactadas en español. | Q6:A |
| FR-M4-08 | El CLAUDE.md DEBE indicar que el entregable final es un archivo `.abap` que el desarrollador importa manualmente. | PRD §6 P1, P6 |
| FR-M4-09 | Las buenas prácticas SAP DEBEN incluir: SELECT con campos explícitos (no `SELECT *`), uso de `FOR ALL ENTRIES IN` con guarda no-vacía, sin SQL dinámico sin escape. | Q4:C, SECURITY-09 |
| FR-M4-10 | Las buenas prácticas SAP DEBEN incluir: AUTHORITY-CHECK donde el código accede a datos sensibles (nómina, finanzas, RRHH, datos personales). | Q4:C, SECURITY-10 |
| FR-M4-11 | Las buenas prácticas SAP DEBEN incluir: arquitectura ABAP OO con clases `ZCL_*`, métodos cohesivos, modularización por responsabilidades. | Q4:C |
| FR-M4-12 | Las buenas prácticas SAP DEBEN incluir: ALV estándar con field catalog y exportación; nunca controles propietarios sin justificación. | Q4:C, PRD UC1 |
| FR-M4-13 | Las buenas prácticas SAP DEBEN incluir: convenciones de naming `Z*`/`Y*` para objetos custom, prefijos para variables (`lv_`, `lt_`, `ls_`, `lo_`). | Q4:C |
| FR-M4-14 | Las buenas prácticas SAP DEBEN incluir: manejo de excepciones con clases `CX_*`, no `MESSAGE TYPE 'A'` salvo en condiciones críticas declaradas. | Q4:C |

### 3.2 Módulo 1 — Validador de FD (sub-agente `validador-fd` + comando `/validar-fd`)

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-M1-01 | El validador DEBE analizar completitud estructural del FD contra el formato genérico (IS9). | PRD §9 M1 |
| FR-M1-02 | El validador DEBE analizar calidad semántica del FD: detectar descripciones genéricas, ambigüedades, faltantes de criterios de aceptación, falta de casos borde. | PRD §9 M1 |
| FR-M1-03 | El validador DEBE producir un output **binario**: `APROBADO` o `RECHAZADO`. No existe estado intermedio. | PRD §6 P2 |
| FR-M1-04 | Cuando el output es `RECHAZADO`, el validador DEBE incluir un reporte de gaps con checklist específico de qué información falta y dónde, accionable por el consultor funcional. | PRD §9 M1, UC2 |
| FR-M1-05 | Cuando el output es `APROBADO`, el validador PUEDE incluir observaciones menores no bloqueantes (ej.: "el rango de fechas no especifica si usa fecha de documento o de contabilización"). | PRD §7 Journey 1 |
| FR-M1-06 | El validador NO DEBE generar TD ni código. Es exclusivamente compuerta de entrada. | PRD §6 P2 |
| FR-M1-07 | El validador NO DEBE permitir bypass. No existe modo "continuar de todas formas". | PRD §6 P2 |
| FR-M1-08 | El reporte de gaps DEBE estar redactado en lenguaje no acusatorio (Persona 3 — Consultor Funcional, riesgo de adopción del PRD). | PRD §3.2 P3, Riesgo R5 |

### 3.3 Módulo 2 — Agente FD → TD (sub-agente `fd-a-td` + comando `/generar-td`)

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-M2-01 | El agente DEBE rechazar la ejecución si el FD no ha sido aprobado por el Validador (FR-M1-03). | PRD §6 P2 |
| FR-M2-02 | El agente DEBE identificar el tipo de objeto ABAP a construir (reporte ALV, BAdI, User Exit, formulario, conversión, etc.) desde el FD. | PRD §9 M2 |
| FR-M2-03 | El agente DEBE listar los objetos SAP relevantes: tablas (MARA, MARC, LFM1, EKKO, etc. cuando apliquen), módulos de función, clases, BAdIs, User Exits identificados. | PRD §9 M2, §7 Journey 1 |
| FR-M2-04 | El agente DEBE proponer la arquitectura técnica del objeto: estructura de la clase ZCL, lógica de selección, tipo de ALV, secuencia de procesamiento. | PRD §9 M2 |
| FR-M2-05 | El agente DEBE especificar campos de selección, estructuras intermedias y campos del output. | PRD §9 M2 |
| FR-M2-06 | El agente DEBE incluir la sección obligatoria **"Decisiones y Supuestos"** documentando interpretaciones y supuestos hechos durante la traducción FD→TD. | PRD §6 P5 |
| FR-M2-07 | El agente DEBE marcar con **`TBD:`** información del FD no resuelta, con la pregunta específica a resolver. | PRD §9 M2 |
| FR-M2-08 | El agente NO DEBE generar código ABAP. Su entregable es exclusivamente la especificación técnica. | PRD §9 M2 |
| FR-M2-09 | Cuando el FD corresponde a reporte ALV, el agente DEBE aplicar el template específico (IS11) con estructura preferida: clase ZCL con métodos `select_data`, `process_data`, `display_alv`. | Q7:B, PRD UC1 |
| FR-M2-10 | El agente DEBE permitir al desarrollador solicitar regeneración con feedback específico (ciclo de retroalimentación). | PRD §7 Journey 1, §9 M2 |

### 3.4 Módulo 3 — Agente TD → Código ABAP (sub-agente `td-a-codigo` + comando `/generar-abap`)

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-M3-01 | El agente DEBE rechazar la ejecución si no recibe un TD que pasó FR-M2-06 (incluye Decisiones y Supuestos). | PRD §6 P2, P5 |
| FR-M3-02 | El agente DEBE generar código ABAP OO completo: clases `ZCL_*`, interfaces, métodos. | PRD §9 M3 |
| FR-M3-03 | El código generado DEBE seguir las convenciones FR-M4-09..FR-M4-14. | Q4:C |
| FR-M3-04 | El código DEBE incluir comentarios `⚠️ VERIFICAR:` en autorizaciones no confirmadas, tablas Z no verificadas, condiciones de borde inferidas. | PRD §6 P5, §9 M3 |
| FR-M3-05 | El código DEBE incluir AUTHORITY-CHECK en accesos a datos sensibles. Si el agente no puede determinar el objeto de autorización exacto, DEBE incluir un placeholder con `⚠️ VERIFICAR:`. | SECURITY-10, PRD §11 RT3 |
| FR-M3-06 | El código DEBE incluir una sección **"Decisiones del código"** al inicio del archivo `.abap` (en comentarios de cabecera) que explique decisiones técnicas de implementación. | PRD §6 P5 |
| FR-M3-07 | El entregable DEBE ser un archivo `.abap` (texto plano), entregado al desarrollador. **Nunca** escritura directa en SAP. | PRD §6 P1, P6 |
| FR-M3-08 | El agente DEBE permitir ciclos de retroalimentación: cuando el desarrollador describe un error específico (syntax check, prueba unitaria), el agente regenera incorporando la corrección. | PRD §9 M3, UC3 |
| FR-M3-09 | El agente DEBE referenciar al pie del output el checklist de auditoría (IS12) recordando al desarrollador que la aprobación es declaración de responsabilidad. | Q8:A |
| FR-M3-10 | El agente NO DEBE escribir SQL dinámico sin escape ni concatenación de SQL sin sanitización. | SECURITY-09 |
| FR-M3-11 | El agente NO DEBE incluir secretos, tokens, credenciales o PII en el código ni en logs. | SECURITY-03 |
| FR-M3-12 | Cuando el TD corresponde a reporte ALV, el agente DEBE aplicar el template específico (IS11). | Q7:B, PRD UC1 |

### 3.5 Orquestador `/pipeline-abap`

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-OR-01 | El comando DEBE ejecutar el pipeline en orden: M1 (validar) → gate humano → M2 (generar TD) → gate humano → M3 (generar código). | PRD §9 arquitectura, §7 Journey 1 |
| FR-OR-02 | Entre cada módulo el comando DEBE pausar y solicitar aprobación explícita del desarrollador. No existe modo autopilot. | PRD §6 P6 |
| FR-OR-03 | Si M1 rechaza, el pipeline DEBE detenerse y mostrar el reporte de gaps. M2/M3 no se invocan. | PRD §6 P2 |

### 3.6 Documentos auxiliares

| ID | Requerimiento | Trazabilidad |
|---|---|---|
| FR-DOC-01 | `docs/formato-fd-generico.md` DEBE incluir secciones mínimas: Objetivo, Alcance, Reglas de Negocio, Tablas SAP involucradas, Criterios de Aceptación, Casos Borde, Autorizaciones. | Q5:C |
| FR-DOC-02 | `docs/checklist-auditoria-codigo-ia.md` DEBE contener al menos los 7 ítems del PRD §11.3. | PRD §11.3, Q8:A |
| FR-DOC-03 | `docs/plan-evaluacion.md` DEBE incluir: criterios de selección del dataset, proceso de comparación TD-vs-real y código-vs-producción, métricas (compilabilidad, factualidad, completitud, adherencia), formato de reporte de hallazgos. | PRD §11, Q11:B |
| FR-DOC-04 | `README.md` DEBE incluir guía de instalación, configuración inicial y los 5 casos de uso del PRD operacionalizados (paso a paso para cada uno). | PRD §5, M8 |

---

## 4. Requerimientos No Funcionales

| ID | Requerimiento | Tipo | Trazabilidad |
|---|---|---|---|
| NFR-01 | El idioma de outputs e instrucciones de los agentes DEBE ser español. | Usabilidad | Q6:A |
| NFR-02 | El pipeline DEBE diseñarse para que un requerimiento de complejidad media se ejecute en ≤2 horas activas del desarrollador (alineado con target piloto del PRD §10). | Performance | PRD §10 |
| NFR-03 | La tasa de código compilable tras ≤2 ciclos de retroalimentación DEBE ser ≥80% en el dataset de evaluación diseñado (IS13). | Calidad | PRD §10.5 |
| NFR-04 | La configuración DEBE poder ser operada por los 3 desarrolladores ABAP de forma autónoma tras seguir el README (IS15). | Usabilidad | PRD §3.2 P2, MoSCoW M8 |
| NFR-05 | Toda interacción del agente DEBE preservar trazabilidad: secciones "Decisiones y Supuestos" y "Decisiones del código" obligatorias. No "caja negra". | Auditabilidad | PRD §6 P5 |
| NFR-06 | El agente NO DEBE tener configuradas herramientas con acceso de escritura a SAP, transportes, ni ejecución en ambientes SAP. Esto DEBE reflejarse en `settings.json` (permissions explícitos). | Seguridad | PRD §6 P1, P3, P6 |
| NFR-07 | El proyecto DEBE versionarse con git; cada cambio a CLAUDE.md o a los sub-agentes DEBE ser trazable a un commit (gobernanza on-stack del Riesgo R4 del PRD). | Mantenibilidad | PRD Riesgo R4 |
| NFR-08 | El agente NO DEBE incluir secretos, credenciales, tokens, ni PII en ningún output, log o archivo del repositorio. | Seguridad | SECURITY-03 |

---

## 5. Cobertura de Casos de Uso (PRD §5)

| UC | Caso | Cobertura en Estación 4 |
|---|---|---|
| UC1 | Pipeline completo reporte Z (happy path) | ✅ Cobertura total — IS2–IS8 + template ALV IS11 |
| UC2 | FD incompleto: validación rechaza | ✅ Cobertura total — IS2 (validador) + reporte de gaps |
| UC3 | Código requiere iteración (ciclo de retroalimentación) | ✅ Cobertura total — FR-M3-08 + FR-M2-10 |
| UC4 | Validación de negocio BAdI / User Exit | ⚠️ Cobertura básica — M1/M2/M3 soportan BAdI a nivel genérico; template específico queda fuera (Q7:B). MVP usable con observaciones. |
| UC5 | Documentación técnica de objeto legado | ⚠️ Cobertura básica — M2 puede recibir código ABAP existente como input y generar TD, pero el flujo "pega código existente" requiere instrucción específica en el README. |

---

## 6. Trazabilidad PRD ↔ Requerimientos

| PRD MoSCoW | Cobertura en requirements.md |
|---|---|
| M1 (Validador FD) | FR-M1-01..08 |
| M2 (FD→TD) | FR-M2-01..10 |
| M3 (TD→Código) | FR-M3-01..12 |
| M4 (Configuración Base) | FR-M4-01..14 |
| M5 (Decisiones y Supuestos) | FR-M2-06, FR-M3-06, NFR-05 |
| M6 (⚠️ VERIFICAR en código) | FR-M3-04, FR-M3-05 |
| M7 (Entregable .abap) | FR-M3-07 |
| M8 (Configuración base CC) | IS1, IS14, IS15 |
| S1 (Templates por tipo) | Parcial — solo ALV (IS11) — Q7:B |
| S2 (Checklist auditoría) | IS12, FR-DOC-02, FR-M3-09 |
| S3 (Onboarding) | IS15 (README), FR-DOC-04 |
| C1–C4 | Fuera de alcance — OS4..OS6 |
| W1..W8 | Honrados como exclusiones — OS10 |

---

## 7. Compliance — Extensiones AI-DLC

### Security Baseline (Yes — Q9:A)

| Regla | Aplicabilidad en este proyecto | Cumplimiento previsto |
|---|---|---|
| SECURITY-01 (Encriptación en reposo y tránsito) | **N/A** — no hay data stores en este producto (es configuración de agente, no aplicación con persistencia) | N/A |
| SECURITY-02 (Access logging en intermediarios de red) | **N/A** — no hay load balancers, API gateways ni CDN | N/A |
| SECURITY-03 (Logging aplicacional) | **Aplicable parcialmente** — los outputs del agente son la "bitácora"; NFR-08 prohíbe PII/secretos en outputs y logs | Cumplido por NFR-08, FR-M3-11 |
| SECURITY-04 (Headers HTTP) | **N/A** — sin endpoints web | N/A |
| SECURITY-05..N | Por revisar al cargar reglas completas en stages siguientes | Pendiente |
| SECURITY-09 (SQL injection / SQL dinámico) | **Aplicable al código ABAP generado** | Cumplido por FR-M3-10, FR-M4-09 |
| SECURITY-10 (Control de autorización en accesos a datos sensibles) | **Aplicable al código ABAP generado** | Cumplido por FR-M3-05, FR-M4-10 |

> Nota: la mayoría de reglas de Security Baseline aplican a aplicaciones desplegadas (web, APIs, bases de datos). Este producto es **configuración de agente Claude Code**, no una aplicación tradicional desplegada. Las reglas relevantes son las que tocan **el código ABAP que el agente genera** (SQL safety, AUTHORITY-CHECK, no PII) y la **gobernanza del repositorio** (no secretos en archivos). Reglas restantes se marcarán N/A con justificación en cada stage completion.

### Property-Based Testing (No — Q10:C)

No se cargan reglas. Justificación: el producto no contiene lógica algorítmica, transformaciones de datos ni componentes stateful que se beneficien de PBT.

---

## 8. Resumen ejecutivo

> En esta Estación 4 construimos un **agente de Claude Code multi-componente** que implementa el pipeline FD → TD → ABAP del PRD v1.0, compuesto por tres sub-agentes (validador-fd, fd-a-td, td-a-codigo), tres slash commands atajo, un comando orquestador con gates humanos obligatorios, una plantilla genérica de FD, buenas prácticas SAP embebidas, un template específico para reporte ALV (UC1), un checklist de auditoría independiente y el diseño del plan de evaluación pre-piloto. **No se incluye** automatización por Anthropic API, templates para BAdI/formulario/conversión, ni la ejecución de la evaluación pre-piloto sobre FDs históricos. **Idioma**: español. **Estación 3**: se referencia pero no se copia. **Security Baseline**: enforced; **PBT**: skipped.

---

*Generado por AI-DLC Inception · Requirements Analysis · 2026-05-19*
