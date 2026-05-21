# U4 — Business Logic Model: TD → Código ABAP

**Unidad**: U4 (Módulo 3 del PRD §9)
**Fecha**: 2026-05-20
**Decisiones aplicadas**: Q1:A (rechazar TD sin §8), Q2:C (1 archivo con bloques `*&---*`), Q3:A (sin generación de tests — alineado MoSCoW C3), Q4:B (skill ALV explícito con fallback), Q5:A (cabecera estándar 4 bloques).

---

## 1. Propósito del módulo

Generar **código ABAP OO** a partir de un TD aprobado. El output es un archivo `.abap` listo para que el desarrollador lo importe a Eclipse/ADT, pase syntax check, escriba sus pruebas unitarias y lo transporte. **No** ejecuta el código. **No** lo transporta. **No** genera pruebas unitarias automáticamente.

> Lee y respeta siempre `CLAUDE.md` (Principios No Negociables + buenas prácticas SAP §5). El contrato del TD entrante es el que produce U3 (`construction/U3/functional-design/business-logic-model.md` §7).

---

## 2. Flujo principal

```mermaid
%%{init: {'theme':'default'}}%%
flowchart TD
    A([TD entrante]) --> B{¿Trae §8<br/>Decisiones y Supuestos?}
    B -->|NO| Z1[RECHAZAR<br/>Mensaje pidiendo regenerar TD<br/>BR-01, Q1:A]
    B -->|SÍ| C[Identificar tipo de objeto<br/>desde §1 del TD]
    C --> D{¿REPORTE_ALV?}
    D -->|Sí| SK[Cargar skill template-alv<br/>BR-08, Q4:B]
    D -->|No| E
    SK --> E[Identificar zonas de riesgo<br/>(autorización, tablas Z, SQL, condiciones borde)<br/>§4]
    E --> F[Generar estructura del archivo:<br/>cabecera + clase principal + bloques<br/>§5]
    F --> G[Generar lógica con buenas prácticas SAP<br/>(CLAUDE.md §5)]
    G --> H[Insertar ⚠️ VERIFICAR donde aplica<br/>BR-04]
    H --> I[Insertar AUTHORITY-CHECK<br/>SECURITY-10, BR-05]
    I --> J[Validar: sin SQL inseguro, sin PII<br/>SECURITY-09, SECURITY-03, BR-06, BR-07]
    J --> K[Adjuntar referencia al checklist al pie<br/>BR-09]
    K --> L[Persistir e imprimir inline<br/>BR-10]

    style A fill:#BBDEFB,stroke:#1565C0
    style Z1 fill:#FFCDD2,stroke:#C62828
    style L fill:#A5D6A7,stroke:#2E7D32
    style SK fill:#CE93D8,stroke:#6A1B9A
```

---

## 3. Verificación de la entrada (Q1:A / BR-01)

Antes de cualquier generación, el sub-agente verifica que el TD entrante trae **§8 Decisiones y Supuestos** con al menos una entrada sustantiva (no vacía, no "Ninguno", no `<TBD>`).

### Acción si falta §8
Devolver el siguiente mensaje (sin generar código):

```markdown
> ❌ **No puedo generar código**: el TD entrante no contiene la sección §8 "Decisiones y Supuestos".
>
> El Principio #5 del PRD exige trazabilidad total: cada output debe documentar las decisiones interpretativas tomadas.
>
> **Acción**: regenera el TD ejecutando `/generar-td <ruta-fd> <req-id>` y asegúrate de revisar §8. Cuando esté completo, vuelve a ejecutar `/generar-abap`.
```

NO genera código. NO permite bypass.

### TBDs bloqueantes
Adicionalmente, si el TD §9 contiene TBDs marcados como `bloqueante_para_m3: true` (o equivalente en texto), el sub-agente rechaza con mensaje específico explicando qué TBDs faltan resolver.

---

## 4. Identificación de zonas de riesgo

Antes de escribir código, el sub-agente identifica zonas donde su confianza es < 100%. Cada zona se marcará en el código con `⚠️ VERIFICAR:`.

