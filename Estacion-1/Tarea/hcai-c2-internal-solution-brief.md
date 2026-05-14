## 1. PROBLEMA DE NEGOCIO

**Problema:**
La migración a SAP Rise (S/4HANA Cloud) generó un incremento estructural en la demanda de desarrollos ABAP que el equipo actual no puede absorber. Ingresan entre 4 y 5 requerimientos nuevos por semana, mientras la capacidad de entrega es inferior a esa tasa, lo que produce una cola que hoy supera los 3 meses (aproximadamente 50–65 requerimientos en espera). El problema no es solo el volumen: el ciclo completo de un requerimiento —desde que entra hasta que queda estable en producción— está dominado por tiempo de espera y retrabajo, no por tiempo de desarrollo.

**Ejemplo real — Área de Materiales Retal:**
| Etapa | Duración |
|---|---|
| Espera en cola hasta ser tomado | 2 semanas |
| Desarrollo, pruebas y ajustes iniciales | 4 días |
| Devolución y corrección en producción | 3 días |
| **Ciclo total** | **~17 días hábiles** |

El desarrollo en sí representó el **24% del ciclo**. El **76% restante fue espera y retrabajo** — tiempo que no agrega valor y que bloquea al desarrollador para avanzar con otros tickets.

**Costo cuantificado:**
- Capacidad instalada: 3 desarrolladores × 6 h/día × 5 días = 90 h/semana
- Capacidad efectiva en desarrollo: 62% → ~56 h/semana produciendo código
- Volumen de entrada: 4–5 requerimientos/semana (demanda que supera la tasa de salida)
- Requerimientos en cola activa: ~50–65 tickets sin fecha de entrega próxima
- Cada requerimiento genera al menos una ronda de ajustes post-prueba, extendiendo el ciclo real entre un 30% y un 75% respecto al tiempo de desarrollo puro

**Desde cuándo:**
El punto de quiebre fue la migración de SAP on-premise a SAP Rise. Este cambio incrementó estructuralmente la demanda de desarrollos nuevos —personalizaciones que debieron reconstruirse en el nuevo entorno y funcionalidades habilitadas por la plataforma cloud— sin un ajuste equivalente en la capacidad del equipo. Desde entonces, la cola no ha podido liquidarse.

## 2. STAKEHOLDERS Y SPONSOR

**Sponsor:**
Jefe de Tecnología (jefe inmediato del equipo de desarrollo).

Su presión principal es el incumplimiento sistemático de fechas comprometidas ante el negocio: el área de TI adquiere compromisos de entrega con jefes de proceso y gerencia que con frecuencia no se cumplen por el represamiento en la cola. Esto genera un problema de credibilidad del área tecnológica frente al negocio. Un agente que reduzca el ciclo de desarrollo y los ajustes post-entrega le permite al Jefe de Tecnología entregar más en el mismo tiempo y recuperar la confiabilidad de los compromisos.

> **Dato a obtener antes de la presentación:** El Excel histórico contiene las fechas comprometidas y reales de cada requerimiento. Calcular el porcentaje de requerimientos entregados fuera de fecha convierte esta afirmación en evidencia — es el argumento de apertura más fuerte para el sponsor.

> **Autoridad de aprobación:** Confirmar si el Jefe de Tecnología puede aprobar el proyecto de forma autónoma o si requiere aval de gerencia. Esto determina a quién debe estar dirigido el brief en su versión final.

**Usuarios y su relación con el agente:**

| Rol | Relación con el agente | Beneficio |
|---|---|---|
| Desarrollador ABAP (×3) | Usuario directo — revisa, valida y ajusta el código generado | Pasa de escribir código a auditar y mejorar entregables; reduce retrabajo |
| Consultor funcional | Usuario secundario — produce el documento funcional que alimenta al agente | Su especificación se convierte en técnica automáticamente, reduciendo idas y vueltas |
| Jefes de proceso / Áreas de negocio | Beneficiario final — no interactúa con el agente | Recibe entregables más rápido y con menos devoluciones post-producción |

