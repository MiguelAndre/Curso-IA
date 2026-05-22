# Runbook Estudiante: Estación 6

**Implementando · Scaffolding y mapa agencial**

Este runbook trabaja el contexto operativo que rodea la implementación: arneses, modelos, proveedores de inferencia, skills, estándares de diseño y orquestación general. Estación 7 retomará los artefactos AI-DLC para convertirlos en trabajo concreto.

## Resultado esperado

Al terminar, tendrás scaffolding operativo para tu repo:

- Arnés elegido y características relevantes.
- Contexto operativo del repo.
- `AGENTS.md`, `CLAUDE.md` o equivalente.
- Skill de proyecto o instrucción reusable.
- `PRODUCT.md` y `DESIGN.md` si hay interfaz, slides o material visual.
- Validaciones disponibles.
- Nota sobre orquestación futura.

## 1. Abre con live coding de slides

La clase empieza produciendo los slides que se usarán durante la sesión.

Flujo:

1. Copia `PRODUCT.md` y `DESIGN.md` al repo de trabajo.
2. Usa `slides/estacion6-slides.md` como storyboard.
3. Ejecuta el prompt de `design-standards-live-demo.md`.
4. Genera slides HTML con el sistema visual.
5. Renderiza el HTML a PDF.
6. Revisa legibilidad, jerarquía, contraste y coherencia con `DESIGN.md`.

Este live coding presenta las skills de diseño en acción y deja material usable para el resto de la estación.

## 2. Instala skills y crea memoria de diseño

Usa `prompts.md` para instalar las skills de diseño y crear `PRODUCT.md` / `DESIGN.md` cuando tu producto tenga interfaz, slides o material visual.

La regla práctica:

- Skills dan hábitos: accesibilidad, performance, craft, anti-patrones, revisión.
- `PRODUCT.md` da criterio: audiencia, propósito, tono y contexto.
- `DESIGN.md` da memoria: tokens, roles visuales, componentes, racional.
- Linting hace revisable el estándar: `npx @google/design.md lint DESIGN.md`.

Para este repo, el `DESIGN.md` canónico vive en la raíz del workspace. Cuando generes slides, guías o UI para estaciones, úsalo como fuente de verdad.

## 3. Registra características del arnés

Describe el arnés que usarás para una primera ejecución:

| Característica | Pregunta guía |
| :--- | :--- |
| Superficie | ¿CLI, IDE, web, cloud, local, remoto? |
| Modelo | ¿Permite elegir modelo o proveedor? |
| Contexto | ¿Qué archivos, docs y memoria puede leer? |
| Ejecución | ¿Puede editar, correr comandos, abrir navegador, crear ramas? |
| Permisos | ¿Cómo se aprueban acciones sensibles? |
| Validación | ¿Cómo corre tests, lint, build o revisión visual? |
| Evidencia | ¿Cómo reporta cambios, resultados y bloqueos? |

Menciones útiles para ubicar el mapa: Claude Code, Codex, OpenHands, Factory, OpenCode, Antigravity 2 y Pi.

## 4. Lee modelos y proveedores con criterio operativo

Antes de ejecutar, registra las características de inferencia que importan para tu trabajo:

- Ventana de contexto.
- Cache tokens.
- Multimodalidad.
- Tool calling.
- Latencia.
- Costo operativo.
- Calidad esperada en código, razonamiento y seguimiento de instrucciones.

Terminal Bench y Artificial Analysis ayudan a calibrar expectativas sobre capacidades, costo y comportamiento. Úsalos como señales de contexto, junto con pruebas reales sobre tu repo.

## 5. Crea contexto operativo del repo

Tu `AGENTS.md` o equivalente debe cubrir:

- Propósito del repo.
- Stack y comandos.
- Dónde viven specs, código, tests y docs.
- Reglas de edición.
- Comandos obligatorios antes de entregar.
- Cómo reportar evidencia.
- Qué archivos o áreas requieren permiso explícito.
- Cómo usar `PRODUCT.md` y `DESIGN.md` si hay interfaz o material visual.

## 6. Define orquestación desde alcance, contexto y ejecución

La orquestación aparece cuando coordinas más que una conversación:

- Varias tareas con dependencias.
- Varias ramas o agentes.
- Validaciones que bloquean avance.
- Handoffs entre herramientas.
- Evidencia que debe quedar trazable.

Para esta estación, registra:

1. Qué arnés usarías para ejecutar una tarea.
2. Qué información debe leer el agente.
3. Qué permisos tendría.
4. Qué validación bloquearía entrega.
5. Qué evidencia debe devolver.
6. Qué parte estudiarías para orquestación posterior.

## 7. Checklist de entrega

Entrega:

- [ ] Ficha de arnés y modelo(s) con características relevantes.
- [ ] `AGENTS.md`, `CLAUDE.md` o equivalente actualizado.
- [ ] `PRODUCT.md` y `DESIGN.md` si hay UI, slides o material visual.
- [ ] Validaciones disponibles y evidencia esperada.

Una buena entrega mejora el punto de partida de la implementación.
