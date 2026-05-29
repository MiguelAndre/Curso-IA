# FD — Reporte Z de Pedidos por Cliente

## 1. Objetivo
Generar un reporte ALV que liste todos los pedidos de venta abiertos por cliente, mostrando posición por posición su valor, fecha de entrega comprometida y status. El objetivo es darle al área comercial visibilidad diaria de la cartera abierta y reducir el tiempo de armado del reporte manual desde Excel.

## 2. Alcance
Dentro: pedidos en estado abierto del último año.
Fuera: facturación, devoluciones.

## 3. Reglas de Negocio
- **RN1**: Incluir **todos los clientes activos** (KNA1-LOEVM vacío) con al menos un pedido en el período, sin excepciones.
- **RN2**: Para cada cliente, listar todas sus posiciones de pedido en estado abierto (VBAP con VBUP-GBSTA ≠ 'C').
- **RN3**: Mostrar el monto neto convertido a moneda de la sociedad usando el tipo de cambio del día del documento.

## 4. Tablas SAP involucradas
- KNA1 — maestro de clientes.
- VBAK — cabecera de pedido de venta.
- VBAP — posición de pedido de venta.
- VBUP — status de posición.

## 5. Criterios de Aceptación
- **CA1**: El reporte se ejecuta en menos de 45 segundos para 200 clientes.
- **CA2**: La conversión de moneda usa la tabla TCURR.

## 6. Casos Borde
- **CB1**: Los clientes **bloqueados a nivel de ventas** (KNVV-LOEVM = 'X') **no deben aparecer en el reporte**, aunque RN1 los incluya formalmente — confirmar con el área qué prevalece.
- **CB2**: Cliente sin pedidos abiertos en el período: NO aparecer.
- **CB3**: Pedido con posición en otra moneda no listada en TCURR del día: mostrar la posición con marca "tipo de cambio pendiente" y monto en blanco.

## 7. Autorizaciones
- Objeto **V_VBAK_VKO**, actividad 03 (lectura por organización de ventas).
- El reporte se ejecuta para la organización de ventas del usuario logueado (no permite cambiar la organización por parámetro).
