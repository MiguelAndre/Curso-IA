# ADR-001: Implementar el producto como configuración de Claude Code, no como aplicación tradicional

- **Status**: Accepted
- **Date**: 2026-05-19 (decidido en Application Design, ratificado en Build and Test)
- **Deciders**: equipo Estación 4 (1 arquitecto IA + lead técnico ABAP)
- **Consulted**: 3 desarrolladores ABAP (audiencia del piloto), patrocinador del mandato corporativo de IA
- **Stakeholders informados**: equipo de plataforma SAP, seguridad de la información

---

## 1. Contexto y problema

El PRD (`prd.md`) define un **Agente IA para Desarrollo ABAP** que asiste a 3 desarrolladores de un equipo bajo SAP S/4HANA Cloud (SAP Rise) con un pipeline FD → TD → Código ABAP, gobernado por 6 Principios No Negociables (PRD §6) — entre ellos: el desarrollador es garante final (P1), sin conexión a SAP (P3), sin modo autopilot (P6), trazabilidad total (P5).

El producto debe entregarse listo para piloto en **semanas, no meses**, sin infraestructura cloud dedicada, con un equipo pequeño (no hay equipo de plataforma IA), bajo un mandato corporativo de IA que requiere usar herramientas aprobadas.

**Pregunta arquitectónica**: ¿sobre qué stack se construye el agente?

---

## 2. Drivers de decisión

| # | Driver | Origen |
|---|---|---|
| D1 | Time-to-market: piloto operativo en semanas | PRD §10 (target piloto) |
| D2 | Equipo pequeño sin capacidad de mantener infraestructura | Realidad del cliente |
| D3 | Auditabilidad total — outputs revisables, sin "caja negra" | PRD §6 P5 |
| D4 | Sin conexión a SAP por diseño (defensa por ausencia) | PRD §6 P3 |
| D5 | Gates humanos obligatorios entre módulos | PRD §6 P6 |
| D6 | Versionado git nativo de todos los artefactos | PRD §Riesgo R4 |
| D7 | Mandato corporativo de IA — herramientas IA aprobadas | PRD §2.3 |
| D8 | Reversibilidad: si el piloto falla, no quedan activos huérfanos | Gestión de riesgo |

---

## 3. Opciones consideradas

### Opción A — Configuración de Claude Code (**elegida**)
El producto vive como archivos dentro de un directorio: `CLAUDE.md` (contexto permanente), `.claude/agents/*.md` (sub-agentes), `.claude/commands/*.md` (slash commands), `.claude/skills/*/SKILL.md` (skills activables), `.claude/settings.json`. El runtime es Claude Code (CLI/IDE).

### Opción B — Aplicación CLI/Web propia con Anthropic SDK
Backend en Python/Node consumiendo la Claude API, frontend mínimo (CLI o web). El equipo construye la orquestación, persistencia, autenticación, logging, deploy.

### Opción C — Plataforma de agentes externa (LangChain, AutoGen, Semantic Kernel)
Framework de orquestación de agentes con su propio runtime, configurado para Anthropic como proveedor.

---

## 4. Evaluación

| Criterio | A — Claude Code | B — App propia | C — Framework externo |
|---|:-:|:-:|:-:|
| Time-to-market (D1) | 🟢 Semanas | 🔴 Meses | 🟡 Semanas–meses |
| Sin infra dedicada (D2) | 🟢 Cero infra | 🔴 Requiere host + CI/CD | 🟡 Depende del framework |
| Auditabilidad (D3) | 🟢 Markdown en git | 🟡 Requiere construir capa de logs | 🟡 Depende de la observabilidad del framework |
| Defensa por ausencia (D4) | 🟢 Ambiente sin credenciales SAP | 🟡 Depende del despliegue | 🟡 Depende del despliegue |
| Gates humanos (D5) | 🟢 Nativos en el chat | 🔴 Hay que construirlos | 🟡 Patrón soportado pero no nativo |
| Versionado git (D6) | 🟢 Todo es markdown commiteado | 🟢 Código + prompts en git | 🟢 Código + configuración en git |
| Mandato corporativo (D7) | 🟢 Claude Code es la herramienta IA aprobada | 🟡 Requiere aprobación adicional de plataforma | 🟡 Requiere aprobación adicional |
| Reversibilidad (D8) | 🟢 Borrar el directorio | 🔴 Hay que desmantelar infra | 🔴 Hay que desmantelar |

**Leyenda**: 🟢 favorable · 🟡 aceptable · 🔴 desfavorable

---

## 5. Decisión

**Se adopta la Opción A**: el producto se implementa como **configuración de Claude Code**.

Los artefactos del producto son archivos markdown y JSON dentro del repositorio. El runtime es Claude Code (CLI/IDE) ejecutándose en la máquina del desarrollador. No hay servidor, no hay despliegue, no hay pipeline CI/CD para el agente mismo (sí lo habrá para el código ABAP que el agente produce, pero eso lo gestiona el desarrollador con su flujo SAP estándar).

---

## 6. Consecuencias

### Positivas

