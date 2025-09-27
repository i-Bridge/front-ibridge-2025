import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run dev',   // 또는 npm run start (빌드된 앱 실행)
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // CI 아니면 이미 켜진 서버 재사용
  },
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});