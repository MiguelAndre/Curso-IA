**ESTÁNDAR DE NOMENCLATURA**

**Objetos ABAP y RAP (RESTful ABAP Programming Model)**

Manufacturas Eliot S.A.

Equipo de Desarrollo SAP — Sistema DEV

Agosto de 2026

**1. Objetivo**

Este documento establece el estándar oficial de nomenclatura para el desarrollo de objetos ABAP y RAP en el sistema SAP S/4HANA de Manufacturas Eliot S.A. Su propósito es garantizar consistencia, trazabilidad y legibilidad en todos los desarrollos custom, facilitando el mantenimiento y la colaboración entre los miembros del equipo técnico.

Regla general (objetos ABAP clásicos):

**Z + TIPO + MÓDULO + \_ + DESCRIPCIÓN**

El prefijo de tipo de objeto se define primero, seguido del código de módulo funcional de dos letras y, finalmente, una descripción breve y clara en mayúsculas separada por guion bajo.

**2. Códigos de Módulo Funcional**

Código de dos letras que identifica el área funcional a la que pertenece el objeto:

| **Código** | **Módulo Funcional**      |
|:-----------|:--------------------------|
| SD         | Sales & Distribution      |
| MM         | Materials Management      |
| FI         | Finance                   |
| CO         | Controlling               |
| WM         | Warehouse Management      |
| PP         | Production Planning       |
| RT         | IS-Retail (específico)    |
| HR         | Human Resources           |
| BC         | Basis / Cross-Application |

**3. Nomenclatura de Paquetes (Jerarquía de Desarrollo)**

Los paquetes ABAP organizan los objetos de desarrollo en una estructura jerárquica de tres niveles. Esta jerarquía debe crearse antes de comenzar cualquier desarrollo nuevo, y todos los objetos custom deben ubicarse dentro del subpaquete correspondiente a su área funcional.

**SUPER PAQUETE → PAQUETE → SUBPAQUETE**

| **Nivel** | **Formato** | **Ejemplo** |
|:---|:---|:---|
| Super Paquete (Nivel 1) | Z + MOD | ZMM |
| Paquete (Nivel 2) | Z + MOD + \_ + ÁREA | ZMM_MATERIALES |
| Subpaquete (Nivel 3) | Z + MOD + \_ + ÁREA + \_ + SUBÁREA | ZMM_MATERIALES_RAP |

**3.1 Descripción de cada nivel**

- Super Paquete: contenedor raíz de todo un módulo funcional (ej. ZMM agrupa todos los desarrollos de Materials Management). Es el nivel más alto y normalmente el único de tipo estructura pura (sin objetos propios, solo subpaquetes).

- Paquete: agrupa los desarrollos de una misma área o proceso de negocio dentro del módulo (ej. ZMM_MATERIALES para todo lo relacionado con gestión de materiales, ZSD_PEDIDOS para pedidos de venta).

- Subpaquete: agrupa objetos por tipo o subproceso específico dentro del paquete (ej. RAP, interfaces, reportes), facilitando el transporte y la asignación de autorizaciones granulares.

**3.2 Ejemplo de jerarquía aplicada**

Ejemplo de estructura completa para el módulo MM en el desarrollo de materiales:

**ZMM**

**└── ZMM_MATERIALES**

├── ZMM_MATERIALES_RAP (objetos RAP: CDS, Behavior, Service)

├── ZMM_MATERIALES_INTERFACES (RFC, proxies, APIs)

└── ZMM_MATERIALES_REPORTES (programas, reports)

- Cada subpaquete recibe únicamente objetos del tipo indicado en su nombre, evitando mezclar reportes con objetos RAP dentro del mismo subpaquete.

- El área (nivel 2) se define según el proceso de negocio, no según el tipo técnico de objeto; el tipo técnico se resuelve en el nivel 3 (subpaquete).

**3.3 Procedimiento de Creación en el Sistema**

La jerarquía se crea de arriba hacia abajo, siempre desde la transacción SE21 (Package Builder). Cada nivel tiene atributos distintos que determinan si puede contener objetos de desarrollo directamente o solo agrupar paquetes hijos.

