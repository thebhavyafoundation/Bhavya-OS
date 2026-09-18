/**
 * Local repository state — read-only, server-only.
 *
 * Surfaces REAL git state of the Bhavya-OS checkout hosting this app.
 * Every command is read-only with a short timeout; any failure yields
 * `available: false` so the UI renders an honest unavailable state
 * instead of fabricated data. Never prints credentials (no remote URLs
 * with auth, no env values).
 *
 * @module local-repo-state
 */
import { execFileSync } from "node:child_process";
import { join } from "node:path";

export interface LocalRepoState {
  available: boolean;
  branch?: string;
  headSha?: string;
  headSubject?: string;
  clean?: boolean;
  ahead?: number;
  behind?: number;
  reason?: string;
}

function repoRoot(): string {
  // Next.js server runtime: process.cwd() is apps/ai-institute.
  return join(process.cwd(), "..", "..");
}

function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot(),
      timeout: 5000,
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

export function getLocalRepoState(): LocalRepoState {
  const branch = git(["branch", "--show-current"]);
  const headSha = git(["rev-parse", "--short=7", "HEAD"]);
  if (!branch || !headSha) {
    return { available: false, reason: "git unavailable in this runtime" };
  }
  const headSubject =
    git(["log", "-1", "--format=%s"])?.slice(0, 120) ?? undefined;
  const porcelain = git(["status", "--porcelain=v1"]);
  const upstream = git(["rev-list", "--left-right", "--count", "@{upstream}...HEAD"]);
  let ahead: number | undefined;
  let behind: number | undefined;
  if (upstream) {
    const [b, a] = upstream.split(/\s+/).map(Number);
    if (Number.isFinite(b) && Number.isFinite(a)) {
      behind = b;
      ahead = a;
    }
  }
  return {
    available: true,
    branch,
    headSha,
    headSubject,
    clean: porcelain === "",
    ahead,
    behind,
  };
}
