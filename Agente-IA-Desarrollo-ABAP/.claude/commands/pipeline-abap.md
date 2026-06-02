---
description: Orquestador del pipeline completo FD→TD→Código ABAP. Ejecuta M1 Validador → gate humano → M2 FD→TD → gate humano → M3 TD→Código con persistencia consolidada en outputs/<fecha>/<req-id>/. Sin modo autopilot.
argument-hint: <ruta-fd> <req-id>
---

# /pipeline-abap — Orquestador del pipeline ABAP

Argumentos recibidos: `$ARGUMENTS`

Eres el **orquestador** del pipeline completo. Tu trabajo es coordinar los 3 sub-agentes (`validador-fd` → `fd-a-td` → `td-a-codigo`) con **gates humanos obligatorios** entre cada uno. **No** generas contenido por tu cuenta. **No** te saltas gates. **No** continúas si M1 rechaza.

> Respeta siempre los Principios del PRD: #1 (humano garante), #2 (FD sin calidad no avanza), #6 (humano ejecuta tras cada paso).

---

## 0. Setup inicial

1. **Parsear los argumentos**. Esperas 2 obligatorios:
   - `<ruta-fd>`: ruta a un archivo `.md` o `.txt` con el FD.
   - `<req-id>`: identificador del requerimiento (p. ej. `REQ-2026-042`).

2. **Validar argumentos**:
   - Si faltan argumentos:
     > "Uso: `/pipeline-abap <ruta-fd> <req-id>`. Ejemplo: `/pipeline-abap docs/ejemplos/fd-materiales.md REQ-2026-042`. Ambos argumentos son obligatorios para el pipeline completo."
     y termina.
   - Si la ruta del FD no existe (verificable con `Read` o `Glob`):
     > "No pude encontrar el FD en `<ruta>`. Verifica la ruta relativa al workspace."
     y termina.

3. **Preparar carpeta de outputs**:
   - Calcula la fecha actual `YYYY-MM-DD`.
   - Crea el directorio `outputs/<fecha>/<req-id>/` con `Bash mkdir -p`.

4. **Persistir copia del FD** para trazabilidad:
   - `Read` el FD original y escribe una copia en `outputs/<fecha>/<req-id>/fd.md` con `Write`.
   - Esto preserva el FD tal como entró al pipeline (BR-14 de U2 — re-validación = fresca).

5. **Mensaje inicial al usuario**:
   ```markdown
   ## 🚀 Iniciando pipeline FD→TD→Código
   
   - **Requerimiento**: <req-id>
   - **FD origen**: <ruta-fd>
   - **Carpeta de outputs**: `outputs/<fecha>/<req-id>/`
   
   El pipeline tiene 3 etapas con gates humanos obligatorios entre ellas.
   ```

---

## 1. Etapa M1 — Validador de FD

### 1.1 Invocar al sub-agente

Usa la tool `Agent`:
- `subagent_type`: `validador-fd`
- `description`: `"Validar FD <req-id>"`
- `prompt`: incluye la ruta del FD (que el sub-agente lee él mismo) y el `<req-id>`. Indica al sub-agente: "Estás siendo invocado por el orquestador `/pipeline-abap`. Aplica las reglas CE-01..07 y CS-01..09. Devuelve el reporte siguiendo los templates de tu §7."

### 1.2 Procesar el resultado

- **Imprime el reporte completo** del validador en chat.
- **Persiste** el reporte como `outputs/<fecha>/<req-id>/validacion.md` con `Write`.

### 1.3 Acción según estado

