import { defineConfig } from '@playwright/test';

const offline = process.env.PLAYWRIGHT_OFFLINE === '1';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: offline ? 'https://foradatela.test' : 'http://127.0.0.1:3187',
    browserName: 'chromium',
    launchOptions: process.platform === 'win32' ? { channel: 'msedge' } : {},
    serviceWorkers: 'block',
  },
  webServer: offline ? undefined : {
    command: 'npm run start -- --port 3187',
    url: 'http://127.0.0.1:3187',
    reuseExistingServer: false,
    timeout: 30000,
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
  ],
});
