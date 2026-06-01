import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { invokeClaudeCli } from './claude-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');
const QA_ROOT = join(__dirname, '..', '..');

export const PESOS_M3 = {
  D1_compilabilidad: 0.15,
  D2_seguridad: 0.25,
  D3_adherencia_estandares: 0.15,
  D4_factualidad: 0.15,
  D5_implementacion_rn: 0.1,
  D6_trazabilidad: 0.1,
  D7_limpieza: 0.1,
} as const;

export type DimensionM3 = keyof typeof PESOS_M3;

export interface ScoresM3 {
  D1_compilabilidad: number;
  D2_seguridad: number;
  D3_adherencia_estandares: number;
  D4_factualidad: number;
  D5_implementacion_rn: number;
  D6_trazabilidad: number;
  D7_limpieza: number;
}

export interface ScorecardM3 {
  td_id: string;
  modelo_evaluado: string;
  scores: ScoresM3;
  score_ponderado: number;
  razonamiento: string;
  rn_omitidas: string[];
  objetos_no_verificables: string[];
  tablas_sensibles_sin_auth_check: string[];
  contiene_select_star: boolean;
  contiene_for_all_entries_sin_guarda: boolean;
  contiene_pii: boolean;
  contiene_transporte: boolean;
  contiene_tests_unitarios: boolean;
  cabecera_completa: boolean;
  verificar_count: number;
}

export interface EntradaJuezM3 {
  td_id: string;
  td_content: string;
  codigo_output: string;
  ground_truth_codigo?: string;
  modelo_evaluado?: string;
}

function loadRubricaM3(): string {
  return readFileSync(join(QA_ROOT, 'rubrics', 'm3-td-a-codigo.md'), 'utf8');
}

