variable "organizacion" {
  type        = string
  description = "Organización o usuario de GitHub propietario del repositorio."
}

variable "nombre_repo" {
  type        = string
  description = "Nombre del repositorio gestionado."
  default     = "Agente-IA-Desarrollo-ABAP"
}

variable "descripcion_repo" {
  type        = string
  description = "Descripción visible en GitHub."
  default     = "Agente IA para Desarrollo ABAP — pipeline FD → TD → Código basado en Claude Code"
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
  default     = ["claude-code", "abap", "ai-agent", "aidlc"]
}
