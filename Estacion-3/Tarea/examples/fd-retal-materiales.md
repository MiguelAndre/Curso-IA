# Documento Funcional — Reporte de Materiales Retal por Proveedor

**Identificador:** REQ-2026-0042
**Área solicitante:** Compras
**Fecha de solicitud:** 2026-05-10
**Solicitante:** Ana Pérez (Jefe de Compras)
**Consultor funcional responsable:** Carlos Méndez

---

## 1. Objetivo del requerimiento

El área de Compras necesita un reporte mensual que muestre los materiales clasificados como "retal" (producto sobrante de procesos de corte) agrupados por proveedor, con el fin de identificar oportunidades de recompra o devolución. Hoy esta información se construye manualmente cruzando datos en Excel desde varias transacciones, lo que toma ~6 horas mensuales por persona y es propenso a errores. El reporte debe ejecutarse bajo demanda desde una transacción Z en el ambiente productivo de SAP S/4HANA.

## 2. Tipo de objeto a desarrollar

**Reporte Z (ALV)** — Programa ejecutable Z con selection-screen y output ALV.

## 3. Campos de entrada (selection-screen)

| Campo | Tipo | Obligatorio | Default | Validación |
|---|---|---|---|---|
| Sociedad (BUKRS) | CHAR(4) | Sí | — | Debe existir en T001 |
| Centro (WERKS) | CHAR(4) | Sí (rango) | — | Debe existir en T001W |
| Proveedor (LIFNR) | CHAR(10) | No (rango) | — | Si se llena, debe existir en LFA1 |
| Rango de fechas (BUDAT) | DATS | Sí (rango) | Mes en curso | Fecha de contabilización del documento de material |
| Solo materiales activos | CHECKBOX | No | Marcado | Filtra MARA-LVORM = '' |

## 4. Campos de salida (ALV)

| Columna | Tipo | Fuente | Descripción |
|---|---|---|---|
| Sociedad | CHAR(4) | T001-BUKRS | Sociedad financiera |
| Centro | CHAR(4) | T001W-WERKS | Centro logístico |
| Proveedor | CHAR(10) | LFA1-LIFNR | Código de proveedor |
| Nombre Proveedor | CHAR(40) | LFA1-NAME1 | Razón social |
| Material | CHAR(18) | MARA-MATNR | Código de material |
| Descripción Material | CHAR(40) | MAKT-MAKTX | En idioma del usuario (SY-LANGU) |
| Tipo Material | CHAR(4) | MARA-MTART | Debe ser tipo "RETL" (configurado en T134) |
| UM Base | UNIT(3) | MARA-MEINS | Unidad de medida base |
| Cantidad Retal | QUAN(13,3) | MSEG-MENGE (sumarizada) | Sumatoria de movimientos en el rango |
| Valor Retal | CURR(13,2) | MSEG-DMBTR (sumarizada) | Valor monetario en moneda local |
| Moneda Local | CUKY(5) | T001-WAERS | Moneda de la sociedad |
| Última recepción | DATS | MAX(MSEG-BUDAT) | Fecha más reciente del movimiento |

## 5. Reglas de negocio

1. Se consideran "materiales retal" únicamente los que tienen `MARA-MTART = 'RETL'`.
2. Los movimientos relevantes son los de clase `MSEG-BWART` IN ('101', '501', '561') — recepciones de material retal.
3. La sumatoria de cantidad y valor se hace por la tupla (Sociedad, Centro, Proveedor, Material).
4. Si el material no tiene movimientos en el rango pero existe en MARA con tipo RETL y el filtro "Solo activos" está marcado, **no se incluye** en el reporte.
5. El orden default del ALV es: Sociedad ↑, Centro ↑, Proveedor ↑, Valor Retal ↓ (mayor a menor).
6. Los importes se muestran con separador de miles y 2 decimales según locale del usuario.

## 6. Casos especiales / excepciones

- **Sin datos:** mostrar mensaje `Z_MM_RETAL` clase 001 "No se encontraron materiales retal para los criterios seleccionados".
- **Proveedor borrado lógicamente (LFA1-LOEVM = 'X'):** se incluye con el nombre seguido de `[BLOQ]`.
- **Material sin descripción en idioma del usuario:** mostrar descripción en inglés (EN) como fallback. Si tampoco existe, mostrar `[Sin descripción]`.
- **Tabla de configuración T134 vacía:** abortar con mensaje "Configure tipos de material en T134 antes de ejecutar el reporte".

## 7. Criterios de aceptación

1. ✅ El reporte muestra solo materiales con `MTART = 'RETL'`.
2. ✅ Las sumas de cantidad y valor coinciden con MB51 filtrada por mismo rango y BWART.
3. ✅ El usuario sin autorización al objeto `M_MATE_WRK` para el centro X **no ve** datos de ese centro.
4. ✅ El reporte exporta a Excel manteniendo formato de columnas (números con decimales, fechas DD.MM.YYYY).
5. ✅ El tiempo de respuesta para 1 sociedad × 1 mes × <50.000 movimientos es ≤30 segundos.

## 8. Autorizaciones requeridas

- `M_MATE_WRK` — actividad 03 (visualizar), centro como parámetro.
- `Z_RETAL` — actividad 03 (visualizar), nuevo objeto a crear por el equipo de seguridad.

## 9. Volumen estimado

- Materiales retal activos: ~1.200
- Proveedores con retal: ~80
- Movimientos mensuales: ~3.500
- Ejecuciones esperadas: 5 usuarios × 4 veces/mes = 20 ejecuciones/mes

## 10. Diseño visual

ALV estándar con totales en las columnas "Cantidad Retal" y "Valor Retal". Permite agrupación por usuario (layout variant).

---

*FD elaborado siguiendo el formato institucional. Aprobado por: Ana Pérez (negocio), Carlos Méndez (consultor). Listo para validación técnica.*
