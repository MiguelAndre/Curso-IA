import { spawn } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export interface InvokeArgs {
  systemPrompt: string;
  userMessage: string;
  model: string;
  /** Si el modelo devuelve JSON envuelto en ```json ... ```, los fences se eliminan en `result`. */
  stripFences?: boolean;
}

interface ClaudeCliResultJson {
  type: 'result';
  subtype: 'success' | string;
  is_error: boolean;
  api_error_status: string | null;
  duration_ms: number;
  result: string;
  total_cost_usd?: number;
  usage?: unknown;
  modelUsage?: Record<string, unknown>;
  session_id?: string;
  stop_reason?: string;
}

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json|md|markdown|abap|text)?\s*\r?\n?/i, '').replace(/\r?\n?```\s*$/i, '');
  }
  return t.trim();
}

/**
 * Invoca la CLI `claude` en modo print (-p) usando la suscripción Claude Code del usuario.
 *
 * Diseño:
 * - System prompt vía archivo temporal: `--system-prompt-file` evita el límite de
 *   ~32 k caracteres de argumentos en Windows para rúbricas grandes.
 * - User message vía stdin: misma razón.
 * - `--tools ""` desactiva todas las tools — sólo queremos generación, no agentic loops.
 * - `--no-session-persistence` evita ensuciar `~/.claude/projects/...` con tests.
 * - `--output-format json` retorna `{result, is_error, ...}` parseable.
 * - `CLAUDE_CODE_GIT_BASH_PATH` configurable vía env; default al path típico de Git for Windows.
 *
 * No usa `--bare` porque ese modo desactiva OAuth/keychain (requiere `ANTHROPIC_API_KEY`).
 * El objetivo del wrapper es justamente usar la suscripción sin cobrar tokens.
 */
export async function invokeClaudeCli(args: InvokeArgs): Promise<string> {
  const tmpFile = join(tmpdir(), `cc-sys-${randomUUID()}.txt`);
  writeFileSync(tmpFile, args.systemPrompt, 'utf8');

  try {
    const proc = spawn(
      'claude',
      [
        '-p',
        '--tools',
        '',
        '--no-session-persistence',
        '--output-format',
        'json',
        '--model',
        args.model,
        '--system-prompt-file',
        tmpFile,
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
        env: {
          ...process.env,
          CLAUDE_CODE_GIT_BASH_PATH:
            process.env.CLAUDE_CODE_GIT_BASH_PATH ??
            'C:\\Users\\mihernandez\\AppData\\Local\\Programs\\Git\\bin\\bash.exe',
        },
      },
    );

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    proc.stdout.on('data', (d: Buffer) => stdoutChunks.push(d));
    proc.stderr.on('data', (d: Buffer) => stderrChunks.push(d));

    // Escribir user message inmediatamente y cerrar stdin para que la CLI no quede esperando.
    proc.stdin.write(args.userMessage, 'utf8');
    proc.stdin.end();

    const exitCode: number = await new Promise((resolve, reject) => {
      proc.on('error', reject);
      proc.on('close', (code) => resolve(code ?? -1));
    });

    const stdout = Buffer.concat(stdoutChunks).toString('utf8');
    const stderr = Buffer.concat(stderrChunks).toString('utf8');

    if (exitCode !== 0) {
      throw new Error(
        `Claude CLI exit ${exitCode}. stderr="${stderr.slice(0, 500)}" stdout="${stdout.slice(0, 200)}"`,
      );
    }

    if (!stdout.trim().startsWith('{')) {
      throw new Error(
        `Claude CLI no devolvió JSON parseable. stdout="${stdout.slice(0, 200)}" stderr="${stderr.slice(0, 200)}"`,
      );
    }

    const parsed = JSON.parse(stdout) as ClaudeCliResultJson;
    if (parsed.is_error || parsed.subtype !== 'success') {
      throw new Error(
        `Claude CLI error (subtype=${parsed.subtype}, api_status=${parsed.api_error_status}): ${parsed.result}`,
      );
    }

    const text = args.stripFences === false ? parsed.result : stripCodeFences(parsed.result);
    return text;
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      // best-effort cleanup
    }
  }
}
