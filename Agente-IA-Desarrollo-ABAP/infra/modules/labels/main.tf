locals {
  labels_estandar = {
    bug = {
      color       = "D73A4A"
      description = "Defecto reportado en el agente o sus artefactos."
    }
    enhancement = {
      color       = "A2EEEF"
      description = "Mejora propuesta sobre el comportamiento existente."
    }
    documentation = {
      color       = "0075CA"
      description = "Cambios sobre docs, README, ADRs o memoria evolutiva."
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
