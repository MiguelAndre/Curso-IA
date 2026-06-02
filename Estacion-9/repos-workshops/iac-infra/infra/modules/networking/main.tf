/**
 * Módulo: networking
 * Crea la red base del proyecto: VPC, subnets públicas y privadas,
 * Internet Gateway, tablas de rutas y security groups para el ALB y ECS.
 */

locals {
  nombre_base = "${var.proyecto}-${var.environment}"

  tags_comunes = {
    Proyecto    = var.proyecto
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ─── VPC ──────────────────────────────────────────────────────────────────────

resource "aws_vpc" "principal" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-vpc"
  })
}

# ─── Subnets públicas (ALB) ───────────────────────────────────────────────────

resource "aws_subnet" "publica" {
  count = length(var.subnets_publicas_cidrs)

  vpc_id                  = aws_vpc.principal.id
  cidr_block              = var.subnets_publicas_cidrs[count.index]
  availability_zone       = var.zonas_disponibilidad[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-subnet-publica-${count.index + 1}"
    Tipo = "publica"
  })
}

# ─── Subnets privadas (ECS tasks) ─────────────────────────────────────────────

resource "aws_subnet" "privada" {
  count = length(var.subnets_privadas_cidrs)

  vpc_id            = aws_vpc.principal.id
  cidr_block        = var.subnets_privadas_cidrs[count.index]
  availability_zone = var.zonas_disponibilidad[count.index]

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-subnet-privada-${count.index + 1}"
    Tipo = "privada"
  })
}

# ─── Internet Gateway (tráfico entrante al ALB) ───────────────────────────────

resource "aws_internet_gateway" "principal" {
  vpc_id = aws_vpc.principal.id

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-igw"
  })
}

# ─── Tabla de rutas pública (subnets del ALB tienen salida a internet) ────────

resource "aws_route_table" "publica" {
  vpc_id = aws_vpc.principal.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.principal.id
  }

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-rtb-publica"
  })
}

resource "aws_route_table_association" "publica" {
  count = length(aws_subnet.publica)

  subnet_id      = aws_subnet.publica[count.index].id
  route_table_id = aws_route_table.publica.id
}

# ─── Security Group: ALB ──────────────────────────────────────────────────────
# Solo acepta tráfico HTTP desde internet; todo lo demás está bloqueado.

resource "aws_security_group" "alb" {
  name        = "${local.nombre_base}-sg-alb"
  description = "Permite trafico HTTP entrante al ALB desde internet"
  vpc_id      = aws_vpc.principal.id

  ingress {
    description = "HTTP desde internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Todo el trafico saliente - el ALB necesita llegar a las tareas ECS"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-sg-alb"
  })
}

# ─── Security Group: ECS tasks ────────────────────────────────────────────────
# Las tareas solo aceptan tráfico en el puerto de la app y solo desde el ALB.

resource "aws_security_group" "ecs" {
  name        = "${local.nombre_base}-sg-ecs"
  description = "Permite trafico al API solo desde el ALB"
  vpc_id      = aws_vpc.principal.id

  ingress {
    description     = "Trafico al API desde el ALB unicamente"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Todo el trafico saliente - las tareas necesitan llamar al LLM externo"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags_comunes, {
    Name = "${local.nombre_base}-sg-ecs"
  })
}
