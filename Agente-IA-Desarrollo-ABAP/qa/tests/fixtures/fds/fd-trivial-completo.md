# FD — Listado simple de materiales activos

## 1. Objetivo
Generar un reporte ALV con todos los materiales de la tabla MARA cuyo estado MSTAE no esté marcado como bloqueado, listando código, descripción y unidad base. Sirve como input de revisión semanal del área de Maestros y reduce el tiempo de consulta manual desde SE16 (hoy ~20 min) a un solo click.

## 2. Alcance
Dentro: reporte ALV de una sola tabla (MARA) con filtros de tipo de material y centro.
Fuera: edición de datos, transacciones de actualización, mantenimiento de jerarquías de producto.

## 3. Reglas de Negocio
- **RN1**: Si MSTAE indica bloqueo a nivel cliente → el material se excluye del listado.
- **RN2**: Si el usuario no selecciona tipo de material, el reporte trae todos los tipos disponibles para el centro filtrado.

## 4. Tablas SAP involucradas
- MARA — datos maestros del material (campos: MATNR, MAKTX vía join con MAKT, MEINS, MTART, MSTAE).
- MAKT — descripciones de material en idioma de logon.

## 5. Criterios de Aceptación
- **CA1**: El reporte se ejecuta en menos de 10 segundos para un universo de hasta 50 000 materiales.
- **CA2**: La columna "Estado" muestra el texto del MSTAE, no el código numérico.

## 6. Casos Borde
- **CB1**: 0 resultados → mensaje "No hay materiales que cumplan los filtros" en lugar de ALV vacío.
- **CB2**: Material sin descripción en el idioma de logon → se muestra la descripción en EN como fallback.

## 7. Autorizaciones
- Objeto **M_MATE_STA**, actividad 03 (lectura) — control estándar de visualización de maestro de material.
