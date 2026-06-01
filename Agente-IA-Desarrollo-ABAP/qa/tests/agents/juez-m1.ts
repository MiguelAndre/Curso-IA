import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { invokeClaudeCli } from './claude-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');
const QA_ROOT = join(__dirname, '..', '..');

export const PESOS_M1 = {
  D1_correccion_veredicto: 0.3,
  D2_completitud_gaps: 0.2,
  D3_precision_gaps: 0.2,
  D4_accionabilidad: 0.15,
  D5_formato: 0.1,
  D6_lenguaje: 0.05,
} as const;

export type DimensionM1 = keyof typeof PESOS_M1;

export interface ScoresM1 {
  D1_correccion_veredicto: number;
  D2_completitud_gaps: number;
  D3_precision_gaps: number;
  D4_accionabilidad: number;
  D5_formato: number;
  D6_lenguaje: number;
}

export interface ScorecardM1 {
  fd_id: string;
  modelo_evaluado: string;
  scores: ScoresM1;
  score_ponderado: number;
  razonamiento: string;
  gaps_omitidos: string[];
  gaps_inventados: string[];
  tono_acusatorio: boolean;
}

export type GroundTruthM1 =
  | { tipo: 'SIN_DEVOLUCION' }
  | { tipo: 'CON_DEVOLUCION'; motivos: string[] };

export interface EntradaJuezM1 {
  fd_id: string;
  fd_content: string;
  output_validador: string;
  ground_truth?: GroundTruthM1;
  /** Modelo que se evaluó (no el modelo del Juez). Se incluye en la scorecard para trazabilidad. */
  modelo_evaluado?: string;
}

function loadRubricaM1(): string {
  return readFileSync(join(QA_ROOT, 'rubrics', 'm1-validador.md'), 'utf8');
}

function loadValidadorAgent(): string {
  const path = join(REPO_ROOT, '.claude', 'agents', 'validador-fd.md');
  return readFileSync(path, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

function calcularScorePonderado(s: ScoresM1): number {
  let total = 0;
  for (const k of Object.keys(PESOS_M1) as DimensionM1[]) {
    total += s[k] * PESOS_M1[k];
  }
  return Math.round(total * 100) / 100;
}

function clamp1a5(n: unknown): number {
  const x = typeof n === 'number' ? n : parseFloat(String(n));
  if (!Number.isFinite(x)) return 1;
  return Math.max(1, Math.min(5, Math.round(x)));
}

function buildSystemPrompt(): string {
  return [
    'Eres el agente Juez del Módulo 1 del producto Agente IA ABAP.',
    'Tu único trabajo es evaluar la calidad de un output del sub-agente `validador-fd` contra la rúbrica oficial.',
    '',
    'Reglas no negociables:',
    '1. Devuelves SIEMPRE un único objeto JSON con el formato del §6 de la rúbrica. Sin prosa fuera del JSON.',
    '2. Los scores por dimensión son enteros 1..5.',
    '3. `gaps_omitidos` lista códigos CE-XX/CS-XX que el validador debió reportar y no reportó.',
    '4. `gaps_inventados` lista códigos CE-XX/CS-XX que el validador reportó pero no aplican al FD dado.',
    '5. `tono_acusatorio` es true si el output contiene frases que culpan al autor del FD (viola BR-06).',
    '6. NO calcules `score_ponderado` — el harness lo calcula con los pesos oficiales; pon 0 en ese campo.',
    '7. Si no estás seguro entre dos niveles, elige el menor (sé estricto).',
    '',
    '## Rúbrica oficial',
    '',
    loadRubricaM1(),
    '',
    '## Definición del sub-agente bajo prueba (para detectar gaps inventados)',
    '',
    loadValidadorAgent(),
  ].join('\n');
}

function buildUserMessage(entrada: EntradaJuezM1): string {
  const gt = entrada.ground_truth;
  const gtTexto = gt
    ? gt.tipo === 'SIN_DEVOLUCION'
      ? 'SIN_DEVOLUCION (el FD pasó limpio en la práctica real)'
      : `CON_DEVOLUCION — motivos reales: ${gt.motivos.join('; ')}`
    : 'desconocido (no hay ground truth para este FD)';
  return [
    `# Caso a evaluar — ${entrada.fd_id}`,
    `**Modelo evaluado**: ${entrada.modelo_evaluado ?? 'desconocido'}`,
    `**Ground truth histórico**: ${gtTexto}`,
    '',
    '## FD de entrada',
    '',
    entrada.fd_content,
    '',
    '## Output del validador a evaluar',
    '',
    entrada.output_validador,
    '',
    '## Tu tarea',
    'Devuelve el JSON de scorecard con los seis scores (D1..D6), `razonamiento`, `gaps_omitidos`, `gaps_inventados` y `tono_acusatorio`. Recuerda: solo JSON, sin texto antes ni después.',
  ].join('\n');
}

function parseScorecard(rawJson: string, entrada: EntradaJuezM1): ScorecardM1 {
  let texto = rawJson.trim();
  if (texto.startsWith('```')) {
    texto = texto.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  if (!texto.startsWith('{')) texto = '{' + texto;
  const parsed = JSON.parse(texto) as Partial<ScorecardM1> & { scores?: Partial<ScoresM1> };
  const scores: ScoresM1 = {
    D1_correccion_veredicto: clamp1a5(parsed.scores?.D1_correccion_veredicto),
    D2_completitud_gaps: clamp1a5(parsed.scores?.D2_completitud_gaps),
    D3_precision_gaps: clamp1a5(parsed.scores?.D3_precision_gaps),
    D4_accionabilidad: clamp1a5(parsed.scores?.D4_accionabilidad),
    D5_formato: clamp1a5(parsed.scores?.D5_formato),
    D6_lenguaje: clamp1a5(parsed.scores?.D6_lenguaje),
  };
  return {
    fd_id: entrada.fd_id,
    modelo_evaluado: entrada.modelo_evaluado ?? 'desconocido',
    scores,
    score_ponderado: calcularScorePonderado(scores),
    razonamiento: String(parsed.razonamiento ?? '').slice(0, 4000),
    gaps_omitidos: Array.isArray(parsed.gaps_omitidos) ? parsed.gaps_omitidos.map(String) : [],
    gaps_inventados: Array.isArray(parsed.gaps_inventados) ? parsed.gaps_inventados.map(String) : [],
    tono_acusatorio: Boolean(parsed.tono_acusatorio),
  };
}

/**
 * Juez del Módulo 1. Evalúa un output del validador-fd contra la rúbrica oficial.
 * Devuelve scorecard JSON con score ponderado calculado por el harness (no por el LLM).
 */
export async function juzgarOutputValidador(entrada: EntradaJuezM1): Promise<ScorecardM1> {
  const system = buildSystemPrompt();
  const userMsg = buildUserMessage(entrada);
  const texto = await invokeClaudeCli({
    systemPrompt: system,
    userMessage: userMsg,
    model: process.env.QA_JUDGE_MODEL ?? 'claude-opus-4-7',
  });
  return parseScorecard(texto, entrada);
}
