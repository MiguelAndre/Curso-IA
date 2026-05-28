# Matriz de NFRs — Agente IA para Desarrollo ABAP

**Fecha**: 2026-05-20
**Versión**: 1.0
**Alcance**: NFRs globales (`aidlc-docs/inception/requirements/requirements.md` §NFR) + NFRs específicos de U4 (`nfr-requirements.md`)
**Propósito**: vista consolidada por atributo de calidad e identificación de los atributos críticos del producto.

> **Criterio de criticidad aplicado**: un atributo es crítico cuando su falla produce **daño irreversible** o **invalida uno o más Principios No Negociables del PRD §6**. Solo dos atributos cumplen ambas condiciones.

---

## 1. Matriz consolidada

| ID | Atributo | Requerimiento | Origen | Verificación | Crítico |
|---|---|---|---|---|:---:|
| NFR-06 | **Seguridad** | Sin tools con escritura a SAP, transportes ni ejecución en ambientes SAP | PRD §6 P1/P3/P6 | `settings.json` + CLAUDE.md §3 | 🔴 |
| NFR-08 | **Seguridad** | Sin secretos, credenciales, tokens ni PII en outputs | SECURITY-03 | Verificación pre-output | 🔴 |
| NFR-U4-SEC-01 | **Seguridad** | `AUTHORITY-CHECK` obligatorio en datos sensibles (nómina, RRHH, finanzas, PII…) | SECURITY-10, PRD | Pre-output sub-agente + `⚠️ VERIFICAR:` | 🔴 |
| NFR-U4-SEC-02 | **Seguridad** | SQL seguro: sin `SELECT *`, sin SQL dinámico inseguro | SECURITY-09 | Pre-output sub-agente | 🔴 |
| NFR-U4-SEC-03 | **Seguridad** | Sin PII/secretos en literales ni comentarios | SECURITY-03 | Pre-output sub-agente | 🔴 |
| NFR-U4-SEC-04 | **Seguridad** | Sin FMs de transporte, sin RFCs no declarados, sin `OPEN DATASET` sin justificación | PRD §6 P1/P3/P6 | Pre-output + CLAUDE.md | 🔴 |
| NFR-05 | **Auditabilidad** | Secciones "Decisiones y Supuestos" / "Decisiones del código" obligatorias. Sin "caja negra" | PRD §6 P5 | Schema obligatorio en outputs M2/M3 | 🔴 |
| NFR-07 | Mantenibilidad | Versionado git; cambios en CLAUDE.md/sub-agentes trazables a commits | PRD R4 | Repo git + revisión | ⚪ |
| NFR-U4-MAINT-01 | Mantenibilidad | Convenciones de naming (`Z*`, `lv_`, `lt_`…) y estructura | CLAUDE.md §5 | Pre-output sub-agente | ⚪ |
| NFR-U4-MAINT-02 | Mantenibilidad | Responsabilidad única por método público | Decisión Q4:B | Pre-output sub-agente | ⚪ |
| NFR-U4-MAINT-03 | Mantenibilidad | Métodos cortos (<50 líneas; máx flexible 80) | CLAUDE.md §5.6 | Guía (sin enforcement) | ⚪ |
| NFR-U4-MAINT-04 | Mantenibilidad | Comentarios en español | NFR-01 | Pre-output sub-agente | ⚪ |
| NFR-02 | Performance | Pipeline completo ≤2h activas del desarrollador | PRD §10 | Medición en piloto | ⚪ |
| NFR-U4-PERF-01 | Performance | Generación del sub-agente ≤5 min (SLA blando) | Decisión Q3:C | Log de duraciones | ⚪ |
| NFR-U4-PERF-02 | Performance | Tiempo de revisión del código generado razonable (≤2h) | NFR-02 | Métrica en piloto | ⚪ |
| NFR-03 | Confiabilidad | ≥80% del código compila tras ≤2 ciclos de feedback | PRD §10.5 | Evaluación pre-piloto | ⚪ |
| NFR-U4-REL-01 | Confiabilidad | Tasa de compilación ≥80% en dataset de evaluación | NFR-03 | Pre-piloto (`plan-evaluacion.md`) | ⚪ |
| NFR-U4-REL-02 | Confiabilidad | Escalamiento tras 2 ciclos fallidos con mismo error | BR-12 | Implementado en sub-agente | ⚪ |
| NFR-U4-QUAL-01 | Calidad | Código generado compila en S/4HANA Cloud | Q2:A | Runtime / piloto | ⚪ |
| NFR-U4-QUAL-02 | Calidad | Sin advertencias críticas de ATC (Code Inspector) | Q2:A | Checklist auditoría humana | ⚪ |
| NFR-U4-QUAL-03 | Calidad | Sin métricas estáticas formales en MVP | Decisión Q2:A | — (revisión futura) | ⚪ |
| NFR-01 | Usabilidad | Outputs e instrucciones en español | Decisión Q6:A | Schema y prompts del agente | ⚪ |
| NFR-04 | Usabilidad | 3 desarrolladores ABAP operan autónomamente tras leer README | PRD §3.2 P2 | Onboarding del piloto | ⚪ |
| NFR-U4-USAB-01 | Usabilidad | Output legible en chat (cabecera, syntax highlight, `⚠️ VERIFICAR:` visible) | Decisión | Formato del sub-agente | ⚪ |
| NFR-U4-USAB-02 | Usabilidad | Mensajes de error/escalamiento accionables | Decisión | Formato del sub-agente | ⚪ |

