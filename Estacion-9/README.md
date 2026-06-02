# Estación 9 — Producción y Operación: Infraestructura como Código con IA

> Del producto verificado al producto **operable**. Modelos cloud (IaaS · PaaS · FaaS · AIaaS) · IaC declarativa con Terraform · idempotencia y state · LocalStack · MCPs de Terraform y AWS Docs · steering file de IaC.

> 📦 Mi entrega vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/infra/`](../Agente-IA-Desarrollo-ABAP/infra/) · [`../Agente-IA-Desarrollo-ABAP/specs/architecture.md`](../Agente-IA-Desarrollo-ABAP/specs/architecture.md) · [`../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md`](../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md) · [`../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md`](../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md).

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | Andrés Caicedo |
| Duración | ≈ 2 h (teoría + demo en vivo `init → plan → apply` LocalStack → AWS) |
| Foco | Computación en nube · IaC declarativa con Terraform · LocalStack · MCPs (Terraform · AWS Docs · LocalStack) · steering file de IaC |
| Prerequisitos | Producto de Estación 8 corriendo · Docker · Terraform · IDE agéntico con MCP · cuenta AWS con permisos para VPC/ECS/S3/IAM |
| Commits relevantes | `7503b85` (ADR-002 + Terraform + skill iac) · `4e25435` (limpieza warnings tras fmt/init/validate) |

---

## 2. Tema y objetivo de aprendizaje

Llevar un producto ya implementado y testeado a **producción de forma reproducible**, sin depender de configuración manual. La pregunta central: ¿cómo paso de "funciona en mi máquina con tests verdes" a "lo despliego con un comando y puedo destruirlo con otro"?

Cinco objetivos concretos:

1. Diferenciar **modelos de servicio cloud** (IaaS · PaaS · FaaS · AIaaS) y elegir el nivel correcto según cuánta responsabilidad operacional se quiere asumir.
2. Aplicar **IaC declarativa** con Terraform — flujo `init → plan → apply`, **idempotencia**, **state management**, composición de módulos reutilizables.
3. Validar infraestructura sin costo ni credenciales reales con **LocalStack**, y migrar a **AWS** cambiando solo el provider.
4. Usar el coding agent con **Terraform MCP**, **AWS Docs MCP** y **LocalStack MCP** para generar HCL preciso contra el schema real del provider — no inventado.
5. Diseñar la **spec de arquitectura** como contrato agente-equipo que el agente convierte en módulos Terraform, respetando reglas de seguridad y naming.

---

## 3. Conceptos clave

### 3.1 Espectro de modelos de servicio cloud

| Modelo | Qué gestiona el proveedor | Qué gestiona uno | Ejemplo |
|---|---|---|---|
| **On-Premises** | Nada | Hardware + SO + runtime + datos + app | Servidor en oficina |
| **IaaS** | Hardware + virtualización | SO + runtime + datos + app | EC2, VM Azure |
| **PaaS** | + SO + runtime | Datos + app | App Engine, Heroku, Vercel |
| **FaaS** | + runtime + escalado | Solo la función | Lambda, Cloud Functions |
| **AIaaS** | + modelos pre-entrenados | Solo el prompt / fine-tune | Bedrock, Vertex AI, Claude API |

Subir un escalón = más responsabilidad operacional cedida al proveedor + menos control fino. La **democratización** del cloud es justamente que cualquier dev puede usar capacidades antes exclusivas de ops.

### 3.2 IaC declarativa vs imperativa

| | Declarativa (Terraform, Pulumi) | Imperativa (scripts bash, Ansible parcial) |
|---|---|---|
| **Qué describes** | El estado final deseado | Los pasos para llegar |
| **Quién decide el plan** | La herramienta (vía diff vs state actual) | Vos |
| **Re-aplicar es seguro** | Sí — **idempotente** | Depende de cómo escribiste el script |
| **Drift detection** | Built-in (`plan` muestra desvíos) | Hay que construirla |

### 3.3 Vocabulario operativo de Terraform

| Término | Definición operativa |
|---|---|
| **Provider** | Plugin que traduce HCL a llamadas a la API del cloud (`hashicorp/aws`, `integrations/github`). Vive en `~/.terraform.d/plugins/` tras `init`. |
| **State** | Snapshot JSON de qué recursos administra Terraform y cómo se mapean a IDs reales del cloud. Puede ser local (`terraform.tfstate`) o remoto (S3 + DynamoDB lock). |
| **Idempotencia** | Aplicar el mismo `.tf` N veces produce el mismo estado. Si el state coincide con el real, `apply` no hace nada. |
| **Plan** | Diff entre lo declarado y el state. Muestra `+` crear, `~` modificar, `-` destruir. Es el oracle antes del `apply`. |
| **Drift** | Discrepancia entre lo declarado y el estado real (alguien cambió algo en la consola). `terraform plan -detailed-exitcode` → exit 2. |
| **Import** | Adoptar un recurso preexistente en el state sin recrearlo. Crítico para repos que ya existen. |
| **Module** | Carpeta con `main.tf`/`variables.tf`/`outputs.tf` reusable. Se llama desde la raíz con `module "x" { source = "./modules/x" }`. |
| **Lock file** | `.terraform.lock.hcl`. Fija versiones de providers para que el mismo `init` en otra máquina resuelva igual. **Se versiona**. |

### 3.4 LocalStack — la nube en tu máquina

Contenedor Docker que **intercepta el SDK de AWS** en `localhost:4566`. El mismo `.tf` apunta a LocalStack o a `us-east-1` con un cambio de variable. Cuesta cero, no necesita credenciales reales, y soporta la mayoría de servicios populares (S3, DynamoDB, EC2, Lambda, ECS).

**Pieza clave del aprendizaje**: el costo de un error en LocalStack es 0€. El costo del mismo error en AWS real puede ser una factura de tres dígitos. Por eso el flujo canónico de la clase es **siempre Local → swap → Cloud**, nunca directo a Cloud.

### 3.5 MCPs específicos de IaC

| MCP | Función operativa |
|---|---|
| **Terraform MCP Server** (HashiCorp) | El agente consulta el Registry en vivo: schemas de providers, atributos, ejemplos. Evita inventar campos. |
| **AWS Documentation MCP** (awslabs) | Valida configuraciones contra docs oficiales, best practices y límites de servicio. |
| **LocalStack MCP** | Gestiona el emulador desde el chat: start/stop, ver recursos, debugging. |

La regla: **antes de generar HCL, el agente consulta el MCP**. Sin esto, el agente alucina atributos deprecados (caso real en mi entrega: `vulnerability_alerts` en `github_repository`).

### 3.6 Spec de arquitectura como contrato

Documento markdown que describe **qué hay que provisionar** (networking, compute, storage), **con qué restricciones de seguridad** y **con qué naming/tagging**. Es el insumo que el agente convierte en módulos Terraform. Sin spec, el agente improvisa; con spec, el output es predecible.

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `clase-9 (1).pdf` | Slides del instructor — versión completa. |
| `clase-9-estudiante.md` | Guía del estudiante: bienvenida, recorrido en 6 secciones, antes-de-la-clase, tarea (4 ítems), artefactos esperados, herramientas, repos. |
| `repos-workshops/iac-infra/` | Repo demostrativo de la sesión — Terraform completo del producto de Clase 8 (VPC + ECS Fargate + ALB + DynamoDB + S3 + IAM + CloudWatch). Incluye `docker-compose.yml` para LocalStack, `providers-local.tfvars` y `providers-aws.tfvars`, `scripts/validate.sh`, `specs/architecture.md`. Referencia de estilo HCL y estructura de módulos. |
| `repos-workshops/localstack/` | Setup minimalista de LocalStack como ejemplo independiente del producto. |

Recursos externos referenciados:

- Terraform Docs — https://developer.hashicorp.com/terraform
- Terraform AWS Provider — https://registry.terraform.io/providers/hashicorp/aws
- LocalStack — https://docs.localstack.cloud
- Terraform MCP Server — https://github.com/hashicorp/terraform-mcp-server
- AWS Documentation MCP — https://github.com/awslabs/mcp
- AWS Well-Architected Framework — https://aws.amazon.com/architecture/well-architected/

---

## 5. Mi entrega — IaC del repo GitHub (Opción A1)

El producto **no es desplegable en cloud** — vive como configuración de Claude Code en la máquina del desarrollador (ADR-001). La spec de la clase asume API + DB + balanceador, ninguno de los cuales aplica acá. Por eso reinterpreté la tarea explícitamente vía ADR.

### 5.1 La elección estratégica — ADR-002

Frente al gap producto/clase, evalué tres opciones:

| Opción | Qué propone | Por qué la consideré | Por qué la descarté / elegí |
|---|---|---|---|
| **A1 — IaC del repo GitHub** ✅ | Provider `integrations/github` para gestionar settings, branch protection y labels del repo | Es lo único hospedado del producto y materializa el gate del Principio #1 del PRD ("desarrollador garante final") | **Elegida.** Coherente con ADR-001 y PRD §6 P3. Se ejercita Terraform sobre algo real. |
| B — Dashboard ficticio AWS | Mini-stack S3 + DynamoDB + Lambda para reemplazar el Excel del piloto | Permite flujo dual LocalStack → AWS | Descartada. Introduce activos no autorizados que el producto no necesita. |
| C — Spec anticipatoria Fase 2 | Diseñar la arquitectura del MCP read-only a SAP (PRD §11.3) | Realismo arquitectónico | Descartada. Solo spec, sin `apply`. Pierde la parte operativa. |

⚠️ **Trade-off aceptado**: pierdo el ejercicio dual **LocalStack → AWS** que la clase pedía. LocalStack emula AWS, no GitHub. A cambio gano IaC sobre el único activo hospedado del producto, conservo `init/plan/apply/state/drift/módulos/MCPs` sobre algo real, y dejo la decisión documentada con criterios.

### 5.2 Estructura de la entrega

La entrega vive en [`../Agente-IA-Desarrollo-ABAP/`](../Agente-IA-Desarrollo-ABAP/):

```
Agente-IA-Desarrollo-ABAP/
├── entregables/
│   └── ADR-002-no-iac-cloud.md              ← decisión raíz de Opción A1
├── specs/
│   └── architecture.md                       ← contrato agente-equipo del repo como infra
├── infra/
│   ├── provider.tf                           ← integrations/github ~> 6.0
│   ├── main.tf                               ← orquesta 3 módulos
│   ├── variables.tf                          ← organizacion, nombre_repo, etiqueta_review_ia, topics
│   ├── outputs.tf                            ← url_repo, rama_protegida, etiqueta_review_ia, labels_gestionadas
│   ├── .terraform.lock.hcl                   ← fija integrations/github v6.12.1
│   └── modules/
│       ├── repo/                             ← github_repository (prevent_destroy=true) + dependabot
│       │   ├── main.tf · variables.tf · outputs.tf · versions.tf
│       ├── branch-protection/                ← github_branch_protection (enforce_admins=true)
│       │   ├── main.tf · variables.tf · outputs.tf · versions.tf
│       └── labels/                           ← github_issue_label (review-this + 3 estándar)
│           ├── main.tf · variables.tf · outputs.tf · versions.tf
├── scripts/
│   └── validate.sh                           ← fmt + validate + plan -detailed-exitcode (drift)
└── .claude/skills/iac/
    └── SKILL.md                              ← steering file: R1-R5 (scope cerrado, cero secrets,
                                                 prevent_destroy, enforce_admins, state local)
