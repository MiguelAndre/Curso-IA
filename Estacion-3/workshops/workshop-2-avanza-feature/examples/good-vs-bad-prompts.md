# Prompts comparados · Cómo cambiar la calidad del output

> Cinco pares de prompts sobre el mismo objetivo. El "malo" es el primer instinto.
> El "bueno" es el resultado de pensar en delegación. La diferencia entre ambos
> es lo que aprenderás a hacer naturalmente durante el resto del programa.

---

## Par 1 · Pedir un endpoint

### ❌ Prompt malo

> implementa un endpoint para crear notas de clientes

**Por qué falla:**
- No dice el método HTTP ni el path
- No menciona validación
- No habla de errores
- No establece tests
- El agente termina inventando convenciones que pueden no calzar con el proyecto

### ✅ Prompt bueno

> Usando el scope en `docs/features/customer-notes.md`, implementa el endpoint
> `POST /api/customers/:id/notes` siguiendo nuestras convenciones de `AGENTS.md`.
> Lee primero el handler de `/api/customers/:id/interactions` como referencia
> de estilo. Añade los 4 tests listados en la sección "Tests que la validan"
> del scope. Al terminar, ejecuta `npm test` y muestra los resultados.

**Por qué funciona:**
- Apunta a un artefacto de scope explícito (la hoja de feature-scope)
- Referencia un archivo existente como modelo de estilo
- Cuantifica los tests esperados
- Define cómo verificar el éxito (npm test al final)

---

## Par 2 · Pedir un refactor

### ❌ Prompt malo

> mejora el código de `src/lib/db.ts`, está horrible

**Por qué falla:**
- "Horrible" es subjetivo — el agente no sabe qué dimensión mejorar
- Sin restricciones, el agente puede reescribir el archivo desde cero
- No hay criterio de éxito ni tests de regresión
- Probable que rompa código que dependa de la firma actual

### ✅ Prompt bueno

> Refactoriza `src/lib/db.ts` con los siguientes objetivos en este orden:
> (1) extraer las queries inline a funciones nombradas en la misma carpeta;
> (2) tipar el retorno con tipos derivados de Prisma (no any).
> Restricciones: no cambies la API pública del módulo (los exports actuales
> deben mantenerse). Después de cada cambio, corre `npm run type-check`
> para verificar que no rompiste nada río arriba.

**Por qué funciona:**
- Define los objetivos del refactor en orden de prioridad
- Pone restricciones explícitas (no cambiar API pública)
- Establece el ciclo de verificación entre cambios (type-check después de cada uno)
- Limita el alcance — no se refactoriza "todo lo demás"

---

## Par 3 · Pedir tests

### ❌ Prompt malo

> escribe tests para esta función

**Por qué falla:**
- ¿Qué casos cubre?
- ¿Qué framework usa?
- ¿Mockea dependencias o las usa reales?
- ¿Tests en el mismo archivo o en una carpeta tests/?
- Las decisiones implícitas son el origen de la inconsistencia entre archivos

### ✅ Prompt bueno

> Escribe tests con Vitest para `calculateDiscount()` en `src/lib/pricing.ts`.
> Cubre al menos: (1) descuento estándar; (2) cupón expirado; (3) cupón
> aplicado dos veces; (4) total que queda en cero o negativo (edge case).
> Naming: "should [comportamiento] when [condición]" en inglés.
> Usa dependencias reales (no mocks) salvo para `getCurrentDate()` que sí
> debe mockearse para tests determinísticos. Ubica los tests en
> `tests/lib/pricing.test.ts`.

**Por qué funciona:**
- Lista exactamente los casos de prueba a cubrir
- Especifica el framework y la convención de naming
- Distingue cuándo usar dependencias reales vs mocks
- Define la ruta exacta del archivo

---

## Par 4 · Delegar a un subagente

### ❌ Prompt malo

> usa un subagente para hacer esto más rápido

**Por qué falla:**
- No dice qué subagente usar
- No especifica si tiene acceso a herramientas o no
- "Más rápido" sugiere paralelismo pero no aclara qué se puede hacer en paralelo
- El agente principal puede ignorar la sugerencia y hacerlo todo él mismo

### ✅ Prompt bueno

> Para la búsqueda inicial de archivos relacionados con autenticación,
> usa el subagente `Explore` (modelo Haiku, solo lectura). Que devuelva
> la lista de archivos relevantes con una línea de descripción de cada
> uno. Luego, con esa información en contexto, planificamos los cambios
> entre tú y yo antes de implementar.

**Por qué funciona:**
- Especifica exactamente qué subagente y qué modelo
- Acota la tarea del subagente (búsqueda con descripción, no implementación)
- Define el flujo posterior: el agente principal coordina con el usuario después
- Aprovecha el modelo barato (Haiku) para lectura masiva

---

## Par 5 · Sesiones paralelas en Antigravity

### ❌ Prompt malo

> mientras haces esto, en paralelo puedes hacer la UI también

**Por qué falla:**
- Confunde subagentes (mismo proceso) con sesiones paralelas (procesos distintos)
- No deja claro cuál herramienta usar para qué
- El agente probablemente intentará hacer "paralelismo" linealmente en su contexto

### ✅ Prompt bueno

> Voy a abrir en paralelo una segunda sesión en Antigravity sobre el
> mismo repo para que avance la UI (`src/app/customers/[id]/notes/page.tsx`).
> Tú aquí (Claude Code local) concéntrate solo en el backend del endpoint.
> Cuando termines, no asumas nada del frontend — yo voy a integrar al final.
> La idea es que las dos ramas no se choquen.

**Por qué funciona:**
- Reconoce que las sesiones paralelas son procesos distintos (no concurrencia interna)
- Asigna scope explícito a cada sesión (backend aquí · frontend allá)
- Acota lo que cada agente debe asumir o no asumir del otro
- El usuario se encarga de la integración (la pieza humana del flujo)

---

## El patrón mental detrás de los prompts buenos

Si miras los 5 ejemplos en conjunto, los buenos comparten 4 cosas:

1. **Apuntan a un artefacto** (scope, archivo de referencia, sección de AGENTS.md)
2. **Restringen el alcance** (qué SÍ tocar, qué NO tocar)
3. **Definen criterio de éxito verificable** (un comando que pasa, una lista de tests)
4. **Especifican la herramienta de delegación apropiada** (subagente, modelo, sesión paralela)

Los malos hacen lo opuesto: apelan a la "buena intuición" del agente. La buena intuición no existe — existe el buen contexto.
