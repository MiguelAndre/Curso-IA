---
issueId: ai-pr-review-smoke-test
linearId: null
title: Smoke test del AI PR Review productivo — postmortem y 5 hallazgos
planningWave: ai-pr-review-setup
closedAt: 2026-06-01
pr: https://github.com/MiguelAndre/Curso-IA/pull/1
commits:
  - 445af00  # regex permisivo de Evidence en main
  - 0448b5a  # sync tools default + show_full_output
  - 0bb31b3  # sync sticky + post-comment instruction
  - 1fa5c24  # sync allowed-tools con gh pr comment
areas:
  - github-actions
  - ai-pr-review
  - claude-code-action
  - smoke-test
---

## Decisión validada

**El AI PR Review productivo funciona end-to-end con la suscripción Claude Pro/Max/Enterprise.**
En el PR #1 del repo el bot `claude[bot]`:

1. Disparó el workflow ante un evento `pull_request`.
2. Leyó el diff (`gh pr view`, `gh pr diff`).
3. Aplicó la guía custom de `.agents/skills/custom-codereview-guide.md` (zonas
   sensibles, principios PRD, señales rojas, formato `[categoría · severidad]`).
4. Posteó el review como comentario en el PR vía `gh pr comment`.
5. **Detectó un bug real del workflow** (redundancia entre `use_sticky_comment`
   y la instrucción `gh pr comment` en el prompt — ver §"Acción pendiente").
6. Respetó su rol advisory (no se atribuyó merge approval).

Costo: $0 USD (rate limits de la suscripción), ~95 segundos de ejecución, 17
turnos del agente.

## Invariant aparecido

**El setup productivo de `anthropics/claude-code-action` requiere 5 piezas
configuradas correctamente, además del workflow YAML**:

1. La **GitHub App `claude`** instalada en el repo (`https://github.com/apps/claude`).
   Sin esto, el "App token exchange" falla con 401 antes de ejecutar nada.
2. El **secret `CLAUDE_CODE_OAUTH_TOKEN`** como Repository Secret (no
   Environment) generado con `claude setup-token`.
3. El **archivo del workflow idéntico** entre el branch del PR y la default
   branch (`main`). La acción valida esto explícitamente por seguridad
   ("Workflow validation failed" si difieren).
4. Los **comandos `gh pr *` pre-aprobados** en `--allowed-tools` para que el
   agente pueda postear (`Bash(gh pr view:*)`, `Bash(gh pr diff:*)`,
   `Bash(gh pr list:*)`, `Bash(gh pr comment:*)`). Sin esto, el agente intenta
   `gh pr comment` y queda en `permission_denials`.
5. La sección **`## Evidence`** en el cuerpo del PR — la UI de GitHub a veces
   strippea los `##` al pegar contenido markdown; por eso el regex de
   verificación debe ser tolerante a leading whitespace y a la ausencia de `##`.

Los puntos 1-2 son configuración en GitHub UI. Los puntos 3-5 son configuración
en el workflow YAML.

## Validación útil

### Los 5 hallazgos del smoke (orden de aparición)

| # | Síntoma observado | Causa | Fix aplicado |
|---|---|---|---|
| 1 | `Verify PR has Evidence section` falló con `^## Evidence` regex strict | UI de GitHub indenta con 2 espacios al pegar markdown — y a veces strippea los `##` al renderizar el editor | Regex permisivo `^[[:space:]]*#*[[:space:]]*Evidence[[:space:]]*\r?$` |
| 2 | `App token exchange failed: 401 - Claude Code is not installed on this repository` | GitHub App `claude` no instalada en el repo | Instalación manual via `https://github.com/apps/claude` |
| 3 | `Workflow validation failed. The workflow file must exist and have identical content to the version on the repository's default branch` | El workflow se modificó sólo en el branch del PR; main quedó atrás | Sincronizar el archivo a main antes de cada re-ejecución del workflow modificado |
| 4 | `Environment variable validation failed: Either ANTHROPIC_API_KEY, CLAUDE_CODE_OAUTH_TOKEN... is required` | Secret nunca creado en `Settings → Secrets and variables → Actions` | Crear `CLAUDE_CODE_OAUTH_TOKEN` como Repository Secret con valor de `claude setup-token` |
| 5 | Run completed success pero **sin comentario en el PR** — agente intentó `gh pr comment` y quedó en `permission_denials` | `--allowed-tools` no incluía `Bash(gh pr comment:*)` | Listar explícitamente todos los `gh pr` necesarios en `claude_args: --allowed-tools` |

