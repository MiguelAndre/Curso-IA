# AI PR Review — Setup humano

> Este documento describe los pasos manuales que **debe ejecutar un humano con permisos de admin del repo** para que `.github/workflows/ai-pr-review.yml` funcione. Sin estos pasos, el workflow falla y los PRs no reciben review automatizado.

> **Ubicación del workflow**: `.github/workflows/ai-pr-review.yml` en la **raíz del repo** (`MiguelAndre/Curso-IA`). El workflow aplica a todos los PRs del repo, no sólo a los que tocan `Agente-IA-Desarrollo-ABAP/`.

> **Versión validada por smoke**: este documento refleja la configuración que pasó el smoke test del PR #1 (2026-06-01). Para el postmortem ver [`docs/memory/capsules/2026-06-01-ai-pr-review-smoke-test.md`](memory/capsules/2026-06-01-ai-pr-review-smoke-test.md).

---

## 1. Modelo de seguridad

- **Acción usada**: [`anthropics/claude-code-action@787c5a0ce96a9a6cfb050ea0c8f4c05f2447c251`](https://github.com/anthropics/claude-code-action) (v1, release 2025-08-26). Fijada por SHA completo para mitigar supply-chain.
- **Same-repo only por defecto**. Los PRs desde forks no disparan el AI review (guard explícito en el job `guard-fork`).
- **El review es advisory**. El gate de merge es humano vía Branch Protection (§7).

---

## 2. Los 5 pasos críticos del setup

Cada uno es **obligatorio**. El smoke test del PR #1 reveló que omitir cualquiera produce un fallo distinto. Hacelos en orden y con la verificación que indica cada sección antes de pasar al siguiente.

### Paso 1 — Instalar la GitHub App `claude` en el repo

**Por qué**: la acción intercambia un OIDC token por un App token de GitHub para postear comentarios. Sin la app instalada, falla con `401 - Claude Code is not installed on this repository` antes de ejecutar nada.

**Cómo**:

1. Abrir https://github.com/apps/claude (o ejecutar `claude /install-github-app` en una terminal local).
2. Clic en **`Install`**.
3. Seleccionar **`Only select repositories`** y marcar `MiguelAndre/Curso-IA`.
4. Confirmar permisos (lectura de código, escritura en PRs/issues).
5. Clic en **`Install`**.

**Verificar**: en `https://github.com/settings/installations` debería aparecer **Claude** con el repo seleccionado.

---

### Paso 2 — Crear el secret `CLAUDE_CODE_OAUTH_TOKEN`

**Por qué**: autentica al agente contra Anthropic usando la suscripción Pro/Max/Enterprise (sin facturar API tokens). Sin este secret, el workflow falla con `Environment variable validation failed`.

**Cómo**:

1. En una terminal local con Claude Code instalado y logueado con tu cuenta empresarial:

   ```bash
   claude setup-token
   ```

   Te abre el browser para confirmar, vuelve a la terminal e imprime un token largo (`sk-ant-oat01-...`). Copialo al portapapeles.

2. Abrir https://github.com/MiguelAndre/Curso-IA/settings/secrets/actions.
3. Confirmar que estás en la pestaña **Secrets** (no Variables) y en la sección **Repository secrets** (no Environment secrets).
4. Clic en **`New repository secret`** (botón verde).
5. **Name**: exactamente `CLAUDE_CODE_OAUTH_TOKEN` (case-sensitive).
6. **Secret**: pegar el token.
7. Clic en **`Add secret`**.

**Verificar**: en la página de secrets debería aparecer `CLAUDE_CODE_OAUTH_TOKEN` con el ícono de candado y la fecha de creación. Nunca se muestra el valor — solo el nombre.

---

### Paso 3 — Workflow YAML en la raíz del repo

**Por qué**: GitHub Actions descubre workflows **únicamente** en `.github/workflows/` de la raíz del repo. Workflows en subdirectorios (ej. `Agente-IA-Desarrollo-ABAP/.github/workflows/`) son invisibles. Además, `claude-code-action` valida que el archivo del workflow sea **idéntico** entre el branch del PR y la default branch (`main`). Si difieren, falla con `Workflow validation failed`.

**Cómo**:

- El workflow ya vive en `.github/workflows/ai-pr-review.yml` (raíz del repo).
- Cuando lo modifiques en un branch, **sincronizá los cambios a `main` antes de re-ejecutar** el workflow desde el PR. Patrón:

  ```bash
  git checkout main
  git checkout <branch> -- .github/workflows/ai-pr-review.yml
  git commit -m "ai-pr-review: sync con branch"
  git push origin main
  git checkout <branch>
  git commit --allow-empty -m "trigger rerun"
  git push
  ```

**Verificar**: `diff <(git show main:.github/workflows/ai-pr-review.yml) <(git show <branch>:.github/workflows/ai-pr-review.yml)` no produce output.

---

### Paso 4 — `--allowed-tools` con `gh pr comment` pre-aprobado

**Por qué**: el agente postea el review ejecutando `gh pr comment <n> --body "..."`. Claude Code tiene permisos granulares por comando — si `Bash(gh pr comment:*)` no está en `--allowed-tools`, el comando queda en `permission_denials` y el comentario nunca llega al PR (el job termina success, pero no postea).

**Cómo**: este parámetro ya está fijado en el workflow:

```yaml
claude_args: |
  --allowed-tools "Read,Glob,Grep,Bash(gh pr view:*),Bash(gh pr diff:*),Bash(gh pr list:*),Bash(gh pr comment:*)"
```

Si agregás comandos `gh` nuevos al prompt, **incluilos en la lista** o el agente no los puede ejecutar.

**Verificar**: tras correr el workflow, en el log del step `Run Claude Code PR Review` la propiedad `permission_denials` debe estar vacía (`[]`) o no contener comandos `gh pr *`.

---

### Paso 5 — Sección `Evidence` en el cuerpo de cada PR

**Por qué**: el step `Verify PR has Evidence section` falla si el body no contiene una línea con el header `Evidence`. La UI de GitHub indenta con espacios al pegar markdown y a veces strippea los `##`, así que el regex tolera ambos casos.

**Regex actual** (ya en el workflow):

```bash
grep -qiE "^[[:space:]]*#*[[:space:]]*Evidence[[:space:]]*\r?$"
```

Acepta: `## Evidence`, `  ## Evidence`, `Evidence`, `# Evidence`, etc.

**Verificar**: cualquier PR que abras debe tener una línea cuyo contenido sea sólo `Evidence` (con o sin `##`, con o sin espacios). El template (`.github/pull_request_template.md`) ya la incluye — al usarlo no hay que pensarlo.

**Gotcha** (descubierto en smoke PR #1): al pegar contenido markdown en el editor de PR description, la UI lo renderiza y a veces strippea los `##` al guardar. Si tu Evidence section desaparece, **pegá el body sin envolver en code fences** y revisá que la palabra `Evidence` esté en una línea sola antes de guardar.

---

## 3. Branch Protection (`Settings → Branches`)

Sobre `main` (y cualquier branch protegida):

- [x] Require a pull request before merging.
- [x] Require approvals: **1** (mínimo). Este es el gate humano.
- [x] Dismiss stale pull request approvals when new commits are pushed.
- [x] Require status checks to pass before merging.
- [x] Require branches to be up to date before merging.
- [x] Require conversation resolution before merging.
- [x] Status checks requeridos: `ai-review` **opcional** — el review es advisory.

> **Caveat**: si activás "Do not allow bypassing the above settings", incluso vos como admin necesitarás aprobación humana en cada PR. Para repos chicos sin co-mantenedores, dejarlo desactivado permite mergear con bypass cuando se necesita.

---

## 4. Label de re-ejecución `review-this`

Crear (`Issues/Pull requests → Labels`):

| Label | Color | Uso |
|---|---|---|
| `review-this` | `#0E8A16` (verde) | Aplicar al PR cuando se quiere forzar una nueva ejecución del AI review sin pushear commits. |

El workflow escucha `pull_request: labeled` y sólo dispara `ai-review` cuando la label aplicada es **exactamente** `review-this`. Aplicar otras labels no consume tokens ni dispara el job.

---

## 5. Verificación post-setup (smoke test)

Cuando completaste los 5 pasos:

1. Crear branch nueva con un cambio trivial (ej. typo en un README).
2. Abrir PR usando la plantilla `.github/pull_request_template.md`. Asegurate de que el body tenga una línea con `Evidence`.
3. Esperá 1-3 min.
4. Confirmá en `Checks`:
   - ✅ `guard-fork` (same_repo=true).
   - ✅ `ai-review` con dos steps verdes: `Verify PR has Evidence section` y `Run Claude Code PR Review`.
5. En la pestaña `Conversation` del PR debería aparecer un comentario nuevo de `claude[bot]` con el review estructurado.
6. (Opcional) Aplicar y quitar el label `review-this` para verificar que el rerun funciona.
7. Cerrá el PR sin mergear (era prueba de bootstrap) o mergealo si el cambio era real (squash recomendado).

### Si el smoke falla — guía rápida

| Síntoma | Causa probable | Paso a revisar |
|---|---|---|
| `Workflow validation failed` | Workflow no sincronizado con main | §3 (Paso 3) |
| `401 - Claude Code is not installed` | App no instalada | §2 (Paso 1) |
| `Environment variable validation failed` | Secret no configurado | §2 (Paso 2) |
| Run success pero sin comentario | `gh pr comment` no pre-aprobado | §4 (Paso 4) — mirar `permission_denials` en el log |
| `Evidence section` missing | Header strippeado por la UI | §5 (Paso 5) — verificar body via `gh api repos/.../pulls/<n>` |

Para diagnóstico profundo, **mantener `show_full_output: true`** en el workflow (ya está). El log completo del agente revela qué tools intentó usar y por qué falló.

---

## 6. Rotación y auditoría

- **Rotar `CLAUDE_CODE_OAUTH_TOKEN`** si sospechás filtración o cada 6 meses. Para rotar: correr `claude setup-token` de nuevo y reemplazar el secret. Revocar el viejo desde `claude.ai/settings/security`.
- Revisar el log de "Audit" del repo periódicamente para detectar cambios no autorizados al workflow.
- Cualquier cambio a `.github/workflows/ai-pr-review.yml` debe pasar review humana (no autoaprobar).

---

## 7. Costos

- Con `CLAUDE_CODE_OAUTH_TOKEN`: **$0 USD adicionales**. Consume contra los rate limits del plan Pro/Max/Enterprise.
- Si los rate limits se vuelven un problema, alternativa: usar `anthropic_api_key` (cobra por token desde la Anthropic Console). Cambiar el input en el workflow:

  ```yaml
  - name: Run Claude Code PR Review
    uses: anthropics/claude-code-action@<sha>
    with:
      anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}   # ← en lugar de claude_code_oauth_token
  ```

---

## 8. Cuándo desactivar temporalmente

- Incidente del proveedor → comentar el step `Run Claude Code PR Review`.
- Documentar con `chore: disable AI review temporalmente — incidente <ID>`.
- Reactivar y comentar en el siguiente standup.

---

## 9. Referencias

- `.github/workflows/ai-pr-review.yml` — workflow.
- `.github/pull_request_template.md` — plantilla con Evidence section.
- `Agente-IA-Desarrollo-ABAP/.agents/skills/custom-codereview-guide.md` — guía custom del review (la lee el agente en cada ejecución).
- `Agente-IA-Desarrollo-ABAP/AGENTS.md` §8 — contrato del review en el repo.
- `Agente-IA-Desarrollo-ABAP/prd.md` §6 — los 6 Principios No Negociables que el review verifica.
- `Agente-IA-Desarrollo-ABAP/docs/memory/capsules/2026-06-01-ai-pr-review-smoke-test.md` — postmortem del smoke test con los 5 hallazgos.
- [`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action) — doc oficial.
