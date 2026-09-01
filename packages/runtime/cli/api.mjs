/**
 * Runtime API v2 — Extended HTTP server exposing capability execution,
 * knowledge pipeline, course management, and observability.
 *
 * This is the thin network boundary. All business logic lives in the engine.
 * The API only routes, validates, and responds.
 */

import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";

import {
  executeCapability,
  getExecutionStatus,
  resolveCapability,
  listCapabilities,
  getMetrics,
  listProvenanceRecords,
  getProvenanceRecord,
  getProvenanceGraph,
} from "../engine/capability-engine.mjs";

import { runKnowledgePipeline } from "../engine/knowledge-pipeline.mjs";

// Lesson and Course CRUD removed — canonical source is Studio SQLite via /api/studio/*

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Security: API Key Authentication ──────────────────────────
const API_KEY = process.env.RUNTIME_API_KEY || "";
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3020,http://localhost:3030").split(",").map(s => s.trim());
const VALID_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

function validateId(id) {
  return id && VALID_ID_PATTERN.test(id);
}

function checkAuth(req) {
  // Fail-closed: if no API key is configured, reject all requests
  // except health endpoint (handled separately).
  // Set RUNTIME_API_KEY environment variable to enable the API.
  if (!API_KEY) return false;
  const authHeader = req.headers.authorization || "";
  const apiKey = req.headers["x-api-key"] || "";
  return authHeader === `Bearer ${API_KEY}` || apiKey === API_KEY;
}

function getCorsOrigin(req) {
  const origin = req.headers.origin || "";
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return null; // unknown origin → no CORS header (strict)
}

function readJSON(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch { return null; }
}