### Patrón de diagnóstico que sirvió

- **Habilitar `show_full_output: true`** en la action permite ver la salida
  completa del agente (texto + tools llamadas + `permission_denials`). Sin
  esto, el log solo muestra `{ "type": "result", "subtype": "success" }` y es
  imposible saber por qué el agente "exitoso" no posteó.
- **Inspeccionar `permission_denials`** del último iteration es la forma más
  rápida de detectar tools bloqueadas. Cada entrada incluye `tool_name` y
  `tool_input.command`, así que se ve exactamente qué intentó el agente.
- **Verificar el body del PR vía API pública** (`/repos/<owner>/<repo>/pulls/<n>`)
  con WebFetch evita ciclos largos de "edita-y-prueba" para detectar problemas
  de copy-paste del usuario en la UI.

## Review feedback recurrente

(Primera ejecución productiva — sin patrones repetidos aún. La feedback del
propio bot sobre el workflow es el primer "review feedback" capturado por este
sistema: el bot detectó el bug del doble canal antes que ningún humano.)

## Acción pendiente

**Bug detectado por el propio bot en su primer review productivo** (severidad
`minor`):

El workflow combina dos mecanismos de comentado que pueden duplicar el output:
- `use_sticky_comment: true` en la action → sticky comment con output del agente
- Instrucción `gh pr comment` en el prompt → comentario via CLI

En el smoke test sólo apareció un comentario (probablemente el de `gh pr comment`,
ya que el sticky requiere otro modo de la action). Pero el diseño es ambiguo.

**Fix propuesto** (opción B sugerida por el bot): remover `use_sticky_comment: true`
del workflow y mantener `gh pr comment` como único canal. PROP-010 en
`docs/memory/docs-evolution-proposal.md`.

## Docs impactadas

- [x] `.github/workflows/ai-pr-review.yml` — 4 cambios en main (regex permisivo,
      tools default + show_full_output, sticky + prompt fix, allowed-tools con
      `gh pr comment`).
- [ ] `Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md` — falta
      incorporar los 5 pasos descubiertos (PROP-011).
- [ ] `Agente-IA-Desarrollo-ABAP/docs/memory/docs-evolution-proposal.md` —
      PROP-010 (fix doble canal) y PROP-011 (sync de setup doc).

## Snippets / artefactos

### Workflow `ai-pr-review.yml` final (relevante)

```yaml
- name: Run Claude Code PR Review
  uses: anthropics/claude-code-action@787c5a0ce96a9a6cfb050ea0c8f4c05f2447c251
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    show_full_output: true
    use_sticky_comment: true  # ← PROP-010: redundante con gh pr comment, quitar
    prompt: |
      # ... incluye instrucción explícita de `gh pr comment <numero> --body "..."`
    claude_args: |
      --allowed-tools "Read,Glob,Grep,Bash(gh pr view:*),Bash(gh pr diff:*),Bash(gh pr list:*),Bash(gh pr comment:*)"
```

### Verify Evidence final (regex permisivo)

```bash
# Tolerante a leading whitespace, headers sin `##`, y CR (\r) de Windows clipboards
grep -qiE "^[[:space:]]*#*[[:space:]]*Evidence[[:space:]]*\r?$"
```

### Comando para diagnosticar comentarios faltantes

```bash
# API pública — no requiere auth para repos públicos
curl -s https://api.github.com/repos/<owner>/<repo>/pulls/<n>/reviews
curl -s https://api.github.com/repos/<owner>/<repo>/issues/<n>/comments
# Si están vacíos pero el run fue success → mirar permission_denials en el log
```

## Notas para futuras capsules

- Este smoke valida que **AI PR Review + QA Suite + Memoria Evolutiva** son
  un combo coherente: el bot puede ser activado, leer, razonar sobre el repo
  y dejar feedback útil, todo contra la suscripción del usuario sin facturar
  API tokens.
- Las **5 piezas del setup productivo** (App + Secret + Workflow sync + allowed-tools +
  Evidence regex) son **easy to miss** individualmente. El setup doc debe
  enumerarlas en orden estricto con verificación de cada una antes de pasar a
  la siguiente.
- El **review del propio bot al workflow** que lo gobierna es un meta-pattern
  interesante: el sistema es lo suficientemente reflexivo para detectar bugs
  en su propia configuración. Vale la pena documentar este caso como ejemplo
  pedagógico en `Estacion-7/` cuando se redocumente.