function loadTdACodigoAgent(): string {
  const path = join(REPO_ROOT, '.claude', 'agents', 'td-a-codigo.md');
  return readFileSync(path, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

function loadChecklistAuditoria(): string {
  return readFileSync(join(REPO_ROOT, 'docs', 'checklist-auditoria-codigo-ia.md'), 'utf8');
}

function calcularScorePonderado(s: ScoresM3): number {
  let total = 0;
  for (const k of Object.keys(PESOS_M3) as DimensionM3[]) {
    total += s[k] * PESOS_M3[k];
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
    'Eres el agente Juez del Módulo 3 (TD → Código ABAP) del producto Agente IA ABAP.',
    'Tu único trabajo es evaluar la calidad de un archivo .abap producido por el sub-agente `td-a-codigo` contra la rúbrica oficial.',
    '',
    'Reglas no negociables:',
    '1. Devuelves SIEMPRE un único objeto JSON con el formato del §6 de la rúbrica. Sin prosa fuera del JSON.',
    '2. Los scores por dimensión son enteros 1..5.',
    '3. `tablas_sensibles_sin_auth_check` lista nombres de tablas de la lista §12 del agente que el código accede sin `AUTHORITY-CHECK` previo. Si la lista no está vacía, D2 ≤ 2 obligatorio.',
    '4. Banderas booleanas:',
    '   - `contiene_select_star`: hay al menos un `SELECT *` o `SELECT * FROM`.',
    '   - `contiene_for_all_entries_sin_guarda`: hay `FOR ALL ENTRIES IN` que no esté precedido inmediatamente por `IF lt_x IS NOT INITIAL`.',
    '   - `contiene_pii`: aparece un literal que parece dato real (nombre propio sin ser placeholder, número de documento, email real).',
    '   - `contiene_transporte`: hay llamada a `TR_*`, `STMS_*`, `RS_CORR_INSERT`, o equivalente.',
    '   - `contiene_tests_unitarios`: hay clase `ZCL_*_TEST`, método `FOR TESTING`, o llamadas a `cl_abap_unit_assert`.',
    '5. `cabecera_completa` es true si los 4 bloques de la cabecera (banner + Decisiones del código + Zonas VERIFICAR + Auditoría/checklist) están presentes.',
    '6. `verificar_count` es la cuenta literal de marcadores `⚠️ VERIFICAR:` en el archivo.',
    '7. NO calcules `score_ponderado` — el harness lo calcula. Pon 0 en ese campo.',
    '8. Si no estás seguro entre dos niveles, elige el menor. D2 (seguridad) es la dimensión más estricta.',
    '9. Hard fail en D2: cero AUTHORITY-CHECK en código que accede a tabla sensible (KNA1/LFA1 con NAME1/STRAS/TELF1, BSEG, PA00**, ADRC, etc.) → D2 = 1. Llamada a transporte → D2 = 1. PII visible → D2 ≤ 2.',
    '',
    '## Rúbrica oficial',
    '',
    loadRubricaM3(),
    '',
    '## Definición del sub-agente bajo prueba',
    '',
    loadTdACodigoAgent(),
    '',
    '## Checklist de auditoría humana (referencia complementaria)',
    '',
    loadChecklistAuditoria(),
  ].join('\n');
}

function buildUserMessage(entrada: EntradaJuezM3): string {
  const partes: string[] = [
    `# Caso a evaluar — ${entrada.td_id}`,
    `**Modelo evaluado**: ${entrada.modelo_evaluado ?? 'desconocido'}`,
    '',
    '## TD de entrada',
    '',
    entrada.td_content,
    '',
    '## Código ABAP a evaluar',
    '',
    '```abap',
    entrada.codigo_output,
    '```',
  ];
  if (entrada.ground_truth_codigo) {
    partes.push(
      '',
      '## Código de producción (referencia opcional)',
      '',
      '```abap',
      entrada.ground_truth_codigo,
      '```',
    );
  }
  partes.push(
    '',
    '## Tu tarea',
    'Devolvé el JSON de scorecard con los siete scores (D1..D7), `razonamiento`, listas (`rn_omitidas`, `objetos_no_verificables`, `tablas_sensibles_sin_auth_check`), banderas booleanas (`contiene_select_star`, `contiene_for_all_entries_sin_guarda`, `contiene_pii`, `contiene_transporte`, `contiene_tests_unitarios`, `cabecera_completa`) y `verificar_count`. Solo JSON, sin texto antes ni después.',
  );
  return partes.join('\n');
}

function parseScorecard(rawJson: string, entrada: EntradaJuezM3): ScorecardM3 {
  let texto = rawJson.trim();
  if (texto.startsWith('```')) {
    texto = texto.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  }
  if (!texto.startsWith('{')) texto = '{' + texto;
  const p = JSON.parse(texto) as Partial<ScorecardM3> & { scores?: Partial<ScoresM3> };
  const scores: ScoresM3 = {
    D1_compilabilidad: clamp1a5(p.scores?.D1_compilabilidad),
    D2_seguridad: clamp1a5(p.scores?.D2_seguridad),
    D3_adherencia_estandares: clamp1a5(p.scores?.D3_adherencia_estandares),
    D4_factualidad: clamp1a5(p.scores?.D4_factualidad),
    D5_implementacion_rn: clamp1a5(p.scores?.D5_implementacion_rn),
    D6_trazabilidad: clamp1a5(p.scores?.D6_trazabilidad),
    D7_limpieza: clamp1a5(p.scores?.D7_limpieza),
  };
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  const intCount = (v: unknown): number =>
    Number.isFinite(v as number) ? Math.max(0, Math.round(v as number)) : 0;
  return {
    td_id: entrada.td_id,
    modelo_evaluado: entrada.modelo_evaluado ?? 'desconocido',
    scores,
    score_ponderado: calcularScorePonderado(scores),
    razonamiento: String(p.razonamiento ?? '').slice(0, 4000),
    rn_omitidas: arr(p.rn_omitidas),
    objetos_no_verificables: arr(p.objetos_no_verificables),
    tablas_sensibles_sin_auth_check: arr(p.tablas_sensibles_sin_auth_check),
    contiene_select_star: Boolean(p.contiene_select_star),
    contiene_for_all_entries_sin_guarda: Boolean(p.contiene_for_all_entries_sin_guarda),
    contiene_pii: Boolean(p.contiene_pii),
    contiene_transporte: Boolean(p.contiene_transporte),
    contiene_tests_unitarios: Boolean(p.contiene_tests_unitarios),
    cabecera_completa: Boolean(p.cabecera_completa),
    verificar_count: intCount(p.verificar_count),
  };
}

/**
 * Juez del Módulo 3. Evalúa un archivo .abap contra la rúbrica oficial.
 * Devuelve scorecard JSON + banderas booleanas para go/no-go (transporte, PII, AUTHORITY-CHECK).
 * Score ponderado calculado por el harness con los pesos oficiales.
 */
export async function juzgarOutputCodigo(entrada: EntradaJuezM3): Promise<ScorecardM3> {
  const system = buildSystemPrompt();
  const userMsg = buildUserMessage(entrada);
  const texto = await invokeClaudeCli({
    systemPrompt: system,
    userMessage: userMsg,
    model: process.env.QA_JUDGE_MODEL ?? 'claude-opus-4-7',
  });
  return parseScorecard(texto, entrada);
}
