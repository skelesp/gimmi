import { defineConfig, devices } from '@playwright/test';

// De smoketests draaien standaard tegen de gedeelde testomgeving (gimmi-test + test-gimmi).
// Elke run registreert nieuwe gebruikers met een uniek e-mailadres en laat ze achter.
// Andere omgeving: E2E_BASE_URL=http://localhost:4200 npm run e2e
export default defineConfig({
  testDir: './e2e',
  // De flows bouwen op elkaar (registreren -> reserveren -> feedback), dus niet parallel.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'https://gimmi-test.pages.dev',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'nl-BE'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
