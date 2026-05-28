# Estación 1 — Product Vision Board / Internal Solution Brief

> Definir el producto: convertir una idea o un dolor corporativo en un documento estratégico de 9 segmentos, cuantificado y defendible. Es la primera piedra del proyecto que recorre todo el curso.

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Cohorte | Hardcore AI Cohorte 2 (Mayo 2026) |
| Tutoría | José Alanya, sesión presencial 12-mayo-2026 |
| Duración | ≈ 1 semana hasta presentación de Estación 2 (13-mayo) |
| Prerequisitos | Ninguno técnico. Asumir rol de constructor (emprendedor, intrapreneur o consultor interno). |
| Commit fundacional | `1ddb96c` — "Primer commit del curso IA" |

---

## 2. Tema y objetivo de aprendizaje

Producir un **documento estratégico de 9 segmentos** que defina:

- Problema específico (no genérico).
- Segmento target exacto y quién tiene el veto de confianza.
- Moat defendible (Data / Distribution / Trust).
- Paradigma UX coherente con el caso de uso.
- Modelo económico escalable.
- Riesgos anticipados.

El documento es el insumo de **Estación 2** (PRD) y, en mi caso, del **proyecto central** `Agente-IA-Desarrollo-ABAP/`.

Hay dos plantillas — se elige una:

- **Product Vision Board (PVB)** para ideas propias o startups.
- **Internal Solution Brief (ISB)** para problemas internos corporativos.

---

## 3. Conceptos clave

### 3.1 Los 9 segmentos del Product Vision Board

| # | Segmento | Qué resuelve |
|---|---|---|
| 1 | **Problema** | Dolor específico que sobreviva a 2–3 generaciones de foundation models. Incluye *durability score* 1–5. |
| 2 | **Segmento target** | "¿Para quién?" muy preciso (no "empresas"). Identifica quién tiene el **veto de confianza** (compliance, CFO, CISO). |
| 3 | **Moat primario** | Una sola defensa: **Data Moat** (datos únicos), **Distribution Moat** (canal embebido) o **Trust Moat** (reliability/compliance). |
| 4 | **Arena competitiva** | Pioneer (AI-Native) · Disruptor (AI-Disrupted) · Enhancer (AI-Enhanced). |
| 5 | **UX paradigm** | Assistant · Agent · Autonomous · Embedded Intelligence. |
| 6 | **AI Decision Triangle** | Trade-off explícito entre **Cost · Capability · Speed** (no se pueden maximizar las tres). |
| 7 | **Modelo económico** | Tiered, usage-based, credit pools, outcome-based, seat + AI add-on, freemium. Valida márgenes. |
| 8 | **Métricas de éxito** | 2 de usuario (engagement, retención) + 2 de IA (validación del modelo, tasa de error). |
| 9 | **Riesgos críticos** | Commoditización < 12 m, replicabilidad < 6 semanas, cómo se rompe la confianza a escala. |

### 3.2 Los 9 segmentos del Internal Solution Brief

| # | Segmento | Qué resuelve |
|---|---|---|
| 1 | **Problema de negocio** | Dolor cuantificado: no "es lento" sino "5 días + 3 errores/semana". |
| 2 | **Stakeholders y sponsor** | Quién paga (sponsor), quién usa (usuario final), quién bloquea (IT, seguridad, compliance). |
| 3 | **Estado actual** | Proceso de hoy paso por paso. Si no se entiende, la solución no se adopta. |
| 4 | **Estado futuro deseado** | Qué cambia para el usuario diario. Métrica de mejora concreta. |
| 5 | **Criterios de éxito** | 2–3 KPIs medibles con baseline y target. |
| 6 | **Restricciones** | Técnicas, de datos, organizacionales, de compliance. |
| 7 | **Enfoque técnico propuesto** | Qué capacidad de IA aplica y por qué IA vs automatización tradicional. |
| 8 | **Riesgos y dependencias** | Matriz con mitigaciones y dependencias externas. |
| 9 | **Límites de alcance** | Qué SÍ y qué NO en el MVP. Anti-scope-creep. |

