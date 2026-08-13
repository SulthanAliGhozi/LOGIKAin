import { defineConfig, devices } from '@playwright/test'

const browserOptions = process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } } : {}
export default defineConfig({ testDir: './tests/e2e', use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' }, webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true }, projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], ...browserOptions } }] })
