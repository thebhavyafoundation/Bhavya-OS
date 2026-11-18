/**
 * Preview deployment concurrency validation.
 *
 * Ensures every GitHub Actions workflow capable of deploying to the shared
 * canonical preview worker (bhavya-foundation-preview) uses the same
 * concurrency group (opennext-preview-shared-worker) with
 * cancel-in-progress: false. A per-PR group lets different PRs deploy
 * concurrently to the same shared worker and overwrite each other.
 *
 * This test shells out to scripts/validate-preview-concurrency.mjs and
 * asserts it exits 0.
 */

import { execFileSync } from "node:child_process";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const WORKSPACE_ROOT = join(__dirname, "..", "..", "..", "..", "..");

describe("preview deployment concurrency", () => {
  it("serializes all preview deployments on the shared worker", () => {
    let output = "";
    try {
      output = execFileSync(
        "node",
        ["scripts/validate-preview-concurrency.mjs"],
        {
          cwd: WORKSPACE_ROOT,
          encoding: "utf-8",
          maxBuffer: 1024 * 1024,
        },
      ).toString();
    } catch (err) {
      output = (err.stdout ?? "").toString() + (err.stderr ?? "").toString();
      throw new Error(
        `preview concurrency validation failed:\n${output}\n` +
          "Ensure every workflow deploying to bhavya-foundation-preview uses " +
          `concurrency group "opennext-preview-shared-worker" with ` +
          "cancel-in-progress: false.",
      );
    }

    expect(output).toContain("PASS");
    expect(output).toContain("opennext-preview-shared-worker");
  });
});