**Bloqueadores potenciales (por confirmar):**

| Bloqueador | Estado | Acción requerida |
|---|---|---|
| Restricción de acceso externo a SAP (APIs de terceros) | **No confirmado** — riesgo identificado, no validado con el área | Agendar reunión con Seguridad e Infraestructura para definir qué conexiones están permitidas antes de elegir arquitectura |

> Nota: No hay bloqueadores confirmados a la fecha. El riesgo de seguridad debe validarse antes de cerrar el enfoque técnico (Sección 7).


## 3. ESTADO ACTUAL

**Proceso actual:**

| Paso | Actividad | Tiempo / Estado |
|---|---|---|
| 1 | El área de negocio identifica la necesidad y la levanta con usuarios finales y el área de procesos | Variable |
| 2 | Se define el alcance del requerimiento y se documenta funcionalmente | Variable |
| 3 | El consultor funcional elabora la especificación técnica con el desarrollador | Variable |
| 4 | ⚠️ El requerimiento entra a la **cola de asignación** — el desarrollador analiza y estima tiempos | **Espera: hasta 3 meses** |
| 5 | ⚠️ El desarrollador ABAP construye el requerimiento interpretando la especificación funcional. Realiza pruebas unitarias y entrega a pruebas funcionales | **Cuello de botella principal** |
| 6 | 🔄 Si se identifican ajustes, el requerimiento regresa al desarrollador | **Rework: extiende el ciclo 30-75%** |
| 7 | El desarrollo aprobado se transporta a producción — el usuario final puede generar nuevos ajustes que regresan al desarrollador | 🔄 **Segunda vuelta posible** |

**Causa raíz del problema:**

El cuello de botella no está en la velocidad del desarrollador — está en la calidad del insumo que recibe. El documento funcional llega con descripciones genéricas o ambiguas que el desarrollador debe interpretar por cuenta propia. Cuando el entregable se muestra al consultor funcional o al usuario final, es la primera vez que ven materializada su idea, y ahí descubren lo que realmente necesitaban. Eso genera la vuelta de ajustes.

```
Documento funcional ambiguo
        ↓
Desarrollador interpreta y asume
        ↓
Entregable no coincide con expectativa real
        ↓
Ajustes en pruebas o en producción
        ↓
Desarrollador bloqueado en rework → cola crece
```

**Lo que funciona bien (conservar en el estado futuro):**
- Pruebas unitarias realizadas por el desarrollador antes de liberar
- Pruebas funcionales con el consultor o el área de procesos antes de transportar a producción
- Estas dos compuertas de calidad han evitado errores graves en producción y deben mantenerse

**Lo que no funciona:**
1. **Ambigüedad en la documentación funcional:** el desarrollador recibe especificaciones incompletas y actúa con supuestos no validados
2. **El entregable como primer prototipo real:** funcionales y usuarios finales solo descubren lo que quieren cuando ven el código corriendo — demasiado tarde en el ciclo
3. **Rework como norma:** los ajustes post-prueba no son excepciones — son parte esperada del proceso, lo que los convierte en un costo estructural invisible

## 4. ESTADO FUTURO DESEADO

**Visión:**
Un requerimiento de complejidad media que hoy toma ~17 días hábiles de ciclo completo pasa a resolverse en **4–5 días** de trabajo activo (generación por agente + revisión del desarrollador + pruebas funcionales). El cuello de botella deja de ser el tiempo de desarrollo y se convierte en la disponibilidad del consultor funcional y el área de procesos para hacer pruebas — un recurso coordinable, no un recurso técnico escaso.

**Proyección de liquidación del backlog:**
Si el agente permite incrementar el throughput de ~3-4 requerimientos cerrados por semana a 6-7, el diferencial de 2-3 requerimientos por semana sobre los 4-5 que entran reduce la cola activa de ~50–65 tickets en aproximadamente **6–8 meses**, asumiendo que el volumen de entrada no crece. Esta proyección debe ajustarse con la línea base real del Excel antes de presentarla al sponsor.

