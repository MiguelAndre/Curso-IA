*&---------------------------------------------------------------------*
*& Report  ZMM_R_RETAL_PROV
*&---------------------------------------------------------------------*
*& Requerimiento : REQ-2026-0042
*& Descripción   : Reporte de materiales retal por proveedor
*& Tipo objeto   : Reporte Z (ALV)
*& TD versión    : 1.0 (ver 02-td-retal-materiales.md)
*& Generado por  : Módulo 3 — Agente TD → Código
*& Fecha         : 2026-05-18
*&---------------------------------------------------------------------*

REPORT zmm_r_retal_prov.

*----------------------------------------------------------------------*
* Selection-screen
*----------------------------------------------------------------------*
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-b01.
  PARAMETERS:     p_bukrs TYPE t001-bukrs OBLIGATORY.
  SELECT-OPTIONS: s_werks FOR  ('T001W-WERKS') OBLIGATORY.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-b02.
  SELECT-OPTIONS: s_lifnr FOR  ('LFA1-LIFNR').
  SELECT-OPTIONS: s_budat FOR  ('MKPF-BUDAT') OBLIGATORY.
SELECTION-SCREEN END OF BLOCK b2.

SELECTION-SCREEN BEGIN OF BLOCK b3 WITH FRAME TITLE TEXT-b03.
  PARAMETERS: p_activo AS CHECKBOX DEFAULT 'X'.
SELECTION-SCREEN END OF BLOCK b3.

*----------------------------------------------------------------------*
* CLASS zcl_mm_retal_reporte
*----------------------------------------------------------------------*
CLASS zcl_mm_retal_reporte DEFINITION FINAL.

  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_salida,
        bukrs     TYPE t001-bukrs,
        werks     TYPE t001w-werks,
        lifnr     TYPE lfa1-lifnr,
        name1     TYPE lfa1-name1,
        matnr     TYPE mara-matnr,
        maktx     TYPE makt-maktx,
        mtart     TYPE mara-mtart,
        meins     TYPE mara-meins,
        menge     TYPE mseg-menge,
        dmbtr     TYPE mseg-dmbtr,
        waers     TYPE t001-waers,
        ult_recep TYPE mkpf-budat,
      END OF ty_salida,
      tt_salida TYPE STANDARD TABLE OF ty_salida WITH EMPTY KEY.

    METHODS:
      execute.

  PRIVATE SECTION.
    DATA: mt_salida TYPE tt_salida,
          mv_waers  TYPE t001-waers.

    METHODS:
      validar_input
        RAISING zcx_mm_retal,

      check_auth
        IMPORTING iv_werks TYPE werks_d
        RAISING   zcx_mm_retal,

      obtener_datos,

      agrupar_totales,

      enriquecer,

      mostrar_alv.

ENDCLASS.

