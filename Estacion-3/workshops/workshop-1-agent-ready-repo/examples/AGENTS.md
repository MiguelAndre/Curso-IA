# Basic CRM 30X

> Archivo de contexto cross-tool para cualquier coding agent (Claude Code, Cursor, Windsurf, Copilot, Devin, OpenCode).
> Si una herramienta también lee `CLAUDE.md` o `.cursorrules`, esos archivos apuntan aquí como source of truth.

---

## 1. Contexto del negocio

**¿Qué hace este producto?**
CRM ligero para Account Executives en empresas B2B de tamaño medio (10-200 personas). Gestiona clientes, interacciones (emails, llamadas, reuniones, notas) y muestra un dashboard con KPIs de actividad y conversión. Reemplaza el flujo típico de "Excel + Gmail + cabeza" por una única superficie unificada.

**¿Quién es el usuario?**
Account Executive con ~50-200 cuentas activas, conectado al producto entre 4 y 8 horas al día. Edad estimada 28-45 años, alta tolerancia a herramientas técnicas (Notion, Slack, Linear). Le importa que el producto sea rápido y que no le obligue a hacer doble entrada de información.

**¿Cuál es el estado actual?**
MVP en construcción dentro del programa Hardcore AI 30X. Sin usuarios reales todavía. Objetivo: deploy a Vercel + Neon al cierre del programa y prueba con 5-10 AEs de empresas del network del equipo.

---

## 2. Arquitectura

**Stack tecnológico:**
- Lenguaje principal: TypeScript 5 estricto (`"strict": true` en tsconfig)
- Framework: Next.js 16 App Router con Server Components por defecto
- Base de datos: PostgreSQL 16 (Neon DB) + Prisma 6 ORM
- Frontend: React 19 + Tailwind CSS 4 + componentes de shadcn/ui
- Testing: Vitest para unitarios (próximamente Playwright para E2E)
- Deploy: Vercel para Next.js, Neon para DB, GitHub Actions para CI

**Estructura de carpetas:**
```
src/
├── app/              ← Rutas Next.js (App Router), una carpeta por sección
│   ├── (auth)/       ← Login y register, layout aislado
│   ├── dashboard/    ← KPIs del usuario
│   ├── customers/    ← Listado y detalle de clientes
│   ├── interactions/ ← CRUD de interacciones
│   └── api/          ← API routes (REST endpoints)
├── components/       ← Componentes React reutilizables (PascalCase)
│   └── ui/           ← Componentes shadcn/ui generados
├── lib/              ← Utilidades compartidas
│   ├── db.ts         ← Cliente Prisma singleton
│   ├── auth.ts       ← Helpers de autenticación
│   └── validators/   ← Esquemas Zod para validación de input
└── types/            ← Tipos compartidos no derivados de Prisma

prisma/
├── schema.prisma     ← Esquema de la BD (single source of truth)
└── migrations/       ← Migraciones generadas, no editar manualmente
```

**Decisiones de diseño no obvias:**
- **Server Components por defecto:** todo componente es Server Component a menos que tenga interactividad. Se usa `"use client"` solo cuando hay estado, eventos o hooks del navegador.
- **Mutaciones por Server Actions:** los formularios usan Server Actions, no API routes. Las API routes en `/api/*` son solo para integraciones externas (webhooks de Stripe, ingestion de eventos).
- **Validación en el límite:** todo input externo (formularios, API requests) se valida con Zod antes de llegar a la lógica de negocio. Tipos derivados de Zod, no escritos a mano.
- **El módulo de pagos NO escribe directo a la BD:** todo evento de Stripe entra por webhook → cola en Inngest → handler que escribe a la BD. Esto desacopla y permite reintentos.

---

## 3. Convenciones

**Estilo de código:**
- Prettier con configuración default (ancho 80, single quotes, sin punto y coma)
- ESLint con preset `next/core-web-vitals` + reglas custom en `.eslintrc.json`
- Pre-commit hook con lint-staged: lint + format solo sobre archivos modificados

