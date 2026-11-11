import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
        viewport: { width: 1180, height: 820 },
      },
    },
    {
      name: "ipad-webkit",
      use: {
        ...devices["iPad Pro 11"],
        viewport: { width: 1194, height: 834 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "npm run build && npm exec vite preview -- --host 0.0.0.0",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
