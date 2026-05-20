# U3 — Business Logic Model: FD → TD

**Unidad**: U3 (Módulo 2 del PRD §9)
**Fecha**: 2026-05-19
**Decisiones aplicadas**: Q1:B (confía en orquestador con aviso), Q2:A (9 secciones técnicas), Q3:A (detección automática reverse engineering), Q4:B (activación explícita con fallback).

---

## 1. Propósito del módulo

Transformar un **FD aprobado** en una **Especificación Técnica (TD)** que el Módulo 3 pueda consumir para generar código. Razonar sobre tipo de objeto ABAP, tablas SAP involucradas, arquitectura técnica, campos, flujo, decisiones y supuestos.

---

## 2. Flujo principal

```mermaid
flowchart TD
    A([Input recibido]) --> B{¿Input es FD<br/>o código ABAP?}
    B -->|FD| C{¿Invocado por<br/>orquestador?}
    B -->|Código ABAP| RE[Modo Reverse Engineering<br/>§5]

    C -->|Sí| D[Asumir FD aprobado<br/>por M1]
    C -->|No, directo| E[Emitir AVISO modo directo<br/>BR-02]

    D --> F[Parsear FD por secciones<br/>según docs/formato-fd-generico.md]
    E --> F

    F --> G[Identificar tipo de objeto ABAP<br/>§3]
    G --> H{¿Es reporte ALV<br/>o keywords SALV/CL_GUI_ALV_GRID?}
    H -->|Sí| SK[Cargar skill template-alv<br/>BR-08]
    H -->|No| I
    SK --> I[Identificar objetos SAP<br/>(tablas, FMs, BAdIs)<br/>§4]

    I --> J[Proponer arquitectura técnica<br/>§5]
    J --> K[Mapear cada RN del FD<br/>a implementación<br/>§6]
    K --> L[Detectar TBDs<br/>(info no resuelta)<br/>FR-M2-07]
    L --> M[Producir TD con<br/>9 secciones obligatorias<br/>§7]
    M --> N[Persistir e imprimir inline<br/>BR-10]

    RE --> Z[TD descriptivo de código existente<br/>§9]

    style A fill:#BBDEFB,stroke:#1565C0
    style M fill:#A5D6A7,stroke:#2E7D32
    style RE fill:#FFF59D,stroke:#F57F17
    style SK fill:#CE93D8,stroke:#6A1B9A
    style E fill:#FFE0B2,stroke:#E65100
```

---

## 3. Identificación del tipo de objeto ABAP

A partir del FD (Objetivo + Alcance + Reglas de Negocio + Tablas), decidir el tipo. Decisión heurística:

| Tipo | Señales en el FD |
|---|---|
| Reporte ALV | "reporte", "listado", "consulta", "mostrar en pantalla con columnas", referencias a SALV, "exportar a Excel" |
| BAdI / User Exit | "extender comportamiento estándar", "agregar validación a transacción XX", referencias a códigos de transacción SAP estándar (VA01, ME21N, etc.) |
| Formulario | "formulario", "SAPscript", "SmartForm", "Adobe Form", "imprimir", "generar PDF" |
| Conversión | "migrar datos", "cargar desde Excel", "actualizar masivamente", "LSMW", "BAPI_*_CREATE" en lote |
| Workflow | "flujo de aprobación", "BO", "Business Workflow" |
| Otro | si ninguna señal aplica, dejar como `<TBD: tipo de objeto>` con justificación |

**Output esperado**: el TD §1 declara explícitamente el tipo y por qué fue elegido.

---

## 4. Identificación de objetos SAP

Para cada FD aprobado, listar:

| Categoría | Qué buscar |
|---|---|
| **Tablas** | Nombres técnicos mencionados en el FD (MARA, MARC, EKKO, etc.) + tablas adicionales que típicamente acompañan (p. ej. si menciona MARA, considerar MAKT para descripciones) |
| **Módulos de función / BAPIs** | FMs estándar relevantes al dominio (BAPI_SALESORDER_GETLIST, BAPI_MATERIAL_GET_DETAIL, etc.). Marcar `⚠️ VERIFICAR:` si no estás 100% seguro de su existencia. |
| **BAdIs / User Exits** | Si el FD pide extensión de transacción estándar, identificar puntos de extensión (CMOD, SE19, BAdI por defecto del módulo) |
| **Clases SAP estándar** | CL_SALV_TABLE, CL_GUI_ALV_GRID, CL_SD_BAPI*, etc. cuando apliquen |
| **Estructuras** | Tipos del diccionario (DDIC) que se usarán |