| **Nivel** | **¿Paquete de Estructura?** | **Superpaquete a asignar** | **¿Contiene objetos?** |
|:---|:---|:---|:---|
| Super Paquete | Sí (marcado) | Ninguno (raíz) | No — solo agrupa paquetes hijos |
| Paquete | Sí (marcado) | Super Paquete | No — solo agrupa subpaquetes |
| Subpaquete | No (desmarcado) | Paquete (nivel 2) | Sí — aquí se crean los objetos de desarrollo |

Pasos para crear cada nivel (transacción SE21):

- 1\. Crear el Super Paquete: ejecutar SE21, digitar el nombre (ej. ZMM), marcar la casilla "Paquete de estructura", dejar el campo Superpaquete en blanco (es la raíz), y asignar Componente de Aplicación y Capa de Transporte correspondientes al módulo.

- 2\. Crear el Paquete (Nivel 2): ejecutar SE21 con el nuevo nombre (ej. ZMM_MATERIALES), asignar en el campo Superpaquete el Super Paquete creado en el paso anterior (ZMM), y marcar nuevamente "Paquete de estructura" ya que este nivel tampoco alojará objetos directamente, solo subpaquetes.

- 3\. Crear el Subpaquete (Nivel 3): ejecutar SE21 con el nombre final (ej. ZMM_MATERIALES_RAP), asignar en Superpaquete el Paquete de nivel 2 (ZMM_MATERIALES), y esta vez dejar SIN marcar "Paquete de estructura", ya que es el único nivel donde se crean los objetos de desarrollo (programas, CDS, clases, etc.).

- 4\. Asignar la orden de transporte: al guardar el Super Paquete se solicitará crear o seleccionar una orden de transporte; los niveles 2 y 3 pueden viajar en la misma orden o en órdenes de tarea separadas según el proyecto.

- 5\. Verificar la jerarquía: desde SE21, usar la vista de árbol (botón "Jerarquía de paquetes") para confirmar que el subpaquete cuelga correctamente del paquete, y este del super paquete.

- 6\. Solo después de tener el subpaquete creado se procede a crear los objetos de desarrollo (reportes, tablas, clases, objetos RAP) dentro de él, siguiendo la nomenclatura definida en las secciones 4 y 5 de este documento.

Nota: si el subpaquete va a exponer objetos a otros paquetes (por ejemplo, una interface de RAP consumida desde otro módulo), se recomienda definir además una Package Interface (SE21 → pestaña "Interfaces") para controlar la visibilidad y mantener el encapsulamiento entre módulos.

**4. Nomenclatura de Objetos ABAP Clásicos**

Tabla de referencia rápida con el prefijo de tipo, formato completo y ejemplo para cada clase de objeto:

| **Objeto** | **Prefijo Tipo** | **Formato** | **Ejemplo** |
|:---|:---|:---|:---|
| Programa / Report | R | ZR + MOD + \_desc | ZRMM_MERCERIA |
| Tabla transparente | T | ZT + MOD + \_desc | ZTMM_MATERIAL |
| Estructura | S | ZS + MOD + \_desc | ZSMM_MATERIAL_HDR |
| Clase global | CL | ZCL\_ + MOD + \_desc | ZCL_MM_HELPER |
| Interface global | IF | ZIF\_ + MOD + \_desc | ZIF_MM_PROCESADOR |
| Exception class | CX | ZCX\_ + MOD + \_desc | ZCX_FI_ERROR_CARTERA |
| Function Group | F | ZF + MOD + \_desc | ZFSD_CALCULO_PRECIO |
| Function Module | — | Z\_ + MOD + \_verbo | Z_MM_GET_MATERIAL |
| Data Element | DE | ZDE\_ + MOD + \_desc | ZDE_MM_ESTADO_MAT |
| Domain | DD | ZDD\_ + MOD + \_desc | ZDD_MM_ESTADO_MAT |
| Search Help | SH | ZSH\_ + MOD + \_desc | ZSH_MM_MATERIAL |
| Lock Object | — | EZ + MOD + \_desc | EZMM_MATERIAL |
| BAdI Implementation | E | ZE\_ + MOD + \_desc | ZE_RT_ARTICLE_REF |
| Message Class | — | Z + MOD + \_MSG | ZMM_MSG |
| Transacción | — | Z + MOD + \_desc | ZMM_MANT_MATERIAL |

