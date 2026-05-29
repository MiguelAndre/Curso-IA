REPORT z_rpt_materiales_legacy.

DATA: lt_mara TYPE STANDARD TABLE OF mara,
      ls_mara TYPE mara.

SELECT-OPTIONS: s_mtart FOR ls_mara-mtart.

START-OF-SELECTION.
  SELECT matnr mtart meins
    FROM mara
    INTO CORRESPONDING FIELDS OF TABLE lt_mara
    WHERE mtart IN s_mtart.

  LOOP AT lt_mara INTO ls_mara.
    WRITE: / ls_mara-matnr, ls_mara-mtart, ls_mara-meins.
  ENDLOOP.
