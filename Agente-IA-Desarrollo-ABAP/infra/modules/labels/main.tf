locals {
  labels_estandar = {
    bug = {
      color       = "d73a4a"
      description = "Something isn't working"
    }
    enhancement = {
      color       = "a2eeef"
      description = "New feature or request"
    }
    documentation = {
      color       = "0075ca"
      description = "Improvements or additions to documentation"
    }
  }
}

resource "github_issue_label" "review_ia" {
  repository  = var.repositorio
  name        = var.etiqueta_review_ia
  color       = "0E8A16"
  description = "Dispara el AI PR Review advisory sobre este PR."
}

resource "github_issue_label" "estandar" {
  for_each = local.labels_estandar

  repository  = var.repositorio
  name        = each.key
  color       = each.value.color
  description = each.value.description
}
