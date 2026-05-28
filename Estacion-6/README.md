# Estación 6 — Implementando (Scaffolding y mapa agencial)

> Cambio de zoom: AI-DLC ya entregó el contrato (Estaciones 4–5). Ahora se construye el **scaffolding operativo** alrededor de la implementación — arneses, modelos, proveedores de inferencia, skills de diseño, estándares visuales y orquestación general. Puente conceptual a Estación 7.

> 📦 Mi ficha de arnés vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md`](../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md).

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Leonardo González |
| Duración | ≈ 2 h |
| Modalidad | Live coding (skills + PRODUCT.md + DESIGN.md → slides HTML/PDF) + teoría comparada de arneses |
| Prerequisitos | PRD/ISB completo, artefactos Inception, especificación Construction mínima, repo o sandbox disponible |
| Commits relevantes | `368ec96` (amplía README con E6) · `1864805` (promueve proyecto + ficha de arnés) |

---

## 2. Tema y objetivo de aprendizaje

Preparar el repositorio para **ejecución agencial real**. La pregunta cambia de "qué construir" a "**cómo opera el agente cuando construye**". Cubre:

- Scaffolding operativo: arnés elegido, contexto del repo, permisos, validaciones, evidencia.
- Pila de diseño agencial: skills + `PRODUCT.md` + `DESIGN.md` + lint.
- Taxonomía operativa de modelos y arneses.
- Benchmarks (Terminal Bench, Artificial Analysis) como **señales parciales**, no verdad.
- Orquestación preliminar: alcance, contexto, dependencias, ejecución, evidencia.

---

## 3. Conceptos clave

### 3.1 Separación arnés / modelo / proveedor / API / superficie

| Capa | Qué es | Ejemplo |
|---|---|---|
| **Modelo** | Arquitectura de red + parámetros | Claude Opus 4.7, GPT-5.4 |
| **Proveedor** | Quién sirve la inferencia | Anthropic, OpenAI, AWS Bedrock |
| **API** | Contrato técnico (request/response HTTP) | `api.anthropic.com/v1/messages` |
| **Arnés** | Herramienta que envuelve el modelo, agrega tools, UI, contexto repo-local | Claude Code, OpenHands, Factory |
| **Superficie de trabajo** | Dónde corre el arnés | CLI, IDE, web, cloud |

> **Tesis del módulo**: la elección del arnés es tan crítica como la del modelo. El modelo sin arnés es un texto generator; el arnés con un modelo modesto puede superar a un modelo top con arnés débil.

### 3.2 Características de inferencia críticas para elegir

- **Ventana de contexto** (tokens).
- **Cache tokens** — reduce costo cuando se reutiliza contexto.
- **Multimodalidad** — imágenes, PDFs nativos, audio.
- **Tool calling** — read/write/bash/sub-agentes/MCP.
- **Latencia** y **costo operativo** por 1K tokens.

### 3.3 Benchmarks como señal, no verdad

- **Terminal Bench**: mide capacidad en tareas CLI (código, debugging, scripts). Señal de destreza técnica, **no** reemplaza pruebas en tu repo.
- **Artificial Analysis**: compara costo/latencia/calidad agregada entre proveedores. Útil para presupuesto, no predice comportamiento en un dominio específico.

### 3.4 La pila de diseño agencial

| Capa | Qué da al agente |
|---|---|
| **Skills** | Hábitos (accesibilidad, performance, anti-patrones). |
| **`PRODUCT.md`** | Criterio (audiencia, propósito, tono, contexto). |
| **`DESIGN.md`** | Memoria visual (tokens, roles, componentes, racional). |
| **Lint** (`npx @google/design.md lint DESIGN.md`) | Hace revisable el estándar. |

### 3.5 Skills mencionadas en el live coding

**Impeccable**, **Make Interfaces Feel Better**, **Web Design Guidelines**, **Userinterface Wiki**, **Accessibility / Best Practices / Core Web Vitals / Performance / SEO**, **React Best Practices**, **Imagegen** y el estándar **Google DESIGN.md**.

### 3.6 Taxonomía de arneses comparados

| Arnés | Foco | Característica diferencial |
|---|---|---|
| **Claude Code** | IDE local + CLI, contexto 1M, tool calling completo, permisos granulares. | El que uso en este proyecto. |
| **Codex** | API-oriented, stateless, restricciones operativas menores. | Para tareas más cortas o automatizadas. |
| **OpenHands** | Open-source, ejecución local, menos integración IDE. | Visibilidad total del loop. |
| **Factory** | Cloud-native, orquestación multi-task, visibilidad de reasoning. | Coordina varios agentes. |
| **OpenCode** | Modular, skills como plugins. | Composable. |
| **Antigravity 2** | Orientado a construcción de agentes, evaluación integrada. | Sesiones paralelas nativas. |
| **Pi** | Tablero/UI, baja complejidad técnica. | Onboarding sencillo. |

---

## 4. Material del curso

### 4.1 Estructura del módulo (5 bloques de ~20–25 min)

| # | Bloque | Foco |
|---|---|---|
| 1 | Scaffolding y diseño UX agencial | Live coding: skills + PRODUCT.md + DESIGN.md → slides HTML/PDF |
| 2 | Modelos, proveedores e inferencia | Separar modelo/proveedor/API/superficie; comparar contexto, cache, multimodalidad, tool calling |
| 3 | Benchmarks y señales de capacidad | Terminal Bench, Artificial Analysis como señales parciales |
| 4 | Arneses y agent labs | Ubicar Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2, Pi |
| 5 | Orquestación general | Alcance, contexto, dependencias, ejecución, evidencia (puente a Estación 7) |

### 4.2 Archivos

| Archivo | Contenido |
|---|---|
| `estacion6-runbook.md` | 7 pasos: slides → skills → arnés → modelos → contexto operativo → orquestación → entrega. |
| `design-standards-live-demo.md` | Guion del live coding: abrir PRODUCT/DESIGN, correr linter, prompt, observaciones, revisión, cierre. |
| `prompts.md` | Prompts para instalar skills de diseño + prompt de creación de PRODUCT/DESIGN. |
| `slides/estacion6-slides.md` | Storyboard Markdown que alimenta los slides generados en vivo. |
| `Tarea/README.md` | Stub que mapea el checklist Estación 6 contra el estado real del proyecto. |

### 4.3 Recursos externos

- Artículo: [Fixing Visual AI Slop](https://trilogyai.substack.com/p/fixing-visual-ai-slop)
- Demo site: [design.trilogyai.co](https://design.trilogyai.co/) — Repo: [trilogy-group/design](https://github.com/trilogy-group/design)
- Estándar: [Google DESIGN.md](https://github.com/google-labs-code/design.md)

---

## 5. Mi entrega — scaffolding del proyecto ABAP

Checklist de la estación vs. estado real del proyecto:

| Entregable pedido | Ubicación real | Estado |
|---|---|---|
| **Ficha del arnés y modelo(s)** | [`../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md`](../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md) | ✅ |
| **`AGENTS.md`** actualizado | [`../Agente-IA-Desarrollo-ABAP/AGENTS.md`](../Agente-IA-Desarrollo-ABAP/AGENTS.md) | ✅ |
| **`CLAUDE.md`** actualizado | [`../Agente-IA-Desarrollo-ABAP/CLAUDE.md`](../Agente-IA-Desarrollo-ABAP/CLAUDE.md) | ✅ |
| **`PRODUCT.md` y `DESIGN.md`** | N/A — producto sin UI propia | — |
| **Lista de validaciones disponibles** | §3 de la ficha de arnés | ✅ |

### 5.1 La ficha de arnés (resumen)

Una sola página con 4 secciones:

1. **Arnés y modelo**: Claude Code · Opus 4.x principal (Sonnet/Haiku alternativos) · Anthropic API · contexto 1M · multimodalidad + tool calling habilitados · idioma español.
2. **Permisos**: perfil `permissive` en `settings.json` + prohibiciones operativas no técnicas (sin SAP CLI, sin credenciales, sin RFC, sin autopilot).
3. **Validación**: sub-agentes (Validador M1), lint markdown, AI PR Review workflow, checklist humano, syntax check ABAP, pruebas unitarias/funcionales, branch protection.
4. **Evidencia**: `outputs/` (local), decisiones en docs, marcas `⚠️ VERIFICAR` en código, PR Evidence section, AI PR Review comments, memory capsules, audit trail AI-DLC.

### 5.2 Pila de diseño aplicada al proyecto

| Capa | En este producto |
|---|---|
| **Skills** | `.claude/skills/template-alv/` (reportes ALV) + `.agents/skills/custom-codereview-guide.md` (AI PR Review). |
| **`PRODUCT.md`** | Cubierto por `prd.md` — el PRD ya incluye personas, tono, propósito. |
| **`DESIGN.md`** | N/A (sin UI). |
| **Lint** | `.markdownlint-cli2.yaml` dentro de `aidlc-rules/`. |

---

## 6. Aporte al proyecto central

| Artefacto | Ubicación | Para qué sirve |
|---|---|---|
| **`AGENTS.md`** | `../Agente-IA-Desarrollo-ABAP/AGENTS.md` | Contrato neutral multi-tool. Cualquier arnés (Claude/Codex/OpenHands) lee este archivo al entrar al repo. |
| **`CLAUDE.md`** actualizado | `../Agente-IA-Desarrollo-ABAP/CLAUDE.md` | Configuración específica de Claude Code (roles, principios, prohibiciones, skills). |
| **Ficha de arnés** | `../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md` | Snapshot operacional: modelo, permisos, validaciones, evidencia. Se mantiene cuando cambia algo estructural. |

---

## 7. Lecciones / takeaways

1. **Arnés ≠ modelo.** La elección del contenedor (Claude Code) es tan crítica como la del modelo (Opus). El arnés provee contexto repo-local, permisos granulares y validación que ningún modelo solo puede garantizar.

2. **Scaffolding operativo precede a la implementación.** `AGENTS.md`, ficha de arnés y checklist de validaciones son planos antes que construcción. Sin ello, la ejecución es frágil: autopilot invisible, evidencia ausente, permisos no claros.

3. **Skills + memoria > prompts generales.** `PRODUCT.md` + `DESIGN.md` + skills especializadas producen outputs controlables y reproducibles. Sin memoria, cada interacción reinicia contexto y aumenta el sesgo hacia defaults genéricos.

---

## Referencias rápidas

- Runbook: [`estacion6-runbook.md`](estacion6-runbook.md)
- Live demo: [`design-standards-live-demo.md`](design-standards-live-demo.md)
- Prompts: [`prompts.md`](prompts.md)
- Slides storyboard: [`slides/estacion6-slides.md`](slides/estacion6-slides.md)
- Mi ficha de arnés: [`../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md`](../Agente-IA-Desarrollo-ABAP/docs/arnes/ficha-claude-code.md)
- Contrato del arnés: [`../Agente-IA-Desarrollo-ABAP/AGENTS.md`](../Agente-IA-Desarrollo-ABAP/AGENTS.md)
- Config Claude Code: [`../Agente-IA-Desarrollo-ABAP/CLAUDE.md`](../Agente-IA-Desarrollo-ABAP/CLAUDE.md)
