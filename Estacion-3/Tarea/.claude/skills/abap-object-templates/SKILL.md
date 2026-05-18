---
name: abap-object-templates
description: Templates de prompts optimizados por tipo de objeto ABAP — Reporte Z (ALV), BAdI, User Exit, Formulario (SmartForms/Adobe), Conversión (LSMW/CG3Y). Úsalo en el Módulo 2 (FD→TD) y Módulo 3 (TD→Código) para arrancar cada generación con la arquitectura aprobada y los antipatrones ya bloqueados. Implementa el S1 del MoSCoW del PRD.
---

# Skill: abap-object-templates

> Implementa **S1 del MoSCoW** (PRD §8): *Templates de prompt por tipo de objeto*.
> Reduce ciclos de retroalimentación al arrancar cada generación con la arquitectura correcta de entrada.

## Cuándo invocarla

Al inicio del **Módulo 2** (cuando el Validador detecta el tipo de objeto) o del **Módulo 3** (cuando se genera código desde el TD). Cada template:

1. Lista la **arquitectura típica aprobada** para ese tipo de objeto.
2. Declara **antipatrones específicos** que el agente NO debe producir.
3. Da una **estructura inicial** de TD y código.
4. Lista los **objetos SAP comunes** que el agente debe esperar usar.

---

## Template 1 — Reporte Z (ALV)

### Arquitectura aprobada

```
ZxxN_R_<propósito> (Programa ejecutable Z)
│
├── Selection-screen (bloques con BLOCK ... WITH FRAME)
│
└── ZCL_<MOD>_<PROPÓSITO> (clase principal local)
      ├── execute            (público, orquesta)
      ├── validar_input      (privado, valida + AUTHORITY-CHECK)
      ├── obtener_datos      (privado, SELECT con JOINs)
      ├── enriquecer         (privado, lookups por bloque)
      └── mostrar_alv        (privado, CL_SALV_TABLE)
```

### Objetos SAP típicos

- `CL_SALV_TABLE` para presentación.
- `CL_SALV_AGGREGATIONS` para totales.
- `CL_SALV_SORTS` para orden default.
- `CL_SALV_LAYOUT` para layout variant.

### Antipatrones bloqueados

- ❌ `REUSE_ALV_GRID_DISPLAY` (legacy — usar `CL_SALV_TABLE`).
- ❌ `SELECT *`.
- ❌ Lookup de descripciones dentro del LOOP de la tabla principal (N+1 queries). Usar `FOR ALL ENTRIES` o JOIN.
- ❌ ALV sin field catalog explícito ni textos custom.
- ❌ Selection-screen sin `OBLIGATORY` donde el FD lo declara.

### Esqueleto de TD

```markdown
## Arquitectura técnica
- Programa Z<MOD>_R_<propósito>
- Clase principal ZCL_<MOD>_<propósito> con métodos: execute, validar_input, obtener_datos, enriquecer, mostrar_alv
- ALV con CL_SALV_TABLE: totales en <columnas>, orden default <campos>, layout variant habilitado

## Tablas y campos
<lista derivada del FD>

## AUTHORITY-CHECK
<objetos identificados>

## Decisiones y Supuestos
<…>
```

---

## Template 2 — BAdI (Business Add-In)

### Arquitectura aprobada

```
ZIMP_<BADI>_<PROPÓSITO> (Implementación del BAdI)
│
├── Encuentra el BAdI (SE19 / clase generada)
└── Método con lógica de negocio extraída del FD
      ├── Validación de parámetros importing
      ├── AUTHORITY-CHECK si toca datos sensibles
      ├── Lógica de negocio (idealmente delegada a una ZCL)
      └── EXPORTING / CHANGING parámetros con resultado
```

### Objetos SAP típicos

- Definición del BAdI (estándar SAP — el agente debe **identificarlo** en el TD, no asumirlo).
- Filtros del BAdI si aplica.
- Clase auxiliar `ZCL_<MOD>_<LOGICA>` para encapsular la lógica (no inflar el método del BAdI).

### Antipatrones bloqueados

- ❌ Implementar lógica de negocio **dentro** del método del BAdI sin delegar a una ZCL. Romper SRP.
- ❌ Llamar a `COMMIT WORK` o `ROLLBACK WORK` dentro del BAdI (responsabilidad de la transacción contenedora).
- ❌ Modificar parámetros `IMPORTING` directamente (son read-only).
- ❌ Asumir un BAdI sin haberlo identificado explícitamente en el TD. **El agente debe marcar `⚠️ VERIFICAR: confirmar nombre del BAdI en SE18`** si no está 100% seguro.

### Esqueleto de TD

```markdown
## BAdI a implementar
- Nombre: <BADI_DEFINITION>  ⚠️ VERIFICAR en SE18
- Filtro: <si aplica>
- Método: <NOMBRE_METODO>
- Parámetros relevantes: <IM_…, CH_…>

## Lógica de negocio (delegada a ZCL_<MOD>_<LOGICA>)
<extraída del FD>

## Decisiones y Supuestos
<…>
```

---

## Template 3 — User Exit

### Arquitectura aprobada

User Exits son **legacy** (Form/Subroutine en programas SAP). Solo usar si el BAdI/Enhancement Point equivalente no existe.

