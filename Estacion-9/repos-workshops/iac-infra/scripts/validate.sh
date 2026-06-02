#!/bin/bash
# validate.sh — Verifica que la infraestructura desplegada cumple la spec de arquitectura.
#
# Uso:
#   LocalStack: LOCALSTACK=true AWS_REGION=us-east-1 ENVIRONMENT=local bash scripts/validate.sh
#   AWS real:   AWS_REGION=us-east-1 ENVIRONMENT=dev bash scripts/validate.sh

set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-dev}"
PROYECTO="asistente-ia"
NOMBRE_BASE="${PROYECTO}-${ENVIRONMENT}"

# En LocalStack usamos aws CLI con endpoint URL (más compatible que awslocal).
# En AWS real usamos el aws CLI estándar con el perfil configurado.
LOCALSTACK_ENDPOINT="${LOCALSTACK_ENDPOINT:-http://localhost:4566}"
if [ -n "$LOCALSTACK" ]; then
  CLI="aws --endpoint-url=$LOCALSTACK_ENDPOINT --region $AWS_REGION --no-sign-request"
else
  CLI="aws --region $AWS_REGION"
fi

ERRORES=0

log_ok()   { echo "  ✅  $1"; }
log_fail() { echo "  ❌  $1"; ERRORES=$((ERRORES + 1)); }
log_info() { echo ""; echo "── $1 ──────────────────────────────"; }

echo ""
echo "🔍  Validando infraestructura [ $NOMBRE_BASE ] en $AWS_REGION"
echo "    Provider: $([ -n "$LOCALSTACK" ] && echo 'LocalStack' || echo 'AWS real')"

# ─── Networking ───────────────────────────────────────────────────────────────

log_info "Networking"

VPC_COUNT=$($CLI ec2 describe-vpcs \
  --filters "Name=tag:Proyecto,Values=$PROYECTO" "Name=tag:Environment,Values=$ENVIRONMENT" \
  --query 'length(Vpcs)' --output text 2>/dev/null || echo "0")

if [ "$VPC_COUNT" -ge 1 ]; then
  log_ok "VPC encontrada ($VPC_COUNT)"
else
  log_fail "VPC no encontrada — ejecutar terraform apply primero"
fi

SUBNET_COUNT=$($CLI ec2 describe-subnets \
  --filters "Name=tag:Proyecto,Values=$PROYECTO" "Name=tag:Environment,Values=$ENVIRONMENT" \
  --query 'length(Subnets)' --output text 2>/dev/null || echo "0")

if [ "$SUBNET_COUNT" -ge 4 ]; then
  log_ok "Subnets encontradas ($SUBNET_COUNT — 2 públicas + 2 privadas)"
else
  log_fail "Subnets insuficientes: se esperaban 4, se encontraron $SUBNET_COUNT"
fi

# ─── Compute ──────────────────────────────────────────────────────────────────

log_info "Compute"

CLUSTER_STATUS=$($CLI ecs describe-clusters \
  --clusters "${NOMBRE_BASE}-cluster" \
  --query 'clusters[0].status' --output text 2>/dev/null || echo "MISSING")

if [ "$CLUSTER_STATUS" = "ACTIVE" ]; then
  log_ok "ECS Cluster ACTIVE"
else
  log_fail "ECS Cluster no encontrado o no activo (status: $CLUSTER_STATUS)"
fi

ALB_COUNT=$($CLI elbv2 describe-load-balancers \
  --query "length(LoadBalancers[?contains(LoadBalancerName, '${NOMBRE_BASE}')])" \
  --output text 2>/dev/null || echo "0")

if [ "$ALB_COUNT" -ge 1 ]; then
  log_ok "Application Load Balancer encontrado"
else
  log_fail "ALB no encontrado — el tráfico no tiene entrada"
fi

# ─── Storage ──────────────────────────────────────────────────────────────────

log_info "Storage"

TABLA_STATUS=$($CLI dynamodb describe-table \
  --table-name "conversaciones-${ENVIRONMENT}" \
  --query 'Table.TableStatus' --output text 2>/dev/null || echo "MISSING")

if [ "$TABLA_STATUS" = "ACTIVE" ]; then
  log_ok "Tabla DynamoDB 'conversaciones-${ENVIRONMENT}' ACTIVE"
else
  log_fail "Tabla DynamoDB no encontrada (status: $TABLA_STATUS)"
fi

# ─── Drift detection ──────────────────────────────────────────────────────────

log_info "Estado de Terraform"

cd infra
PLAN_OUTPUT=$(terraform plan -var-file="providers-${ENVIRONMENT}.tfvars" -detailed-exitcode 2>&1 || true)
PLAN_EXIT_CODE=$?

if [ $PLAN_EXIT_CODE -eq 0 ]; then
  log_ok "No hay drift — la infraestructura está en el estado declarado"
elif [ $PLAN_EXIT_CODE -eq 2 ]; then
  log_fail "Hay drift detectado — terraform plan muestra cambios pendientes"
else
  log_fail "Error al ejecutar terraform plan"
fi
cd ..

# ─── Resumen ──────────────────────────────────────────────────────────────────

echo ""
echo "─────────────────────────────────────────────"
if [ $ERRORES -eq 0 ]; then
  echo "✅  Validación exitosa — la infraestructura cumple la spec de arquitectura"
else
  echo "❌  Validación fallida — $ERRORES error(es) encontrado(s)"
  exit 1
fi
echo ""
