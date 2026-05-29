import { test as base, createBdd } from 'playwright-bdd';
import type { RespuestaAgente } from './runner';

export interface ContextoQA {
  fdContent: string;
  respuesta: RespuestaAgente | null;
  inputCrudo: string;
}

export const test = base.extend<{ ctx: ContextoQA }>({
  ctx: async ({}, use) => {
    await use({ fdContent: '', respuesta: null, inputCrudo: '' });
  },
});

export const { Given, When, Then, Step } = createBdd(test);