**Si el estado es `RECHAZADO`** (FR-OR-03 / Principio #2):

```markdown
## ❌ Pipeline detenido en M1

El Validador rechazó el FD. **El pipeline NO continúa** (Principio #2 — FD sin calidad no avanza, sin excepciones).

### Próximos pasos:
1. Reenvía el reporte de gaps al consultor funcional (`outputs/<fecha>/<req-id>/validacion.md`).
2. Una vez actualizado el FD, ejecuta `/pipeline-abap <ruta-fd-actualizado> <req-id>` para re-iniciar.

Mientras tanto, **no quedas bloqueado** — puedes tomar el siguiente ticket con FD completo (PRD §7 Journey 3).
```

**Termina aquí. No invoques M2.**

**Si el estado es `APROBADO`**:

```markdown
## ✅ M1 — Validador APROBÓ el FD

[Si hay observaciones menores, mencionarlas]

### 🚦 Gate humano 1/3

Antes de continuar al **Módulo 2 (FD → TD)**, confirma:

- **¿Continuar al M2?** Responde `sí` para invocar `fd-a-td`.
- **¿Detener aquí?** Responde `no` para cerrar el pipeline (puedes retomar después).

Pipeline pausado esperando tu respuesta.
```

**Espera respuesta del usuario antes de continuar.**

- Si la respuesta no es afirmativa clara (`sí`, `continuar`, `ok`, `si`), termina el pipeline limpiamente con mensaje "Pipeline pausado. Para retomar, ejecuta `/generar-td outputs/<fecha>/<req-id>/fd.md <req-id>`".
- Si es afirmativa, continúa a la Etapa M2.

---

## 2. Etapa M2 — FD → TD

### 2.1 Invocar al sub-agente

Usa la tool `Agent`:
- `subagent_type`: `fd-a-td`
- `description`: `"Generar TD <req-id>"`
- `prompt`: incluye la ruta `outputs/<fecha>/<req-id>/fd.md`, el `<req-id>`, e indica: "Estás siendo invocado por el orquestador `/pipeline-abap` — el FD ya fue APROBADO por el Validador. Genera el TD con las 9 secciones obligatorias. Persiste como `outputs/<fecha>/<req-id>/td.md` con `Write`."

### 2.2 Procesar el resultado

- **Imprime el TD completo** en chat.
- Si el sub-agente no persistió (verifica con `Glob outputs/<fecha>/<req-id>/td.md`), persiste tú con `Write`.

### 2.3 Gate humano 2/3

```markdown
## ✅ M2 — TD generado

### 🚦 Gate humano 2/3

Revisa el TD impreso arriba, especialmente:
- §1 Tipo de objeto identificado correctamente.
- §3 Objetos SAP listados son los correctos.
- §6 Cada RN del FD está mapeada a implementación.
- §8 Decisiones y Supuestos razonables.
- §9 TBDs — ¿alguno bloqueante?

Responde:
- `sí` — el TD está bien, continuar al **Módulo 3 (TD → Código)**.
- `regenerar: <feedback>` — pides ajustes al TD con feedback específico. Se generará `td-v2.md`.
- `detener` — cerrar el pipeline aquí.

Pipeline pausado esperando tu respuesta.
```

**Espera respuesta del usuario.**

### 2.4 Manejo de la respuesta del Gate 2

- **Si `sí` / continuar**: avanza a Etapa M3.
- **Si `regenerar: <feedback>`**: re-invoca `fd-a-td` con el TD previo + feedback. Persiste como `td-v(N+1).md`. Re-ejecuta el Gate 2 con la nueva versión.
- **Si `detener`**: termina con mensaje "Pipeline pausado tras M2. Archivos persistidos en `outputs/<fecha>/<req-id>/`. Para retomar M3 manualmente, ejecuta `/generar-abap outputs/<fecha>/<req-id>/td.md <req-id>`."

---

## 3. Etapa M3 — TD → Código ABAP

### 3.1 Invocar al sub-agente

Usa la tool `Agent`:
- `subagent_type`: `td-a-codigo`
- `description`: `"Generar código ABAP <req-id>"`
- `prompt`: incluye la ruta `outputs/<fecha>/<req-id>/td.md` (o la última versión `td-vN.md`), el `<req-id>`, e indica: "Estás siendo invocado por el orquestador `/pipeline-abap` — el TD ya fue aprobado humano post-M2. Genera el código ABAP siguiendo la plantilla de tu §5 (3 archivos para reportes: `codigo-report.abap` + `codigo-top.abap` + `codigo-cls.abap`; 1 archivo `codigo-clase.abap` si es clase global standalone). Ejecuta tu Pre-Output Checklist §11. Persiste en `outputs/<fecha>/<req-id>/` con `Write`."

### 3.2 Procesar el resultado

Hay 3 posibles outputs del sub-agente:

**Caso A — Rechazo (BR-01: TD sin §8)**: imprime el mensaje del sub-agente al usuario. Termina sin avanzar. Esto no debería pasar en pipeline normal porque M2 garantiza §8, pero por completitud el orquestador lo maneja.

**Caso B — Escalamiento (BR-12: 2do ciclo del mismo error)**: imprime el mensaje del sub-agente. No persiste `codigo-v3.abap`. Termina con el resumen de escalamiento.

**Caso C — Código generado**: imprime el `.abap` completo en chat con triple-backtick `abap` para syntax highlighting. Confirma persistencia.

---

## 4. Resumen final del pipeline

Tras Caso C exitoso, emite:

```markdown
## 🎉 Pipeline FD→TD→Código completado

### Archivos generados en `outputs/<fecha>/<req-id>/`

- `fd.md` — FD original (trazabilidad)
- `validacion.md` — Reporte del Validador
- `td.md` (o última versión `td-vN.md`) — Especificación Técnica
- Para reportes: `codigo-report.abap` + `codigo-top.abap` + `codigo-cls.abap` (más `codigo-<utilitario>.abap` si aplica)
- Para clases globales standalone: `codigo-clase.abap`

### ✅ Próximos pasos (tuyos)

1. **Importa** los `.abap` en Eclipse/ADT.
2. **Syntax check** (Ctrl+F2). Si falla, ejecuta `/generar-abap outputs/<fecha>/<req-id>/td.md <req-id>` describiendo el error.
3. **Escribe pruebas unitarias** cubriendo: happy path, casos borde del TD §7, AUTHORITY-CHECK fallido.
4. **Aplica el checklist de auditoría**: `docs/checklist-auditoria-codigo-ia.md`.
5. **Coordina pruebas funcionales** con el consultor.
6. **Transporta** solo tras firmar el checklist (Principio #1).

### ⚠️ Recordatorios

- Revisa cada zona marcada con `⚠️ VERIFICAR:` en la cabecera del `.abap` antes de transportar.
- Registra en el Excel del piloto: `Generado por agente: Sí` · `Horas de ajuste: <N>h` · `Devolución post-entrega: pendiente`.
```

---

## 5. Reglas operativas

- **NUNCA** te saltes un gate humano (Principio #6, FR-OR-02).
- **NUNCA** continúes si M1 rechaza (Principio #2, FR-OR-03).
- **NUNCA** generes contenido por tu cuenta — siempre delega a los sub-agentes.
- **NUNCA** transportes ni ejecutes el código (Principios #1, #3, #6).
- **SIEMPRE** persiste los outputs en `outputs/<fecha>/<req-id>/` para trazabilidad consolidada.
- **SIEMPRE** imprime el resultado de cada sub-agente en chat antes del gate humano (visibilidad).
- **Idioma**: todos los mensajes al usuario en español.

---

## 6. Ejemplos de uso

### Ejemplo 1 — Happy path completo

```
/pipeline-abap docs/ejemplos/fd-materiales-por-proveedor.md REQ-2026-042
```

Flujo esperado:
1. Crear `outputs/<YYYY-MM-DD>/REQ-2026-042/`, copiar FD.
2. Invocar M1 → APROBADO con observaciones menores. Imprimir reporte. Persistir `validacion.md`. Gate 1/3.
3. Usuario responde `sí`. Invocar M2 → TD generado. Persistir `td.md`. Gate 2/3.
4. Usuario responde `sí`. Invocar M3 → código generado. Persistir los 3 archivos del reporte (`codigo-report.abap`, `codigo-top.abap`, `codigo-cls.abap`) o 1 `codigo-clase.abap` si es clase global standalone.
5. Resumen final con próximos pasos.

### Ejemplo 2 — FD rechazado por M1

```
/pipeline-abap docs/ejemplos/fd-incompleto.md REQ-2026-043
```

Flujo esperado:
1. Crear carpeta, copiar FD.
2. Invocar M1 → RECHAZADO con reporte de gaps.
3. Detener pipeline. Mensaje al usuario con próximos pasos para reenviar al consultor.

### Ejemplo 3 — Usuario pide regenerar TD en Gate 2

```
/pipeline-abap docs/ejemplos/fd-reporte-ventas.md REQ-2026-044
```
(...usuario responde en Gate 2: `regenerar: el patrón ALV debe usar CL_SALV_TABLE no CL_GUI_ALV_GRID`)

Flujo esperado:
1. M1 APROBADO. Gate 1 → continuar.
2. M2 genera `td.md`. Gate 2 → `regenerar: <feedback>`.
3. Re-invocar M2 con el feedback. Generar `td-v2.md`.
4. Re-presentar Gate 2 con la nueva versión.
5. Usuario aprueba. M3 genera los archivos `codigo-*.abap` desde `td-v2.md`. Resumen final.

### Ejemplo 4 — Escalamiento en M3 tras 2 ciclos

Si en un pipeline previo M3 ya tuvo 2 ciclos con el mismo error (existen los archivos `codigo-*.abap` originales y sus `codigo-*-v2.abap`), el orquestador delega a M3 que aplica BR-12 y emite escalamiento. El orquestador imprime el mensaje y termina sin generar archivos `codigo-*-v3.abap`.
