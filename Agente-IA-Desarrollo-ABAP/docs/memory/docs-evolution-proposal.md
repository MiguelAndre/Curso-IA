# Docs Evolution Proposal — Backlog de sincronización

**Estación 7**: outputs estables de la memoria → docs canónicos.

Este documento agrupa propuestas concretas de actualización de docs que nacen del trabajo terminado. Cada propuesta tiene origen, doc destino, evidencia y estado.

> Reglas: cualquier propuesta requiere PR humano para entrar a un doc canónico. La memoria propone; los humanos deciden.

---

## 1. Catálogo de docs canónicos

Estos son los documentos donde la memoria puede proponer cambios. Cualquier otro destino requiere abrir discusión primero.

| Documento | Área | Quién aprueba cambios |
|---|---|---|
| `CLAUDE.md` | Configuración del agente principal | Jefe de Tecnología + Desarrollador líder |
| `AGENTS.md` | Contrato del arnés (multi-tool) | Jefe de Tecnología |
| `prd.md` | Visión del producto | Stakeholder + Jefe de Tecnología (requiere CR formal) |
| `docs/formato-fd-generico.md` | Contrato de entrada | Jefe de Tecnología + Líder funcional |
| `docs/checklist-auditoria-codigo-ia.md` | Checklist post-generación | Desarrolladores ABAP |
| `docs/plan-evaluacion.md` | Plan de evaluación pre-piloto | Jefe de Tecnología |
| `docs/orquestacion/orquestacion-de-trabajo.md` | Mapa del sistema | Desarrollador líder |
| `entregables/ADR-*.md` | ADRs | Desarrollador líder |
| `aidlc-docs/inception/application-design/*` | Application Design | Quien lo creó + Desarrollador líder |
| `README.md` | Operación | Cualquier desarrollador con PR review |

---

## 2. Formato de cada propuesta

```markdown
### PROP-<n> — <título corto>

- **Origen**: <issueId/capsuleId/PR>
- **Doc destino**: <ruta del doc>
- **Cambio propuesto**: <descripción concreta>
- **Evidencia**: <archivos, commits, fragmentos>
- **Riesgo de no hacerlo**: <qué se rompe si esto no se sincroniza>
- **Estado**: `pending` | `in-pr` | `merged` | `rejected`
- **Owner**: <persona o "TBD">
```

---

## 3. Backlog actual

> Plantilla inicial. Las propuestas reales aparecerán a medida que se cierren issues de la planning wave.

### PROP-001 — Documentar el dataset canónico de tests del Validador

- **Origen**: TASK-001 (próximamente al cerrarse)
- **Doc destino**: `docs/formato-fd-generico.md`
- **Cambio propuesto**: añadir sección "Dataset de referencia para tests" apuntando a `outputs/dataset-cr-001/`, con instrucciones para regenerarlo (porque `outputs/` no se versiona).
- **Evidencia**: comparison.md de TASK-004.
- **Riesgo de no hacerlo**: cada desarrollador reinventa el dataset y los re-tests pierden comparabilidad.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-002 — Documentar dependencia de pandoc

- **Origen**: TASK-002 (próximamente)
- **Doc destino**: `README.md` §2.1 (Prerrequisitos)
- **Cambio propuesto**: añadir `pandoc >= 2.0` a prerrequisitos cuando se procesen FDs `.docx`.
- **Evidencia**: comentarios del issue TASK-002.
- **Riesgo de no hacerlo**: el slash command `/validar-fd` fallará silenciosamente para `.docx` en máquinas nuevas.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-003 — Anotar comportamiento esperado de Read sobre PDFs grandes

- **Origen**: TASK-003 (próximamente)
- **Doc destino**: `.claude/agents/validador-fd.md` §5.1
- **Cambio propuesto**: documentar límites empíricos de páginas que el `Read` nativo procesa sin truncar, según lo descubierto en TASK-003.
- **Evidencia**: outputs de la sesión.
- **Riesgo de no hacerlo**: FDs largos en PDF pueden recibir veredictos sesgados sin que el desarrollador lo sepa.
- **Estado**: `pending`
- **Owner**: TBD

### PROP-004 — Decisión sobre instalar CLI `opensymphony` en el repo

- **Origen**: estación 7 (decisión de adopción)
- **Doc destino**: `entregables/ADR-002-adopcion-opensymphony.md` (nuevo ADR)
- **Cambio propuesto**: abrir ADR-002 que registre si adoptamos OpenSymphony como sistema de orquestación + memoria, o si mantenemos solo el contrato `task-package.yaml` documental.
- **Evidencia**: este documento + `docs/memory/memory-dry-run.md`.
- **Riesgo de no hacerlo**: ambigüedad sobre si los comandos `opensymphony memory ...` son reales o aspiracionales.
- **Estado**: `pending`
- **Owner**: Desarrollador líder

---

## 4. Cierre de propuestas

Cuando una propuesta llega a `merged`:

1. Mover el bloque al final de este archivo bajo "Histórico".
2. Anotar el PR que la mergeó.
3. Si la decisión afecta el contrato del arnés, considerar reflejarla también en `AGENTS.md`.

---

## 5. Histórico

_(vacío por ahora)_
