# Estación 5 — Diseñando el CÓMO con AI-DLC (Construction)

> Tomar los 6 artefactos de Inception (Estación 4) y convertirlos en **código funcional + tests + deploy**, unidad por unidad. Es la fase Construction de AI-DLC.

> 📦 Mi entrega vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/). Esta carpeta `Estacion-5/` conserva solo el material didáctico.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Christian Braatz |
| Fase AI-DLC | Construction (Diseñar el CÓMO) |
| Modalidad | Autoestudio + runbook (no clase magistral nueva — continuidad de Estación 4) |
| Prerequisitos | 6 artefactos de Inception completos (Estación 4) |
| Commits relevantes | `2f55aff` · `58205cf` · `368ec96` |

---

## 2. Tema y objetivo de aprendizaje

Convertir las decisiones de Inception en software entregable, **unidad por unidad**, con un flujo secuencial que evita el "saltar a codificar". Cada actividad tiene una **regla de oro**: si no se cumple, el agente no avanza.

---

## 3. Conceptos clave

### 3.1 Las 5 actividades de Construction por unidad

| # | Actividad | Artefactos generados | Regla de oro |
|---|---|---|---|
| 01 | **Diseño funcional** | `domain-entities.md` · `business-rules.md` · `business-logic-model.md` | No generar código antes de aprobar el `business-logic-model.md`. |
| 02 | **NFR Requirements** | `nfr-requirements.md` | Cada NFR debe tener un valor numérico verificable. |
| 03 | **NFR Design (ADR)** | `nfr-design.md` con ADRs | Todo ADR declara ⚠️ en Consecuencias (los trade-offs aceptados). |
| 04 | **Infrastructure Design** | `infrastructure-design.md` · `deployment-architecture.md` | Todo componente del `application-design.md` debe aparecer en el diagrama. |
| 05 | **Code Generation + Tests** | Código fuente + suite de tests | Los tests de integración se trazan a escenarios Gherkin de `user-stories.md`. |

**Orden estricto**: Functional Design → NFR Requirements → NFR Design → Infrastructure Design → Code Generation → Tests. Saltar pasos rompe trazabilidad.

### 3.2 Conceptos DDD aplicados en Functional Design

- **Domain Entity**: objeto con identidad única que persiste (ej. `Operator`).
- **Value Object**: objeto sin identidad, definido por su valor (ej. `HashedPassword`, `JWTAccessToken`).
- **Aggregate**: grupo de entidades con una raíz que garantiza consistencia transaccional.
- **Business Rule**: regla numerada (`RULE-AUTH-01..N`) con condición, consecuencia y fuente en historias.
- **Business Logic Model**: flujos E2E (login, refresh, logout, change-password) con estados transicionales explícitos.

### 3.3 NFRs con valor numérico

No vale "rápido". Vale: *P95 < 500 ms en login* · *bcrypt factor 10* · *uptime 99.5%* · *UX hasta 30s sin feedback* · *escalabilidad +300% sin rediseño*.

### 3.4 ADR con ⚠️ en Consecuencias

Toda decisión arquitectónica tiene costo. Si el ADR no incluye al menos un ⚠️ en Consecuencias, está incompleto: significa que no se pensaron los trade-offs conscientemente.

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `estacion5-runbook.md` | 831 líneas, paso a paso. Actividad 0 (re-entrada al framework) + actividades 1–6 + checklists + recursos. |
| `estacion5-diseñando-el-como.pdf` | Slides de la sesión. |
| `Tarea/README.md` | Stub que redirige a [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/) como ubicación canónica. |

---

## 5. Proyecto de ejemplo (`agentic_interviewer_ai/`)

Referencia del instructor: EntreVista AI · **Unidad 1 `auth-lambda`** con Construction completa. Sirve para ver "cómo se ve bien" antes de hacerlo sobre tu producto.

| Artefacto | Qué muestra |
|---|---|
| `functional-design/domain-entities.md` | Entities (`Operator`, `RefreshToken`), Value Objects (`HashedPassword`, `JWTAccessToken`), Aggregates. |
| `functional-design/business-rules.md` | 6 reglas (`RULE-AUTH-01..06`) con condición · consecuencia · fuente. |
| `functional-design/business-logic-model.md` | 4 flujos E2E: Login · Refresh · Logout · ChangePassword. |
| `nfr-requirements/nfr-requirements.md` | 6 NFRs numéricos (P95 < 500ms · bcrypt 10 · 99.5% uptime · 30s UX · 1 componente impactado · +300% sin rediseño). |
| `nfr-design/nfr-design-patterns.md` | 3 ADRs: degraded mode Redis→MongoDB · JWT RS256 + Secrets Manager · rate limiting granular. |
| `infrastructure-design/infrastructure-design.md` | Mapa AWS: API Gateway, Lambda, MongoDB Atlas, Secrets Manager, VPC. |
| `infrastructure-design/deployment-architecture.md` | Diagrama Mermaid completo del despliegue. |

