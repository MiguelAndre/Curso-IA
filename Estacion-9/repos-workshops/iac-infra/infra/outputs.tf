output "url_api" {
  description = "URL pública del API — endpoint base para probar el asistente desplegado"
  value       = "http://${module.compute.dns_load_balancer}"
}

output "nombre_cluster_ecs" {
  description = "Nombre del cluster ECS — útil para hacer deploy de nuevas versiones de la imagen"
  value       = module.compute.nombre_cluster_ecs
}

output "nombre_tabla_conversaciones" {
  description = "Nombre de la tabla DynamoDB para verificar que los datos persisten"
  value       = module.storage.nombre_tabla_conversaciones
}

output "nombre_bucket_assets" {
  description = "Nombre del bucket S3 de assets y logs"
  value       = module.storage.nombre_bucket_assets
}

output "logs_del_api" {
  description = "Grupo de CloudWatch Logs donde ver los logs del contenedor"
  value       = module.compute.nombre_log_group
}
