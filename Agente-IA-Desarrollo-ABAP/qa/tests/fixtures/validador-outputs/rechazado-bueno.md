# Validación de FD — REQ-2026-018

## Estado: ❌ RECHAZADO

## Resumen
El FD no cumple cuatro reglas de Completitud Estructural y dos reglas de Calidad Semántica bloqueantes. Faltan secciones obligatorias y los criterios existentes son demasiado vagos para alimentar el pipeline. El pipeline está detenido hasta que se corrijan los gaps.

## Gaps detectados

### Sección 1 — Objetivo
- **Gap (regla CS-01)**: el Objetivo dice únicamente "Reporte de ventas", sin verbo accionable claro ni resultado medible. No permite inferir alcance, audiencia ni beneficio esperado.
- **Recomendación**: redactar un párrafo del tipo "Generar un reporte ALV que liste ventas por cliente con totales por período, exportable a Excel, que reduzca el tiempo manual actual de X horas/mes a Y minutos."

### Sección 4 — Tablas SAP involucradas
- **Gap (regla CE-04)**: la sección "Tablas SAP involucradas" no existe en el FD. No hay referencias a tablas técnicas como VBAK, VBAP, KNA1 que el dominio de ventas requiere.
- **Recomendación**: agregar la sección con nombres técnicos de tablas y campos relevantes (p. ej. "VBAK — cabecera de pedido de venta — campos VBELN, KUNNR, NETWR").

### Sección 5 — Criterios de Aceptación
- **Gap (regla CS-05)**: los criterios "se genera en menos de un minuto" y "permite exportar a Excel" son verificables, pero falta criterio sobre formato y consistencia del output. Mantener como observación si el resto del FD se corrige.

### Sección 7 — Autorizaciones
- **Gap (regla CE-07)**: la sección "Autorizaciones" no existe. No se puede inferir qué objeto Z*/S*/F* aplica ni qué actividad debe verificarse.
- **Recomendación**: agregar la sección con al menos un objeto de autorización por rol (p. ej. "Objeto Z_RPT_VENTAS, actividad 03, restringido al rol Z_VENTAS_REPORT").

### Sección 6 — Casos Borde
- **Gap (regla CS-06)**: el único caso borde declarado ("cliente sin ventas no aparece") es genérico; faltan escenarios de fechas inválidas, datos vacíos, conversión de moneda.
- **Recomendación**: enumerar al menos 3 casos borde concretos para el dominio de ventas.

### Sección 2 — Alcance
- **Gap (regla CS-02)**: el Alcance no declara exclusiones explícitas. Observación menor.
- **Recomendación**: agregar "Fuera del alcance: ..." con al menos un ítem.

> El pipeline está detenido. Tras corregir el FD, reenviar al Validador con `/validar-fd <ruta>`.
