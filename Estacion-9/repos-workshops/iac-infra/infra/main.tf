/**
 * Infraestructura del Asistente IA
 *
 * Orquesta los tres módulos que componen el sistema:
 *   networking → storage → compute
 *
 * El orden importa: compute depende de outputs de networking y storage.
 */

module "networking" {
  source = "./modules/networking"

  proyecto    = var.proyecto
  environment = var.environment
}

module "storage" {
  source = "./modules/storage"

  proyecto   = var.proyecto
  environment = var.environment
  account_id = data.aws_caller_identity.actual.account_id
}

module "compute" {
  source = "./modules/compute"

  proyecto    = var.proyecto
  environment = var.environment
  aws_region  = var.aws_region

  # Networking
  vpc_id                = module.networking.vpc_id
  ids_subnets_publicas  = module.networking.ids_subnets_publicas
  ids_subnets_privadas  = module.networking.ids_subnets_privadas
  id_security_group_alb = module.networking.id_security_group_alb
  id_security_group_ecs = module.networking.id_security_group_ecs

  # Storage
  nombre_tabla_dynamodb = module.storage.nombre_tabla_conversaciones

  # Aplicación
  imagen_contenedor = var.imagen_contenedor
  tareas_deseadas   = var.tareas_deseadas
}
