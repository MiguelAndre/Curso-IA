---
name: template-alv
description: Patrón canónico para generar reportes ALV en ABAP OO. Activa este skill cuando el contexto contenga keywords como "reporte ALV", "ALV", "SALV", "CL_GUI_ALV_GRID", "CL_SALV_TABLE", "lista interactiva", "field catalog", "ALV grid" o describa una consulta tabular con columnas, ordenamiento y exportación. Provee estructura ZCL_RPT_ con métodos select_data/process_data/display_alv y field catalog estándar.
---

# Skill: Template ALV — Patrón canónico para reportes ABAP

## 1. Propósito

Este skill contiene el patrón estándar del proyecto para generar **reportes ALV** en ABAP OO. Lo consumen los sub-agentes `fd-a-td` (al diseñar la arquitectura técnica de un reporte) y `td-a-codigo` (al implementar el código).

> El skill **no genera código por sí solo**. Provee contexto que enriquece los outputs de M2 y M3 cuando el FD/TD describe un reporte ALV.

---

## 2. Activación

Este skill se activa por contexto cuando aparecen indicadores como:

- "reporte ALV", "informe ALV", "listado ALV".
- "ALV", "SALV".
- "CL_SALV_TABLE", "CL_GUI_ALV_GRID".
- "lista interactiva con columnas", "consulta tabular".
- "field catalog".
- "exportar a Excel / CSV" en combinación con consulta de datos.

Cuando un sub-agente detecta estos triggers, aplica el patrón de §3 en adelante.

---

## 3. Patrón canónico de la clase principal

### 3.1 Nombre de la clase

```
ZCL_RPT_<dominio>_<propósito>
```

Ejemplos:
- `ZCL_RPT_VENTAS_PEDIDOS_MES` — reporte de pedidos del mes en el dominio Ventas.
- `ZCL_RPT_COMPRAS_MATERIALES_PROVEEDOR` — UC1 del PRD (referencia del piloto).
- `ZCL_RPT_FINANZAS_CUENTAS_VENCIDAS` — reporte de cuentas por cobrar vencidas.

### 3.2 Definición de la clase

```abap
CLASS zcl_rpt_<dominio>_<proposito> DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_output,
        " Campos del reporte que ve el usuario final
        " Ejemplo: matnr     TYPE matnr,
        "          maktx     TYPE makt-maktx,
        "          lifnr     TYPE lifnr,
        "          ...
      END OF ty_output,
      tt_output TYPE STANDARD TABLE OF ty_output WITH EMPTY KEY.

    METHODS:
      constructor
        IMPORTING
          iv_<filtro1> TYPE <tipo>
          iv_<filtro2> TYPE <tipo>
        " ... más parámetros de selección ...
          ,
      ejecutar
        RAISING cx_sy_dyn_call_error
                cx_<...>.

  PRIVATE SECTION.
    DATA:
      mv_<filtro1> TYPE <tipo>,
      mv_<filtro2> TYPE <tipo>,
      mt_output    TYPE tt_output,
      mr_alv       TYPE REF TO cl_salv_table.

    METHODS:
      select_data,
      process_data,
      display_alv,
      build_field_catalog
        RAISING cx_salv_data_error,
      set_layout
        RAISING cx_salv_not_found,
      set_sort_and_filter
        RAISING cx_salv_data_error
                cx_salv_not_found,
      handle_authority_check
        RAISING cx_<...>.

ENDCLASS.
```

### 3.3 Implementación (esqueleto)