### Categorías de zonas de riesgo

| Categoría | Cuándo aplica | Qué incluir en el comentario |
|---|---|---|
| **Autorizaciones inferidas** | Cuando el TD no especificó objeto de autorización o lo dejó como TBD; cuando el TD declaró un objeto pero M3 duda de su exactitud | "objeto de autorización Z_X inferido; validar con perfil real del usuario" |
| **Tablas Z/Y no confirmadas** | Cuando el TD referencia tablas custom sin confirmar su existencia | "tabla ZT_X referenciada; verificar en SE11 que existe con los campos asumidos" |
| **Condiciones de borde inferidas** | Cuando el TD no especificó el comportamiento ante un caso borde y M3 hizo una asunción | "comportamiento ante <caso> inferido como <decisión>; validar con el FD original" |
| **FMs/BAPIs no confirmados** | Cuando se usa un FM/BAPI cuya existencia no es estándar SAP universal | "FM X usado; verificar disponibilidad en versión SAP del cliente" |
| **Lógica de transformación dudosa** | Cuando hay múltiples interpretaciones razonables de una regla del FD/TD y se eligió una | "transformación implementada como <decisión>; alternativa: <opción rechazada>" |

### Política de uso
- **Mejor sobre-marcar que omitir**: si dudas si marcar o no, marca.
- **Mejor marcar específico**: no marcar bloques enteros con `⚠️ VERIFICAR:` genéricos; aplicar al nivel de línea/método.

---

## 5. Estructura del archivo `.abap` generado (Q2:C, Q5:A)

```abap
*&---------------------------------------------------------------------*
*& Generado por Agente IA ABAP — pipeline FD→TD→Código
*& Requerimiento : <REQ-id>
*& Fecha         : <YYYY-MM-DD>
*& FD origen     : <ruta-fd>
*& TD origen     : <ruta-td>
*& Versión       : <n>
*&---------------------------------------------------------------------*
*& Decisiones del código:
*&   1. <Decisión técnica 1 — por qué se eligió esta opción>
*&   2. <Decisión técnica 2>
*&   3. ...
*&---------------------------------------------------------------------*
*& Zonas marcadas con ⚠️ VERIFICAR (revisar antes de transportar):
*&   - Línea ~<N>: objeto de autorización Z_X inferido
*&   - Línea ~<N>: condición de borde para fechas vacías inferida
*&   - ...
*&---------------------------------------------------------------------*
*& Auditoría: ver `docs/checklist-auditoria-codigo-ia.md` antes de aprobar
*&---------------------------------------------------------------------*

*&---------------------------------------------------------------------*
*& Tipos locales
*&---------------------------------------------------------------------*
TYPES: BEGIN OF ty_<nombre>,
         campo1 TYPE ...,
         campo2 TYPE ...,
       END OF ty_<nombre>.

*&---------------------------------------------------------------------*
*& Clase principal
*&---------------------------------------------------------------------*
CLASS zcl_<dominio>_<proposito> DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    METHODS: constructor IMPORTING ...
                                  EXPORTING ...,
             metodo_principal IMPORTING ...
                              EXPORTING ...
                              RAISING cx_<...>.

  PRIVATE SECTION.
    DATA: mt_<nombre> TYPE TABLE OF ty_<nombre>.
    METHODS: select_data, process_data, display_alv.  " (cuando aplique patrón ALV)

ENDCLASS.

CLASS zcl_<dominio>_<proposito> IMPLEMENTATION.

  METHOD constructor.
    " ...
  ENDMETHOD.

  METHOD metodo_principal.
    " ⚠️ VERIFICAR: objeto de autorización Z_X inferido (no confirmado en FD)
    AUTHORITY-CHECK OBJECT 'Z_X'
                    ID 'ACTVT' FIELD '03'.
    IF sy-subrc <> 0.
      RAISE EXCEPTION TYPE cx_<...>.
    ENDIF.

    " Implementación de la regla RN1: si la fecha desde > fecha hasta, error.
    IF iv_fecha_desde > iv_fecha_hasta.
      RAISE EXCEPTION TYPE cx_<...> EXPORTING textid = ...
    ENDIF.

    " ...
  ENDMETHOD.

  " ... más métodos ...

ENDCLASS.

*&---------------------------------------------------------------------*
*& Helpers / clases auxiliares (si las hay)
*&---------------------------------------------------------------------*
" (sólo si la unidad de trabajo lo amerita; idealmente todo dentro de la clase principal)
```

