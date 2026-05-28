# Build Instructions

**Producto**: Agente IA para Desarrollo ABAP — configuración de Claude Code (no aplicación tradicional).
**Naturaleza**: No requiere compilación. El "build" consiste en obtener el repositorio, abrirlo con Claude Code y verificar que los componentes están registrados.

---

## Prerequisites

- **Herramienta principal**: Claude Code (CLI, IDE extension o app desktop) — versión vigente con soporte de sub-agentes, slash commands y skills.
- **Sistema operativo**: Windows, macOS o Linux con shell compatible con `bash` (`Bash` tool del agente).
- **Git**: cualquier versión 2.x.
- **No requiere**: compilador, gestor de paquetes (npm/pip/mvn), base de datos, servicios de red, cuenta cloud.

---

## Build Steps

### 1. Obtener el código

```bash
git clone <url-del-repositorio> agente-ia-abap
cd agente-ia-abap
```

Si ya tienes el repo clonado, actualizar:

```bash
git pull --ff-only
```

### 2. Abrir el directorio con Claude Code

- **CLI**: `cd <ruta-al-repo> && claude code` (en la raíz, donde está `CLAUDE.md`).
- **IDE (VS Code/JetBrains)**: abrir la carpeta como workspace; la extensión de Claude Code detecta `CLAUDE.md` y `.claude/`.
- **App desktop**: abrir la carpeta del proyecto.

### 3. Verificar que los componentes están cargados

Dentro de la sesión Claude Code:

```
/help
```

Verificar que los siguientes **slash commands** aparecen disponibles:
- `/validar-fd`
- `/generar-td`
- `/generar-abap`
- `/pipeline-abap`

```
/agents
```

Verificar que los siguientes **sub-agentes** aparecen disponibles:
- `validador-fd`
- `fd-a-td`
- `td-a-codigo`

Y verificar que **skill** `template-alv` está registrado (Claude Code lo activa automáticamente; aparece referenciado en `.claude/skills/template-alv/`).

### 4. Verificación de archivos clave

Estos archivos deben existir tras `git pull`:

```
.claude/
├── settings.json
├── agents/
│   ├── validador-fd.md
│   ├── fd-a-td.md
│   └── td-a-codigo.md
├── commands/
│   ├── validar-fd.md
│   ├── generar-td.md
│   ├── generar-abap.md
│   └── pipeline-abap.md
└── skills/template-alv/
    └── SKILL.md

CLAUDE.md
README.md
docs/
├── formato-fd-generico.md
├── checklist-auditoria-codigo-ia.md
└── plan-evaluacion.md

.gitignore
prd.md
aidlc-rules/   (reglas AI-DLC usadas durante construcción)
aidlc-docs/    (documentación del workflow)
```

Comando de verificación rápida (desde la raíz del repo):

```bash
ls -la CLAUDE.md README.md .gitignore
ls .claude/agents/ .claude/commands/ .claude/skills/template-alv/
ls docs/
```

Salida esperada: todos los archivos listados arriba presentes.

### 5. "Build success" — criterios

El build es exitoso si:
- ✅ Los 4 slash commands aparecen en `/help`.
- ✅ Los 3 sub-agentes aparecen en `/agents`.
- ✅ Los 4 archivos en `docs/` están presentes y son legibles.
- ✅ `CLAUDE.md` carga sin errores (Claude Code no reporta warnings).
- ✅ `.gitignore` incluye `outputs/` (verificar con `cat .gitignore | grep outputs`).

---

## Troubleshooting

### Los slash commands no aparecen en `/help`
- **Causa**: la sesión de Claude Code se abrió desde un directorio distinto a la raíz del repo, o el directorio `.claude/commands/` está mal estructurado.
- **Solución**: cerrar la sesión, navegar a la raíz del repo (donde está `CLAUDE.md`) y reabrir Claude Code desde ahí. Verificar con `pwd` o `ls` que `.claude/commands/*.md` están donde deben.

### Los sub-agentes no aparecen en `/agents`
- **Causa**: los archivos `.md` en `.claude/agents/` no tienen frontmatter válido o falta el campo `name`.
- **Solución**: abrir cada archivo (`validador-fd.md`, `fd-a-td.md`, `td-a-codigo.md`) y verificar que la primera línea es `---`, hay un campo `name:` que coincide con el nombre del archivo, y el cierre `---` está presente.

### El skill `template-alv` no se activa cuando se procesa un FD ALV
- **Causa**: el `description` del frontmatter no contiene suficientes triggers, o Claude Code no reconoce el contexto.
- **Solución alternativa**: los sub-agentes M2/M3 tienen lógica de fallback que invoca `Read .claude/skills/template-alv/SKILL.md` explícitamente — esto garantiza la aplicación del patrón aunque la activación automática falle.

### `CLAUDE.md` reporta warning de tamaño
- **Causa**: `CLAUDE.md` superó las líneas recomendadas y Claude Code lo trunca.
- **Solución**: revisar el archivo y considerar extraer secciones verbosas a documentos referenciados (NFR-U4-MAINT-03 — métodos cortos también aplica a la documentación).

### El comando `/pipeline-abap` falla al invocar un sub-agente
- **Causa**: la tool `Agent` está deshabilitada en `settings.json` o el sub-agente referenciado no existe.
- **Solución**: verificar `.claude/settings.json` (debe tener attribution preservado pero sin restricciones de `permissions`, según AD3). Confirmar que el `subagent_type` invocado coincide con el `name` del archivo en `.claude/agents/`.

---

## Build Artifacts

Tras un build exitoso, los artefactos son los **archivos del repositorio**:

| Categoría | Archivos | Versionado en git |
|---|---|---|
| Configuración del agente | `CLAUDE.md`, `.claude/settings.json` | ✅ Sí |
| Sub-agentes | `.claude/agents/*.md` (3) | ✅ Sí |
| Slash commands | `.claude/commands/*.md` (4) | ✅ Sí |
| Skills | `.claude/skills/template-alv/SKILL.md` | ✅ Sí |
| Documentos referencia | `docs/*.md` (3), `README.md` | ✅ Sí |
| Outputs por requerimiento | `outputs/<fecha>/<req-id>/*` | ❌ No (en `.gitignore`) |
| Documentación AI-DLC | `aidlc-docs/**` | ✅ Sí |

---

## Build Time

Greenfield clone + abrir Claude Code + verificación: **~2 minutos**.

Sin operación de compilación: este producto es **configuración**, no código ejecutable tradicional.
