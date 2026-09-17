import { rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { defineConfig } from "vitest/config";

// Isolate tests from the tracked content/ tree: point BHAVYA_CONTENT_ROOT at
// a fresh temp dir (wiped on every run) so create* tests cannot mutate or
// create fixtures under the repository content/ directory.
const TEST_ROOT = join(tmpdir(), "bhavya-content-core-test");
rmSync(TEST_ROOT, { recursive: true, force: true });
process.env.BHAVYA_CONTENT_ROOT = TEST_ROOT;

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globals: true,
  },
});
