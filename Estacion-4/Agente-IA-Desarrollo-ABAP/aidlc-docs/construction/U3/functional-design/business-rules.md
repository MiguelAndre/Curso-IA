# U3 — Business Rules: FD → TD

**Unidad**: U3
**Fecha**: 2026-05-19

---

## BR-01 — TD siempre incluye las 9 secciones obligatorias

**Regla**: el TD producido por M2 SIEMPRE tiene las 9 secciones (§7 de `business-logic-model.md`). Si una sección no aplica para el tipo de objeto, contiene "No aplica para este tipo de objeto." en vez de estar omitida.

**Origen**: FR-M2-06, Principio #5, decisión Q2:A.

---

## BR-02 — Aviso de modo directo (Q1:B)

**Regla**: si M2 es invocado fuera del orquestador (vía `/generar-td` directo), el primer bloque del TD es un aviso prominente:

```markdown
> ⚠️ **AVISO — Modo directo**: este TD se generó sin pasar previamente por el Validador (Módulo 1).
> El desarrollador asume garantía de la calidad del FD de entrada.
```

No se niega a procesar — sólo advierte.

**Origen**: Q1:B, services.md §3.

---

## BR-03 — Sin generación de código

**Regla**: M2 NUNCA genera código ABAP, ni siquiera fragmentos ilustrativos en el TD. Los ejemplos de código en el TD se permiten **sólo** como pseudo-código declarativo (no compilable) en la sección §4 Arquitectura cuando ayudan a clarificar el método.

**Origen**: FR-M2-08.

---

## BR-04 — Sección "Decisiones y Supuestos" obligatoria

**Regla**: la sección §8 del TD siempre contiene al menos una entrada. Si M2 no tuvo que tomar decisión alguna ni hacer ningún supuesto (caso improbable), escribir "No se tomaron decisiones interpretativas — el FD era explícito en todos los puntos."

**Origen**: FR-M2-06, Principio #5.

---

## BR-05 — Marcador `TBD:` para información no resuelta

**Regla**: cualquier información del FD que M2 NO pudo resolver con confianza se marca en §9 con formato:

```markdown
- **TBD <n>**: <qué falta> — *Pregunta para el consultor*: <pregunta específica y accionable>.
```

Si no hay TBDs, §9 contiene "Ninguno." pero NO se omite la sección.

**Origen**: FR-M2-07.

---

## BR-06 — Marcador `⚠️ VERIFICAR:` para incertidumbres operativas

**Regla**: para información operativa que M2 *cree* correcta pero no puede confirmar (existencia de tablas Z, FMs específicos, BAdIs concretos), usar inline:

```markdown
- BAPI_MATERIAL_GET_DETAIL (⚠️ VERIFICAR: confirmar disponibilidad en versión SAP del cliente)
```

Esto es DIFERENTE de `TBD:`:
- `⚠️ VERIFICAR:` → "creo que es esto pero confirma"
- `TBD:` → "no sé, necesito que alguien me diga"

**Origen**: FR-M3-04 (heredado), Principio #5.

---

## BR-07 — Identificación obligatoria del tipo de objeto

**Regla**: §1 del TD declara explícitamente el tipo (Reporte ALV / BAdI / Formulario / Conversión / Workflow / Otro) y una frase de justificación. Si no se puede determinar, marcar como "Otro" con `TBD: tipo de objeto`.

**Origen**: FR-M2-02.

---

## BR-08 — Skill `template-alv` activación + fallback (Q4:B)

**Regla**: si M2 detecta en el contexto keywords ALV ("reporte ALV", "SALV", "CL_GUI_ALV_GRID", "lista interactiva", "field catalog"):
1. Asume que Claude Code activa el skill automáticamente.
2. Si su propio output empieza a sonar genérico (sin estructura ZCL_RPT_*, sin field catalog, sin métodos `select_data`/`process_data`/`display_alv`), invoca explícitamente: `Read .claude/skills/template-alv/SKILL.md` como fallback.

