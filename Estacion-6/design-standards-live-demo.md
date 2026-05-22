# Live Demo: Design Standards and Skills en el repo C2

Esta demo abre Estación 6. Muestra cómo aplicar estándares y skills de diseño según el artículo "Fixing Visual AI Slop" dentro del repo real de Cohorte 2, y produce los slides HTML/PDF que se usarán durante el resto de la sesión.

La tesis que debe quedar clara:

- Las skills dan mejores hábitos al agente.
- `PRODUCT.md` le da criterio.
- `DESIGN.md` le da memoria visual.
- El lint hace revisable el estándar.
- El resultado debe sentirse parte de Hardcore AI.

## 1. Abrir con el problema

Mostrar una frase corta:

```text
Necesito crear slides y material de estación. Un prompt vago produce defaults genéricos. Memoria visual y skills hacen el resultado más controlable.
```

## 2. Mostrar el contexto canónico

Archivos a abrir:

- `PRODUCT.md`
- `DESIGN.md`
- `c2/Estación 6/README.md`
- `c2/Estación 6/slides/estacion6-slides.md`

Qué decir:

- `PRODUCT.md` explica audiencia, tono y propósito.
- `DESIGN.md` define tokens, layout, componentes y anti-patrones.
- La estación usa esos archivos como decisiones verificables.

## 3. Ejecutar el linter de DESIGN.md

```sh
npx @google/design.md lint DESIGN.md
```

Qué explicar:

- El linter revisa estructura, referencias rotas y problemas de contraste.
- Su valor está en volver revisable una decisión visual.

## 4. Prompt de live coding

Usar este prompt sobre el repo:

```text
Usa PRODUCT.md y DESIGN.md como contexto canónico.

Quiero convertir c2/Estación 6/slides/estacion6-slides.md en una presentación HTML y luego renderizarla a PDF.

Requisitos:
- Lee PRODUCT.md y DESIGN.md antes de diseñar.
- Usa el storyboard Markdown como fuente de contenido.
- Crea un HTML autosuficiente para presentar en clase.
- Aplica la paleta, tipografía, jerarquía, footer y progreso definidos en DESIGN.md.
- Mantén un concepto principal por slide.
- Marca los slides de demo con `SIGUE DEMO:`.
- Evita patrones genéricos de AI slop: gradientes morados, glass panels, cards decorativas, hero vacío, métricas ornamentales.
- Renderiza el HTML a PDF.

Devuelve:
1. Archivos creados o modificados.
2. Decisiones de diseño tomadas.
3. Evidencia de render.
4. Riesgos de legibilidad o contraste, si aparecen.
```

## 5. Qué observar durante la demo

Mientras el agente trabaja, narrar:

- Qué archivos decide leer.
- Si respeta `PRODUCT.md` y `DESIGN.md`.
- Estilos fuera del sistema.
- Si mejora claridad o solo agrega decoración.
- Si puede justificar decisiones con el estándar.

## 6. Revisión en vivo

Preguntas de revisión:

- ¿El slide sigue teniendo un solo concepto?
- ¿El lima funciona como señal?
- ¿Hay una ruta clara para el participante?
- ¿El contenido suena a instructor senior o a brochure?
- ¿La demo está marcada como demo?
- ¿El material puede ser entendido por alguien externo a la conversación?

## 7. Cierre de la demo

Cerrar con esta idea:

```text
El repo ahora contiene memoria, hábitos y checks. Usamos este deck para seguir la sesión desde el mismo estándar que acabamos de aplicar.
```

## 8. Extensión para estudiantes

Pedirles que apliquen el mismo flujo a su repo:

1. Crear o revisar `PRODUCT.md`.
2. Crear o revisar `DESIGN.md`.
3. Instalar o documentar skills de diseño en su arnés.
4. Pedir una revisión de una pantalla, slide o componente.
5. Exigir evidencia: decisiones, checks y cambios.
