# Estación 3 — Ingeniería de Software Agéntica

> Pasar de copiloto (responde preguntas) a **agente autónomo** que entrega artefactos verificables. Configurar Claude Code / OpenCode / Antigravity como entornos productivos: permisos, hooks, MCPs, skills, sub-agentes y sesiones paralelas.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Carlos Alarcón |
| Duración | 2h teóricas + 2 workshops de 90 min cada uno (≈ 5h total) |
| Codelab | https://harcoreai.carlos-alarcon.com/ |
| Commits relevantes | `5d80969` (estación inicial) · `1a9c058` (configuración agente) · `b071d3c` (PRD copia) · `ad42fd0` (ejemplos end-to-end) |
| Prerequisitos | Git, Node.js 20+, Claude Code / OpenCode / Antigravity instalados, repo personal `agent-ready` |

---

## 2. Tema y objetivo de aprendizaje

**Pregunta central**: ¿Cómo se pasa de un copiloto que responde texto a un agente autónomo que entrega artefactos verificables?

**Respuesta operativa**: con **Context Engineering**. La regla 80/20: el 80% del resultado viene del entorno (CLAUDE.md, AGENTS.md, settings.json, hooks), no del prompt individual. Una sesión es efímera; el contexto persiste en el repo.

**Competencias esperadas al terminar**:

- Diferenciar copiloto (texto → texto) de agente autónomo (objetivo → diffs + artifacts).
- Configurar permisos `allow` / `deny` granulares.
- Implementar hooks PostToolUse deterministas.
- Crear sub-agentes especializados con rol, tools y modelo propios.
- Conectar 6 MCPs en una sesión Claude Code.
- Orquestar sesiones paralelas en Antigravity sin que se pisen.
- Hacer visible el bucle ReAct: pensar → planificar → ejecutar → observar → corregir.

---

## 3. Conceptos clave

| Concepto | Definición operativa |
|---|---|
| **Bucle ReAct** | Pensar → Planificar → Ejecutar → Observar → Corregir. El agente alterna entre razonamiento y acción hasta convergencia. Visible en Claude Code vía `Bash(git diff)` + introspección. |
| **Context Engineering vs Prompt Engineering** | PE optimiza cada prompt (~20% ROI). CE diseña el repo entorno: `CLAUDE.md` + `AGENTS.md` + hooks + permisos definen flujo permanente (~80% ROI). |
| **Hook determinista vs instrucción advisory** | Hooks (`.claude/hooks/PostToolUse`) ejecutan **código real** automáticamente (lint, tests, logging) tras cada acción del agente, sin pedir permiso. Advisory son frases en CLAUDE.md ("debería tener en cuenta") que el agente *interpreta* pero no garantiza. Hooks son garantía; advisory es recomendación. |
| **MCP (Model Context Protocol)** | Estándar abierto para conectar LLMs a sistemas externos sin cambiar prompts. En esta estación: 6 MCPs (GitHub, Context7, PostgreSQL, Vercel, Sequential Thinking, Excalidraw). |
| **Skill** | Unidad de trabajo versionable que encapsula un patrón recurrente (validación, auditoría, documentación). Residen en `.claude/skills/<nombre>/SKILL.md` con frontmatter (name, description, tools). No son prompts: son definiciones ejecutables con I/O clara. |
| **Sub-agente** | Agente especializado en una tarea (ej. `abap-code-reviewer` solo revisa, no edita) con modelo, tools y rol propios. Reside en `.claude/agents/<nombre>.md`. Permite paralelismo. |
| **Slash command** | Trigger en Claude Code / Cursor / Copilot que invoca skill o sub-agente. Sintaxis portable cross-IDE. |
| **Sesión paralela** | Dos agentes en el mismo repo pero ramas/workspace independientes (típicamente Antigravity). Agent A genera backend + tests, Agent B genera UI docs en paralelo. |
| **Artifact vs Commit** | Artifact = diff + plan visual (GitHub PR, Antigravity UI). Commit = cambio persistido. El nuevo modelo: **artifact es la unidad de revisión**, no el chat. |

---

## 4. Material del curso

### 4.1 `clase-3-estudiante.md`

Documento de 90 líneas, 5 bloques:

1. **Apertura** — transición de PRD/specs (Estación 2) a implementación agéntica.
2. **Fundamentos** — bucle ReAct, Context Engineering, hooks vs advisory.
3. **Claude Code** — settings, agents/, commands/, skills/, hooks PostToolUse.
4. **OpenCode + MCP** — 6 MCPs en vivo, equivalencias cross-tool.
5. **Antigravity + paralelismo** — 2 sesiones simultáneas, criterios de delegación.

