*&---------------------------------------------------------------------*
*& Generado por Agente IA ABAP — pipeline FD→TD→Código
*& Requerimiento : REQ-2026-042
*& Fecha         : 2026-05-29
*& FD origen     : inline
*& TD origen     : outputs/2026-05-29/REQ-2026-042/td.md
*& Versión       : 1
*&---------------------------------------------------------------------*
*& Decisiones del código:
*&   1. CL_SALV_TABLE elegido sobre CL_GUI_ALV_GRID (CLAUDE.md §5.4 — SALV moderno por defecto).
*&   2. JOIN INNER MARA/MSEG/EKKO/EKPO en lugar de FOR ALL ENTRIES — volumen tolerable y simplifica.
*&   3. Precio promedio implementado como ΣNETPR×MENGE / ΣMENGE en process_data (interpretación del Supuesto §8.3 del TD).
*&---------------------------------------------------------------------*
*& Zonas marcadas con ⚠️ VERIFICAR (revisar antes de transportar):
*&   - Línea ~58: comportamiento ante proveedor sin orden de compra asociada inferido como exclusión.
*&   - Línea ~74: máscara de redondeo del precio promedio asumida en 2 decimales.
*&---------------------------------------------------------------------*
*& Auditoría: ver docs/checklist-auditoria-codigo-ia.md antes de aprobar
*& La aprobación del checklist es declaración de responsabilidad del
*& desarrollador conforme al Principio #1 del PRD.
*&---------------------------------------------------------------------*

*&---------------------------------------------------------------------*
*& Tipos locales
*&---------------------------------------------------------------------*
TYPES: BEGIN OF ty_resultado,
         lifnr     TYPE lfa1-lifnr,
         name1     TYPE lfa1-name1,
         matnr     TYPE mara-matnr,
         maktx     TYPE makt-maktx,
         menge     TYPE ekpo-menge,
         netpr     TYPE ekpo-netpr,
         budat     TYPE mkpf-budat,
         bloqueado TYPE abap_bool,
       END OF ty_resultado,
       tt_resultado TYPE STANDARD TABLE OF ty_resultado WITH EMPTY KEY.

*&---------------------------------------------------------------------*
*& Clase principal
*&---------------------------------------------------------------------*
CLASS zcl_compras_reporte_mat_prov DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS:
      ejecutar
        IMPORTING it_lifnr TYPE range_t_lifnr
                  it_budat TYPE range_t_budat
        RAISING   cx_sy_authorization.

  PRIVATE SECTION.
    DATA: mt_resultado TYPE tt_resultado.
    METHODS:
      check_authorization RAISING cx_sy_authorization,
      select_data         IMPORTING it_lifnr TYPE range_t_lifnr
                                    it_budat TYPE range_t_budat,
      process_data,
      display_alv.
ENDCLASS.

