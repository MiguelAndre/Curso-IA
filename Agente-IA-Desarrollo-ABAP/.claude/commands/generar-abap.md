---
description: Genera código ABAP OO compilable a partir de un TD aprobado. Aplica AUTHORITY-CHECK, SQL seguro, sin PII. Versiona regeneraciones con feedback y escala a manual tras 2 ciclos del mismo error.
argument-hint: <ruta-td> [req-id]
---

# /generar-abap — Invoca el Módulo 3 (TD → Código ABAP)

Argumentos recibidos: `$ARGUMENTS`

## Tu tarea

Eres el front del Módulo 3 en modo directo. Tu trabajo es:

1. **Parsear los argumentos**. Espera 1 ó 2:
   - `<ruta-td>` (obligatorio): ruta a un archivo `.md` con un TD aprobado (típicamente `outputs/<fecha>/<req-id>/td.md` o `td-vN.md`).
   - `<req-id>` (opcional): identificador del requerimiento. Habilita persistencia en `outputs/<fecha>/<req-id>/codigo[-vN].abap`.

2. **Validar argumentos**:
   - Si no se pasó ningún argumento:
     > "Uso: `/generar-abap <ruta-td> [req-id]`. Ejemplo: `/generar-abap outputs/2026-05-20/REQ-2026-042/td.md REQ-2026-042`"
     y termina.
   - Si la ruta no existe (verificable con `Read` o `Glob`):
     > "No pude encontrar el TD en `<ruta>`. Verifica la ruta relativa al workspace."
     y termina.

3. **Detectar regeneración**:
   - Si se pasó `<req-id>`, calcula la fecha actual `YYYY-MM-DD` y verifica si ya existen archivos `codigo*.abap` en `outputs/<fecha>/<req-id>/`.
   - Si existen, identifica la versión actual más alta (p. ej. `codigo-v2.abap` indica próximo será `codigo-v3.abap`).
   - **Si la versión próxima sería v3** (es decir, ya hubo 2 ciclos previos), pregunta al usuario:
     > "Este sería el 3er intento de generación para este requerimiento. Según BR-12 del PRD, si el error que reportas es del mismo tipo que el ciclo anterior, debería escalar a desarrollo manual. ¿El error que reportas es: (a) del mismo tipo que el último ciclo, o (b) un error diferente? Responde 'a' o 'b'."
   - Si el usuario responde 'a' o equivalente, el sub-agente activará BR-12 escalation y NO generará v3.

4. **Preparar persistencia** (si se pasó `<req-id>`):
   - Crea el directorio `outputs/<fecha>/<req-id>/` con `Bash mkdir -p` si no existe.

5. **Invocar al sub-agente `td-a-codigo`** usando la tool `Agent`:
   - `subagent_type`: `td-a-codigo`
   - `description`: `"Generar código ABAP <req-id-o-nombre-td>"`
   - `prompt`: incluir:
     - La ruta del TD para que el sub-agente lo lea él mismo.
     - El `<req-id>` si fue pasado.
     - Si es regeneración: la ruta de la versión previa del código + descripción del error que dio el usuario al invocar.
     - "Aplica las verificaciones de tu §3 (BR-01) sobre el TD entrante. Si trae §8 con contenido y §9 sin TBDs bloqueantes, procede."
     - "Si se pasó `<req-id>`, persiste el código con `Write` en `outputs/<fecha>/<req-id>/codigo[-vN].abap` siguiendo el versionado de tu §8."

6. **Procesar el resultado**:
   - Si el sub-agente devolvió **mensaje de rechazo** (BR-01: TD sin §8, o TBDs bloqueantes): imprime el mensaje al usuario y termina.
   - Si el sub-agente devolvió **mensaje de escalamiento** (BR-12): imprime el mensaje al usuario y termina sin persistir.
   - Si el sub-agente devolvió el código `.abap`: **imprime el contenido completo en el chat** con sintaxis ABAP highlighted (triple-backtick `abap`).
   - **Si el sub-agente persistió el archivo**: confirma:
     > "Código persistido en `outputs/<fecha>/<req-id>/codigo[-vN].abap`."
   - **Si NO persistió pero había `<req-id>`**: persiste tú mismo con `Write` la respuesta del sub-agente.

