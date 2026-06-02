output "etiqueta_review_ia" {
  description = "Nombre del label que dispara el AI PR Review advisory."
  value       = github_issue_label.review_ia.name
}

output "todas" {
  description = "Lista de nombres de todas las labels gestionadas por este módulo."
  value       = concat([github_issue_label.review_ia.name], [for l in github_issue_label.estandar : l.name])
}