### 3.3 Conceptos transversales

- **Moat**: razón por la que conservás ventaja después de que alguien copia la idea. En mi caso ABAP: Trust Moat (auditorías, estándares corporativos, conexión a tablas Z propias).
- **AI Decision Triangle**: trade-off fundamental que todo producto IA debe asumir explícitamente.
- **UX Paradigm**: determina la fricción de adopción; no es una elección cosmética.
- **ICP** (Ideal Customer Profile): en producto interno se traduce en ecosistema de stakeholders (Jefe de Tecnología, Desarrollador ABAP, Consultor Funcional).

---

## 4. Material del curso

| Archivo | Para qué sirve |
|---|---|
| `hcai-c2-product-vision-board.md` | Template PVB vacío + checklist + ejemplo completo (AIsaEscrow, agente de pagos M2M). |
| `hcai-c2-internal-solution-brief.md` | Template ISB vacío con 9 segmentos + reglas de llenado. |
| `hcai-c2-product-vision-board.pdf` | Guía visual interactiva: explica cada sección, errores comunes, prompts de IA para validación/crítica. |
| `hcai-c2-banco-productos.pdf` | Catálogo de productos pre-diseñados para quien no tenga idea propia. |
| `hcai-c2-e1-slides.pdf` | Slides de la sesión presencial. |

---

## 5. Mi entrega (`Tarea/`)

### 5.1 Decisión: ISB en lugar de PVB

Elegí **Internal Solution Brief** porque el caso de uso es resolver una **ineficiencia interna SAP**, no crear un producto de mercado. El equipo ABAP de mi empresa tiene un cuello de botella real: cola de ~50–65 requerimientos, ciclo de 17 días, 76% del tiempo en espera + retrabajo.

### 5.2 Archivos entregados

```
Tarea/
├── hcai-c2-internal-solution-brief-1 .md    ← v1 inicial (6 KB, esqueleto básico)
├── hcai-c2-internal-solution-brief-2.md     ← v2 cuantificada (21 KB, 400 líneas)
├── hcai-c2-internal-solution-brief.md       ← versión final (24 KB, 470 líneas)
└── investigacion-ia-desarrollo-abap.md      ← deep research validación + crítica
```

### 5.3 Evolución del ISB en tres versiones

**v1 → v2: cuantificación**
- Pasé de "hay una cola" a la métrica concreta: *3 desarrolladores × 6h/día = 90 h/semana; capacidad efectiva 62% = 56 h; entrada 4–5 reqs/semana; cola 50–65 tickets; ciclo 17 días con 76% espera + retrabajo.*
- Identifiqué sponsor (Jefe de Tecnología), usuario directo (3 devs ABAP), bloqueadores (Seguridad/Infra por confirmar).
- Causa raíz: *documentación funcional ambigua → desarrollador interpreta → entregable no coincide → ajustes post-prueba → rework → cola crece.*

**v2 → final: precisión y honestidad**
- Sección 5 (Criterios de éxito): añadí línea base real desde Excel histórico y criterio binario go/no-go: *"4–5 requerimientos consecutivos sin devolución post-entrega"*.
- Sección 4 (Estado futuro): proyección de liquidación de backlog en 6–8 meses si el throughput pasa de 3–4 a 6–7 reqs/semana.
- Marqué explícitamente la información pendiente con TBD, evitando inventar.

### 5.4 Decisiones técnicas clave que ya aparecieron acá

| Decisión | Razón |
|---|---|
| **ISB sobre PVB** | Producto interno corporativo, no startup. |
| **Claude Code en vez de SAP Joule** | La empresa ya tiene licencia activa Claude Code; Joule requiere licencia adicional. |
| **Arquitectura de dos agentes** (FD→TD, TD→Código) + conexión SAP solo lectura | Decisión que sobrevivió a todo el resto del curso. |
| **Scope del piloto: 4–5 requerimientos** | No "piloto de 3 meses" sino "piloto acotado a N requerimientos sin rework". |
| **Rol del desarrollador: auditor, no reemplazado** | Mitigación explícita del miedo a sustitución; pasa de escritor (62%) a auditor. |