**Leyenda**: 🔴 = atributo crítico · ⚪ = atributo importante pero no crítico.

---

## 2. Resumen por atributo

| Atributo | # NFRs | Críticos | Concentración |
|---|:-:|:-:|---|
| Seguridad | 6 | 🔴 | Máxima — toca SAP, datos sensibles, PII |
| Auditabilidad | 1 | 🔴 | Transversal — habilita la revisión humana |
| Mantenibilidad | 5 | ⚪ | Largo plazo |
| Performance | 3 | ⚪ | SLAs blandos |
| Confiabilidad | 3 | ⚪ | Métrica de aceptación |
| Calidad | 3 | ⚪ | Verificada por checklist humano |
| Usabilidad | 4 | ⚪ | Afecta adopción, no integridad |
| **Total** | **25** | **7 NFRs en 2 atributos** | |

---

## 3. Atributos críticos identificados

### 🔴 3.1 Seguridad (6 NFRs)

**Por qué es crítico**:

- Es el **único atributo cuya falla produce daño irreversible**: SQL injection ejecutado en producción, `AUTHORITY-CHECK` ausente en una tabla de nómina, o PII filtrada al repo no se "arreglan después" — son incidentes reportables.
- Cubre **3 de los 6 Principios No Negociables del PRD** (P1 — desarrollador como garante, P3 — sin conexión a SAP, P6 — IA sugiere, humano ejecuta). Violarlos invalida el producto.
- Mapea directamente a 3 reglas de **Security Baseline** activadas en la extensión (SECURITY-03, 09, 10) — no son opcionales.
- Dominio sensible: el agente toca **nómina, RRHH, finanzas, datos personales** (lista ampliada en NFR-U4-SEC-01).

**NFRs que materializan este atributo**: NFR-06, NFR-08, NFR-U4-SEC-01, -02, -03, -04.

**Materialización en el diseño**:

- `CLAUDE.md §3` — listado explícito de prohibiciones operativas.
- Sub-agentes M2/M3 — verificación pre-output que rechaza el draft si detecta violaciones.
- `docs/checklist-auditoria-codigo-ia.md` — verificación post-generación por el desarrollador.

### 🔴 3.2 Auditabilidad (1 NFR — estructural)

**Por qué es crítico**:

