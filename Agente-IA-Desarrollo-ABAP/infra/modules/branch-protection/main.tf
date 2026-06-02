resource "github_branch_protection" "principal" {
  repository_id = var.repositorio
  pattern       = var.rama

  enforce_admins          = var.enforce_admins
  allows_force_pushes     = false
  allows_deletions        = false
  require_signed_commits  = false
  required_linear_history = true

  required_pull_request_reviews {
    required_approving_review_count = var.aprobaciones_requeridas
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = false
  }

  required_status_checks {
    strict   = true
    contexts = var.status_checks_requeridos
  }
}
