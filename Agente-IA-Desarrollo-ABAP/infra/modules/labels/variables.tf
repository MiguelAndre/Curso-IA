variable "repositorio" {
  type        = string
  description = "Nombre del repositorio donde aplicar las labels."
}

variable "etiqueta_review_ia" {
  type        = string
  description = "Nombre del label que dispara el AI PR Review advisory."
  default     = "review-this"
}
