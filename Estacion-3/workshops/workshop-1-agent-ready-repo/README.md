# Workshop 1 · Configura tu agente sobre tu proyecto

> Hardcore AI · 30X · Clase 3 — Ingeniería de Software Agéntica
> **Duración:** 90 minutos · **Modalidad:** Hands-on sobre tu propio repo

---

## 🎯 Objetivo

Al terminar este workshop tu repositorio personal será **agent-ready**: cualquier coding agent (Claude Code, Cursor, OpenCode) podrá entender qué hace tu producto, qué convenciones sigue, qué puede hacer sin pedir permiso, y qué tiene prohibido tocar — todo sin que tengas que repetir contexto en cada conversación.

Eso significa que el resto del programa, desde la implementación de la Clase 4 hasta el deploy de la Clase 9, lo vas a hacer sobre un repo donde el agente trabaja con calidad y autonomía, no donde adivina en cada prompt.

---

## ✅ Pre-requisitos

Antes de empezar este workshop debes tener:

- [ ] Claude Code instalado y autenticado (`claude --version` responde sin errores)
- [ ] Tu repo del programa clonado localmente (el que vas a usar como producto del Demo Day)
- [ ] El repo tiene al menos un commit inicial (puede ser solo el README — no necesita features todavía)
- [ ] Editor de texto de tu preferencia abierto sobre el repo
- [ ] Este kit clonado o descomprimido en una ubicación accesible

---

## 📦 Cómo usar este kit

Este repo tiene dos carpetas clave:

### `templates/`

Archivos genéricos con secciones a llenar. Los copias a tu repo y los personalizas con la información de tu producto.

```
templates/
├── AGENTS.md           ← contexto del proyecto cross-tool (Cursor, Claude, etc.)
├── CLAUDE.md           ← configuración específica de Claude Code
├── settings.json       ← permisos allow/deny del agente
└── hooks/
    ├── post-edit-lint.sh    ← se ejecuta después de cada edición de archivo
    └── pre-tool-block.sh    ← bloquea acciones destructivas antes de ejecutarse
```

### `examples/`

Los mismos archivos pero **completamente llenos** sobre un proyecto de referencia (un CRM en Next.js + Prisma). Úsalos como "ejemplo de cómo se ve esto cuando está bien hecho". No los copies tal cual — son referencia, no plantilla.

```
examples/
├── AGENTS.md           ← AGENTS.md de ejemplo, lleno
├── CLAUDE.md           ← CLAUDE.md de ejemplo, lleno
└── settings.json       ← settings.json de ejemplo, lleno
```

---

## 🗺 Estructura del workshop

Los 90 minutos están distribuidos en 6 bloques. El instructor te lleva por el primer bloque en vivo y luego tú trabajas con sus indicaciones, mientras él circula resolviendo dudas individuales.

### Bloque 1 · Punto de partida · 10 min

Abre tu repo en una terminal y ejecuta `claude`. Hazle un prompt simple sobre tu producto:

```
dame un overview de este proyecto: qué hace, su arquitectura,
qué archivos son los más importantes
```

Observa el output. Probablemente verás que el agente:
- Lee bastantes archivos antes de responder
- Hace conclusiones razonables pero no profundas
- No conoce las convenciones del equipo
- No sabe qué archivos son sensibles

Este es tu **baseline**. Lo vas a comparar al final del workshop. Guarda el output en un archivo de notas o tómale un screenshot.

### Bloque 2 · Crear `AGENTS.md` · 20 min

Copia `templates/AGENTS.md` a la raíz de tu repo:

```bash
cp [ruta-del-kit]/templates/AGENTS.md ./AGENTS.md
```

Abre el archivo y rellena cada sección con la información de **tu** producto. Las 5 secciones son:

1. **Contexto del negocio** — qué hace tu producto, para qué tipo de usuario, qué problema resuelve
2. **Arquitectura** — stack, estructura de carpetas, decisiones de diseño no obvias
3. **Convenciones** — estilo de código, nombrado, formato de commits, frameworks de testing
4. **Flujo de trabajo con el agente** — qué quieres que el agente haga automáticamente y qué no
5. **Restricciones** — qué archivos están protegidos, qué patrones evitar, anti-patrones del proyecto

Si te bloqueas, abre `examples/AGENTS.md` y ve cómo se llenó para el CRM de ejemplo. **No copies sus contenidos** — solo úsalo como referencia de profundidad y formato.

> 💡 **Truco:** No intentes hacer el AGENTS.md perfecto. La primera versión es 70% correcta. Lo iterarás en las clases siguientes.

### Bloque 3 · Crear `CLAUDE.md` · 15 min

Copia `templates/CLAUDE.md` a la raíz de tu repo. Este archivo es **específico de Claude Code** — apunta a `AGENTS.md` como source of truth y añade configuración propia (hooks, comportamientos esperados, etc.).

Ajusta:
- Qué quieres que Claude haga al iniciar una sesión
- Si debe hacer commits automáticos o dejarlos staged
- Si debe pedirte confirmación antes de cierto tipo de operación
- Qué comandos prefieres que use (ej. `pnpm` en vez de `npm` si tu stack lo requiere)

