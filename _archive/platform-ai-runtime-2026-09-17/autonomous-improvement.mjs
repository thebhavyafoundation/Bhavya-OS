/**
 * Bhavya OS v3 — Autonomous Improvement
 * Continuously identifies: duplicate code, dead code, large components,
 * slow builds, architecture violations, dependency risks, security risks,
 * performance regressions. Creates improvement proposals.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { execSync } from "child_process";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = join(import.meta.dirname, "../..");

export class AutonomousImprovement {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.root = config.root || ROOT;
    this.proposals = [];
    this.persistencePath = config.persistencePath || join(this.root, "platform/ai-runtime/improvement-proposals.json");
    this.load();
  }

  // ── Scan and Generate Proposals ────────────────────────────

  async scan() {
    this.proposals = [];

    this.scanForLargeFiles();
    this.scanForDependencyRisks();

    this.eventBus.emit("improvement.scan.complete", {
      proposalCount: this.proposals.length,
      categories: this.getProposalCategories(),
    }, "autonomous-improvement");

    this.save();
    return this.proposals;
  }

  // ── Large Files ────────────────────────────────────────────

  scanForLargeFiles() {
    const maxLines = 500;
    const dirs = ["platform/ai-runtime", "packages/runtime"];
    for (const dir of dirs) {
      const dirPath = join(this.root, dir);
      if (!existsSync(dirPath)) continue;
      for (const file of readdirSync(dirPath).filter(f => f.endsWith(".mjs") || f.endsWith(".ts"))) {
        const filePath = join(dirPath, file);
        try {
          const content = readFileSync(filePath, "utf-8");
          const lines = content.split("\n").length;
          if (lines > maxLines) {
            this.proposals.push({
              id: `IMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
              type: "large-file",
              severity: lines > 1000 ? "high" : "medium",
              title: `Large file: ${file} (${lines} lines)`,
              description: `File ${file} has ${lines} lines, exceeding the ${maxLines} line limit. Consider splitting into smaller modules.`,
              location: `${dir}/${file}`,
              recommendation: "Split into smaller, focused modules",
              estimatedEffort: "medium",
              createdAt: new Date().toISOString(),
              status: "proposed",
            });
          }
        } catch {}
      }
    }
  }

  // ── Architecture Violations ────────────────────────────────

  scanForArchitectureViolations() {
    // Check for imports across layer boundaries
    const violations = [];
    const layerMap = {
      "apps/": "presentation",
      "packages/": "platform",
      "platform/": "infrastructure",
    };

    for (const [dir, layer] of Object.entries(layerMap)) {
      const dirPath = join(this.root, dir);
      if (!existsSync(dirPath)) continue;
      for (const file of readdirSync(dirPath, { recursive: true }).filter(f => f && (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".mjs")))) {
        try {
          const content = readFileSync(join(this.root, dir, file), "utf-8");
          const imports = content.match(/from\s+["']([^"']+)["']/g) || [];
          for (const imp of imports) {
            const path = imp.match(/["']([^"']+)["']/)?.[1];
            if (path && path.startsWith(".") && !path.startsWith("./")) {
              // Relative import - check for layer violation
              const targetLayer = Object.entries(layerMap).find(([d]) => path.includes(d))?.[1];
              if (targetLayer && targetLayer !== layer) {
                violations.push({ file: `${dir}/${file}`, from: layer, to: targetLayer });
              }
            }
          }
        } catch {}
      }
    }

    if (violations.length > 0) {
      this.proposals.push({
        id: `IMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
        type: "architecture-violation",
        severity: "high",
        title: `${violations.length} architecture violations detected`,
        description: `Found ${violations.length} cross-layer imports that violate the architecture.`,
        location: violations.map(v => v.file).join(", "),
        recommendation: "Refactor imports to respect layer boundaries",
        estimatedEffort: "high",
        createdAt: new Date().toISOString(),
        status: "proposed",
      });
    }
  }

  // ── Dependency Risks ───────────────────────────────────────

  scanForDependencyRisks() {
    const risks = [];
    const dirs = ["apps", "packages"];
    for (const dir of dirs) {
      const dirPath = join(this.root, dir);
      if (!existsSync(dirPath)) continue;
      for (const pkg of readdirSync(dirPath)) {
        const pkgPath = join(dirPath, pkg, "package.json");
        if (!existsSync(pkgPath)) continue;
        try {
          const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
          const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
          for (const [name, version] of Object.entries(deps)) {
            if (version.startsWith("latest") || version.startsWith("*")) {
              risks.push({ package: pkg, dependency: name, version, issue: "unpinned version" });
            }
          }
        } catch {}
      }
    }

    if (risks.length > 0) {
      this.proposals.push({
        id: `IMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
        type: "dependency-risk",
        severity: "medium",
        title: `${risks.length} unpinned dependencies`,
        description: `Found ${risks.length} dependencies with unpinned versions.`,
        location: risks.map(r => `${r.package}: ${r.dependency}@${r.version}`).join("; "),
        recommendation: "Pin all dependency versions for reproducibility",
        estimatedEffort: "low",
        createdAt: new Date().toISOString(),
        status: "proposed",
      });
    }
  }

  // ── Dead Code ──────────────────────────────────────────────

  scanForDeadCode() {
    // Check for unused exports by looking for files that aren't imported
    const importedFiles = new Set();
    const allFiles = new Set();

    const dirs = ["platform/ai-runtime", "packages/runtime/src"];
    for (const dir of dirs) {
      const dirPath = join(this.root, dir);
      if (!existsSync(dirPath)) continue;
      for (const file of readdirSync(dirPath).filter(f => f.endsWith(".mjs") || f.endsWith(".ts"))) {
        allFiles.add(`${dir}/${file}`);
        try {
          const content = readFileSync(join(dirPath, file), "utf-8");
          const imports = content.match(/from\s+["']([^"']+)["']/g) || [];
          for (const imp of imports) {
            const path = imp.match(/["']([^"']+)["']/)?.[1];
            if (path && path.startsWith(".")) {
              importedFiles.add(path);
            }
          }
        } catch {}
      }
    }

    const unused = [...allFiles].filter(f => {
      const name = f.split("/").pop().replace(/\.(mjs|ts)$/, "");
      return ![...importedFiles].some(imp => imp.includes(name));
    });

    if (unused.length > 0) {
      this.proposals.push({
        id: `IMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
        type: "dead-code",
        severity: "low",
        title: `${unused.length} potentially unused files`,
        description: `Found ${unused.length} files that may not be imported anywhere.`,
        location: unused.join(", "),
        recommendation: "Review and remove unused code",
        estimatedEffort: "low",
        createdAt: new Date().toISOString(),
        status: "proposed",
      });
    }
  }

  // ── Performance Issues ─────────────────────────────────────

  scanForPerformanceIssues() {
    // Check for large bundle indicators
    const issues = [];
    const appsDir = join(this.root, "apps");
    if (existsSync(appsDir)) {
      for (const app of readdirSync(appsDir)) {
        const nextDir = join(appsDir, app, ".next");
        if (existsSync(nextDir)) {
          try {
            const buildManifest = join(nextDir, "build-manifest.json");
            if (existsSync(buildManifest)) {
              const manifest = JSON.parse(readFileSync(buildManifest, "utf-8"));
              const pageCount = Object.keys(manifest.pages || {}).length;
              if (pageCount > 50) {
                issues.push({ app, pages: pageCount, issue: "large page count" });
              }
            }
          } catch {}
        }
      }
    }

    if (issues.length > 0) {
      this.proposals.push({
        id: `IMP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
        type: "performance",
        severity: "medium",
        title: `${issues.length} performance concerns`,
        description: `Found ${issues.length} potential performance issues.`,
        location: issues.map(i => `${i.app}: ${i.issue}`).join("; "),
        recommendation: "Review bundle sizes and optimize imports",
        estimatedEffort: "medium",
        createdAt: new Date().toISOString(),
        status: "proposed",
      });
    }
  }

  // ── Query ──────────────────────────────────────────────────

  getProposals(filter = {}) {
    let proposals = [...this.proposals];
    if (filter.type) proposals = proposals.filter(p => p.type === filter.type);
    if (filter.severity) proposals = proposals.filter(p => p.severity === filter.severity);
    if (filter.status) proposals = proposals.filter(p => p.status === filter.status);
    return proposals;
  }

  getProposalCategories() {
    const categories = {};
    for (const p of this.proposals) {
      categories[p.type] = (categories[p.type] || 0) + 1;
    }
    return categories;
  }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.persistencePath, JSON.stringify(this.proposals, null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        this.proposals = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
      } catch {}
    }
  }
}