```abap
CLASS zcl_rpt_<dominio>_<proposito> IMPLEMENTATION.

  METHOD constructor.
    mv_<filtro1> = iv_<filtro1>.
    mv_<filtro2> = iv_<filtro2>.
    " ... almacenar el resto de parámetros ...
  ENDMETHOD.

  METHOD ejecutar.
    handle_authority_check( ).
    select_data( ).
    process_data( ).
    display_alv( ).
  ENDMETHOD.

  METHOD handle_authority_check.
    " ⚠️ VERIFICAR: objeto de autorización inferido — validar con perfil real del usuario
    AUTHORITY-CHECK OBJECT '<Z_OBJETO_AUTH>'
                    ID 'ACTVT' FIELD '03'.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_<...>.
    ENDIF.
  ENDMETHOD.

  METHOD select_data.
    " Campos explícitos — nunca SELECT *
    SELECT campo1, campo2, campo3
      FROM <tabla>
      WHERE <condiciones con mv_*>
      INTO TABLE @DATA(lt_<x>).

    " Joins / lookups adicionales con FOR ALL ENTRIES + guarda
    IF lt_<x> IS NOT INITIAL.
      SELECT campo_a, campo_b
        FROM <tabla_secundaria>
        FOR ALL ENTRIES IN @lt_<x>
        WHERE clave = @lt_<x>-clave
        INTO TABLE @DATA(lt_<y>).
    ENDIF.

    " Construir mt_output combinando los resultados
    " ...
  ENDMETHOD.

  METHOD process_data.
    " Transformaciones de negocio: cálculos, agrupaciones, formateos
    " Si hay RNs del FD, implementarlas aquí o en helpers privados.
    LOOP AT mt_output ASSIGNING FIELD-SYMBOL(<fs>).
      " ... aplicar reglas ...
    ENDLOOP.
  ENDMETHOD.

  METHOD display_alv.
    TRY.
        cl_salv_table=>factory(
          IMPORTING r_salv_table = mr_alv
          CHANGING  t_table      = mt_output ).

        build_field_catalog( ).
        set_layout( ).
        set_sort_and_filter( ).

        " Funciones estándar (PF-status default) + exportación
        mr_alv->get_functions( )->set_all( abap_true ).

        mr_alv->display( ).
      CATCH cx_salv_msg cx_salv_data_error cx_salv_not_found
        INTO DATA(lo_ex).
        " Manejar con cx_<...> propio si aplica
    ENDTRY.
  ENDMETHOD.

  METHOD build_field_catalog.
    DATA(lo_cols) = mr_alv->get_columns( ).
    lo_cols->set_optimize( abap_true ).

    " Por cada columna del output, ajustar texto, longitud, alineación
    " Ejemplo:
    " DATA(lo_col) = lo_cols->get_column( 'MATNR' ).
    " lo_col->set_short_text( 'Material' ).
    " lo_col->set_medium_text( 'Cod. Material' ).
    " lo_col->set_long_text( 'Código de Material' ).
  ENDMETHOD.

  METHOD set_layout.
    DATA(lo_layout) = mr_alv->get_layout( ).
    lo_layout->set_key( VALUE #( report = sy-repid ) ).
    lo_layout->set_default( abap_true ).
    lo_layout->set_save_restriction( cl_salv_layout=>restrict_none ).
  ENDMETHOD.

  METHOD set_sort_and_filter.
    " Ordenamiento por defecto si el FD lo especifica
    " DATA(lo_sort) = mr_alv->get_sorts( ).
    " lo_sort->add_sort( 'CAMPO_CLAVE' ).
    " Filtros por defecto si aplica
    " ...
  ENDMETHOD.

ENDCLASS.
```

---

## 4. Field catalog mínimo

Cada columna del output **debe tener**:

| Atributo | Cómo se configura | Por qué |
|---|---|---|
| Texto corto | `lo_col->set_short_text( 'X' )` (≤10 chars) | Visible en encabezado compacto |
| Texto medio | `lo_col->set_medium_text( 'XX' )` (≤20 chars) | Visible en encabezado estándar |
| Texto largo | `lo_col->set_long_text( 'XXX' )` (≤40 chars) | Visible en encabezado expandido / tooltip |
| Alineación (si aplica) | `lo_col->set_alignment( if_salv_c_alignment=>right )` para numéricos | Legibilidad de cifras |
| Visible inicialmente | Por defecto sí; usar `set_visible( abap_false )` para auxiliares | Reduce ruido visual |

**Nunca** dejar columnas con label "CAMPO1", "ZZ_TEMP", o nombres técnicos sin traducir al texto de negocio.

---

## 5. Variantes y experiencia de usuario

### 5.1 Layout (variantes guardables)
```abap
DATA(lo_layout) = mr_alv->get_layout( ).
lo_layout->set_key( VALUE #( report = sy-repid ) ).
lo_layout->set_default( abap_true ).
lo_layout->set_save_restriction( cl_salv_layout=>restrict_none ).
```
Permite al usuario guardar layouts personalizados (orden de columnas, filtros, sort).

### 5.2 Ordenamiento
```abap
DATA(lo_sorts) = mr_alv->get_sorts( ).
lo_sorts->add_sort( columnname = 'FECHA_DOC' position = 1 sequence = if_salv_c_sort=>sort_down ).
```

