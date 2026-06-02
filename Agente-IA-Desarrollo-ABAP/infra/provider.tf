terraform {
  required_version = ">= 1.5"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "github" {
  owner = var.organizacion
  # El token se pasa por variable de entorno GITHUB_TOKEN.
  # Nunca hardcodearlo en este archivo ni en .tfvars versionados (ver ADR-002 §5).
}