**Nuevo proceso:**

| Paso | Quién | Qué cambia |
|---|---|---|
| 1–3 | Área de negocio + Consultor funcional | Sin cambio — el funcional sigue siendo el responsable de producir el documento funcional |
| 4 | **Agente IA** | Lee el documento funcional y genera la especificación técnica estructurada |
| 5 | **Agente IA** | Lee la especificación técnica y genera el código ABAP siguiendo mejores prácticas SAP (orientación a objetos, modularización) |
| 6 | Desarrollador ABAP | Audita el código generado, realiza pruebas unitarias y aprueba o ajusta puntualmente — **no escribe desde cero** |
| 7 | Consultor funcional / Área de procesos | Pruebas funcionales sin cambio — compuerta de calidad que se conserva |
| 8 | Transporte a producción | Sin cambio |

**Cambio de rol diario:**

| Rol | Hoy | Con el agente |
|---|---|---|
| Desarrollador ABAP | Escribe código desde la especificación técnica, hace pruebas unitarias, gestiona ajustes | Audita y valida código generado, hace pruebas unitarias, ajusta puntualmente — libera tiempo para más requerimientos |
| Consultor funcional | Produce documento funcional → entrega al desarrollador | Produce documento funcional → entrega al agente; su rol no cambia pero su precisión se vuelve crítica |
| Áreas de negocio | Esperan el entregable en cola | Reciben entregables más rápido y con menos devoluciones |

**Dependencia crítica:**
La calidad del código generado por el agente es directamente proporcional a la calidad del documento funcional que lo alimenta. Un documento ambiguo produce código ambiguo. Para que el estado futuro funcione, el consultor funcional debe producir especificaciones más concretas y completas que las actuales — este es el cambio de proceso más importante fuera del agente mismo.

**Lo que no cambia:**
Las compuertas de pruebas unitarias y pruebas funcionales antes de transportar a producción se mantienen sin modificación. El desarrollador ABAP sigue siendo el responsable final del código que entra a producción.

## 5. CRITERIOS DE ÉXITO

**Línea base disponible:**
El Jefe de Tecnología mantiene un Excel histórico con fecha de llegada, fecha de inicio, fecha de entrega y fecha de fin de cada requerimiento. Con esos campos se pueden calcular las métricas reales actuales antes de iniciar el proyecto — no se trabaja con estimaciones.

| Métrica | Cómo se calcula (desde el Excel) | Valor actual (referencia caso Retal) | Target |
|---|---|---|---|
| Tiempo total de ciclo | Fecha de fin − Fecha de llegada | ~17 días hábiles | ≤ 5 días hábiles |
| Tiempo en cola | Fecha de inicio − Fecha de llegada | ~10 días hábiles | ≤ 2 días hábiles |
| Tiempo de desarrollo | Fecha de entrega − Fecha de inicio | ~4 días hábiles | ≤ 1 día hábil (generación por agente) |
| Tiempo de ajustes post-entrega | Fecha de fin − Fecha de entrega | ~3 días hábiles | 0 días (meta piloto) |
| % de requerimientos con devolución | Reqs con ajustes / total | Por determinar con histórico | < 20% |
| Throughput semanal | Reqs cerrados por semana | < 4–5 / semana | ≥ 4–5 / semana sin crecimiento de cola |

**Criterio de éxito del piloto (go/no-go):**
Se considerará el piloto exitoso y apto para escalar cuando:
- **4 o 5 requerimientos consecutivos** procesados con el agente sean transportados a producción **sin devolución post-entrega**
- El tiempo de ajuste al código generado por el desarrollador no supere **2 horas por requerimiento** — registrado en el Excel como campo adicional: `Horas de ajuste al código`
- El tiempo de ciclo de cada uno sea igual o menor a 5 días hábiles

