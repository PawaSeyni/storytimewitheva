import { defineConfig, devices } from '@playwright/test';

// Two projects:
//  • smoke  → runs against LIVE production. Netlify-runtime behaviour (real
//             404s, /download 302s, prerendered HTML) can't be faithfully
//             emulated locally, so route/delivery/pre-flight checks run live.
//  • local  → runs against the built dist via `vite preview`. Client-side
//             behaviour (form, analytics, landing contract) that needs no
//             Netlify runtime; the subscribe endpoint is stubbed with page.route.
//
// `PW_NO_SERVER=1` (set by `test:smoke`) skips the local webServer so smoke can
// run against production without a local build.

const PROD = process.env.SMOKE_BASE_URL || 'https://storytimewitheva.com';
const LOCAL = 'http://localhost:4173';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  projects: [
    {
      name: 'smoke',
      testMatch: /smoke\.spec\.ts/,
      // Hits live production; retry transient network/throttle failures.
      retries: 2,
      use: { baseURL: PROD, ...devices['Desktop Chrome'] },
    },
    {
      name: 'local',
      testIgnore: /smoke\.spec\.ts/,
      use: { baseURL: LOCAL, ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: LOCAL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
