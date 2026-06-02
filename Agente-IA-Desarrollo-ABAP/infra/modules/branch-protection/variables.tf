variable "repositorio" {
  type        = string
  description = "Nombre del repositorio sobre el que aplicar la protección."
}

variable "rama" {
  type        = string
  description = "Pattern de la rama a proteger."
  default     = "main"
}

variable "aprobaciones_requeridas" {
  type        = number
  description = "Número de reviews humanos requeridos para mergear."
  default     = 1
}

variable "status_checks_requeridos" {
  type        = list(string)
  description = "Status checks que deben pasar antes del merge (p. ej., ai-pr-review)."
  default     = []
}
