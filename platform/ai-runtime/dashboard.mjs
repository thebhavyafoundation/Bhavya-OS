/**
 * Bhavya OS — Engineering Dashboard v3
 * Live dashboard with WebSocket updates.
 * Displays: running workers, queued tasks, repository graph,
 * memory usage, CPU usage, worker utilization, git activity,
 * knowledge graph, build pipeline, quality gates, deployment status,
 * review queue, architecture health, technical debt.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";
import { createServer } from "http";

const ROOT = join(import.meta.dirname, "../..");

export class Dashboard {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.port = config.port || 3101;
    this.server = null;
    this.wsClients = new Set();
    this.data = {
      workers: [],
      tasks: { total: 0, pending: 0, executing: 0, completed: 0, failed: 0 },
      repository: { files: 0, packages: 0, routes: 0, components: 0 },
      memory: { total: 0, byCategory: {} },
      events: { total: 0, recent: [] },
      reviews: { total: 0, passed: 0, failed: 0 },
      architecture: { score: 100, violations: 0 },
      git: { recentCommits: [], branch: "master" },
      performance: { cpuUsage: 0, memoryUsage: 0, uptime: 0 },
      buildPipeline: { status: "idle", lastBuild: null },
      qualityGates: { passed: 0, failed: 0 },
      deployment: { status: "none", lastDeployment: null },
    };

    // Subscribe to events for live updates
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.eventBus.on("*", (event) => {
      this.updateData(event);
      this.broadcast({ type: "event", data: event });
    });
  }

  updateData(event) {
    const { type, data } = event;

    switch (type) {
      case EventTypes.WORKER_STARTED:
      case EventTypes.WORKER_STOPPED:
      case EventTypes.WORKER_HEARTBEAT:
      case EventTypes.WORKER_IDLE:
      case EventTypes.WORKER_BUSY:
        this.updateWorkerData(data);
        break;
      case EventTypes.TASK_CREATED:
      case EventTypes.TASK_ASSIGNED:
      case EventTypes.TASK_COMPLETED:
      case EventTypes.TASK_FAILED:
        this.updateTaskData(data);
        break;
      case EventTypes.REVIEW_PASSED:
      case EventTypes.REVIEW_FAILED:
        this.updateReviewData(data);
        break;
      case EventTypes.REPOSITORY_CHANGED:
        this.updateRepositoryData(data);
        break;
      case EventTypes.MEMORY_UPDATED:
        this.updateMemoryData(data);
        break;
    }

    this.data.events.total++;
    this.data.events.recent.push(event);
    if (this.data.events.recent.length > 50) {
      this.data.events.recent = this.data.events.recent.slice(-50);
    }
  }

  updateWorkerData(data) {
    const idx = this.data.workers.findIndex(w => w.id === data.workerId);
    if (idx >= 0) {
      Object.assign(this.data.workers[idx], data);
    } else {
      this.data.workers.push(data);
    }
  }

  updateTaskData(data) {
    this.data.tasks.total++;
    if (data.state === "pending" || data.state === "queued") this.data.tasks.pending++;
    if (data.state === "executing") this.data.tasks.executing++;
    if (data.state === "completed") this.data.tasks.completed++;
    if (data.state === "failed") this.data.tasks.failed++;
  }

  updateReviewData(data) {
    this.data.reviews.total++;
    if (data.type === EventTypes.REVIEW_PASSED) this.data.reviews.passed++;
    if (data.type === EventTypes.REVIEW_FAILED) this.data.reviews.failed++;
  }

  updateRepositoryData(data) {
    if (data.isRoute) this.data.repository.routes++;
    if (data.isComponent) this.data.repository.components++;
  }

  updateMemoryData(data) {
    this.data.memory.total++;
    this.data.memory.byCategory[data.category] = (this.data.memory.byCategory[data.category] || 0) + 1;
  }

  // ── Data Loading ────────────────────────────────────────────

  async loadStaticData() {
    // Load repository index
    const indexPath = join(ROOT, "platform", "repo-intelligence", "output", "repository-index.json");
    if (existsSync(indexPath)) {
      try {
        const index = JSON.parse(readFileSync(indexPath, "utf-8"));
        this.data.repository = {
          files: index.stats?.totalFiles || 0,
          packages: index.stats?.totalPackages || 0,
          routes: index.stats?.totalRoutes || 0,
          components: index.stats?.totalComponents || 0,
          dependencies: index.stats?.totalDependencies || 0,
          commits: index.stats?.totalCommits || 0,
        };
      } catch { /* use defaults */ }
    }

    // Load memory stats
    const memoryDir = join(ROOT, "memory", "engineering");
    if (existsSync(memoryDir)) {
      try {
        const cats = ["architecture-decisions", "engineering-decisions", "completed-work",
          "known-issues", "technical-debt", "release-notes", "lessons-learned"];
        for (const cat of cats) {
          const file = join(memoryDir, `${cat}.json`);
          if (existsSync(file)) {
            const entries = JSON.parse(readFileSync(file, "utf-8"));
            this.data.memory.byCategory[cat] = entries.length;
            this.data.memory.total += entries.length;
          }
        }
      } catch { /* use defaults */ }
    }

    // Load git history
    try {
      const { execSync } = await import("child_process");
      const log = execSync('git log --oneline -10 --format="%H|%s|%ai"', {
        cwd: ROOT, encoding: "utf-8", shell: "powershell.exe",
      });
      this.data.git.recentCommits = log.trim().split("\n").filter(Boolean).map(line => {
        const [hash, message, date] = line.split("|");
        return { hash, message, date };
      });
    } catch { /* use defaults */ }
  }

  // ── HTTP Server ─────────────────────────────────────────────

  async start() {
    await this.loadStaticData();

    this.server = createServer((req, res) => {
      // CORS — strict allowlist: unknown origin → no header (browser blocks)
      const origin = req.headers.origin || "";
      const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3020,http://localhost:3030,http://localhost:3101").split(",").map(s => s.trim()).filter(Boolean);
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      // Routes
      if (req.url === "/" || req.url === "/dashboard") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(this.generateHTML());
      } else if (req.url === "/api/data") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.data));
      } else if (req.url === "/api/workers") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.data.workers));
      } else if (req.url === "/api/tasks") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.data.tasks));
      } else if (req.url === "/api/events") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.data.events.recent));
      } else if (req.url === "/ws" || req.url === "/live") {
        // Simple SSE for live updates
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        });

        const clientId = `client-${Date.now()}`;
        this.wsClients.add(res);

        req.on("close", () => {
          this.wsClients.delete(res);
        });

        // Send initial data
        res.write(`data: ${JSON.stringify({ type: "init", data: this.data })}\n\n`);
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    this.server.listen(this.port, () => {
      console.log(`📊 Dashboard v3: http://localhost:${this.port}`);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  // ── SSE Broadcast ───────────────────────────────────────────

  broadcast(message) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    for (const client of this.wsClients) {
      try {
        client.write(data);
      } catch {
        this.wsClients.delete(client);
      }
    }
  }

  // ── HTML Generation ─────────────────────────────────────────

  generateHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bhavya OS — Dashboard v3</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; }
    .header { background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 24px; font-weight: 700; }
    .header .status { display: flex; gap: 15px; align-items: center; }
    .header .status .dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px 30px; }
    .card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 20px; }
    .card h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 15px; }
    .card .value { font-size: 36px; font-weight: 700; color: #fff; }
    .card .label { font-size: 12px; color: #666; margin-top: 5px; }
    .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
    .stat-row:last-child { border-bottom: none; }
    .stat-label { color: #888; }
    .stat-value { color: #fff; font-weight: 600; }
    .bar { height: 8px; background: #222; border-radius: 4px; margin-top: 5px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
    .bar-green { background: linear-gradient(90deg, #15803d, #22c55e); }
    .bar-yellow { background: linear-gradient(90deg, #ca8a04, #eab308); }
    .bar-red { background: linear-gradient(90deg, #dc2626, #ef4444); }
    .worker-list { max-height: 200px; overflow-y: auto; }
    .worker-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
    .worker-status { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .status-idle { background: #166534; color: #22c55e; }
    .status-busy { background: #713f12; color: #eab308; }
    .status-error { background: #7f1d1d; color: #ef4444; }
    .event-log { max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px; }
    .event-item { padding: 4px 0; border-bottom: 1px solid #111; color: #888; }
    .event-type { color: #22c55e; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block; animation: pulse 1s infinite; margin-right: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Bhavya OS — Dashboard v3</h1>
    <div class="status">
      <span><span class="live-dot"></span> Live</span>
      <span id="uptime"></span>
    </div>
  </div>
  <div class="grid">
    <div class="card">
      <h2>Workers</h2>
      <div class="value" id="worker-count">0</div>
      <div class="label">Total Workers</div>
      <div class="worker-list" id="worker-list"></div>
    </div>
    <div class="card">
      <h2>Tasks</h2>
      <div class="value" id="task-total">0</div>
      <div class="label">Total Tasks</div>
      <div class="stat-row"><span class="stat-label">Pending</span><span class="stat-value" id="task-pending">0</span></div>
      <div class="stat-row"><span class="stat-label">Executing</span><span class="stat-value" id="task-executing">0</span></div>
      <div class="stat-row"><span class="stat-label">Completed</span><span class="stat-value" id="task-completed">0</span></div>
      <div class="stat-row"><span class="stat-label">Failed</span><span class="stat-value" id="task-failed">0</span></div>
    </div>
    <div class="card">
      <h2>Repository</h2>
      <div class="stat-row"><span class="stat-label">Files</span><span class="stat-value" id="repo-files">0</span></div>
      <div class="stat-row"><span class="stat-label">Packages</span><span class="stat-value" id="repo-packages">0</span></div>
      <div class="stat-row"><span class="stat-label">Routes</span><span class="stat-value" id="repo-routes">0</span></div>
      <div class="stat-row"><span class="stat-label">Components</span><span class="stat-value" id="repo-components">0</span></div>
    </div>
    <div class="card">
      <h2>Reviews</h2>
      <div class="value" id="review-total">0</div>
      <div class="label">Total Reviews</div>
      <div class="stat-row"><span class="stat-label">Passed</span><span class="stat-value" id="review-passed">0</span></div>
      <div class="stat-row"><span class="stat-label">Failed</span><span class="stat-value" id="review-failed">0</span></div>
    </div>
    <div class="card">
      <h2>Memory</h2>
      <div class="value" id="memory-total">0</div>
      <div class="label">Total Entries</div>
      <div id="memory-categories"></div>
    </div>
    <div class="card">
      <h2>Events</h2>
      <div class="value" id="event-total">0</div>
      <div class="label">Total Events</div>
      <div class="event-log" id="event-log"></div>
    </div>
  </div>
  <script>
    const source = new EventSource('/live');
    let data = {};
    source.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'init') { data = msg.data; }
      else if (msg.type === 'event') { data.events = data.events || {}; data.events.total = (data.events.total||0)+1; }
      updateUI();
    };
    function updateUI() {
      document.getElementById('worker-count').textContent = (data.workers||[]).length;
      document.getElementById('task-total').textContent = data.tasks?.total||0;
      document.getElementById('task-pending').textContent = data.tasks?.pending||0;
      document.getElementById('task-executing').textContent = data.tasks?.executing||0;
      document.getElementById('task-completed').textContent = data.tasks?.completed||0;
      document.getElementById('task-failed').textContent = data.tasks?.failed||0;
      document.getElementById('repo-files').textContent = data.repository?.files||0;
      document.getElementById('repo-packages').textContent = data.repository?.packages||0;
      document.getElementById('repo-routes').textContent = data.repository?.routes||0;
      document.getElementById('repo-components').textContent = data.repository?.components||0;
      document.getElementById('review-total').textContent = data.reviews?.total||0;
      document.getElementById('review-passed').textContent = data.reviews?.passed||0;
      document.getElementById('review-failed').textContent = data.reviews?.failed||0;
      document.getElementById('memory-total').textContent = data.memory?.total||0;
      document.getElementById('event-total').textContent = data.events?.total||0;
      const eventLog = document.getElementById('event-log');
      if (data.events?.recent) {
        eventLog.innerHTML = data.events.recent.slice(-20).reverse().map(e =>
          '<div class="event-item"><span class="event-type">' + e.type + '</span> ' + (e.timestamp||'').slice(11,19) + '</div>'
        ).join('');
      }
      document.getElementById('uptime').textContent = 'Uptime: ' + Math.floor((Date.now() - (performance.timeOrigin||Date.now()))/1000) + 's';
    }
    setInterval(updateUI, 1000);
  </script>
</body>
</html>`;
  }
}
