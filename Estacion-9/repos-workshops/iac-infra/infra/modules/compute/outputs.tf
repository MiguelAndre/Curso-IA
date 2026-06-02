output "nombre_cluster_ecs" {
  description = "Nombre del cluster ECS donde corre el servicio"
  value       = aws_ecs_cluster.principal.name
}

output "dns_load_balancer" {
  description = "DNS público del ALB — URL base del API en este entorno"
  value       = aws_lb.principal.dns_name
}

output "arn_load_balancer" {
  description = "ARN del ALB — útil para configurar registros DNS en Route 53"
  value       = aws_lb.principal.arn
}

output "nombre_servicio_ecs" {
  description = "Nombre del servicio ECS que gestiona las tareas del API"
  value       = aws_ecs_service.api.name
}

output "nombre_log_group" {
  description = "Nombre del grupo de logs en CloudWatch para el API"
  value       = aws_cloudwatch_log_group.api.name
}
