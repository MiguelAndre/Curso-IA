---
name: iac
description: Convenciones de Infraestructura como Código del Agente IA ABAP. Activa este skill cuando el contexto contenga keywords como "terraform", "HCL", "infraestructura como código", "IaC", "github_repository", "branch protection", "provider integrations/github", "tfvars", "tfstate", "tf plan", "tf apply", o cuando se trate de crear o modificar archivos bajo `infra/` o `specs/architecture.md`. Provee naming, restricciones de seguridad y referencias al ADR-002 que el agente debe respetar al generar HCL.
---

# Skill: IaC — Infraestructura como Código del producto

## 1. Propósito

Este skill contiene las convenciones del producto para generar y mantener Terraform. Aplica únicamente al alcance gestionado: el **repositorio de GitHub** del producto (ver `entregables/ADR-002-no-iac-cloud.md`). No hay infraestructura AWS/GCP/Azure.

---

## 2. Activación

Este skill se activa cuando el contexto incluye:

- "terraform", "HCL", "IaC", "infraestructura como código".
- Recursos del provider `integrations/github`: `github_repository`, `github_branch_protection`, `github_issue_label`, etc.
- Operaciones de ciclo de vida: `init`, `plan`, `apply`, `import`, `destroy`, `state`.
- Modificaciones bajo `infra/`, `specs/architecture.md`, `scripts/validate.sh`.

---

## 3. Restricciones no negociables

Estas reglas aplican siempre. Violarlas requiere ADR explícito.

### R1 — Solo se gestiona el repositorio de GitHub

No introduzcas recursos de AWS, GCP, Azure, ni de cualquier otro provider sin un ADR que reemplace o complemente al ADR-002. Si el usuario pide "agrega un bucket S3 para archivar outputs", responde:

> "Esa acción requiere modificar ADR-002. El producto hoy no usa infraestructura cloud (ver §5 del ADR). ¿Confirmas que queremos crear un ADR-003 para abrir ese alcance?"

### R2 — Cero secretos en código

Nunca:
- Hardcodees `GITHUB_TOKEN`, claves, o cualquier credencial en `.tf` o `.tfvars` versionados.
- Generes archivos `.tfvars` con valores sensibles. Si necesitas variables locales, sugiere `.terraform.tfvars.local` y verifica que esté en `.gitignore`.
- Crees recursos `github_actions_secret` con `plaintext_value` literal — pasa por variable o documenta el setup manual.

### R3 — `prevent_destroy = true` en el repositorio

El recurso `github_repository.principal` lleva `lifecycle { prevent_destroy = true }`. Si el usuario pide eliminarlo, exige `terraform state rm` explícito + confirmación. Nunca generes un `apply` que pueda destruir el repo del producto.

### R4 — `enforce_admins = true` en `main`

El bloque `github_branch_protection` de `main` mantiene `enforce_admins = true`. No lo cambies a `false` "para acelerar un merge". Es el control del Principio #1 del PRD ("desarrollador garante final"). Si choca con una emergencia, escala — no lo bajes desde Terraform.

### R5 — State local durante el piloto

No introduzcas backend remoto (S3, Terraform Cloud) sin ADR. El state vive en `infra/terraform.tfstate` local y está gitignored. Migrar a state remoto es decisión arquitectónica, no operativa.

---

## 4. Naming y estilo HCL

### 4.1 Identificadores

- **En español**, salvo nombres del provider (que son fijos en inglés).
  - ✅ `module.repo.principal`, `resource "github_repository" "principal"`
  - ❌ `module.repo.main`, `resource "github_repository" "repo"`
- **`snake_case`** para HCL (estándar Terraform).
- **Comentarios en español**.

### 4.2 Estructura de módulos

Cada módulo bajo `infra/modules/<nombre>/` contiene exactamente tres archivos:

- `main.tf` — recursos.
- `variables.tf` — entradas con `type` y `description` obligatorios.
- `outputs.tf` — salidas con `description` obligatoria.

No mezcles dos responsabilidades en un solo módulo. Si vas a gestionar webhooks, crea `infra/modules/webhooks/`, no lo metas en `repo/`.

### 4.3 Variables y defaults

- Toda variable lleva `description`. Sin excepción.
- Los `default` reflejan el estado actual del producto (p. ej., `nombre_repo = "Agente-IA-Desarrollo-ABAP"`). No inventes defaults "razonables".
- Variables sensibles (tokens) **no se declaran** — vienen por entorno (`GITHUB_TOKEN`).

---

## 5. Ciclo de vida — comandos canónicos

```bash
# 1. Inicializar (descargar provider)
cd infra
terraform init

# 2. Adoptar recursos existentes en el state (primera vez)
terraform import module.repo.github_repository.principal Agente-IA-Desarrollo-ABAP
terraform import 'module.labels.github_issue_label.review_ia' Agente-IA-Desarrollo-ABAP:review-this

# 3. Previsualizar cambios
terraform plan

# 4. Aplicar (solo Configurador, manualmente)
terraform apply

# 5. Drift detection
terraform plan -detailed-exitcode   # exit 0 = sin drift, exit 2 = drift

# 6. Validación completa
bash scripts/validate.sh
```

`terraform destroy` **no se ejecuta** sobre el repositorio. El `prevent_destroy` lo bloquea por diseño.

---

## 6. MCPs sugeridos

Cuando trabajes con IaC en este repo, propón usar:

- **Terraform MCP Server** (HashiCorp) — para consultar schemas en vivo del provider `integrations/github`. Útil ante "¿qué campos acepta `github_branch_protection`?" Evita inventar atributos.
- **GitHub MCP** (si está disponible) — para introspección del estado real del repo antes de proponer cambios.

No respondas de memoria sobre schemas del provider — consulta el MCP. El provider GitHub ha tenido breaking changes entre v5 y v6.

---

## 7. Outputs revisables

Todo PR que toque `infra/` debe acompañarse de la salida de `terraform plan` en la sección **Evidence** del PR (alineado con `docs/tasks/pr-evidence-example.md`). Sin plan visible, el AI PR Review marcará el PR como "no auditable".

Formato sugerido en Evidence:

```markdown
## Evidence — Terraform plan

```
$ terraform plan
...
Plan: 0 to add, 1 to change, 0 to destroy.
```

Drift detectado: ninguno / [resumen del diff].
```

---

## 8. Referencias

- **ADR-002**: `entregables/ADR-002-no-iac-cloud.md` — por qué no hay infra cloud.
- **Spec**: `specs/architecture.md` — qué se gestiona y qué no.
- **README §10**: flujo operativo (cuando se publique).
- **Provider docs**: https://registry.terraform.io/providers/integrations/github/latest/docs