Cierra con tabla de **6 artefactos a entregar**: AGENTS.md, CLAUDE.md, settings.json, hooks, opencode.json, skills×4, sub-agente, sesiones Antigravity.

### 4.2 `codelab_page/`

Punto de entrada al codelab navegable en https://harcoreai.carlos-alarcon.com/ — snippets, comandos y demos interactivas. El repo solo contiene el README pointer; el contenido vive en la web.

### 4.3 `workshops/workshop-1-agent-ready-repo/`

**Objetivo**: configurar tu repo personal como agent-ready en 90 minutos.

Estructura en 6 bloques secuenciales:

1. **Baseline**: prompt sin contexto (medir punto de partida).
2. Crear `AGENTS.md` con 5 secciones (negocio, arquitectura, convenciones, flujo agente, restricciones).
3. Crear `CLAUDE.md` específico de Claude Code.
4. Configurar `.claude/settings.json` con permisos `allow` / `deny`.
5. Añadir 1 hook (`post-edit-lint.sh` o `pre-tool-block.sh`).
6. **Revalidar**: mismo prompt del paso 1 — el agente ahora reconoce dominio, convenciones y sensibilidades.

> Crítica del instructor: *"No intentes hacer el AGENTS.md perfecto. La primera versión es 70% correcta. Lo iterás en las clases siguientes."*

### 4.4 `workshops/workshop-2-avanza-feature/`

**Objetivo**: implementar una feature real usando el agente del Workshop 1, aprendiendo delegación con criterio.

6 bloques:

1. Elegir feature pequeña (endpoint, componente, schema — **no** "módulo completo").
2. Planificar sin implementar; procesar el plan con criterio de riesgos.
3. Implementar con sub-agente (opción A: integrado `Plan`; opción B: custom `.claude/agents/feature-implementer.md`).
4. Sesión paralela en Antigravity (UI si backend, o tests si componente).
5. Revisión crítica con 4 preguntas: ¿sirve tal cual? ¿qué hizo bien? ¿qué mal? ¿ajuste manual o prompt mejorado?
6. Cierre con reflexión (`templates/reflection.md` → commit message extendido).

Lección de calibración: delegación del 70%, revisión manual del 30%. No repetir prompts: iterar criterio.

---

## 5. Mi entrega (`Tarea/`)

Acá fue donde nació la versión agent-ready del proyecto `Agente-IA-Desarrollo-ABAP`.

### 5.1 `AGENTS.md` (118 líneas)

Documento cross-tool para agentes (Claude, Copilot, Cursor):

1. **Identidad**: Agente IA para Desarrollo ABAP, stack Claude Code + ABAP S/4HANA, fase piloto.
2. **Qué hace**: pipeline FD validado → TD → Código ABAP (3 módulos + Módulo 4 de base).
3. **6 principios no negociables**: desarrollador es garante final · FD sin calidad no avanza · solo desarrollo · compuertas intactas · trazabilidad total · IA sugiere/humano ejecuta.
4. **Reglas para cualquier agente**: qué **debe** hacer (leer PRD + CLAUDE.md, marcar `⚠️ VERIFICAR`, documentar supuestos) y qué **no** (transportar automático, conexiones SAP con escritura, saltarse validación, `SELECT *`).
5. **Mapa de archivos**: prd.md, CLAUDE.md, .claude/settings.json, agents/, skills/, .mcp.json.
6. **KPIs del piloto**: ciclo 17 días → ≤ 5; tasa de compilación ≥ 80%; ajuste ≤ 2h.
7. **Cuándo escalar a humano**: > 2 ciclos sin convergencia, datos sensibles sin AUTHORITY-CHECK, referencias no verificables.

### 5.2 `CLAUDE.md` (157 líneas)

Instrucciones operativas específicas Claude Code:

1. **Rol**: especialista ABAP para SAP S/4HANA Cloud — generador de TD + código, no remplazo.
2. **Principios** (resumen de AGENTS.md §3).
3. **Estándares ABAP**: nomenclatura `ZCL_<MOD>_<FUN>`, patrones (ABAP OO, ALV `CL_SALV_TABLE`, `SELECT` específicos, `AUTHORITY-CHECK`, modularización, manejo de excepciones); prohibidos (`SELECT *`, SQL dinámico sin escape, RFC sin manejo, INSERT/UPDATE/DELETE directos).
4. **Formato institucional del FD**: 10 campos mínimos validables, rechazos automáticos por ambigüedad.
5. **Flujo operativo**: Paso 1 validar FD (skill `abap-fd-validator`) → Paso 2 generar TD → Paso 3 generar código → Paso 4 iterar con retroalimentación (límite 2 ciclos).
6. **Cuándo NO escribir**: violación de principios, nómina/RRHH sin AUTHORITY-CHECK, > 2 ciclos, acceso a tablas no verificables, intento de bypass.
7. **Estilo**: español, concisión, honestidad sobre incertidumbre, sin emojis salvo `⚠️ VERIFICAR`.
8. **Comandos permitidos**: git read-only (`status`, `diff`, `log`, `branch`, `show`); prohibidos `git push --force`, `rm -rf`, SSH.