7. **Resumen final con próximos pasos** (cuando se generó código exitosamente):

   ```markdown
   ## ✅ Código generado. Próximos pasos:
   
   1. **Importa el `.abap`** en Eclipse/ADT (Workbench).
   2. **Pasa syntax check** (Ctrl+F2). Si falla, vuelve a ejecutarme con: `/generar-abap <ruta-td> <req-id>` y describe el error específico.
   3. **Escribe pruebas unitarias** cubriendo (mínimo): happy path, casos borde del TD §7, AUTHORITY-CHECK fallido.
   4. **Aplica el checklist de auditoría**: `docs/checklist-auditoria-codigo-ia.md`.
   5. **Coordina pruebas funcionales** con el consultor.
   6. **Transporta** solo tras firmar el checklist (Principio #1).
   
   ⚠️ **Zonas marcadas con VERIFICAR**: revísalas explícitamente antes del checklist.
   ```

## Reglas operativas

- **Nunca** generes el código tú mismo desde este comando. Delega al sub-agente.
- **Nunca** modifiques el output del sub-agente. Lo imprimes tal cual.
- **Nunca** apruebes ni transportes. Tu trabajo termina al imprimir el código y persistirlo.
- **Idioma**: mensajes al usuario en español.

## Ejemplos de uso

### Ejemplo 1 — Primera generación (modo normal)

```
/generar-abap outputs/2026-05-20/REQ-2026-042/td.md REQ-2026-042
```

Comportamiento esperado:
1. Validar archivo TD.
2. Crear `outputs/2026-05-20/REQ-2026-042/` si no existe.
3. Invocar `td-a-codigo` con el TD y `REQ-2026-042`.
4. Sub-agente verifica §8, identifica zonas de riesgo, genera código, persiste `codigo.abap`.
5. Imprimir código en chat + confirmación de persistencia + resumen con próximos pasos.

### Ejemplo 2 — Regeneración tras error (1er ciclo)

```
/generar-abap outputs/2026-05-20/REQ-2026-042/td.md REQ-2026-042
```
(usuario describe en el mismo prompt: "el código falló con 'field MARC-MTART not found in structure'. El método select_data no parece hacer el JOIN.")

Comportamiento esperado:
1. Validar archivo TD.
2. Detectar `codigo.abap` ya existente → próxima versión: `codigo-v2.abap` (1er ciclo).
3. Invocar sub-agente pasando código previo + descripción del error.
4. Sub-agente regenera, persiste `codigo-v2.abap` con cambio documentado en cabecera bloque 2.
5. Imprimir + resumen.

### Ejemplo 3 — 3er intento, mismo error (escalamiento BR-12)

```
/generar-abap outputs/2026-05-20/REQ-2026-042/td.md REQ-2026-042
```
(usuario describe: "sigue fallando en el JOIN MARA-MARC.")

Comportamiento esperado:
1. Detectar `codigo-v2.abap` ya existe → próxima sería `codigo-v3.abap`.
2. Preguntar al usuario si el error es del mismo tipo que el ciclo previo.
3. Si usuario responde 'a' (mismo tipo): el sub-agente activa BR-12 — emite mensaje de escalamiento. NO se persiste `codigo-v3.abap`.
4. Imprimir mensaje de escalamiento al usuario con instrucciones para desarrollo manual desde el TD.

### Ejemplo 4 — Sin req-id

```
/generar-abap docs/ejemplos/td-prueba.md
```

Comportamiento esperado:
1. Validar archivo TD.
2. Invocar sub-agente sin `<req-id>` → NO persistir.
3. Sólo imprimir código en chat.
4. Resumen sin mención de persistencia (los próximos pasos siguen aplicando).