**Nombrado:**
- Variables y funciones: `camelCase` (`getUserById`, no `get_user_by_id`)
- Componentes React: `PascalCase`, archivo y nombre del componente coinciden (`CustomerTable.tsx` exporta `CustomerTable`)
- Archivos de utilidades: `kebab-case` (`format-currency.ts`)
- Constantes globales: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`, `DEFAULT_PAGE_SIZE`)
- Tipos derivados de Prisma: prefijo `Db` (`type DbCustomer = Prisma.CustomerGetPayload<...>`)

**Commits:**
- Formato: Conventional Commits — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Idioma: español, primera línea < 70 chars
- Tamaño: un commit = una intención lógica. Si el diff toca más de 10 archivos, probablemente debería partirse.

**Tests:**
- Framework: Vitest + Testing Library
- Cada función de dominio: al menos 1 happy path + 1 caso de error + 1 edge case
- Naming: `"should [comportamiento esperado] when [condición]"` en inglés (porque Vitest reporters lo leen mejor)
- Cobertura objetivo: >70% en `src/lib/`, >40% en `src/components/`
- Mocks: usar `vi.mock()` solo cuando la dependencia es lenta o no determinista (DB real, red, fechas). El resto, dependencias reales.

---

## 4. Flujo de trabajo con el agente

**Lo que QUIERO que el agente haga automáticamente:**
- Después de cada `Edit` o `Write`, ejecutar `npm run lint:fix` sobre el archivo afectado (configurado vía hook)
- Si un cambio toca más de 3 archivos, mostrar un plan en un único mensaje antes de aplicar
- Usar `pnpm` en vez de `npm` para todos los comandos (es el package manager del proyecto)
- Para tareas de lectura masiva o exploración, delegar al subagente `Explore` (Haiku) para ahorrar tokens

**Lo que SIEMPRE necesita mi confirmación:**
- Cambios a `prisma/schema.prisma` (las migraciones afectan datos reales)
- Modificaciones a `.github/workflows/` (afectan CI/CD)
- Eliminación de archivos (incluso si parecen no usados)
- Cualquier comando que contenga `rm`, `force`, `--no-verify`, o que afecte producción

**Lo que NO debe hacer:**
- Crear nuevos archivos en la raíz del proyecto (todo debe ir bajo `src/`, `prisma/`, `tests/`, `public/`, o `docs/`)
- Instalar nuevas dependencias sin justificación documentada (penalty de bundle size)
- Hacer commits automáticamente — todos los cambios se quedan staged
- Modificar el orden de migraciones existentes en `prisma/migrations/`
- Introducir `any` en TypeScript sin un comentario `// @ts-expect-error` con explicación

---

## 5. Restricciones

**Archivos protegidos (nunca leer ni editar):**
- `.env`, `.env.local`, `.env.production` — credenciales y secrets
- `secrets/` — claves de servicios externos
- `prisma/migrations/*/migration.sql` — generadas automáticamente, no editar a mano

**Rutas que requieren máxima cautela:**
- `prisma/migrations/` — el orden importa, no reordenar ni borrar migraciones
- `src/app/api/webhooks/` — recibe eventos de Stripe, cambios afectan reconciliación de pagos
- `src/lib/auth.ts` — autenticación crítica, cambios requieren revisión de seguridad

**Patrones a evitar:**
- No introducir `any` en TypeScript salvo justificación documentada (`// @ts-expect-error <razón>`)
- No agregar `useEffect` para data fetching — preferir Server Components o React Query
- No usar imports relativos profundos (`../../../`) — preferir paths absolutos (`@/components/...`)
- No introducir nuevas librerías de UI (ya usamos shadcn/ui + Tailwind, no agregar Chakra ni MUI)
- No usar `JSON.parse(JSON.stringify(...))` para clonado — usar `structuredClone()` o el método específico de la librería

**Decisiones ya tomadas que no debemos reabrir:**
- **Prisma, no Drizzle.** Evaluada en Clase 3 — Prisma tiene mejor DX para el equipo aunque sea más lento en producción.
- **Tailwind 4, no styled-components.** Decisión por consistencia con shadcn/ui y deploy simplificado en Vercel.
- **Server Actions, no tRPC.** Mantenemos el stack monolítico en Next.js sin agregar capas adicionales.
- **Neon, no Supabase.** Decisión por simplicidad — solo necesitamos PostgreSQL, no auth ni storage de Supabase.

---

*Última actualización: 2026-05-14 · Mantenido por: Carlos Alarcón*
