import { defineConfig, devices } from "playwright/test";

const PORT = Number(process.env.FIXTURE_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Harness for the component proof fixture.
 *
 * The fixture is a static surface built by build.mjs and served by
 * serve.mjs. Both run on the remote runner only; nothing here reaches a
 * deployed environment.
 */
export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "fixture-report", open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: devices["Desktop Chrome"],
    },
  ],
  webServer: {
    command: "node serve.mjs",
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
