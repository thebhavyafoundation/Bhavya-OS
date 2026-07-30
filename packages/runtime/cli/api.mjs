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

import * as courseManager from "../engine/course-manager.mjs";
import * as lessonManager from "../engine/lesson-manager.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readJSON(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch { return null; }
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

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(data, null, 2));
}

export async function startServer(root, port = 3100) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const method = req.method;
    const parts = url.pathname.split("/").filter(Boolean);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      await route(root, method, parts, url, req, res);
    } catch (err) {
      json(res, 500, { error: err.message });
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

  // ── Courses ───────────────────────────────────────────────────
  if (resource === "courses") {
    if (method === "GET") return json(res, 200, courseManager.listCourses());
    if (method === "POST") {
      const body = await readBody(req);
      return json(res, 201, courseManager.createCourse(body));
    }
  }

  if (resource === "courses" && id) {
    if (method === "GET") {
      const course = courseManager.getCourse(id);
      if (!course) return json(res, 404, { error: "Course not found" });
      return json(res, 200, course);
    }
    if (method === "PUT") {
      const body = await readBody(req);
      const updated = courseManager.updateCourse(id, body);
      if (!updated) return json(res, 404, { error: "Course not found" });
      return json(res, 200, updated);
    }
    if (method === "DELETE") {
      const deleted = courseManager.deleteCourse(id);
      if (!deleted) return json(res, 404, { error: "Course not found" });
      return json(res, 200, { deleted: true });
    }

    // Sub-resources
    if (subresource === "duplicate" && method === "POST") {
      const dup = courseManager.duplicateCourse(id);
      if (!dup) return json(res, 404, { error: "Course not found" });
      return json(res, 200, dup);
    }

    if (subresource === "archive" && method === "POST") {
      const archived = courseManager.archiveCourse(id);
      if (!archived) return json(res, 404, { error: "Course not found" });
      return json(res, 200, archived);
    }

    if (subresource === "reorder" && method === "POST") {
      const body = await readBody(req);
      const reordered = courseManager.reorderLessons(id, body.lessonIds || []);
      if (!reordered) return json(res, 404, { error: "Course not found" });
      return json(res, 200, reordered);
    }
  }

  // ── Lessons ───────────────────────────────────────────────────
  if (resource === "lessons") {
    if (method === "GET") {
      const filters = Object.fromEntries(url.searchParams);
      return json(res, 200, lessonManager.listLessons(filters));
    }
    if (method === "POST") {
      const body = await readBody(req);
      return json(res, 201, lessonManager.createLesson(body));
    }
  }

  if (resource === "lessons" && id) {
    if (method === "GET") {
      if (subresource === "artifacts") {
        const artifacts = lessonManager.getLessonArtifacts(id);
        if (!artifacts.lesson) return json(res, 404, { error: "Lesson not found" });
        return json(res, 200, artifacts);
      }
      if (subresource === "assessment") return json(res, 200, lessonManager.getAssessment(id) || {});
      if (subresource === "guide") return json(res, 200, lessonManager.getTeacherGuide(id) || {});
      if (subresource === "workbook") return json(res, 200, lessonManager.getWorkbook(id) || {});
      const lesson = lessonManager.getLesson(id);
      if (!lesson) return json(res, 404, { error: "Lesson not found" });
      return json(res, 200, lesson);
    }
    if (method === "PUT") {
      const body = await readBody(req);
      const updated = lessonManager.updateLesson(id, body);
      if (!updated) return json(res, 404, { error: "Lesson not found" });
      return json(res, 200, updated);
    }
    if (method === "DELETE") {
      const deleted = lessonManager.deleteLesson(id);
      if (!deleted) return json(res, 404, { error: "Lesson not found" });
      return json(res, 200, { deleted: true });
    }
  }

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
        concepts: body.concepts || [],
        definitions: body.definitions || [],
        examples: body.examples || [],
        misconceptions: body.misconceptions || [],
        exercises: body.exercises || [],
        references: body.references || [],
        prerequisites: body.prerequisites || [],
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
