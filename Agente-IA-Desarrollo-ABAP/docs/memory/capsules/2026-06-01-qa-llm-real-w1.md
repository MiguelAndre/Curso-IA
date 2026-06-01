---
issueId: qa-llm-real-w1
linearId: null
title: Suite Persona+Juez ejecutada contra LLM real con wrapper CLI (W1)
planningWave: qa-llm-real
closedAt: 2026-06-01
pr: null  # commit directo a main
commits:
  - TBD  # se llena en el commit final
areas:
  - qa
  - persona-juez
  - claude-code-cli
  - llm-as-judge
---

## Decisión validada

1. **Reemplazar el SDK `@anthropic-ai/sdk` por la CLI `claude -p` como motor de LLM**
   en toda la suite Persona+Juez. Antes la suite requería `ANTHROPIC_API_KEY` que
   factura por token (~$5 USD/corrida estimados). Ahora invoca la CLI vía
   `child_process.spawn`, que hereda la sesión OAuth/keychain de la suscripción
   Claude Pro/Max/Enterprise. **Costo: $0 USD adicionales**.

2. **Diseño del wrapper (`tests/agents/claude-cli.ts`)**:
   - `spawn` en lugar de `execFile`: `execFile` con `input:` tiene race condition —
     la CLI revisa stdin a los ~3 s y abandona si no recibió datos. `spawn` da
     control directo de stdin via `proc.stdin.write(...); proc.stdin.end()`.
   - **System prompt vía archivo temporal** (`--system-prompt-file <path>`): los
     prompts de Juez son ~10 k tokens (rúbrica + sub-agente). Pasarlos como
     argumento de CLI rompe el límite de ~32 k caracteres de argumentos en Windows.
     Archivo temporal en `os.tmpdir()` + cleanup en `finally`.
   - **User message vía stdin**: misma razón. Además mantiene el patrón "system
     estable, user dinámico" que favorece cache reuse.
   - `--tools ""` para desactivar tool use (sólo queremos generación).
   - `--no-session-persistence` para no ensuciar `~/.claude/projects/...`.
   - `--output-format json` para parseo determinista.
   - **NO `--bare`**: ese flag desactiva OAuth/keychain reads y exige
     `ANTHROPIC_API_KEY`. Justo lo que queremos evitar.

3. **`CLAUDE_CODE_GIT_BASH_PATH` debe apuntar a Git for Windows bash.exe**.
   En este equipo: `C:\Users\<u>\AppData\Local\Programs\Git\bin\bash.exe`.
   Sin esta env var, el subprocess de `claude` falla con "Claude Code on Windows
   requires git-bash". El wrapper la setea con default razonable si no viene de
   afuera.

4. **Test de determinismo (`temperature=0`) skipped intencionalmente**. La CLI no
   expone `--temperature`; el modelo usa su muestreo por defecto y dos llamadas
   con el mismo input producen outputs bit-distintos. Documentado en
   `persona-consultor.spec.ts` con razón explícita. Cuando aparezca un flag de
   temperature en la CLI o se vuelva al SDK (con créditos API), restaurar el test
   removiendo el `.skip`.

5. **Historial multi-turno serializado**. La CLI `-p` no acepta arrays de
   `messages`. `runner.ts::insistirAprobacion` necesitaba multi-turno para probar
   BR-02 (rechazo de bypass). Solución: serializar el historial como markdown
   con headers `### Usuario` / `### Sub-agente (respuesta previa)` dentro del
   user message. El sub-agente lee el último turno como petición actual y el
   resto como contexto. Pérdida de fidelidad menor; semántica preservada.

## Invariant aparecido

**El SDK Anthropic y la suscripción Claude Code son dos sistemas de billing
separados**. La suscripción Pro/Max/Enterprise (que paga el chat web, el CLI y
`claude-code-action`) **no inyecta créditos API** ni viceversa. Para usar la
suscripción desde Node hay que invocar la CLI como subprocess; no hay variante
del SDK oficial que acepte el OAuth token de la suscripción.

