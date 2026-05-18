---
name: review-pr
description: Revisa un pull request que contenga cambios a la configuración base (CLAUDE.md, prompts, estándares ABAP, skills, agentes) — NO revisa código ABAP funcional, eso es del subagente abap-code-reviewer. Úsalo cuando se proponga un cambio al Módulo 4 o a la configuración de Claude Code del equipo.
---

# Skill: review-pr

## Cuándo invocarla

Cuando llega un PR que toca:
- `CLAUDE.md` — instrucciones operativas del agente.
- `AGENTS.md` — guía para agentes externos.
- `.claude/settings.json` — permisos y hooks.
- `.claude/skills/**` — definición de skills.
- `.claude/agents/**` — definición de subagentes.
- `.mcp.json` — configuración de servidores MCP.
- `prd.md` — fuente de verdad del producto.

**No invocar** para PRs de código ABAP funcional (`.abap`). Eso lo hace el subagente `abap-code-reviewer`.

## Qué verifica

### 1. Coherencia con el PRD
- [ ] El cambio no viola ninguno de los 6 Principios de Diseño.
- [ ] No introduce features de la sección "Won't Have" (W1–W8).
- [ ] Si toca un Must Have (M1–M8), el cambio mantiene la razón documentada en el PRD.

### 2. Seguridad de permisos (`settings.json`)
- [ ] Los permisos `allow` no incluyen comandos con escritura a SAP (RFC, BAPI con commit, transport).
- [ ] Los `deny` siguen cubriendo: `rm -rf`, `git push --force`, `git reset --hard`, conexiones a SAP QA/PRD.
- [ ] Los hooks `PostToolUse` no se desactivan accidentalmente (Principio #5 — trazabilidad).

### 3. Calidad de skills/agentes
- [ ] Toda skill tiene frontmatter con `name` y `description` claro de cuándo invocarla.
- [ ] La descripción explica el **trigger** (cuándo) y el **scope** (qué hace y qué no).
- [ ] El cuerpo de la skill cita el segmento o principio del PRD que justifica su existencia.

### 4. Configuración MCP
- [ ] Cada servidor MCP en `.mcp.json` tiene `description` que explica su uso en el flujo ABAP.
- [ ] No se introduce ningún MCP con acceso de escritura a SAP en Fase 1.

### 5. Riesgos del cambio
- [ ] El PR documenta qué impacto tiene sobre los KPIs del piloto.
- [ ] Si toca un módulo del pipeline (M1–M3), tiene plan de validación (re-correr evaluación pre-piloto con FDs históricos).

## Output

```
=== Review PR — Configuración del Agente ABAP ===
Archivos tocados: <lista>
Tipo de cambio: [Configuración base | Skill | Agente | Permisos | MCP | PRD]

Hallazgos bloqueantes: N
Hallazgos no bloqueantes: N

BLOQUEANTES:
- [.claude/settings.json:line] Permiso `Bash(rm -rf:*)` movido a `allow`. Viola política de borrado seguro.
- [CLAUDE.md:line] Removida la regla "FD sin calidad no avanza". Viola Principio #2.

NO BLOQUEANTES:
- [.claude/skills/X/SKILL.md] Falta sección de alineación con PRD.

Recomendación: [APROBAR | SOLICITAR CAMBIOS | RECHAZAR]
```

## Reglas

- **Es de solo lectura.** No modifica el PR.
- Si encuentra un cambio que viola un Principio no negociable, recomienda **RECHAZAR** y cita el principio.
- Si el cambio reduce trazabilidad (Principio #5), es **bloqueante**.
- No revisa estilo de redacción — solo coherencia con PRD y seguridad operativa.

## Alineación con el PRD

- **Principio #5** — Trazabilidad total: los cambios a la configuración base deben revisarse.
- **Módulo 4** — Configuración base: esta skill es la compuerta de calidad para cambiarla.
- **R4 (Riesgo)** — Gobernanza on-stack: configuración base versionada y revisada antes de merge.
