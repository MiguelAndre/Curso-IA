---
issueId: ai-pr-review-setup
linearId: null
title: AI PR Review productivo con claude-code-action (acción oficial, SHA pinned, OAuth)
planningWave: ai-pr-review-setup
closedAt: 2026-06-01
pr: null  # cambios commiteados directo a main en commits 3a58e2e + d3bd5b4
commits:
  - 3a58e2e  # rename .github/ a raíz
  - d3bd5b4  # reescribe workflow + setup doc + README
areas:
  - github-actions
  - ai-pr-review
  - claude-code-action
---

## Decisión validada

1. **Acción oficial en lugar de placeholder**. El workflow original referenciaba
   `All-Hands-AI/openhands-pr-review-action@REPLACE_WITH_FULL_SHA`. Una verificación
   con `WebFetch` al URL del repo devolvió **404**: el action no existe. Se reemplazó
   por la acción oficial publicada `anthropics/claude-code-action`, fijada al SHA
   `787c5a0ce96a9a6cfb050ea0c8f4c05f2447c251` (release v1, 2025-08-26). **Regla
   derivada**: antes de pinear cualquier action, verificar que el repo existe en
   GitHub (`gh api repos/<owner>/<name>` o WebFetch). Pinear a algo que no existe
   tarde o temprano se descubre, pero hace ruido al usuario que espera que "esté
   listo".

2. **Auth por suscripción Pro/Max en lugar de API key**. La acción oficial soporta
   `CLAUDE_CODE_OAUTH_TOKEN` (generado con `claude setup-token` local) además de
   `ANTHROPIC_API_KEY`. Para un repo con suscripción Pro/Max y bajo volumen de PRs,
   OAuth consume rate-limits del plan en lugar de facturar por token. Decisión:
   default a OAuth, dejar API key documentada como fallback si los rate limits no
   alcanzan.

3. **Filtro de label en el `if` del job, no en el trigger**. El evento
   `pull_request: labeled` dispara con **cualquier** label. Para evitar correr el
   AI review cada vez que alguien aplica una label inocente, el filtro vive en el
   `if:` del job: `github.event.action != 'labeled' || github.event.label.name == 'review-this'`.
   Más limpio que múltiples workflows o múltiples jobs.

## Invariant aparecido

**GitHub Actions descubre workflows SÓLO en `.github/workflows/` de la raíz del
repo**. Workflows en subdirectorios (ej. `Agente-IA-Desarrollo-ABAP/.github/workflows/`)
son **invisibles** para GitHub. No hay manera de "scopear" un workflow a un
subdirectorio. Aplica a cualquier futuro workflow en este repo (CI de QA,
release automation, etc.) — todos deben vivir en la raíz.

Corolario: cuando este producto migre a su propio repo (opción C de la discusión
inicial), los workflows se moverán con él.

## Validación útil

1. **Verificar existencia de actions antes de pinear** — `WebFetch` al URL del repo
   o `gh api repos/<owner>/<name>`. Si responde 404, no se puede pinear: es
   placeholder/aspiracional.

2. **Validar YAML de workflows localmente cuando no hay actionlint**. Si Python no
   está disponible y `js-yaml` no está en `node_modules` del repo, instalarlo
   transient en `/tmp/`:

   ```bash
   mkdir -p /tmp/ymlcheck && cd /tmp/ymlcheck \
     && npm install --silent --no-audit --no-fund js-yaml \
     && node -e "const y=require('js-yaml'),f=require('fs'); \
        const d=y.load(f.readFileSync('<ruta>','utf8')); \
        console.log('OK', Object.keys(d.jobs));"
   ```

   Sirve para detectar errores de indentación, claves duplicadas o `if:` mal
   formados antes de hacer push.

3. **`git mv` para mover directorios .github/** preserva la historia mejor que
   `mv + git rm + git add`. En el `git status` aparecen como `R`/`RM` y los
   commits resultantes son más legibles.

## Review feedback recurrente

(N/A — primer cierre del repo. Esta sección se llenará cuando empiece a haber
patrones repetidos en reviews.)

## Docs impactadas

- [x] `Agente-IA-Desarrollo-ABAP/docs/ai-pr-review-human-setup.md` — reescrito
      completo. Ya está en el commit.
- [x] `README.md` raíz — fila "AI PR Review" actualizada. Ya está en el commit.
- [ ] `Agente-IA-Desarrollo-ABAP/AGENTS.md` — falta agregar la práctica de SHA
      pinning como regla del repo (propuesta PROP-005 en `docs-evolution-proposal.md`).
- [ ] `Agente-IA-Desarrollo-ABAP/CLAUDE.md` — no requiere cambios (el contrato
      del agente no cambia con el setup de CI).

## Snippets / artefactos

### Generar OAuth token para CI

```bash
# En terminal local con Claude Code instalado y logueado con Pro/Max:
claude setup-token
# Pegar el output como secret CLAUDE_CODE_OAUTH_TOKEN en GitHub
```

### Patrón de actualización de SHA

Cuando salga una release nueva de `claude-code-action`:

```bash
# 1. Buscar release en https://github.com/anthropics/claude-code-action/releases
# 2. Tomar SHA completo del tag
# 3. Editar workflow:
#    uses: anthropics/claude-code-action@<SHA>  # vX — YYYY-MM-DD
# 4. PR con Evidence; el AI review actual aprueba/comenta
```

### `if:` con filtro de label

```yaml
if: >
  needs.guard-fork.outputs.same_repo == 'true' &&
  (github.event.action != 'labeled' || github.event.label.name == 'review-this')
```

## Notas para futuras capsules

- Esta es la **primera capsule real** del repo. La planning wave
  `cr-001-u2-multiformato-revalidacion` sigue abierta y producirá sus propias
  capsules cuando se resuelva el bloqueo de pandoc.
- Esta wave (`ai-pr-review-setup`) cierra con este único cierre. No tiene más
  issues asociados.
