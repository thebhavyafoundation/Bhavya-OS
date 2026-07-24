/**
 * Runtime API — Local HTTP server exposing runtime capabilities
 *
 * Endpoints:
 *   GET  /health                    Runtime health check
 *   GET  /task/:id                  Get task contract
 *   GET  /dependencies/:entity      Get dependency graph for entity
 *   GET  /context/:domain           Get context files for domain
 *   GET  /find/:query               Search entities by name
 *   POST /plan                      Build execution plan
 *   GET  /history                   Get runtime history
 *   GET  /stats                     Runtime metrics
 *   GET  /release/current           Current release info
 *   GET  /graph/query/:entity       Query knowledge graph
 */

import fs from "fs";
import path from "path";
import http from "http";

export async function startServer(root, port = 3100) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const method = req.method;
    const pathParts = url.pathname.split("/").filter(Boolean);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const result = await route(root, method, pathParts, url, req);
      res.writeHead(result.status || 200);
      res.end(JSON.stringify(result.body, null, 2));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Runtime API listening on http://localhost:${port}`);
      console.log(`  Try: curl http://localhost:${port}/health`);
      resolve(server);
    });
  });
}

async function route(root, method, pathParts, url, req) {
  const [resource, id] = pathParts;

  if (!resource) {
    return { body: {
      service: "Bhavya Runtime API",
      version: "3.0",
      endpoints: [
        "GET /health", "GET /task/:id", "GET /dependencies/:entity",
        "GET /context/:domain", "GET /find/:query", "POST /plan",
        "GET /history", "GET /stats", "GET /release/current", "GET /graph/query/:entity",
      ],
    }};
  }

  switch (resource) {
    case "health": {
      const state = readJSON(root, ".ai/state/repository.json");
      return { body: {
        status: "ok",
        release: state?.release || "unknown",
        task: state?.task || "none",
        last_build: state?.last_build || "never",
        dirty: state?.dirty ?? true,
      }};
    }

    case "task": {
      if (!id) return { status: 400, body: { error: "Task ID required" } };
      const contract = readJSON(root, `.ai/tasks/contracts/${id}.json`);
      if (!contract) return { status: 404, body: { error: `Task ${id} not found` } };
      return { body: contract };
    }

    case "dependencies": {
      if (!id) return { status: 400, body: { error: "Entity ID required" } };
      const deps = readJSON(root, ".ai/dependencies.yaml");
      if (!deps) return { status: 404, body: { error: "No dependencies found" } };
      // Search all sections
      const entity = id.toUpperCase();
      for (const section of ["apps", "packages"]) {
        if (deps[section] && deps[section][entity]) {
          return { body: { entity, type: section, ...deps[section][entity] } };
        }
      }
      return { status: 404, body: { error: `Entity ${id} not in dependency graph` } };
    }

    case "context": {
      if (!id) return { status: 400, body: { error: "Domain required" } };
      const { optimizeContext } = await import("./optimizer.mjs");
      const result = optimizeContext(root, id, { maxFiles: 8 });
      return { body: result };
    }

    case "find": {
      if (!id) return { status: 400, body: { error: "Query required" } };
      const graph = readJSON(root, ".ai/graph/graph.json");
      if (!graph) return { body: { query: id, results: [] } };
      const q = id.toLowerCase();
      const results = graph.nodes.filter(n =>
        n.id?.toLowerCase().includes(q) ||
        n.name?.toLowerCase().includes(q) ||
        n.path?.toLowerCase().includes(q)
      );
      return { body: { query: id, count: results.length, results } };
    }

    case "plan": {
      if (method === "POST") {
        const body = await readBody(req);
        const goal = body.goal || id;
        const { buildPlan } = await import("./planner.mjs");
        const plan = buildPlan(root, goal);
        return { body: plan };
      }
      return { status: 405, body: { error: "POST required for /plan" } };
    }

    case "history": {
      const historyDir = path.join(root, ".ai/history");
      if (!fs.existsSync(historyDir)) return { body: { records: [] } };
      const records = [];
      const walkDir = (dir) => {
        for (const f of fs.readdirSync(dir)) {
          const fp = path.join(dir, f);
          if (fs.statSync(fp).isDirectory()) walkDir(fp);
          else if (f.endsWith(".jsonl")) {
            const lines = fs.readFileSync(fp, "utf8").trim().split("\n").filter(Boolean);
            for (const line of lines.slice(-10)) {
              try { records.push(JSON.parse(line)); } catch { /* skip */ }
            }
          }
        }
      };
      walkDir(historyDir);
      records.sort((a, b) => a.time < b.time ? 1 : -1);
      return { body: { total: records.length, recent: records.slice(0, 20) } };
    }

    case "stats": {
      const state = readJSON(root, ".ai/state/repository.json");
      const metrics = readJSON(root, ".ai/state/metrics.json") || {};
      const events = readJSON(root, ".ai/events/event-log.jsonl") || "";
      const eventCount = (typeof events === "string") ? events.trim().split("\n").filter(Boolean).length : 0;
      const graph = readJSON(root, ".ai/graph/graph.json");
      return { body: {
        release: state?.release || "unknown",
        task: state?.task || "none",
        last_build: state?.last_build || "never",
        last_validation: state?.last_validation || "never",
        events_total: eventCount,
        compile_count: metrics.compile_count || 0,
        graph_nodes: graph?.nodes?.length || 0,
        graph_edges: graph?.edges?.length || 0,
      }};
    }

    case "release": {
      if (id === "current") {
        const state = readJSON(root, ".ai/state/repository.json");
        const rel = state?.release || "unknown";
        const relFile = path.join(root, `.ai/releases/v${rel}.yaml`);
        const relData = fs.existsSync(relFile) ? readYAML(relFile) : {};
        return { body: { release: rel, ...relData, name: state?.release_name || "" } };
      }
      return { status: 404, body: { error: "Use /release/current" } };
    }

    case "graph": {
      if (pathParts[1] === "query" && pathParts[2]) {
        const entityId = pathParts[2].toUpperCase();
        const graph = readJSON(root, ".ai/graph/graph.json");
        if (!graph) return { status: 404, body: { error: "No graph" } };
        const node = graph.nodes.find(n => n.id === entityId);
        if (!node) return { status: 404, body: { error: `${entityId} not found in graph` } };
        const edges = graph.edges.filter(e => e.source === node.id || e.target === node.id);
        return { body: { node, edges: edges.length } };
      }
      return { status: 400, body: { error: "Use /graph/query/:entity" } };
    }

    default:
      return { status: 404, body: { error: `Unknown endpoint: /${resource}` } };
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function readJSON(root, rel) {
  try {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch { return null; }
}

function readYAML(p) {
  try {
    const content = fs.readFileSync(p, "utf8");
    const obj = {};
    for (const line of content.split("\n")) {
      if (line.startsWith("#") || line.startsWith("---") || !line.includes(":")) continue;
      const [k, ...v] = line.split(":");
      obj[k.trim()] = v.join(":").trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    }
    return obj;
  } catch { return {}; }
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}
