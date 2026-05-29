# language: es
@pipeline @orquestador
Característica: Orquestador del pipeline FD → TD → Código (/pipeline-abap)
  Como orquestador del pipeline ABAP, el slash command `/pipeline-abap` debe coordinar
  M1 → Gate 1 → M2 → Gate 2 → M3 con gates humanos obligatorios entre cada etapa,
  detenerse si M1 rechaza (Principio #2), versionar regeneraciones de M2 y persistir
  outputs consolidados en `outputs/<fecha>/<req-id>/`, según las reglas declaradas
  en `.claude/commands/pipeline-abap.md`.

  Antecedentes:
    Dado que existe el slash command "pipeline-abap" en `.claude/commands/`
    Y que el orquestador respeta los Principios #1, #2 y #6 del PRD

  @argumentos @temprano
  Escenario: Argumentos faltantes — el orquestador termina sin invocar a M1
    Dado que invoco el pipeline sin argumento de "ruta-fd"
    Cuando se ejecuta el orquestador
    Entonces el estado del pipeline debe ser "argumentos-invalidos"
    Y el orquestador NO debe haber invocado a M1
    Y el mensaje al usuario debe contener "ambos argumentos son obligatorios"

  @argumentos @temprano
  Escenario: Ruta de FD inexistente — el orquestador no invoca a M1
    Dado que invoco el pipeline con una ruta de FD que no existe
    Cuando se ejecuta el orquestador
    Entonces el estado del pipeline debe ser "fd-no-encontrado"
    Y el orquestador NO debe haber invocado a M1

  @principio-2 @rechazo-m1 @critico
  Escenario: M1 RECHAZADO — Principio #2 detiene el pipeline antes de M2
    Dado un FD que el Validador M1 va a rechazar
    Y el usuario respondería "sí" en cualquier gate posterior
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-099"
    Entonces el estado del pipeline debe ser "rechazado-m1"
    Y el orquestador debe haber invocado a M1
    Y el orquestador NO debe haber invocado a M2
    Y el orquestador NO debe haber invocado a M3
    Y la carpeta de outputs debe contener "fd.md"
    Y la carpeta de outputs debe contener "validacion.md"
    Y la carpeta de outputs NO debe contener "td.md"
    Y la carpeta de outputs NO debe contener "codigo.abap"

  @gate-1 @principio-6
  Escenario: Usuario responde "no" en Gate 1 — pipeline pausa sin invocar M2
    Dado un FD que el Validador M1 va a aprobar
    Y el usuario responde "no" en Gate 1
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-100"
    Entonces el estado del pipeline debe ser "pausado-gate-1"
    Y el orquestador debe haber invocado a M1
    Y el orquestador NO debe haber invocado a M2
    Y la carpeta de outputs debe contener "validacion.md"
    Y la carpeta de outputs NO debe contener "td.md"

  @gate-2 @regeneracion @br-11
  Escenario: Gate 2 "regenerar" produce td-v2.md sin sobreescribir td.md
    Dado un FD que el Validador M1 va a aprobar
    Y el usuario responde "sí" en Gate 1
    Y en Gate 2 el usuario responde con "regenerar" usando feedback "usar CL_SALV_TABLE"
    Y luego en Gate 2 el usuario responde "sí"
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-101"
    Entonces el orquestador debe haber invocado a M2 exactamente 2 veces
    Y la carpeta de outputs debe contener "td.md"
    Y la carpeta de outputs debe contener "td-v2.md"
    Y el archivo "td-v2.md" debe contener el feedback "usar CL_SALV_TABLE"
    Y el estado del pipeline debe ser "completado"

  @gate-2 @detener
  Escenario: Usuario responde "detener" en Gate 2 — pipeline pausa sin invocar M3
    Dado un FD que el Validador M1 va a aprobar
    Y el usuario responde "sí" en Gate 1
    Y el usuario responde "detener" en Gate 2
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-102"
    Entonces el estado del pipeline debe ser "pausado-gate-2"
    Y el orquestador debe haber invocado a M2
    Y el orquestador NO debe haber invocado a M3
    Y la carpeta de outputs debe contener "td.md"
    Y la carpeta de outputs NO debe contener "codigo.abap"

  @happy-path @completado
  Escenario: Happy path — los 4 archivos canónicos quedan persistidos
    Dado un FD que el Validador M1 va a aprobar
    Y el usuario responde "sí" en Gate 1
    Y el usuario responde "sí" en Gate 2
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-103"
    Entonces el estado del pipeline debe ser "completado"
    Y el orquestador debe haber invocado a M1
    Y el orquestador debe haber invocado a M2
    Y el orquestador debe haber invocado a M3
    Y la carpeta de outputs debe contener "fd.md"
    Y la carpeta de outputs debe contener "validacion.md"
    Y la carpeta de outputs debe contener "td.md"
    Y la carpeta de outputs debe contener "codigo.abap"
    Y la carpeta de outputs debe seguir el patrón "<fecha>/<req-id>/"

  @br-12 @escalamiento
  Escenario: M3 escala tras 2 ciclos del mismo error — no genera codigo-v3.abap
    Dado un FD que el Validador M1 va a aprobar
    Y el usuario responde "sí" en Gate 1
    Y el usuario responde "sí" en Gate 2
    Y M3 está configurado para escalar (BR-12)
    Cuando se ejecuta el orquestador con ese FD y "REQ-2026-104"
    Entonces el estado del pipeline debe ser "escalado-m3"
    Y el orquestador debe haber invocado a M3
    Y la carpeta de outputs NO debe contener "codigo.abap"
    Y el mensaje al usuario debe contener "Límite de iteraciones alcanzado"
