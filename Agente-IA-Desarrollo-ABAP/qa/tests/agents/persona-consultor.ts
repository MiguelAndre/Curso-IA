import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { invokeClaudeCli } from './claude-cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..', '..');

export type EstiloConsultor = 'experimentado' | 'apurado' | 'novato';

export type Mutacion =
  | 'omitir-autorizaciones'
  | 'omitir-tablas-sap'
  | 'omitir-casos-borde'
  | 'objetivo-vago'
  | 'ca-no-verificables'
  | 'tablas-descriptivas-no-tecnicas'
  | 'contradiccion-rn-cb';

export type TipoObjetoSolicitado =
  | 'REPORTE_ALV'
  | 'BADI'
  | 'CONVERSION'
  | 'FORMULARIO';

export interface SolicitudFd {
  /** Dominio funcional libre, p. ej. "compras", "ventas", "materiales". */
  dominio: string;
  /** Título corto del requerimiento, p. ej. "Reporte de pedidos abiertos por cliente". */
  titulo: string;
  /** Tipo de objeto ABAP esperado. */
  tipo_objeto: TipoObjetoSolicitado;
  /** Mutaciones deliberadas a introducir. Lista vacía = FD limpio. */
  mutaciones: Mutacion[];
  /** Identificador opcional para trazabilidad en logs. */
  req_id?: string;
}

export interface PerfilConsultor {
  estilo: EstiloConsultor;
  /** Empresa/sector para naturalizar el FD. */
  empresa: string;
}

export const PERFIL_DEFAULT: PerfilConsultor = {
  estilo: 'experimentado',
  empresa: 'una cadena colombiana de retail',
};

const DESCRIPCIONES_MUTACION: Record<Mutacion, string> = {
  'omitir-autorizaciones':
    'NO incluyas la sección "7. Autorizaciones". Termina el FD después de la sección 6.',
  'omitir-tablas-sap':
    'NO incluyas la sección "4. Tablas SAP involucradas". Pasa directo de Reglas de Negocio a Criterios de Aceptación.',
  'omitir-casos-borde':
    'NO incluyas la sección "6. Casos Borde". Pasa directo de Criterios de Aceptación a Autorizaciones.',
  'objetivo-vago':
    'La sección "1. Objetivo" debe ser DELIBERADAMENTE vaga: una sola frase corta sin verbo de resultado claro ni métrica medible. P. ej. "Optimizar el proceso" o "Mejorar la operación". Máximo 10 palabras.',
  'ca-no-verificables':
    'Los Criterios de Aceptación deben ser frases cualitativas sin umbrales ni criterios medibles. P. ej. "que funcione bien", "que sea rápido", "que cumpla los requerimientos".',
  'tablas-descriptivas-no-tecnicas':
    'En la sección "4. Tablas SAP involucradas", refiérete a las tablas DESCRIPTIVAMENTE (p. ej. "tabla de materiales", "tabla de clientes") en lugar de usar nombres técnicos (MARA, KNA1, etc.).',
  'contradiccion-rn-cb':
    'Introduce una contradicción interna entre Reglas de Negocio y Casos Borde: una RN debe incluir un caso que un CB explícitamente excluye (sin marcar la contradicción).',
};

function loadFormatoFd(): string {
  return readFileSync(join(REPO_ROOT, 'docs', 'formato-fd-generico.md'), 'utf8');
}

function buildSystemPrompt(perfil: PerfilConsultor): string {
  return [
    `Eres un consultor funcional SAP con estilo "${perfil.estilo}", trabajando en ${perfil.empresa}.`,
    'Tu trabajo es redactar Documentos Funcionales (FDs) que el área de desarrollo ABAP usará para implementar requerimientos.',
    'NO eres el área de desarrollo. NO escribes código ni TDs. Solo el FD funcional.',
    '',
    '## Formato esperado del FD (contrato de entrada del pipeline)',
    '',
    loadFormatoFd(),
    '',
    '## Restricciones',
    '- Idioma: español (Colombia). Términos técnicos SAP (MARA, KNA1, AUTHORITY-CHECK, etc.) se mantienen.',
    '- Nombres técnicos SAP: usá tablas reales (MARA, MARC, MAKT, EKKO, EKPO, MSEG, MKPF, KNA1, KNB1, KNVV, KNKK, LFA1, LFB1, VBAK, VBAP, VBUP, VBRK, VBRP, BSEG, BKPF, BSID, BSAD, T001, T001W, TCURR, etc.). NUNCA inventes tablas.',
    '- Longitud: 400–800 palabras totales.',
    '- Realismo: el FD debe parecer escrito por un consultor real entregándolo a desarrollo. No es un caso de test.',
    '- Salida: SOLO el contenido del FD en markdown, empezando con `# FD — <título>`. Sin envolturas de código, sin prosa antes o después.',
    '',
    '## Cómo aplicar mutaciones',
    'Si te piden aplicar mutaciones deliberadas (defectos intencionales en el FD), aplicalas LITERALMENTE. No "compenses" agregando información en otra sección. El FD debe quedar defectuoso de la manera específica que se pide — eso es por diseño, parte de un ejercicio de aseguramiento de calidad.',
  ].join('\n');
}

function buildUserMessage(solicitud: SolicitudFd): string {
  const partes: string[] = [
    '# Requerimiento a documentar',
    '',
    `**Dominio**: ${solicitud.dominio}`,
    `**Título**: ${solicitud.titulo}`,
    `**Tipo de objeto ABAP esperado**: ${solicitud.tipo_objeto}`,
  ];
  if (solicitud.req_id) partes.push(`**Identificador**: ${solicitud.req_id}`);
  partes.push('');
  if (solicitud.mutaciones.length === 0) {
    partes.push('## Mutaciones a aplicar');
    partes.push('Ninguna — redactá un FD limpio que cumpla las 7 secciones canónicas.');
  } else {
    partes.push('## Mutaciones DELIBERADAS a aplicar al FD');
    partes.push(
      'Las siguientes son defectos intencionales que el FD debe presentar. Aplicalas literalmente:',
    );
    partes.push('');
    for (const m of solicitud.mutaciones) {
      partes.push(`- **${m}**: ${DESCRIPCIONES_MUTACION[m]}`);
    }
  }
  partes.push('');
  partes.push('Devolvé ahora el FD en markdown puro.');
  return partes.join('\n');
}

function stripCodeFences(s: string): string {
  let t = s.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:markdown|md)?\s*/i, '').replace(/```\s*$/, '');
  }
  return t.trim();
}

/**
 * Genera un FD vía la Persona Consultor. Si `solicitud.mutaciones` está vacía, produce
 * un FD limpio (control); si trae mutaciones, las aplica deliberadamente para
 * estresar a M1 (mutation testing).
 */
export async function generarFd(
  solicitud: SolicitudFd,
  perfil: PerfilConsultor = PERFIL_DEFAULT,
): Promise<string> {
  const texto = await invokeClaudeCli({
    systemPrompt: buildSystemPrompt(perfil),
    userMessage: buildUserMessage(solicitud),
    model: process.env.QA_PERSONA_MODEL ?? process.env.QA_MODEL ?? 'claude-sonnet-4-6',
    stripFences: false,
  });
  return stripCodeFences(texto);
}
