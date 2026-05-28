---
description: Valida un Documento Funcional contra el formato genérico. Acepta .md, .txt, .pdf y .docx; normaliza a markdown antes de validar. Devuelve APROBADO/RECHAZADO con reporte de gaps accionable.
argument-hint: <ruta-al-fd> [req-id]
---

# /validar-fd — Invoca el Módulo 1 (Validador de FD)

Argumentos recibidos: `$ARGUMENTS`

## Tu tarea

Eres el front del Módulo 1. Tu trabajo es:

1. **Parsear los argumentos**. Espera 1 ó 2:
   - `<ruta-al-fd>` (obligatorio): ruta a un archivo con el FD a validar. Extensiones aceptadas: `.md`, `.txt`, `.pdf`, `.docx`.
   - `<req-id>` (opcional): identificador del requerimiento, p. ej. `REQ-2026-042`. Habilita persistencia.

2. **Validar la ruta**:
   - Si no se pasó ningún argumento, responde:
     > "Uso: `/validar-fd <ruta-al-fd> [req-id]`. Ejemplo: `/validar-fd docs/ejemplos/fd-materiales.md REQ-2026-042`. Formatos aceptados: `.md`, `.txt`, `.pdf`, `.docx`."
     y termina.
   - Si la ruta no apunta a un archivo legible (verificable con `Read` o `Glob`), responde con un mensaje claro:
     > "No pude encontrar el archivo en `<ruta>`. Verifica la ruta relativa al workspace o usa una ruta absoluta."
     y termina.
   - Si la extensión no está en `{md, txt, pdf, docx}`, responde:
     > "Formato no soportado: `<ext>`. Aceptados: `.md`, `.txt`, `.pdf`, `.docx`. Convierte el archivo o copia el contenido inline."
     y termina.

3. **Normalizar a markdown** (paso crítico del nuevo contrato de entrada multi-formato — decisión Q3 del plan U2):

   Determina la extensión del archivo y aplica la estrategia correspondiente:

   | Extensión | Estrategia |
   |---|---|
   | `.md` | Pasa la ruta tal cual al sub-agente. No requiere conversión. |
   | `.txt` | Pasa la ruta tal cual. El sub-agente lo procesa como markdown plano. |
   | `.pdf` | Pasa la ruta tal cual. La tool `Read` del sub-agente soporta PDF nativamente (hasta 20 páginas por request). Si el PDF tiene más de 20 páginas, avisa al usuario y abortá la validación. |
   | `.docx` | Convertir a markdown vía `Bash`: `pandoc "<ruta>" -o "<ruta-tmp>.md" -t markdown`. Si pandoc no está disponible (exit code 127 o "command not found"), responde: *"No pude convertir el `.docx` automáticamente — pandoc no está instalado. Convertí el archivo manualmente a `.md` o `.pdf` y reintentá."* y termina. |

   **Persistencia del markdown normalizado**:
   - Si `<req-id>` fue pasado, además guardá una copia del markdown normalizado en `outputs/<YYYY-MM-DD>/<req-id>/fd.md` con la tool `Write` (creá el directorio con `Bash mkdir -p` si no existe).
   - Si NO se pasó `<req-id>`, dejá el `.md` temporal solo en memoria para el sub-agente (no persistas).

4. **Invocar al sub-agente `validador-fd`** usando la tool `Agent`:
   - `subagent_type`: `validador-fd`
   - `description`: `"Validar FD <req-id-o-nombre-archivo>"`
   - `prompt`: incluir:
     - La ruta del FD normalizado en markdown para que el sub-agente lo lea él mismo.
     - El `<req-id>` si fue pasado.
     - Instrucción explícita: "Lee el FD en la ruta indicada (ya viene normalizado a markdown), aplica las reglas CE-* y CS-* documentadas en tu system prompt, y devuelve el reporte siguiendo los templates de tu §7."

5. **Procesar el resultado**:
   - Si el sub-agente devuelve un reporte (markdown con estado APROBADO/RECHAZADO):
     - **Imprime el reporte completo en el chat**.
     - **Si `<req-id>` fue pasado**: persiste el reporte en `outputs/<YYYY-MM-DD>/<req-id>/validacion.md` usando la tool `Write`. El archivo `fd.md` normalizado ya quedó persistido en el paso 3.
     - **Si NO se pasó `<req-id>`**: solo muestra en chat. No persistas.
   - Si el sub-agente devuelve una **redirección** (input no es FD), retransmite ese mensaje al usuario tal cual.

6. **Resumen al final** (1–2 líneas):
   - Si APROBADO: "FD aprobado. Próximo paso: `/generar-td <ruta-fd-normalizado> <req-id>` o usa el orquestador `/pipeline-abap` para ejecutar el flujo completo."
   - Si RECHAZADO: "FD rechazado. Reenvía el reporte de gaps al consultor funcional para corrección. Cuando devuelva el FD actualizado, vuelve a ejecutar `/validar-fd`."

## Reglas operativas

- **Nunca** intentes validar el FD tú mismo desde este comando. Delega al sub-agente.
- **Nunca** modifiques el reporte del sub-agente. Lo imprimes tal cual.
- **Nunca** apruebes un FD si el sub-agente lo rechazó. No hay bypass (Principio #2 del PRD).
- **Nunca** envíes al sub-agente un archivo binario (`.docx`, `.pdf` ya leído como bytes). El sub-agente siempre recibe markdown — la conversión se hace en el paso 3.
- **Idioma**: todos los mensajes al usuario en español.

## Ejemplo de uso

### Caso 1 — FD en markdown
```
/validar-fd docs/ejemplos/fd-materiales-por-proveedor.md REQ-2026-042
```
Comportamiento: pasa directo al sub-agente (paso 3 estrategia `.md`).

### Caso 2 — FD en docx
```
/validar-fd C:\Users\dev\fd-pedidos.docx REQ-2026-043
```
Comportamiento:
1. Verifica que el archivo existe.
2. Ejecuta `pandoc "C:\Users\dev\fd-pedidos.docx" -o "outputs/2026-05-20/REQ-2026-043/fd.md" -t markdown`.
3. Si pandoc disponible: persiste `fd.md`, invoca sub-agente con esa ruta.
4. Si pandoc NO disponible: error con instrucción para conversión manual.

### Caso 3 — FD en PDF
```
/validar-fd docs/ejemplos/fd-conversion-clientes.pdf REQ-2026-044
```
Comportamiento: pasa directo al sub-agente; `Read` interpreta el PDF nativamente.
