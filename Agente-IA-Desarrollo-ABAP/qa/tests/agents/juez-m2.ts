import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { invokeClaudeCli } from './claude-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');
const QA_ROOT = join(__dirname, '..', '..');

export const PESOS_M2 = {
  D1_tipo_objeto: 0.1,
  D2_factualidad: 0.25,
  D3_completitud_rn: 0.2,
  D4_decisiones_supuestos: 0.15,
  D5_tbds: 0.1,
  D6_estructura: 0.1,
  D7_limpieza: 0.1,
} as const;

export type DimensionM2 = keyof typeof PESOS_M2;

export interface ScoresM2 {
  D1_tipo_objeto: number;
  D2_factualidad: number;
  D3_completitud_rn: number;
  D4_decisiones_supuestos: number;
  D5_tbds: number;
  D6_estructura: number;
  D7_limpieza: number;
}

export interface ScorecardM2 {
  fd_id: string;
  modelo_evaluado: string;
  scores: ScoresM2;
  score_ponderado: number;
  razonamiento: string;
  objetos_no_verificables: string[];
  rn_omitidas: string[];
  decisiones_count: number;
  tbds_count: number;
  contiene_codigo_abap: boolean;
}

export interface EntradaJuezM2 {
  fd_id: string;
  fd_content: string;
  td_output: string;
  /** TD real histórico, si existe en el dataset. */
  ground_truth_td?: string;
  /** Código de producción, si existe en el dataset — sirve para verificar factualidad. */
  ground_truth_codigo?: string;
  modelo_evaluado?: string;
}

function loadRubricaM2(): string {
  return readFileSync(join(QA_ROOT, 'rubrics', 'm2-fd-a-td.md'), 'utf8');
}