**5. Nomenclatura de Objetos RAP**

En los objetos RAP el prefijo identifica la capa arquitectónica (Interface, Consumption, Behavior, Service) en lugar del tipo de objeto ABAP clásico. El código de módulo se ubica inmediatamente después del prefijo de capa, y se debe mantener la misma raíz de nombre (entidad) en todas las capas para asegurar trazabilidad completa del objeto de negocio.

| **Capa** | **Formato** | **Ejemplo** |
|:---|:---|:---|
| CDS Interface View | ZI\_ + MOD + \_desc | ZI_MM_SOLICITUD |
| CDS Consumption View | ZC\_ + MOD + \_desc | ZC_MM_SOLICITUD |
| Behavior Definition | Mismo nombre que el CDS de esa capa | ZI_MM_SOLICITUD.bdef |
| Behavior Implementation Class | ZBP_I\_ + MOD + \_desc | ZBP_I_MM_SOLICITUD |
| Service Definition | ZSD\_ + MOD + \_desc | ZSD_MM_SOLICITUD |
| Service Binding | ZUI\_ + MOD + \_desc + \_O4 / \_O2 | ZUI_MM_SOLICITUD_O4 |

**5.1 Convenciones dentro del Behavior Definition**

Convenciones internas para determinaciones, validaciones y acciones dentro del archivo .bdef:

| **Elemento**    | **Convención**           | **Ejemplo**              |
|:----------------|:-------------------------|:-------------------------|
| Determinaciones | determine\_ + acción     | determine_status         |
| Validaciones    | validate\_ + campo/regla | validate_cliente         |
| Acciones        | verbo en infinitivo      | release, cancel, approve |

**6. Paso a Paso: Creación de un Objeto RAP en Eclipse (ADT)**

El siguiente procedimiento describe la secuencia recomendada para crear un Business Object RAP completo en Eclipse (ABAP Development Tools), desde la tabla de base de datos hasta la exposición como servicio OData, siguiendo la nomenclatura definida en la sección 5. El ejemplo usa la entidad ficticia "Solicitud" del módulo MM.

Requisito previo: tener creado el subpaquete correspondiente (ver sección 3.3), por ejemplo ZMM_MATERIALES_RAP, y el proyecto ABAP conectado en Eclipse.

| **Paso** | **Objeto ADT** | **Acción en Eclipse / Nombre resultante** |
|:---|:---|:---|
| 1 | Tabla de base de datos | New \> Database Table → definir campos, clave primaria y activar (ej. ZMM_SOLICITUD) |
| 2 | CDS Interface View | New \> Data Definition → plantilla "Define Root View Entity" → ZI_MM_SOLICITUD |
| 3 | Metadata Extension (opcional) | New \> Metadata Extension → anotaciones @UI para Fiori Elements → ZI_MM_SOLICITUD |
| 4 | Behavior Definition (Interface) | Clic derecho sobre el CDS → New Behavior Definition → tipo Managed → ZI_MM_SOLICITUD.bdef |
| 5 | Clase de Implementación | Generada automáticamente al guardar el .bdef → ZBP_I_MM_SOLICITUD |
| 6 | CDS Consumption/Projection View | New \> Data Definition → plantilla "Define Projection View" → ZC_MM_SOLICITUD |
| 7 | Behavior Definition (Projection) | Clic derecho sobre la Projection → New Behavior Definition → ZC_MM_SOLICITUD.bdef |
| 8 | Service Definition | New \> Service Definition → exponer la Projection View → ZSD_MM_SOLICITUD |
| 9 | Service Binding | New \> Service Binding → tipo OData V4 UI → ZUI_MM_SOLICITUD_O4 → Publicar |
| 10 | Prueba (Preview) | Desde el Service Binding, botón "Preview" → validar CRUD en Fiori Elements |

**6.1 Detalle de los pasos clave**

