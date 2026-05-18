# Especificación Técnica (TD) — Reporte de Materiales Retal

**Requerimiento:** REQ-2026-0042
**Generado por:** Módulo 2 — Agente FD → TD
**Estado:** Pendiente de aprobación del desarrollador

---

## 1. Objetivo técnico

Construir un programa ejecutable ABAP OO que liste los materiales con tipo `RETL` agrupados por (sociedad, centro, proveedor, material), sumando cantidad y valor de movimientos de recepción en un rango de fechas, con presentación ALV.

## 2. Objetos SAP involucrados

### Tablas (lectura)

| Tabla | Uso | Campos clave |
|---|---|---|
| `T001` | Validación de sociedad + obtener moneda local | BUKRS, WAERS |
| `T001W` | Validación de centro | WERKS, BUKRS |
| `MARA` | Materiales con tipo RETL | MATNR, MTART, MEINS, LVORM |
| `MARC` | Materiales por centro (filtro adicional) | MATNR, WERKS, LVORM |
| `MAKT` | Descripciones de material por idioma | MATNR, SPRAS, MAKTX |
| `MSEG` | Movimientos de material | MBLNR, MJAHR, ZEILE, MATNR, WERKS, LIFNR, BUDAT, BWART, MENGE, DMBTR |
| `MKPF` | Cabecera de documentos de material (para BUDAT) | MBLNR, MJAHR, BUDAT |
| `LFA1` | Maestro de proveedores | LIFNR, NAME1, LOEVM |
| `T134` | Tipos de material | MTART |

> ⚠️ VERIFICAR: la cantidad y valor de movimiento están en `MSEG`. Confirmar con el desarrollador si el campo de valor a usar es `DMBTR` (moneda local) o `WRBTR` (moneda de transacción).

### Objetos de autorización

| Objeto | Actividad | Campos verificados |
|---|---|---|
| `M_MATE_WRK` | 03 | WERKS |
| `Z_RETAL` | 03 | (a definir con seguridad — ¿filtro por sociedad?) |

> ⚠️ VERIFICAR: el objeto `Z_RETAL` aún no existe. Solicitar a Seguridad su creación antes del syntax check.

### Clases de mensajes

- `Z_MM_RETAL` — clase nueva a crear. Mensajes 001 (no se encontraron datos), 002 (T134 vacía).

## 3. Arquitectura técnica propuesta

```
ZMM_R_RETAL_PROV (Programa ejecutable Z)
│
├── Selection-screen
│     ├── BLOCK b1 — Selección de organización
│     │     ├── P_BUKRS (PARAMETER, obligatorio)
│     │     └── S_WERKS (SELECT-OPTIONS, obligatorio)
│     ├── BLOCK b2 — Selección de proveedor y fecha
│     │     ├── S_LIFNR (SELECT-OPTIONS, opcional)
│     │     └── S_BUDAT (SELECT-OPTIONS, obligatorio, default mes en curso)
│     └── BLOCK b3 — Filtros
│           └── P_ACTIVO (CHECKBOX, default 'X')
│
└── ZCL_MM_RETAL_REPORTE (clase principal)
      ├── EXECUTE          — orquestador (público)
      ├── VALIDAR_INPUT    — valida sociedad, centro, T134
      ├── CHECK_AUTH       — AUTHORITY-CHECK por centro
      ├── OBTENER_DATOS    — SELECT con JOINs
      ├── AGRUPAR_TOTALES  — sumarización por tupla
      ├── ENRIQUECER       — completa descripciones, fallback EN, [BLOQ]
      └── MOSTRAR_ALV      — CL_SALV_TABLE con totales y layout
```

## 4. Lógica de selección de datos (SELECT principal)

```
SELECT msg~mblnr, msg~mjahr, msg~zeile,
       msg~matnr, msg~werks, msg~lifnr,
       msg~menge, msg~dmbtr,
       mkpf~budat,
       mara~mtart, mara~meins, mara~lvorm,
       t001~waers
  INTO TABLE @lt_movimientos
  FROM mseg AS msg
  INNER JOIN mkpf ON mkpf~mblnr = msg~mblnr
                 AND mkpf~mjahr = msg~mjahr
  INNER JOIN mara ON mara~matnr = msg~matnr
  INNER JOIN t001 ON t001~bukrs = @p_bukrs        " sociedad
  WHERE msg~werks IN @s_werks
    AND msg~lifnr IN @s_lifnr
    AND mkpf~budat IN @s_budat
    AND msg~bwart IN ('101','501','561')
    AND mara~mtart = 'RETL'
    AND ( @p_activo = '' OR mara~lvorm = '' ).
```

