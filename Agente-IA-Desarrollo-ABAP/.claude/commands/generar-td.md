---
description: Genera una Especificación Técnica (TD) a partir de un FD aprobado, o desde código ABAP existente (modo reverse engineering). Invocación directa — emite aviso de modo directo.
argument-hint: <ruta-fd-o-codigo> [req-id]
---

# /generar-td — Invoca el Módulo 2 (FD → TD)

Argumentos recibidos: `$ARGUMENTS`

## Tu tarea

Eres el front del Módulo 2 en modo directo. Tu trabajo es:

1. **Parsear los argumentos**. Espera 1 ó 2:
   - `<ruta-fd-o-codigo>` (obligatorio): ruta a un archivo `.md`/`.txt` (FD) o `.abap` (código existente para reverse engineering).
   - `<req-id>` (opcional): identificador del requerimiento. Habilita persistencia en `outputs/<fecha>/<req-id>/td.md`.

2. **Validar argumentos**:
   - Si no se pasó ningún argumento, responde:
     > "Uso: `/generar-td <ruta-fd-o-codigo> [req-id]`. Ejemplos:
     >   - FD a TD: `/generar-td docs/ejemplos/fd-materiales.md REQ-2026-042`
     >   - Reverse engineering: `/generar-td src/legacy/zr_pedidos.abap REQ-2026-LEG`"
     y termina.
   - Si la ruta no existe (verificable con `Read` o `Glob`), responde:
     > "No pude encontrar el archivo en `<ruta>`. Verifica la ruta relativa al workspace."
     y termina.

3. **Preparar persistencia** (si se pasó `<req-id>`):
   - Calcula la fecha actual en formato `YYYY-MM-DD`.
   - Crea el directorio `outputs/<fecha>/<req-id>/` con `Bash mkdir -p` si no existe.

4. **Invocar al sub-agente `fd-a-td`** usando la tool `Agent`:
   - `subagent_type`: `fd-a-td`
   - `description`: `"Generar TD <req-id-o-nombre-archivo>"`
   - `prompt`: incluir:
     - La ruta del input para que el sub-agente lo lea él mismo.
     - El `<req-id>` si fue pasado.
     - **Instrucción explícita**: "Estás siendo invocado directamente (NO por el orquestador `/pipeline-abap`). Aplica el modo directo con AVISO al inicio del TD según tu §8 y BR-02."
     - "Si el input parece código ABAP (extensión `.abap` o keywords como `REPORT`, `CLASS ZCL_`, `METHOD`), activa modo reverse engineering según tu §9."
     - "Si se pasó `<req-id>`, persiste el TD en `outputs/<fecha>/<req-id>/td.md` usando la tool `Write`."

5. **Procesar el resultado**:
   - El sub-agente devuelve el TD completo en markdown. **Imprime el TD completo en el chat**.
   - **Si el sub-agente persistió el archivo**: confirma con un mensaje:
     > "TD persistido en `outputs/<fecha>/<req-id>/td.md`."
   - **Si el sub-agente NO persistió pero había `<req-id>`**: persiste tú mismo con `Write` la respuesta del sub-agente.

6. **Resumen al final** (1–2 líneas con próximos pasos):
   - Modo normal/directo:
     > "TD generado. Revisa la sección §8 Decisiones y Supuestos y §9 TBDs. Si está bien, ejecuta `/generar-abap <ruta-td> <req-id>` para continuar. Si necesitas cambios, pídelos en este chat (regeneración versionada como `td-v2.md`)."
   - Modo reverse engineering:
     > "TD generado en modo reverse engineering. Las RNs y CAs son INFERIDAS del código — valida con el consultor antes de modificar el objeto."

## Reglas operativas

- **Nunca** intentes generar el TD tú mismo desde este comando. Delega al sub-agente.
- **Nunca** modifiques el output del sub-agente. Lo imprimes tal cual.
- **Siempre** emite el aviso de modo directo al usuario (el sub-agente ya lo incluye en el TD; tu trabajo es no suprimirlo).
- **Idioma**: mensajes al usuario en español.

## Ejemplos de uso

### Ejemplo 1 — FD a TD (modo normal directo)

```
/generar-td docs/ejemplos/fd-materiales-por-proveedor.md REQ-2026-042
```

Comportamiento esperado:
1. Validar que `docs/ejemplos/fd-materiales-por-proveedor.md` existe.
2. Crear `outputs/<YYYY-MM-DD>/REQ-2026-042/`.
3. Invocar `fd-a-td` con el input y `REQ-2026-042`.
4. Sub-agente lee el FD, lo procesa, persiste `td.md`, devuelve el TD inline.
5. Imprimir TD en chat + confirmación de persistencia.
6. Resumen con próximo paso `/generar-abap`.

### Ejemplo 2 — Reverse engineering (UC5)

```
/generar-td src/legacy/zr_reporte_ventas.abap REQ-2026-LEG-001
```

Comportamiento esperado:
1. Validar archivo.
2. Crear directorio de outputs.
3. Invocar `fd-a-td`; el sub-agente detecta `.abap` y activa modo reverse engineering.
4. TD trae la cabecera distintiva "🔄 Modo Reverse Engineering" + sus 9 secciones con RNs/CAs inferidas.
5. Imprimir + persistir.
6. Resumen específico de reverse engineering (validar con consultor antes de modificar).

### Ejemplo 3 — Sin req-id (validación rápida)

```
/generar-td borrador-fd.md
```

Comportamiento esperado:
1. Validar archivo.
2. Invocar sub-agente sin `<req-id>` → NO persistir.
3. Sólo imprime el TD en chat.
4. Resumen final omite la mención de persistencia.