- Paso 1 — Tabla de base de datos: clic derecho sobre el subpaquete → New → Other ABAP Repository Object → Database Table. Definir campos, tipo de datos y clave primaria (incluyendo el campo mandt/client si aplica).

- Paso 2 — CDS Interface View: clic derecho sobre el subpaquete → New → Data Definition. Elegir la plantilla "Define Root View Entity" para que genere automáticamente las anotaciones @AbapCatalog.sqlViewName, @AccessControl.authorizationCheck y @EndUserText.label. Definir la clave con @ObjectModel.compositionRoot: true si es la entidad raíz.

- Paso 3 — Behavior Definition (Interface): sobre el CDS recién creado, clic derecho → New → Behavior Definition. Elegir Managed (recomendado para nuevos desarrollos) y confirmar; Eclipse genera el .bdef y ofrece crear automáticamente la clase de implementación (ZBP_I_MM_SOLICITUD).

- Paso 4 — Implementación del comportamiento: dentro de ZBP_I_MM_SOLICITUD se codifican las validaciones (validate\_), determinaciones (determine\_) y acciones (verbo en infinitivo) descritas en la sección 5.1, además de los métodos estándar READ, CREATE, UPDATE y DELETE si el manejo es no estándar.

- Paso 5 — CDS Consumption/Projection View: nueva Data Definition con plantilla "Define Projection View", apuntando con "as projection on" al CDS Interface. Aquí se agregan las anotaciones @UI (LineItem, Identification, SelectionField) para la app Fiori Elements.

- Paso 6 — Behavior Definition (Projection): clic derecho sobre la Consumption View → New Behavior Definition. Se usa "use" para exponer únicamente los campos, acciones y operaciones que la capa de consumo debe permitir (control de qué se publica hacia el consumidor final).

- Paso 7 — Service Definition y Service Binding: crear el Service Definition exponiendo la entidad proyectada, y luego el Service Binding (tipo OData V4 - UI para apps Fiori, o Web API para consumo externo/integraciones). Publicar el servicio desde el propio editor del Service Binding.

- Paso 8 — Activación y prueba: activar todos los objetos (Ctrl+F3 los activa en cascada si están en el mismo paquete) y usar el botón "Preview" del Service Binding para probar el CRUD generado automáticamente antes de construir una app Fiori Elements formal.

Recomendación: activar los objetos en el mismo orden en que se crean (tabla → CDS Interface → Behavior Interface → CDS Projection → Behavior Projection → Service Definition → Service Binding), ya que cada capa depende de la anterior y Eclipse marcará errores de sintaxis si se intenta activar fuera de orden.

**7. Buenas Prácticas**

- Mantener la misma raíz de nombre (entidad de negocio) en todas las capas de un objeto RAP: CDS, Behavior, Service Definition y Service Binding.

- Evitar abreviaturas ambiguas en la entidad raíz; sí se permiten en subentidades relacionadas (ejemplo: \_ITM para ítems, \_CLI para clientes).

- Usar siempre mayúsculas y guion bajo como separador de palabras en la descripción.

- No mezclar el código de módulo dentro de la descripción cuando ya existe un campo de módulo dedicado en el formato.

- Documentar cualquier excepción al estándar directamente en el objeto (documentación técnica) y notificar al equipo.

- Revisar este estándar junto con el equipo (Desarrollador/Coordinador, ABAP6_ELIOT, NROMERO) antes de la creación de nuevos paquetes o proyectos grandes.

**8. Aplicación a Objetos Existentes (Referencia)**

A modo de referencia, así se vería el renombramiento de algunos objetos actuales del entorno Eliot bajo el nuevo estándar. Esta tabla es únicamente ilustrativa; no implica una obligación de renombrar objetos ya productivos.

| **Nombre Actual**     | **Nombre Bajo el Estándar**           |
|:----------------------|:--------------------------------------|
| ZSDR_106_PARALLEL_F01 | ZRSD_106_PARALLEL                     |
| ZRMM_MERCERIA         | ZRMM_MERCERIA (ya cumple el estándar) |
| ZFIR_CARTERA_SPE      | ZRFI_CARTERA_SPE                      |
| ZTMATERIAL            | ZTMM_MATERIAL                         |
| ZTMARA_PAISES         | ZTMM_MARA_PAISES                      |

