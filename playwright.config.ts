import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL ?? 'https://wtfqsbkm.elementor.cloud';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  /* Retry on CI, run serially on local to avoid hammering the remote host */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],

  // Remove {platform} from the snapshot path so the same baseline PNG is used
  // on both macOS (local) and Linux (CI).  The browser engine renders HTML/CSS
  // identically across platforms, so cross-OS pixel drift is negligible.
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',

  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
