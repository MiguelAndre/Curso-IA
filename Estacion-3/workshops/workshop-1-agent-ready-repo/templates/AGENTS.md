# {{NOMBRE_DEL_PRODUCTO}}

> Archivo de contexto cross-tool para cualquier coding agent (Claude Code, Cursor, Windsurf, Copilot, Devin, OpenCode).
> Si una herramienta también lee `CLAUDE.md` o `.cursorrules`, esos archivos apuntan aquí como source of truth.

---

## 1. Contexto del negocio

**¿Qué hace este producto?**
{{Describe en 2-3 líneas qué hace tu producto. Habla del problema que resuelve, no de la tecnología.
Ejemplo: "Plataforma SaaS de gestión de relación con clientes para equipos comerciales B2B
que cobra por usuario activo. Reemplaza hojas de Excel + emails con un flujo unificado."}}

**¿Quién es el usuario?**
{{Describe el perfil del usuario primario. Ejemplo: "Account Executives en empresas de 10-200 personas,
con responsabilidad sobre ~50-200 cuentas activas. Usan el producto entre 4 y 8 horas al día."}}

**¿Cuál es el estado actual?**
{{Una línea con el momento del producto. Ejemplo: "MVP en construcción, sin usuarios reales todavía,
objetivo: deploy a producción al cierre del programa 30X."}}

---

## 2. Arquitectura

**Stack tecnológico:**
- Lenguaje principal: {{ej. TypeScript 5 estricto}}
- Framework: {{ej. Next.js 16 App Router con Server Components}}
- Base de datos: {{ej. PostgreSQL 16 (Neon DB) + Prisma 6 ORM}}
- Frontend: {{ej. React 19 + Tailwind 4 + shadcn/ui}}
- Testing: {{ej. Vitest para unitarios, Playwright para E2E (próximamente)}}
- Deploy: {{ej. Vercel para Next.js, Neon para DB}}

**Estructura de carpetas:**
```
src/
├── app/              ← {{rutas Next.js, una carpeta por sección}}
├── components/       ← {{componentes React reutilizables}}
├── lib/              ← {{utilidades compartidas, clientes de BD}}
└── ...               ← {{describe cada carpeta clave de tu proyecto}}

prisma/
└── schema.prisma     ← {{esquema de la BD}}
```

**Decisiones de diseño no obvias:**
- {{Cualquier decisión arquitectónica que requiera contexto. Ejemplos:
  - "Usamos Server Components por defecto; 'use client' solo cuando se necesita estado o eventos del navegador"
  - "Las mutaciones van por Server Actions, no por API routes"
  - "El módulo de pagos NO escribe directo a la BD — todo pasa por la cola de eventos de Stripe"}}

---

## 3. Convenciones

**Estilo de código:**
- {{ej. Prettier con configuración default, sin punto y coma}}
- {{ej. ESLint con preset Next.js + reglas custom en .eslintrc}}

**Nombrado:**
- Variables y funciones: {{ej. camelCase}}
- Componentes React: {{ej. PascalCase, archivo y nombre coinciden}}
- Archivos de utilidades: {{ej. kebab-case}}
- Constantes globales: {{ej. SCREAMING_SNAKE_CASE}}

**Commits:**
- Formato: {{ej. Conventional Commits — feat:, fix:, docs:, refactor:, test:}}
- Tamaño: {{ej. un commit = una intención lógica, máximo ~10 archivos modificados}}

**Tests:**
- Cada función de dominio: {{ej. al menos 1 happy path + 1 caso de error}}
- Naming de tests: {{ej. "should [comportamiento esperado] when [condición]"}}
- Cobertura objetivo: {{ej. >70% en módulos de lógica, >40% en componentes UI}}

---

## 4. Flujo de trabajo con el agente

**Lo que QUIERO que el agente haga automáticamente:**
- {{ej. Después de cada edición, ejecutar `npm run lint:fix`}}
- {{ej. Antes de un cambio que toque varios archivos, mostrar un plan}}
- {{ej. Usar `pnpm` en vez de `npm` para todos los comandos}}

**Lo que SIEMPRE necesita mi confirmación:**
- {{ej. Cambios al esquema de Prisma}}
- {{ej. Modificaciones a `.github/workflows/`}}
- {{ej. Eliminación de archivos}}
- {{ej. Cualquier comando que contenga `rm`, `force`, o `--no-verify`}}

**Lo que NO debe hacer:**
- {{ej. Crear nuevos archivos en la raíz del proyecto sin avisar}}
- {{ej. Instalar nuevas dependencias sin justificación}}
- {{ej. Hacer commits automáticos — todos los cambios se quedan staged}}
- {{ej. Modificar el orden de migraciones existentes en Prisma}}

---

## 5. Restricciones

**Archivos protegidos (nunca leer ni editar):**
- `.env`, `.env.local`, `.env.production` — credenciales
- `secrets/` — cualquier cosa en esta carpeta
- {{añade los tuyos}}

**Rutas que requieren máxima cautela:**
- `prisma/migrations/` — el orden importa, no reordenar
- {{añade las tuyas}}

**Patrones a evitar:**
- No introducir `any` en TypeScript salvo justificación documentada en el código
- No agregar `useEffect` para data fetching — preferir Server Components o React Query
- No usar imports relativos profundos (`../../../`) — preferir paths absolutos (`@/components/...`)
- {{añade los tuyos}}

**Decisiones ya tomadas que no debemos reabrir:**
- {{ej. "Usamos Prisma, no Drizzle. La decisión se evaluó en la Clase 3 y se mantiene."}}
- {{ej. "Tailwind 4, no styled-components. Stack monolítico por razones de deploy."}}

---

*Última actualización: {{YYYY-MM-DD}} · Mantenido por: {{tu nombre o equipo}}*
