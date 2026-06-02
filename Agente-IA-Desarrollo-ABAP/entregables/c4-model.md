# C4 Model — Agente IA para Desarrollo ABAP

**Fecha**: 2026-05-20
**Versión**: 1.0
**Insumos**: `application-design.md`, `components.md`, PRD §6 (Principios No Negociables), `aidlc-state.md`
**Niveles incluidos**: 1 (System Context) y 2 (Containers)

> Notación: convenciones C4 de Simon Brown (https://c4model.com). Personas en azul oscuro, sistema en foco en azul medio, sistemas externos en gris, containers internos en azul claro. Flechas sólidas = flujo activo; flechas punteadas = carga de contexto / consulta / acción manual fuera del sistema.

---

## Nivel 1 — System Context

Muestra el agente como una caja negra y sus relaciones con personas y sistemas externos.

```mermaid
%%{init: {'theme':'default', 'themeVariables': {'background':'#FFFFFF', 'primaryTextColor':'#FFFFFF', 'lineColor':'#333333'}}}%%
flowchart TB
    CONS["👤 <b>Consultor Funcional</b><br/>[Person]<br/><br/>Redacta el FD<br/>según formato genérico"]
    DEV["👤 <b>Desarrollador ABAP</b><br/>[Person — 3 personas]<br/><br/>Audita y aprueba FD/TD/código<br/>Transporta a SAP manualmente"]

    SYS["🟦 <b>Agente IA para Desarrollo ABAP</b><br/>[Software System]<br/><br/>Pipeline FD → TD → Código ABAP<br/>con 3 gates humanos obligatorios<br/>Produce borradores técnicos auditables"]

    CC["⚙️ <b>Claude Code</b><br/>[External System]<br/><br/>Runtime CLI/IDE que aloja<br/>al agente como configuración"]
    API["🧠 <b>Anthropic API</b><br/>[External System]<br/><br/>Modelo Claude<br/>(razonamiento del agente)"]
    SAP["🏢 <b>SAP S/4HANA Cloud</b><br/>[External System]<br/><br/>Ambiente destino<br/>⚠️ SIN conexión directa (Principio #3)"]

    CONS -->|"entrega FD .md"| DEV
    DEV -->|"invoca slash commands<br/>/validar-fd · /generar-td<br/>/generar-abap · /pipeline-abap"| SYS
    SYS -->|"devuelve TD + .abap<br/>+ reportes de decisiones"| DEV
    DEV -.->|"importa manualmente<br/>en Eclipse/SE38"| SAP

    SYS -->|"ejecutado por"| CC
    CC -->|"infiere con LLM"| API

    style CONS fill:#08427B,stroke:#0B3D91,stroke-width:2px,color:#FFF
    style DEV fill:#08427B,stroke:#0B3D91,stroke-width:2px,color:#FFF
    style SYS fill:#1168BD,stroke:#0B4884,stroke-width:3px,color:#FFF
    style CC fill:#999999,stroke:#6B6B6B,stroke-width:2px,color:#FFF
    style API fill:#999999,stroke:#6B6B6B,stroke-width:2px,color:#FFF
    style SAP fill:#777777,stroke:#444444,stroke-width:2px,color:#FFF
```

**Lectura clave**:

- El sistema **no toca SAP**. La línea punteada `Desarrollador → SAP` representa transporte humano manual (Principio #3 del PRD: "El agente opera exclusivamente en el ambiente de desarrollo").
- El **Consultor Funcional** no interactúa directamente con el agente: entrega el FD al desarrollador, que lo carga al pipeline.
- **Claude Code** y **Anthropic API** son dependencias de runtime, no destino de outputs.

---

## Nivel 2 — Containers

Decompone el sistema en sus 6 containers lógicos dentro del repositorio.

```mermaid
%%{init: {'theme':'default', 'themeVariables': {'background':'#FFFFFF', 'primaryTextColor':'#FFFFFF', 'lineColor':'#333333', 'clusterBkg':'#F5F5F5', 'clusterBorder':'#1168BD'}}}%%
flowchart TB
    DEV["👤 <b>Desarrollador ABAP</b><br/>[Person]"]
    CC["⚙️ <b>Claude Code</b><br/>[Runtime]"]
    API["🧠 <b>Anthropic API</b><br/>[LLM]"]
    SAP["🏢 <b>SAP S/4HANA</b><br/>[Manual import]"]

    subgraph SYS["🟦 Agente IA para Desarrollo ABAP"]
        direction TB

        CFG["📄 <b>Configuración Base</b><br/>[CLAUDE.md + settings.json]<br/><br/>Rol, 6 Principios No Negociables,<br/>prohibiciones operativas,<br/>baseline de buenas prácticas SAP"]

        DOCS["📚 <b>Documentación de Referencia</b><br/>[docs/*.md]<br/><br/>formato-fd-generico<br/>checklist-auditoria-codigo-ia<br/>plan-evaluacion · README"]

        CMDS["⌨️ <b>Capa de Comandos</b><br/>[.claude/commands/]<br/><br/>/validar-fd · /generar-td<br/>/generar-abap (atajos)<br/>/pipeline-abap (orquestador)"]

        AGENTS["🤖 <b>Capa de Sub-agentes</b><br/>[.claude/agents/]<br/><br/>validador-fd (M1)<br/>fd-a-td (M2)<br/>td-a-codigo (M3)"]

        SKILL["🧩 <b>Skill Template ALV</b><br/>[.claude/skills/template-alv/]<br/><br/>Patrón 3 archivos REPORT+TOP+CLS<br/>clase local cl_&lt;verbo&gt;_&lt;sustantivo&gt;<br/>(activación automática)"]

        OUT["📂 <b>Almacén de Outputs</b><br/>[outputs/&lt;fecha&gt;-&lt;id&gt;/]<br/><br/>fd.md · validacion.md · td.md<br/>codigo-report.abap · codigo-top.abap · codigo-cls.abap<br/>(no versionado)"]
    end

    DEV -->|"1. invoca comando"| CMDS
    CMDS -->|"2. orquesta con tool Agent<br/>(gates humanos entre módulos)"| AGENTS
    AGENTS -.->|"cargan contexto<br/>permanente"| CFG
    AGENTS -.->|"consultan formato<br/>y checklist"| DOCS
    AGENTS -.->|"activan en contexto ALV"| SKILL
    AGENTS -->|"3. persisten<br/>TD y .abap"| OUT
    OUT -->|"4. entrega borrador"| DEV
    DEV -.->|"5. importa manualmente"| SAP

    SYS -->|"ejecuta sobre"| CC
    CC -->|"infiere con LLM"| API

    style DEV fill:#08427B,stroke:#0B3D91,stroke-width:2px,color:#FFF
    style SYS fill:#0E5DAA,stroke:#0B4884,stroke-width:3px,color:#FFF
    style CFG fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style DOCS fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style CMDS fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style AGENTS fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style SKILL fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style OUT fill:#438DD5,stroke:#2E6295,stroke-width:2px,color:#FFF
    style CC fill:#999999,stroke:#6B6B6B,stroke-width:2px,color:#FFF
    style API fill:#999999,stroke:#6B6B6B,stroke-width:2px,color:#FFF
    style SAP fill:#777777,stroke:#444444,stroke-width:2px,color:#FFF
```

**Lectura clave**:

- **6 containers** dentro del sistema. Las flechas sólidas son flujo activo; las punteadas son carga de contexto / consulta / acción manual.
- **`Configuración Base`** es el container más crítico — define los Principios No Negociables que constriñen a todos los sub-agentes (decisión AD3: `settings.json` permisivo + restricciones operativas en `CLAUDE.md`).
- **`Almacén de Outputs`** está dentro del system boundary pero `.gitignore`-d: contiene artefactos por requerimiento que pueden tener información sensible.
- Los pasos numerados (1→5) trazan el happy path del pipeline ejecutado vía `/pipeline-abap`.

---

## Mapeo containers ↔ componentes (`components.md`)

| Container del C4 | Componentes (`components.md`) |
|---|---|
| Configuración Base | C1 (CLAUDE.md), C11 (settings.json) |
| Documentación de Referencia | C7 (formato-fd), C8 (checklist), C9 (plan-evaluación), C10 (README) |
| Capa de Comandos | C5 (/pipeline-abap) + slash commands de C2, C3, C4 |
| Capa de Sub-agentes | C2 (validador-fd), C3 (fd-a-td), C4 (td-a-codigo) |
| Skill Template ALV | C6 |
| Almacén de Outputs | `outputs/<fecha>-<id>/` (generado en runtime) |

---

## Niveles 3 y 4 (no incluidos)

- **Nivel 3 (Component Diagram)**: no aplica directamente. Los "components" del C4 viven dentro de un container desplegable (p. ej., clases dentro de un servicio). En este producto, los containers ya son archivos individuales, por lo que la decomposición útil se detiene en Nivel 2. El detalle equivalente está en `components.md`.
- **Nivel 4 (Code)**: no aplica — el "código" del agente es prompt engineering en Markdown, no código ejecutable estructurable en clases/funciones.

---

## Cómo visualizar este archivo

- **VS Code**: instalá la extensión `Markdown Preview Mermaid Support` (autor `bierner`) → abrí este archivo → `Ctrl+K V` para preview lateral.
- **GitHub**: este archivo se renderiza nativamente al hacer push al repo.
- **Mermaid Live Editor**: copiá un bloque ` ```mermaid ` en https://mermaid.live para export a PNG/SVG.
