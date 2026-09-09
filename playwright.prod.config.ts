import { defineConfig, devices } from '@playwright/test';

// Sprint 7 S7-020: the release audit runs the CLIENT-SIDE suites against LIVE production.
// Only specs whose network side effects are stubbed in-page (subscribe endpoint via
// page.route, analytics aborted) are included; nothing here writes to MailerLite or
// Plausible. Usage: npm run test:prod-audit
const PROD = process.env.SMOKE_BASE_URL || 'https://storytimewitheva.com';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  retries: 1,
  reporter: 'list',
  projects: [
    {
      name: 'prod-audit',
      testMatch: /(a11y|cookie-free|seasonal|search|print-packs|landing)\.spec\.ts/,
      use: { baseURL: PROD, ...devices['Desktop Chrome'] },
    },
  ],
});
