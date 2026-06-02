output "url_repo" {
  description = "URL HTTPS del repositorio gestionado."
  value       = module.repo.url
}

output "rama_protegida" {
  description = "Nombre de la rama con branch protection activa."
  value       = module.branch_protection.rama_protegida
}

output "etiqueta_review_ia" {
  description = "Label que dispara el AI PR Review advisory."
  value       = module.labels.etiqueta_review_ia
}

output "labels_gestionadas" {
  description = "Conjunto de labels gestionadas por Terraform."
  value       = module.labels.todas
}
