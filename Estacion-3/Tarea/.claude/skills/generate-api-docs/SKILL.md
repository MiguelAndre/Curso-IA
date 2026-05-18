---
name: generate-api-docs
description: Genera documentación técnica de interfaces ABAP — clases ZCL, métodos públicos, BAPIs custom, RFCs y BAdIs — en formato Markdown a partir del código fuente. Úsalo cuando se complete un objeto ABAP y se requiera documentación para consumidores (otros desarrolladores o equipos integradores).
---

# Skill: generate-api-docs

## Cuándo invocarla

- Al cerrar un requerimiento donde el objeto creado expone una interfaz pública (clase ZCL con métodos `PUBLIC`, función RFC, BAPI custom).
- En **UC5 — Documentación técnica de objeto ABAP legado** del PRD.
- Antes de transportar a calidad, para que el equipo receptor tenga referencia.

## Qué genera

Un archivo `docs/api/<nombre-objeto>.md` con la estructura siguiente:

```markdown
# <ZCL_NOMBRE> — API Reference

**Tipo:** Clase / Función / BAdI
**Paquete:** Z<paquete>
**Versión:** v<n>
**Última modificación:** <fecha>
**Requerimiento de origen:** REQ-YYYY-NNNN

## Propósito
<extraído del encabezado del .abap y la sección "Decisiones del código">

## Dependencias
- Tablas: <lista de TABLES leídas/escritas>
- Módulos de función: <lista de CALL FUNCTION>
- Objetos de autorización: <lista de AUTHORITY-CHECK>

## Métodos públicos

### `NOMBRE_METODO`

| Parámetro | Dirección | Tipo | Obligatorio | Descripción |
|---|---|---|---|---|
| IV_PARAM1 | IMPORTING | <tipo> | Sí | <descripción> |
| EV_RESULT | EXPORTING | <tipo> | — | <descripción> |
| ET_TABLE  | EXPORTING | <tipo> | — | <descripción> |

**Excepciones:**
- `ZCX_NOMBRE_EXCEPCION` — <cuándo se lanza>

**Ejemplo de uso:**

```abap
DATA(lo_obj) = NEW zcl_nombre( ).
TRY.
  lo_obj->metodo( EXPORTING iv_param1 = '...' IMPORTING ev_result = DATA(lv_r) ).
CATCH zcx_nombre_excepcion INTO DATA(lx).
  MESSAGE lx TYPE 'E'.
ENDTRY.
```

## Zonas de incertidumbre (`⚠️ VERIFICAR`)
<extraídas de los comentarios del .abap>
```

## Reglas

- **Solo lee código existente.** No modifica, no infiere comportamiento no documentado.
- Si el código no tiene comentarios de propósito, marca la sección con `<! falta descripción !>` y reporta al desarrollador.
- Preserva los `⚠️ VERIFICAR:` del Módulo 3 como advertencias visibles en la doc.
- No documenta métodos `PRIVATE` ni `PROTECTED` (ruido innecesario para consumidores).
- Si el objeto declara dependencias a tablas o módulos no estándar, las lista explícitamente.

## Alineación con el PRD

- **UC5** — Documentación técnica de objeto ABAP legado.
- **Principio #5** — Trazabilidad total: el TD y el código son trazables; la API también debe serlo.
- **Módulo 4** — Las APIs documentadas se vuelven parte de la base de conocimiento para futuras sesiones.
