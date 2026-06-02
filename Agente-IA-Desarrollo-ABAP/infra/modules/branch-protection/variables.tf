variable "repositorio" {
  type        = string
  description = "Nombre del repositorio sobre el que aplicar la protección."
}

variable "rama" {
  type        = string
  description = "Pattern de la rama a proteger."
  default     = "main"
}

variable "enforce_admins" {
  type        = bool
  description = "Si true, los admins tampoco pueden saltarse las reglas. Para repos multi-dev de producto: true (gate del Principio #1). Para repos personales de aprendizaje solo: false (no bloquea el flujo direct-to-main)."
  default     = false
}

variable "aprobaciones_requeridas" {
  type        = number
  description = "Número de reviews humanos requeridos para mergear. En repos solo: 0 (GitHub no permite self-approve)."
  default     = 0
}

variable "status_checks_requeridos" {
  type        = list(string)
  description = "Status checks (nombres de jobs de GitHub Actions) que deben pasar antes del merge. Ej: ['test-lib'] para gate cheap y deterministic."
  default     = []
}
