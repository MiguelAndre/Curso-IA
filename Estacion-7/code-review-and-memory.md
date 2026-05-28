# Code Review Automatizado y Memoria Evolutiva

Este material introduce dos prácticas de ingeniería agencial que aplican más allá de OpenSymphony: code review automatizado y memoria de proyecto. OpenSymphony aparece como ejemplo concreto después de entender el concepto.

## 1. Por qué importa el code review automatizado

Los agentes pueden producir cambios rápido. Esa velocidad amplifica errores cuando el sistema carece de revisión.

Un buen review automatizado ayuda a detectar:

- bugs de correctness,
- regresiones,
- problemas de seguridad,
- errores de compatibilidad,
- deuda técnica que se repite,
- migraciones incompletas,
- riesgos de concurrencia,
- validaciones débiles,
- cambios sin evidencia.

La revisión automatizada funciona mejor como segunda mirada técnica. Su valor está en aumentar cobertura, consistencia y velocidad de feedback. La decisión final sigue siendo humana.

## 2. Qué debe pedir el sistema

Un PR generado por agentes debe traer:

- intención del cambio,
- issue o tarea de origen,
- scope tocado,
- comandos ejecutados,
- output o evidencia,
- riesgos conocidos,
- notas para reviewer humano,
- límites de cobertura.

Con esa evidencia, el review automatizado puede comentar sobre el cambio real y sobre las pruebas que sostienen el cambio.

## 3. OpenSymphony como ejemplo de PR review

OpenSymphony usa OpenHands PR Review como implementación concreta.

Principios del flujo:

- La revisión AI es advisory.
- La aprobación humana sigue siendo el gate de merge.
- El foco está en correctness, seguridad, compatibilidad, migraciones, integridad de datos, concurrencia, caching, retries, errores, tests y mantenibilidad.
- El review debe ser high-signal.
- Cada PR sustantivo debe traer evidencia.
- El workflow hardened corre sobre PRs same-repo por defecto.
- Fork PRs requieren un rediseño explícito de seguridad.

Artefactos relevantes:

- `.github/workflows/ai-pr-review.yml`
- `.agents/skills/custom-codereview-guide.md`
- `AGENTS.md`
- `.github/pull_request_template.md`
- `docs/ai-pr-review-human-setup.md`

Setup humano relevante:

- Secret: `AI_REVIEW_API_KEY`
- Variables: `AI_REVIEW_PROVIDER_KIND`, `AI_REVIEW_MODEL_ID`, `AI_REVIEW_BASE_URL`, `AI_REVIEW_STYLE`, `AI_REVIEW_REQUIRE_EVIDENCE`
- Label de rerun: `review-this`
- Acción de OpenHands fijada a SHA completo
- Branch protection con aprobación humana y conversación resuelta

## 4. Por qué importa la memoria evolutiva

Cada tarea deja conocimiento:

- qué cambió,
- qué decisión técnica quedó probada,
- qué validación funcionó,
- qué fallo apareció,
- qué review feedback se repitió,
- qué invariant del codebase debe preservarse,
- qué documentación quedó desactualizada.

Cuando ese conocimiento vive solo en chats, PRs sueltos o memoria humana, los siguientes agentes repiten errores y el equipo acumula deuda. Una base de conocimiento útil convierte trabajo terminado en contexto recuperable.

## 5. Codebase understanding

Una memoria de proyecto debe responder preguntas operativas:

- Qué issues tocaron este subsistema.
- Qué PR cambió una semántica.
- Qué validaciones importaron antes.
- Qué invariants debe preservar un agente.
- Qué docs ya describen un área.
- Qué review feedback se repitió.
- Qué decisiones siguen vigentes.

La documentación evolutiva aparece cuando esa memoria se sincroniza con docs de área, ADRs, guías operativas o `AGENTS.md`.

## 6. OpenSymphony como ejemplo de memoria

`opensymphony memory` convierte trabajo completado en contexto durable.

Cuando `auto_capture` está activo, las transiciones terminales de issues pueden capturarse automáticamente durante `opensymphony run`. La captura usa narrativa de Linear, Workpad activo, jerarquía, milestones, PR descriptions, reviews, checks y source refs.

La memoria escribe:

- issue capsules privados en `.opensymphony/memory/`,
- índice DuckDB,
- `.opensymphony/memory/memory.yaml`,
- topic docs sincronizados desde áreas estables.

Comandos de ejemplo:

```bash
opensymphony memory context --issue COE-456
opensymphony memory related --issue COE-456
opensymphony memory related --paths crates/opensymphony-openhands
opensymphony memory search "subscription credential refresh"
opensymphony memory docs --area authentication
opensymphony memory capture COE-123 --dry-run
opensymphony memory sync-docs --since-last-sync --dry-run
opensymphony memory lint --public-docs
```

## 7. Cadena completa

```text
Linear issue -> arnés -> PR -> automated review -> merge -> memory capture -> docs sync -> codebase understanding
```

El objetivo es que cada ciclo de implementación deje el codebase más fácil de entender y el siguiente cambio más seguro de ejecutar.
