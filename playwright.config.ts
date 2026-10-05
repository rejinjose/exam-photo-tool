import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: true,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:4321",
  },
  webServer: {
    // --ignore-lock keeps this in the foreground: astro preview auto-backgrounds
    // itself (so it won't block AI coding agents), which breaks Playwright's
    // assumption that webServer's command stays in the foreground.
    command: "npm run build && npm run preview -- --ignore-lock",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 800 },
      },
    },
  ],
});
