# AI PR Review — Setup humano

> Este documento describe los pasos manuales que **debe ejecutar un humano con permisos de admin del repo** para que `.github/workflows/ai-pr-review.yml` funcione. Sin estos pasos, el workflow falla y los PRs no reciben review automatizado.

> **Ubicación del workflow**: `.github/workflows/ai-pr-review.yml` en la **raíz del repo** (`MiguelAndre/Curso-IA`). El workflow aplica a todos los PRs del repo, no sólo a los que tocan `Agente-IA-Desarrollo-ABAP/`.

---

## 1. Modelo de seguridad

- **Acción usada**: [`anthropics/claude-code-action@787c5a0ce96a9a6cfb050ea0c8f4c05f2447c251`](https://github.com/anthropics/claude-code-action) (v1, release 2025-08-26). Fijada por SHA completo para mitigar supply-chain.
- **Same-repo only por defecto**. Los PRs desde forks no disparan el AI review (guard explícito en el job `guard-fork`).
- Si en algún momento se quiere habilitar review en fork PRs, requiere rediseño: OIDC, jobs separados sin acceso al token, etc.
- **El review es advisory**. El gate de merge es humano vía Branch Protection (§5).

---

## 2. Secrets a configurar (Settings → Secrets and variables → Actions → Secrets)

| Nombre | Valor | Notas |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Token OAuth de tu suscripción Claude Pro/Max | **Recomendado**. Usa la suscripción existente — sin costo por token. Generación en §2.1. **El mismo secret lo reutiliza** `.github/workflows/qa.yml` (suite QA); configurarlo una vez sirve para ambos workflows. |

### 2.1 Cómo generar `CLAUDE_CODE_OAUTH_TOKEN`

En una terminal local con Claude Code instalado y autenticado con tu cuenta Pro/Max:

```bash
claude setup-token
```

El comando imprime un token de larga duración. Copialo tal cual al secret de GitHub (`Settings → Secrets and variables → Actions → New repository secret → Name: CLAUDE_CODE_OAUTH_TOKEN`).

### 2.2 Alternativa: API key (cobra por token)

Si en algún momento se necesita usar la API directa de Anthropic (cobra por token, factura separada):

- Secret `ANTHROPIC_API_KEY` con la API key de la consola.
- En el workflow, cambiar `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}` por `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`.

Esta variante **no es la default**. Solo usarla si los rate limits del plan Pro/Max no alcanzan.

---

## 3. Variables a configurar

**Ninguna**. El comportamiento del review está parametrizado dentro del workflow (`prompt` con la guía, `claude_args` con tools permitidas). Esto reduce la superficie de configuración y mantiene el contrato del review versionado en el repo.

Si en el futuro se quiere parametrizar el modelo, el estilo o el require-evidence, hacerlo agregando variables en `Settings → Secrets and variables → Actions → Variables` y referenciarlas en el workflow.

---

## 4. SHA pinning de la acción

El workflow referencia `anthropics/claude-code-action@787c5a0ce96a9a6cfb050ea0c8f4c05f2447c251` (release v1 del 2025-08-26).

Para actualizar a una release más nueva:

1. Ver releases en https://github.com/anthropics/claude-code-action/releases.
2. Tomar el SHA completo del commit asociado a la release (no el tag móvil).
3. Reemplazar el SHA en el `uses:` del workflow y dejar el comentario `# vX — YYYY-MM-DD` al lado.
4. Abrir PR para que el propio AI review (corriendo con la versión anterior) lo apruebe. Mergear con review humano.

> Fijar a SHA evita ataques de supply chain por reescritura de tags. **No uses tags móviles como `@v1` o `@main` en producción**.

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

El workflow escucha el evento `pull_request: labeled` y sólo dispara `ai-review` cuando la label aplicada es **exactamente** `review-this`. Aplicar otras labels no consume tokens ni dispara el job.

---

## 7. Verificación post-setup

Para validar que todo está bien:

1. Crear branch nueva con un cambio trivial (ej. fix de typo en `README.md`).
2. Abrir PR usando la plantilla `.github/pull_request_template.md`. Llenar sección `## Evidence` (aunque sea breve).
3. Confirmar:
   - El workflow `AI PR Review` aparece en la pestaña "Checks" del PR.
   - El job `guard-fork` pasa (`same_repo=true`).
   - El step `Verify PR has Evidence section` pasa.
   - El step `Run Claude Code PR Review` se ejecuta y deja al menos un comentario en el PR.
4. Quitar y volver a aplicar el label `review-this` para verificar que el rerun funciona.
5. Cerrar el PR sin mergear (era prueba de bootstrap).

Si la verificación falla, revisar:

- ¿Está `CLAUDE_CODE_OAUTH_TOKEN` configurado y vigente?
- ¿La sección `## Evidence` está presente en el cuerpo del PR?
- ¿El SHA de la acción es válido?
- Logs del workflow en `Actions → AI PR Review → <run> → ai-review`.

---

## 8. Rotación y auditoría

- **Rotar `CLAUDE_CODE_OAUTH_TOKEN`** si sospechás que se filtró o cada 6 meses. Para rotar: correr `claude setup-token` de nuevo y reemplazar el valor del secret. Revocar el viejo desde `claude.ai/settings/security`.
- Revisar el log de "Audit" del repo periódicamente para detectar cambios no autorizados al workflow.
- Cualquier cambio a `.github/workflows/ai-pr-review.yml` debe pasar review humana (no autoaprobar).

---

## 9. Costos esperados

- Con `CLAUDE_CODE_OAUTH_TOKEN` (recomendado): **$0 USD adicionales**. Consume contra los rate limits de tu plan Pro/Max.
- Con `ANTHROPIC_API_KEY` (alternativa): $0.05 – $0.50 USD por PR según tamaño del diff y modelo.
- Si los rate limits del plan se vuelven un problema (PRs muy frecuentes o muy grandes), considerar la alternativa de API key o reducir el alcance con `claude_args`.

---

## 10. Cuándo desactivar temporalmente

- Si el servicio de Anthropic tiene incidente y el job está fallando consistentemente, comentar el step `Run Claude Code PR Review` para desactivarlo y volver a PR humano puro.
- Documentar el porqué con un commit `chore: disable AI review temporalmente — incidente <ID>`.
- Reactivar y comentar en el siguiente standup.

---

## 11. Referencias

- `.github/workflows/ai-pr-review.yml` — workflow.
- `.github/pull_request_template.md` — plantilla de PR con Evidence obligatoria.
- `Agente-IA-Desarrollo-ABAP/.agents/skills/custom-codereview-guide.md` — guía custom del review (la lee la acción en cada ejecución).
- `Agente-IA-Desarrollo-ABAP/AGENTS.md` §8 — contrato del review en el repo.
- `Agente-IA-Desarrollo-ABAP/prd.md` §6 — los 6 Principios No Negociables que el review verifica.
- [`anthropics/claude-code-action` docs](https://github.com/anthropics/claude-code-action) — fuente oficial.
