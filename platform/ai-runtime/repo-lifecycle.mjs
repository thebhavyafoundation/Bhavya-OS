/**
 * Bhavya OS v3 — Repository Lifecycle
 * Continuously observes: Repository, Git, GitHub, Workspace,
 * Dependencies, Applications, Packages, Branches, Worktrees.
 * Generates a live repository state.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, relative, extname } from "path";
import { execSync } from "child_process";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = join(import.meta.dirname, "../..");

export class RepositoryLifecycle {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.root = config.root || ROOT;
    this.state = this.getInitialState();
    this.observers = [];
    this.pollInterval = null;
    this.persistencePath = config.persistencePath || join(this.root, "platform/ai-runtime/repo-lifecycle-state.json");
    this.load();
  }

  getInitialState() {
    return {
      timestamp: new Date().toISOString(),
      repository: { name: "Bhavya-OS", defaultBranch: "master", isDirty: false },
      git: { branch: "master", commitCount: 0, lastCommit: null, uncommittedChanges: 0, branches: [] },
      github: { remoteUrl: "", organization: "thebhavyafoundation", repository: "Bhavya-OS" },
      workspace: { totalFiles: 0, totalDirs: 0, totalPackages: 0, totalApps: 0 },
      dependencies: { total: 0, outdated: 0, vulnerable: 0 },
      applications: [],
      packages: [],
      branches: [],
      worktrees: [],
      health: { score: 100, issues: [] },
    };
  }

  // ── Observe ────────────────────────────────────────────────

  async observe() {
    this.state.timestamp = new Date().toISOString();

    this.observeGit();
    this.observeWorkspace();
    this.observeDependencies();
    this.observeApplications();
    this.observePackages();
    this.observeBranches();
    this.observeWorktrees();
    this.evaluateHealth();

    this.eventBus.emit("repository.lifecycle.observed", {
      timestamp: this.state.timestamp,
      health: this.state.health.score,
      files: this.state.workspace.totalFiles,
      packages: this.state.workspace.totalPackages,
    }, "repo-lifecycle");

    this.save();
    return this.state;
  }

  observeGit() {
    try {
      const branch = execSync("git rev-parse --abbrev-ref HEAD", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim();
      this.state.git.branch = branch;

      const commitCount = parseInt(execSync("git rev-list --count HEAD", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim());
      this.state.git.commitCount = commitCount;

      const lastCommit = execSync('git log -1 --format="%H|%s|%ai|%an"', {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim();
      const [hash, message, date, author] = lastCommit.split("|");
      this.state.git.lastCommit = { hash, message, date, author };

      const status = execSync("git status --porcelain", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim();
      this.state.git.uncommittedChanges = status ? status.split("\n").length : 0;
      this.state.repository.isDirty = this.state.git.uncommittedChanges > 0;

      const branches = execSync("git branch --list", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim().split("\n").filter(Boolean).map(b => b.replace("*", "").trim());
      this.state.git.branches = branches;
      this.state.branches = branches;
    } catch (e) {
      this.state.health.issues.push({ type: "git", message: e.message });
    }
  }

  observeWorkspace() {
    let files = 0, dirs = 0;
    const walk = (dir, depth = 0) => {
      if (depth > 6) return;
      try {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          if (["node_modules", ".git", ".turbo", ".next", "dist"].includes(entry.name)) continue;
          const full = join(dir, entry.name);
          if (entry.isDirectory()) { dirs++; walk(full, depth + 1); }
          else files++;
        }
      } catch {}
    };
    walk(this.root);
    this.state.workspace.totalFiles = files;
    this.state.workspace.totalDirs = dirs;

    const appsDir = join(this.root, "apps");
    const packagesDir = join(this.root, "packages");
    this.state.workspace.totalApps = existsSync(appsDir)
      ? readdirSync(appsDir).filter(d => existsSync(join(appsDir, d, "package.json"))).length : 0;
    this.state.workspace.totalPackages = existsSync(packagesDir)
      ? readdirSync(packagesDir).filter(d => existsSync(join(packagesDir, d, "package.json"))).length : 0;
  }

  observeDependencies() {
    let total = 0;
    const dirs = ["apps", "packages"];
    for (const dir of dirs) {
      const dirPath = join(this.root, dir);
      if (!existsSync(dirPath)) continue;
      for (const pkg of readdirSync(dirPath)) {
        const pkgJson = join(dirPath, pkg, "package.json");
        if (existsSync(pkgJson)) {
          try {
            const data = JSON.parse(readFileSync(pkgJson, "utf-8"));
            total += Object.keys(data.dependencies || {}).length;
            total += Object.keys(data.devDependencies || {}).length;
          } catch {}
        }
      }
    }
    this.state.dependencies.total = total;
  }

  observeApplications() {
    const appsDir = join(this.root, "apps");
    if (!existsSync(appsDir)) return;
    this.state.applications = [];
    for (const name of readdirSync(appsDir)) {
      const pkgPath = join(appsDir, name, "package.json");
      if (!existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        this.state.applications.push({
          name: pkg.name || name,
          path: `apps/${name}`,
          version: pkg.version || "0.0.0",
          type: "app",
          scripts: Object.keys(pkg.scripts || {}),
          depCount: Object.keys(pkg.dependencies || {}).length,
        });
      } catch {}
    }
  }

  observePackages() {
    const packagesDir = join(this.root, "packages");
    if (!existsSync(packagesDir)) return;
    this.state.packages = [];
    for (const name of readdirSync(packagesDir)) {
      const pkgPath = join(packagesDir, name, "package.json");
      if (!existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        this.state.packages.push({
          name: pkg.name || name,
          path: `packages/${name}`,
          version: pkg.version || "0.0.0",
          type: "package",
          scripts: Object.keys(pkg.scripts || {}),
          depCount: Object.keys(pkg.dependencies || {}).length,
        });
      } catch {}
    }
  }

  observeBranches() {
    try {
      const output = execSync("git branch -a --list", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim();
      this.state.branches = output.split("\n").filter(Boolean)
        .map(b => b.replace(/^\*?\s+/, "").trim())
        .filter(b => !b.startsWith("remotes/origin/HEAD"));
    } catch {}
  }

  observeWorktrees() {
    try {
      const output = execSync("git worktree list", {
        cwd: this.root, encoding: "utf-8", shell: "powershell.exe",
      }).trim();
      this.state.worktrees = output.split("\n").filter(Boolean).map(line => {
        const parts = line.split(/\s+/);
        return { path: parts[0], head: parts[1], branch: parts[2] || "detached" };
      });
    } catch {
      this.state.worktrees = [];
    }
  }

  evaluateHealth() {
    const issues = [];
    let score = 100;

    if (this.state.git.uncommittedChanges > 10) {
      issues.push({ type: "git", message: `${this.state.git.uncommittedChanges} uncommitted changes`, severity: "warning" });
      score -= 5;
    }
    if (this.state.repository.isDirty) {
      issues.push({ type: "git", message: "Working directory is dirty", severity: "info" });
    }
    if (this.state.dependencies.outdated > 0) {
      issues.push({ type: "dependencies", message: `${this.state.dependencies.outdated} outdated deps`, severity: "warning" });
      score -= 3;
    }

    this.state.health = { score: Math.max(0, score), issues };
  }

  // ── Query ──────────────────────────────────────────────────

  getState() { return { ...this.state }; }
  getHealth() { return this.state.health; }
  getBranches() { return this.state.branches; }
  getApplications() { return this.state.applications; }
  getPackages() { return this.state.packages; }

  // ── Persistence ────────────────────────────────────────────

  save() {
    writeFileSync(this.persistencePath, JSON.stringify(this.state, null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        this.state = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
      } catch {}
    }
  }
}