### 5.3 Funciones estándar (PF-status)
```abap
mr_alv->get_functions( )->set_all( abap_true ).
```
Habilita: print, exportar a Excel/CSV, sort/filter interactivos, sumas/subtotales, búsqueda.

### 5.4 Selección y eventos
```abap
mr_alv->get_selections( )->set_selection_mode( if_salv_c_selection_mode=>cell ).

" Para eventos hot-spot / doble click:
" SET HANDLER lcl_handler=>on_double_click FOR mr_alv->get_event( ).
```

---

## 6. Pantalla de selección

Para reportes que necesitan filtros del usuario, el código va en un `REPORT` separado (programa ejecutor) o en un `INCLUDE` del programa principal:

```abap
" Programa ejecutor: zr_rpt_<dominio>_<proposito>
REPORT zr_rpt_<dominio>_<proposito>.

PARAMETERS:
  p_bukrs TYPE bukrs OBLIGATORY.

SELECT-OPTIONS:
  s_fecha FOR sy-datum,
  s_matnr FOR mara-matnr,
  s_werks FOR marc-werks.

START-OF-SELECTION.
  TRY.
      DATA(lo_rpt) = NEW zcl_rpt_<dominio>_<proposito>(
        iv_bukrs    = p_bukrs
        is_fecha    = VALUE #( low = s_fecha-low high = s_fecha-high )
        " ... etc ...
      ).
      lo_rpt->ejecutar( ).
    CATCH cx_<...> INTO DATA(lo_ex).
      MESSAGE lo_ex TYPE 'E'.
  ENDTRY.
```

> El sub-agente `td-a-codigo` típicamente genera la clase `ZCL_RPT_*` en un solo `.abap` (Q2:C). El programa ejecutor `ZR_*` puede generarse en un bloque separado dentro del mismo `.abap` con un comentario `*&---*` que lo identifique, o agregarse después como complemento si el TD lo solicita.

---

## 7. Anti-patrones de ALV (no usar)

- ❌ **`CL_GUI_ALV_GRID` directo en aplicaciones nuevas** salvo que el TD lo exija explícitamente. Preferir `CL_SALV_TABLE` (más moderno, mejor mantenibilidad).
- ❌ **`REUSE_ALV_GRID_DISPLAY`** (funciones obsoletas de los 2000s). Sólo si se mantiene código legado.
- ❌ **Auto-detección de field catalog sin configurar textos**: muestra labels técnicos al usuario.
- ❌ **Métodos `select_data` que también hacen `process_data`**: viola NFR-U4-MAINT-02 (responsabilidad única).
- ❌ **AUTHORITY-CHECK ausente** cuando se accede a tablas de la lista §12 del sub-agente `td-a-codigo` (datos sensibles).
- ❌ **`SELECT *`** en `select_data` (Pre-Output Checklist check 1 / SECURITY-09).
- ❌ **Hardcoding del field catalog en `display_alv`** en lugar de un método `build_field_catalog` separado.
- ❌ **No habilitar funciones estándar** del SALV (`get_functions( )->set_all`): el usuario pierde exportación, filtros, sort.
- ❌ **Variables globales** del reporte fuera de la clase (excepto `PARAMETERS`/`SELECT-OPTIONS` del programa ejecutor).
- ❌ **Eventos sin handler** o handlers con lógica de negocio embebida (sacar a métodos de la clase).

---

## 8. Notas de evolución

Cuando aparezcan los **estándares específicos de la empresa** (decisión Q4:C inicial), este skill se ajustará:
- Convenciones de naming específicas (p. ej. `Y*` en vez de `Z*`).
- Class library del cliente que ya provea funcionalidad ALV (heredar en vez de invocar SALV directo).
- Field catalog con etiquetas multilingüe del cliente.

Mientras tanto, este patrón es el **baseline genérico**.

---

## 9. Referencias

- **CLAUDE.md §5.3 y §5.4**: arquitectura ABAP OO + ALV genérico.
- **Sub-agente `fd-a-td`** §10: cómo se activa este skill desde M2.
- **Sub-agente `td-a-codigo`** §7: cómo se activa este skill desde M3.
- **Checklist de auditoría**: `docs/checklist-auditoria-codigo-ia.md` — items relevantes a ALV.
