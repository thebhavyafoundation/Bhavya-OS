/**
 * Bhavya OS — File Watcher
 * Monitors repository changes and emits events through the Event Bus.
 * When files change, automatically updates Repository Index, Knowledge Graphs,
 * Component Registry, Dependency Graph.
 */

import { watch, readdirSync, statSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, relative, extname, basename } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";

const ROOT = "F:\\Bhavya Foundation";
const OUTPUT = join(ROOT, "platform", "repo-intelligence", "output");

export class FileWatcher {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.root = config.root || ROOT;
    this.watchers = new Map();
    this.debounceTimers = new Map();
    this.debounceMs = config.debounceMs || 300;
    this.running = false;
    this.changeBuffer = [];
    this.flushInterval = null;
    this.stats = {
      started: null,
      totalEvents: 0,
      fileCreated: 0,
      fileDeleted: 0,
      fileModified: 0,
      reindexCount: 0,
    };
  }

  // ── Start Watching ──────────────────────────────────────────

  start() {
    if (this.running) return;
    this.running = true;
    this.stats.started = new Date().toISOString();

    const dirs = [
      this.root,
      join(this.root, "apps"),
      join(this.root, "packages"),
      join(this.root, "platform"),
      join(this.root, "knowledge"),
      join(this.root, "memory"),
    ].filter(d => existsSync(d));

    for (const dir of dirs) {
      try {
        const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
          if (!filename) return;
          this.handleChange(eventType, filename);
        });
        this.watchers.set(dir, watcher);
      } catch (e) {
        console.warn(`FileWatcher: cannot watch ${dir}: ${e.message}`);
      }
    }

    // Flush buffer periodically
    this.flushInterval = setInterval(() => this.flushBuffer(), 1000);

    this.eventBus.emit(EventTypes.SYSTEM_STARTUP, {
      component: "FileWatcher",
      watchedDirs: dirs.length,
    }, "file-watcher");

    console.log(`👁️  FileWatcher: watching ${dirs.length} directories`);
  }

  // ── Stop Watching ───────────────────────────────────────────

  stop() {
    for (const [dir, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.running = false;
    console.log("👁️  FileWatcher: stopped");
  }

  // ── Handle Change ───────────────────────────────────────────

  handleChange(eventType, filename) {
    // Skip irrelevant files
    if (this.shouldSkip(filename)) return;

    const fullPath = join(this.root, filename);
    const relPath = relative(this.root, fullPath);
    const ext = extname(filename);

    this.changeBuffer.push({
      eventType,
      filename: relPath,
      ext,
      timestamp: Date.now(),
    });

    this.stats.totalEvents++;

    // Debounce rapid changes
    const key = relPath;
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    this.debounceTimers.set(key, setTimeout(() => {
      this.debounceTimers.delete(key);
      this.processChange(eventType, relPath, ext);
    }, this.debounceMs));
  }

  processChange(eventType, relPath, ext) {
    // Determine event type
    let busEvent;
    const isRoute = relPath.includes("/app/") && (relPath.includes("page.tsx") || relPath.includes("page.ts"));
    const isComponent = (ext === ".tsx" || ext === ".jsx") && (relPath.includes("/components/") || relPath.includes("/ui/"));
    const isDependency = basename(relPath) === "package.json";

    if (eventType === "rename") {
      // Check if file exists to determine create vs delete
      const fullPath = join(this.root, relPath);
      if (existsSync(fullPath)) {
        busEvent = EventTypes.FILE_CREATED;
        this.stats.fileCreated++;
      } else {
        busEvent = EventTypes.FILE_DELETED;
        this.stats.fileDeleted++;
      }
    } else {
      busEvent = EventTypes.FILE_MODIFIED;
      this.stats.fileModified++;
    }

    // Emit specific event
    this.eventBus.emit(busEvent, {
      path: relPath,
      extension: ext,
      isRoute,
      isComponent,
      isDependency,
    }, "file-watcher");

    // Emit composite event
    this.eventBus.emit(EventTypes.REPOSITORY_CHANGED, {
      type: busEvent,
      path: relPath,
      extension: ext,
      isRoute,
      isComponent,
      isDependency,
    }, "file-watcher");

    // Trigger re-index if needed
    if (isRoute || isComponent || isDependency || ext === ".json") {
      this.triggerReindex(relPath);
    }
  }

  // ── Re-index ────────────────────────────────────────────────

  triggerReindex(changedPath) {
    this.stats.reindexCount++;

    // Emit reindex event (consumers will handle actual re-indexing)
    this.eventBus.emit("repository.reindex", {
      triggeredBy: changedPath,
      timestamp: new Date().toISOString(),
    }, "file-watcher");

    console.log(`🔄 FileWatcher: reindex triggered by ${changedPath}`);
  }

  // ── Flush Buffer ────────────────────────────────────────────

  flushBuffer() {
    if (this.changeBuffer.length === 0) return;

    const batch = [...this.changeBuffer];
    this.changeBuffer = [];

    this.eventBus.emit("repository.changes.batch", {
      changes: batch,
      count: batch.length,
    }, "file-watcher");
  }

  // ── Should Skip ─────────────────────────────────────────────

  shouldSkip(filename) {
    const skipPatterns = [
      "node_modules",
      ".git",
      ".turbo",
      ".next",
      "dist",
      "build",
      ".playwright-mcp",
      ".ai/state",
    ];
    return skipPatterns.some(p => filename.includes(p));
  }

  // ── Stats ───────────────────────────────────────────────────

  getStats() {
    return {
      ...this.stats,
      running: this.running,
      watchersCount: this.watchers.size,
      pendingChanges: this.changeBuffer.length,
      debouncedTimers: this.debounceTimers.size,
    };
  }
}

// ── CLI ──────────────────────────────────────────────────────

if (process.argv[1] && process.argv[1].includes("file-watcher")) {
  const bus = new EventBus({
    persistencePath: join(ROOT, ".ai", "events", "event-log.jsonl"),
  });
  const watcher = new FileWatcher({ eventBus: bus });
  watcher.start();
  console.log("FileWatcher running. Press Ctrl+C to stop.");
  process.on("SIGINT", () => {
    watcher.stop();
    process.exit(0);
  });
}