Corolarios para el repo:
- Workflows en CI con suscripción → usar `anthropics/claude-code-action` (pendiente #2).
- Scripts Node locales con suscripción → invocar `claude -p` vía child_process (este patrón).
- Si en algún momento aparece `claude-agent-sdk` con soporte OAuth, considerar migración (W2).

## Validación útil

1. **Resultado de la suite contra LLM real (2026-06-01)**:
   - 23 tests totales, **22 passed**, 1 skipped (determinismo).
   - Duración: 11.4 min.
   - Persona+Juez M1 (mutation testing, 4 casos): 2.4–3.3 min cada uno
     (3 llamadas LLM por caso: Persona Sonnet → Validador Sonnet → Juez Opus).
   - Jueces individuales: 5–40 s por test (1 llamada Opus cada uno).
   - **No hubo flakes**: los rangos esperados de scores quedaron dentro en todos los casos.

2. **Smoke test minúsculo antes del refactor masivo** (`scripts/smoke-cli.ts`):
   verifica el wrapper aislado en ~5 s. Reusable cada vez que se toca el wrapper
   o cambia la versión de Claude Code.

3. **El parseo de JSON wrapped en code fences funciona consistentemente**. Tanto
   Sonnet como Opus a veces emiten `\`\`\`json\n{...}\n\`\`\``. El `stripCodeFences()`
   del wrapper lo limpia antes de devolver. Los parseScorecard internos también
   son tolerantes (preservados del código pre-W1).

## Review feedback recurrente

(Aún N/A — segundo cierre del repo, sin AI review activo todavía. Cuando esté
configurado en GitHub UI [pendiente #2], los reviews aplicarán a futuras
modificaciones de este wrapper.)

## Docs impactadas

- [x] `qa/.env.example` — refleja que `ANTHROPIC_API_KEY` ya no se requiere,
      documenta `CLAUDE_CODE_GIT_BASH_PATH`.
- [x] `qa/README.md` — sección de auth W1 + checklist de estado actualizado.
- [ ] `qa/package.json` — `@anthropic-ai/sdk` queda como dependency (fallback W3
      documentado). Si se decide eliminar la dependencia, hacerlo en PR separado.
- [ ] `docs/plan-evaluacion.md` — agregar nota sobre la decisión W1 (PROP-008).
- [ ] `Agente-IA-Desarrollo-ABAP/AGENTS.md` — documentar el patrón "CLI como
      motor para suite Node" (PROP-009).

## Snippets / artefactos

### Patrón CLI-como-motor (minimalista)

```ts
import { spawn } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function invokeClaudeCli({ systemPrompt, userMessage, model }) {
  const tmpFile = join(tmpdir(), `cc-sys-${crypto.randomUUID()}.txt`);
  writeFileSync(tmpFile, systemPrompt, 'utf8');
  try {
    const proc = spawn('claude', [
      '-p',
      '--tools', '',
      '--no-session-persistence',
      '--output-format', 'json',
      '--model', model,
      '--system-prompt-file', tmpFile,
    ], { stdio: ['pipe', 'pipe', 'pipe'] });

    const stdout = [];
    proc.stdout.on('data', (d) => stdout.push(d));
    proc.stdin.write(userMessage);
    proc.stdin.end();

    await new Promise((res) => proc.on('close', res));
    return JSON.parse(Buffer.concat(stdout).toString('utf8')).result;
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}
```

### Comando para correr la suite

```bash
cd Agente-IA-Desarrollo-ABAP/qa
npm install                # primera vez
npx playwright install     # primera vez
npm run test:agents        # corre los 4 specs contra LLM real (~11 min)
```

### Pre-requisito de auth

```bash
# En tu terminal, abrí Claude Code una vez con tu cuenta empresarial:
claude
# /login si no estás logueado. Cerrá con /exit.
# La sesión OAuth queda en keychain — los subprocesses del wrapper la heredan.
```

## Notas para futuras capsules

- Esta capsule cierra el frente "Persona+Juez con LLM real" del pendiente #4
  (Suite QA). Falta el frente del **CI workflow** (`.github/workflows/qa.yml`)
  y el frente **golden dataset real**. Ambos son tareas separadas.
- El wrapper W1 también desbloquea cualquier futuro script Node que necesite
  generación con Claude usando la suscripción — no es específico de la suite QA.
- Comparar con la capsule de AI PR Review (`2026-06-01-ai-pr-review-setup.md`):
  ambas resuelven "cómo usar la suscripción en CI/scripts sin facturar tokens
  API"; AI PR Review lo logra con `claude-code-action`, esta capsule con la CLI
  como subprocess. Patrones complementarios.
