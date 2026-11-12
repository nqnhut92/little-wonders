import { defineConfig, devices } from "@playwright/test";
// Browser tests build into their own folder so a parallel `npm run build` cannot remove files
// mid-run. A second run in the same checkout (another agent or terminal) should set E2E_PORT and
// E2E_OUT_DIR to stay fully separate; otherwise it reuses the server that is already running.
const port = Number(process.env.E2E_PORT ?? 4173);
const outDir = process.env.E2E_OUT_DIR ?? "dist-e2e";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
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
    // Type checking has its own command, so the test build skips tsc.
    command: `npm exec vite build -- --outDir ${outDir} && npm exec vite preview -- --outDir ${outDir} --port ${port} --strictPort --host 0.0.0.0`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
