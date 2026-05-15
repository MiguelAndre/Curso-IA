# Scope · {{NOMBRE_DE_LA_FEATURE}}

> Hoja de scope antes de delegar al agente. Llenarla toma 5-7 minutos
> y evita que el resto del workshop se gaste en re-negociar el alcance.

---

## 1. ¿Qué es la feature? (1 oración)

{{Describe la feature en una sola oración. Sin "y", sin "también".
Si necesitas dos oraciones, probablemente es más de una feature y deberías partirla.

Ejemplo bueno: "Endpoint POST /api/customers/:id/notes para añadir una nota
al historial de un cliente."

Ejemplo malo: "Sistema de notas con CRUD completo, historial cronológico,
edición inline y permisos por rol."}}

---

## 2. Input esperado

{{Describe qué recibe la feature.

Para un endpoint REST: método HTTP, path, body (con tipo), headers relevantes
Para un componente UI: props, eventos que recibe
Para una función: parámetros con su tipo

Ejemplo: "POST /api/customers/:id/notes
- params: id (UUID, customerId)
- body: { content: string, isInternal: boolean }
- headers: Authorization (Bearer JWT)"}}

---

## 3. Output esperado

{{Describe qué produce la feature.

Para un endpoint: status codes, body de respuesta, side effects (BD, eventos)
Para un componente: qué renderiza, qué eventos emite
Para una función: valor de retorno, excepciones posibles

Ejemplo: "201 Created con body { id, customerId, content, createdAt, createdBy }
en éxito · 404 si el customer no existe · 400 si content está vacío o
supera 5000 chars · evento NoteCreated en la cola de auditoría."}}

---

## 4. Criterios de aceptación

{{Lista los criterios verificables que definen 'feature terminada'.
Usa formato '- [ ] item' para que sea checkbox-friendly.

Mínimo 3 criterios, máximo 6. Si tienes más, probablemente la feature
es demasiado grande para un workshop.

Ejemplo:
- [ ] Un usuario autenticado puede crear una nota para cualquier customer al que tenga acceso
- [ ] Las notas marcadas como 'isInternal' solo son visibles para usuarios con rol manager o superior
- [ ] El endpoint rechaza notas con content vacío o > 5000 chars con 400 y mensaje descriptivo
- [ ] Cada nota creada dispara un evento NoteCreated en la cola}}

---

## 5. Tests que la validan

{{Lista los tests que vas a escribir (o que el agente va a escribir) para esta feature.
Mínimo 1 happy path + 1 caso de error + 1 edge case.

Ejemplo:
- Happy path: usuario autenticado crea nota válida → 201 + nota en BD + evento publicado
- Error: usuario no autenticado intenta crear nota → 401 sin tocar la BD
- Edge: content tiene exactamente 5000 chars → 201 (es el límite válido)
- Edge: content tiene 5001 chars → 400 con mensaje 'Content exceeds maximum length'}}

---

## 6. Scope-out (importante)

{{Lista explícitamente qué NO incluye esta feature. Esto es la mitad del valor
de la hoja de scope — evita que el agente "ayude" extendiendo la feature.

Ejemplo:
- ❌ Editar notas existentes (es otra feature, otro endpoint)
- ❌ Eliminar notas (es otra feature)
- ❌ Listar notas de un customer (es otro endpoint GET)
- ❌ Validación de menciones @username dentro del content (futuro)
- ❌ Notificaciones push al manager cuando hay nota nueva (futuro, depende de la cola)}}

---

## 7. Estimación

**Tiempo esperado de implementación (sin tests):** {{ej. 20-25 min con agente}}
**Riesgo principal:** {{ej. "El agente puede asumir un schema de BD diferente al actual. Mitigación: leer prisma/schema.prisma antes de delegar."}}

---

*Llena este archivo antes de ejecutar el Bloque 2 del workshop. Si te toma más de 10 min, recorta el alcance.*
