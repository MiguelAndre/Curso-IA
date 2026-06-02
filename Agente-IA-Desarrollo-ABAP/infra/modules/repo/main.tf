resource "github_repository" "principal" {
  name        = var.nombre
  description = var.descripcion

  visibility = "private"

  has_issues      = true
  has_projects    = true
  has_wiki        = false
  has_discussions = false

  allow_merge_commit     = false
  allow_squash_merge     = true
  allow_rebase_merge     = false
  delete_branch_on_merge = true

  topics = var.topics

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_repository_dependabot_security_updates" "principal" {
  repository = github_repository.principal.name
  enabled    = true
}