**9. Recomendaciones Adicionales de Desarrollo RAP**

Estas recomendaciones complementan el estándar de nomenclatura con buenas prácticas de desarrollo, autorizaciones, pruebas y rendimiento específicas para el entorno RAP en Eliot, considerando que el sistema DEV se comparte entre varios desarrolladores (Desarrollador/Coordinador, ABAP6_ELIOT, NROMERO).

**9.1 Autorizaciones**

- Definir un objeto de autorización custom por entidad de negocio (ej. ZMM_SOL) en vez de reutilizar objetos genéricos como S_TABU_DIS, y enlazarlo en el CDS Interface con @AccessControl.authorizationCheck: \#CHECK más una clase de autorización dedicada.

- Nomenclatura sugerida para el objeto de autorización: Z + MOD + 3 letras de la entidad (ej. ZMM_SOL), de modo que comparta raíz de nombre con el rol PFCG asociado.

**9.2 Manejo de mensajes**

- Crear una clase de mensajes por entidad de negocio en lugar de una genérica por módulo (ej. ZMM_SOLICITUD_MSG en vez de solo ZMM_MSG), lo que facilita el mantenimiento cuando varias entidades crecen dentro del mismo subpaquete.

- En el .bdef, usar "mapping for" para vincular los %msg a mensajes reales de esa clase y evitar texto de error hardcodeado en "reported".

**9.3 Pruebas (ABAP Unit)**

- Para cada clase de comportamiento ZBP_I\_..., crear su clase de test local usando el Test Double Framework de RAP (cds_test_environment), con prefijo LTCL\_ dentro del include .testclasses.abap.

- Nombrar los métodos de test como verbo_escenario (ej. validate_cliente_vacio, determine_status_ok) para que el reporte de cobertura sea legible.

**9.4 Manejo de Drafts (RAP Managed)**

- Si se usa Draft para edición transaccional en Fiori, la tabla shadow generada automáticamente sigue el nombre del CDS más un sufijo técnico; no renombrarla manualmente, y documentar en el estándar únicamente la tabla persistente real.

- Definir explícitamente early numbering vs. late numbering para la generación de claves (UUID vs. número de rango), según si el ID debe ser visible al usuario antes de guardar.

**9.5 Rangos de numeración**

- Cuando la entidad RAP usa número de rango en vez de UUID, nombrar el objeto de rango igual que la entidad de negocio (ej. ZMM_SOLICITUD) para mantener trazabilidad completa entre capas.

**9.6 Extensibilidad y trabajo multi-desarrollador**

- Al compartir el sistema DEV entre varios desarrolladores, separar el Behavior Definition por capas: usar late numbering/saver override solo en la clase de implementación de la entidad raíz, y delegar determinaciones o validaciones adicionales a clases separadas vía BAdI de RAP, reduciendo choques de mezcla (merge) sobre el mismo objeto.

**9.7 Transportes**

- Agrupar en una sola orden de tarea la tabla, el CDS, el behavior y el service cuando el objeto es completamente nuevo; usar órdenes separadas cuando el objeto ya está productivo y solo se modifica un método puntual, reduciendo el riesgo de arrastrar cambios no relacionados.

**9.8 Rendimiento**

- En las Projection Views, evitar exponer asociaciones que disparen SELECT adicionales por cada fila en listados grandes (Fiori List Report); usar "redirected to composition" únicamente donde realmente se navega al detalle.

- Revisar las clases de comportamiento con Code Inspector (SCI) o ATC antes de transportar a QAS; el chequeo de prioridad RAP detecta antipatrones comunes como bucles anidados sobre %param o SELECT dentro de LOOP.

**9.9 Documentación técnica embebida**

