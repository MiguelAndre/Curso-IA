# Nivelación — Fundamentos del curso Hardcore AI 30X

> Lectura previa autoestudio (≈ 135 páginas distribuidas en 6 PDFs). Establece el vocabulario, los modelos de referencia y las prácticas de ingeniería que se usan en las 7 estaciones siguientes.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Modalidad | Autoestudio previo al arranque del programa |
| Volumen | 6 PDFs · ~135 páginas combinadas |
| Prerequisitos | Ninguno técnico; familiaridad básica con desarrollo de software |
| Entregable | No hay entregable formal; el objetivo es vocabulario compartido y contexto |

---

## 2. Objetivo de aprendizaje

Llegar al primer día de clase con:

- Vocabulario de IA generativa interiorizado (tokens, LLM, RAG, fine-tuning, embeddings, multimodalidad).
- Mapa mental del estado del arte de agentes de código a abril 2026.
- Prácticas de ingeniería moderna (TDD, BDD, DDD, DevOps) frescas.
- Protocolo MCP y skills como mecanismos de modularidad.
- Arquitectura mínima viable para construir productos IA-nativos.

---

## 3. Material — los 6 PDFs

### 3.1 `Nivelación-1-Fundamentos-de-IA-generativa.pdf` (25 pp)

**Tema**: ecosistema de IA generativa.

- **Tokens** como unidad base: ~1 token ≈ 4 caracteres o 0.75 palabras en inglés. En código, espacios e indentación cuentan.
- **LLMs**: motores estadísticos que predicen el siguiente token. Parámetros actuales: de 7B a 1.8T. No "saben"; calculan probabilidades sobre patrones aprendidos en entrenamiento.
- **RAG** (Retrieval-Augmented Generation): inyectar datos externos sin reentrenar el modelo.
- **Fine-tuning**: especialización en dominio, estilo o formato. Puede reducir latencia y costo hasta 10×.
- **Destilación**: transferir capacidades de modelo grande a modelo pequeño/eficiente para edge u offline.
- **Modelos multimodales**: procesan texto, imagen, audio y video nativamente. Aplicación inmediata: frontend-as-a-service, debugging visual, lectura de PDFs sin OCR.

### 3.2 `Documento-2-Current-Landscape-El-Estado-del-Arte-de-los-Agentes-de-Código-(Abril-2026).pdf` (19 pp)

**Tema**: panorama de agentes de código en abril 2026.

- **Agentes como participantes autónomos del SDLC**: la IA pasó de autocompletado a orquestar y gestionar contexto. El cuello de botella se desplazó hacia validación de ideas y testing.
- **Modelos de referencia 2026**: Claude Opus 4.7 (rigor algorítmico, contexto 1M, visión 3×), GPT-5.4 (Tool Search reduce tokens 47%), Muse Spark (compresión de pensamiento, 17B parámetros activos pero más eficiente que predecesores 70B).
- **Harness Engineering**: disciplina nueva que separa orquestación (loop, permisos, contexto) del razonamiento (modelo). El arnés es donde se gana o se pierde la calidad.
- **MCP** como protocolo estándar para integración de tools.
- **Alerta de seguridad**: Claude Mythos Preview (capacidad de explotar 0-days autónomamente) fue retenido; Proyecto Glasswing como respuesta defensiva colaborativa.

### 3.3 `Documento1-Guía-de-Nivelación-Ingeniería-de-Software-Moderna.pdf` (39 pp)

**Tema**: prácticas esenciales de ingeniería de software que sustentan trabajo con IA.

- **TDD** (Test-Driven Development): ciclo Red-Green-Refactor. Test doubles (Dummy, Fake, Stub, Mock, Spy) para aislar dependencias. Beneficio primario: diseño desacoplado, no solo cobertura.
- **BDD** (Behavior-Driven Development): lenguaje Gherkin para especificar comportamiento. Colaboración "Tres Amigos" (dev + QA + PO) antes de codificar. Nivel aceptación, no unitario.
- **DDD** (Domain-Driven Design): Bounded Contexts, Ubiquitous Language, Aggregates, Value Objects, Domain Events. Separa lógica de negocio de infraestructura.
- **DevOps y CI/CD**: el sustrato sobre el que cualquier agente de código opera con garantías.
- **4 fases de madurez**: Fundamentos → Avanzado → Legado → Maestría.

### 3.4 `Documento3-AI-Native-Builder-Playbook.pdf` (17 pp)

**Tema**: guía operativa para construir productos E2E con IA.

