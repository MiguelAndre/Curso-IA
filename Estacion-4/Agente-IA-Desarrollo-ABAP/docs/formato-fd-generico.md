# Formato Genérico de Documento Funcional (FD) — ABAP

**Propósito**: contrato de entrada del pipeline FD → TD → Código. El Módulo 1 (Validador) usa este formato como referencia para aprobar o rechazar un FD.

**Decisión origen**: cuestionario inicial Q5:C — la empresa usará un formato genérico hasta aportar el suyo propio.

---

## Cómo usar este formato

1. **Consultor funcional**: copia la plantilla de la sección §3 y completa cada sección con la información del requerimiento.
2. **Desarrollador**: ejecuta `/validar-fd <ruta-al-fd>` antes de invocar el pipeline. Si el validador rechaza, devuelve los gaps al consultor.
3. **Validador (M1)**: usa las secciones §2 (Criterios de validación) para emitir veredicto.

---

## 1. Secciones obligatorias

Un FD se considera **estructuralmente completo** sólo si tiene las 7 secciones siguientes.

| # | Sección | Propósito |
|---|---|---|
| 1 | **Objetivo** | Qué resultado de negocio se busca |
| 2 | **Alcance** | Qué entra, qué no entra en este requerimiento |
| 3 | **Reglas de Negocio** | Lógica que el código debe implementar |
| 4 | **Tablas SAP involucradas** | Qué tablas/estructuras del modelo de datos toca |
| 5 | **Criterios de Aceptación** | Cómo se verifica que el entregable resuelve el objetivo |
| 6 | **Casos Borde** | Escenarios excepcionales o de error explícitos |
| 7 | **Autorizaciones** | Qué objetos de autorización se requieren para acceder a los datos |

---

## 2. Criterios de validación (qué evalúa el Módulo 1)

### 2.1 Completitud estructural
- Todas las 7 secciones están presentes.
- Cada sección tiene al menos un párrafo o lista; no está vacía con `<TBD>` o similar.

### 2.2 Calidad semántica
- **Objetivo**: usa verbos accionables y resultados medibles. ❌ "Mejorar el reporte". ✅ "Permitir al área de Compras consultar materiales por proveedor con filtros por rango de fechas y estado".
- **Alcance**: incluye **exclusiones explícitas**. ❌ "Reporte de materiales". ✅ "Incluye: materiales activos del módulo MM. Excluye: materiales bloqueados, materiales en estado de archivo".
- **Reglas de Negocio**: numeradas o en bullets, cada una con condición y acción. ❌ "Validar fechas". ✅ "RN1: si la fecha desde es posterior a la fecha hasta, mostrar mensaje de error y no ejecutar el reporte. RN2: si no se especifica fecha, usar últimos 30 días."
- **Tablas SAP**: nombres SAP explícitos. ❌ "Tabla de materiales". ✅ "MARA (datos generales del material), MARC (datos del centro), LFM1 (vista de compras del proveedor)".
- **Criterios de Aceptación**: verificables. ❌ "Que funcione bien". ✅ "CA1: el reporte muestra al menos los campos: material, descripción, proveedor, fecha último pedido. CA2: la ejecución para 1000 materiales completa en < 30 s."
- **Casos Borde**: explícitos, no asumidos. ❌ "Manejar errores". ✅ "CB1: si no hay datos, mostrar mensaje 'Sin resultados' y permitir cambiar filtros. CB2: si el usuario no tiene autorización para un centro, omitir esos materiales sin error."
- **Autorizaciones**: roles o objetos de autorización por nombre. ❌ "El que tenga acceso". ✅ "Requiere objeto S_TABU_DIS para tablas MARA/MARC con actividad 03 (display). El usuario debe pertenecer al rol Z_COMPRAS_USUARIO."

---

## 3. Plantilla copyable

> Copia desde la línea siguiente hasta el final del bloque y úsala como esqueleto para un FD nuevo.

