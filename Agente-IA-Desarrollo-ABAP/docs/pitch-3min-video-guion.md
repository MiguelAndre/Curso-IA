# 🎬 Guión de video — Pitch 3 min (Agente IA para Desarrollo SAP)

> **Cómo usar este guión:** es para grabar en **una sola toma de ~3 minutos**.
> Columna izquierda = lo que VES en pantalla (slides + demo). Columna derecha = lo que DICES.
> El cronómetro es acumulado. Ensaya 2 veces leyendo en voz alta antes de grabar.

**Aclaración honesta:** este archivo es el *script*, no el video renderizado. Para producir el MP4 grabas tu pantalla siguiendo este guión. La parte de "proyecto funcionando" la cubre `demo-terminal.html` (demo animada y grabable — ver §Setup).

---

## 🎚️ Setup de grabación (antes de apretar REC)

1. Abre **`docs/pitch-3min-slides.html`** en el navegador → tecla `F` (pantalla completa). Slide 1 visible.
2. En otra pestaña/ventana, abre **`docs/demo-terminal.html`** (la demo del proyecto corriendo). Déjala lista en su pantalla inicial, sin darle play aún.
3. Software de captura: OBS Studio, Loom, o Xbox Game Bar (`Win+G`). Graba pantalla completa + micrófono.
4. Audio: ambiente silencioso, micrófono cerca. Habla ~140 palabras/min, con pausas.
5. Ten a mano `pitch-qa-jurado.md` por si grabas un bloque de preguntas al final.

---

## 🎬 Storyboard toma única

| ⏱ Tiempo | 📺 EN PANTALLA | 🎙️ NARRACIÓN (lees esto) |
|---|---|---|
| **0:00–0:30** | **Slide 1** (el dolor). Te quedas en este slide los 30 s. | "El negocio pide un cambio en el sistema de la empresa… y la respuesta de TI es: *listo, en unas semanas*. A veces meses. Son equipos pequeños con una cola de pedidos que no para de crecer. Y lo más frustrante: la mayor parte de ese tiempo **no es programar — es esperar en la fila y rehacer cosas que llegaron mal especificadas.** El negocio se queda esperando, y TI se queda quedando mal." |
| **0:30–0:38** | Avanzas a **Slide 2**. Lees el encabezado y el comando. | "Esto lo construí para resolverlo. **No lo explico, lo muestro.**" |
| **0:38–1:15** | **CAMBIA a la pestaña `demo-terminal.html`** y dale **play**. Se ve el comando escribirse y correr: M1 valida (APROBADO), M2 genera la spec, M3 genera código SAP. | "Escribo un comando y le paso el documento del consultor. Miren: **primero revisa que el documento esté bien** — si está incompleto, lo rechaza y dice por qué. *(pausa, aparece APROBADO)* Como está completo, **escribe la especificación técnica.** Y luego **genera el código SAP** — puede ser ABAP, RAP o CAP según el caso. Fíjense que cada salida trae *por qué tomó cada decisión* y marca con advertencia lo que no está seguro. **Nada de caja negra.**" |
| **1:15–2:00** | **Vuelves a los slides → Slide 3** (cómo con IA). | "¿Cómo lo hice? No fue magia, ni *dile a la IA que lo haga*. Seguí un método paso a paso, a lo largo de 9 estaciones. **La IA hizo el trabajo pesado**: los requisitos, el diseño, el código. **Pero en cada paso, el que aprobaba era yo.** Definí las reglas que la IA no puede romper —ella propone, yo decido, nunca al revés—. Y cuando algo se salía del plan, lo frenaba y lo rehacía. La clave no fue el prompt perfecto: fue **darle buen contexto y especificar antes de construir.**" |
| **2:00–2:30** | Avanzas a **Slide 4** (la métrica, en grande). | "¿Qué logré? **Un solo número:** lo que hoy toma **semanas, queda listo en menos de un día.** El borrador técnico y el código, en horas. El desarrollador ya no escribe desde cero: **revisa y aprueba.** Es pasar de *te lo entrego el mes que viene* a *te lo entrego esta semana*." |
| **2:30–3:00** | Avanzas a **Slide 5** (quién soy / qué sigue). Te quedas hasta el cierre. | "Soy Miguel Andrés Hernández, desarrollador en Manufacturas Eliot S.A.S. Esto no lo hice para una demo: lo hice para mi propio equipo. El siguiente paso es concreto: la próxima semana lo pruebo con **un pedido real de la cola** y mido una sola cosa — **cuántas horas me toma ajustar el código que generó.** Si es poco, entra al día a día del equipo. *(pausa)* **Un caso real. Esta semana.**" *(silencio 2 s, fin)* |

---

## 🎯 Marcas de dirección

- **Transición clave en 0:38:** practica el cambio slides → terminal sin titubear (`Alt+Tab` o dos ventanas lado a lado). Es el momento más frágil de la toma.
- **La demo (0:38–1:15)** es el corazón del video: deja que la animación respire, no hables encima de todo. Cuando aparezca **APROBADO** en verde, **haz una pausa de 1 segundo** — deja que el dato pegue solo.
- **Frase ancla (0:00):** *"no es programar — es esperar en la fila y rehacer."* Dila más lento que el resto.
- **Cierre (3:00):** *"Un caso real. Esta semana."* + silencio. No agregues "gracias" antes del corte; deja que cierre seco.

---

## 🔁 Plan B si la transición a la demo falla en vivo
Si grabas para un jurado en vivo y temes el cambio de ventana: incrusta un **screencast corto de `demo-terminal.html`** (grábalo aparte una vez) y reprodúcelo dentro del Slide 3 del deck `presentacion-demo.html`, o simplemente comparte la terminal animada ya en reproducción. Lo importante: que se **vea correr**, no que lo describas.

---

## ✅ Checklist antes de subir el video
- [ ] Dura entre **2:50 y 3:10** (si te pasas, recorta el bloque 3).
- [ ] La demo se ve **correr de verdad** (no es una captura estática).
- [ ] Se entiende el audio en la primera oración (prueba de la abuela).
- [ ] Aparece **una sola** métrica destacada (semanas → <1 día).
- [ ] Cierras con *"Un caso real. Esta semana."*