### Reglas estructurales

- **Un archivo `.abap` por unidad de trabajo** (Q2:C).
- **Bloques separados por `*&---*`**: Tipos → Clase principal (DEFINITION + IMPLEMENTATION) → Helpers (si aplica).
- **No** se generan archivos separados por clase aux.
- **No** se generan archivos de prueba (Q3:A).

---

## 6. Aplicación de buenas prácticas SAP (CLAUDE.md §5)

El sub-agente aplica obligatoriamente las buenas prácticas embebidas en `CLAUDE.md` §5:

| Práctica | Aplicación |
|---|---|
| SQL con campos explícitos | `SELECT matnr, mtart, meins FROM mara` — nunca `SELECT *` |
| `FOR ALL ENTRIES` con guarda | siempre precedido de `IF lt_x IS NOT INITIAL` |
| Sin SQL dinámico inseguro | nunca concatenar strings para construir WHERE |
| AUTHORITY-CHECK en datos sensibles | obligatorio en accesos a nómina, finanzas, RRHH, datos personales |
| ABAP OO con `ZCL_*` | nunca generar `REPORT zr_...` puro salvo justificación documentada en §8 del TD |
| ALV con `CL_SALV_TABLE` | nunca `CL_GUI_ALV_GRID` salvo si el TD lo exige explícitamente |
| Naming `Z*` / `lv_`/`lt_`/`ls_`/`lo_` / parámetros `iv_`/`it_`/`ev_`/... | siempre |
| Excepciones `CX_*` | sin `MESSAGE TYPE 'A'` salvo crítico |
| Métodos cortos (< 50 líneas) | privilegia cohesión |

---

## 7. Activación del skill `template-alv` (Q4:B / BR-08)

Idéntica lógica a U3:

1. Si el TD §1 declara `REPORTE_ALV` o el contexto contiene keywords ALV → asumir activación automática del skill.
2. **Fallback explícito**: si el output empieza a verse genérico (sin clase `ZCL_RPT_*`, sin `select_data`/`process_data`/`display_alv`, sin field catalog), invocar:
   ```
   Read .claude/skills/template-alv/SKILL.md
   ```
3. Si el skill no existe todavía (U6 aún no construida), aplicar el patrón ALV del prompt base y documentar en cabecera "Decisiones del código": "Patrón ALV aplicado desde contexto base; cuando el skill esté disponible, se enriquecerá."

---

## 8. Persistencia condicional (heredado de Q5:A / BR-10)

- **Con `<req-id>`**: persistir en `outputs/<YYYY-MM-DD>/<req-id>/codigo.abap`. Regeneraciones: `codigo-v2.abap`, `codigo-v3.abap`...
- **Sin `<req-id>`**: sólo imprime en chat.

---

## 9. Ciclo de retroalimentación con error específico (FR-M3-08)

El desarrollador puede pedir regenerar el código pasando el error concreto:

```
Regenera el código: falla con "field MARC-MTART not found in structure". El método select_data no parece estar haciendo el JOIN con MARA.
```

Procedimiento del sub-agente:

1. Lee el código previo (`Read outputs/<fecha>/<req-id>/codigo-vN.abap`).
2. Analiza el error y mapea a la línea/método responsable.
3. Genera la corrección preservando el resto del código.
4. Persiste como `codigo-v(N+1).abap`.
5. En la cabecera "Decisiones del código" agrega una entrada nueva:
   > Versión 2 (2026-05-20): se corrigió el método select_data agregando JOIN explícito MARA-MARC sobre MATNR. Error reportado: "field MARC-MTART not found in structure".

