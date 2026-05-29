# TD — Reporte Z de Materiales por Proveedor

**Requerimiento**: REQ-2026-042
**Generado**: 2026-05-29
**FD origen**: inline
**Versión**: 1

---

## 1. Tipo de objeto ABAP
**REPORTE_ALV**. El Objetivo y los CA describen un listado tabular consultable con exportación a Excel; las RN definen filtros y agregaciones sin modificar datos.

## 2. Resumen funcional
Reporte que lista, para un rango de proveedores y un período de fechas, los materiales suministrados con cantidad recibida, precio promedio ponderado y fecha de última recepción, con exportación a XLSX para el área de Compras.

## 3. Objetos SAP involucrados

### Tablas
| Tabla | Propósito | Campos relevantes |
|---|---|---|
| MARA | Maestro de material | MATNR, MTART, MEINS |
| LFA1 | Maestro de proveedor | LIFNR, NAME1, SPERR |
| EKKO | Cabecera de orden de compra | EBELN, LIFNR, BUKRS |
| EKPO | Posición de orden de compra | EBELN, EBELP, MATNR, NETPR, MENGE |
| MSEG | Documentos de material (movimientos) | MBLNR, MJAHR, MATNR, BWART, MENGE |
| MKPF | Cabecera de documento de material | MBLNR, MJAHR, BUDAT |

### Módulos de función / BAPIs
- Ninguno requerido — el reporte se construye con SELECT directo sobre tablas estándar.

### BAdIs / User Exits / Clases SAP estándar
- `CL_SALV_TABLE` — framework SALV moderno para el display del ALV (CLAUDE.md §5.4).

## 4. Arquitectura técnica

### Clase principal
`ZCL_COMPRAS_REPORTE_MAT_PROV`

### Métodos
| Método | Visibilidad | Propósito | Input | Output |
|---|---|---|---|---|
| `select_data` | private | Lee MSEG/MKPF filtrado por proveedor y fechas; join con EKKO/EKPO y enriquece con MARA/LFA1 | rango proveedor, rango fechas | tabla interna `lt_resultado` |
| `process_data` | private | Calcula precio promedio ponderado y última fecha por par (proveedor, material) | `lt_resultado` | tabla interna agregada |
| `display_alv` | public | Configura field catalog, totales al pie y exportación | tabla agregada | ALV en pantalla |
| `check_authorization` | private | Verifica objeto Z_RPT_COMPRAS y M_BEST_BSA antes de SELECT | usuario logueado | sy-subrc |

### Flujo de datos
Pantalla de selección → `check_authorization` → `select_data` (join MARA/LFA1/EKKO/EKPO/MSEG/MKPF) → `process_data` (agregación por proveedor+material) → `display_alv`.

## 5. Campos y estructuras

### Pantalla de selección
- `s_lifnr` SELECT-OPTIONS sobre `lfa1-lifnr`.
- `s_werks` SELECT-OPTIONS sobre `marc-werks` (centro).
- `s_budat` SELECT-OPTIONS sobre `mkpf-budat` (rango de fechas).

### Estructuras intermedias
`BEGIN OF ty_resultado`: LIFNR, NAME1, MATNR, MAKTX, MENGE, NETPR, BUDAT — terminadas con `END OF ty_resultado`.

### Output
ALV con columnas Proveedor, Nombre, Material, Descripción, Cantidad, Precio promedio, Última recepción.

## 6. Implementación de Reglas de Negocio
- **RN1**: Si el material no tuvo movimientos en el período, no se incluye. — *Implementación*: condición en `select_data` vía JOIN INNER con MSEG; filas sin match quedan excluidas naturalmente.
- **RN2**: Precio promedio = promedio ponderado de precios de recepción del período. — *Implementación*: en `process_data`, ΣNETPR×MENGE / ΣMENGE por par (proveedor, material).
- **RN3**: Proveedor con LFA1-SPERR ≠ vacío → indicador visual y no suma a totales. — *Implementación*: `process_data` setea flag `bloqueado` por proveedor; `display_alv` aplica color al `field catalog` y excluye del total al pie.

## 7. Criterios de Aceptación técnicos
- **CA1**: <30s para 100 proveedores y 6 meses. — *Verificación*: SE30/SAT durante UAT.
- **CA2**: XLSX preserva formatos numéricos. — *Verificación*: SALV usa máscara `'## ##0,00'` para precio y `'## ##0'` para cantidad.
- **CA3**: Total al pie con cantidad y monto en moneda de la sociedad. — *Verificación*: subtotal SALV configurado sobre las columnas correspondientes.

## 8. Decisiones y Supuestos
1. **CL_SALV_TABLE en lugar de CL_GUI_ALV_GRID**: alineado a CLAUDE.md §5.4 (SALV moderno por defecto). Alternativa rechazada: CL_GUI_ALV_GRID es más verboso, sin ventaja para reporte sin edición.
2. **JOIN INNER MARA/MSEG en lugar de FOR ALL ENTRIES**: el volumen estimado (≤100 proveedores · 6 meses) tolera el JOIN. Alternativa rechazada: FOR ALL ENTRIES + IF lt_aux IS NOT INITIAL agregaría guardas y latencia adicional sin beneficio para este volumen.
3. **Supuesto**: el "precio promedio ponderado" del FD se interpreta como ΣNETPR×MENGE / ΣMENGE sobre EKPO. Si el área de Compras requiere otra fórmula (p. ej. mediana), se ajusta en `process_data`.

## 9. TBD (información no resuelta)
- **TBD 1**: el FD no especifica el comportamiento cuando un proveedor tiene movimientos pero no orden de compra asociada (devolución directa). — *Pregunta para el consultor*: ¿se incluye con precio en blanco, se excluye o se reporta como excepción?
