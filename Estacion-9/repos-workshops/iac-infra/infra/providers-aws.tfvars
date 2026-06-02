# ─── Configuración AWS real ───────────────────────────────────────────────────
# Usar con: terraform apply -var-file=providers-aws.tfvars
#
# Requiere:
#   - AWS CLI configurado: aws configure (o variable de entorno AWS_PROFILE)
#   - Permisos: VPC, ECS, IAM, DynamoDB, S3, CloudWatch Logs, ELB
#
# Diferencia con providers-local.tfvars: solo estas 4 líneas cambian.
# El código de infraestructura (módulos) es idéntico en ambos entornos.
# ─────────────────────────────────────────────────────────────────────────────

localstack_endpoint = ""   # Vacío = usar endpoints reales de AWS
aws_access_key      = ""   # Vacío = usar perfil de AWS CLI
aws_secret_key      = ""   # Vacío = usar perfil de AWS CLI
aws_region          = "us-east-1"
environment         = "dev"
tareas_deseadas     = 2
