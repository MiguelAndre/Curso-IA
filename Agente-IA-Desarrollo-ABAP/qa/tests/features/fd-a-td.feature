# language: es
@m2 @fd-a-td
Característica: Generador de Especificación Técnica (Módulo 2)
  Como segundo paso del pipeline FD → TD → Código,
  el sub-agente `fd-a-td` debe transformar un FD aprobado en un TD razonado de 9 secciones,
  sin inventar nombres SAP (BR-14), sin generar código ABAP (BR-03),
  con sección de Decisiones y Supuestos siempre no vacía (BR-04) y con TBDs explícitos (BR-05),
  según las reglas declaradas en `.claude/agents/fd-a-td.md`.

  Antecedentes:
    Dado que el sub-agente "fd-a-td" está disponible en el repositorio
    Y que el contrato de entrada es "docs/formato-fd-generico.md"

  @happy-path @reporte-alv @skill-alv
  Escenario: FD ALV aprobado produce TD con las 9 secciones y patrón canónico
    Dado un FD aprobado para un reporte ALV de materiales por proveedor
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD debe declarar el tipo de objeto "REPORTE_ALV" en la sección 1
    Y el TD debe contener las 9 secciones obligatorias del agente
    Y el TD debe proponer una clase con nombre que matchee "ZCL_[A-Z_]+"
    Y el TD debe listar las tablas SAP mencionadas en el FD (MARA, EKKO, EKPO, MSEG, LFA1)
    Y el TD debe tener una sección "Decisiones y Supuestos" con al menos 1 entrada

  @br-01 @9-secciones
  Escenario: BR-01 — las 9 secciones obligatorias siempre están presentes
    Dado un FD aprobado mínimo para un reporte ALV trivial
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD debe incluir la sección "1. Tipo de objeto ABAP"
    Y el TD debe incluir la sección "2. Resumen funcional"
    Y el TD debe incluir la sección "3. Objetos SAP involucrados"
    Y el TD debe incluir la sección "4. Arquitectura técnica"
    Y el TD debe incluir la sección "5. Campos y estructuras"
    Y el TD debe incluir la sección "6. Implementación de Reglas de Negocio"
    Y el TD debe incluir la sección "7. Criterios de Aceptación técnicos"
    Y el TD debe incluir la sección "8. Decisiones y Supuestos"
    Y el TD debe incluir la sección "9. TBD"

  @br-03 @no-codigo
  Escenario: BR-03 — el TD nunca contiene código ABAP compilable
    Dado un FD aprobado para un reporte ALV de materiales por proveedor
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD no debe contener "REPORT z"
    Y el TD no debe contener "CLASS zcl_" en formato de declaración compilable
    Y el TD no debe contener "ENDMETHOD"
    Y el TD no debe contener bloques de código en lenguaje "```abap"

  @br-02 @modo-directo
  Escenario: BR-02 — invocación directa emite aviso prominente
    Dado un FD aprobado para un reporte ALV trivial
    Cuando invoco el sub-agente "fd-a-td" en modo directo (sin pasar por el Validador)
    Entonces el TD debe contener un AVISO de modo directo al inicio
    Y el aviso debe mencionar que el FD no pasó por el Validador
    Y el TD debe completarse igualmente (el agente no se niega — BR-02)

  @br-09 @reverse-engineering
  Escenario: BR-09 — input ABAP activa modo reverse engineering automáticamente
    Dado un input que es un programa ABAP existente y no un Documento Funcional
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD debe contener la cabecera "Modo Reverse Engineering"
    Y el TD debe marcar las Reglas de Negocio como "inferida del código"
    Y el TD debe incluir una recomendación de validar con el área de negocio

  @br-05 @tbd
  Escenario: BR-05 — FD con información no resuelta produce TBDs explícitos en §9
    Dado un FD aprobado con contradicción interna entre RN y Casos Borde
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD debe incluir al menos un TBD en la sección 9
    Y cada TBD debe incluir una "Pregunta para el consultor"

  @br-14 @anti-alucinacion
  Escenario: BR-14 — el TD no inventa nombres de tablas SAP
    Dado un FD aprobado para un reporte ALV de materiales por proveedor
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces cada tabla SAP listada en la sección 3 debe estar en el FD original o estar marcada con "⚠️ VERIFICAR"

  @br-13 @idioma
  Escenario: BR-13 — el TD está redactado en español
    Dado un FD aprobado para un reporte ALV trivial
    Cuando invoco el sub-agente "fd-a-td" en modo pipeline (FD ya validado)
    Entonces el TD debe contener palabras frecuentes en español (artículos, conectores)
    Y el TD no debe tener encabezados de sección en inglés (Decisions, Assumptions, Tables)
