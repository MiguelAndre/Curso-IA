# ADR-002: No hay infraestructura cloud propia; el repositorio de GitHub se gestiona como IaC

- **Status**: Accepted
- **Date**: 2026-06-01 (decidido en Estación 9 — Producción y Operación)
- **Deciders**: Jefe de Tecnología + Desarrollador líder (Configurador del producto)
- **Consulted**: Estudiante autor del piloto, instructor de la Estación 9
- **Stakeholders informados**: 3 desarrolladores ABAP (audiencia del piloto), equipo de plataforma SAP
- **Relacionada con**: ADR-001 (Claude Code como plataforma)

---

## 1. Contexto y problema

La Estación 9 del programa propone llevar el producto a producción mediante **Infraestructura como Código** con Terraform, validar localmente con **LocalStack** y desplegar luego en **AWS real**. El flujo asume un producto desplegable de la forma "API + base de datos + balanceador" — el patrón típico de la Clase 8.

El **Agente IA para Desarrollo ABAP** no encaja en ese patrón. Según ADR-001, el producto se materializa como **configuración de Claude Code** (CLAUDE.md, sub-agentes, comandos, skills) que se ejecuta en la máquina del desarrollador a través del runtime Claude Code (CLI/IDE). No hay API que servir, no hay base de datos que persistir, no hay compute que provisionar.

**Pregunta arquitectónica**: ¿qué entrega corresponde a la Estación 9 para un producto que **no requiere infraestructura cloud**?

---

## 2. Drivers de decisión

| # | Driver | Origen |
|---|---|---|
| D1 | Coherencia con ADR-001 y PRD §6 Principio #3 — el agente opera solo en ambiente de desarrollo | ADR-001, PRD §6 |
| D2 | No inflar alcance: introducir infra cloud que el producto no usa hoy es deuda gratis | Reversibilidad (ADR-001 D8) |
| D3 | Aprovechar el aprendizaje real de la estación (`init → plan → apply`, módulos, state, drift, MCPs) sobre algo que **sí** existe en el producto | Objetivo pedagógico de la Estación 9 |
| D4 | El único activo hospedado del producto es el repositorio de GitHub (settings, branch protection, label `review-this`, workflow del AI PR Review, secrets) | Inventario actual del producto |
| D5 | Auditabilidad: la configuración del repo afecta el gate de merge y debe versionarse, no quedarse en clicks manuales en la UI | PRD §6 Principio #5 |

---

## 3. Opciones consideradas

### Opción A — IaC del repositorio GitHub con provider `integrations/github` (**elegida**)

Se modela como Terraform únicamente lo que el producto sí tiene hospedado: el repo de GitHub. Provider `integrations/github` con `terraform import` para adoptar el repo existente. No se introduce LocalStack porque no emula GitHub, y se documenta esa renuncia.

### Opción B — IaC ficticia: provisionar dashboard de piloto en AWS

Modelar un mini-stack S3 + DynamoDB + Lambda para reemplazar el Excel del piloto (PRD §10). Permite ejercicio dual LocalStack → AWS real, pero introduce un componente que el producto **no necesita** y que la empresa **no autorizó**.

### Opción C — IaC anticipatoria: modelar la Fase 2 del PRD (MCP de solo lectura a SAP)

Diseñar la arquitectura de despliegue del MCP read-only descrito en PRD §11.3 (ECS Fargate + IAM + Secrets Manager). Permite arquitectura realista pero deja todo en spec sin `apply` — pierde la parte operativa.

---

## 4. Evaluación

| Criterio | A — IaC del repo GitHub | B — Dashboard ficticio | C — Fase 2 anticipatoria |
|---|:-:|:-:|:-:|
| Coherencia con ADR-001 y PRD (D1) | 🟢 No introduce infra que viole P3 | 🔴 Introduce activos no autorizados | 🟡 Spec de algo aún no decidido |
| No inflar alcance (D2) | 🟢 Solo lo que existe | 🔴 Infra muerta desde el día 1 | 🟡 Spec sin uso inmediato |
| Aprendizaje pedagógico (D3) | 🟡 Pierde LocalStack y AWS, conserva todo lo demás | 🟢 Flujo dual completo | 🔴 Solo spec, no `apply` |
| Activo real gestionado (D4) | 🟢 El repo y su config | 🔴 Ninguno | 🔴 Ninguno |
| Auditabilidad de gates (D5) | 🟢 Branch protection en código | 🟡 No aplica | 🟡 No aplica |

**Leyenda**: 🟢 favorable · 🟡 aceptable · 🔴 desfavorable

---

## 5. Decisión

**Se adopta la Opción A**: el producto no provisiona infraestructura cloud propia. Se gestiona como Infraestructura como Código el **repositorio de GitHub** donde vive el producto, usando el provider `integrations/github` de Terraform.

> **Nota de implementación (post-apply 2026-06-01)**: el producto `Agente-IA-Desarrollo-ABAP` vive como subcarpeta del repo `MiguelAndre/Curso-IA` — no tiene repo dedicado. Por eso el IaC gestiona ese repo (público, del curso), no uno hipotético del producto. Si en el futuro el producto se extrae a su propio repo, se reapunta `var.nombre_repo` y se reimporta el state.

