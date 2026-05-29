# FD — Reporte Z de Materiales por Proveedor

## 1. Objetivo
Generar un reporte ABAP tipo ALV que liste, para un rango de proveedores y un período de fechas, todos los materiales suministrados con su cantidad, precio promedio y última fecha de recepción. El reporte debe poder exportarse a Excel para análisis del área de Compras y reducir en al menos 4 horas mensuales el tiempo de consolidación manual que hoy hace el equipo.

## 2. Alcance
Dentro del alcance:
- Reporte ALV con columnas: Proveedor, Material, Descripción, Cantidad recibida, Precio promedio, Última recepción.
- Filtros por proveedor (rango), centro y rango de fechas de recepción.

Fuera del alcance:
- Cálculos de margen de utilidad.
- Integración con sistemas externos no-SAP.

## 3. Reglas de Negocio
- **RN1**: Si el material no tuvo movimientos en el período, no se incluye en el listado.
- **RN2**: El precio promedio se calcula como el promedio ponderado de los precios de recepción del período (no el precio maestro).
- **RN3**: Si un proveedor está marcado como bloqueado (LFA1-SPERR ≠ vacío), se muestra con un indicador visual y no se suma a totales.

## 4. Tablas SAP involucradas
- MARA — datos maestros de material.
- LFA1 — datos maestros de proveedor.
- EKKO — cabecera de orden de compra.
- EKPO — posición de orden de compra.
- MSEG — documentos de material (movimientos).
- MKPF — cabecera de documento de material.

## 5. Criterios de Aceptación
- **CA1**: El reporte se ejecuta en menos de 30 segundos para un rango de hasta 100 proveedores y 6 meses.
- **CA2**: La exportación a XLSX preserva los formatos numéricos (precio con 2 decimales, cantidad con separador de miles).
- **CA3**: El total al pie muestra cantidad total y monto total en moneda de la sociedad.

## 6. Casos Borde
- **CB1**: Proveedor sin movimientos en el período → no aparece en el listado.
- **CB2**: Material con múltiples unidades de medida → se reporta en la unidad base de la EKPO.
- **CB3**: Fechas invertidas (desde > hasta) → mensaje de error E al usuario, no se ejecuta la consulta.
- **CB4**: Selección vacía (0 resultados) → mensaje "No hay datos para los filtros seleccionados" en lugar de ALV vacío.

## 7. Autorizaciones
- Objeto **Z_RPT_COMPRAS**, actividad 03 (lectura). Solo usuarios del rol `Z_COMPRAS_REPORT` deben ejecutarlo.
- Verificar **M_BEST_BSA** (autorización de tipo de documento de compra) para evitar lectura de pedidos restringidos.