**Cómo se mide:**
El mismo Excel existente se mantiene sin cambios. Se agrega una columna: `Generado por agente (S/N)`. Esto permite comparar directamente el ciclo de requerimientos asistidos por IA vs. los tradicionales con los mismos campos que ya se usan, sin crear nueva infraestructura de medición.

**Primer paso antes de iniciar el piloto:**
Calcular el promedio histórico de las 4 métricas principales desde el Excel actual para establecer la línea base real. Ese número es el punto de comparación oficial del proyecto.

## 6. RESTRICCIONES

**Compliance (no negociable):**
Todo código generado por el agente debe ser revisado, probado con pruebas unitarias y aprobado por un desarrollador ABAP antes de ser transportado a cualquier ambiente. El desarrollador es el responsable final del código que entra a producción — el agente nunca tiene acceso de escritura directa al sistema SAP.

**Datos — Confirmado, bajo riesgo:**
El agente opera exclusivamente en el **ambiente de desarrollo**, que contiene únicamente datos demo propios de SAP — sin datos reales de clientes ni de la empresa. Los ambientes de calidad y producción, que sí contienen datos reales, quedan fuera del alcance del agente. El flujo de transporte es siempre manual: el desarrollador decide qué código se mueve y cuándo.

| Ambiente | Datos | Agente opera aquí |
|---|---|---|
| Desarrollo | Demo SAP (sin datos reales) | ✅ Sí |
| Calidad | Backup productivo años anteriores (real, incompleto) | ❌ No |
| Producción | Datos reales completos | ❌ No |

**Técnicas — Decisión de arquitectura (no restricción confirmada):**
El agente se conecta al ambiente de desarrollo SAP en **modo solo lectura** para consultar estructuras de tablas, módulos de función, clases y objetos de repositorio. Nunca escribe directamente en el sistema. Los entregables son archivos `.abap` que el desarrollador importa manualmente — esto desacopla al agente de cualquier modificación directa al sistema y resuelve la principal objeción de seguridad antes de que sea planteada.

El acceso de lectura a SAP desde herramientas externas debe validarse con Seguridad e Infraestructura (ver Sección 2 — Bloqueadores potenciales). Si no se aprueba, el agente puede operar sin conexión directa a SAP, pero la calidad del código generado se verá afectada al no poder consultar estructuras reales.

**Herramientas — No confirmado, requiere validación con TI:**
No existe política formal documentada que restrinja herramientas externas. El único IDE externo en uso actual es Eclipse, que es el IDE estándar de ABAP. Cualquier solución que opere como extensión de Eclipse reduce la fricción de adopción. Sin embargo, la instalación de herramientas adicionales en equipos corporativos debe confirmarse con TI antes de iniciar el piloto — no hacerlo es un riesgo de cumplimiento interno.


## 7. ENFOQUE TÉCNICO PROPUESTO

**¿Por qué IA y no otras alternativas?**

| Alternativa | Por qué no es suficiente |
|---|---|
| Contratar más desarrolladores ABAP | Costo alto, tiempo de onboarding de 3-6 meses, no resuelve los ajustes por ambigüedad en el FD |
| Outsourcing de desarrollo | Agrega fricción de coordinación, expone código a terceros, no reduce la cola estructuralmente |
| Priorizar y reducir backlog manualmente | Triage no aumenta capacidad — solo decide quién espera más |
| SAP Joule para desarrolladores | Requiere licencia adicional de SAP Rise no incluida actualmente |
| **Agente IA con Claude** | Ya licenciado, capacidad ABAP demostrada, implementable en días, opera sobre el documento funcional estándar existente |

**Herramienta seleccionada: Claude Code (Anthropic)**
La empresa ya cuenta con licencia activa de Claude Code — el piloto no requiere aprobación de presupuesto adicional en herramientas. Para la fase de escala, la Anthropic API permite construir un pipeline automatizado sin intervención del desarrollador en la orquestación.

