/**
 * Runtime API — Standalone entry point
 *
 * Starts the capability execution server on port 3100.
 * This is the canonical runtime API that the Lesson Studio connects to.
 *
 * Usage: node packages/runtime/cli/api-standalone.mjs
 *        # Or: pnpm run bhavya:api:verbose
 */

import { startServer } from "./api.mjs";
import { ROOT } from "../engine/config.mjs";

const PORT = parseInt(process.env.RUNTIME_PORT || "3100", 10);

console.log("");
console.log("╔═══════════════════════════════════════════════════╗");
console.log("║     Bhavya AI Lab OS Runtime API v3.1.0          ║");
console.log("║     Capability Execution Engine                   ║");
console.log("╚═══════════════════════════════════════════════════╝");
console.log("");

try {
  const server = await startServer(ROOT, PORT);
  console.log("");
  console.log(`Runtime ready at http://localhost:${PORT}`);
  console.log(`Health:   http://localhost:${PORT}/health`);
  console.log(`Caps:     http://localhost:${PORT}/capabilities`);
  console.log(`Courses:  http://localhost:${PORT}/courses`);
  console.log(`Lessons:  http://localhost:${PORT}/lessons`);
  console.log(`Example:  curl -X POST http://localhost:${PORT}/capability/lesson_generation -H "Content-Type: application/json" -d '{"input":{"id":"test","title":"Test","concepts":[]}}'`);
  console.log("");
  console.log("Press Ctrl+C to stop.");
  console.log("");
} catch (err) {
  console.error("Failed to start Runtime API:", err.message);
  process.exit(1);
}