### 5.3 `.mcp.json` — 6 servidores MCP

| MCP | Para qué |
|---|---|
| `filesystem` | Lectura/escritura de FD, TD, `.abap` en el directorio del piloto. |
| `github` | Issues, PRs, tracking de requerimientos. |
| `memory` | Persistencia entre sesiones (estándares ABAP, decisiones de TD). |
| `fetch` | Documentación pública SAP (help.sap.com, community.sap.com). |
| `sequential-thinking` | Razonamiento FD → TD paso a paso. |
| `context7` | Documentación actualizada SAP NetWeaver / S/4HANA Cloud SDK. |

### 5.4 `.claude/settings.json`

- `allow`: Read, Glob, Grep, Bash limitado (git read-only, ls, pwd, cat, echo, mkdir), WebFetch(sap.com).
- `deny`: `rm -rf`, `git push --force`, `git reset --hard`, `git checkout --`, `git clean -fd`, `git branch -D`, `sudo`, `curl/wget` a SAP, SSH, RFC/BAPI*COMMIT, transportes, Write(*.tr).
- `hooks PostToolUse`: trazabilidad automática — cada `Write`/`Edit` registra timestamp, tool y archivos en `.claude/logs/trazabilidad.log`.
- `env`: `ABAP_AGENT_PHASE=pilot`, `ABAP_AGENT_VERSION=1.0`, `ABAP_TRACE_ENABLED=true`.

### 5.5 `.claude/skills/` — 5 skills custom

| Skill | Para qué | Cuándo se activa |
|---|---|---|
| **`abap-fd-validator`** | Validación binaria APROBADO/RECHAZADO del FD (Módulo 1, compuerta no negociable). Rechaza automáticamente: "según necesidad", tipo de objeto faltante, campos sin tipo, acceso a datos sensibles sin AUTHORITY-CHECK, mención de transporte automático. | Siempre primero, antes de cualquier generación. |
| **`abap-object-templates`** | 5 templates de arquitectura ABAP por tipo (Reporte ALV, BAdI, User Exit, SmartForms, Conversión). Cada uno: arquitectura aprobada, objetos SAP típicos, antipatrones bloqueados, esqueleto TD. | Módulo 2 (FD→TD) y Módulo 3 (TD→Código). |
| **`generate-api-docs`** | Documenta clases ZCL, métodos, BAPIs, RFCs, BAdIs en `docs/api/<nombre>.md` con propósito, dependencias, métodos públicos, excepciones, ejemplos. Preserva las marcas `⚠️ VERIFICAR`. | Post-Módulo 3, antes de transportar. |
| **`review-pr`** | Auditoría de cambios a **configuración base** (CLAUDE.md, AGENTS.md, settings.json, skills, MCPs, PRD). No revisa código funcional. Verifica coherencia con PRD, seguridad de permisos, calidad de skills, MCPs sin escritura a SAP, impacto en KPIs. | PRs que toquen el Módulo 4. |
| **`ui-audit`** | Audita outputs ABAP: ALV (field catalog, columnas SCRTEXT, totales, layout), selection-screen (etiquetas, OBLIGATORY, rangos), SmartForms (layout, tipografía, saltos), mensajes (custom Z*, no hardcodeados). Críticos bloquean; menores requieren ajuste. | Post-Módulo 3, antes del syntax check. |

### 5.6 `.claude/agents/abap-code-reviewer.md`

Sub-agente especializado: modelo Sonnet, tools Read/Glob/Grep/Bash.

- **Rol**: revisor experto de código ABAP generado. **No edita, solo reporta.**
- **Checklist obligatorio (PRD §11.3)**:
  - **Críticos**: referencias reales (no alucinaciones de objetos Z*), AUTHORITY-CHECK presente, sin `SELECT *`, sin SQL dinámico inseguro, condiciones borde del FD, sin escritura a SAP estándar, sin lógica de transporte.
  - **Menores**: nomenclatura (`ZCL_`, `lv_`, etc.), ABAP OO, modularización, excepciones `ZCX_`, sin `MANDT` hardcodeado, comentarios `⚠️ VERIFICAR`.
  - **Observaciones**: sección "Decisiones del código", encabezado completo, performance.
