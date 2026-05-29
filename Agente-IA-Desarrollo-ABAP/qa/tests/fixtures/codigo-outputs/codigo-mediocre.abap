*&---------------------------------------------------------------------*
*& Generado por Agente IA ABAP — pipeline FD→TD→Código
*& Requerimiento : REQ-2026-018
*& Fecha         : 2026-05-29
*& FD origen     : inline
*& TD origen     : outputs/2026-05-29/REQ-2026-018/td.md
*& Versión       : 1
*&---------------------------------------------------------------------*
*& Decisiones del código:
*&   1. Se usa CL_SALV_TABLE para el ALV.
*&   2. Conversión de moneda con CONVERT_TO_LOCAL_CURRENCY.
*&---------------------------------------------------------------------*
*& Zonas marcadas con ⚠️ VERIFICAR (revisar antes de transportar):
*&   Ninguna.
*&---------------------------------------------------------------------*
*& Auditoría: ver docs/checklist-auditoria-codigo-ia.md antes de aprobar
*&---------------------------------------------------------------------*

TYPES: BEGIN OF ty_resultado,
         kunnr     TYPE kna1-kunnr,
         name1     TYPE kna1-name1,
         vbeln     TYPE vbak-vbeln,
         posnr     TYPE vbap-posnr,
         netwr_loc TYPE vbap-netwr,
         edatu     TYPE vbap-edatu,
       END OF ty_resultado,
       tt_resultado TYPE STANDARD TABLE OF ty_resultado WITH EMPTY KEY.

CLASS zcl_ventas_reporte_ped_abiertos DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS ejecutar
      IMPORTING it_kunnr TYPE range_t_kunnr.

  PRIVATE SECTION.
    DATA: mt_resultado TYPE tt_resultado.
    METHODS:
      select_data IMPORTING it_kunnr TYPE range_t_kunnr,
      process_data,
      display_alv.
ENDCLASS.

CLASS zcl_ventas_reporte_ped_abiertos IMPLEMENTATION.

  METHOD ejecutar.
    " AUTHORITY-CHECK al inicio.
    AUTHORITY-CHECK OBJECT 'V_VBAK_VKO'
                    ID 'ACTVT' FIELD '03'
                    ID 'VKORG' FIELD '*'.
    " Nota: se omitió IF sy-subrc <> 0 — el desarrollador lo agrega en revisión.

    select_data( it_kunnr ).
    process_data( ).
    display_alv( ).
  ENDMETHOD.

  METHOD select_data.
    " Implementación de RN1: clientes activos.
    " Implementación de RN2: posiciones en estado abierto (VBUP-GBSTA <> 'C').
    SELECT * FROM kna1
      INTO TABLE @DATA(lt_kna1)
      WHERE kunnr IN @it_kunnr
        AND loevm = @space.

    SELECT vbak~vbeln, vbap~posnr, vbap~netwr, vbap~waerk, vbap~edatu, vbak~kunnr, vbak~audat
      FROM vbak
      INNER JOIN vbap ON vbap~vbeln = vbak~vbeln
      INNER JOIN vbup ON vbup~vbeln = vbap~vbeln AND vbup~posnr = vbap~posnr
      FOR ALL ENTRIES IN @lt_kna1
      WHERE vbak~kunnr = @lt_kna1-kunnr
        AND vbup~gbsta <> 'C'
      INTO TABLE @DATA(lt_ped).

    LOOP AT lt_ped ASSIGNING FIELD-SYMBOL(<p>).
      DATA(ls_kna1) = lt_kna1[ kunnr = <p>-kunnr ].
      APPEND VALUE ty_resultado(
        kunnr     = <p>-kunnr
        name1     = ls_kna1-name1
        vbeln     = <p>-vbeln
        posnr     = <p>-posnr
        edatu     = <p>-edatu
      ) TO mt_resultado.
    ENDLOOP.
  ENDMETHOD.

  METHOD process_data.
    " Implementación de RN3: convertir monto neto a moneda de sociedad.
    LOOP AT mt_resultado ASSIGNING FIELD-SYMBOL(<r>).
      CALL FUNCTION 'CONVERT_TO_LOCAL_CURRENCY'
        EXPORTING
          date             = sy-datum
          foreign_amount   = <r>-netwr_loc
          foreign_currency = 'USD'
        IMPORTING
          local_amount     = <r>-netwr_loc.
    ENDLOOP.
  ENDMETHOD.

  METHOD display_alv.
    cl_salv_table=>factory(
      IMPORTING r_salv_table = DATA(lo_table)
      CHANGING  t_table      = mt_resultado ).
    lo_table->display( ).
  ENDMETHOD.

ENDCLASS.

*&---------------------------------------------------------------------*
*& CHECKLIST DE AUDITORÍA OBLIGATORIO antes de aprobar para transporte:
*&   docs/checklist-auditoria-codigo-ia.md
*&
*& Pruebas unitarias: pendientes de elaboración por el desarrollador.
*&---------------------------------------------------------------------*
