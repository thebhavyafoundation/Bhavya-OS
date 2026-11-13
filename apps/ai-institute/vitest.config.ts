import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: true,
    setupFiles: ["src/lib/__tests__/setup.ts"],
    testTimeout: 10000,
  },
  // The app compiles JSX with the automatic runtime (Next.js does the same),
  // but the tsconfig leaves `jsx` as "preserve" for the Next build. Without
  // this, a component under test is compiled with the classic runtime and
  // fails with "React is not defined".
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
