import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from '@playwright/test';
import { Given } from './fixtures';

const REPO_ROOT = join(__dirname, '..', '..', '..');

Given('que el sub-agente {string} está disponible en el repositorio', async ({}, agente: string) => {
  const path = join(REPO_ROOT, '.claude', 'agents', `${agente}.md`);
  expect(existsSync(path), `No se encontró el sub-agente ${agente}.md en .claude/agents/`).toBeTruthy();
});

Given('que el contrato de entrada es {string}', async ({}, ruta: string) => {
  const path = join(REPO_ROOT, ruta);
  expect(existsSync(path), `No se encontró el contrato de entrada en ${ruta}`).toBeTruthy();
});

Given('que el formato de output sigue los templates de §7 del agente', async ({}) => {
  // Validación documental — la presencia de los templates se valida con los Then de cada scenario.
  expect(true).toBeTruthy();
});