```
INCLUDE Z<MOD>_<EXIT_NAME>      " incluido en el USEREXIT_… correspondiente
│
└── PERFORM o lógica directa
      ├── Validación de SY-TCODE / parámetros del exit
      ├── Lógica de negocio (preferir delegar a ZCL)
      └── Modificación controlada de variables del programa principal
```

### Antipatrones bloqueados

- ❌ Modificar variables globales del programa SAP estándar sin documentarlo.
- ❌ Hacer SELECT pesados dentro del exit (impacto en performance del programa contenedor).
- ❌ Usar User Exit cuando ya existe un BAdI o Enhancement Point. **El agente debe sugerir el BAdI alternativo** en la sección "Decisiones y Supuestos".

### Recordatorio

> ⚠️ Si el FD pide un User Exit y SAP ofrece un BAdI/Enhancement equivalente, el agente debe proponerlo en el TD y dejar la decisión al desarrollador. No imponer.

---

## Template 4 — Formulario (SmartForms / Adobe Forms)

### Arquitectura aprobada

```
Z<MOD>_F_<PROPÓSITO> (SmartForm o Adobe Form)
│
├── ZCL_<MOD>_<PROPÓSITO>_DRIVER (clase driver — recopila datos)
│     ├── obtener_datos
│     ├── enriquecer
│     └── llamar_form (FM generado por SAP)
│
└── SmartForm / Adobe Form
      ├── Páginas con layout según FD
      ├── Ventanas (MAIN, header, footer, signature)
      ├── Nodos: TEXT, TABLE, LOOP, FOLDER
      └── Tipografía y estilo según estándar empresa
```

### Antipatrones bloqueados

- ❌ Lógica de negocio dentro del nodo del SmartForm. Toda lógica va en la clase driver.
- ❌ Hardcodeo de textos en el form sin pasar por SO10 o sin parametrizar idioma.
- ❌ Logos como imagen embebida si la empresa tiene SE78 estandarizado.
- ❌ `SELECT` dentro del LOOP del form (N+1). Pre-cargar en la clase driver.

### Esqueleto de TD

```markdown
## Form a crear
- Nombre: Z<MOD>_F_<propósito>
- Tipo: SmartForm / Adobe
- Páginas: <N> (cabecera, detalle, totales, firma)
- Tipografía: <estándar empresa>

## Clase driver
- ZCL_<MOD>_<propósito>_DRIVER con método execute

## Estructuras de datos pasadas al form
<gs_header, gt_items, gs_totales>

## Decisiones y Supuestos
<…>
```

---

## Template 5 — Conversión / Carga de datos

### Arquitectura aprobada

Para cargas masivas, **NO** usar `INSERT` directos a tablas SAP estándar. Patrón aprobado:

```
Z<MOD>_C_<PROPÓSITO> (Programa de conversión Z)
│
├── Lee archivo (CG3Y / GUI_UPLOAD / AL11 según ambiente)
│
└── ZCL_<MOD>_CONVERSION
      ├── parsear_archivo       (CSV/XLSX → tabla interna)
      ├── validar_registros     (consistencia + duplicados)
      ├── procesar_lote         (loop con BAPI estándar)
      ├── manejar_resultado     (BAPI_TRANSACTION_COMMIT condicional)
      └── reporte_log_alv       (qué pasó, qué falló, qué se omitió)
```

### Objetos SAP típicos

- BAPI estándar del módulo: `BAPI_MATERIAL_SAVEDATA`, `BAPI_SALESORDER_CREATEFROMDAT2`, etc.
- `BAPI_TRANSACTION_COMMIT` (con `WAIT = 'X'` cuando se necesita confirmación).
- `BAPI_TRANSACTION_ROLLBACK` en caso de error.

### Antipatrones bloqueados

- ❌ `INSERT` / `UPDATE` / `DELETE` directos a tablas SAP estándar (MARA, KNA1, LFA1, etc.). **Siempre BAPI.**
- ❌ `COMMIT WORK` directo sin `BAPI_TRANSACTION_COMMIT`.
- ❌ Procesar el lote completo sin manejo de errores por registro. Cada registro debe poder fallar independiente.
- ❌ Cargar sin reporte ALV final con éxitos/fallos/omitidos.
- ❌ Cualquier llamada a `CALL TRANSACTION 'XX' USING bdcdata` para tablas que tienen BAPI disponible.

---

## Cómo el agente usa esta skill

1. **Módulo 1** detecta el tipo de objeto en el FD.
2. **Módulo 2** carga el template correspondiente como contexto al inicio de la generación del TD.
3. **Módulo 3** carga el template correspondiente como contexto al inicio de la generación del código.
4. La **sección "Decisiones y Supuestos"** del output debe declarar qué template se aplicó y si hubo desviaciones (y por qué).

---

## Versionado

Esta skill es **versionable** en repo. Cualquier cambio a un template:

1. Documenta motivo (ej.: cambio de patrón aprobado, deprecación de FM).
2. Pasa por skill `review-pr`.
3. Actualiza `examples/` con un caso que refleje el nuevo template.

## Alineación con el PRD

- **MoSCoW S1** (PRD §8) — Templates de prompt por tipo de objeto. Esta skill es la implementación operativa.
- **Principio #5** — Trazabilidad: cada output declara el template aplicado.
- **R3** — Tasa de alucinaciones: arrancar cada generación con arquitectura y antipatrones ya definidos reduce alucinaciones y ciclos de retroalimentación.
- **UC1, UC4** — Reporte Z y BAdI son los dos primeros casos de uso del piloto.
