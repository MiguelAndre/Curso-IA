<!--
Plantilla de PR — Agente IA ABAP.
La sección "## Evidence" es OBLIGATORIA para que el AI PR Review se ejecute.
Si no aplica algún apartado, escribe "N/A" con una línea explicando por qué.
-->

## Intención

<!-- 1–3 líneas. ¿Qué problema resuelve este PR? ¿Qué cambia conceptualmente? -->

## Issue / Tarea origen

<!-- Linear identifier (ej. DEV-101) o referencia a docs/tasks/00X-*.md -->

- Linear: <link>
- Task file: `docs/tasks/00X-*.md`
- Planning wave: <slug>

## Scope tocado

<!-- Lista archivos/áreas modificadas. Sé específico. -->

- `.claude/agents/...`
- `docs/...`
- `aidlc-docs/construction/...`

## Decisiones técnicas

<!-- Decisiones no triviales tomadas durante la implementación. Una por línea. -->

1. **<Decisión>**: <razón breve + alternativa rechazada>

## Evidence

<!-- OBLIGATORIO. El AI PR Review fallará si esta sección no existe. -->

### Comandos ejecutados

```bash
# Pegar los comandos reales corridos para producir/probar este cambio
```

### Output / resultados

```text
# Pegar output relevante (truncar si es largo, pero mantener evidencia)
```

### Acceptance Criteria cumplidos

- [ ] AC1: <referencia al task file>
- [ ] AC2: ...
- [ ] AC3: ...

## Riesgos conocidos

<!-- Qué podría romper este cambio. Si nada obvio, decirlo. -->

## Notas para reviewer humano

<!-- Áreas donde el reviewer humano debe enfocarse. Limitaciones del AI review. -->

## Límites de cobertura

<!-- Qué NO se probó. Tests que sería ideal añadir más adelante. -->

## Principios del PRD aplicables

<!-- Marca los que aplican y explica brevemente cómo se respetan en este PR. -->

- [ ] **#1** El desarrollador es garante final — sin merge automático.
- [ ] **#2** FD validado antes de avanzar — N/A si el PR no toca pipeline.
- [ ] **#3** Sin conexión SAP — N/A si el PR no toca infraestructura.
- [ ] **#4** Pruebas humanas intactas.
- [ ] **#5** Trazabilidad — Decisiones y Supuestos donde aplique.
- [ ] **#6** Sin autopilot — gates humanos preservados.

## Memoria y docs

<!-- ¿Esta tarea deja aprendizaje? ¿Algún doc debe actualizarse? -->

- [ ] Memory capsule prevista en `docs/memory/` (linkear si ya está).
- [ ] Propuesta de docs sync registrada en `docs/memory/docs-evolution-proposal.md` (si aplica).
