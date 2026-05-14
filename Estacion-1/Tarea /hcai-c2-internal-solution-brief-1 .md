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

Sponsor:
Jefe de Tecnologia - Jefe inmediato

Usuarios finales:
Jefes de procesos.
Gerencia.
Empleados.

Bloqueadores:
Seguridad e infraestructura.


## 3. ESTADO ACTUAL

Proceso hoy:
1. Se ve la necesidad del requimiento y es levantado con ayuda de usuarios finales y area de procesos.
2. Se define documentacion tecnica para ser analizado el alcance del requrimiento.
3. Se define especificacion tecnica del requirimento con el consultor funcional.
4. El requerimiento es asigando al desarrollador ABAP el cual analiza y determina tiempos de entrega.
5. Se desarrolla el requrimiento por parte del desarrollador ABAP con pruebas unitarias y se entrega a pruebas funcionales, puden ser con el consultor funcional o con el area de procesos.
6. Si se identfican ajustes o mejoras al desarrollo del requerimiento es devuelto al desarrollador para ajustes.
7. Una vez se apruebe el desarrollo es enviado al ambiente de producción y se hace entrega al usario final, quien da un feedback del requrimiento y donde se puden presentar ajustes o mejoras, devolviendolo al desarrollador ABAP.

Funcina bien:
El proceso conlleva pruebas rigurosas antes de ser migrado al ambiente productivo.

No Funciona:
1. Tiempos de desarrollo largos, dependiendo de la complejidad del requerimiento.
2. Devolucion del requrimiento po ajustes o mejoras en fase de pruebas.

## 4. ESTADO FUTURO DESEADO

Vision:
El agente es capaz de reconocer un documento funcional y partiendo de el, armar un documento tecnico que es el insumo para el desarrollo del mismo.
Una vez con el docuemtno tecnico, el agente es capaz de construir el desarrollo con las mejores practicas de desarrollo SAP ABAP, orientado a objetos y modularizacion segun recomentaciones de SAP.
Una vez con el requerimiento en codigo, el agente hara audutoria del mismo y porponda mejoras en cuanto a codigo y mejores practicas.

Cambio diario:
Los desarrolladores ABAP pasan de ser desarrolladores a ser analistas de codigo y realizar pruebas unitarias del entregable del Agente.

## 5. CRITERIOS DE ÉXITO

Metricas:
|Métrica                   | Valor actual  | Target |
|Tiempos de desarrollo.    | 100%          | 20%.   |
|Mas valor en el entregable| Menos Ajustes | Entregas rapidas a PRD

## 6. RESTRICCIONES

Tecnicas:
ERP SAP Acceso via API Limitada

Datos:
Datos sencibles de la compañia y clientes, debe correr solo en ambientes de desarrollo.

Organizaciones:
Seguridad de la infromacion

Compliance:
El desarrollo entregado por el Agente siempre debe ser revisado por un Desarrollador ABAP, el cual le realizara pruebas unitarios, identificaco posibles errores.


## 7. ENFOQUE TÉCNICO PROPUESTO

Capacidad IA:
Alto nivel en codificacion, programacion y desarrollo de codigo, logica de programacion de alto nivel y utilizacion de las mejores practicas en desarrollo SAP ABAP segun recomendaciones de SAP.

Porque IA:
Tiempos de programacion reducidos en almenos un 80%.

**Arquitectura de alto nivel** (describe los componentes principales)
1. Agente con capacidad de leer documentacion funcional y transacribirla a una documentacion Tecnica.
2. Agente capaz de leera la docuemntacion tecnica y desarrollar el codigo con altos estandares de programacion ABAP basada en la mejores practicas que SAP proporcione.
3. Agente que realiza aauditoria al codigo que es desarrollado.

## 8. RIESGOS Y DEPENDENCIAS

Riesgo 1:
Acceso a API de SAP Limitado
Mitiacion: Hay formas de conectar IA a SAP, pasar por chequeos de audutoria de seguridad con IA.

Riesgo 2:
Exposicion de datos sensibles de la compñia y clientes
Mitigacion: Usar el agente solo en ambientes de desarrollo donde no haya data o la data es reducida en comparacion con ambientes de calidad o producción.

## 9. LÍMITES DE ALCANCE

En Alcance:
1. Agente que lea docuemntacion funcional y construya documentacion tecnica.
2. Agente que lea docuemntacion tenica y la codifique.

Fuera del Alcance:
1. Agente de audutoria de codigo.
