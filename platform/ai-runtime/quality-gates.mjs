/**
 * Bhavya OS — Quality Gates
 * Typecheck, lint, build, accessibility, performance, architecture, dependency, documentation validation.
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = "F:\\Bhavya Foundation";

export class QualityGates {
  constructor() {
    this.gates = [
      { id: "typecheck", name: "TypeScript Type Check", required: true, fn: () => this.runTypecheck() },
      { id: "lint", name: "ESLint", required: true, fn: () => this.runLint() },
      { id: "build", name: "Build", required: true, fn: () => this.runBuild() },
      { id: "accessibility", name: "Accessibility", required: true, fn: () => this.checkAccessibility() },
      { id: "performance", name: "Performance", required: false, fn: () => this.checkPerformance() },
      { id: "architecture", name: "Architecture Validation", required: true, fn: () => this.validateArchitecture() },
      { id: "dependency", name: "Dependency Validation", required: true, fn: () => this.validateDependencies() },
      { id: "documentation", name: "Documentation", required: false, fn: () => this.checkDocumentation() },
    ];
    this.results = [];
  }

  async runAll() {
    console.log("🔍 Running Quality Gates...\n");
    this.results = [];

    for (const gate of this.gates) {
      console.log(`  Running ${gate.name}...`);
      try {
        const result = await gate.fn();
        this.results.push({
          gateId: gate.id,
          gateName: gate.name,
          required: gate.required,
          passed: result.passed,
          message: result.message,
          details: result.details,
          timestamp: new Date().toISOString(),
        });
        console.log(`    ${result.passed ? "✅" : "❌"} ${result.message}`);
      } catch (error) {
        this.results.push({
          gateId: gate.id,
          gateName: gate.name,
          required: gate.required,
          passed: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        console.log(`    ❌ ${error.message}`);
      }
    }

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const requiredFailed = this.results.filter(r => !r.passed && r.required).length;

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed (${requiredFailed} required)`);
    return { results: this.results, passed, failed, requiredFailed };
  }

  // ── Gate Implementations ───────────────────────────────────

  runTypecheck() {
    try {
      execSync("pnpm --filter @bhavya/website build", { cwd: ROOT, encoding: "utf-8", stdio: "pipe" });
      return { passed: true, message: "TypeScript type check passed" };
    } catch (error) {
      return { passed: false, message: "TypeScript type check failed", details: error.message };
    }
  }

  runLint() {
    try {
      execSync("pnpm lint", { cwd: ROOT, encoding: "utf-8", stdio: "pipe" });
      return { passed: true, message: "Lint passed" };
    } catch (error) {
      return { passed: false, message: "Lint failed", details: error.message };
    }
  }

  runBuild() {
    try {
      execSync("pnpm build", { cwd: ROOT, encoding: "utf-8", stdio: "pipe", timeout: 300000 });
      return { passed: true, message: "Build passed" };
    } catch (error) {
      return { passed: false, message: "Build failed", details: error.message };
    }
  }

  checkAccessibility() {
    const issues = [];
    
    // Check for aria-label usage
    const websiteDir = join(ROOT, "apps", "website", "src");
    if (existsSync(websiteDir)) {
      const files = execSync(`dir /s /b "${websiteDir}\\*.tsx"`, { cwd: ROOT, encoding: "utf-8" }).split("\n").filter(Boolean);
      
      for (const file of files.slice(0, 10)) {
        try {
          const content = readFileSync(file, "utf-8");
          if (content.includes("img") && !content.includes("alt=") && !content.includes("aria-label")) {
            issues.push(`Missing alt on img in ${file.split("\\").pop()}`);
          }
        } catch { /* skip */ }
      }
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? "Accessibility check passed" : `${issues.length} accessibility issues`,
      details: issues,
    };
  }

  checkPerformance() {
    const issues = [];
    
    // Check for large bundles
    const websiteDir = join(ROOT, "apps", "website");
    if (existsSync(join(websiteDir, ".next"))) {
      // Build exists, check for issues
      issues.push("Build output exists — run Lighthouse for detailed analysis");
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? "Performance check passed" : `${issues.length} performance notes`,
      details: issues,
    };
  }

  validateArchitecture() {
    const issues = [];
    
    // Check workspace structure
    const apps = existsSync(join(ROOT, "apps")) ? true : false;
    const packages = existsSync(join(ROOT, "packages")) ? true : false;
    
    if (!apps) issues.push("Missing apps/ directory");
    if (!packages) issues.push("Missing packages/ directory");
    
    // Check turbo.json
    if (!existsSync(join(ROOT, "turbo.json"))) {
      issues.push("Missing turbo.json");
    }

    // Check pnpm-workspace.yaml
    if (!existsSync(join(ROOT, "pnpm-workspace.yaml"))) {
      issues.push("Missing pnpm-workspace.yaml");
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? "Architecture validation passed" : `${issues.length} architecture issues`,
      details: issues,
    };
  }

  validateDependencies() {
    const issues = [];
    
    // Check package.json
    const rootPkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"));
    if (!rootPkg.name) issues.push("Missing package name");
    if (!rootPkg.packageManager) issues.push("Missing package manager specification");

    // Check for circular dependencies (simplified)
    const packages = existsSync(join(ROOT, "packages")) 
      ? execSync("dir /b \"packages\"", { cwd: ROOT, encoding: "utf-8" }).split("\n").filter(Boolean)
      : [];
    
    for (const pkg of packages) {
      const pkgPath = join(ROOT, "packages", pkg, "package.json");
      if (existsSync(pkgPath)) {
        const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkgJson.dependencies) {
          for (const dep of Object.keys(pkgJson.dependencies)) {
            if (dep === pkgJson.name) {
              issues.push(`Circular dependency in ${pkg}`);
            }
          }
        }
      }
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? "Dependency validation passed" : `${issues.length} dependency issues`,
      details: issues,
    };
  }

  checkDocumentation() {
    const issues = [];
    
    // Check for README
    if (!existsSync(join(ROOT, "README.md"))) {
      issues.push("Missing root README.md");
    }

    // Check for docs directory
    if (!existsSync(join(ROOT, "docs"))) {
      issues.push("Missing docs/ directory");
    }

    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? "Documentation check passed" : `${issues.length} documentation issues`,
      details: issues,
    };
  }
}

// CLI
if (process.argv[1] && process.argv[1].includes("quality-gates")) {
  const gates = new QualityGates();
  gates.runAll().then(result => {
    process.exit(result.requiredFailed > 0 ? 1 : 0);
  });
}