### 5.5 Investigación (`investigacion-ia-desarrollo-abap.md`)

Deep research con 5 casos reales (Bosch Digital, AiFA Labs Cerebro, T-Systems, SAP interno, Cirque du Soleil), 8 herramientas evaluadas (SAP Joule, GitHub Copilot, SASA/Cerebro, AWS ABAP Accelerator, Amazon Q Developer, T-Systems RAG, etc.) y 5 riesgos documentados con mitigaciones (alucinaciones, vulnerabilidades, código no optimizado, gobernanza, desconocimiento de tablas Z).

Concluí con una hoja de ruta de 3 fases (corto/mediano/largo plazo) con impacto esperado por fase.

---

## 6. Aporte al proyecto central

El ISB es el **upstream directo del PRD** del proyecto en raíz (`Agente-IA-Desarrollo-ABAP/prd.md`). Trazabilidad sección por sección:

| Sección ISB | → | Sección PRD |
|---|---|---|
| §1 Problema cuantificado | → | §2.1 "Dolores operativos" (tabla idéntica) |
| §2 Sponsor | → | §3.2 Persona 1 (Jefe de Tecnología) |
| §3 Causa raíz | → | §2.2 "Causa raíz" (mismo diagrama) |
| §4 Estado futuro (17d → 4–5d) | → | §1 JTBD ("borrador técnico + código en < 1 día") |
| §7 Arquitectura (2 agentes + solo lectura) | → | §1 Misión + CLAUDE.md §1 (3 módulos: Validador, FD→TD, TD→Código) |
| §5 Criterios + Excel histórico | → | §3 Triggers + §10 métricas del piloto |

El PRD es la versión "product-ready" del ISB: generaliza el caso a "cualquier empresa SAP con cuello ABAP" y desglosa la arquitectura en módulos codificables. El ISB fue el *business brief fundacional*.

---

## 7. Lecciones / takeaways

1. **La especificación es el 76% del problema, no la velocidad de desarrollo.** El ISB demostró que el ciclo real está dominado por espera (59%) + retrabajo (18%), no por tiempo de desarrollo (24%). Optimizar solo la velocidad de código sin atacar la calidad del FD es superficial. Esto redefinió el enfoque del proyecto de "asistencia en codificación" a "pipeline completo FD→TD→Código con validación de entrada".

2. **Cuantificación convierte convicción en autorización.** No presenté "hay una cola" sino *"3 devs × 6h × 5d = 90h, efectivos 56h, entrada 4–5 reqs, cola 50–65, ciclo 17 días: 10 espera, 4 desarrollo, 3 retrabajo"*. Esa precisión permitió calcular la proyección de liquidación (6–8 meses) y justificar el ROI. Solo cualitativo ("lento, muchos ajustes") habría sido rechazado.

3. **El moat en software corporativo es gobernanza + contexto, no algoritmo.** Ninguna herramienta genérica gana ventaja duradera. El diferenciador es el acceso (solo lectura) a tablas Z y estándares internos. Esa decisión arquitectónica de v2 escaló a todo el resto del curso.

---

## Referencias rápidas

- ISB final: [`Tarea/hcai-c2-internal-solution-brief.md`](Tarea/hcai-c2-internal-solution-brief.md)
- Investigación: [`Tarea/investigacion-ia-desarrollo-abap.md`](Tarea/investigacion-ia-desarrollo-abap.md)
- PRD del proyecto: [`../Agente-IA-Desarrollo-ABAP/prd.md`](../Agente-IA-Desarrollo-ABAP/prd.md)
- CLAUDE.md operacional: [`../Agente-IA-Desarrollo-ABAP/CLAUDE.md`](../Agente-IA-Desarrollo-ABAP/CLAUDE.md)
