# Checklist de Auditoría — Código ABAP generado por IA

**Propósito**: lista de verificación que el **desarrollador ABAP** completa antes de aprobar un código generado por el agente y enviarlo a transporte.

**Origen**: PRD §11.3 (checklist mínimo de auditoría) + IS12 + FR-DOC-02.

**Cuándo se usa**: después de cada salida del Módulo 3, antes del syntax check, las pruebas unitarias y la entrega al consultor para pruebas funcionales.

---

## Declaración de responsabilidad

> ✋ **Al marcar todos los ítems de este checklist, el desarrollador ABAP declara que asume la responsabilidad sobre el código para transporte a ambientes superiores.**
>
> El agente IA **no es** garante final del código generado. Esta es una herramienta de asistencia. La decisión de transportar recae en el desarrollador, conforme al **Principio #1** del PRD §6.

---

## Identificación

- **Requerimiento**: `<REQ-AAAA-NNN>`
- **Archivos ABAP revisados**: `<rutas a los .abap revisados — para reportes son 3 archivos: outputs/2026-05-19-REQ-2026-042/codigo-report.abap, codigo-top.abap, codigo-cls.abap; para clases globales standalone: outputs/.../codigo-clase.abap>`
- **Desarrollador revisor**: `<nombre>`
- **Fecha de revisión**: `<YYYY-MM-DD>`
- **Versión del código revisado**: `<v1 / v2 / vN>`

---

## Sección A — Existencia y referencias (factualidad)

- [ ] **A1**. ¿Todas las tablas SAP referenciadas en el código **existen** en el sistema (verificado en SE11 o equivalente)?
- [ ] **A2**. ¿Todos los módulos de función / BAPIs referenciados **existen** y están **liberados** para uso (no internos, no marcados como obsoletos)?
- [ ] **A3**. ¿Todas las clases / interfaces referenciadas **existen** en el sistema?
- [ ] **A4**. ¿Los nombres Z*/Y* referenciados (tablas, clases, dominios) existen o están planificados en el alcance del requerimiento?

---

## Sección B — Seguridad y autorizaciones (SECURITY-09, SECURITY-10)

- [ ] **B1**. ¿El código incluye `AUTHORITY-CHECK` antes de acceder a **datos sensibles** (nómina, finanzas, RRHH, datos personales)?
- [ ] **B2**. ¿Los objetos de autorización usados en `AUTHORITY-CHECK` son los **correctos** para el caso (verificado contra el perfil del usuario objetivo)?
- [ ] **B3**. ¿El código **NO** ignora silenciosamente `SY-SUBRC` tras un `AUTHORITY-CHECK`?
- [ ] **B4**. ¿Los SQL usan **campos específicos** (no `SELECT *`)?
- [ ] **B5**. ¿NO hay SQL dinámico construido por concatenación de strings sin sanitización?
- [ ] **B6**. ¿NO hay credenciales, tokens, contraseñas o PII hardcoded en el código?

---

## Sección C — Calidad funcional

- [ ] **C1**. ¿El código implementa **todas** las Reglas de Negocio del FD?
- [ ] **C2**. ¿Los **Casos Borde** del FD están manejados explícitamente (no solo "asumidos")?
- [ ] **C3**. ¿Los **Criterios de Aceptación** del FD son verificables con el código generado?
- [ ] **C4**. ¿Las condiciones de borde **inferidas** por el agente (marcadas con `⚠️ VERIFICAR:`) son razonables y consistentes con la intención del FD?

---

## Sección D — Adherencia a estándares

- [ ] **D1**. ¿Los nombres siguen las convenciones (`Z*`/`Y*` para custom, `lv_`/`lt_`/`ls_`/`lo_` para variables locales, parámetros `iv_`/`it_`/`ev_`/`et_`...)?
- [ ] **D2**. ¿La arquitectura usa **ABAP OO** (clases `ZCL_*`) con métodos cohesivos? Si es report puro, ¿está **justificado**?
- [ ] **D3**. ¿Los métodos son **cortos** (< 50 líneas idealmente)? ¿Sin "god methods"?
- [ ] **D4**. ¿Las excepciones usan clases `CX_*` en vez de `MESSAGE TYPE 'A'` (salvo condiciones críticas declaradas)?
- [ ] **D5**. ¿Para ALV se usa `CL_SALV_TABLE` con field catalog explícito?

---

## Sección E — Trazabilidad (Principio #5)

- [ ] **E1**. ¿El archivo `.abap` tiene cabecera "Decisiones del código" completa y razonable?
- [ ] **E2**. ¿Cada zona `⚠️ VERIFICAR:` ha sido **revisada explícitamente** y la decisión (aceptar / corregir) está registrada?
- [ ] **E3**. ¿Los comentarios en el código están en **español** y describen el "por qué", no el "qué"?

---

## Sección F — Compuertas posteriores (Principio #4)

- [ ] **F1**. He ejecutado **syntax check** en Eclipse/SE38 y pasa.
- [ ] **F2**. He ejecutado las **pruebas unitarias** existentes y pasan.
- [ ] **F3**. He coordinado **pruebas funcionales** con el consultor.
- [ ] **F4**. Las pruebas funcionales **NO fueron reducidas** porque el código lo generó IA.

---

## Sección G — Decisión final

- [ ] **G1**. Todos los ítems anteriores aplicables están marcados o explícitamente justificados como N/A.
- [ ] **G2**. **Apruebo este código para transporte a Calidad/Producción** (o, en su defecto, registro motivo de rechazo abajo).

### Si NO apruebo:
- **Motivo del rechazo**: `<descripción>`
- **Decisión**: `<regenerar con el agente / desarrollar manualmente / escalar al equipo>`
- **Registro en Excel del piloto**: `Generado por agente: <Sí / Parcial / No>` · `Horas de ajuste: <N>h`

---

## Política de revisión aleatoria (Riesgo R9 del PRD)

El Jefe de Tecnología revisa **1 de cada 5** requerimientos generados por el agente, independientemente del checklist firmado por el desarrollador. Si encuentra issues, se documentan como aprendizaje del piloto.
