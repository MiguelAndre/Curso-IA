# AI PR Review — Setup humano

> Este documento describe los pasos manuales que **debe ejecutar un humano con permisos de admin del repo** para que `.github/workflows/ai-pr-review.yml` funcione. Sin estos pasos, el workflow falla y los PRs no reciben review automatizado.

---

## 1. Modelo de seguridad

- **Same-repo only por defecto**. Los PRs desde forks no disparan el AI review (el workflow tiene un guard explícito).
- Si en algún momento se quiere habilitar review en fork PRs, requiere rediseño: secrets via OIDC, jobs separados sin acceso a secret de API, etc.
- **El review es advisory**. El gate de merge es humano vía Branch Protection (paso 5).

---

## 2. Secrets a configurar (Settings → Secrets and variables → Actions → Secrets)

| Nombre | Valor | Notas |
|---|---|---|
| `AI_REVIEW_API_KEY` | API key del proveedor de modelo | Tratar como secret. Rotar periódicamente. No exponer en logs. |

---

## 3. Variables a configurar (Settings → Secrets and variables → Actions → Variables)

| Nombre | Valor sugerido | Notas |
|---|---|---|
| `AI_REVIEW_PROVIDER_KIND` | `anthropic` | También: `openai`, `bedrock`, etc. según proveedor instalado. |
| `AI_REVIEW_MODEL_ID` | `claude-opus-4-7` | Modelo a usar para el review. Ajustar según presupuesto/latencia. |
| `AI_REVIEW_BASE_URL` | `https://api.anthropic.com` | URL del proveedor. Para Bedrock usar endpoint regional. |
| `AI_REVIEW_STYLE` | `concise-actionable` | Estilo de feedback. Coincidir con `.agents/skills/custom-codereview-guide.md` §6. |
| `AI_REVIEW_REQUIRE_EVIDENCE` | `true` | Si `true`, el workflow rechaza PRs sin sección `## Evidence`. |

---

## 4. Fijar la acción a un SHA completo

El workflow referencia `All-Hands-AI/openhands-pr-review-action@REPLACE_WITH_FULL_SHA`.

Pasos:

1. Buscar la release estable más reciente en el repo de la acción.
2. Obtener el SHA completo del commit asociado a esa release (no usar tag móvil; tag puede mover).
3. Reemplazar `REPLACE_WITH_FULL_SHA` por el SHA en `.github/workflows/ai-pr-review.yml`.
4. Commit + PR. Que el propio AI review apruebe (o un humano) este PR de bootstrap.

> Fijar a SHA evita ataques de supply chain por reescritura de tags.

---

## 5. Branch Protection (Settings → Branches → Branch protection rules)

Sobre `main` (y cualquier branch protegida):

- [x] Require a pull request before merging.
- [x] Require approvals: **1** (mínimo). Este es el gate humano.
- [x] Dismiss stale pull request approvals when new commits are pushed.
- [x] Require status checks to pass before merging.
- [x] Require branches to be up to date before merging.
- [x] Require conversation resolution before merging.
- [x] Status checks requeridos: `ai-review` **opcional** — el review es advisory, no debería bloquear merges en este modelo. Si el equipo prefiere bloquear, marcarlo como required.
- [x] Do not allow bypassing the above settings (incluso para admins).

---

## 6. Label de re-ejecución

Crear (Issues/Pull requests → Labels):

| Label | Color sugerido | Uso |
|---|---|---|
| `review-this` | `#0E8A16` (verde) | Aplicar al PR cuando se quiere forzar una nueva ejecución del AI review sin pushear commits. |

El workflow detecta el label y vuelve a correr el job (ver `.github/workflows/ai-pr-review.yml`, paso "Detect rerun label").

---

## 7. Verificación post-setup

Para validar que todo está bien:

1. Crear branch nueva con un cambio trivial (ej. fix de typo en `README.md`).
2. Abrir PR usando la plantilla `.github/pull_request_template.md`. Llenar sección `## Evidence` (aunque sea breve).
3. Confirmar:
   - El workflow `AI PR Review` aparece en la pestaña "Checks" del PR.
   - El job `guard-fork` pasa (same_repo=true).
   - El job `ai-review` se ejecuta y deja al menos un comentario en el PR.
4. Aplicar y quitar el label `review-this` para verificar que el rerun funciona.
5. Cerrar el PR sin mergear (era prueba de bootstrap).

---

## 8. Rotación y auditoría

- **Rotar `AI_REVIEW_API_KEY`** al menos cada 90 días.
- Revisar el log de "Audit" del repo periódicamente para detectar cambios no autorizados al workflow.
- Cualquier cambio a `.github/workflows/ai-pr-review.yml` debe pasar review humana (no autoaprobar).

---

## 9. Costos esperados

- Cada PR consume tokens del modelo configurado.
- Estimación inicial: $0.05 – $0.50 USD por PR según tamaño del diff y modelo.
- Si el equipo crece o los PRs son grandes, considerar usar un modelo más económico (`claude-haiku-4-5`) y dejar Opus sólo para PRs con label `deep-review`.

---

## 10. Cuándo desactivar temporalmente

- Si el proveedor del modelo tiene incidente y el job está fallando consistentemente, comentar `ai-review:` en el workflow para desactivar el job y volver a PR humano puro.
- Documentar el porqué con un commit `chore: disable AI review temporalmente — incidente <ID>`.
- Reactivar y comentar en el siguiente standup.

---

## 11. Referencias

- `.github/workflows/ai-pr-review.yml` — workflow.
- `.agents/skills/custom-codereview-guide.md` — guía custom del review.
- `.github/pull_request_template.md` — plantilla de PR con Evidence obligatoria.
- `AGENTS.md` §8 — contrato del review en el repo.
- `prd.md` §6 — Principios que el review verifica.
