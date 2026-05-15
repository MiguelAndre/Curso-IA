#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# Hook: pre-tool-block.sh
# Evento: PreToolUse (matcher: Bash)
#
# Se ejecuta automáticamente ANTES de que el agente ejecute un comando
# bash. Lee el comando propuesto por stdin (JSON) y decide si autorizarlo,
# bloquearlo o pedir confirmación al usuario.
#
# El hook devuelve un JSON con la decisión:
#   - permissionDecision: "allow"  → ejecutar sin más
#   - permissionDecision: "deny"   → bloquear silenciosamente
#   - permissionDecision: "ask"    → preguntar al usuario
#
# Esta es una defensa en profundidad: complementa el allow/deny de
# settings.json con análisis dinámico del comando real.
# ──────────────────────────────────────────────────────────────────────────

set -e

# Leer el JSON que envía Claude Code por stdin
INPUT=$(cat)

# Extraer el comando bash propuesto
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Si no hay comando, autorizar (no es Bash o el input es inválido)
if [ -z "$CMD" ]; then
  exit 0
fi

# ── Bloqueos absolutos ─────────────────────────────────────────────────────
# Comandos que SIEMPRE deben ser bloqueados sin importar el contexto

if echo "$CMD" | grep -qE '\brm -rf?\b|\brm -fr?\b'; then
  jq -n --arg cmd "$CMD" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Comando destructivo bloqueado por el hook de seguridad: rm -rf"
    }
  }'
  exit 0
fi

if echo "$CMD" | grep -qE '\bsudo\b'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "El agente nunca debe usar sudo. Si necesitas permisos elevados, ejecuta el comando tú."
    }
  }'
  exit 0
fi

if echo "$CMD" | grep -qE 'DROP TABLE|DROP DATABASE|TRUNCATE TABLE'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Comando SQL destructivo bloqueado. Las operaciones de schema deben hacerse vía migraciones de Prisma."
    }
  }'
  exit 0
fi

# ── Bloqueos contextuales — pedir confirmación al usuario ──────────────────
# Comandos válidos pero de alto impacto: preguntar antes de ejecutar

if echo "$CMD" | grep -qE '\bgit push\b|\bgit reset --hard\b|\bgit commit --no-verify\b'; then
  jq -n --arg cmd "$CMD" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: "Comando git de alto impacto. Confirma antes de proceder."
    }
  }'
  exit 0
fi

if echo "$CMD" | grep -qE '\bnpm install\b|\bnpm uninstall\b|\bpnpm add\b|\byarn add\b'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: "Modificación de dependencias detectada. Confirma que es necesario y la dependencia está vetada."
    }
  }'
  exit 0
fi

# ── Por defecto, autorizar (el comando es seguro) ──────────────────────────
exit 0
