output "rama_protegida" {
  description = "Pattern de la rama protegida."
  value       = github_branch_protection.principal.pattern
}

output "aprobaciones_requeridas" {
  description = "Número de reviews humanos requeridos."
  value       = var.aprobaciones_requeridas
}