- Usar ABAP Doc ("! ) en la clase de implementación para documentar cada validación, determinación y acción; resulta especialmente útil cuando el objeto crece con múltiples entidades hijas, como en el caso de "Pedido de Tienda".

**10. Anexo Técnico: Ejemplo Completo de un Objeto RAP**

Este anexo desarrolla un ejemplo completo aplicando el estándar de nomenclatura a una entidad de negocio ficticia "Solicitud" del módulo MM, integrando CDS, Behavior Definition, clase de excepción custom y clase de implementación del comportamiento. Cada bloque incluye la explicación línea por línea de los elementos más relevantes.

**10.1 CDS Interface View**

```abap
@AbapCatalog.sqlViewName: 'ZIMMSOLICITUD'
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Interface Solicitud'
define root view entity ZI_MM_SOLICITUD
  as select from ztmm_solicitud
{
  key uuid       as Uuid,
      numero     as Numero,
      cliente    as Cliente,
      estado     as Estado,
      @Semantics.amount.currencyCode: 'Moneda'
      monto      as Monto,
      moneda     as Moneda
}
```

- @AbapCatalog.sqlViewName: nombre de la vista SQL generada en base de datos (máximo 16 caracteres).

- @AccessControl.authorizationCheck: \#CHECK: obliga a validar autorizaciones, enlazado al objeto de autorización ZMM_SOL (ver sección 9.1).

- define root view entity: indica que es la entidad raíz de la composición RAP, no un hijo.

- key uuid as Uuid: campo clave técnico tipo UUID, recomendado para early numbering en RAP Managed.

**10.2 Behavior Definition**

```abap
managed implementation in class zbp_i_mm_solicitud unique;
strict(2);

define behavior for ZI_MM_SOLICITUD alias Solicitud
persistent table ztmm_solicitud
lock master
authorization master ( instance )
{
  create;
  update;
  delete;

  field ( readonly ) Uuid;
  field ( mandatory ) Cliente, Monto;

  validation validate_cliente on save { field Cliente; }
  determination determine_estado on modify { field Estado; }

  mapping for ztmm_solicitud
    {
      Uuid    = uuid;
      Numero  = numero;
      Cliente = cliente;
      Estado  = estado;
      Monto   = monto;
      Moneda  = moneda;
    }
}
```

- managed implementation in class ... unique: define la clase ABAP que implementa la lógica; Managed significa que RAP genera el CRUD básico automáticamente.

- strict(2): activa las validaciones de sintaxis más estrictas de RAP (buena práctica siempre).

- lock master / authorization master (instance): la entidad gestiona su propio bloqueo y la autorización se verifica por instancia.

- field (readonly) / field (mandatory): controlan qué campos no se pueden modificar y cuáles son obligatorios antes de guardar.

- validation ... on save { field Cliente; }: declara el método validate_cliente y genera automáticamente su firma en la interfaz interna de comportamiento — por eso los parámetros del método ABAP no se inventan, ya vienen dados.

- determination ... on modify { field Estado; }: similar a la validación, pero se ejecuta ante cualquier modificación, no solo al guardar.

- mapping for ztmm_solicitud: traduce los nombres de campo del CDS a los nombres de columna reales de la tabla física.

**10.3 Clase de Excepción Custom**

```abap
CLASS zcx_mm_error_solicitud DEFINITION
  PUBLIC
  INHERITING FROM cx_static_check
  CREATE PUBLIC.

  PUBLIC SECTION.
    DATA mv_cliente TYPE kunnr.

    METHODS constructor
      IMPORTING
        iv_cliente TYPE kunnr OPTIONAL
        previous   TYPE REF TO cx_root OPTIONAL.
ENDCLASS.

CLASS zcx_mm_error_solicitud IMPLEMENTATION.
  METHOD constructor.
    super->constructor( previous = previous ).
    mv_cliente = iv_cliente.
  ENDMETHOD.
ENDCLASS.
```

- INHERITING FROM cx_static_check: obliga a manejar la excepción explícitamente (RAISING o TRY/CATCH), más seguro para errores de negocio.

- DATA mv_cliente TYPE kunnr: atributo propio para transportar información del error (qué cliente causó el problema).

- constructor: recibe el cliente que falló y opcionalmente una excepción previous, para encadenar errores.

- super-\>constructor( previous = previous ): siempre debe llamarse primero, para que el framework de excepciones arme correctamente la pila de errores.

**10.4 Clase de Implementación del Comportamiento**

```abap
CLASS zbp_i_mm_solicitud DEFINITION PUBLIC.
  PUBLIC SECTION.
    METHODS validate_cliente FOR VALIDATE ON SAVE
      IMPORTING keys FOR Solicitud~validate_cliente.

    METHODS determine_estado FOR DETERMINE ON MODIFY
      IMPORTING keys FOR Solicitud~determine_estado.
ENDCLASS.

CLASS zbp_i_mm_solicitud IMPLEMENTATION.

  METHOD validate_cliente.
    READ ENTITIES OF ZI_MM_SOLICITUD IN LOCAL MODE
      ENTITY Solicitud
      FIELDS ( Cliente )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_solicitudes).

    LOOP AT lt_solicitudes INTO DATA(ls_solicitud).
      IF ls_solicitud-Cliente IS INITIAL.
        APPEND VALUE #( %tky = ls_solicitud-%tky )
          TO failed-solicitud.

        APPEND VALUE #(
            %tky        = ls_solicitud-%tky
            %msg        = NEW zcx_mm_error_solicitud(
                              iv_cliente = ls_solicitud-Cliente )
            %element-Cliente = if_abap_behv=>mk-on
          ) TO reported-solicitud.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD determine_estado.
    MODIFY ENTITIES OF ZI_MM_SOLICITUD IN LOCAL MODE
      ENTITY Solicitud
      UPDATE FIELDS ( Estado )
      WITH VALUE #( FOR key IN keys (
             %tky   = key-%tky
             Estado = 'A'  "Activa
           ) ).
  ENDMETHOD.

ENDCLASS.
```

- METHODS validate_cliente FOR VALIDATE ON SAVE IMPORTING keys FOR Solicitud~validate_cliente: firma generada exactamente por la palabra validation del .bdef; keys trae las instancias a validar.

- READ ENTITIES OF ZI_MM_SOLICITUD ... RESULT DATA(lt_solicitudes): comando propio de RAP para leer el buffer transaccional (no un SELECT directo, porque los datos aún no están guardados en la base).

- APPEND VALUE \#( %tky = ... ) TO failed-solicitud: marca esa instancia como fallida; RAP no permitirá guardarla.

- %msg = NEW zcx_mm_error_solicitud( iv_cliente = ... ): punto de conexión con la excepción custom — en vez de una clase de mensajes genérica, se instancia la excepción propia y RAP toma su texto (get_text()) para mostrarlo en Fiori.

- %element-Cliente = if_abap_behv=\>mk-on: indica a la UI que resalte específicamente el campo Cliente en rojo, no toda la fila.

- MODIFY ENTITIES OF ZI_MM_SOLICITUD ... UPDATE FIELDS ( Estado ): equivalente RAP de un UPDATE SQL, pero sobre el buffer transaccional, usado para las determinaciones automáticas.

**10.5 Hilo Conductor del Ejemplo**

- El .bdef declara validate_cliente → RAP genera la interfaz de comportamiento con esa firma exacta.

- La clase ZBP_I_MM_SOLICITUD implementa esa interfaz (herencia de contrato, no de código).

- Dentro del método, ante un error de negocio, se instancia la excepción custom zcx_mm_error_solicitud, que a su vez hereda de cx_static_check.

- RAP toma esa excepción, extrae su mensaje, y lo muestra en Fiori Elements ligado exactamente al campo que falló.

**11. Control de Versiones del Documento**

| **Versión** | **Fecha** | **Descripción** | **Autor** |
|:---|:---|:---|:---|
| 1.0 | Agosto 2026 | Versión inicial del estándar de nomenclatura | Equipo de Desarrollo SAP - Eliot |
| 1.1 | Agosto 2026 | Se agregan secciones de paquetes, paso a paso RAP en Eclipse y recomendaciones adicionales | Equipo de Desarrollo SAP - Eliot |
| 1.2 | Agosto 2026 | Se agrega anexo técnico con ejemplo completo de objeto RAP (CDS, Behavior, excepción custom y clase de implementación) | Equipo de Desarrollo SAP - Eliot |
