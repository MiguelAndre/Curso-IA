output "nombre" {
  description = "Nombre del repositorio."
  value       = github_repository.principal.name
}

output "url" {
  description = "URL HTTPS del repositorio."
  value       = github_repository.principal.html_url
}

output "id_nodo" {
  description = "Node ID GraphQL del repositorio (útil para refs cross-recurso)."
  value       = github_repository.principal.node_id
}
