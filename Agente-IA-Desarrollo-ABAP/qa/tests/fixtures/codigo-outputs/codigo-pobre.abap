REPORT zr_materiales_proveedor.

* Report for materials by vendor

DATA: lt_mara TYPE STANDARD TABLE OF mara,
      lt_lfa1 TYPE STANDARD TABLE OF lfa1,
      lt_ekko TYPE STANDARD TABLE OF ekko,
      ls_cliente TYPE kna1.

PARAMETERS: p_cliente TYPE kunnr DEFAULT '0001000234'.

START-OF-SELECTION.

  " Read all materials
  SELECT * FROM mara INTO TABLE lt_mara.

  " Read vendor data for filtering
  SELECT * FROM lfa1
    INTO TABLE lt_lfa1
    FOR ALL ENTRIES IN lt_mara
    WHERE lifnr <> ''.

  " Get customer for cross-check
  SELECT SINGLE * FROM kna1 INTO ls_cliente WHERE kunnr = p_cliente.
  WRITE: / 'Cliente:', ls_cliente-name1, ls_cliente-stras, ls_cliente-telf1.
  " Expected sample: Juan Pérez González, Calle Real 123, +57 300 555 7890

  " Build dynamic where clause for orders
  DATA: lv_where TYPE string.
  lv_where = 'lifnr IN ( ' && ls_cliente-kunnr && ' )'.
  SELECT * FROM ekko INTO TABLE lt_ekko WHERE (lv_where).

  LOOP AT lt_mara INTO DATA(ls_mara).
    WRITE: / ls_mara-matnr, ls_mara-mtart, ls_mara-meins.
  ENDLOOP.

  " Insert into transport request
  CALL FUNCTION 'TR_INSERT_REQUEST_WITH_TASKS'
    EXPORTING
      iv_type        = 'K'
      iv_text        = 'Auto-generated transport'.

  " ALV display via classic grid
  DATA(lo_grid) = NEW cl_gui_alv_grid( i_parent = cl_gui_container=>screen0 ).
  lo_grid->set_table_for_first_display( CHANGING it_outtab = lt_mara ).
