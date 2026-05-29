# language: es
@m1 @validador-fd
Característica: Validador de Documentos Funcionales (Módulo 1)
  Como compuerta de entrada del pipeline FD → TD → Código,
  el sub-agente `validador-fd` debe emitir un veredicto binario APROBADO/RECHAZADO
  según las reglas de Completitud Estructural (CE-01..07) y Calidad Semántica (CS-01..09)
  declaradas en `.claude/agents/validador-fd.md`, sin permitir bypass humano (Principio #2).

  Antecedentes:
    Dado que el sub-agente "validador-fd" está disponible en el repositorio
    Y que el contrato de entrada es "docs/formato-fd-generico.md"
    Y que el formato de output sigue los templates de §7 del agente

  @ce-01 @ce-04 @ce-07 @rechazo
  Escenario: FD al que le faltan secciones estructurales obligatorias
    Dado un FD que omite la sección "Autorizaciones"
    Y omite la sección "Tablas SAP involucradas"
    Y tiene un Objetivo vacío (menos de 50 caracteres de contenido)
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "RECHAZADO"
    Y el output debe listar el gap "CE-01" asociado a la sección "Objetivo"
    Y el output debe listar el gap "CE-04" asociado a la sección "Tablas SAP involucradas"
    Y el output debe listar el gap "CE-07" asociado a la sección "Autorizaciones"
    Y cada gap debe incluir una "Recomendación" accionable
    Y el output debe terminar con la frase canónica "El pipeline está detenido."

  @ce @rechazo @br-09
  Escenario: BR-09 — todos los gaps se reportan en una sola pasada
    Dado un FD con seis secciones estructurales faltantes o vacías
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "RECHAZADO"
    Y el output debe listar los seis gaps en la misma respuesta
    Y el output no debe pedir aclaraciones al usuario antes de reportar

  @aprobado @happy-path
  Escenario: FD completo y semánticamente válido
    Dado un FD que cumple las siete secciones obligatorias del formato genérico
    Y cuyo Objetivo tiene verbo accionable y resultado medible
    Y cuyas Reglas de Negocio tienen formato condición → acción
    Y cuyas Tablas SAP están nombradas técnicamente (p. ej. MARA, MARC)
    Y cuyos Criterios de Aceptación son verificables
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "APROBADO"
    Y el output debe terminar con la frase canónica "El pipeline puede continuar al Módulo 2 (FD → TD)."
    Y el output no debe contener ningún diseño técnico (TD ni código ABAP)

  @cs-01 @cs-05 @rechazo
  Escenario: FD estructuralmente completo pero semánticamente vago
    Dado un FD con las siete secciones presentes
    Pero cuyo Objetivo dice únicamente "Optimizar el proceso de ventas"
    Y cuyos Criterios de Aceptación son frases como "que funcione bien"
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "RECHAZADO"
    Y el output debe listar el gap "CS-01" en la sección "Objetivo"
    Y el output debe listar el gap "CS-05" en la sección "Criterios de Aceptación"

  @principio-2 @br-02
  Escenario: Principio #2 — el validador no permite bypass aunque el usuario insista
    Dado un FD que fue RECHAZADO previamente con gaps bloqueantes
    Cuando el usuario solicita "aprobar de todas formas para no retrasar el sprint"
    Entonces el sub-agente debe negarse
    Y el output debe contener la frase canónica
      """
      El Principio #2 del PRD impide aprobar un FD sin la calidad mínima.
      """
    Y el output no debe cambiar el veredicto a "APROBADO"

  @5-2 @redireccion
  Escenario: Input que no es un FD (es código ABAP)
    Dado un input que es un programa ABAP existente y no un Documento Funcional
    Cuando invoco el sub-agente "validador-fd" con ese input
    Entonces el sub-agente no debe emitir veredicto "APROBADO" ni "RECHAZADO"
    Y debe redirigir al usuario al caso UC5 sugiriendo "/generar-td <ruta-codigo>"

  @br-03 @anti-patron
  Escenario: BR-03 — el validador no genera TD ni código aunque el FD sea trivial
    Dado un FD mínimo pero completo para un reporte ALV de una sola tabla
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "APROBADO"
    Y el output no debe contener bloques de código ABAP
    Y el output no debe contener una sección "Arquitectura técnica" ni "Pseudocódigo"

  @aprobado @cs-o @observaciones
  Esquema del escenario: FD aprobado con observaciones menores (CS-O)
    Dado un FD que cumple todas las CE y todas las CS bloqueantes
    Pero presenta la observación menor "<observacion>"
    Cuando invoco el sub-agente "validador-fd" con ese FD
    Entonces el veredicto debe ser "APROBADO"
    Y el output debe incluir una sección "Observaciones menores"
    Y debe mencionar la regla "<regla>"

    Ejemplos:
      | observacion                                         | regla |
      | Alcance sin exclusiones explícitas                  | CS-02 |
      | Filtro temporal ambiguo (no distingue fecha doc/contab) | CS-08 |
      | Comportamiento ante listado vacío no especificado   | CS-09 |
