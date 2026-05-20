# Application Design Plan — Agente IA para Desarrollo ABAP

**Fecha**: 2026-05-19
**Insumos**: `requirements.md` + `execution-plan.md` + PRD §9

---

## Pasos del plan

- [ ] Paso 1 — Recoger respuestas a las preguntas de diseño (abajo)
- [ ] Paso 2 — Generar `application-design/components.md` con los 5 componentes (M1, M2, M3, M4, Orquestador) y sus responsabilidades
- [ ] Paso 3 — Generar `application-design/component-methods.md` con contratos input/output de cada componente
- [ ] Paso 4 — Generar `application-design/services.md` con la orquestación del pipeline (`/pipeline-abap`)
- [ ] Paso 5 — Generar `application-design/component-dependency.md` con el grafo de dependencias y patrones de comunicación
- [ ] Paso 6 — Generar `application-design/application-design.md` consolidado
- [ ] Paso 7 — Presentar mensaje de completion y esperar aprobación

---

## Preguntas de diseño

El PRD §9 + `requirements.md` resuelven la mayoría del diseño. Quedan algunas decisiones específicas a Claude Code que necesitan tu confirmación.

### Question 1 — Implementación del orquestador `/pipeline-abap`
¿Cómo ejecuta el orquestador la cadena M1→M2→M3?

A) **Slash command que invoca sub-agentes con la tool `Agent`**: el orquestador es un comando con instrucciones tipo "lanza el sub-agente validador-fd con este FD, espera resultado, pregunta al usuario si aprobar, luego lanza fd-a-td, etc." Cada paso se ejecuta dentro de una sola sesión de Claude Code.
B) **Slash command que es una guía paso a paso para el usuario**: el orquestador muestra al desarrollador qué comandos ejecutar y en qué orden (`/validar-fd`, luego `/generar-td`, etc.), pero no invoca sub-agentes automáticamente. El usuario controla cada paso.
C) **Sub-agente orquestador en `.claude/agents/`**: un cuarto sub-agente que coordina a los otros tres con la tool `Agent`. El comando `/pipeline-abap` simplemente invoca este sub-agente.
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Formato de paso de información entre módulos
El TD generado por M2 es el input de M3. ¿Cómo se pasa esa información?

A) **Markdown estructurado**: M2 produce un archivo `td-<timestamp>.md` con secciones bien definidas (Tipo de objeto, Objetos SAP, Arquitectura, Campos, Decisiones y Supuestos). M3 lee ese archivo.
B) **Bloque inline en el chat**: M2 imprime el TD en su respuesta. El usuario copia/pega o el orquestador lo pasa directamente como prompt a M3.
C) **Ambos**: M2 produce el archivo y también lo imprime en el chat para revisión visual.
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 3 — Restricciones de permisos en settings.json
El Principio #1 del PRD dice "El agente no puede tener acceso de escritura a SAP". ¿Cómo lo materializamos en `settings.json`?

A) **Restrictivo por defecto, permitir solo lo necesario**: `Read`, `Glob`, `Grep`, `Write` (para los archivos `.abap` generados en el repo), `Edit`. Denegar explícitamente `Bash` (impedir invocaciones a CLI SAP, conexiones de red, etc.).
B) **Restrictivo extremo**: solo `Read` y `Write`. Sin `Bash`, sin `Grep`, sin red. El agente opera puramente sobre archivos locales.
C) **Permisivo con conciencia**: permitir todas las tools pero documentar en CLAUDE.md las restricciones operativas. Confiar en la disciplina del agente y la revisión del desarrollador.
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 4 — Ubicación del template ALV específico (Q7:B del cuestionario previo)
El template específico para reporte ALV — ¿cómo lo organizamos?

A) **Embebido en los sub-agentes M2 y M3**: cada sub-agente tiene una sección "Cuando el FD describe un reporte ALV, sigue este patrón…" dentro de su propio archivo de instrucciones.
B) **Archivo independiente referenciado**: un archivo `templates/template-alv.md` con el patrón completo (estructura de clase ZCL, métodos preferidos, ejemplos). Los sub-agentes M2/M3 lo referencian con `Lee `templates/template-alv.md` cuando detectes un reporte ALV`.
C) **Skill activable**: un skill `.claude/skills/template-alv/` con `SKILL.md` que se activa automáticamente cuando el contexto incluye "reporte ALV". Esto desacopla el template del agente y deja la puerta abierta para los templates futuros (BAdI, formulario, conversión).
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 5 — Persistencia de outputs intermedios
Cuando M2 produce un TD y M3 produce un `.abap`, ¿dónde los guardamos en el repositorio?

A) **Directorio fijo `outputs/<fecha>-<id-requerimiento>/`**: estructura predecible con TD.md, codigo.abap, decisiones.md por requerimiento. Ideal para trazabilidad histórica.
B) **El usuario decide caso por caso**: el agente solo muestra el output en el chat; el desarrollador lo guarda donde le convenga.
C) **Directorio `outputs/` plano con timestamps**: archivos sueltos con prefijos `td-YYYYMMDD-HHMM.md` y `codigo-YYYYMMDD-HHMM.abap`. Simple, sin organización por requerimiento.
X) Other (please describe after [Answer]: tag below)

[Answer]: A
