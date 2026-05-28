# Component Methods — Contratos de cada componente

**Fecha**: 2026-05-19
**Nota**: como esta aplicación es **configuración de Claude Code** (prompts + comandos), los "métodos" son **invocaciones lógicas** que el componente expone. La lógica detallada de cada uno se especificará en Functional Design (per-unit, CONSTRUCTION).

---

## C2 — Validador de FD

### `validar(fd: FD) → ResultadoValidacion`

| Atributo | Especificación |
|---|---|
| **Input** | Documento FD en markdown o texto (puede ser ruta a archivo o contenido inline). |
| **Output** | Estructura markdown: `Estado` (APROBADO/RECHAZADO), `Resumen`, `Gaps detectados` (si rechazado), `Observaciones menores` (si aprobado). |
| **Pre-condiciones** | El FD existe y es legible. |
| **Post-condiciones** | Estado binario emitido. Si APROBADO, el FD queda marcado como apto para C3. Si RECHAZADO, el pipeline no avanza. |
| **Side effects** | Ninguno en el sistema SAP. Posible escritura de un reporte en `outputs/<fecha>-<id>/validacion.md` si se invoca desde el orquestador. |
| **Errores** | Si el input no es un FD válido (no es texto, no tiene estructura mínima identificable) → `RECHAZADO` con gap "Formato no reconocido". |

### `analizar_completitud(fd) → list[Gap]` *(método interno conceptual)*

| Atributo | Especificación |
|---|---|
| **Input** | FD parseado. |
| **Output** | Lista de gaps estructurales: secciones faltantes contra `docs/formato-fd-generico.md`. |

### `analizar_calidad_semantica(fd) → list[Gap]` *(método interno conceptual)*

| Atributo | Especificación |
|---|---|
| **Input** | FD parseado. |
| **Output** | Lista de gaps de calidad: descripciones genéricas, criterios de aceptación vagos, casos borde sin definir, autorizaciones sin especificar. |

---

## C3 — Agente FD → TD

### `generar_td(fd_aprobado: FD, requerimiento_id: str) → TD`

| Atributo | Especificación |
|---|---|
| **Input** | FD que pasó por C2 con Estado=APROBADO + identificador del requerimiento. |
| **Output** | Documento TD en markdown con secciones: `Tipo de objeto ABAP`, `Objetos SAP involucrados`, `Arquitectura técnica`, `Campos y flujo`, `Decisiones y Supuestos`, `TBD`. |
| **Pre-condiciones** | FD validado (verificado por C3 leyendo cabecera del FD o señal del orquestador). |
| **Post-condiciones** | TD persistido en `outputs/<fecha>-<requerimiento_id>/td.md` (Q5:A). TD también impreso en el chat (Q2:C). |
| **Side effects** | Escritura del archivo TD. Si C6 (Skill ALV) se activa, su contexto enriquece el output. |
| **Errores** | Si el FD no tiene cabecera de aprobación → rechaza ejecución (FR-M2-01). Si el FD tiene contradicciones internas no detectadas por el validador → marca con `TBD:` (FR-M2-07). |

### `regenerar_td(fd_aprobado, td_previo, feedback) → TD`

| Atributo | Especificación |
|---|---|
| **Input** | FD original + TD previo + feedback específico del desarrollador. |
| **Output** | TD revisado con cambios trazados. |
| **Post-condiciones** | Se incrementa versión en el nombre del archivo: `td-v2.md`, `td-v3.md`, etc. |

---

## C4 — Agente TD → Código ABAP

### `generar_codigo(td_aprobado: TD, requerimiento_id: str) → CodigoABAP`

| Atributo | Especificación |
|---|---|
| **Input** | TD con sección "Decisiones y Supuestos" presente + identificador del requerimiento. |
| **Output** | Archivo `.abap` con: cabecera "Decisiones del código", clases `ZCL_*`, métodos cohesivos, `⚠️ VERIFICAR:` donde aplique, AUTHORITY-CHECK donde toque datos sensibles, referencia al checklist al pie. |
| **Pre-condiciones** | TD trae la sección obligatoria "Decisiones y Supuestos" (FR-M3-01). |
| **Post-condiciones** | Código persistido en `outputs/<fecha>-<requerimiento_id>/codigo.abap`. Impresión inline en chat con syntax highlighting. |
| **Side effects** | Escritura del archivo `.abap`. Si C6 (Skill ALV) se activa, sus patrones se aplican. |
| **Errores** | Si TD incompleto → rechaza ejecución y pide regenerar TD. Si TD trae contradicciones → emite código con `⚠️ VERIFICAR:` extenso y avisa en cabecera. |