**Evidencia de capacidad en ABAP:** Investigación académica publicada en arXiv (2025) que evaluó los principales modelos LLM en generación de código ABAP reporta tasas de éxito del **74–77%** en código compilable para los modelos de mayor desempeño, con mejora adicional mediante ciclos de retroalimentación iterativa. Los modelos más débiles no superan el 20%. Claude se ubica en el rango superior de este benchmark — es una de las razones por las que la licencia existente es el punto de partida correcto, no una limitación.

**Arquitectura de alto nivel — Dos componentes:**

```
── FASE 1 (Piloto — sin inversión adicional) ──────────────────────────────────────────

 [Doc. Funcional]     [Agente 1]       [Doc. Técnico]    [Agente 2]     [Desarrollador]
 Formato estándar --> FD → Técnico --> Estructurado   --> TD → Código --> Revisa, prueba
 (Word / PDF)         Claude Code                        Claude Code    y aprueba .abap
                                                                              │
                                                                              ▼
                                                                    Importa manualmente
                                                                    a SAP Development

── FASE 2 (Escala — requiere aprobación de Seguridad) ─────────────────────────────────

 Mismo flujo anterior +
                                   ┌─────────────────────────┐
                    enriquece con  │  SAP Dev — Solo lectura  │
                    ◄──────────────│  Tablas Z, Func. Modules │
                    contexto real  │  Clases, Estructuras      │
                                   │  (MCP Server)            │
                                   └─────────────────────────┘
```

| Componente | Descripción | Herramienta | Estado |
|---|---|---|---|
| Agente 1 — FD a TD | Lee el documento funcional en formato estándar y genera la especificación técnica estructurada con objetos SAP, tablas involucradas y flujo de datos | Claude Code | Licencia existente |
| Agente 2 — TD a Código | Lee la especificación técnica y genera código ABAP orientado a objetos con modularización y mejores prácticas SAP | Claude Code | Licencia existente |
| Conexión SAP (solo lectura) | Consulta estructuras de tablas Z, módulos de función y clases reales del ambiente de desarrollo para enriquecer el código generado | MCP Server para SAP | Por validar con Seguridad |
| Entregable | Archivos `.abap` listos para importación manual por el desarrollador | — | Sin acceso de escritura al sistema |

**Fases de implementación:**

**Fase 1 — Piloto (sin inversión adicional) — Duración estimada: 4–6 semanas:**
Claude Code opera con el documento funcional estándar como input. El desarrollador orquesta los dos pasos (FD→TD y TD→código) usando Claude Code en su flujo de trabajo actual junto a Eclipse. Sin conexión directa a SAP — el agente trabaja solo con los documentos. Objetivo: completar 4-5 requerimientos exitosos según el criterio de la Sección 5. Al finalizar, se presenta al sponsor los resultados medidos vs. línea base del Excel para decisión de escala.

**Fase 2 — Escala (si el piloto es exitoso) — Duración estimada: 2–3 meses:**
Se añade un MCP Server de solo lectura para que el agente consulte estructuras reales del sistema SAP Development, condicionado a aprobación de Seguridad e Infraestructura. Se evalúa Anthropic API para automatizar el pipeline completo y reducir la intervención del desarrollador en la orquestación. El desarrollador pasa a rol puramente de auditor y aprobador.

## 8. RIESGOS Y DEPENDENCIAS

**Dependencia habilitadora — Mandato corporativo:**
La empresa ya ha establecido la directriz de que al menos el 60% de todo lo que se construya debe pasar por IA. Este proyecto no es una iniciativa aislada — es la implementación concreta de esa directriz en el equipo de desarrollo ABAP. Eso garantiza alineación organizacional y elimina el riesgo de resistencia al cambio: el equipo está abierto y la dirección ya está dada.

**Registro de riesgos:**

