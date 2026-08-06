/**
 * Bhavya OS v3 — Self Healing
 * Detects failing quality gates and automatically attempts fixes.
 * Handles: lint errors, type errors, build failures, missing dependencies,
 * import errors, format issues.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class SelfHealing {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.healingHistory = [];
    this.persistencePath = config.persistencePath || join(ROOT, "platform/ai-runtime/self-healing-state.json");
    this.load();
  }

  // ── Detect and Fix ─────────────────────────────────────────

  async diagnoseAndHeal(context = {}) {
    const results = { detected: [], healed: [], failed: [] };

    const issues = await this.detectIssues(context);
    results.detected = issues;

    for (const issue of issues) {
      try {
        const healed = await this.healIssue(issue);
        if (healed) {
          results.healed.push({ ...issue, healedAt: new Date().toISOString() });
        } else {
          results.failed.push({ ...issue, reason: "No fix available" });
        }
      } catch (error) {
        results.failed.push({ ...issue, reason: error.message });
      }
    }

    this.healingHistory.push({
      timestamp: Date.now(),
      context,
      detected: results.detected.length,
      healed: results.healed.length,
      failed: results.failed.length,
    });

    this.save();
    return results;
  }

  // ── Issue Detection ────────────────────────────────────────

  async detectIssues(context) {
    const issues = [];

    const importIssues = await this.detectImportIssues(context);
    issues.push(...importIssues);

    const depIssues = await this.detectDependencyIssues(context);
    issues.push(...depIssues);

    return issues;
  }

  async detectLintIssues(context) {
    const issues = [];
    try {
      const cwd = join(ROOT, context.appDir || "apps/lesson-studio");
      execSync("pnpm lint", { cwd, timeout: 15000, stdio: "pipe" });
    } catch (error) {
      const output = error.stderr?.toString() || error.stdout?.toString() || "";
      const matches = output.match(/(\S+):(\d+):(\d+)\s+error\s+(.*)/g) || [];
      for (const match of matches.slice(0, 5)) {
        issues.push({
          type: "lint",
          severity: "error",
          message: match,
          file: match.split(":")[0],
          line: parseInt(match.split(":")[1]) || 0,
          fixable: this.isLintFixable(match),
        });
      }
    }
    return issues;
  }

  isLintFixable(match) {
    const fixablePatterns = ["missing trailing comma", "unexpected trailing comma", "missing semicolons", "prettier"];
    return fixablePatterns.some(p => match.toLowerCase().includes(p));
  }

  async detectTypeIssues(context) {
    const issues = [];
    try {
      const cwd = join(ROOT, context.appDir || "apps/lesson-studio");
      execSync("pnpm typecheck", { cwd, timeout: 60000, stdio: "pipe" });
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || "";
      const matches = output.match(/error TS\d+:\s+(.*)/g) || [];
      for (const match of matches.slice(0, 5)) {
        issues.push({
          type: "typescript",
          severity: "error",
          message: match,
          fixable: this.isTypeFixable(match),
        });
      }
    }
    return issues;
  }

  isTypeFixable(match) {
    const fixablePatterns = ["implicitly has an 'any' type", "Parameter .* implicitly has an 'any' type", "Object is possibly 'undefined'"];
    return fixablePatterns.some(p => match.includes(p));
  }

  async detectBuildIssues(context) {
    const issues = [];
    try {
      const cwd = join(ROOT, context.appDir || "apps/lesson-studio");
      execSync("pnpm build", { cwd, timeout: 60000, stdio: "pipe" });
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || "";
      issues.push({
        type: "build",
        severity: "critical",
        message: output.slice(0, 500),
        fixable: false,
      });
    }
    return issues;
  }

  async detectImportIssues(context) {
    const issues = [];
    const runtimeDir = join(ROOT, "platform/ai-runtime");
    if (!existsSync(runtimeDir)) return issues;

    try {
      const fs = await import("fs");
      const files = fs.readdirSync(runtimeDir).filter(f => f.endsWith(".mjs") || f.endsWith(".ts"));
      for (const file of files) {
        try {
          const content = fs.readFileSync(join(runtimeDir, file), "utf-8");
          const imports = content.match(/from\s+["']([^"']+)["']/g) || [];
          for (const imp of imports) {
            const path = imp.match(/["']([^"']+)["']/)?.[1];
            if (path && path.startsWith(".")) {
              const resolved = join(runtimeDir, path);
              const exists = [".mjs", ".ts", ".js", "/index.mjs", "/index.ts"].some(ext => {
                try { return fs.statSync(resolved + ext).isFile(); } catch { return false; }
              });
              if (!exists) {
                issues.push({
                  type: "import",
                  severity: "error",
                  message: `Import not found: ${path} in ${file}`,
                  file,
                  fixable: false,
                });
              }
            }
          }
        } catch {}
      }
    } catch {}

    return issues;
  }

  async detectDependencyIssues(context) {
    const issues = [];
    const dirs = ["apps/lesson-studio", "packages/runtime"];
    for (const dir of dirs) {
      const pkgPath = join(ROOT, dir, "package.json");
      if (!existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        const nodeModules = join(ROOT, dir, "node_modules");
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        for (const dep of Object.keys(allDeps)) {
          if (!existsSync(join(nodeModules, dep))) {
            issues.push({
              type: "dependency",
              severity: "warning",
              message: `Missing dependency: ${dep} in ${dir}`,
              file: `${dir}/package.json`,
              fixable: true,
            });
          }
        }
      } catch {}
    }
    return issues;
  }

  // ── Issue Healing ──────────────────────────────────────────

  async healIssue(issue) {
    switch (issue.type) {
      case "lint":
        return this.healLintIssue(issue);
      case "typescript":
        return this.healTypeIssue(issue);
      case "dependency":
        return this.healDependencyIssue(issue);
      case "import":
        return this.healImportIssue(issue);
      default:
        return false;
    }
  }

  healLintIssue(issue) {
    if (!issue.fixable) return false;
    try {
      const cwd = join(ROOT, "apps/lesson-studio");
      execSync("pnpm lint --fix", { cwd, timeout: 30000, stdio: "pipe" });
      this.eventBus.emit("selfheal.lint.fixed", { issue }, "self-healing");
      return true;
    } catch {
      return false;
    }
  }

  healTypeIssue(issue) {
    // Type issues generally require manual intervention
    return false;
  }

  healDependencyIssue(issue) {
    try {
      const dir = issue.file.split("/").slice(0, 2).join("/");
      const cwd = join(ROOT, dir);
      execSync("pnpm install", { cwd, timeout: 60000, stdio: "pipe" });
      this.eventBus.emit("selfheal.dependency.fixed", { issue }, "self-healing");
      return true;
    } catch {
      return false;
    }
  }

  healImportIssue(issue) {
    // Import issues require code changes
    return false;
  }

  // ── Query ──────────────────────────────────────────────────

  getHistory(limit = 10) {
    return this.healingHistory.slice(-limit);
  }

  getStats() {
    return {
      totalAttempts: this.healingHistory.length,
      totalDetected: this.healingHistory.reduce((sum, h) => sum + h.detected, 0),
      totalHealed: this.healingHistory.reduce((sum, h) => sum + h.healed, 0),
      totalFailed: this.healingHistory.reduce((sum, h) => sum + h.failed, 0),
      successRate: this.healingHistory.length > 0
        ? Math.round((this.healingHistory.reduce((sum, h) => sum + h.healed, 0) / Math.max(1, this.healingHistory.reduce((sum, h) => sum + h.detected, 0))) * 100)
        : 0,
    };
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.persistencePath, JSON.stringify(this.healingHistory.slice(-50), null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        this.healingHistory = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
      } catch {}
    }
  }
}
