# Plan de Evaluación Pre-Piloto — Agente IA ABAP

**Estado**: Diseño (Q11:B del cuestionario inicial — diseño sin ejecución en Estación 4).
**Origen**: PRD §11 + IS13 + FR-DOC-03.
**Cuándo se ejecuta**: Días 1–30 del Plan de Entrega del PRD §13, antes del primer requerimiento del piloto activo.

---

## 1. Objetivo

Validar que el pipeline FD → TD → Código produce outputs **comparables** a la práctica real del equipo, **antes de exponer el agente a requerimientos en cola**. La evaluación reduce el riesgo de descubrir problemas estructurales en pleno piloto y permite ajustar la configuración (Módulo 4) sin presión.

---

## 2. Dataset

### 2.1 Criterios de selección de los FDs históricos

Seleccionar **3 a 5 requerimientos ya transportados a producción** que cumplan **todos** los siguientes criterios:

1. **Complejidad media**: reporte Z con ALV, BAdI simple o mejora de formulario. No incluir migraciones masivas, RICEFW de alta complejidad ni objetos con dependencias críticas en cierre de mes.
2. **FD original disponible**: el documento funcional debe existir tal como llegó al desarrollador (sin retoques posteriores).
3. **Código final en producción disponible**: el `.abap` que efectivamente se transportó.
4. **Variedad de tipos de objeto**: al menos un reporte ALV (UC1), un BAdI o User Exit (UC4), y opcionalmente una mejora de formulario.
5. **Sin datos sensibles en el FD**: si el FD original contiene PII o información confidencial, anonimizarlo antes de ingresarlo al dataset.

### 2.2 Anonimización

Antes de subir un FD histórico al dataset:
- Reemplazar nombres propios por roles genéricos (`<Consultor>`, `<Solicitante>`).
- Reemplazar números de cliente reales por placeholders (`<CLIENTE-001>`).
- Eliminar referencias a sistemas o entornos productivos específicos.
- Verificar que ningún campo de tabla contenga datos reales (sustituir por valores de ejemplo si aparecen).

### 2.3 Almacenamiento del dataset

- Carpeta sugerida: `evaluacion/dataset/<REQ-id>/` con `fd-original.md`, `td-real.md` (si existe), `codigo-produccion.abap`.
- Esta carpeta **NO se versiona en git** (debe agregarse a `.gitignore`) — contiene insumos sensibles aunque anonimizados.

---

## 3. Proceso de evaluación

### 3.1 Flujo por requerimiento

Para cada uno de los 3–5 FDs del dataset:

1. **Ejecutar el Módulo 1** (`/validar-fd`) con el FD original.
2. **Comparar** el veredicto del validador con el resultado histórico:
   - ¿Si el FD generó retrabajo en su momento, el validador lo detecta?
   - ¿Si el FD pasó limpio, el validador lo aprueba?
3. **Ejecutar el Módulo 2** (`/generar-td`) con el FD aprobado (o con el FD original "forzado" si fue rechazado).
4. **Comparar** el TD generado con el TD real (si existe) o con el código de producción:
   - ¿Identificó las tablas correctas?
   - ¿Identificó el tipo de objeto correcto?
   - ¿Capturó las reglas de negocio?
5. **Ejecutar el Módulo 3** (`/generar-abap`) con el TD generado.
6. **Comparar** el código generado con el código de producción:
   - ¿Compila?
   - ¿Implementa la lógica equivalente?
   - ¿Sigue los estándares?
7. **Registrar hallazgos** en el reporte de evaluación.

### 3.2 Registro durante la ejecución

Por cada requerimiento del dataset crear `evaluacion/resultados/<REQ-id>.md` con:

```markdown
# Evaluación — <REQ-id>

- **Tipo de objeto**: <Reporte ALV / BAdI / Formulario>
- **Fecha de ejecución**: <YYYY-MM-DD>

## M1 — Validador
- Veredicto del agente: <APROBADO / RECHAZADO>
- Resultado histórico: <Sin devolución / Con devolución (motivos)>
- Coincidencia: <Sí / No>
- Gaps detectados por el agente: <lista>
- Gaps reales que el agente no detectó: <lista>

## M2 — FD → TD
- Tipo de objeto identificado: <vs real: ✓/✗>
- Tablas SAP identificadas correctamente: <% acertadas>
- Reglas de negocio capturadas: <% / observaciones>
- Decisiones y Supuestos razonables: <Sí / Parcial / No>
- Cosas que **inventó** (alucinó): <lista>
- Cosas que **omitió**: <lista>

## M3 — TD → Código
- ¿Compila el código generado?: <Sí / No (errores)>
- Adherencia a estándares: <% subjetivo>
- AUTHORITY-CHECK presente cuando corresponde: <Sí / No / Parcial>
- SQL seguro (sin `SELECT *`, sin dinámico inseguro): <Sí / No>
- Equivalencia funcional al código de producción: <Total / Parcial / Bajo>
- Ciclos de retroalimentación necesarios: <0 / 1 / 2 / +2>

## Hallazgos para configuración base (M4)
- <ajustes sugeridos a CLAUDE.md, buenas prácticas, prompts de los sub-agentes>
```

