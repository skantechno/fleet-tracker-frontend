import { defineConfig, devices } from '@playwright/test'

// End-to-end tests run against the live app + backend.
// Prerequisites: the fleet-tracker-backend (port 3000) and its simulator must
// be running and seeded. This config starts the Vite dev server automatically
// (reusing an already-running one) but does NOT start the backend.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
