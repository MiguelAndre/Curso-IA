# Arquitectura del Agente IA ABAP — Infraestructura como Código

> **Contrato agente-equipo** para la generación de módulos Terraform.
> Esta spec describe el único activo hospedado donde vive el producto: el repositorio `MiguelAndre/Curso-IA` en GitHub.
> El producto no requiere infraestructura cloud (ver `entregables/ADR-002-no-iac-cloud.md`).

---

## 1. Descripción del sistema gestionado

El producto se materializa como **configuración de Claude Code** versionada en un repositorio de GitHub (ADR-001). El runtime es local (la máquina del desarrollador). Por tanto, lo único hospedado externamente y susceptible de gestionarse como código es el **repositorio de GitHub** y su configuración asociada:

- Settings generales del repo (descripción, default branch, issues, projects).
- Reglas de protección de la rama `main` (gate de merge — Principio #1 del PRD).
- Sistema de labels (en particular `review-this`, que dispara el AI PR Review advisory).

La spec **no incluye**:

- Compute, storage, networking — el producto no los requiere.
- Workflows de GitHub Actions — ya se versionan como archivos `.yml` bajo `.github/workflows/` y se aplican por presencia, no por `terraform apply`.
- Valores de secrets — referencias y setup manual quedan en `docs/ai-pr-review-human-setup.md`.

---

## 2. Componentes

### 2.1 Repositorio (`github_repository`)

- **Nombre**: `Curso-IA`
- **Visibilidad**: `public`
- **Descripción**: "Curso de IA por 30x"
- **Default branch**: `main`
- **Features habilitadas**: issues, projects, wiki
- **Features deshabilitadas**: discussions
- **Topics**: `hardcore-ai`, `ai-30x`, `claude-code`, `aidlc`, `abap`, `ai-agent`
- **Auto-delete head branches**: `false` (el usuario administra ramas manualmente)
- **Allow merge commit**: `true`
- **Allow squash merge**: `true`
- **Allow rebase merge**: `true`

### 2.2 Protección de la rama `main` (`github_branch_protection`)

Control mínimo en repo solo (Configurador único). Para repo multi-dev del producto en el futuro se endurece (`enforce_admins=true`, `aprobaciones_requeridas=1`, status checks específicos).

- **Branch pattern**: `main`
- **Required pull request reviews**: `0` (GitHub no permite self-approve en repos personales)
- **Dismiss stale reviews on push**: `true` (aplica si el PR sí recibe reviews opcionales)
- **Require review from code owners**: `false`
- **Required status checks**: `strict=true` (PRs deben estar al día con `main`) sin contexts específicos (los workflows tienen path-filtering y bloquearían PRs que no tocan esos paths)
- **Required linear history**: `true`
- **Enforce admins**: `false` (el Configurador puede pushear directo en emergencias)
- **Allow force pushes**: `false`
- **Allow deletions**: `false`
- **Require signed commits**: `false`

### 2.3 Labels (`github_issue_label`)

- `review-this` — color `#0E8A16`, descripción "Dispara el AI PR Review advisory sobre este PR". Etiqueta operativa del producto (PRD §AI PR Review).
- `bug` — color `#d73a4a`, descripción "Something isn't working" (default de GitHub).
- `enhancement` — color `#a2eeef`, descripción "New feature or request" (default de GitHub).
- `documentation` — color `#0075ca`, descripción "Improvements or additions to documentation" (default de GitHub).

Los labels estándar restantes de GitHub que no se enumeran (`duplicate`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`) no se gestionan por Terraform (drift aceptado).

### 2.4 Dependabot

- `github_repository_vulnerability_alerts` — Dependabot alerts: `true`.
- `github_repository_dependabot_security_updates` — auto-fix PRs: `true` (requiere alerts habilitadas como prerequisito).

---

## 3. Diagrama de dependencias entre módulos

```mermaid
graph LR
    R[repo<br/>github_repository] --> B[branch-protection<br/>github_branch_protection]
    R --> L[labels<br/>github_issue_label x4]

    R -->|nombre_repo| B
    R -->|nombre_repo| L
```

El módulo `repo` es la fuente; `branch-protection` y `labels` dependen del nombre del repositorio creado.

---

## 4. Flujo operativo

```mermaid
flowchart LR
    DEV[Configurador] -->|edita .tf| GIT[Git commit]
    GIT --> CI[plan en PR]
    CI --> REV[Review humano]
    REV -->|merge a main| APPLY[terraform apply<br/>manual]
    APPLY --> GH[GitHub repo settings]
```

- El `apply` **no está automatizado en CI** (Principio #6 — IA sugiere, humano ejecuta).
- En PR se ejecuta `terraform plan` (manual o vía `validate.sh`) para revisar el diff antes del merge.
- El estado (`terraform.tfstate`) se mantiene **local** durante el piloto. Si el producto escala, se migra a state remoto (S3 + DynamoDB lock) en una segunda iteración — fuera del alcance MVP.

---

## 5. Restricciones de seguridad

- **El `GITHUB_TOKEN` nunca se versiona**. Se pasa por variable de entorno o por archivo `.terraform.tfvars.local` (gitignored).
- El token requiere scopes mínimos: `repo` (full) + `admin:org` (solo si se gestionan settings que lo exijan).
- **No se gestionan secrets del repositorio por Terraform** — los valores quedan fuera del state. La existencia de un secret se documenta en `docs/ai-pr-review-human-setup.md`; su rotación es manual.
- **`enforce_admins = true`** garantiza que ni siquiera el Configurador puede saltar el gate de merge.

---

## 6. Convenciones (steering)

Las convenciones que el agente respeta al generar HCL para este proyecto están en `.claude/skills/iac/SKILL.md`. Resumen:

- **Naming**: recursos en español (`module.repo.principal`, no `module.repo.main`); identificadores HCL en `snake_case`.
- **Tags / topics**: usar `topics` del repo como tagging del producto.
- **Mínimo privilegio**: scopes mínimos del token; nunca `*` en permisos.
- **Sin secrets en código**: ningún valor sensible en `.tf` ni en `.tfvars` versionado.

---

## 7. Entornos

| Entorno | Descripción | Provider config |
|---|---|---|
| `local` | Workstation del Configurador con `GITHUB_TOKEN` en `~/.zshrc`/`~/.bashrc` o `.terraform.tfvars.local` | `provider "github"` con `owner` por variable |
| `ci` *(futuro)* | Ejecución de `plan` en GitHub Actions con token de un GitHub App de la org | Fuera de alcance MVP |

No hay entorno `local` vs `dev` vs `prod` separados porque el activo gestionado es **un solo repositorio**.
