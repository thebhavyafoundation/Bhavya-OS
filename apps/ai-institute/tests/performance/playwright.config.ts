import { defineConfig, devices } from "playwright/test";

export default defineConfig({
  testDir: "./",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    // Remote-first: default to the deployed Cloudflare URL so cloud runners
    // never depend on a local dev server (machine contract: verification runs
    // remotely, not on the control-center laptop). Override with BASE_URL for
    // a specific preview worker, e.g.
    //   BASE_URL=https://bhavya-foundation-preview.<account>.workers.dev
    baseURL:
      process.env.BASE_URL ||
      "https://bhavya-foundation.thebhavyafoundation.workers.dev",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
    },
  ],
  webServer: undefined,
});
