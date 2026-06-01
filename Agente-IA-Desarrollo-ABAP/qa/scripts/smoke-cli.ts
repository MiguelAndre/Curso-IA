#!/usr/bin/env tsx
// Smoke test del wrapper claude-cli. Comprobación rápida fuera de Playwright.
// Uso: cd qa && npx tsx scripts/smoke-cli.ts

import { invokeClaudeCli } from '../tests/agents/claude-cli';

async function main(): Promise<void> {
  const result = await invokeClaudeCli({
    systemPrompt:
      'Sos un asistente que responde EXCLUSIVAMENTE en JSON, sin code fences, sin texto antes ni después. ' +
      'El JSON debe tener la forma {"echo": "<texto recibido>", "len": <longitud>}.',
    userMessage: 'PING',
    model: 'claude-sonnet-4-6',
  });

  console.log('--- RESULT ---');
  console.log(result);
  console.log('--- PARSED ---');
  const parsed = JSON.parse(result);
  console.log(JSON.stringify(parsed, null, 2));
  if (parsed.echo !== 'PING' || parsed.len !== 4) {
    console.error('Smoke FAILED: echo/len mismatch');
    process.exit(1);
  }
  console.log('Smoke OK');
}

main().catch((err) => {
  console.error('Smoke ERROR:', err);
  process.exit(1);
});
