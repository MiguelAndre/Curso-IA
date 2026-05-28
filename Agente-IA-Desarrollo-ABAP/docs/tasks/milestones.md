# Milestones — Planning Wave `cr-001-u2-multiformato-revalidacion`

**Origen**: CR-001 abierto en `aidlc-docs/aidlc-state.md` el 2026-05-20.
**Estado del CR al iniciar la wave**: Implementado, re-test pendiente.

---

## M1 — Preparación y verificación de dependencias

**Objetivo**: dejar listo el entorno para ejecutar el Validador (`/validar-fd`) sobre los 4 formatos admitidos por el CR-001 (`.md`, `.txt`, `.pdf`, `.docx`).

**Tareas**:

- TASK-001 — Preparar dataset multi-formato.
- TASK-002 — Verificar conversión `pandoc` para `.docx`.
- TASK-003 — Verificar lectura nativa de `.pdf` por Claude Code.

**Definition of Done del milestone**:

- 4 FDs equivalentes (`.md`, `.txt`, `.pdf`, `.docx`) disponibles en `outputs/dataset-cr-001/`.
- `pandoc --version` documentado y dependencia confirmada en máquina del desarrollador.
- Lectura nativa de `.pdf` reproducible en sesión Claude Code.

---

## M2 — Re-validación funcional y cierre del CR

**Objetivo**: ejecutar la suite del Build and Test del CR sobre los 4 formatos, dejar evidencia auditable y cerrar formalmente el change request.

**Tareas**:

- TASK-004 — Re-ejecutar `/validar-fd` sobre los 4 formatos del dataset.
- TASK-005 — Actualizar `aidlc-docs/construction/build-and-test/build-and-test-summary.md` con resultados del CR.
- TASK-006 — Marcar CR-001 como cerrado en `aidlc-docs/aidlc-state.md`.

**Definition of Done del milestone**:

- Cuatro ejecuciones `/validar-fd` con output `APROBADO` o `RECHAZADO` consistente entre formatos del mismo FD.
- `build-and-test-summary.md` con nueva sección "CR-001 re-test".
- `aidlc-state.md` con CR-001 en estado ✅ Cerrado.
- Cero `⚠️ VERIFICAR` sin atender en el reporte final.
