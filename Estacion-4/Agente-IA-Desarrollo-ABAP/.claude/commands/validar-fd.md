---
description: Valida un Documento Funcional contra el formato genérico. Devuelve APROBADO/RECHAZADO con reporte de gaps accionable.
argument-hint: <ruta-al-fd.md> [req-id]
---

# /validar-fd — Invoca el Módulo 1 (Validador de FD)

Argumentos recibidos: `$ARGUMENTS`

## Tu tarea

Eres el front del Módulo 1. Tu trabajo es:

1. **Parsear los argumentos**. Espera 1 ó 2:
   - `<ruta-al-fd>` (obligatorio): ruta a un archivo `.md` o `.txt` con el FD a validar.
   - `<req-id>` (opcional): identificador del requerimiento, p. ej. `REQ-2026-042`. Habilita persistencia.

2. **Validar la ruta**:
   - Si no se pasó ningún argumento, responde:
     > "Uso: `/validar-fd <ruta-al-fd> [req-id]`. Ejemplo: `/validar-fd docs/ejemplos/fd-materiales.md REQ-2026-042`"
     y termina.
   - Si la ruta no apunta a un archivo legible (verificable con `Read` o `Glob`), responde con un mensaje claro:
     > "No pude encontrar el archivo en `<ruta>`. Verifica la ruta relativa al workspace o usa una ruta absoluta."
     y termina.

3. **Invocar al sub-agente `validador-fd`** usando la tool `Agent`:
   - `subagent_type`: `validador-fd`
   - `description`: `"Validar FD <req-id-o-nombre-archivo>"`
   - `prompt`: incluir:
     - La ruta del FD para que el sub-agente lo lea él mismo (no copies el contenido si es muy largo).
     - El `<req-id>` si fue pasado.
     - Instrucción explícita: "Lee el FD en la ruta indicada, aplica las reglas CE-* y CS-* documentadas en tu system prompt, y devuelve el reporte siguiendo los templates de tu §7."

4. **Procesar el resultado**:
   - Si el sub-agente devuelve un reporte (markdown con estado APROBADO/RECHAZADO):
     - **Imprime el reporte completo en el chat**.
     - **Si `<req-id>` fue pasado**: persiste el reporte en `outputs/<fecha-actual-YYYY-MM-DD>/<req-id>/validacion.md` usando la tool `Write`. Crea el directorio con `Bash mkdir -p` si no existe.
     - **Si NO se pasó `<req-id>`**: solo muestra en chat. No persistas.
   - Si el sub-agente devuelve una **redirección** (input no es FD), retransmite ese mensaje al usuario tal cual.

5. **Resumen al final** (1–2 líneas):
   - Si APROBADO: "FD aprobado. Próximo paso: `/generar-td <ruta-fd> <req-id>` o usa el orquestador `/pipeline-abap` para ejecutar el flujo completo."
   - Si RECHAZADO: "FD rechazado. Reenvía el reporte de gaps al consultor funcional para corrección. Cuando devuelva el FD actualizado, vuelve a ejecutar `/validar-fd`."

## Reglas operativas

- **Nunca** intentes validar el FD tú mismo desde este comando. Delega al sub-agente.
- **Nunca** modifiques el reporte del sub-agente. Lo imprimes tal cual.
- **Nunca** apruebes un FD si el sub-agente lo rechazó. No hay bypass (Principio #2 del PRD).
- **Idioma**: todos los mensajes al usuario en español.

## Ejemplo de uso

```
/validar-fd docs/ejemplos/fd-materiales-por-proveedor.md REQ-2026-042
```

Comportamiento esperado:
1. El comando verifica que `docs/ejemplos/fd-materiales-por-proveedor.md` existe.
2. Invoca al sub-agente `validador-fd` con esa ruta y `REQ-2026-042`.
3. El sub-agente lee el FD, aplica reglas, devuelve el reporte.
4. El comando imprime el reporte en chat.
5. El comando persiste el reporte en `outputs/<YYYY-MM-DD>/REQ-2026-042/validacion.md`.
6. El comando muestra el resumen con próximos pasos.