### `regenerar_codigo(td, codigo_previo, error_descripcion) → CodigoABAP`

| Atributo | Especificación |
|---|---|
| **Input** | TD + código previo + descripción del error (syntax check fallido, prueba unitaria fallida, lógica incorrecta). |
| **Output** | Código revisado incorporando la corrección, con comentario en cabecera explicando el cambio. |
| **Post-condiciones** | Se incrementa versión: `codigo-v2.abap`, etc. |
| **Errores** | Si el error es ambiguo, pregunta al desarrollador antes de regenerar. Si 2 ciclos fallan → recomienda escalar a desarrollo manual (PRD §7 Journey 4). |

---

## C5 — Orquestador `/pipeline-abap`

### `ejecutar_pipeline(fd_path: str, requerimiento_id: str)`

| Atributo | Especificación |
|---|---|
| **Input** | Ruta al archivo FD + identificador del requerimiento (libre, p. ej. `REQ-2026-042`). |
| **Output** | TD y `.abap` persistidos en `outputs/<fecha>-<requerimiento_id>/`. Resumen final con próximos pasos para el desarrollador. |
| **Pre-condiciones** | FD existe en la ruta indicada. |
| **Post-condiciones** | Pipeline completado con aprobación humana en cada gate, o detenido en algún gate (no avanza sin aprobación). |
| **Side effects** | Crea `outputs/<fecha>-<requerimiento_id>/` con `validacion.md`, `td.md`, `codigo.abap`. |
| **Flujo (FR-OR-01..03)**: | |
| 1. | Invoca C2 con `Agent(subagent_type="validador-fd", prompt=...)`. |
| 2. | Si APROBADO → muestra al usuario el resultado y pregunta "¿Continuar con M2?". Si RECHAZADO → detiene. |
| 3. | Si usuario aprueba → invoca C3 con `Agent(subagent_type="fd-a-td", prompt=...)`. |
| 4. | Muestra TD, pregunta "¿Continuar con M3?". |
| 5. | Si usuario aprueba → invoca C4 con `Agent(subagent_type="td-a-codigo", prompt=...)`. |
| 6. | Muestra `.abap`, referencia checklist (C8), indica próximos pasos. |

---

## C6 — Skill Template ALV

### Activación automática

| Atributo | Especificación |
|---|---|
| **Trigger** | Texto del FD o TD menciona: "reporte ALV", "ALV", "lista interactiva con ALV", "informe ALV", "SALV", "CL_GUI_ALV_GRID" o términos equivalentes. |
| **Output** | Contexto adicional inyectado al modelo: patrones de clase ZCL para ALV, field catalog, métodos preferidos (`select_data`, `process_data`, `display_alv`). |

### `aplicar_patron_alv(td_estructura) → td_estructura_enriquecida` *(conceptual)*

| Atributo | Especificación |
|---|---|
| **Input** | Estructura técnica propuesta por C3. |
| **Output** | Mismo TD con: clase `ZCL_RPT_<nombre>` definida; métodos estándar identificados; field catalog mínimo propuesto. |

---

## C1, C7, C8, C9, C10, C11 — sin métodos

Estos componentes son archivos de configuración/documentación. No exponen métodos invocables. Su "uso" es:
- C1: cargado por Claude Code al iniciar la sesión.
- C7: leído por C2 como referencia de validación.
- C8: referenciado por C4 al pie del output.
- C9: leído por el equipo en la planificación del piloto.
- C10: leído por los desarrolladores como manual.
- C11: leído por Claude Code al iniciar la sesión.

---

## Convenciones de naming de archivos generados (Q5:A)

```
outputs/
└── <YYYY-MM-DD>-<requerimiento_id>/
    ├── validacion.md         (si /pipeline-abap se usa; output de C2)
    ├── fd.md                 (copia del FD original para trazabilidad)
    ├── td.md                 (output de C3, versión inicial)
    ├── td-v2.md              (regeneración si hay feedback)
    ├── codigo.abap           (output de C4, versión inicial)
    ├── codigo-v2.abap        (regeneración si hay error)
    └── decisiones.md         (consolidado de Decisiones y Supuestos + Decisiones del código)
```
