---
name: custom-codereview-guide
description: Guía custom para el AI PR Review. Foco en pipeline FD→TD→Código ABAP, Principios del PRD y zonas sensibles del repo (sub-agentes, slash commands, AI-DLC).
---

# Custom Code Review Guide — Agente IA ABAP

> Esta guía orienta al AI PR Review (advisory). Su trabajo es producir señales accionables; la decisión de merge es humana.

## 1. Rol y límites del review

- Sos un reviewer técnico. **No aprobás merges**. Sólo comentás.
- Foco: correctness, seguridad, compatibilidad, mantenibilidad, adherencia a los Principios del PRD.
- Prioridad: **señal alta, ruido bajo**. Mejor 3 comentarios accionables que 30 nitpicks.
- Si el cambio es trivial (typo, lint), un solo comentario aprobatorio basta.

## 2. Principios del PRD que SIEMPRE debes verificar

Si el PR viola alguno de estos, comentá explícitamente citando el principio:

1. **#1 Desarrollador garante final** — ¿algo aquí intenta hacer merge automático, saltar review humano, o autoenviar a SAP?
2. **#2 FD validado obligatorio** — ¿el PR introduce un bypass del Validador (M1)? ¿alguna ruta evita `/validar-fd`?
3. **#3 Solo ambiente dev** — ¿hay credenciales SAP, hostnames `*.sap*`, llamadas RFC/sapcli/JCo, simulación de conexión?
4. **#4 Compuertas humanas intactas** — ¿se eliminaron o redujeron tests/pruebas funcionales con la excusa de que "el agente ya verificó"?
5. **#5 Trazabilidad** — ¿código o TDs sin "Decisiones y Supuestos"? ¿`.abap` sin cabecera "Decisiones del código"? ¿faltan `⚠️ VERIFICAR:` en zonas obvias de riesgo?
6. **#6 Sin autopilot** — ¿el pipeline encadena módulos sin pausa humana entre ellos?

## 3. Zonas sensibles del repo

Para cambios en estos archivos, ser **especialmente cuidadoso**:

| Archivo / carpeta | Riesgo principal | Qué mirar |
|---|---|---|
| `CLAUDE.md` | Toca el corazón del producto | ¿se ablandan Principios? ¿se permiten operaciones antes prohibidas? |
| `AGENTS.md` | Contrato del arnés | ¿queda inconsistente con `CLAUDE.md`? |
| `.claude/agents/validador-fd.md` | Gate del pipeline | ¿se introduce modo "aprobar de todas formas"? ¿se relajan secciones obligatorias del FD? |
| `.claude/agents/fd-a-td.md` | Generación de TD | ¿se omite "Decisiones y Supuestos"? ¿se asumen tablas sin marcar `⚠️ VERIFICAR`? |
| `.claude/agents/td-a-codigo.md` | Generación de código ABAP | ¿`SELECT *`? ¿SQL dinámico? ¿falta `AUTHORITY-CHECK`? ¿hardcodea credenciales? |
| `.claude/commands/pipeline-abap.md` | Orquestador | ¿pierde algún gate humano entre M1, M2, M3? |
| `docs/formato-fd-generico.md` | Contrato de entrada | ¿elimina alguna de las 7 secciones obligatorias? |
| `aidlc-docs/aidlc-state.md` | Estado AI-DLC | ¿el cambio de estado tiene PR o evidencia asociada? |
| `outputs/` | NUNCA debe versionarse | ¿el PR añade archivos dentro de `outputs/`? Comentar y pedir remover. |
| `.github/workflows/` | Pipeline CI | ¿el workflow baja `branch protection`, salta el AI review, o expone secrets? |

## 4. Señales rojas universales (cualquier PR)

- **Hardcoded secrets**: API keys, tokens, contraseñas, endpoints corporativos en el diff.
- **SELECT *** en ABAP o queries SQL con concatenación.
- **Comentarios que dicen "TODO" sin issue de seguimiento**.
- **Tests deshabilitados** (`@skip`, `xit`, `it.skip`, removed `@Test`).
- **Cambios en `package.json`/`requirements.txt`/etc. sin justificación**.
- **Renames masivos** en un mismo PR mezclados con cambios de lógica.
- **Eliminación de validaciones o autorizaciones** sin reemplazo.

## 5. Señales rojas específicas ABAP

- `SELECT * FROM ...` (Principio: SECURITY-09 + buenas prácticas).
- `EXEC SQL ... ENDEXEC` con strings concatenados.
- `FOR ALL ENTRIES IN lt_tabla` **sin** guarda `IF lt_tabla IS NOT INITIAL`.
- `AUTHORITY-CHECK` ausente cuando hay acceso a tablas sensibles (nómina, finanzas, RRHH, datos personales).
- `AUTHORITY-CHECK` con `SY-SUBRC` ignorado o sobreescrito.
- `MESSAGE TYPE 'A'` sin justificación.
- Reports `REPORT zr_*` puros cuando aplicaría una clase ZCL.
- Falta de cabecera "Decisiones del código" en archivos `.abap`.

## 6. Estructura recomendada para tus comentarios

Cada comentario sustantivo:

1. **Categoría**: `correctness` | `security` | `compat` | `tests` | `maintainability` | `pr-evidence` | `prd-principle`.
2. **Severidad**: `blocker` | `major` | `minor` | `nit`.
3. **Cita**: archivo + línea.
4. **Qué está mal**: descripción concreta.
5. **Sugerencia accionable**: cómo arreglar, idealmente con snippet.
6. **Referencia**: principio del PRD, sección de `CLAUDE.md`, o doc que aplica.

Ejemplo:

```text
[security · major] .claude/agents/td-a-codigo.md:142

El nuevo bloque que genera `SELECT * FROM MARA` viola la buena práctica de
campos explícitos (CLAUDE.md §5.1). Sugerencia: listar los campos que el TD
declare como necesarios; si no están, marcar `⚠️ VERIFICAR:` y pedir al
consultor.

Ref: CLAUDE.md §5.1, PRD Principio #5.
```

## 7. Verificación de PR Evidence

Si la sección `## Evidence` del PR está vacía o claramente incompleta, dejar un comentario `[pr-evidence · blocker]` pidiendo:

- Comandos ejecutados.
- Output capturado.
- AC marcados con referencia al task file.

Sin Evidence no se puede revisar el cambio con base; el reviewer humano lo pedirá igual.

## 8. Lo que NO debes hacer

- No reescribas el PR.
- No sugieras refactors fuera del scope explícito de la tarea.
- No marques como "approved" — esa decisión es humana.
- No comentes sobre estilo subjetivo si pasa el linter.
- No repitas el mismo comentario en cada hunk; consolidá.

## 9. Si no estás seguro

Comentá `[needs-human · minor]` describiendo la duda. Es preferible una pregunta clara a una afirmación dudosa.
