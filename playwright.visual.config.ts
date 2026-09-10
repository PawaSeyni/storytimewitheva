import { defineConfig, devices } from '@playwright/test';

// Visual regression harness (used for the Tailwind 4 migration). Not part of CI.
//   BASE_URL=http://localhost:4173 npx playwright test --config playwright.visual.config.ts --update-snapshots   # baseline
//   BASE_URL=http://localhost:4174 npx playwright test --config playwright.visual.config.ts                      # compare
export default defineConfig({
  testDir: 'tests/visual',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' } },
  projects: [{ name: 'visual', use: { baseURL: process.env.BASE_URL || 'http://localhost:4173', ...devices['Desktop Chrome'], colorScheme: 'light' } }],
});