---

## 6. Mi entrega — Construction sobre el proyecto ABAP

La fase Construction se ejecutó dentro del proyecto en raíz, **no** en `Estacion-5/Tarea/`. Razón: Construction es parte integral del producto. Duplicarla abriría divergencia.

### 6.1 Mapa de entregables

`../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`:

| Unidad | Carpetas | Contenido principal |
|---|---|---|
| **U1** | `code/` | `U1-summary.md` — Configuración base: `CLAUDE.md`, `README.md`, `docs/formato-fd-generico.md`, `checklist-auditoria-codigo-ia.md`, `plan-evaluacion.md`, `.claude/settings.json`, `.gitignore`. |
| **U2** | `functional-design/`, `code/` | `domain-entities.md` + `business-rules.md` + `business-logic-model.md` + `U2-summary.md`. Genera el sub-agente `validador-fd` + slash command `/validar-fd`. |
| **U3** | `functional-design/`, `code/` | Análogo a U2 → sub-agente `fd-a-td` + `/generar-td`. |
| **U4** | `functional-design/`, `nfr-requirements/`, `nfr-design/`, `code/` | Único módulo con NFR Requirements y NFR Design (porque toca seguridad del código ABAP generado: SECURITY-03, -09, -10). 3 archivos NFR + `U4-summary.md`. Genera sub-agente `td-a-codigo` + `/generar-abap`. |
| **U5** | `code/` | Orquestador `/pipeline-abap` con gates humanos M1→M2→M3. |
| **U6** | `code/` | Skill `template-alv` para reportes ALV. |
| **plans/** | — | `U1..U6-code-generation-plan.md` + `U2..U4-functional-design-plan.md` + `U4-nfr-*-plan.md`. |
| **build-and-test/** | — | `build-instructions.md` + `unit-test-instructions.md` + `integration-test-instructions.md` + `security-test-instructions.md` + `build-and-test-summary.md` (53 verificaciones manuales documentadas). |

### 6.2 Decisiones clave de Construction

- **Infrastructure Design omitido** para U1, U2, U3, U5, U6: el producto vive dentro de Claude Code, sin infraestructura cloud propia.
- **NFR Requirements + NFR Design solo en U4** (el generador de código ABAP): es el único módulo que entrega artefactos que correrán en producción SAP, por lo que la matriz SECURITY-N aplica plena.
- **Build & Test con 53 verificaciones manuales**: el producto no tiene tests automatizados ejecutables (es configuración de Claude Code), así que la suite es un checklist humano riguroso documentado.

### 6.3 Cierre del workflow

`aidlc-state.md` registra el workflow **CERRADO** el 2026-05-20. CR-001 (Validador multi-formato) quedó abierto y se cerrará via la planning wave de Estación 7.

---

## 7. Lecciones / takeaways

1. **Especificación antes que código.** Los artefactos de Construction (domain model + NFRs + ADRs + infrastructure) **son** el producto. El código es consecuencia. Sin esa especificación, el agente genera código técnicamente correcto pero funcionalmente errado.

2. **ADRs con trade-offs explícitos.** Toda decisión arquitectónica tiene costo. La regla de "⚠️ en Consecuencias" obliga a pensar el trade-off; sin esa marca, el ADR esconde un supuesto no negociado.

3. **Trazabilidad total al dominio.** Business rules numeradas (`RULE-[ID]`) + tests mapeados a escenarios Gherkin de Inception garantizan que el código responde a requisitos reales, no a supuestos técnicos del desarrollador.

---

## Referencias rápidas

- Runbook completo: [`estacion5-runbook.md`](estacion5-runbook.md)
- Stub de Tarea: [`Tarea/README.md`](Tarea/README.md)
- Mi Construction: [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/construction/)
- Estado AI-DLC: [`../Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md`](../Agente-IA-Desarrollo-ABAP/aidlc-docs/aidlc-state.md)
- Sub-agentes resultantes: [`../Agente-IA-Desarrollo-ABAP/.claude/agents/`](../Agente-IA-Desarrollo-ABAP/.claude/agents/)
- Slash commands resultantes: [`../Agente-IA-Desarrollo-ABAP/.claude/commands/`](../Agente-IA-Desarrollo-ABAP/.claude/commands/)