```markdown
# FD — <Nombre corto del requerimiento>

**Identificador**: <REQ-AAAA-NNN>
**Solicitante**: <Área de negocio>
**Consultor funcional**: <Nombre>
**Fecha de elaboración**: <YYYY-MM-DD>
**Prioridad**: <Alta / Media / Baja>

---

## 1. Objetivo

<Qué resultado de negocio se busca. Usa verbos accionables (consultar, registrar, validar, calcular, generar). Indica el área usuaria y el beneficio esperado.>

---

## 2. Alcance

### 2.1 Dentro del alcance
- <Funcionalidad concreta 1>
- <Funcionalidad concreta 2>
- ...

### 2.2 Fuera del alcance
- <Lo que explícitamente NO se va a construir>
- ...

---

## 3. Reglas de Negocio

> Cada regla tiene formato `RN<n>: <condición> → <acción>`.

- **RN1**: <regla>
- **RN2**: <regla>
- ...

---

## 4. Tablas SAP involucradas

| Tabla | Propósito | Campos clave usados |
|---|---|---|
| <MARA> | <Datos generales del material> | <MATNR, MTART, MEINS, ...> |
| <MARC> | <Datos del centro> | <MATNR, WERKS, ...> |
| ... | ... | ... |

> Si conoces módulos de función o BAdIs aplicables, agrégalos al final.

---

## 5. Criterios de Aceptación

> Cada criterio debe ser verificable.

- **CA1**: <criterio verificable, p. ej. "El reporte muestra al menos los campos X, Y, Z">
- **CA2**: <criterio verificable, p. ej. "La ejecución para N registros completa en < T segundos">
- ...

---

## 6. Casos Borde

> Escenarios excepcionales o de error explícitos.

- **CB1**: <qué pasa si no hay datos>
- **CB2**: <qué pasa si el usuario no tiene autorización para un subconjunto>
- **CB3**: <qué pasa con valores nulos / vacíos / fuera de rango>
- ...

---

## 7. Autorizaciones

- **Objeto de autorización requerido**: <nombre, actividad, valores>
- **Rol asignado**: <Z_*, valor esperado>
- **Datos sensibles involucrados**: <Sí/No; si Sí, especificar protección requerida>

---

## 8. Información adicional (opcional)

- **Referencia funcional**: <documentos del área de negocio, transacciones SAP relacionadas>
- **Dependencias técnicas**: <otros objetos Z que el código debe consumir o coexistir con>
- **Notas del consultor**: <cualquier contexto relevante que no encaje arriba>
```

---

## 4. Ejemplos de descripciones aceptables vs ambiguas

### 4.1 Objetivo

| ❌ Ambiguo | ✅ Aceptable |
|---|---|
| Reporte de ventas | Permitir al área Comercial consultar las ventas del mes por sucursal, con totalizadores por canal de venta y exportación a Excel. |
| Mejorar el flujo de aprobación | Reducir de 3 a 1 los pasos manuales en la aprobación de pedidos > $10M, agregando una validación automática contra el cupo del cliente en KNKK. |

### 4.2 Reglas de Negocio

| ❌ Ambigua | ✅ Aceptable |
|---|---|
| Validar el cliente | RN1: si el cliente está bloqueado (KNA1-AUFSD ≠ vacío), mostrar error "Cliente bloqueado para ventas" y abortar el procesamiento. |
| Calcular el descuento | RN2: si el cliente pertenece al grupo de descuentos KNVV-KDGRP en ('A1','A2'), aplicar 5% sobre el total. Si pertenece a ('B1','B2'), aplicar 3%. En otros casos, 0%. |

### 4.3 Tablas SAP

| ❌ Ambigua | ✅ Aceptable |
|---|---|
| Tabla de clientes | KNA1 (datos maestros generales del cliente), KNB1 (datos de sociedad), KNVV (datos de área de ventas) |

### 4.4 Casos Borde

| ❌ Ambiguo | ✅ Aceptable |
|---|---|
| Manejar errores | CB1: si el módulo de función BAPI_SALESORDER_CREATEFROMDAT2 retorna error tipo 'E', revertir cualquier dato parcial creado y registrar el error en BAL con clave ZSD_PEDIDOS. |

---

## 5. Cosas que el Validador SIEMPRE va a rechazar

- Secciones presentes pero vacías o con `<TBD>` literal.
- Verbos vagos sin objeto: "mejorar", "optimizar", "automatizar" sin decir qué.
- Tablas mencionadas sin nombre técnico SAP ("la tabla de pedidos" en vez de "VBAK").
- Criterios de aceptación no verificables ("que funcione bien", "que sea rápido" sin umbral).
- Casos borde implícitos ("manejar errores" sin enumerar cuáles).
- Autorizaciones omitidas o con "el que tenga acceso".

---

## 6. Evolución de este documento

Este formato es **genérico y baseline**. Cuando la empresa formalice su plantilla de FD (decisión Q5:C del cuestionario inicial), este documento se reemplaza o se ajusta — el Módulo 1 lo recarga automáticamente porque siempre referencia esta ruta.