> ⚠️ VERIFICAR: agregar JOIN a `MARC` por (MATNR, WERKS) si se confirma que el filtro de borrado debe aplicar también a nivel centro (observación menor del Validador).

## 5. Sumarización y enriquecimiento

1. Agrupar `lt_movimientos` por `(BUKRS, WERKS, LIFNR, MATNR)`.
2. Sumar `MENGE` y `DMBTR`. Tomar `MAX(BUDAT)` como última recepción.
3. Para cada tupla, leer descripción en `MAKT` con SPRAS = SY-LANGU. Si no hay, leer con SPRAS = 'E'. Si no hay, mostrar `[Sin descripción]`.
4. Para cada tupla, leer `LFA1`. Si `LOEVM = 'X'`, anexar `[BLOQ]` al NAME1.

## 6. Configuración del ALV (CL_SALV_TABLE)

- Layout variant habilitado (`/H4LJEDI` → autorización del usuario).
- Función de exportación a Excel habilitada (default `CL_SALV_TABLE`).
- Totales en columnas `MENGE` (Cantidad Retal) y `DMBTR` (Valor Retal).
- Orden default: `BUKRS` ↑, `WERKS` ↑, `LIFNR` ↑, `DMBTR` ↓.
- Field catalog explícito con `SCRTEXT_S/M/L` para cada columna.
- Columnas numéricas con `JUST = 'R'` y separador de miles según locale.

## 7. Manejo de casos especiales

| Caso | Manejo |
|---|---|
| Sin datos | MESSAGE I001(Z_MM_RETAL). No mostrar ALV vacío. |
| Proveedor borrado lógicamente | NAME1 + ' [BLOQ]' en columna proveedor. |
| Material sin descripción en idioma usuario | Fallback EN → '[Sin descripción]'. |
| T134 vacía | MESSAGE A002(Z_MM_RETAL). Aborta antes del SELECT. |
| Sin autorización para centro | `AUTHORITY-CHECK OBJECT 'M_MATE_WRK'` por centro, antes del SELECT. |

## 8. Performance esperada

- Volumen declarado: ~3.500 movimientos/mes/sociedad.
- SELECT con índice primario en MSEG (MBLNR, MJAHR, ZEILE). Filtro BUDAT vía MKPF.
- Estimación: ≤10 segundos para 1 sociedad × 1 mes. Margen amplio sobre el criterio de aceptación de 30 segundos.

> ⚠️ VERIFICAR: si el ambiente tiene índice secundario por WERKS+BUDAT en MSEG. Si no, evaluar agregarlo (decisión del DBA, no del agente).

---

## Decisiones y Supuestos

1. **Programa ejecutable Z (no clase con factory), porque el FD especifica selection-screen y ALV bajo demanda — patrón estándar SAP.**
2. Se asume que **T001-WAERS** es la moneda local del reporte. Si el negocio requiere conversión a moneda corporativa distinta, se necesita aclaración adicional.
3. Se asume que **`MSEG-DMBTR`** es el campo correcto para "Valor Retal" en moneda local. Si el negocio reporta en otra moneda, requiere conversión con `READ_EXCHANGE_RATE`.
4. Se asume que `BWART IN ('101','501','561')` cubre todas las recepciones de retal según práctica estándar. **Confirmar con el consultor que no hay BWART Z personalizados en uso.**
5. La autorización `Z_RETAL` se asume con actividad 03 + filtro por sociedad. Pendiente de confirmación con Seguridad.
6. Se usa `CL_SALV_TABLE` (no `REUSE_ALV_GRID_DISPLAY`) por ser el patrón aprobado actual.

## TBDs (a resolver antes del Módulo 3)

| # | Pregunta | A quién |
|---|---|---|
| 1 | ¿Aplica filtro MARC-LVORM además de MARA-LVORM? | Consultor |
| 2 | ¿Hay BWART Z para retal que deba incluirse en el IN? | Consultor |
| 3 | ¿Existe Z_RETAL como objeto de autorización o hay que crearlo? | Seguridad |
| 4 | ¿La moneda del reporte es siempre la local (T001-WAERS) o configurable? | Consultor |
| 5 | ¿Existe índice secundario en MSEG por (WERKS, BUDAT)? | DBA |

---

*TD generado por Módulo 2 — Agente FD → TD. Pendiente revisión y aprobación del desarrollador antes de ejecutar Módulo 3.*