- **Output**: reporte estructurado (críticos / menores / observaciones) + recomendación final: `LISTO PARA SYNTAX CHECK` | `RETRABAJAR EN MÓDULO 3` | `ESCALAR A MANUAL (>2 ciclos)`.

### 5.7 `examples/` — caso end-to-end real

Ejemplo trabajado completo del pipeline:

```
examples/
├── fd-retal-materiales.md           ← FD de reporte Z de retales de materiales
├── 01-validacion-fd-retal.md         ← output skill abap-fd-validator: APROBADO
├── 02-td-retal-materiales.md         ← TD generado por Módulo 2
├── 03-zmm_r_retal_prov.abap          ← código ABAP compilable (Módulo 3)
└── 04-revision-code-reviewer.md      ← reporte del sub-agente: críticos/menores + LISTO
```

---

## 6. Aporte al proyecto central

Esta estación creó la **matriz estándar** del agente. En el proyecto en raíz (`Agente-IA-Desarrollo-ABAP/`) algunos componentes evolucionaron:

| Componente Estación 3 | Evolución en proyecto central |
|---|---|
| `.claude/skills/abap-fd-validator/SKILL.md` | → integrado en el sub-agente `validador-fd.md` + slash command `/validar-fd`. |
| `.claude/skills/abap-object-templates/` | → la lógica vive ahora inline en `.claude/agents/td-a-codigo.md`; el patrón ALV se conserva como `.claude/skills/template-alv/`. |
| `.claude/skills/generate-api-docs/` | → fusionado en `.claude/commands/generar-abap.md`. |
| `.claude/skills/review-pr/` | → `.agents/skills/custom-codereview-guide.md` (Estación 7). |
| `.claude/skills/ui-audit/` | → no migró como skill independiente; el ALV se cubre con `template-alv` + checklist humano. |
| `.claude/agents/abap-code-reviewer.md` | → expandido y dividido en `validador-fd.md` + `fd-a-td.md` + `td-a-codigo.md`. |
| `.mcp.json` con 6 MCPs | → no presente en el proyecto central (decisión: simplificar para piloto). |
| `.claude/settings.json` con hooks | → conservado, simplificado en raíz. |

**Conclusión arquitectónica**: pasé de "componentes microservicio" (skills) a **agentes especializados monolíticos** (sub-agents + slash commands). Las skills quedaron solo donde había un patrón realmente reutilizable (ALV, code review guide).

---

## 7. Lecciones / takeaways

1. **El contexto pesa 4× más que el prompt.** Una `CLAUDE.md` bien escrita + hooks + permisos ahorra 10+ iteraciones de prompting. Invertir 2h en infraestructura compra 8h+ de calidad futura.

2. **Hooks son garantía; advisory es esperanza.** Instrucciones en CLAUDE.md se interpretan; hooks ejecutan código real automáticamente. Trazabilidad, lint y tests no negociables → hooks. "Debería considerar" → markdown.

3. **Sub-agentes + sesiones paralelas multiplican velocidad.** Mientras `abap-code-reviewer` audita, otro agente en Antigravity genera docs. Paralelismo no es "más agentes": es delegación con criterio sobre quién hace qué en qué rama.

4. **Artifact es la nueva unidad de revisión, no el chat.** El output no es "respuestas bonitas en conversación", sino diffs + plans visuales que se aprueban o rechazan. Cambio mental: de pair programming efímero a delegación asíncrona con artefactos auditables.

---

## Referencias rápidas

- Clase: [`clase-3-estudiante.md`](clase-3-estudiante.md)
- Workshop 1: [`workshops/workshop-1-agent-ready-repo/`](workshops/workshop-1-agent-ready-repo/)
- Workshop 2: [`workshops/workshop-2-avanza-feature/`](workshops/workshop-2-avanza-feature/)
- Codelab: https://harcoreai.carlos-alarcon.com/
- Mi AGENTS.md de la estación: [`Tarea/AGENTS.md`](Tarea/AGENTS.md)
- Mi CLAUDE.md de la estación: [`Tarea/CLAUDE.md`](Tarea/CLAUDE.md)
- Ejemplo end-to-end: [`Tarea/examples/`](Tarea/examples/)
- Proyecto central evolucionado: [`../Agente-IA-Desarrollo-ABAP/`](../Agente-IA-Desarrollo-ABAP/)
