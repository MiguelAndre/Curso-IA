#!/usr/bin/env bash
# validate.sh — Verifica que la infraestructura declarada (repo GitHub) es válida y sin drift.
#
# Uso:
#   GITHUB_TOKEN=ghp_... bash scripts/validate.sh
#
# Exit codes:
#   0 — fmt, validate y plan OK; sin drift
#   1 — error en fmt o validate
#   2 — drift detectado (plan muestra cambios pendientes)

set -euo pipefail

cd "$(dirname "$0")/../infra"

ERRORES=0

log_info() { echo ""; echo "── $1 ──────────────────────────────"; }
log_ok()   { echo "  ✅  $1"; }
log_fail() { echo "  ❌  $1"; ERRORES=$((ERRORES + 1)); }

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "⚠️  GITHUB_TOKEN no está definido. plan/apply fallarán al autenticar."
  echo "    Genera un PAT con scopes 'repo' + 'admin:org' y expórtalo:"
  echo "    export GITHUB_TOKEN=ghp_..."
  exit 1
fi

log_info "terraform fmt"
if terraform fmt -check -recursive; then
  log_ok "Formato HCL correcto"
else
  log_fail "Hay archivos sin formatear — corrige con: terraform fmt -recursive"
fi

log_info "terraform validate"
terraform init -backend=false -input=false >/dev/null
if terraform validate; then
  log_ok "Configuración HCL válida"
else
  log_fail "terraform validate falló"
fi

if [ $ERRORES -gt 0 ]; then
  echo ""
  echo "❌  $ERRORES error(es) antes de plan — abortando"
  exit 1
fi

log_info "terraform plan (drift detection)"
set +e
terraform plan -detailed-exitcode -input=false
PLAN_EXIT=$?
set -e

echo ""
echo "─────────────────────────────────────────────"
case $PLAN_EXIT in
  0)
    log_ok "Sin drift — la infraestructura coincide con el estado declarado"
    exit 0
    ;;
  2)
    echo "⚠️  Drift detectado — terraform plan muestra cambios pendientes."
    echo "    Revisa el diff antes de aplicar."
    exit 2
    ;;
  *)
    log_fail "Error inesperado en terraform plan (exit=$PLAN_EXIT)"
    exit $PLAN_EXIT
    ;;
esac
