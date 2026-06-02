# ─── Configuración LocalStack ─────────────────────────────────────────────────
# Usar con: terraform apply -var-file=providers-local.tfvars
#
# Requiere LocalStack corriendo en Docker:
#   docker compose up -d    (desde la raíz del repo)
# ─────────────────────────────────────────────────────────────────────────────

localstack_endpoint = "http://localhost:4566"
aws_access_key      = "test"
aws_secret_key      = "test"
aws_region          = "us-east-1"
environment         = "local"
tareas_deseadas     = 1  # Una sola tarea en local es suficiente para la demo
