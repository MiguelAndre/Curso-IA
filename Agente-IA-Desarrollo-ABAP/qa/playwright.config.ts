import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddTestDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
  outputDir: '.bdd',
});

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  timeout: 120_000,
  projects: [
    {
      name: 'bdd',
      testDir: bddTestDir,
    },
    {
      name: 'agents',
      testDir: 'tests/agents',
      testMatch: '**/*.spec.ts',
    },
    {
      name: 'lib',
      testDir: 'tests/lib',
      testMatch: '**/*.spec.ts',
    },
  ],
});