function loadFdAtdAgent(): string {
  const path = join(REPO_ROOT, '.claude', 'agents', 'fd-a-td.md');
  return readFileSync(path, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

function calcularScorePonderado(s: ScoresM2): number {
  let total = 0;
  for (const k of Object.keys(PESOS_M2) as DimensionM2[]) {
    total += s[k] * PESOS_M2[k];
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
    'Eres el agente Juez del Módulo 2 (FD → TD) del producto Agente IA ABAP.',
    'Tu único trabajo es evaluar la calidad de un TD producido por el sub-agente `fd-a-td` contra la rúbrica oficial.',
    '',
    'Reglas no negociables:',
    '1. Devuelves SIEMPRE un único objeto JSON con el formato del §6 de la rúbrica. Sin prosa fuera del JSON.',
    '2. Los scores por dimensión son enteros 1..5.',
    '3. `objetos_no_verificables` lista nombres SAP (tablas, FMs, BAPIs, BAdIs, clases) que el TD nombra pero (a) no están en el FD, (b) no son SAP estándar, y (c) no están marcados `⚠️ VERIFICAR`. Cada nombre aquí baja D2.',
    '4. `rn_omitidas` lista las RNs del FD que NO aparecen mapeadas en §6 del TD. Cada omisión baja D3.',
    '5. `decisiones_count` y `tbds_count` son enteros (cuentas literales en §8 y §9).',
    '6. `contiene_codigo_abap` es true si el TD contiene bloques ABAP compilables (no descripciones de pseudocódigo). Si es true, D7 debe ser ≤ 2.',
    '7. NO calcules `score_ponderado` — el harness lo calcula con los pesos oficiales; pon 0 en ese campo.',
    '8. Si no estás seguro entre dos niveles, elige el menor (sé estricto). D2 (factualidad) es la dimensión más estricta — la mínima duda sobre un nombre SAP no marcado castiga.',
    '',
    '## Rúbrica oficial',
    '',
    loadRubricaM2(),
    '',
    '## Definición del sub-agente bajo prueba (para detectar incumplimientos de BR-01..BR-15)',
    '',
    loadFdAtdAgent(),
  ].join('\n');
}

function buildUserMessage(entrada: EntradaJuezM2): string {
  const partes: string[] = [
    `# Caso a evaluar — ${entrada.fd_id}`,
    `**Modelo evaluado**: ${entrada.modelo_evaluado ?? 'desconocido'}`,
    '',
    '## FD de entrada',
    '',
    entrada.fd_content,
    '',
    '## TD a evaluar',
    '',
    entrada.td_output,
  ];
  if (entrada.ground_truth_td) {
    partes.push('', '## TD real histórico (referencia)', '', entrada.ground_truth_td);
  }
  if (entrada.ground_truth_codigo) {
    partes.push(
      '',
      '## Código de producción (referencia para verificar factualidad de objetos SAP)',
      '',
      '```abap',
      entrada.ground_truth_codigo,
      '```',
    );
  }
  partes.push(
    '',
    '## Tu tarea',
    'Devolvé el JSON de scorecard con los siete scores (D1..D7), `razonamiento`, `objetos_no_verificables`, `rn_omitidas`, `decisiones_count`, `tbds_count`, `contiene_codigo_abap`. Solo JSON, sin texto antes ni después.',
  );
  return partes.join('\n');
}

function parseScorecard(rawJson: string, entrada: EntradaJuezM2): ScorecardM2 {
  let texto = rawJson.trim();
  if (texto.startsWith('```')) {
    texto = texto.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  if (!texto.startsWith('{')) texto = '{' + texto;
  const parsed = JSON.parse(texto) as Partial<ScorecardM2> & { scores?: Partial<ScoresM2> };
  const scores: ScoresM2 = {
    D1_tipo_objeto: clamp1a5(parsed.scores?.D1_tipo_objeto),
    D2_factualidad: clamp1a5(parsed.scores?.D2_factualidad),
    D3_completitud_rn: clamp1a5(parsed.scores?.D3_completitud_rn),
    D4_decisiones_supuestos: clamp1a5(parsed.scores?.D4_decisiones_supuestos),
    D5_tbds: clamp1a5(parsed.scores?.D5_tbds),
    D6_estructura: clamp1a5(parsed.scores?.D6_estructura),
    D7_limpieza: clamp1a5(parsed.scores?.D7_limpieza),
  };
  return {
    fd_id: entrada.fd_id,
    modelo_evaluado: entrada.modelo_evaluado ?? 'desconocido',
    scores,
    score_ponderado: calcularScorePonderado(scores),
    razonamiento: String(parsed.razonamiento ?? '').slice(0, 4000),
    objetos_no_verificables: Array.isArray(parsed.objetos_no_verificables)
      ? parsed.objetos_no_verificables.map(String)
      : [],
    rn_omitidas: Array.isArray(parsed.rn_omitidas) ? parsed.rn_omitidas.map(String) : [],
    decisiones_count: Number.isFinite(parsed.decisiones_count as number)
      ? Math.max(0, Math.round(parsed.decisiones_count as number))
      : 0,
    tbds_count: Number.isFinite(parsed.tbds_count as number)
      ? Math.max(0, Math.round(parsed.tbds_count as number))
      : 0,
    contiene_codigo_abap: Boolean(parsed.contiene_codigo_abap),
  };
}

/**
 * Juez del Módulo 2. Evalúa un TD producido por fd-a-td contra la rúbrica oficial.
 * Devuelve scorecard JSON con score ponderado calculado por el harness (no por el LLM).
 */
export async function juzgarOutputFdATd(entrada: EntradaJuezM2): Promise<ScorecardM2> {
  const system = buildSystemPrompt();
  const userMsg = buildUserMessage(entrada);
  const texto = await invokeClaudeCli({
    systemPrompt: system,
    userMessage: userMsg,
    model: process.env.QA_JUDGE_MODEL ?? 'claude-opus-4-7',
  });
  return parseScorecard(texto, entrada);
}