CLASS zcl_compras_reporte_mat_prov IMPLEMENTATION.

  METHOD ejecutar.
    check_authorization( ).
    select_data( it_lifnr = it_lifnr it_budat = it_budat ).
    process_data( ).
    display_alv( ).
  ENDMETHOD.

  METHOD check_authorization.
    " Objeto declarado en §7 del FD — no requiere ⚠️ VERIFICAR.
    AUTHORITY-CHECK OBJECT 'Z_RPT_COMPRAS'
                    ID 'ACTVT' FIELD '03'.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_sy_authorization.
    ENDIF.

    AUTHORITY-CHECK OBJECT 'M_BEST_BSA'
                    ID 'BSART' FIELD '*'.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_sy_authorization.
    ENDIF.
  ENDMETHOD.

  METHOD select_data.
    " Implementación de RN1: si el material no tuvo movimientos en el período, no se incluye.
    " JOIN INNER con MSEG asegura exclusión natural de materiales sin recepción.
    SELECT k~lifnr, l~name1, p~matnr, t~maktx, p~menge, p~netpr, h~budat, l~sperr
      FROM ekko AS k
      INNER JOIN ekpo AS p ON p~ebeln = k~ebeln
      INNER JOIN mseg AS s ON s~ebeln = k~ebeln AND s~ebelp = p~ebelp
      INNER JOIN mkpf AS h ON h~mblnr = s~mblnr AND h~mjahr = s~mjahr
      INNER JOIN lfa1 AS l ON l~lifnr = k~lifnr
      INNER JOIN makt AS t ON t~matnr = p~matnr AND t~spras = @sy-langu
      WHERE k~lifnr IN @it_lifnr
        AND h~budat IN @it_budat
      INTO TABLE @DATA(lt_raw).

    LOOP AT lt_raw ASSIGNING FIELD-SYMBOL(<fs>).
      APPEND VALUE ty_resultado(
        lifnr     = <fs>-lifnr
        name1     = <fs>-name1
        matnr     = <fs>-matnr
        maktx     = <fs>-maktx
        menge     = <fs>-menge
        netpr     = <fs>-netpr
        budat     = <fs>-budat
        " Implementación de RN3: marcar proveedor bloqueado (LFA1-SPERR ≠ vacío).
        bloqueado = COND #( WHEN <fs>-sperr IS NOT INITIAL THEN abap_true ELSE abap_false )
      ) TO mt_resultado.
    ENDLOOP.
  ENDMETHOD.

  METHOD process_data.
    " Implementación de RN2: precio promedio ponderado por par (proveedor, material).
    " ⚠️ VERIFICAR: máscara de redondeo asumida en 2 decimales; ajustar si la moneda exige más.
    DATA: lv_suma_valor TYPE p LENGTH 15 DECIMALS 2,
          lv_suma_cant  TYPE p LENGTH 15 DECIMALS 3.

    SORT mt_resultado BY lifnr matnr.

    LOOP AT mt_resultado ASSIGNING FIELD-SYMBOL(<r>)
                                   GROUP BY ( lifnr = <r>-lifnr matnr = <r>-matnr )
                                   ASSIGNING FIELD-SYMBOL(<grp>).
      CLEAR: lv_suma_valor, lv_suma_cant.
      LOOP AT GROUP <grp> ASSIGNING FIELD-SYMBOL(<i>).
        lv_suma_valor = lv_suma_valor + ( <i>-netpr * <i>-menge ).
        lv_suma_cant  = lv_suma_cant + <i>-menge.
      ENDLOOP.
      IF lv_suma_cant <> 0.
        <r>-netpr = lv_suma_valor / lv_suma_cant.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD display_alv.
    " ⚠️ VERIFICAR: comportamiento ante proveedor sin orden de compra asociada inferido como exclusión.
    " Si el FD aclara que debe aparecer con monto en blanco, ajustar select_data a LEFT OUTER JOIN.
    DATA(lo_salv) = cl_salv_table=>factory(
      EXPORTING list_display = abap_false
      IMPORTING r_salv_table = DATA(lo_table)
      CHANGING  t_table      = mt_resultado ).
    lo_table->get_functions( )->set_all( abap_true ).
    lo_table->get_display_settings( )->set_striped_pattern( abap_true ).
    lo_table->display( ).
  ENDMETHOD.

ENDCLASS.

*&---------------------------------------------------------------------*
*& CHECKLIST DE AUDITORÍA OBLIGATORIO antes de aprobar para transporte:
*&   docs/checklist-auditoria-codigo-ia.md
*&
*& Pruebas unitarias: pendientes de elaboración por el desarrollador.
*& Métodos públicos a cubrir: ejecutar.
*& Casos a contemplar mínimo:
*&   - Happy path: rango de proveedores con materiales y movimientos.
*&   - CB1: proveedor sin movimientos en el período.
*&   - CB4: selección vacía (0 resultados).
*&   - AUTHORITY-CHECK fallido (sy-subrc <> 0).
*& Compuerta del Principio #4 del PRD — no opcional.
*&---------------------------------------------------------------------*