| # | Riesgo | Probabilidad | Impacto | Mitigación | Responsable |
|---|---|---|---|---|---|
| 1 | El documento funcional sigue llegando ambiguo al agente | Alta | Alto | Definir un checklist mínimo de calidad que el consultor funcional debe validar antes de entregar el FD al agente. Sin FD completo, el agente no se activa. | Consultor funcional + Jefe de Tecnología |
| 2 | El código generado tiene errores de compilación o lógica incorrecta | Media | Alto | Los mejores LLMs generan código ABAP compilable en el 74–77% de los intentos iniciales — lo que significa que entre 1 de cada 4 y 1 de cada 5 entregas requerirá corrección. La revisión del desarrollador no es una formalidad: es el control de calidad principal del sistema y debe ejecutarse con mayor rigor que para código escrito por humanos. El syntax check y las pruebas unitarias son obligatorios, no opcionales. | Desarrollador ABAP |
| 3 | Seguridad e Infraestructura no aprueba la conexión de solo lectura a SAP | Media | Medio | La Fase 1 del piloto opera sin conexión directa a SAP — el riesgo solo bloquea la Fase 2. Agendar validación con Seguridad antes de terminar el piloto. | Jefe de Tecnología |
| 4 | El piloto inicia con requerimientos demasiado complejos y falla | Baja | Alto | Seleccionar para el piloto requerimientos de complejidad media y tipo conocido (reportes Z, mejoras de salida, validaciones). Evitar objetos con lógica de negocio crítica o inusual en las primeras 4-5 iteraciones. | Desarrollador ABAP |
| 5 | El negocio espera entregas en 1-2 días sin considerar los tiempos de prueba funcional | Media | Medio | Comunicar desde el inicio que el ciclo de 4-5 días depende de la disponibilidad del consultor funcional y el área de procesos para pruebas — no solo del agente. El nuevo cuello de botella es la coordinación de pruebas, no el desarrollo. | Jefe de Tecnología |

## 9. LÍMITES DE ALCANCE

**En alcance — Entregables del proyecto:**

| Entregable | Descripción |
|---|---|
| Agente FD → TD | Componente que lee el documento funcional en formato estándar de la empresa y genera una especificación técnica estructurada lista para ser usada como insumo del siguiente agente |
| Agente TD → Código ABAP | Componente que lee la especificación técnica y genera archivos `.abap` con código orientado a objetos, modularizado y alineado a mejores prácticas SAP |
| Piloto validado | 4–5 requerimientos de complejidad media procesados con el agente, transportados a producción sin devolución, con métricas documentadas según la Sección 5 |
| Configuración base en Claude Code | Instrucciones y contexto (estándares ABAP, formato del FD) configurados en el entorno de Claude Code para que cualquiera de los 3 desarrolladores pueda operar el agente |

**Fuera de alcance — Exclusiones explícitas:**

| Excluido | Por qué es importante nombrarlo |
|---|---|
| Transporte automático del código a ambientes de calidad o producción | El agente nunca escribe directamente en SAP. El desarrollador importa y transporta manualmente en todo momento |
| Agente de auditoría de código | Evaluado como siguiente fase, no parte de este proyecto |
| Procesamiento del backlog actual (~50–65 requerimientos en cola) | El piloto opera sobre requerimientos nuevos. La cola existente se trabaja en paralelo con el proceso actual |
| Generación automática del documento funcional | El consultor funcional sigue siendo el responsable de escribir el FD. El agente parte de un documento ya elaborado |
| Soporte a otros lenguajes o sistemas distintos a SAP ABAP | El alcance es exclusivamente desarrollo ABAP en el sistema SAP de la empresa |
| Integración con sistemas de gestión de tickets o requerimientos | El agente no se conecta a ninguna herramienta de seguimiento — el flujo de asignación de tickets no cambia |
| Reentrenamiento o modificación del modelo de IA | Se utiliza Claude Code tal como está disponible hoy, sin personalización del modelo base |
