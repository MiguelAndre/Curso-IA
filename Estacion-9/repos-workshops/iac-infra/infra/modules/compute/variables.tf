variable "proyecto" {
  description = "Nombre del proyecto — se usa en el naming de todos los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue: local, dev, prod"
  type        = string
}

variable "aws_region" {
  description = "Región de AWS donde se despliega el cluster ECS"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC donde se despliega el cluster"
  type        = string
}

variable "ids_subnets_publicas" {
  description = "IDs de las subnets públicas para el ALB"
  type        = list(string)
}

variable "ids_subnets_privadas" {
  description = "IDs de las subnets privadas para las tareas ECS"
  type        = list(string)
}

variable "id_security_group_alb" {
  description = "ID del security group del ALB"
  type        = string
}

variable "id_security_group_ecs" {
  description = "ID del security group de las tareas ECS"
  type        = string
}

variable "imagen_contenedor" {
  description = "URI de la imagen Docker en ECR para la tarea ECS"
  type        = string
}

variable "nombre_tabla_dynamodb" {
  description = "Nombre de la tabla DynamoDB de conversaciones — se pasa como variable de entorno al contenedor"
  type        = string
}

variable "cpu_tarea" {
  description = "CPU asignada a cada tarea ECS (unidades de vCPU x 1024)"
  type        = number
  default     = 512
}

variable "memoria_tarea" {
  description = "Memoria asignada a cada tarea ECS en MB"
  type        = number
  default     = 1024
}

variable "tareas_deseadas" {
  description = "Número de tareas ECS que deben estar corriendo"
  type        = number
  default     = 2
}
