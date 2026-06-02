# Arquitectura del Asistente IA — Producción

## Descripción del sistema

API REST de asistente conversacional con IA. Los usuarios envían mensajes y reciben
respuestas generadas por un LLM. El historial de conversación se persiste por sesión
en DynamoDB. El sistema corre en contenedores gestionados por ECS Fargate detrás de
un Application Load Balancer.

---

## Componentes

### Networking

- **VPC:** `10.0.0.0/16` en `us-east-1` con 2 zonas de disponibilidad
- **Subnets públicas:** `10.0.1.0/24` (us-east-1a), `10.0.2.0/24` (us-east-1b) — para el ALB
- **Subnets privadas:** `10.0.10.0/24` (us-east-1a), `10.0.11.0/24` (us-east-1b) — para las tareas ECS
- **Internet Gateway:** tráfico entrante al ALB desde internet
- **Security group ALB:** ingress 80 desde `0.0.0.0/0`, egress al SG de ECS
- **Security group ECS:** ingress en puerto 3000 solo desde el SG del ALB, egress a internet (para llamadas al LLM)

### Compute

- **ECS Cluster Fargate:** `asistente-ia-{env}`
- **Task Definition:** imagen Docker del API, 512 vCPU / 1024 MB RAM
  - Variables de entorno: `DYNAMODB_TABLE`, `AWS_REGION`, `PORT=3000`
- **ECS Service:** 2 tareas deseadas, health check en `GET /health → 200 OK`
- **Application Load Balancer:** listener en puerto 80, forward al Target Group del ECS Service
- **IAM Role de ejecución:** permisos para pull de ECR, escribir en CloudWatch Logs, leer/escribir en DynamoDB

### Storage

- **DynamoDB Table:** `conversaciones-{env}`
  - Partition key: `conversacion_id` (String)
  - Sort key: `timestamp` (Number)
  - TTL attribute: `expires_at` — limpiar conversaciones después de 30 días
  - Billing mode: `PAY_PER_REQUEST`
- **S3 Bucket:** `asistente-ia-assets-{env}-{account_id}`
  - Versioning habilitado
  - Block public access activado en todos los modos
  - Uso: logs del ALB, backups de configuración

---

## Restricciones de seguridad

- Las tareas ECS no tienen IP pública directa — solo el ALB recibe tráfico de internet
- Las credenciales de AWS se gestionan vía IAM Roles, nunca en variables de entorno
- El bucket S3 no es público bajo ninguna circunstancia
- Los secretos del LLM (API keys) van a AWS Secrets Manager, no a variables de entorno del contenedor

---

## Flujo de tráfico

```
Internet → ALB (puerto 80) → Target Group → ECS Fargate (puerto 3000) → DynamoDB
                                                                        → LLM API (salida)
```

---

## Entornos

| Entorno | Descripción | Provider |
|---------|-------------|----------|
| `local` | Emulación con LocalStack en Docker | `providers-local.tfvars` |
| `dev`   | AWS real, cuenta de desarrollo | `providers-aws.tfvars` |
| `prod`  | AWS real, cuenta de producción | `providers-aws.tfvars` + state remoto |
