#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# Hook: post-edit-lint.sh
# Evento: PostToolUse (matcher: Edit|Write)
#
# Se ejecuta automáticamente después de cada edición o escritura de archivo
# que haga el agente. Corre lint y formato sobre el archivo afectado.
#
# El hook recibe por stdin un JSON con la metadata de la herramienta usada.
# Lee CLAUDE_FILE_PATH del entorno para conocer qué archivo se modificó.
#
# Detecta automáticamente el stack (Node, Python, Go, Rust) y aplica
# el formatter correspondiente. Falla silencioso si no encuentra herramientas
# — un hook nunca debe romper la sesión del agente.
# ──────────────────────────────────────────────────────────────────────────

set -e

# Archivo afectado por la herramienta — viene del agente como variable de entorno
FILE_PATH="${CLAUDE_FILE_PATH:-}"

# Si no hay archivo, el hook no aplica
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Extensión del archivo
EXT="${FILE_PATH##*.}"

# ── Aplicar formatter según el tipo de archivo ─────────────────────────────
case "$EXT" in
  ts|tsx|js|jsx|json)
    # Node.js / TypeScript / React
    if [ -f "package.json" ]; then
      # Preferir prettier si está disponible, si no usar lint:fix
      if npx --no-install prettier --version >/dev/null 2>&1; then
        npx --no-install prettier --write "$FILE_PATH" 2>/dev/null || true
      elif grep -q '"lint:fix"' package.json; then
        npm run lint:fix --silent -- "$FILE_PATH" 2>/dev/null || true
      fi
    fi
    ;;

  py)
    # Python
    if command -v ruff >/dev/null 2>&1; then
      ruff format "$FILE_PATH" 2>/dev/null || true
      ruff check --fix "$FILE_PATH" 2>/dev/null || true
    elif command -v black >/dev/null 2>&1; then
      black --quiet "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  go)
    # Go
    if command -v gofmt >/dev/null 2>&1; then
      gofmt -w "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  rs)
    # Rust
    if command -v rustfmt >/dev/null 2>&1; then
      rustfmt "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  md|yml|yaml|html|css)
    # Markdown / YAML / HTML / CSS — prettier si está disponible
    if [ -f "package.json" ] && npx --no-install prettier --version >/dev/null 2>&1; then
      npx --no-install prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;

  *)
    # Tipo de archivo no manejado — el hook no hace nada
    exit 0
    ;;
esac

exit 0
