# TD — Reporte de Pedidos por Cliente

**Requerimiento**: REQ-2026-018
**Generado**: 2026-05-29
**FD origen**: inline
**Versión**: 1

---

## 1. Tipo de objeto ABAP
**REPORTE_ALV** — listado tabular de pedidos abiertos con exportación.

## 2. Resumen funcional
Listar pedidos de venta abiertos por cliente con monto y fecha comprometida en moneda de la sociedad.

## 3. Objetos SAP involucrados

### Tablas
| Tabla | Propósito | Campos relevantes |
|---|---|---|
| KNA1 | Maestro de clientes | KUNNR, NAME1, LOEVM |
| VBAK | Cabecera de pedido de venta | VBELN, KUNNR, AUDAT, NETWR |
| VBAP | Posición de pedido de venta | VBELN, POSNR, MATNR, NETWR, WAERK |
| VBUP | Status de posición | VBELN, POSNR, GBSTA |
| TCURR | Tipos de cambio | KURST, FCURR, TCURR, GDATU, UKURS |

### Módulos de función / BAPIs
- `CONVERT_TO_LOCAL_CURRENCY` para la conversión de moneda.

### Clases SAP estándar
- `CL_SALV_TABLE` para el display.

## 4. Arquitectura técnica

### Clase principal
`ZCL_VENTAS_REPORTE_PED_ABIERTOS`

### Métodos
| Método | Visibilidad | Propósito | Input | Output |
|---|---|---|---|---|
| `select_data` | private | Lee VBAK/VBAP/VBUP filtrado por estado abierto y fechas | rango clientes | `lt_resultado` |
| `process_data` | private | Convierte moneda y agrega por cliente | `lt_resultado` | tabla agregada |
| `display_alv` | public | Configura SALV | tabla | ALV |

### Flujo de datos
Selección → `select_data` → `process_data` → `display_alv`.

## 5. Campos y estructuras

### Pantalla de selección
- `s_kunnr` SELECT-OPTIONS sobre `kna1-kunnr`.
- `p_vkorg` PARAMETERS sobre `vbak-vkorg`.

### Estructuras intermedias
`BEGIN OF ty_resultado`: KUNNR, NAME1, VBELN, POSNR, NETWR_LOC, EDATU — `END OF ty_resultado`.

### Output
ALV con Cliente, Pedido, Posición, Monto local, Fecha comprometida.

## 6. Implementación de Reglas de Negocio
- **RN1**: Incluir todos los clientes activos (KNA1-LOEVM vacío) con al menos un pedido en el período. — *Implementación*: filtro `WHERE kna1~loevm = space` en `select_data`.
- **RN2**: Listar todas las posiciones en estado abierto (VBUP-GBSTA ≠ 'C'). — *Implementación*: condición en el JOIN con VBUP.
- **RN3**: Monto neto convertido a moneda de la sociedad usando tipo de cambio del día del documento. — *Implementación*: llamada a `CONVERT_TO_LOCAL_CURRENCY` con `i_date = VBAK-AUDAT`.

## 7. Criterios de Aceptación técnicos
- **CA1**: <45 segundos para 200 clientes. — *Verificación*: SAT durante UAT.
- **CA2**: Conversión de moneda usa TCURR. — *Verificación*: CONVERT_TO_LOCAL_CURRENCY usa TCURR internamente.

## 8. Decisiones y Supuestos
1. **CL_SALV_TABLE como framework**: alineado a CLAUDE.md §5.4.
2. **Supuesto**: el FD dice "todos los clientes activos" (RN1). Se aplicó literalmente.

## 9. TBD (información no resuelta)
Ninguno.