Alcance gestionado por IaC:

- `github_repository` — nombre, descripción, default branch, settings (issues, projects, wiki), topics.
- `github_branch_protection` — protección de `main`: linear history, sin force-push, sin deletions. **`enforce_admins=false`** y **`required_approving_review_count=0`** porque es un repo solo (single-Configurador); GitHub no permite self-approve. Para repos multi-dev del producto en el futuro: `true`/`1` (R4 del skill `iac`).
- `github_issue_label` — label `review-this` (gate del AI PR Review) + labels base (`bug`, `enhancement`, `documentation`) alineadas con los defaults de GitHub.
- `github_repository_vulnerability_alerts` — habilita Dependabot alerts.
- `github_repository_dependabot_security_updates` — habilita auto-fix PRs (requiere alerts habilitadas primero).

**Fuera de alcance** (con justificación):

- **LocalStack**: emula AWS, no GitHub. No aplica al provider elegido. El flujo Local→Cloud no se ejercita.
- **AWS real**: no hay activos AWS que provisionar.
- **`.github/workflows/ai-pr-review.yml`**: ya está versionado en el repo y se aplica por el solo hecho de existir en `main`. No requiere `terraform apply`.
- **Secrets**: los valores no se versionan ni se pasan por Terraform. La referencia a su existencia y al setup manual queda en `docs/ai-pr-review-human-setup.md`.
- **Compute, storage, networking**: no aplica — no hay backend del producto.

---

## 6. Consecuencias

### Positivas

- **Coherencia mantenida con ADR-001 y PRD §6 P3**: el agente sigue sin tocar cloud.
- **Auditabilidad del gate de merge**: la branch protection de `main` deja de ser configuración invisible en la UI de GitHub y pasa a estar en `infra/modules/branch-protection/` versionado.
- **Aprendizaje real de Terraform**: el flujo `init → plan → import → apply → drift detection` se ejercita sobre algo del producto, no sobre un stub.
- **Reversibilidad**: si la decisión se revoca, `terraform destroy` no rompe nada del producto — solo elimina la gestión declarativa; el repo y sus settings siguen.
- **Documenta una decisión que, sin ADR, parecía omisión**: futuros lectores entienden por qué `infra/` no incluye recursos AWS.

### Negativas / Trade-offs aceptados

- **Se renuncia al ejercicio dual LocalStack → AWS** de la Estación 9. **Mitigación**: el resto del aprendizaje (HCL, módulos, state, drift, MCPs, steering files) se conserva sobre el provider GitHub.
- **`terraform apply` requiere un `GITHUB_TOKEN` con scopes `repo` + `admin:org` que el usuario debe generar manualmente**. **Mitigación**: documentado como paso de setup, alineado con el patrón ya existente para el AI PR Review (`docs/ai-pr-review-human-setup.md`).
- **El primer `apply` puede chocar con configuración existente del repo**. **Mitigación**: se documenta `terraform import` para adoptar el estado actual en lugar de intentar crearlo desde cero.

### Neutrales

- **No se introduce `docker-compose.yml`** porque LocalStack no aplica. La estructura `iac-infra` propuesta por la Estación 9 se adapta: hay `infra/`, `scripts/`, `specs/architecture.md`, pero no `docker-compose.yml` ni `providers-local.tfvars`.

---

## 7. Cumplimiento con Principios No Negociables del PRD

| Principio | Cómo la decisión lo respeta |
|---|---|
| P1 — Desarrollador garante final | El `apply` lo ejecuta una persona; no hay automatización CI/CD del IaC del repo. |
| P3 — Sin conexión a SAP | La decisión confirma que no hay infra propia que pueda derivar en conexión a SAP. |
| P5 — Trazabilidad total | Branch protection y labels dejan de ser config invisible y se vuelven código revisable. |
| P6 — IA sugiere, humano ejecuta | El agente puede proponer cambios al IaC; el `apply` lo ejecuta el Configurador. |

---

## 8. Revisión y revocación

**Cuándo revisar**:
- Si la empresa decide hospedar un componente del producto (p. ej., MCP de Fase 2 en PRD §11.3) — entonces vuelve la pregunta original de la Estación 9 con un alcance distinto y se crea un ADR-003.
- Si el repositorio migra a otra plataforma (GitLab, Azure DevOps) — cambia el provider, no la decisión raíz.

**Cómo revocar**: nuevo ADR que marque este como `Superseded`. `terraform destroy` no es destructivo para el producto.

---

## 9. Referencias

- **ADR-001**: `entregables/ADR-001-claude-code-como-plataforma.md` (decisión raíz que hace que no haya infra cloud)
- **PRD**: `prd.md` §6 (Principios No Negociables), §11.3 (Fase 2)
- **Spec de IaC**: `specs/architecture.md`
- **Setup manual del token**: documentado en README §10 y referenciado desde `docs/ai-pr-review-human-setup.md`
- **Estación 9**: `../Estacion-9/clase-9-estudiante.md`, repositorio de referencia `../Estacion-9/repos-workshops/iac-infra/`
