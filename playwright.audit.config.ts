import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: '**/runtime-audit.spec.ts',
  testIgnore: [],
  timeout: 240000,
  use: { ...base.use, baseURL: 'http://127.0.0.1:4176/py-path/' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176 --base /py-path/ --outDir .vite/runtime-audit --strictPort',
    url: 'http://127.0.0.1:4176/py-path/tests/runtime-audit.html',
    timeout: 30000,
  },
});
