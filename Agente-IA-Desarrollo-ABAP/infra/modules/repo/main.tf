resource "github_repository" "principal" {
  name        = var.nombre
  description = var.descripcion

  visibility = "public"

  has_issues      = true
  has_projects    = true
  has_wiki        = true
  has_discussions = false

  allow_merge_commit     = true
  allow_squash_merge     = true
  allow_rebase_merge     = true
  delete_branch_on_merge = false

  topics = var.topics

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_repository_vulnerability_alerts" "principal" {
  repository = github_repository.principal.name
  enabled    = true
}

resource "github_repository_dependabot_security_updates" "principal" {
  repository = github_repository_vulnerability_alerts.principal.repository
  enabled    = true
}