- **0 infraestructura propia**: no hay servidores, contenedores, bases de datos, ni colas de mensajes que mantener.
- **0 deployment**: el "deploy" es `git pull`. El "rollback" es `git checkout`.
- **Auditabilidad nativa**: todo el comportamiento del agente (prompts, principios, prohibiciones) vive en archivos versionados, revisables en code review.
- **Sub-agentes y skills son entidades de primera clase** del runtime (tool `Agent`, mecanismo de activación automática de skills). No hay que reimplementar orquestación.
- **Gates humanos son naturales**: el chat entre módulos del pipeline (`/pipeline-abap`) es el propio canal de aprobación.
- **Defensa por ausencia (D4) se materializa fácilmente**: al no haber código de runtime propio, basta con que el directorio del agente no contenga credenciales SAP — el Principio #3 se cumple por construcción del ambiente.
- **Encaja con mandato corporativo (D7)**: Claude Code es la herramienta IA aprobada para el equipo.

### Negativas / Trade-offs aceptados

- **Lock-in al producto Anthropic / Claude Code**: si Anthropic descontinúa la plataforma o cambia drásticamente la semántica de sub-agentes/skills/slash commands, hay reescritura. **Mitigación**: los prompts en sí (los markdown) son razonablemente portables — el lock-in es del runtime, no del know-how.
- **No hay fine-tuning del modelo**: se opera con el modelo Claude provisto. **Mitigación**: el dominio (generación de ABAP guiada por TD) no requiere fine-tuning para el alcance MVP; bastan prompts + skills.
- **Observabilidad limitada al runtime de Claude Code**: no podemos instrumentar métricas custom del agente más allá de lo que Claude Code reporte. **Mitigación**: las métricas operativas del piloto (horas activas, devoluciones, tasa de compilación) se llevan en un Excel manual (PRD §10), no en telemetría automática.
- **Modelo de seguridad declarativo, no enforced por código**: las prohibiciones del agente viven en `CLAUDE.md` §3, no en restricciones del settings. **Mitigación**: decisión AD3 + ausencia de credenciales SAP en el ambiente.

### Neutrales (observaciones sobre el modelado)

- **C4 Model nivel 3 (Component diagram) no aplica**: dentro de un container desplegable habría clases; en este producto los containers ya son archivos individuales. La decomposición útil termina en nivel 2 (ver `aidlc-docs/inception/application-design/c4-model.md`).
- **C4 Model nivel 4 (Code) no aplica**: el "código" del agente es prompt engineering en markdown, no estructura de clases/funciones.
- **El "build" es trivial**: cargar el directorio en Claude Code. No hay tests automatizados sobre el agente mismo (las pruebas funcionales se hacen sobre el código ABAP que produce, no sobre los prompts).

---

## 7. Cumplimiento con Principios No Negociables del PRD

| Principio | Cómo la decisión lo habilita |
|---|---|
| P1 — Desarrollador garante final | Sin pipeline automatizado posible; cada output es markdown auditable, no binario. |
| P2 — FD sin calidad no avanza | Sub-agente validador con output binario; el chat de Claude Code es el control. |
| P3 — Sin conexión a SAP | Ambiente sin credenciales SAP; Claude Code no tiene tools de red configuradas. |
| P4 — QA se conserva | El producto no toca el flujo de QA del cliente; entrega `.abap` para revisión humana. |
| P5 — Trazabilidad total | Markdown + git + secciones "Decisiones y Supuestos" obligatorias. |
| P6 — IA sugiere, humano ejecuta | Gates de chat entre módulos del orquestador `/pipeline-abap`. |

---

## 8. Decisiones derivadas (aguas abajo)

Esta ADR-001 es la decisión raíz. Las siguientes decisiones documentadas en `aidlc-docs/inception/application-design/application-design.md` §3 son **consecuencia directa**:

| ID | Decisión derivada | Por qué depende de ADR-001 |
|---|---|---|
| AD1 | Orquestador `/pipeline-abap` invoca sub-agentes con la tool `Agent` | La tool `Agent` solo existe porque el stack es Claude Code |
| AD2 | TD se persiste como archivo Y se imprime inline | Combinación de markdown en disco + render en chat — patrón nativo del stack |
| AD3 | Settings permisivo + restricciones operativas en CLAUDE.md | El modelo declarativo solo funciona porque CLAUDE.md es contexto permanente cargado automáticamente |
| AD4 | Template ALV como Skill activable | Las "skills" son una primitiva del stack Claude Code |
| AD5 | Outputs en `outputs/<fecha>-<id>/` | Convención de directorio aprovechando que el workspace del agente es un directorio plano |

---

## 9. Revisión y revocación

**Cuándo revisar esta decisión**:
- Si Anthropic descontinúa Claude Code o cambia la semántica de sub-agentes/skills.
- Si el piloto (post-Día 30 según `docs/plan-evaluacion.md`) muestra que el modelo de "configuración" no escala al volumen esperado de requerimientos.
- Si la empresa decide adoptar un stack IA corporativo distinto.

**Cómo revocar**: crear un nuevo ADR (`ADR-NNN`) con status `Accepted` que marque este como `Superseded by ADR-NNN`. Documentar el plan de migración de prompts.

---

## 10. Referencias

- **PRD**: `prd.md` (§2.3 mandato IA, §6 Principios, §9 arquitectura, §10 métricas)
- **Application Design**: `aidlc-docs/inception/application-design/application-design.md` (decisiones AD1-AD5 derivadas)
- **C4 Model**: `aidlc-docs/inception/application-design/c4-model.md` (representación visual de la opción A elegida)
- **Matriz NFRs**: `aidlc-docs/construction/U4/nfr-requirements/nfr-matrix.md` (cómo los atributos críticos se materializan en este stack)
- **State tracking AI-DLC**: `aidlc-docs/aidlc-state.md`