---

## 4. Métricas por módulo

### 4.1 Módulo 1 — Validador

| Métrica | Definición | Target |
|---|---|---|
| **Sensibilidad** | % de FDs históricamente devueltos que el validador rechaza | ≥80% |
| **Especificidad** | % de FDs que pasaron limpio que el validador aprueba | ≥80% |
| **Precisión del reporte** | El consultor puede actuar sobre el reporte de gaps sin más explicación | ≥3/5 |

### 4.2 Módulo 2 — FD → TD

| Métrica | Definición | Target |
|---|---|---|
| **Factualidad** | % de tablas/módulos identificados que existen en el sistema (verificar SE11/SE37) | 100% — cero alucinaciones |
| **Completitud** | % de Reglas de Negocio del FD cubiertas por el TD | ≥90% |
| **Calidad de supuestos** | Los supuestos declarados en "Decisiones y Supuestos" son razonables | ≥4/5 evaluación cualitativa |

### 4.3 Módulo 3 — TD → Código

| Métrica | Definición | Target |
|---|---|---|
| **Compilabilidad** | El código pasa syntax check sin modificación | ≥50% en primer intento; ≥80% tras ≤2 ciclos |
| **Adherencia a estándares** | Naming, OO, modularización siguen las buenas prácticas | ≥80% subjetivo |
| **Correctitud funcional** | Implementa lo especificado en el TD | ≥80% |
| **Seguridad** | AUTHORITY-CHECK donde aplica, SQL seguro, sin PII | 100% obligatorio (compliance) |

### 4.4 Métricas transversales (pipeline completo)

| Métrica | Definición | Target |
|---|---|---|
| **Tasa de escalamiento** | % de casos donde el agente no logró cerrar y se escala a manual | <15% |
| **Tiempo promedio del piloto** | Tiempo activo del desarrollador desde abrir el FD hasta entregar el `.abap` | ≤2 h |

---

## 5. Formato del reporte de hallazgos consolidado

Una vez procesados los 3–5 requerimientos, generar `evaluacion/reporte-hallazgos.md` con:

```markdown
# Reporte de Evaluación Pre-Piloto — Agente IA ABAP

**Fecha**: <YYYY-MM-DD>
**Dataset**: <N requerimientos, lista de IDs>
**Evaluador**: <Jefe de Tecnología / Desarrollador asignado>

## Resumen ejecutivo

- ¿Pasa el pipeline el umbral mínimo para iniciar el piloto? <Sí / No>
- Métricas resumen vs target: <tabla>

## Resultados por módulo

### M1 — Validador
- Sensibilidad observada: <%>
- Especificidad observada: <%>
- Decisión: <aceptar / ajustar prompt / rediseñar criterios>

### M2 — FD → TD
- Factualidad observada: <%>
- Completitud observada: <%>
- Decisión: <aceptar / ajustar prompt / agregar contexto en CLAUDE.md>

### M3 — TD → Código
- Compilabilidad primer intento: <%>
- Compilabilidad tras 2 ciclos: <%>
- Adherencia a estándares: <%>
- Decisión: <aceptar / ajustar prompt / enriquecer skill template-alv>

## Ajustes recomendados al Módulo 4 (Configuración Base)

- <ajuste 1 a CLAUDE.md>
- <ajuste 2 a docs/formato-fd-generico.md>
- <ajuste 3 a sub-agente X>

## Decisión final

- **Go**: iniciar piloto con los requerimientos seleccionados por el Jefe de Tecnología.
- **No-go parcial**: aplicar ajustes y repetir evaluación con 1–2 casos adicionales.
- **No-go**: activar Plan B del PRD §13 (RAG sobre documentación interna).
```

---

## 6. Criterios go/no-go para iniciar el piloto

El pipeline pasa la evaluación pre-piloto si **todos** los criterios siguientes se cumplen:

| Criterio | Umbral |
|---|---|
| Factualidad de M2 (sin alucinaciones) | 100% |
| Compilabilidad de M3 tras ≤2 ciclos | ≥80% |
| Seguridad de M3 (AUTHORITY-CHECK, SQL seguro) | 100% |
| Sensibilidad de M1 | ≥80% |
| Tasa de escalamiento | <15% |

Si **falta uno** se aplica el camino "No-go parcial".
Si **fallan dos o más** se aplica "No-go" y se activa el Plan B.

---

## 7. Responsables

| Actividad | Responsable |
|---|---|
| Selección y anonimización del dataset | Jefe de Tecnología + Consultor Funcional |
| Ejecución del pipeline sobre el dataset | Desarrollador ABAP asignado al piloto |
| Verificación de factualidad (SE11/SE37) | Desarrollador ABAP |
| Análisis de hallazgos y ajuste de M4 | Configurador (Jefe de Tecnología + Desarrollador líder) |
| Decisión go/no-go | Jefe de Tecnología |

---

## 8. Estado de este documento

- **Versión**: 1.0 — diseño únicamente (Q11:B).
- **Próximo paso**: ejecutar este plan en Días 1–30 del PRD §13.
- **NO se ejecuta** en Estación 4 (alcance limitado a configuración del agente).