### Límite de iteraciones (PRD §7 Journey 4)
Si tras **2 ciclos** con el mismo tipo de error el código sigue fallando, el sub-agente recomienda escalar a desarrollo manual:

```markdown
> ⚠️ **Límite de iteraciones alcanzado**: he intentado 2 veces corregir este error sin éxito. Conforme al PRD §7 Journey 4, te recomiendo:
>
> 1. Escalar a **desarrollo manual** desde el TD aprobado (que ya tienes en `outputs/<fecha>/<req-id>/td.md`).
> 2. Registrar en el Excel del piloto: `Generado por agente: Parcial (TD sí, Código no)` con el motivo del escalamiento.
> 3. Este caso es input valioso para Fase 2 (MCP de solo lectura a SAP Development).
```

---

## 10. Sin generación de pruebas unitarias (Q3:A)

Alineado con MoSCoW C3 (fuera de scope MVP). El sub-agente:

- **No** genera clases `ZCL_*_TEST` ni archivos `.abap` de prueba.
- **No** crea métodos `FOR TESTING`.
- En cambio, al pie del archivo agrega un recordatorio:

```abap
*&---------------------------------------------------------------------*
*& Pruebas unitarias: pendientes de elaboración por el desarrollador.
*& Métodos públicos a cubrir: <lista de métodos>.
*& Casos a contemplar mínimo:
*&   - Happy path del proceso completo
*&   - Cada CB declarado en el TD §7
*&   - AUTHORITY-CHECK fallido (sy-subrc <> 0)
*& Compuerta del Principio #4 del PRD — no opcional.
*&---------------------------------------------------------------------*
```

---

## 11. Validaciones de seguridad pre-output (SECURITY-03/09/10)

Antes de imprimir/persistir el código, el sub-agente verifica:

| Verificación | Regla | Acción si falla |
|---|---|---|
| Ningún `SELECT *` | SECURITY-09, FR-M3-10 | Reescribir con campos explícitos |
| Ningún SQL dinámico construido por concatenación de strings no escapados | SECURITY-09 | Reescribir con parámetros / SQL estático |
| `AUTHORITY-CHECK` presente antes de accesos a datos sensibles (cuando el TD lo declaró sensible) | SECURITY-10, FR-M3-05 | Insertar AUTHORITY-CHECK + `⚠️ VERIFICAR:` |
| Ningún literal con apariencia de credencial, token, contraseña, email, número de identificación | SECURITY-03, FR-M3-11 | Reescribir; eliminar el literal o reemplazar por placeholder + nota en cabecera |
| Ningún comentario en código con datos reales (nombres propios, números de cliente reales) | SECURITY-03 | Reemplazar por placeholder genérico |

Si alguna verificación falla y el sub-agente no puede corregirla automáticamente, documenta en cabecera "Decisiones del código" como bloqueo y emite mensaje al desarrollador.

---

## 12. Referencia al checklist al pie (BR-09 / FR-M3-09)

Cada archivo `.abap` termina con:

```abap
*&---------------------------------------------------------------------*
*& CHECKLIST DE AUDITORÍA OBLIGATORIO antes de aprobar para transporte:
*&   docs/checklist-auditoria-codigo-ia.md
*&
*& Al firmar el checklist, el desarrollador asume garantía de calidad
*& conforme al Principio #1 del PRD.
*&---------------------------------------------------------------------*
```

---

## 13. No-objetivos explícitos

- ❌ M3 NO transporta. NO importa a SAP. NO ejecuta.
- ❌ M3 NO genera tests unitarios (Q3:A).
- ❌ M3 NO conecta a SAP para verificar tablas/FMs.
- ❌ M3 NO modifica el TD entrante.
- ❌ M3 NO insiste tras 2 ciclos con el mismo error — escala a manual.
- ❌ M3 NO genera código si el TD no trae §8 — rechaza.
