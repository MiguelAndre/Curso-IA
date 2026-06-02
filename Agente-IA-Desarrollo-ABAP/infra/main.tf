module "repo" {
  source = "./modules/repo"

  nombre         = var.nombre_repo
  descripcion    = var.descripcion_repo
  rama_principal = var.rama_principal
  topics         = var.topics
}

module "branch_protection" {
  source = "./modules/branch-protection"

  repositorio = module.repo.nombre
  rama        = var.rama_principal

  enforce_admins           = false
  aprobaciones_requeridas  = 0
  status_checks_requeridos = []
}

module "labels" {
  source = "./modules/labels"

  repositorio        = module.repo.nombre
  etiqueta_review_ia = var.etiqueta_review_ia
}