**Origen**: Q4:B.

---

## BR-09 — Activación de modo reverse engineering (Q3:A — UC5)

**Regla**: si M2 detecta que el input no es FD sino código ABAP (heurísticas: extensión `.abap`, keywords `REPORT`/`CLASS ZCL_`/`METHOD`/`DATA:` en primeras líneas, ausencia de secciones markdown de FD), activa modo reverse engineering automáticamente y agrega la cabecera distintiva:

```markdown
> 🔄 **Modo Reverse Engineering**: este TD se generó desde código ABAP existente, no desde un FD.
> Las Reglas de Negocio y Criterios de Aceptación son INFERIDOS del código.
```

**Origen**: Q3:A, PRD UC5.

---

## BR-10 — Persistencia con req-id, chat-only sin req-id

**Regla**: si recibe `<req-id>`, persiste el TD en `outputs/<fecha>/<req-id>/td.md` Y lo imprime en chat. Si no recibe `<req-id>`, sólo imprime en chat.

**Origen**: Q2:C, Q5:A (heredadas de Application Design).

---

## BR-11 — Versionado en regeneraciones

**Regla**: cada regeneración con feedback (FR-M2-10) produce una nueva versión: `td-v2.md`, `td-v3.md`, ..., manteniendo las anteriores intactas. El último archivo persistido es la "versión actual"; los anteriores son histórico.

**Origen**: FR-M2-10 + services.md §4 (Per-Request Filesystem Persistence).

---

## BR-12 — Sin invocar al consultor

**Regla**: M2 NUNCA contacta al consultor (no tiene canal). Las preguntas pendientes se documentan en §9 TBD para que el desarrollador las redirija.

**Origen**: Principios #1, #6 (humano ejecuta acciones externas).

---

## BR-13 — Idioma español

**Regla**: el TD se redacta en español. Términos técnicos SAP/ABAP (`SELECT`, `AUTHORITY-CHECK`, nombres de tabla, palabras reservadas) se mantienen en su forma estándar.

**Origen**: NFR-01, FR-M4-07.

---

## BR-14 — Sin inventar nombres de objetos SAP

**Regla**: si M2 no está seguro de que un FM/BAdI/clase existe, NO lo inventa. Opciones:
1. Marcar inline con `(⚠️ VERIFICAR: confirmar existencia)`.
2. Si la duda es total, declarar como `TBD: identificar FM apropiado para <propósito>`.

**Origen**: factualidad (PRD §11.2 M2), RT5 (red-teaming).

---

## BR-15 — Sin propagar contradicciones del FD silenciosamente

**Regla**: si M2 detecta que el FD aprobado (por M1) tiene contradicciones internas que el validador no capturó, debe:
1. Hacer una interpretación razonable y documentarla en §8 Decisiones y Supuestos.
2. Marcar la contradicción como `TBD: el FD dice X en sección N pero Y en sección M; se asume <interpretación>; confirmar con consultor`.

NO ignora la contradicción.

**Origen**: Principio #5, RT4 (red-teaming).

---

## Tabla maestra de comportamiento

| Situación | Comportamiento |
|---|---|
| Invocado por orquestador con FD aprobado | Procesa normal; output con TD completo. |
| Invocado directo con FD válido | Procesa con AVISO prominente al inicio (BR-02). |
| Invocado con código ABAP en lugar de FD | Activa modo reverse engineering automáticamente (BR-09). |
| Detecta ALV | Carga contexto del skill (BR-08). |
| Input ambiguo (contradicciones internas) | Interpretación documentada + TBD (BR-15). |
| Sin `<req-id>` | Sólo chat, no persiste (BR-10). |
| Con `<req-id>` | Chat + persiste en `outputs/<fecha>/<req-id>/td.md` (BR-10). |
| Regeneración con feedback | Nueva versión `td-vN.md` (BR-11). |
| Pregunta del usuario que requiere consultor | TBD en §9 (BR-12). |
