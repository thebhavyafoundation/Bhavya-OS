/**
 * Bhavya OS — Git Worktree Manager
 * Every coding worker receives its own worktree, its own branch,
 * isolated filesystem. No worker edits the main repository.
 * Merge only after successful review.
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";
const WORKTREES_DIR = join(ROOT, ".worktrees");

export class WorktreeManager {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.root = config.root || ROOT;
    this.worktreesDir = config.worktreesDir || WORKTREES_DIR;
    this.worktrees = new Map();
    this.persistencePath = config.persistencePath || join(this.worktreesDir, "worktrees.json");
    this.load();
  }

  // ── Create Worktree ─────────────────────────────────────────

  create(workerId, options = {}) {
    const branchName = options.branch || `worker/${workerId}/${Date.now()}`;
    const worktreeId = `wt-${workerId}-${Date.now()}`;
    const worktreePath = join(this.worktreesDir, worktreeId);

    mkdirSync(this.worktreesDir, { recursive: true });

    try {
      // Create branch if it doesn't exist
      try {
        execSync(`git branch ${branchName}`, {
          cwd: this.root,
          encoding: "utf-8",
          stdio: "pipe",
          shell: "powershell.exe",
        });
      } catch {
        // Branch may already exist
      }

      // Create worktree
      execSync(`git worktree add "${worktreePath}" ${branchName}`, {
        cwd: this.root,
        encoding: "utf-8",
        stdio: "pipe",
        shell: "powershell.exe",
      });

      const worktree = {
        id: worktreeId,
        workerId,
        path: worktreePath,
        branch: branchName,
        createdAt: new Date().toISOString(),
        status: "active",
        filesModified: [],
        lastCommit: null,
      };

      this.worktrees.set(worktreeId, worktree);
      this.save();

      this.eventBus.emit("worktree.created", {
        worktreeId,
        workerId,
        path: worktreePath,
        branch: branchName,
      }, "worktree-manager");

      console.log(`🌿 Worktree created: ${worktreeId} (branch: ${branchName})`);
      return worktree;
    } catch (error) {
      console.error(`Failed to create worktree for ${workerId}:`, error.message);
      throw error;
    }
  }

  // ── Remove Worktree ─────────────────────────────────────────

  remove(worktreeId) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) return false;

    try {
      execSync(`git worktree remove "${worktree.path}" --force`, {
        cwd: this.root,
        encoding: "utf-8",
        stdio: "pipe",
        shell: "powershell.exe",
      });

      // Delete branch
      try {
        execSync(`git branch -D ${worktree.branch}`, {
          cwd: this.root,
          encoding: "utf-8",
          stdio: "pipe",
          shell: "powershell.exe",
        });
      } catch {
        // Branch may not exist
      }

      worktree.status = "removed";
      this.worktrees.delete(worktreeId);
      this.save();

      this.eventBus.emit("worktree.removed", {
        worktreeId,
        workerId: worktree.workerId,
        branch: worktree.branch,
      }, "worktree-manager");

      console.log(`🌿 Worktree removed: ${worktreeId}`);
      return true;
    } catch (error) {
      console.error(`Failed to remove worktree ${worktreeId}:`, error.message);
      return false;
    }
  }

  // ── Commit in Worktree ──────────────────────────────────────

  commit(worktreeId, message, files = []) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) throw new Error(`Worktree ${worktreeId} not found`);

    try {
      if (files.length > 0) {
        execSync(`git add ${files.join(" ")}`, {
          cwd: worktree.path,
          encoding: "utf-8",
          stdio: "pipe",
          shell: "powershell.exe",
        });
      } else {
        execSync("git add -A", {
          cwd: worktree.path,
          encoding: "utf-8",
          stdio: "pipe",
          shell: "powershell.exe",
        });
      }

      execSync(`git commit -m "${message}"`, {
        cwd: worktree.path,
        encoding: "utf-8",
        stdio: "pipe",
        shell: "powershell.exe",
      });

      const hash = execSync("git rev-parse HEAD", {
        cwd: worktree.path,
        encoding: "utf-8",
        shell: "powershell.exe",
      }).trim();

      worktree.lastCommit = hash;
      worktree.filesModified = [];
      this.save();

      this.eventBus.emit("worktree.committed", {
        worktreeId,
        workerId: worktree.workerId,
        branch: worktree.branch,
        commit: hash,
        message,
      }, "worktree-manager");

      return hash;
    } catch (error) {
      console.error(`Commit failed in worktree ${worktreeId}:`, error.message);
      throw error;
    }
  }

  // ── Get Diff ────────────────────────────────────────────────

  getDiff(worktreeId) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) throw new Error(`Worktree ${worktreeId} not found`);

    try {
      return execSync("git diff --stat", {
        cwd: worktree.path,
        encoding: "utf-8",
        shell: "powershell.exe",
      });
    } catch {
      return "";
    }
  }

  // ── Merge to Main ───────────────────────────────────────────

  mergeToMain(worktreeId) {
    const worktree = this.worktrees.get(worktreeId);
    if (!worktree) throw new Error(`Worktree ${worktreeId} not found`);

    try {
      // Stash any uncommitted changes
      execSync("git stash", {
        cwd: worktree.path,
        encoding: "utf-8",
        stdio: "pipe",
        shell: "powershell.exe",
      });

      // Merge branch into main
      execSync(`git checkout master && git merge ${worktree.branch} --no-ff -m "Merge ${worktree.branch} into master"`, {
        cwd: this.root,
        encoding: "utf-8",
        stdio: "pipe",
        shell: "powershell.exe",
      });

      this.eventBus.emit("worktree.merged", {
        worktreeId,
        workerId: worktree.workerId,
        branch: worktree.branch,
        targetBranch: "master",
      }, "worktree-manager");

      console.log(`🌿 Worktree merged: ${worktreeId} → master`);
      return true;
    } catch (error) {
      console.error(`Merge failed for worktree ${worktreeId}:`, error.message);
      throw error;
    }
  }

  // ── List Worktrees ──────────────────────────────────────────

  list() {
    return [...this.worktrees.values()];
  }

  getByWorker(workerId) {
    return [...this.worktrees.values()].filter(w => w.workerId === workerId);
  }

  // ── Status ──────────────────────────────────────────────────

  getStats() {
    const worktrees = [...this.worktrees.values()];
    return {
      total: worktrees.length,
      active: worktrees.filter(w => w.status === "active").length,
      removed: worktrees.filter(w => w.status === "removed").length,
      worktrees,
    };
  }

  // ── Persistence ─────────────────────────────────────────────

  save() {
    mkdirSync(join(this.persistencePath, ".."), { recursive: true });
    writeFileSync(this.persistencePath, JSON.stringify([...this.worktrees.values()], null, 2));
  }

  load() {
    if (existsSync(this.persistencePath)) {
      try {
        const data = JSON.parse(readFileSync(this.persistencePath, "utf-8"));
        for (const wt of data) {
          this.worktrees.set(wt.id, wt);
        }
      } catch {
        this.worktrees = new Map();
      }
    }
  }
}
