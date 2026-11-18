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
 * asserts it exits 0 for the real workflows, and exits non-zero for
 * synthetically bad workflows (negative coverage).
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { join, sep } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

const WORKSPACE_ROOT = join(__dirname, "..", "..", "..", "..", "..");
const WORKFLOWS_DIR = join(WORKSPACE_ROOT, ".github/workflows");
const EXPECTED_GROUP = "opennext-preview-shared-worker";

function runValidator(cwd: string, workflowsDir: string): { code: number; output: string } {
  try {
    const output = execFileSync(
      "node",
      ["scripts/validate-preview-concurrency.mjs"],
      {
        cwd,
        encoding: "utf-8",
        maxBuffer: 1024 * 1024,
        env: { ...process.env, WORKFLOWS_DIR: workflowsDir },
      },
    ).toString();
    return { code: 0, output };
  } catch (err) {
    const output =
      (err.stdout ?? "").toString() + (err.stderr ?? "").toString();
    return { code: err.status ?? 1, output };
  }
}

/**
 * Write a temporary workflow file into a workflows dir and return its path.
 * Creates the .github/workflows/ subdirectory because the validator reads
 * from <cwd>/.github/workflows/.
 */
function writeBadWorkflow(
  dir: string,
  name: string,
  content: string,
): string {
  const workflowsDir = join(dir, ".github", "workflows");
  if (!existsSync(workflowsDir)) {
    mkdirSync(workflowsDir, { recursive: true });
  }
  const path = join(workflowsDir, name);
  writeFileSync(path, content, "utf-8");
  return path;
}

const PREVIEW_DEPLOY_STEP = `
      - name: Deploy preview worker
        working-directory: apps/ai-institute
        run: npx wrangler deploy --config wrangler.preview.json
        env:
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
`;

describe("preview deployment concurrency", () => {
  it("serializes all preview deployments on the shared worker", () => {
    const { code, output } = runValidator(WORKSPACE_ROOT, WORKFLOWS_DIR);

    expect(code).toBe(0);
    expect(output).toContain("PASS");
    expect(output).toContain(EXPECTED_GROUP);
  });

  it("rejects a per-PR concurrency group", () => {
    const dir = mkdtempSync(join(tmpdir(), "preview-concurrency-test-"));
    try {
      writeBadWorkflow(
        dir,
        "bad-per-pr.yml",
        `name: Bad per-PR preview\non:\n  pull_request:\n    paths: ["apps/**"]\nconcurrency:\n  group: opennext-preview-\${{ github.event.pull_request.number }}\n  cancel-in-progress: false\npermissions:\n  contents: read\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n${PREVIEW_DEPLOY_STEP}`,
      );

      const { code, output } = runValidator(WORKSPACE_ROOT, join(dir, ".github", "workflows"));

      expect(code).not.toBe(0);
      expect(output).toContain("FAIL");
      expect(output).toContain("opennext-preview-\${{");
      expect(output).toContain(`expected "${EXPECTED_GROUP}"`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects cancel-in-progress: true", () => {
    const dir = mkdtempSync(join(tmpdir(), "preview-concurrency-test-"));
    try {
      writeBadWorkflow(
        dir,
        "bad-cancel.yml",
        `name: Bad cancel preview\non:\n  pull_request:\n    paths: ["apps/**"]\nconcurrency:\n  group: ${EXPECTED_GROUP}\n  cancel-in-progress: true\npermissions:\n  contents: read\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n${PREVIEW_DEPLOY_STEP}`,
      );

      const { code, output } = runValidator(WORKSPACE_ROOT, join(dir, ".github", "workflows"));

      expect(code).not.toBe(0);
      expect(output).toContain("FAIL");
      expect(output).toContain("cancel-in-progress");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects a missing concurrency block", () => {
    const dir = mkdtempSync(join(tmpdir(), "preview-concurrency-test-"));
    try {
      writeBadWorkflow(
        dir,
        "bad-no-concurrency.yml",
        `name: Bad no-concurrency preview\non:\n  pull_request:\n    paths: ["apps/**"]\npermissions:\n  contents: read\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n${PREVIEW_DEPLOY_STEP}`,
      );

      const { code, output } = runValidator(WORKSPACE_ROOT, join(dir, ".github", "workflows"));

      expect(code).not.toBe(0);
      expect(output).toContain("FAIL");
      expect(output).toContain("MISSING");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects a wrong concurrency group name", () => {
    const dir = mkdtempSync(join(tmpdir(), "preview-concurrency-test-"));
    try {
      writeBadWorkflow(
        dir,
        "bad-wrong-group.yml",
        `name: Bad wrong-group preview\non:\n  pull_request:\n    paths: ["apps/**"]\nconcurrency:\n  group: opennext-preview-other-group\n  cancel-in-progress: false\npermissions:\n  contents: read\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n${PREVIEW_DEPLOY_STEP}`,
      );

      const { code, output } = runValidator(WORKSPACE_ROOT, join(dir, ".github", "workflows"));

      expect(code).not.toBe(0);
      expect(output).toContain("FAIL");
      expect(output).toContain("opennext-preview-other-group");
      expect(output).toContain(`expected "${EXPECTED_GROUP}"`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
