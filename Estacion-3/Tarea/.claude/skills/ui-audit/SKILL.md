---
name: ui-audit
description: Audita la calidad de UI/UX de los outputs ABAP generados — específicamente reportes ALV y formularios SAP — verificando estándares de presentación, usabilidad y consistencia con el FD aprobado. Úsalo cuando se complete el Módulo 3 (TD → Código) y antes de syntax check.
---

# Skill: ui-audit

## Cuándo invocarla

Después de que el Módulo 3 (Agente TD → Código) entregue un `.abap` que contenga UI (reporte ALV, formulario, selection-screen). Se ejecuta **antes del syntax check** del desarrollador, como un paso de QA temprano sobre la capa de presentación.

## Qué verifica

### 1. Reportes ALV
- [ ] Field catalog explícito (no auto-generado opaco).
- [ ] Columnas con `SCRTEXT_S`, `SCRTEXT_M`, `SCRTEXT_L` poblados.
- [ ] Columnas numéricas con `JUST = 'R'`.
- [ ] Totales habilitados en columnas de importes/cantidades.
- [ ] Layout variant con autorización por usuario.
- [ ] Función de exportación a Excel habilitada (default ALV).
- [ ] Mensajes de "no se encontraron datos" con texto del FD, no genéricos.

### 2. Selection-screen
- [ ] Etiquetas alineadas con el FD (no nombres técnicos).
- [ ] Campos obligatorios marcados con `OBLIGATORY`.
- [ ] Rangos (`SELECT-OPTIONS`) donde el FD indica filtro por rango.
- [ ] Default sensato si el FD lo especifica.
- [ ] Bloques (`SELECTION-SCREEN BEGIN OF BLOCK`) si hay >5 campos.

### 3. Formularios (SmartForms / Adobe Forms)
- [ ] Layout coincide con el campo "Diseño visual" del FD.
- [ ] Tipografía y tamaños según estándar de la empresa.
- [ ] Manejo de saltos de página en tablas largas.
- [ ] Logos y firmas en zonas correctas.

### 4. Mensajes y textos
- [ ] Mensajes de error con clase de mensajes Z* (no T100 genérico).
- [ ] Textos traducibles (no hardcoded en español dentro del código).
- [ ] Textos de aceptación coinciden con el FD.

## Output

Reporte estructurado con:

```
=== UI Audit — REQ-2026-NNNN ===
Tipo de objeto: [ALV | Selection-screen | Form]
Hallazgos críticos: N
Hallazgos menores: N

CRÍTICOS:
- [Línea XX] Field catalog auto-generado. Esperado: explícito con SCRTEXT.
- [Línea YY] AUTHORITY-CHECK ausente antes del SELECT.

MENORES:
- [Línea ZZ] Mensaje hardcodeado en español. Mover a clase de mensajes Z.

Recomendación: [PASA | RETRABAJAR | ESCALAR A MÓDULO 3]
```

## Reglas

- **No modifica el código.** Solo audita y reporta.
- Si encuentra hallazgos críticos, recomienda regenerar (vuelta al Módulo 3 con feedback específico).
- Respeta el Principio #5 del PRD: el hallazgo debe explicar el *por qué*, no solo el *qué*.
- No audita lógica de negocio — eso es responsabilidad del desarrollador y consultor.

## Alineación con el PRD

- **Módulo 3** (Generación de código ABAP) — esta skill es la compuerta de QA de presentación.
- **Principio #4** (Compuertas de calidad intactas) — agrega una compuerta, no reemplaza.
- **UC1, UC4** (reportes ALV y BAdI con UI) — casos de uso principales.
