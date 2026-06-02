---
description: Convenciones de infraestructura como código para el Asistente IA — naming, tagging, estructura de módulos y reglas de seguridad
---

# Skill: Infraestructura como Código (IaC)

## Estructura del repositorio

```
iac-infra/
├── specs/
│   └── architecture.md          ← Punto de partida: leer antes de generar cualquier módulo
├── infra/
│   ├── provider.tf              ← Un solo provider, funciona con LocalStack y AWS real
│   ├── main.tf                  ← Orquesta los tres módulos: networking → storage → compute
│   ├── variables.tf             ← Variables raíz compartidas
│   ├── outputs.tf               ← Outputs clave: URL del API, nombre del cluster, tabla DynamoDB
│   ├── providers-local.tfvars   ← Valores para LocalStack
│   ├── providers-aws.tfvars     ← Valores para AWS real
│   └── modules/
│       ├── networking/          ← VPC, subnets, security groups
│       ├── compute/             ← ECS, ALB, IAM roles
│       └── storage/             ← DynamoDB, S3
├── scripts/
│   └── validate.sh              ← Verifica recursos + drift detection
└── docker-compose.yml           ← Levanta LocalStack
```

---

## Naming de recursos

**Patrón obligatorio:** `{proyecto}-{environment}-{componente}`

| Componente | Ejemplo |
|------------|---------|
| VPC | `asistente-ia-dev-vpc` |
| Subnets | `asistente-ia-dev-subnet-publica-1` |
| Security Groups | `asistente-ia-dev-sg-alb`, `asistente-ia-dev-sg-ecs` |
| ECS Cluster | `asistente-ia-dev-cluster` |
| ECS Service | `asistente-ia-dev-servicio-api` |
| ALB | `asistente-ia-dev-alb` |
| DynamoDB Table | `conversaciones-dev` |
| S3 Bucket | `asistente-ia-dev-assets-{account_id}` |
| IAM Roles | `asistente-ia-dev-rol-ejecucion-ecs` |
| Log Groups | `/ecs/asistente-ia-dev-api` |

**Regla:** El nombre del recurso siempre incluye el entorno para que sea visible en la consola de AWS sin ambigüedad.

---

## Tagging obligatorio en todos los recursos

```hcl
tags = {
  Proyecto    = var.proyecto      # "asistente-ia"
  Environment = var.environment   # "local" | "dev" | "prod"
  ManagedBy   = "terraform"       # Siempre este valor — permite filtrar en la consola
}
```

Estos tres tags son **obligatorios** en cada `resource`. El script `validate.sh` los usa para descubrir recursos sin necesitar IDs hardcodeados.

---

## Reglas de seguridad — el agente DEBE seguirlas

1. **Mínimo privilegio en IAM**: Los roles de ECS tienen acceso solo a los recursos específicos del entorno (no `*` en el Resource de las políticas DynamoDB).

2. **ECS nunca tiene IP pública directa**: Las tareas ECS van en subnets privadas. El tráfico entra únicamente a través del ALB.

3. **Security group ECS**: Solo acepta tráfico en el puerto de la app (`3000`) y solo desde el security group del ALB — no desde `0.0.0.0/0`.

4. **S3 siempre con Block Public Access**: Los cuatro modos (`block_public_acls`, `block_public_policy`, `ignore_public_acls`, `restrict_public_buckets`) deben estar en `true`.

5. **Sin credenciales en variables de entorno del contenedor**: Las API keys del LLM van a AWS Secrets Manager. El contenedor solo recibe `DYNAMODB_TABLE`, `AWS_REGION` y `PORT`.

6. **Sin hardcoding de account IDs ni ARNs de otras cuentas** en el código de módulos — siempre usar `data.aws_caller_identity.actual.account_id`.

---

## Convenciones de código HCL

- Usar `locals` para el `nombre_base = "${var.proyecto}-${var.environment}"` — evita repetir la concatenación en cada recurso
- Variables con descripción completa en español — son documentación viva del módulo
- Outputs con descripción de para qué se usa el valor, no solo qué es
- Comentarios solo para decisiones de diseño no obvias (el `lifecycle { ignore_changes }`, los flags de LocalStack, el TTL de DynamoDB)

---

## Comandos de referencia para el agente

```bash
# Inicializar (primera vez o al cambiar providers)
npm run infra:init

# Ver qué va a crear/cambiar (sin aplicar)
npm run infra:plan:local   # LocalStack
npm run infra:plan:aws     # AWS real

# Aplicar cambios
npm run infra:apply:local  # LocalStack
npm run infra:apply:aws    # AWS real

# Ver outputs (URL del API, nombre del cluster, etc.)
npm run infra:output

# Validar infraestructura desplegada + drift detection
npm run validate           # LocalStack
npm run validate:aws       # AWS real
```

---

## Instrucciones para el coding agent

1. **Antes de generar cualquier módulo**, leer `specs/architecture.md` — todos los componentes y restricciones están ahí.

2. **Usar el Terraform MCP Server** para consultar los schemas reales de los providers antes de declarar recursos. No asumir atributos de memoria del modelo.

3. **Al modificar un módulo**, verificar que los outputs siguen siendo correctos y que `infra/main.tf` no necesita actualización en el paso de inputs/outputs entre módulos.

4. **Al generar políticas IAM**, ser específico en el `Resource` — nunca usar `"*"` si se puede referenciar el ARN exacto del recurso.

5. **Antes de hacer `apply`**, ejecutar `plan` y revisar el diff con el instructor. En la demo, el plan es parte del relato — no saltarlo.