- **Arquitectura mínima**: UX → Orquestación → Contexto (retrieval + memoria) → Modelo → Tools → Evals + Observabilidad → Seguridad.
- **Principio "software grueso, modelo delgado"**: lógica determinista (validaciones, cálculos, permisos) en código; el modelo se reserva para lenguaje, síntesis y decisiones bajo ambigüedad.
- **Loop agentic**: Plan → Act (con diffs manejables) → Check (tests, lint, build) → Fix. Requiere un "oracle" objetivo, no invención.
- **Skills como unidad de modularidad**: Modelo = CPU, Harness = OS, Skills = Apps. Versionables, componibles.
- Cubre evals, observabilidad (trazas, costo, latencia), rollout/resiliencia y seguridad (approvals humanos en zonas de alto riesgo).

### 3.5 `MCPsySkills.pdf` (32 pp)

**Tema**: Model Context Protocol y skills como módulos reutilizables.

- **MCP = protocolo JSON-RPC 2.0** que estandariza la comunicación entre hosts (Claude Code, Claude Desktop, Cursor) y servidores de herramientas. Equivalente a LSP, pero para agentes.
- **Arquitectura de 3 capas**: Host (sesión, múltiples clients, permisos) → MCP Client (1:1 con server) → MCP Server (expone Tools/Resources/Prompts, local o remoto).
- **Modelo de seguridad**: servers corren con los permisos del proceso, sin sandbox automático. Principio explícito de menor privilegio + human-in-the-loop por defecto.
- **Skills**: modularidad procedimental. Cada skill incluye README, `instruction.md`, `rubric.md`, ejemplos, prompts, scripts. Contrato mínimo: inputs, outputs, tools, criterios.

### 3.6 `mcp_skills_es.docx.pdf` (3 pp)

**Tema**: resumen ejecutivo en español de MCPs + skills. Útil como referencia rápida tras leer el documento largo.

---

## 4. Conexión con el resto del curso

| Tema de Nivelación | Aparece después en |
|---|---|
| JTBD, vision del producto | Estación 1 (PVB / ISB) |
| BDD Gherkin, claridad antes de estimar | Estación 2 (PRD) y Estación 4 (user stories) |
| DDD: bounded contexts, entities, value objects | Estación 4 (application-design) y Estación 5 (functional-design) |
| Harness engineering, MCP, skills | Estación 3 (configuración Claude Code) y Estación 6 (ficha de arnés) |
| Loop agentic plan-act-check-fix | Estación 3 (workshops) y Estación 7 (PR Evidence) |
| TDD Red-Green-Refactor, evals | Estación 5 (build & test) y Estación 7 (AI PR Review) |
| Observabilidad, audit trail | Estación 4 (AI-DLC audit.md) y Estación 7 (memory capsules) |

---

## 5. Vocabulario que un estudiante debe poseer al terminar

| Término | Definición operativa |
|---|---|
| **Foundation Model** | Modelo base masivo entrenado en datos generales; sirve para múltiples tareas downstream. |
| **LLM** | Modelo neural que predice el siguiente token a partir de un contexto. |
| **Token** | Unidad mínima de significado para un LLM; ~4 caracteres en inglés. |
| **Agente** | Sistema autónomo que planifica y ejecuta tareas, orquesta tools e itera hasta converger. |
| **Agentic Coding** | Modo de trabajo donde el dev actúa como tech lead: define plan, ejecuta agente, revisa diffs contra oracle. |
| **Context Engineering** | Diseñar qué información incluir, ordenar y actualizar en prompts para máxima relevancia y eficiencia. |
| **Harness** | Capa estable de orquestación (loop, permisos, reintentos) que envuelve un modelo. |
| **MCP** | Protocolo JSON-RPC para conectar hosts con servers de tools sin acoplar prompts a integraciones. |
| **Skill** | Módulo procedimental versionable (instrucciones + tools + criterios) reutilizable entre tareas. |
| **RAG** | Inyectar documentos externos en el contexto antes de generar. |
| **Fine-tuning** | Reentrenar modelo preentrenado con datos curados para especializar. |
| **Bounded Context** | Límite donde un modelo de dominio es válido (DDD). |
| **Ubiquitous Language** | Vocabulario compartido entre dev y experto de dominio; aparece literal en el código. |
| **TDD** | Test fallido → código mínimo → refactor. |
| **BDD / Gherkin** | Given–When–Then como contrato de comportamiento. |
| **Evals** | Golden set + rúbricas para medir calidad agentic (planning, tool selection, output format). |

---

## 6. Cómo aprovecharla bien

1. **No leer linealmente los 6**. Empezar por el de fundamentos, luego saltar al de skills/MCP (Documento3 + MCPsySkills), y dejar ingeniería moderna como repaso pasivo.
2. **Marcar los términos** que no se entiendan a la primera; aparecerán de nuevo en Estación 3 y Estación 6 con ejemplos vivos.
3. **No buscar dominio profundo** — buscar reconocimiento. Cuando un instructor diga "context engineering" o "MCP", debes saber a qué se refiere sin pausa.