> **Importante**: nunca inventar nombres de tablas/FMs. Si tienes dudas, **declarar la duda** como `TBD:` con la pregunta específica (p. ej. "TBD: confirmar si existe el FM Z_VALIDAR_CLIENTE_CUPO o se debe crear").

---

## 5. Diseño de arquitectura técnica

Proponer:

1. **Clase principal**: nombre `ZCL_<dominio>_<propósito>` (ver `CLAUDE.md` §5.5).
2. **Métodos cohesivos**: cada uno con responsabilidad única.
3. **Patrón** según tipo de objeto:
   - **Reporte ALV** → usar el patrón del skill `template-alv` (cargado en §1 del flujo si se detectó): métodos `select_data`, `process_data`, `display_alv`.
   - **BAdI** → método único del BAdI con la lógica + helpers privados.
   - **Conversión** → clase con `read_input`, `transform`, `write_output`, `log_errors`.
4. **Flujo de datos**: cómo se mueve la información de selección → procesamiento → output.
5. **Tablas intermedias / estructuras** necesarias (tipos locales).

---

## 6. Mapeo Reglas de Negocio → Implementación

Para cada `RN<n>` del FD, el TD documenta cómo se implementa:

```markdown
### Implementación de Reglas de Negocio

- **RN1**: <texto de la regla del FD>
  - *Implementación*: <dónde y cómo se implementa — método X de la clase Y, con condición Z>
- **RN2**: ...
```

Si una RN del FD es ambigua o contradictoria con otra, marcar `TBD:`:
> **RN5**: "validar el cupo del cliente" — *Implementación*: TBD — el FD no especifica contra qué tabla/FM se valida el cupo. Pregunta para el consultor: ¿usar KNKK-KLIMK o tabla custom Z_CUPOS?

---

## 7. Estructura del TD (9 secciones obligatorias — Q2:A)

```markdown
# TD — <Nombre corto del requerimiento>

**Requerimiento**: <REQ-id>
**Generado**: <YYYY-MM-DD>
**FD origen**: <ruta-del-fd>
[Si modo directo: ⚠️ AVISO: TD generado en modo directo. El desarrollador asume garantía de la calidad del FD de entrada.]

---

## 1. Tipo de objeto ABAP

<Tipo decidido + 1 frase de justificación>

---

## 2. Resumen funcional

<1 párrafo, eco del Objetivo del FD>

---

## 3. Objetos SAP involucrados

### Tablas
| Tabla | Propósito | Campos relevantes |
|---|---|---|
| ... | ... | ... |

### Módulos de función / BAPIs
- ...

### BAdIs / User Exits / Clases SAP estándar
- ...

---

## 4. Arquitectura técnica

### Clase principal
`ZCL_<...>`

### Métodos
| Método | Visibilidad | Propósito | Input | Output |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

### Flujo de datos
<descripción breve o diagrama de flujo>

---

## 5. Campos y estructuras

### Pantalla de selección (si aplica)
- ...

### Estructuras intermedias / locales
- ...

### Output (lo que se muestra/genera)
- ...

---

## 6. Implementación de Reglas de Negocio

- **RN1**: <texto> — *Implementación*: <cómo>
- **RN2**: ...

---

## 7. Criterios de Aceptación técnicos

- **CA1**: <eco del CA1 del FD> — *Verificación técnica*: <cómo se prueba>
- **CA2**: ...

---

## 8. Decisiones y Supuestos

1. **<Decisión 1>**: <razón + alternativa rechazada>
2. **<Supuesto 1>**: <qué información del FD se interpretó y cómo>
3. ...

---

## 9. TBD (información no resuelta)

- **TBD 1**: <qué falta> — *Pregunta para el consultor*: <pregunta específica>
- **TBD 2**: ...

(Si no hay TBDs, escribir "Ninguno." y mantener la sección.)
```

> **Las 9 secciones son obligatorias**. Si una sección no aplica para un tipo de objeto puntual (p. ej. "Pantalla de selección" para un BAdI), escribir "No aplica para este tipo de objeto." en vez de omitir.

---

## 8. Modo directo (Q1:B) — aviso prominente

Cuando el sub-agente es invocado directamente (no por `/pipeline-abap`), emite al inicio del TD:

```markdown
> ⚠️ **AVISO — Modo directo**: este TD se generó sin pasar previamente por el Validador (Módulo 1).
> El desarrollador asume garantía de la calidad del FD de entrada.
> Si encuentras inconsistencias, considera ejecutar `/validar-fd <ruta-fd>` antes de continuar.
```

El sub-agente **no se niega** a procesar el FD, pero advierte. Esto es alineado con services.md §3 (Direct Command Invocation).

---

## 9. Modo Reverse Engineering (Q3:A — UC5)

### Activación
El sub-agente detecta automáticamente si el input es código ABAP en lugar de FD usando heurísticas:

- Extensión `.abap` en la ruta.
- Presencia de keywords ABAP en las primeras líneas: `REPORT`, `CLASS ZCL_`, `INTERFACE`, `FUNCTION`, `METHOD`, `DATA:`, etc.
- Estructura sin secciones markdown de FD.

Si confirma código ABAP, entra en modo reverse engineering.

### Output en modo reverse
El TD se llena descriptivamente:
- **§1 Tipo de objeto**: identificado leyendo el código.
- **§3 Objetos SAP**: tablas, FMs, BAdIs **referenciados en el código** (con `⚠️ VERIFICAR: confirmar que existen actualmente`).
- **§4 Arquitectura**: extraída del código (clases, métodos).
- **§5 Campos**: SELECT-OPTIONS, estructuras locales, campos del output.
- **§6 Reglas de Negocio**: **inferidas** del código + `⚠️ VERIFICAR: confirmar con consultor o área de negocio la intención original`.
- **§8 Decisiones y Supuestos**: documentar que es reverse engineering y limitaciones de la inferencia.
- **§9 TBD**: lista lo que NO se pudo inferir del código (intención de negocio, casos borde no implementados, etc.).

### Cabecera distintiva
El TD reverse trae cabecera adicional:
```markdown
> 🔄 **Modo Reverse Engineering**: este TD se generó desde código ABAP existente, no desde un FD.
> Las Reglas de Negocio y Criterios de Aceptación son INFERIDOS del código.
> Validar con el consultor / área de negocio antes de modificar el objeto.
```

---

## 10. Skill `template-alv` — activación explícita con fallback (Q4:B)

Cuando el sub-agente detecta keywords ALV en el FD/contexto:
- "reporte ALV", "ALV", "SALV", "CL_GUI_ALV_GRID", "lista interactiva", "field catalog"

→ **Acción primaria**: asumir que Claude Code activa el skill automáticamente.
→ **Fallback explícito**: si el sub-agente percibe que el contexto del template ALV no está cargado (porque su output empieza a sonar genérico), invoca explícitamente:
```
Read `.claude/skills/template-alv/SKILL.md`
```
y reaplica el patrón.

Esto garantiza que **U3 no rompa** si la activación automática del skill es inconsistente.

---

## 11. Persistencia (Q2:C + Q5:A — heredados)

Cuando se invoca por `/pipeline-abap` o `/generar-td` con `<req-id>`:
- Persiste en `outputs/<YYYY-MM-DD>/<req-id>/td.md` (versión inicial).
- Para regeneraciones con feedback: `td-v2.md`, `td-v3.md`, ...

Cuando se invoca sin `<req-id>`: sólo imprime en chat.

---

## 12. Ciclo de retroalimentación (FR-M2-10)

El desarrollador puede pedir regenerar el TD con feedback específico:

```
Regenera el TD: el patrón ALV elegido es CL_GUI_ALV_GRID, pero el equipo prefiere SALV moderno.
```

El sub-agente:
1. Lee el TD previo (versión actual del archivo).
2. Aplica el cambio solicitado preservando lo correcto.
3. Persiste como `td-vN.md` (siguiente versión).
4. En "Decisiones del TD" documenta el cambio respecto a la versión anterior.

---

## 13. No-objetivos explícitos

- ❌ M2 NO genera código ABAP. Aunque parezca obvio. Esa es responsabilidad de M3.
- ❌ M2 NO contacta al consultor por sí mismo. Las TBDs van en el TD para que el desarrollador decida cómo cerrarlas.
- ❌ M2 NO verifica en SAP que las tablas/FMs identificadas existan (no tiene conexión). Usa `⚠️ VERIFICAR:` cuando no está 100% seguro.
- ❌ M2 NO toma decisiones de transporte, ambiente, ni nada operativo.