- Es la **condición de habilitación** para que los otros Principios funcionen. Sin trazabilidad ("Decisiones y Supuestos", `⚠️ VERIFICAR:`, "Decisiones del código"), el desarrollador **no puede ejercer su rol de garante final** (Principio #1) — quedaría firmando código a ciegas.
- Su ausencia degrada al producto a una "caja negra que escupe ABAP", lo cual es explícitamente prohibido por **Principio #5** y por el mandato corporativo de IA del PRD §2.3.
- Transforma el riesgo regulatorio: con auditabilidad, una mala generación se detecta en revisión; sin ella, llega a producción.
- Aunque tiene un solo NFR (NFR-05), **atraviesa el output de cada módulo** (M1, M2, M3) y del checklist.

**NFRs que materializan este atributo**: NFR-05 (transversal).

**Materialización en el diseño**:

- Schema obligatorio en outputs de M2 (TD) y M3 (código) — sección "Decisiones y Supuestos" / "Decisiones del código" + marcador `⚠️ VERIFICAR:`.
- `CLAUDE.md §4` — formato obligatorio documentado.
- `docs/checklist-auditoria-codigo-ia.md` — fuerza al desarrollador a revisar cada zona marcada.

---

## 4. Por qué estos dos (y no otros candidatos)

| Candidato | Por qué no quedó como crítico |
|---|---|
| **Confiabilidad** (≥80% compilable) | Es una *métrica de aceptación*, no una restricción de sistema. Falla parcial = más ciclos de feedback, no daño. |
| **Performance** (≤2h, ≤5 min) | SLAs blandos, documentables. Una generación lenta no es catastrófica. |
| **Mantenibilidad** | Importante para el largo plazo; un código feo pero correcto y seguro sigue siendo aceptable en MVP. |
| **Usabilidad** | Afecta adopción, no integridad. Un mensaje confuso se mejora en iteración. |
| **Calidad estática** (ATC, complejidad) | Decidido explícitamente como blando en Q2:A — sin enforcement automático en MVP. |

**Regla aplicada**: un atributo es crítico cuando su falla produce **daño irreversible** o **invalida los Principios No Negociables**. Solo Seguridad y Auditabilidad cumplen ambas condiciones simultáneamente.

---

## 5. Implicaciones para el piloto

Los dos atributos críticos definen el **mínimo no negociable** que el piloto debe validar:

1. **Seguridad** — ningún FD del dataset puede pasar el pipeline produciendo código que: omita `AUTHORITY-CHECK` en tabla sensible, contenga `SELECT *`, exponga PII, o invoque transportes/RFCs no declarados. Verificación: corrida del checklist de auditoría sobre los 3–5 FDs piloto.
2. **Auditabilidad** — los 3 desarrolladores deben poder reconstruir, leyendo "Decisiones y Supuestos" + `⚠️ VERIFICAR:`, por qué el agente generó cada decisión. Verificación: revisión cruzada — un desarrollador ajeno al FD original debe poder auditar el output.

Los demás atributos (Performance, Confiabilidad, Mantenibilidad, Usabilidad, Calidad) son **métricas de seguimiento** del piloto — se miden, se reportan, ajustan iteraciones; pero su falla parcial no aborta el piloto.

---

## 6. Referencias

- **NFRs globales**: `aidlc-docs/inception/requirements/requirements.md` (sección NFR-01..NFR-08).
- **NFRs específicos de U4**: `aidlc-docs/construction/U4/nfr-requirements/nfr-requirements.md`.
- **Diseño de NFRs en componentes**: `aidlc-docs/construction/U4/nfr-design/nfr-design-patterns.md`.
- **Principios No Negociables**: `prd.md` §6.
- **Security Baseline**: extensión activa registrada en `aidlc-docs/aidlc-state.md`.
- **Checklist de auditoría**: `docs/checklist-auditoria-codigo-ia.md`.
