import { defineConfig } from "vitest/config";

// The kernel historically carried "custom harness" test files that export
// classes rather than vitest suites; vitest treats a file without a suite as a
// failure. Only `*.spec.ts` is collected, and the legacy `*.test.ts` files are
// excluded explicitly so that widening the include pattern later (the repo
// convention elsewhere is `*.test.ts`) cannot silently collect them.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"],
    exclude: ["src/**/*.test.ts", "node_modules/**", "dist/**"],
    globals: false,
    testTimeout: 15000,
  },
});