```

### 5.3 Decisiones técnicas clave

| Decisión | Razón |
|---|---|
| **Provider `integrations/github` (no `hashicorp/github`)** | `hashicorp/github` está deprecado desde v6; el Registry redirige a `integrations/github`. Sin declaración explícita en módulos hijos, Terraform caía en discovery y descargaba ambos providers — bug pillado en `init` y arreglado en commit `4e25435`. |
| **`prevent_destroy = true` en `github_repository.principal`** | Salvaguarda del producto: nadie ejecuta `terraform destroy` accidentalmente y borra el repo. Está documentado como R3 del skill. |
| **`enforce_admins = true` en branch protection de `main`** | Es la materialización del Principio #1 del PRD: ni el Configurador puede saltar el gate de merge. R4 del skill. |
| **State local, no remoto (S3 + DynamoDB lock)** | El piloto opera con un solo Configurador y un repo. Introducir state remoto sería overkill. R5 del skill: migrar a remoto es decisión arquitectónica futura (ADR-003). |
| **`terraform import` documentado, no automatizado** | El repo ya existía cuando empezó la estación. `apply` desde cero intentaría crearlo y fallaría con "name already exists". El README §9.3 instruye a importar antes del primer `plan`. |
| **`vulnerability_alerts` migrado a recurso separado** | El argumento inline está deprecado en provider v6. Lo reemplacé por `github_repository_dependabot_security_updates`, que además habilita auto-fix PRs (mejora sobre solo alertas). |
| **`.terraform.lock.hcl` versionado** | Garantiza que `init` en otra máquina resuelva la misma versión de provider. Excluí `.terraform/` y `terraform.tfstate` del git pero no el lock — convención estándar. |

### 5.4 Resultados de validación local

| Comando | Resultado | Tiempo |
|---|---|---|
| `terraform --version` | v1.15.5 (instalada vía `winget install Hashicorp.Terraform`) | < 1 s |
| `terraform fmt -check -recursive` | Sin diff | < 1 s |
| `terraform init -backend=false` | Sólo descarga `integrations/github` v6.12.1 (tras fix `versions.tf` en módulos) | ~5 s |
| `terraform validate` | `Success! The configuration is valid.` (cero warnings tras migración de `vulnerability_alerts`) | < 1 s |
| `terraform plan` | _Pendiente_ — requiere `GITHUB_TOKEN` con scopes `repo` + `admin:org` | N/A |
| `terraform apply` | _Pendiente_ — manual, sólo lo ejecuta el Configurador (Principio #6 del PRD) | N/A |

---

## 6. Aporte al proyecto central

Esta estación cierra el ciclo de gobierno del repo: lo que antes era configuración invisible en la UI de GitHub (branch protection, labels, settings) ahora es código revisable, versionable y auditable.

| Componente | Ubicación | Estado |
|---|---|---|
| ADR-002 (no IaC cloud, sí IaC del repo) | [`../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md`](../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md) | ✅ |
| Spec de arquitectura del repo | [`../Agente-IA-Desarrollo-ABAP/specs/architecture.md`](../Agente-IA-Desarrollo-ABAP/specs/architecture.md) | ✅ |
| Raíz Terraform (provider + main + variables + outputs) | [`../Agente-IA-Desarrollo-ABAP/infra/`](../Agente-IA-Desarrollo-ABAP/infra/) | ✅ |
| Módulo `repo` (settings + Dependabot security updates) | [`../Agente-IA-Desarrollo-ABAP/infra/modules/repo/`](../Agente-IA-Desarrollo-ABAP/infra/modules/repo/) | ✅ |
| Módulo `branch-protection` (gate del Principio #1) | [`../Agente-IA-Desarrollo-ABAP/infra/modules/branch-protection/`](../Agente-IA-Desarrollo-ABAP/infra/modules/branch-protection/) | ✅ |
| Módulo `labels` (`review-this` + 3 estándar) | [`../Agente-IA-Desarrollo-ABAP/infra/modules/labels/`](../Agente-IA-Desarrollo-ABAP/infra/modules/labels/) | ✅ |
| Script `validate.sh` (fmt + validate + drift) | [`../Agente-IA-Desarrollo-ABAP/scripts/validate.sh`](../Agente-IA-Desarrollo-ABAP/scripts/validate.sh) | ✅ |
| Steering file de IaC (R1-R5) | [`../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md`](../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md) | ✅ |
| `.gitignore` ampliado (Terraform) | [`../Agente-IA-Desarrollo-ABAP/.gitignore`](../Agente-IA-Desarrollo-ABAP/.gitignore) | ✅ |
| README §9 IaC | [`../Agente-IA-Desarrollo-ABAP/README.md`](../Agente-IA-Desarrollo-ABAP/README.md) | ✅ |
| Lock file de providers | [`../Agente-IA-Desarrollo-ABAP/infra/.terraform.lock.hcl`](../Agente-IA-Desarrollo-ABAP/infra/.terraform.lock.hcl) | ✅ |

### 6.1 Pendientes operativos (no técnicos)

| Pendiente | Cómo / Dónde | Esfuerzo |
|---|---|---|
| Generar `GITHUB_TOKEN` con scopes `repo` + `admin:org` y exportarlo | UI de GitHub → Developer settings → Personal access tokens | Bajo |
| `terraform import` de los recursos existentes (repo + label `review-this`) | Instrucciones en `README.md` §9.3 del proyecto central | Bajo |
| Primer `terraform plan` real para validar el diff vs estado actual | `cd infra && terraform plan -var="organizacion=MiguelAndre"` | Bajo |
| `apply` y verificar que `enforce_admins=true` queda activo en `main` | Manual, una sola vez | Bajo |
| (Eventual) Migrar state local a remoto si entra un segundo Configurador | Crear ADR-003 antes de actuar (R5 del skill) | Medio |

### 6.2 Decisiones de scope explícitas

- **No se introdujo `docker-compose.yml`** porque LocalStack no aplica al provider `integrations/github`.
- **No hay `providers-local.tfvars` ni `providers-aws.tfvars`** — solo hay un entorno (`local` del Configurador). Documentado en `specs/architecture.md` §7.
- **No se gestionan los secrets del workflow** (`CLAUDE_CODE_OAUTH_TOKEN`) por Terraform — sus valores quedarían en el state. Setup manual sigue documentado en [`../Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md`](../Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md).
- **No se gestionan workflows** (`.github/workflows/*.yml`) — ya están versionados como YAML y se aplican por presencia, no por `apply`. Doblar gobernanza no agrega valor.

---

## 7. Lecciones / takeaways

1. **Cuando la spec de la clase no aplica 1:1 al producto, el output legítimo no es "saltar la clase" sino documentar la decisión con criterios.** El ADR-002 deja por escrito qué se evaluó (3 opciones), con qué drivers (5 criterios) y qué se eligió (A1) — y por qué se renunció al ejercicio dual LocalStack/AWS. Eso es más valioso que un stack S3/DynamoDB ficticio que no usa nadie.

2. **`terraform validate` atrapa cosas que el código aparenta correcto.** Antes de instalar Terraform y correr `init/validate` localmente, mi config compilaba "en la cabeza". Al ejecutar: (a) provider legacy `hashicorp/github` se descargaba en paralelo porque los módulos hijos no declaraban `required_providers`, (b) `vulnerability_alerts` estaba deprecado en v6. Ambos warnings eran invisibles sin correr la herramienta. Lección: cero "trust me bro" en IaC — siempre corre `fmt + init + validate` antes de declarar terminado.

3. **Terraform sirve para auditar lo invisible.** La branch protection de `main` antes vivía en clicks de la UI de GitHub: nadie sabía exactamente qué reviewers requería, si `enforce_admins` estaba activo, si `dismiss_stale_reviews` también. Pasarlo a HCL convierte un control crítico (el gate del Principio #1 del PRD) en algo revisable en PR. La materia oculta del producto se hace visible.

4. **El MCP de Terraform no es opcional cuando se generan recursos no triviales.** Inventar `vulnerability_alerts = true` porque "siempre estuvo ahí" me hubiera funcionado en v5; en v6 emite warning y va a romper en v7. Consultar el MCP del provider antes de escribir HCL no es lujo — es prerequisito.

---

## Referencias rápidas

- Material del curso:
  - Guía estudiante: [`clase-9-estudiante.md`](clase-9-estudiante.md)
  - Slides completos: [`clase-9 (1).pdf`](clase-9%20%281%29.pdf)
  - Repo demostrativo: [`repos-workshops/iac-infra/`](repos-workshops/iac-infra/)
  - Setup LocalStack: [`repos-workshops/localstack/`](repos-workshops/localstack/)
- Mi entrega en el proyecto central:
  - ADR-002: [`../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md`](../Agente-IA-Desarrollo-ABAP/entregables/ADR-002-no-iac-cloud.md)
  - Spec: [`../Agente-IA-Desarrollo-ABAP/specs/architecture.md`](../Agente-IA-Desarrollo-ABAP/specs/architecture.md)
  - Terraform: [`../Agente-IA-Desarrollo-ABAP/infra/`](../Agente-IA-Desarrollo-ABAP/infra/)
  - Skill IaC: [`../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md`](../Agente-IA-Desarrollo-ABAP/.claude/skills/iac/SKILL.md)
- Recursos externos:
  - Terraform Docs: https://developer.hashicorp.com/terraform
  - GitHub Provider: https://registry.terraform.io/providers/integrations/github/latest/docs
  - LocalStack: https://docs.localstack.cloud
  - Terraform MCP Server: https://github.com/hashicorp/terraform-mcp-server
  - AWS Well-Architected Framework: https://aws.amazon.com/architecture/well-architected/
