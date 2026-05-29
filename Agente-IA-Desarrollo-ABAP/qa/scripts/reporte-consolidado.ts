#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitirReporte, type ResultadoCaso } from '../tests/lib/metrics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const QA_ROOT = join(__dirname, '..');
const REPO_ROOT = join(QA_ROOT, '..');

interface Argumentos {
  modo: 'demo' | 'archivo';
  inputPath?: string;
  outputPath?: string;
}

function parseArgs(argv: string[]): Argumentos {
  const args: Argumentos = { modo: 'demo' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input' || a === '-i') {
      args.modo = 'archivo';
      args.inputPath = argv[++i];
    } else if (a === '--output' || a === '-o') {
      args.outputPath = argv[++i];
    } else if (a === '--demo') {
      args.modo = 'demo';
    } else if (a === '--help' || a === '-h') {
      console.log(
        [
          'Uso: reporte-consolidado [--demo | --input <casos.json>] [--output <reporte.md>]',
          '',
          'Modos:',
          '  --demo                Usa scorecards canónicos de tests/fixtures/scorecards-demo/casos.json',
          '  --input <archivo>     Lee un JSON con un array de ResultadoCaso[] (ver tests/lib/metrics.ts)',
          '',
          'Salida:',
          '  --output <archivo>    Escribe el reporte markdown en la ruta dada.',
          '                        Default: evaluacion/resultados/reporte-<timestamp>.md (o reporte-demo.md en modo demo).',
        ].join('\n'),
      );
      process.exit(0);
    }
  }
  return args;
}

function cargarCasos(args: Argumentos): ResultadoCaso[] {
  let path: string;
  if (args.modo === 'demo') {
    path = join(QA_ROOT, 'tests', 'fixtures', 'scorecards-demo', 'casos.json');
  } else {
    if (!args.inputPath) {
      console.error('Error: --input requiere una ruta a archivo JSON.');
      process.exit(1);
    }
    path = resolve(args.inputPath);
  }
  const raw = readFileSync(path, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    console.error('Error: el archivo de casos debe ser un array JSON de ResultadoCaso[].');
    process.exit(1);
  }
  return parsed as ResultadoCaso[];
}

function rutaDeSalida(args: Argumentos): string {
  if (args.outputPath) return resolve(args.outputPath);
  if (args.modo === 'demo') {
    return join(QA_ROOT, 'reporte-demo.md');
  }
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const dir = join(REPO_ROOT, 'evaluacion', 'resultados');
  mkdirSync(dir, { recursive: true });
  return join(dir, `reporte-${ts}.md`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const casos = cargarCasos(args);
  if (casos.length === 0) {
    console.error('Error: no hay casos en el dataset. Nada que reportar.');
    process.exit(1);
  }
  const reporte = emitirReporte(casos);
  const salida = rutaDeSalida(args);
  writeFileSync(salida, reporte);
  console.log(`✓ Reporte generado (${casos.length} casos): ${salida}`);
}

main();
