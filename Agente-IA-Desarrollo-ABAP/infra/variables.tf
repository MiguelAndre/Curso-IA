variable "organizacion" {
  type        = string
  description = "Organización o usuario de GitHub propietario del repositorio."
}

variable "nombre_repo" {
  type        = string
  description = "Nombre del repositorio gestionado."
  default     = "Curso-IA"
}

variable "descripcion_repo" {
  type        = string
  description = "Descripción visible en GitHub."
  default     = "Curso de IA por 30x"
}

variable "rama_principal" {
  type        = string
  description = "Default branch del repositorio."
  default     = "main"
}

variable "etiqueta_review_ia" {
  type        = string
  description = "Label que dispara el AI PR Review advisory."
  default     = "review-this"
}

variable "topics" {
  type        = list(string)
  description = "Topics que tagean el repositorio en GitHub."
  default     = ["hardcore-ai", "ai-30x", "claude-code", "aidlc", "abap", "ai-agent"]
}
