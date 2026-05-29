# TD — Reporte de materiales

## 1. Tipo de objeto ABAP
ALV.

## 2. Resumen funcional
Listar materiales.

## 3. Objetos SAP involucrados

### Tablas
- MARA
- ZTBL_PROVEEDORES_EXT
- Z_MATERIALES_AGG
- EKKO
- BAPI_TBL_HISTORICO

### Módulos de función
- BAPI_MATERIAL_GET_LIST_BY_VENDOR
- Z_FM_RECALCULAR_PRECIOS
- BAPI_PROVEEDOR_HISTORICO_OBTENER

## 4. Arquitectura técnica
Una clase llamada `ZCL_REPORTE_MAT` con un método principal.

```abap
REPORT zr_materiales_proveedor.

CLASS zcl_reporte_mat DEFINITION.
  PUBLIC SECTION.
    METHODS ejecutar.
ENDCLASS.

CLASS zcl_reporte_mat IMPLEMENTATION.
  METHOD ejecutar.
    SELECT * FROM mara INTO TABLE @DATA(lt_mara).
    " ... resto
  ENDMETHOD.
ENDCLASS.
```

## 5. Campos y estructuras
Una pantalla de selección con proveedor y fechas. Estructuras intermedias varias.

## 6. Implementación de Reglas de Negocio
- **RN1**: Validar materiales activos.

## 7. Criterios de Aceptación técnicos
- Que sea rápido.
- Que exporte a Excel.

## 8. Decisiones y Supuestos
Se usa SALV porque es estándar.

## 9. TBD
Ninguno.
