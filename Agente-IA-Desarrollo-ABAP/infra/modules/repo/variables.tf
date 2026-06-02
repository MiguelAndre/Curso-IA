variable "nombre" {
  type        = string
  description = "Nombre del repositorio."
}

variable "descripcion" {
  type        = string
  description = "Descripción visible en GitHub."
}

variable "rama_principal" {
  type        = string
  description = "Default branch del repositorio."
  default     = "main"
}

variable "topics" {
  type        = list(string)
  description = "Topics del repositorio."
  default     = []
}
