# Estación 6: Implementando

**Hardcore AI | 30X · Agentic Engineering más allá de AI-DLC**

**Instructor principal:** Leonardo González  
**Duración sugerida:** 2h  
**Foco:** Scaffolding: 15-20 min de diseño UX agencial (skills, herramientas y estándares emergentes).  
Taxonomía de modelos y arneses.  
Marcos de evaluación de capacidades como Terminal Bench y Artificial Analysis, proveedores de inferencia y orquestación general: alcance, contexto y ejecución.

Esta estación usa lo que ya produjiste en AI-DLC como contrato de entrada y cambia el nivel de zoom. La sesión abre con un live coding para producir los slides HTML/PDF desde `PRODUCT.md`, `DESIGN.md` y el storyboard Markdown. Ese material acompaña el resto de la clase mientras miramos el sistema completo de ejecución: contexto, estándares, skills, modelos, arneses, alcance y orquestación.

La implementación con AI-DLC queda como ejercicio de aplicación. Aquí sales con criterio, herramientas y artefactos portables para ejecutar esa implementación en Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2, Pi u otro arnés.

## Qué hay en esta carpeta

| Archivo | Qué es | Para qué lo necesitas |
| :--- | :--- | :--- |
| `README.md` | Guía general de la estación | Entender objetivo, estructura, prerequisitos y tarea |
| `estacion6-runbook.md` | Runbook de trabajo | Preparar tu repo para ejecución con agentes |
| `design-standards-live-demo.md` | Guion de live coding | Crear slides HTML/PDF aplicando `PRODUCT.md` y `DESIGN.md` |
| `prompts.md` | Prompts de diseño | Instalar skills y crear `PRODUCT.md` / `DESIGN.md` |
| `slides/estacion6-slides.md` | Storyboard de slides | Base sencilla para convertir la clase en HTML y PDF |

## De dónde venimos

Antes de esta estación deberías tener, como mínimo:

- PRD o Internal Solution Brief completo.
- Artefactos de Inception de AI-DLC.
- Al menos una unidad o conjunto de tareas priorizadas.
- Algún diseño de Construction o suficiente especificación para empezar a implementar.
- Un repo o sandbox donde puedas probar el flujo.

Puedes seguir la clase con artefactos incompletos. La tarea rinde más cuando trabajas sobre un caso propio con spec real.

## Qué vas a aprender

- Preparar scaffolding de implementación: contexto operativo, arnés, permisos, validación y evidencia.
- Instalar y usar estándares y skills de diseño según el artículo "Fixing Visual AI Slop".
- Crear `PRODUCT.md` y `DESIGN.md` como artefactos canónicos de producto y diseño.
- Entender la taxonomía entre model labs, proveedores de inferencia, agent labs, arneses y orquestadores.
- Leer benchmarks y reportes como Terminal Bench y Artificial Analysis como señales de capacidades, costo y comportamiento.
- Reconocer características de inferencia: contexto, cache tokens, multimodalidad, tool calling, latencia y costo operativo.
- Ubicar Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2 y Pi dentro de un mapa de arneses y superficies de trabajo.
- Razonar sobre orquestación desde alcance, contexto, dependencias, ejecución y evidencia.

## Estructura del módulo

### 1. Demo inicial: scaffolding y diseño UX agencial

**Duración:** 25 min  
**Takeaways:**

- Instalar skills de diseño y entender su rol operativo.
- Crear o revisar `PRODUCT.md` y `DESIGN.md` como memoria del producto.
- Usar el storyboard Markdown como fuente para generar slides HTML/PDF.
- Usar los slides producidos en vivo durante el resto de la sesión.

### 2. Modelos, proveedores e inferencia

**Duración:** 20 min  
**Takeaways:**

- Separar modelo, proveedor de inferencia, API y superficie de trabajo.
- Comparar características como ventana de contexto, costo, cache, multimodalidad y tool calling.
- Entender cómo estas características afectan ejecución con agentes.

### 3. Benchmarks y señales de capacidad

**Duración:** 15 min  
**Takeaways:**

- Usar Terminal Bench y Artificial Analysis como referencias para calibrar expectativas.
- Leer benchmarks como señales parciales, conectadas a tareas, costo y condiciones de evaluación.
- Relacionar resultados de benchmark con riesgos prácticos durante implementación.

### 4. Arneses y agent labs

**Duración:** 25 min  
**Takeaways:**

- Diferenciar arneses locales, cloud, open-source y orientados a tablero.
- Ubicar Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2 y Pi por características observables.
- Identificar capacidades mínimas de un arnés productivo: tools, contexto repo-local, permisos, validación, observabilidad y evidencia.

### 5. Orquestación general

**Duración:** 25 min  
**Takeaways:**

- Entender orquestación como coordinación de alcance, contexto, dependencias, ejecución y evidencia.
- Separar trabajo individual del agente, gestión de tareas y coordinación multi-agente.
- Preparar el puente conceptual hacia Estación 7, donde la orquestación se vuelve trabajo concreto.

## Tarea

Prepara scaffolding operativo para tu producto o sandbox:

1. Una ficha breve del arnés y modelo(s) que usarás, con sus características relevantes para tu repo.
2. Un `AGENTS.md` o equivalente en tu arnés.
3. Un `PRODUCT.md` y `DESIGN.md` si tu producto tiene interfaz, slides o material visual.
4. Una lista de validaciones disponibles: tests, lint, build, demo o revisión manual.

La entrega debe mejorar el terreno operativo donde después ejecutarás tareas con arneses y orquestadores.

## Recursos

- Artículo: [Fixing Visual AI Slop](https://trilogyai.substack.com/p/fixing-visual-ai-slop)
- Demo site: [design.trilogyai.co](https://design.trilogyai.co/)
- Repo del demo: [trilogy-group/design](https://github.com/trilogy-group/design)
- Estándar: [Google DESIGN.md](https://github.com/google-labs-code/design.md)
- Referencia local: `PRODUCT.md` y `DESIGN.md` en la raíz de este workspace.