CLASS zcl_mm_retal_reporte IMPLEMENTATION.

  METHOD execute.

    TRY.
        validar_input( ).
        obtener_datos( ).

        IF mt_salida IS INITIAL.
          MESSAGE i001(z_mm_retal).
          RETURN.
        ENDIF.

        agrupar_totales( ).
        enriquecer( ).
        mostrar_alv( ).

      CATCH zcx_mm_retal INTO DATA(lx_error).
        MESSAGE lx_error TYPE 'E'.
    ENDTRY.

  ENDMETHOD.

  METHOD validar_input.

    " Validar sociedad y obtener moneda local
    SELECT SINGLE waers FROM t001
      INTO @mv_waers
      WHERE bukrs = @p_bukrs.

    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE zcx_mm_retal
        EXPORTING textid = zcx_mm_retal=>sociedad_no_existe.
    ENDIF.

    " Validar T134 (tipos de material) no vacía
    SELECT COUNT(*) FROM t134
      INTO @DATA(lv_count)
      WHERE mtart = 'RETL'.

    IF lv_count = 0.
      MESSAGE a002(z_mm_retal).
    ENDIF.

    " ⚠️ VERIFICAR: AUTHORITY-CHECK por sociedad con objeto Z_RETAL
    " Pendiente de confirmar con Seguridad si el objeto ya existe (TBD #3 del TD).
    AUTHORITY-CHECK OBJECT 'Z_RETAL'
                    ID 'ACTVT' FIELD '03'
                    ID 'BUKRS' FIELD p_bukrs.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE zcx_mm_retal
        EXPORTING textid = zcx_mm_retal=>sin_autorizacion_sociedad.
    ENDIF.

  ENDMETHOD.

  METHOD check_auth.

    AUTHORITY-CHECK OBJECT 'M_MATE_WRK'
                    ID 'ACTVT' FIELD '03'
                    ID 'WERKS' FIELD iv_werks.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE zcx_mm_retal
        EXPORTING textid = zcx_mm_retal=>sin_autorizacion_centro.
    ENDIF.

  ENDMETHOD.

  METHOD obtener_datos.

    " ⚠️ VERIFICAR: campo de valor a usar (DMBTR = moneda local vs WRBTR = transacción).
    " TBD #4 del TD. Asumimos DMBTR según práctica estándar.

    " ⚠️ VERIFICAR: el filtro de borrado solo aplica a MARA-LVORM (nivel cliente).
    " Confirmar si debe agregarse JOIN a MARC para filtro a nivel centro (TBD #1).

    SELECT msg~matnr,
           msg~werks,
           msg~lifnr,
           msg~menge,
           msg~dmbtr,
           mkpf~budat,
           mara~mtart,
           mara~meins
      INTO TABLE @DATA(lt_movimientos)
      FROM mseg AS msg
      INNER JOIN mkpf ON mkpf~mblnr = msg~mblnr
                     AND mkpf~mjahr = msg~mjahr
      INNER JOIN mara ON mara~matnr = msg~matnr
      WHERE msg~werks IN @s_werks
        AND msg~lifnr IN @s_lifnr
        AND mkpf~budat IN @s_budat
        AND msg~bwart IN ( '101', '501', '561' )
        AND mara~mtart = 'RETL'
        AND ( @p_activo = '' OR mara~lvorm = '' ).

    " Verificación de autorización por centro recorriendo los werks únicos
    LOOP AT lt_movimientos ASSIGNING FIELD-SYMBOL(<fs_mov>)
                          GROUP BY <fs_mov>-werks.
      check_auth( <fs_mov>-werks ).
    ENDLOOP.

    " Persistir crudo en estructura de salida; agrupación en agrupar_totales
    LOOP AT lt_movimientos ASSIGNING <fs_mov>.
      APPEND VALUE #( bukrs     = p_bukrs
                      werks     = <fs_mov>-werks
                      lifnr     = <fs_mov>-lifnr
                      matnr     = <fs_mov>-matnr
                      mtart     = <fs_mov>-mtart
                      meins     = <fs_mov>-meins
                      menge     = <fs_mov>-menge
                      dmbtr     = <fs_mov>-dmbtr
                      waers     = mv_waers
                      ult_recep = <fs_mov>-budat )
             TO mt_salida.
    ENDLOOP.

  ENDMETHOD.

  METHOD agrupar_totales.

    DATA: lt_agrupado TYPE tt_salida.

    LOOP AT mt_salida INTO DATA(ls_row)
                     GROUP BY ( bukrs = ls_row-bukrs
                                werks = ls_row-werks
                                lifnr = ls_row-lifnr
                                matnr = ls_row-matnr )
                     ASSIGNING FIELD-SYMBOL(<fs_grp>).

      DATA(ls_total) = VALUE ty_salida(
        bukrs = <fs_grp>-bukrs
        werks = <fs_grp>-werks
        lifnr = <fs_grp>-lifnr
        matnr = <fs_grp>-matnr
        waers = mv_waers ).

      LOOP AT GROUP <fs_grp> ASSIGNING FIELD-SYMBOL(<fs_mem>).
        ls_total-menge = ls_total-menge + <fs_mem>-menge.
        ls_total-dmbtr = ls_total-dmbtr + <fs_mem>-dmbtr.
        ls_total-mtart = <fs_mem>-mtart.
        ls_total-meins = <fs_mem>-meins.
        IF <fs_mem>-ult_recep > ls_total-ult_recep.
          ls_total-ult_recep = <fs_mem>-ult_recep.
        ENDIF.
      ENDLOOP.

      APPEND ls_total TO lt_agrupado.
    ENDLOOP.

    mt_salida = lt_agrupado.

  ENDMETHOD.

  METHOD enriquecer.

    LOOP AT mt_salida ASSIGNING FIELD-SYMBOL(<fs_row>).

      " Descripción de material en idioma del usuario; fallback EN
      SELECT SINGLE maktx FROM makt
        INTO @<fs_row>-maktx
        WHERE matnr = @<fs_row>-matnr
          AND spras = @sy-langu.

      IF sy-subrc <> 0.
        SELECT SINGLE maktx FROM makt
          INTO @<fs_row>-maktx
          WHERE matnr = @<fs_row>-matnr
            AND spras = 'E'.
        IF sy-subrc <> 0.
          <fs_row>-maktx = '[Sin descripción]'.
        ENDIF.
      ENDIF.

      " Nombre de proveedor + flag de bloqueo
      SELECT SINGLE name1, loevm FROM lfa1
        INTO @DATA(ls_lfa1)
        WHERE lifnr = @<fs_row>-lifnr.

      IF sy-subrc = 0.
        <fs_row>-name1 = ls_lfa1-name1.
        IF ls_lfa1-loevm = 'X'.
          <fs_row>-name1 = |{ ls_lfa1-name1 } [BLOQ]|.
        ENDIF.
      ENDIF.

    ENDLOOP.

  ENDMETHOD.

  METHOD mostrar_alv.

    DATA: lo_alv TYPE REF TO cl_salv_table.

    TRY.
        cl_salv_table=>factory(
          IMPORTING r_salv_table = lo_alv
          CHANGING  t_table      = mt_salida ).

        " Funciones estándar ALV (export, filter, sort, etc.)
        lo_alv->get_functions( )->set_all( ).

        " Totales en columnas numéricas
        DATA(lo_aggs) = lo_alv->get_aggregations( ).
        lo_aggs->add_aggregation( columnname = 'MENGE' ).
        lo_aggs->add_aggregation( columnname = 'DMBTR' ).

        " Orden default: BUKRS, WERKS, LIFNR asc; DMBTR desc
        DATA(lo_sorts) = lo_alv->get_sorts( ).
        lo_sorts->add_sort( columnname = 'BUKRS' ).
        lo_sorts->add_sort( columnname = 'WERKS' ).
        lo_sorts->add_sort( columnname = 'LIFNR' ).
        lo_sorts->add_sort( columnname = 'DMBTR' sequence = if_salv_c_sort=>sort_down ).

        " Layout variant
        DATA(lo_layout) = lo_alv->get_layout( ).
        lo_layout->set_key( VALUE #( report = sy-repid ) ).
        lo_layout->set_save_restriction( if_salv_c_layout=>restrict_none ).

        lo_alv->display( ).

      CATCH cx_salv_msg INTO DATA(lx_salv).
        MESSAGE lx_salv TYPE 'E'.
    ENDTRY.

  ENDMETHOD.

ENDCLASS.

*----------------------------------------------------------------------*
* MAIN
*----------------------------------------------------------------------*
START-OF-SELECTION.
  NEW zcl_mm_retal_reporte( )->execute( ).

*&---------------------------------------------------------------------*
*&  Decisiones del código
*&---------------------------------------------------------------------*
*& 1. Programa ejecutable Z con clase ZCL embebida (patrón clásico para
*&    reportes Z con selection-screen). La clase queda local al programa
*&    porque no se prevé reutilización fuera del reporte.
*&
*& 2. Excepciones modeladas con ZCX_MM_RETAL (clase de excepción
*&    pendiente de crear). Hereda de CX_STATIC_CHECK.
*&    ⚠️ VERIFICAR: crear ZCX_MM_RETAL con los textid:
*&       - sociedad_no_existe
*&       - sin_autorizacion_sociedad
*&       - sin_autorizacion_centro
*&
*& 3. La clase de mensajes Z_MM_RETAL debe crearse con:
*&       - 001 (I): "No se encontraron materiales retal para los
*&                  criterios seleccionados"
*&       - 002 (A): "Configure tipos de material en T134 antes de
*&                  ejecutar el reporte"
*&
*& 4. AUTHORITY-CHECK Z_RETAL se aplica una sola vez (validación de
*&    sociedad). M_MATE_WRK se aplica por cada centro único encontrado
*&    en los movimientos — esto cumple el criterio de aceptación #3 del
*&    FD (usuario sin auth a un centro no ve sus datos).
*&
*& 5. Sumarización en memoria usando LOOP...GROUP BY. Alternativa
*&    posible: SUM en SELECT con GROUP BY a nivel BD. Se eligió en
*&    memoria porque también se necesita MAX(BUDAT) y el código queda
*&    más legible. Para >100k movimientos evaluar mover a BD.
*&
*& 6. CL_SALV_TABLE en lugar de REUSE_ALV_GRID_DISPLAY por ser el
*&    patrón aprobado actual y porque expone funciones estándar
*&    (exportar a Excel, layout variant) sin código adicional.
*&
*& 7. La descripción del material usa fallback en cascada
*&    (idioma usuario → EN → '[Sin descripción]') según sección 6 del
*&    FD. No se asume que la descripción exista.
*&---------------------------------------------------------------------*