const MAX_BODY_SIZE = 1024 * 1024; // 1MB limit

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function json(res, status, data) {
  // CORS is set on the server level, not here
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

export async function startServer(root, port = 3100) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const method = req.method;
    const parts = url.pathname.split("/").filter(Boolean);

    const origin = getCorsOrigin(req);
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
    res.setHeader("Content-Type", "application/json");

    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Auth check (skip for health endpoint)
    const resource = parts[0];
    if (resource !== "health" && !checkAuth(req)) {
      return json(res, 401, { error: "Unauthorized. Provide X-API-Key header or Bearer token." });
    }

    try {
      await route(root, method, parts, url, req, res);
    } catch (err) {
      console.error("Runtime API error:", err);
      json(res, 500, { error: "Internal server error" });
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Runtime API v3 listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function route(root, method, parts, url, req, res) {
  const [resource, id, subresource] = parts;

  // ── Health ────────────────────────────────────────────────────
  if (!resource || (resource === "health" && method === "GET")) {
    return json(res, 200, {
      service: "Bhavya Runtime API v3",
      version: "3.0.0",
      status: "operational",
    });
  }

  // ── Capabilities ──────────────────────────────────────────────
  if (resource === "capabilities" && method === "GET") {
    return json(res, 200, listCapabilities());
  }

  if (resource === "capability" && id && method === "POST") {
    const body = await readBody(req);
    const result = await executeCapability(id, body.input || body);
    return json(res, 200, result);
  }

  if (resource === "capability" && id && method === "GET") {
    const resolution = resolveCapability(id);
    if (!resolution.found) return json(res, 404, { error: resolution.error });
    return json(res, 200, resolution);
  }

  // ── Execution Status ──────────────────────────────────────────
  if (resource === "status" && id && method === "GET") {
    const exec = await getExecutionStatus(id);
    if (!exec) return json(res, 404, { error: `Execution ${id} not found` });
    return json(res, 200, exec);
  }

  // ── Knowledge Pipeline ────────────────────────────────────────
  if (resource === "pipeline" && method === "POST") {
    const body = await readBody(req);
    if (!body.knowledgeObject) return json(res, 400, { error: "knowledgeObject required" });
    const result = await runKnowledgePipeline(body.knowledgeObject, body.options || {});
    return json(res, 200, result);
  }

  // ── Lessons & Courses ────────────────────────────────────────
  // REMOVED — canonical CRUD is Studio SQLite via /api/studio/*
  // Runtime retains capability execution, knowledge pipeline, and metrics

  // ── Metrics / Observability ───────────────────────────────────
  if (resource === "metrics" && method === "GET") {
    return json(res, 200, getMetrics());
  }

  // ── Registry Mirror ───────────────────────────────────────────
  if (resource === "registry" && method === "GET") {
    const reg = readJSON(path.resolve(root, "bhavya-ai-lab/_config/skills/registry.json"));
    return json(res, 200, reg || { skills: {}, capabilities: {}, builders: {} });
  }

  // ── Quality Gates ─────────────────────────────────────────────
  if (resource === "quality-gates" && method === "GET") {
    const gates = readJSON(path.resolve(root, "bhavya-ai-lab/quality-gates/rules.json"));
    return json(res, 200, gates || { gates: [] });
  }

  // ── Provenance ────────────────────────────────────────────────────
  if (resource === "provenance" && method === "GET") {
    if (id) {
      return json(res, 200, getProvenanceRecord(id) || { error: "Not found" });
    }
    const sourceKo = url.searchParams?.get("sourceKnowledgeObject");
    const graph = url.searchParams?.get("graph") === "true";
    if (graph) return json(res, 200, getProvenanceGraph(sourceKo || undefined));
    return json(res, 200, listProvenanceRecords(sourceKo || undefined));
  }

  // ── Build Manifests ───────────────────────────────────────────────
  if (resource === "manifests" && method === "GET") {
    const manifestsDir = path.resolve(root, "bhavya-ai-lab/institution/manifests");
    try {
      if (id) {
        if (!validateId(id)) return json(res, 400, { error: "Invalid ID format" });
        const m = readJSON(path.join(manifestsDir, `${id}.json`));
        if (!m) return json(res, 404, { error: "Manifest not found" });
        return json(res, 200, m);
      }
      const files = fs.readdirSync(manifestsDir).filter(f => f.endsWith(".json")).sort().reverse();
      const manifests = files.map(f => readJSON(path.join(manifestsDir, f))).filter(Boolean);
      return json(res, 200, manifests);
    } catch { return json(res, 200, []); }
  }

  // ── Knowledge Objects ──────────────────────────────────────────
  if (resource === "knowledge") {
    const koDir = path.resolve(root, "bhavya-ai-lab/knowledge/objects");
    if (id && method === "GET") {
      if (!validateId(id)) return json(res, 400, { error: "Invalid ID format" });
      const ko = readJSON(path.join(koDir, `${id}.json`));
      if (!ko) return json(res, 404, { error: `Knowledge Object "${id}" not found` });
      return json(res, 200, ko);
    }
    if (!id && method === "GET") {
      try {
        const files = fs.readdirSync(koDir).filter(f => f.endsWith(".json"));
        const summaries = files.map(f => {
          const data = readJSON(path.join(koDir, f));
          return data ? { id: data.id, title: data.title, domain: data.domain } : null;
        }).filter(Boolean);
        return json(res, 200, summaries);
      } catch {
        return json(res, 200, []);
      }
    }
    if (method === "POST") {
      const body = await readBody(req);
      if (!body.title) return json(res, 400, { error: "title is required" });
      if (!body.concepts || !body.concepts.length) return json(res, 400, { error: "concepts array is required" });
      const id = body.id || `ko-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const ko = {
        id,
        title: body.title,
        subject: body.subject || "",
        grade: body.grade || 9,
        domain: body.domain || "",
        description: body.description || "",
        concepts: body.concepts || [],
        definitions: body.definitions || [],
        examples: body.examples || [],
        misconceptions: body.misconceptions || [],
        exercises: body.exercises || [],
        references: body.references || [],
        prerequisites: body.prerequisites || [],
        related: body.related || [],
        metadata: body.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: "0.1.0",
      };
      try {
        fs.writeFileSync(path.join(koDir, `${id}.json`), JSON.stringify(ko, null, 2));
      } catch {
        return json(res, 500, { error: "Failed to write Knowledge Object" });
      }
      return json(res, 201, ko);
    }
    if (id && method === "PUT") {
      if (!validateId(id)) return json(res, 400, { error: "Invalid ID format" });
      const existing = readJSON(path.join(koDir, `${id}.json`));
      if (!existing) return json(res, 404, { error: `Knowledge Object "${id}" not found` });
      const body = await readBody(req);
      const updated = {
        ...existing,
        ...body,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };
      try {
        fs.writeFileSync(path.join(koDir, `${id}.json`), JSON.stringify(updated, null, 2));
      } catch {
        return json(res, 500, { error: "Failed to write Knowledge Object" });
      }
      return json(res, 200, updated);
    }
    if (id && method === "DELETE") {
      if (!validateId(id)) return json(res, 400, { error: "Invalid ID format" });
      const koPath = path.join(koDir, `${id}.json`);
      if (!fs.existsSync(koPath)) return json(res, 404, { error: `Knowledge Object "${id}" not found` });
      try {
        fs.unlinkSync(koPath);
      } catch {
        return json(res, 500, { error: "Failed to delete Knowledge Object" });
      }
      return json(res, 200, { deleted: true });
    }
  }

  // ── 404 ───────────────────────────────────────────────────────
  return json(res, 404, { error: `Unknown endpoint: ${method} /${parts.join("/")}` });
}
