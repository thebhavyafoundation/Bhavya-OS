import { defineConfig } from "vitest/config";

// The kernel historically carried "custom harness" test files that export
// classes rather than vitest suites; vitest treats a file without a suite as a
// failure. Only `*.spec.ts` is collected here, so those legacy harnesses are
// left untouched while the executable specifications run.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"],
    globals: false,
    testTimeout: 15000,
  },
});