### Bloque 4 · Configurar permisos · 10 min

Crea la carpeta `.claude/` en la raíz y copia el `settings.json`:

```bash
mkdir -p .claude
cp [ruta-del-kit]/templates/settings.json .claude/settings.json
```

Ajusta las reglas `allow` y `deny` según tu stack:
- En `allow` van los comandos seguros que el agente puede ejecutar sin pedir permiso (`npm test`, `git status`, etc.)
- En `deny` van los comandos o lecturas que NUNCA debe hacer (`rm -rf`, leer `.env`, etc.)

**Regla clave:** `deny` siempre gana sobre `allow`. Si dudas, prefiere deny — es más seguro pedir confirmación que arrepentirse.

### Bloque 5 · Añadir 1 hook útil · 15 min

Elige **un solo hook** para empezar — no intentes configurar varios el primer día.

**Opción A (recomendada para la mayoría):** `post-edit-lint.sh`
> Cada vez que el agente edita o escribe un archivo, se ejecuta lint o formato automáticamente. Garantiza que el código generado siempre cumple el estilo del equipo.

**Opción B (para repos con secrets sensibles):** `pre-tool-block.sh`
> Antes de cada acción del agente, se verifica que no esté intentando leer archivos protegidos o ejecutar comandos destructivos.

Copia el hook elegido a `.claude/hooks/` y registra su ejecución en `settings.json`. La sección de hooks del template ya tiene el formato — solo ajustas el nombre del archivo y el comando.

Verifica que funciona haciendo un edit de prueba a un archivo y observando que el hook se ejecuta automáticamente.

### Bloque 6 · Validar y compartir · 20 min

Cierra Claude Code y vuelve a abrirlo (`claude`). Repite el prompt del Bloque 1:

```
dame un overview de este proyecto: qué hace, su arquitectura,
qué archivos son los más importantes
```

Compara el output con tu baseline. Deberías ver:
- ✅ El agente reconoce el dominio del producto (no solo el stack)
- ✅ Menciona las convenciones del equipo
- ✅ Sabe qué archivos son sensibles
- ✅ Llega más rápido a una respuesta de calidad

En los últimos 5 minutos, 2-3 voluntarios comparten su `AGENTS.md` en la sala principal. El objetivo no es que sea perfecto — es ver qué decisiones tomó cada quien sobre cómo describir su producto.

---

## 🎁 Entregable

Al terminar el workshop tu repo debe tener:

- [ ] `AGENTS.md` en la raíz con las 5 secciones rellenas
- [ ] `CLAUDE.md` en la raíz con configuración específica de Claude Code
- [ ] `.claude/settings.json` con allow/deny apropiados a tu proyecto
- [ ] `.claude/hooks/<nombre>.sh` ejecutable y registrado en settings.json
- [ ] Commit pusheado a tu rama con todos los archivos anteriores

Adicionalmente, ten a mano el screenshot o nota del Bloque 1 (baseline) — útil para reflexionar sobre el cambio.

---

## 🚨 Troubleshooting

### "El hook no se ejecuta cuando edito archivos"

Verifica:
1. El archivo tiene permisos de ejecución: `chmod +x .claude/hooks/<nombre>.sh`
2. Está registrado correctamente en `settings.json` bajo la sección `hooks`
3. El matcher coincide con el evento (`Edit`, `Write`, `Bash`, etc.) — revisa la sintaxis
4. Cierra y vuelve a abrir Claude Code después de añadir hooks nuevos

### "Claude Code dice que no puede ejecutar comandos que yo permití"

Probablemente esos comandos están en `deny` por defecto. Recuerda que `deny` siempre gana sobre `allow`. Revisa el orden y la especificidad de tus reglas.

### "El agente todavía pide contexto que ya está en AGENTS.md"

Dos causas comunes:
- La descripción es demasiado vaga. Reemplaza frases generales por específicas. *"Stack moderno"* → *"Next.js 16 App Router + Prisma 6 + Tailwind 4"*.
- La sección está al final del archivo y el modelo no le da peso suficiente. Pon la información crítica al inicio.

### "Mi proyecto no tiene tests, ¿qué pongo en convenciones de testing?"

Pon lo que esperarás cuando los tengas. Ej: *"Framework: Vitest. Cada función de dominio debe tener al menos un test happy path y uno de error."* El AGENTS.md sirve también como contrato futuro, no solo como descripción del presente.

### "Tengo Windows nativo (sin WSL2)"

Claude Code no soporta Windows nativo. Necesitas WSL2. Si el setup no estuvo listo antes del workshop, ejecuta los pasos del kit en WSL2 después y replica los archivos al repo.

---

## 📚 Recursos

- Codelab de Clase 3 (con todos los comandos de referencia): https://harcoreai.carlos-alarcon.com/
- Docs Claude Code: https://code.claude.com/docs
- Anthropic Skills (ejemplos oficiales): https://github.com/anthropics/skills

---

## 🔜 Siguiente workshop

Una vez configurado el agente, en el **Workshop 2 — Avanza una feature con tu agente** vas a usar este setup para implementar una pieza real de tu producto, delegando inteligentemente entre subagentes, Skills y sesiones paralelas de Antigravity.
