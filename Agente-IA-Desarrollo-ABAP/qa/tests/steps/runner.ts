import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { invokeClaudeCli } from '../agents/claude-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');

type Veredicto = 'APROBADO' | 'RECHAZADO' | 'SIN_VEREDICTO';

export interface RespuestaAgente {
  /** Texto completo devuelto por el sub-agente. */
  output: string;
  /** Veredicto inferido del output ('SIN_VEREDICTO' cuando el agente redirige sin emitir estado — §5.2 del validador). */
  veredicto: Veredicto;
}

export interface MensajeChat {
  role: 'user' | 'assistant';
  content: string;
}

/** Strip YAML frontmatter de un agente Claude Code; devuelve solo el body como system prompt. */
function loadAgentSystemPrompt(agentName: string): string {
  const path = join(REPO_ROOT, '.claude', 'agents', `${agentName}.md`);
  const raw = readFileSync(path, 'utf8');
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

/** Carga los documentos de contrato que el sub-agente referencia (CLAUDE.md + formato del FD). */
function loadContextoContrato(): string {
  const claudeMd = readFileSync(join(REPO_ROOT, 'CLAUDE.md'), 'utf8');
  const formatoFd = readFileSync(join(REPO_ROOT, 'docs', 'formato-fd-generico.md'), 'utf8');
  return [
    '# Configuración base del producto (CLAUDE.md)',
    claudeMd,
    '\n---\n',
    '# Contrato de entrada — formato del FD',
    formatoFd,
  ].join('\n\n');
}

function inferirVeredicto(text: string): Veredicto {
  if (/Estado:\s*[✅✔️]?\s*APROBADO/iu.test(text)) return 'APROBADO';
  if (/Estado:\s*[❌✖️]?\s*RECHAZADO/iu.test(text)) return 'RECHAZADO';
  return 'SIN_VEREDICTO';
}

/**
 * Serializa un historial multi-turno en un único user message para la CLI `claude -p`
 * (que no acepta historial nativo). El sub-agente lee el último turno como petición
 * actual y los turnos previos como contexto.
 */
function serializarHistorial(mensajes: MensajeChat[]): string {
  if (mensajes.length === 1 && mensajes[0].role === 'user') {
    return mensajes[0].content;
  }
  const partes: string[] = [
    '<!-- Conversación previa con el sub-agente; respondé al ÚLTIMO turno del usuario. -->',
    '',
  ];
  for (const m of mensajes) {
    partes.push(m.role === 'user' ? '### Usuario' : '### Sub-agente (respuesta previa)');
    partes.push('');
    partes.push(m.content);
    partes.push('');
  }
  return partes.join('\n');
}

async function llamarAgente(
  systemPrompt: string,
  mensajes: MensajeChat[],
  _opts: { maxTokens?: number } = {},
): Promise<string> {
  return invokeClaudeCli({
    systemPrompt,
    userMessage: serializarHistorial(mensajes),
    model: process.env.QA_MODEL ?? 'claude-sonnet-4-6',
    stripFences: false,
  });
}

/**
 * Invoca al sub-agente `validador-fd` con un FD inline.
 * No usa tools — pasamos el contenido del FD directamente en el mensaje del usuario.
 */
export async function invocarValidadorFd(
  fdContent: string,
  historial: MensajeChat[] = [],
): Promise<RespuestaAgente> {
  const systemPrompt = `${loadAgentSystemPrompt('validador-fd')}\n\n${loadContextoContrato()}`;
  const mensajes: MensajeChat[] =
    historial.length > 0
      ? historial
      : [
          {
            role: 'user',
            content: `Validá el siguiente FD (contenido inline, no es una ruta de archivo):\n\n---\n\n${fdContent}\n\n---`,
          },
        ];
  const output = await llamarAgente(systemPrompt, mensajes);
  return { output, veredicto: inferirVeredicto(output) };
}

/**
 * Continúa una conversación previa con el validador para probar BR-02 (rechazo de bypass).
 */
export async function insistirAprobacion(
  previo: RespuestaAgente,
  fdContent: string,
  mensajeInsistencia: string,
): Promise<RespuestaAgente> {
  const historial: MensajeChat[] = [
    {
      role: 'user',
      content: `Validá el siguiente FD (contenido inline):\n\n---\n\n${fdContent}\n\n---`,
    },
    { role: 'assistant', content: previo.output },
    { role: 'user', content: mensajeInsistencia },
  ];
  return invocarValidadorFd(fdContent, historial);
}

export interface OpcionesFdATd {
  /** True cuando se invoca por /generar-td directo (debe emitir aviso de modo directo — BR-02). */
  directo?: boolean;
  /** ID de requerimiento (libre, p. ej. REQ-2026-042). Sin él el agente NO persiste (BR-10). */
  reqId?: string;
}

export interface RespuestaTd {
  output: string;
}

/**
 * Invoca al sub-agente `fd-a-td` (M2) con un FD inline aprobado o con código ABAP existente
 * (activa modo reverse engineering automáticamente — BR-09).
 */
export async function invocarFdATd(
  inputContent: string,
  opciones: OpcionesFdATd = {},
): Promise<RespuestaTd> {
  const systemPrompt = `${loadAgentSystemPrompt('fd-a-td')}\n\n${loadContextoContrato()}`;
  const partes: string[] = [];
  if (opciones.directo) {
    partes.push(
      'Contexto de invocación: el comando es `/generar-td` directo (NO se pasó previamente por `/validar-fd` ni por el orquestador `/pipeline-abap`). Aplicá BR-02: emití el aviso prominente de modo directo al inicio del TD.',
    );
  } else {
    partes.push(
      'Contexto de invocación: el comando es `/pipeline-abap`. El FD ya fue aprobado por el Validador (Módulo 1).',
    );
  }
  if (opciones.reqId) {
    partes.push(`Requerimiento: ${opciones.reqId}`);
  } else {
    partes.push(
      'No hay <req-id>. Imprimí el TD en chat únicamente, no persistas (BR-10).',
    );
  }
  partes.push('Input (contenido inline, no es una ruta de archivo):');
  partes.push('---');
  partes.push(inputContent);
  partes.push('---');
  const mensaje = partes.join('\n\n');
  const output = await llamarAgente(
    systemPrompt,
    [{ role: 'user', content: mensaje }],
    { maxTokens: 8192 },
  );
  return { output };
}
