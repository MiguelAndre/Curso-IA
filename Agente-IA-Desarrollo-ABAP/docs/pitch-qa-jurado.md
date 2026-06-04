# 🎯 Hoja de respuestas para el jurado — Pitch 3 min

> Acompaña al pitch (`pitch-3min-slides.html`) y al guión de video (`pitch-3min-video-guion.md`).
> El pitch es el **trailer**; estas respuestas son **la película** que dejas lista para cuando pregunten.
> Regla: respuesta de **15–20 segundos**, dato concreto primero, contexto después. No te extiendas.

---

## 🔑 Tus 3 datos contundentes (memorízalos)

| Dato | Cifra | De dónde sale (evidencia real) |
|---|---|---|
| **Compresión del ciclo** | De **semanas → menos de 1 día** el borrador técnico + código | PRD §1 (visión) · meta del piloto |
| **QA corrió de verdad** | **22 de 23 escenarios en verde**, costo **$0** | Corrida real contra el modelo, 2026-06-01 (capsule `qa-llm-real-w1`) |
| **Consistencia del Validador** | **4/4 formatos APROBADO** (`.md`/`.txt`/`.pdf`/`.docx`) | Re-test CR-001, `outputs/dataset-cr-001/comparison.md` |

---

## ❓ Preguntas previsibles y cómo responderlas

### 1. "¿Cómo sabes que de verdad funciona y no es una demo de juguete?"
> Porque tiene **suite de QA ejecutable que corrió contra el modelo real**, no mockups: 22 de 23 escenarios en verde, costo cero. Y el Validador lo probé con el **mismo requerimiento en 4 formatos distintos** — dio el mismo veredicto en los 4. Eso es comportamiento consistente, no suerte.

### 2. "¿Cuánto cuesta operarlo?"
> **Costo marginal cero.** La empresa ya tiene licencia de Claude Code activa, así que el piloto no pide presupuesto nuevo. La inversión es tiempo de configuración, que ya está hecha.

### 3. "¿Y si la IA genera código malo y se va a producción?"
> **No puede, por diseño.** El desarrollador es el garante final: ningún código se transporta sin que él lo revise, pruebe y apruebe. El agente marca con `⚠️ VERIFICAR` cada zona donde no está 100% seguro, y entrega una sección *"Decisiones y Supuestos"*. Es lo contrario de una caja negra. Si falla dos veces el mismo error, **escala a desarrollo manual** — no insiste a ciegas.

### 4. "¿Esto reemplaza al desarrollador ABAP?"
> **No, y es deliberado.** Lo libera de escribir desde cero para que se enfoque en auditar, probar y garantizar calidad. La IA sugiere; el humano ejecuta. Siempre en ese orden.

### 5. "¿Se conecta a SAP? ¿Maneja credenciales o datos de producción?"
> **No, nunca.** Opera solo sobre archivos del repositorio, en ambiente de desarrollo. No pide ni almacena credenciales SAP, no toca producción. Cualquier interacción con SAP la hace el desarrollador a mano. Los outputs con info sensible ni siquiera se versionan.

### 6. "¿Solo hace ABAP clásico?"
> Genera **código SAP** según lo que pida el requerimiento: **ABAP, RAP y CAP.** El pipeline es el mismo; lo que cambia es el objeto técnico que produce el Módulo 3.

### 7. "Esa métrica de semanas a un día, ¿está validada en producción?"
> Seré honesto: es la **meta del piloto**, respaldada por el diseño y por la QA, no un promedio de producción todavía. Justamente por eso el siguiente paso es medir **horas reales de ajuste** sobre un ticket real. Prefiero un número que voy a comprobar esta semana que uno inflado.

### 8. "¿Por qué Claude Code y no GitHub Copilot o Amazon Q?"
> Copilot y Q aceleran **la escritura** — un 15–25% menos de tiempo de tecleo. Pero en este equipo escribir no es el cuello de botella: **el grueso del tiempo es espera y retrabajo por especificaciones malas.** Mi agente ataca eso: valida el documento en origen y produce el borrador completo, no solo autocompleta líneas.

### 9. "¿Cómo lo construiste exactamente?"
> Con **AI-DLC**, un método paso a paso, a lo largo de 9 estaciones: del PRD al diseño, a las unidades de trabajo, a los sub-agentes y el código. En cada etapa había una **compuerta de aprobación humana** — yo. La IA produjo; yo validé o devolví. Cuando un cambio rompía el alcance, abrí un *change request* y lo re-validé.

### 10. "¿Qué falta para llevarlo a producción?"
> Tres cosas concretas: correr el **piloto con tickets reales**, armar un **golden dataset anonimizado** de la empresa, y terminar la configuración del review automático de PRs en GitHub. Nada de eso es investigación — es ejecución.

---

## 🧯 Si te preguntan algo que no sabes
> *"No tengo ese dato a la mano; lo verifico y te lo confirmo."*
No inventes cifras. Un *"no sé, lo confirmo"* construye más credibilidad que un número fabricado.

---

## 🎤 Frases de cierre que puedes reutilizar
- *"El desarrollador deja de escribir desde cero y pasa a auditar."*
- *"La IA sugiere, el humano ejecuta. Siempre en ese orden."*
- *"Un caso real. Esta semana."*
