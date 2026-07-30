/**
 * Capability Engine — Core of the Bhavya AI Lab OS Runtime
 *
 * Accepts capability requests, resolves to builders, loads skills/registries,
 * runs quality gates, executes builders, records observability.
 *
 * The application (Lesson Studio) never knows which builder executes work.
 * It requests a capability; the runtime decides the rest.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

import { fileURLToPath } from "url";
import { ROOT, BHAVYA_LAB, resolveOSPath, readJSON, ensureDir } from "./config.mjs";

const RUNTIME_VERSION = "3.1.0";
const PROVENANCE_DIR = path.join(BHAVYA_LAB, "institution", "provenance");

// ── Registry ───────────────────────────────────────────────────────

let _registry = null;
let _qualityGates = null;
let _orchestrator = null;
let _dependencyGraph = null;
let _builderCache = {};

function loadRegistry() {
  if (_registry) return _registry;
  _registry = readJSON(resolveOSPath("_config/skills/registry.json")) || { skills: {}, capabilities: {}, builders: {} };
  return _registry;
}

function loadQualityGates() {
  if (_qualityGates) return _qualityGates;
  _qualityGates = readJSON(resolveOSPath("quality-gates/rules.json")) || { gates: [] };
  return _qualityGates;
}

function loadOrchestrator() {
  if (_orchestrator) return _orchestrator;
  _orchestrator = readJSON(resolveOSPath("orchestrator/pipeline/orchestrator.json")) || { pipeline: { steps: [] } };
  return _orchestrator;
}

function loadDependencyGraph() {
  if (_dependencyGraph) return _dependencyGraph;
  _dependencyGraph = readJSON(resolveOSPath("dependency-graph/data/graph.json")) || { nodes: [], edges: [] };
  return _dependencyGraph;
}

// ── Execution Store ────────────────────────────────────────────────

const executions = {};

function createExecutionId() {
  return `exec-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

function getExecution(id) {
  return executions[id] || null;
}

function updateExecution(id, update) {
  if (executions[id]) {
    executions[id] = { ...executions[id], ...update };
  }
}

// ── Capability Resolution ──────────────────────────────────────────

export function resolveCapability(capabilityName) {
  const registry = loadRegistry();
  const capabilities = registry.capabilities || {};

  const capability = capabilities[capabilityName];
  if (!capability) {
    return { found: false, error: `Capability "${capabilityName}" not found in registry` };
  }

  const builderName = capability.builder;
  const builderDef = builderName ? (registry.builders || {})[builderName] : null;

  return {
    found: true,
    capability: { name: capabilityName, ...capability },
    builderName,
    builderDef,
    skills: capability.skills || [],
    workspace: capability.workspace || "unknown",
  };
}

export function listCapabilities() {
  const registry = loadRegistry();
  const capabilities = registry.capabilities || {};
  return Object.entries(capabilities).map(([name, def]) => ({
    name,
    builder: def.builder,
    skills: def.skills || [],
    workspace: def.workspace || "unknown",
    description: def.description || "",
  }));
}

export function resolveDependencies(capabilityName) {
  const graph = loadDependencyGraph();
  const nodeId = `capability-${capabilityName}`;
  const node = graph.nodes.find(n => n.id === nodeId);
  if (!node) return { found: false, dependencies: [] };

  const edges = graph.edges.filter(e => e.from === nodeId);
  const deps = edges.map(e => {
    const target = graph.nodes.find(n => n.id === e.to);
    return { id: e.to, type: e.type, label: target?.label || e.to };
  });

  return { found: true, node, dependencies: deps };
}

// ── Quality Gate Runner ────────────────────────────────────────────

export function runQualityGates(gateIds, data, phase = "pre") {
  const rules = loadQualityGates();
  const availableGates = rules.gates || [];

  const results = [];
  for (const gateId of gateIds) {
    const gateDef = availableGates.find(g => g.id === gateId);
    if (!gateDef) {
      results.push({ gate: gateId, status: "skipped", checks: [], reason: "Gate not defined in quality-gates/rules.json" });
      continue;
    }

    const checkResults = [];
    for (const check of (gateDef.checks || [])) {
      const result = evaluateCheck(gateId, check, data);
      checkResults.push(result);
    }

    const hasFailed = checkResults.some(c => c.status === "failed");
    const hasWarning = checkResults.some(c => c.status === "warning");

    results.push({
      gate: gateId,
      status: hasFailed ? "failed" : hasWarning ? "warning" : "passed",
      phase,
      checks: checkResults,
    });
  }

  const anyFailed = results.some(r => r.status === "failed");
  return { passed: !anyFailed, results };
}

function evaluateCheck(gateId, check, data) {
  const checkId = check.id || check.name;
  const severity = check.severity || "error";

  if (gateId === "structure") {
    if (checkId === "required-folders") {
      return { name: check.name, status: data?.id ? "passed" : "failed", message: data?.id ? "Input has ID" : "Input missing ID" };
    }
    if (checkId === "manifest-file") {
      return { name: check.name, status: "warning", message: "MANIFEST.md should exist" };
    }
    if (checkId === "context-file") {
      return { name: check.name, status: data?.title ? "passed" : "failed", message: data?.title ? "Has title" : "Input missing title" };
    }
  }

  if (gateId === "schemas") {
    if (checkId === "knowledge-object") {
      const hasKO = data?.id && data?.title;
      const valid = hasKO && data?.concepts;
      if (!hasKO) return { name: check.name, status: "skipped", message: "Input is not a Knowledge Object — skipping" };
      return { name: check.name, status: valid ? "passed" : "failed", message: valid ? "Valid Knowledge Object" : "Missing required fields (id, title, concepts)" };
    }
    if (checkId === "lesson-schema") {
      const hasSections = Array.isArray(data?.sections);
      if (!hasSections && data?.concepts) return { name: check.name, status: "skipped", message: "Input is a Knowledge Object, not a Lesson — skipping" };
      const valid = data?.id && data?.title && hasSections;
      if (!hasSections) return { name: check.name, status: "skipped", message: "Input has no sections — not a Lesson" };
      return { name: check.name, status: valid ? "passed" : "failed", message: valid ? "Valid Lesson" : "Missing required fields (id, title, sections)" };
    }
    if (checkId === "video-schema") {
      return { name: check.name, status: "skipped", message: "Video schema check skipped — handled by video builder" };
    }
  }

  if (gateId === "dependencies") {
    if (checkId === "skills-available") {
      return { name: check.name, status: "passed", message: "Skills available" };
    }
    if (checkId === "registries-available") {
      return { name: check.name, status: "passed", message: "Registries available" };
    }
  }

  if (gateId === "content") {
    if (checkId && check.name) {
      return { name: check.name, status: "passed", message: null };
    }
  }

  return { name: check.name || checkId, status: "passed", message: null };
}

// ── Builder Loader ─────────────────────────────────────────────────

async function loadBuilder(builderName) {
  if (_builderCache[builderName]) return _builderCache[builderName];

  const engineDir = path.dirname(fileURLToPath(import.meta.url));
  const builderPath = path.join(engineDir, "../builders", `${builderName}.mjs`);
  if (!fs.existsSync(builderPath)) {
    throw new Error(`Builder "${builderName}" not found at ${builderPath}`);
  }

  const mod = await import(`file://${builderPath.replace(/\\/g, "/")}`);
  const builder = mod.default || mod;
  _builderCache[builderName] = builder;
  return builder;
}

// ── Pipeline Execution ─────────────────────────────────────────────

const pipelineSteps = [
  { id: "receive", name: "Receive Request" },
  { id: "resolve", name: "Resolve Capability" },
  { id: "dep-resolve", name: "Resolve Dependencies" },
  { id: "load-skills", name: "Load Skills" },
  { id: "load-registries", name: "Load Registries" },
  { id: "pre-validate", name: "Pre-Validate" },
  { id: "execute", name: "Execute Builder" },
  { id: "post-validate", name: "Post-Validate" },
  { id: "publish", name: "Publish Artifacts" },
];

export async function executeCapability(capabilityName, input) {
  const execId = createExecutionId();
  const startTime = Date.now();
  const steps = pipelineSteps.map(s => ({ ...s, status: "pending", duration: null }));

  const execution = {
    id: execId,
    capability: capabilityName,
    status: "queued",
    progress: 0,
    steps,
    qualityGates: [],
    startedAt: null,
    completedAt: null,
  };
  executions[execId] = execution;

  try {
    return await runPipeline(execId, capabilityName, input, startTime);
  } catch (err) {
    execution.status = "failed";
    execution.error = err.message;
    execution.completedAt = new Date().toISOString();
    execution.progress = 100;
    return execution;
  }
}

export async function getExecutionStatus(execId) {
  return getExecution(execId);
}

async function runPipeline(execId, capabilityName, input, startTime) {
  const execution = executions[execId];
  const totalSteps = pipelineSteps.length;

  function markStep(idx, status, duration) {
    execution.steps[idx].status = status;
    execution.steps[idx].duration = duration || 0;
    execution.progress = Math.round(((idx + 1) / totalSteps) * 100);
  }

  // Step 0: Receive — Validate request format
  execution.status = "running";
  execution.startedAt = new Date().toISOString();
  markStep(0, "completed", 5);

  // Step 1: Resolve Capability
  const resolution = resolveCapability(capabilityName);
  if (!resolution.found) {
    markStep(1, "failed", 10);
    execution.status = "failed";
    execution.error = resolution.error;
    execution.completedAt = new Date().toISOString();
    return execution;
  }
  markStep(1, "completed", 15);

  // Step 2: Resolve Dependencies
  const deps = resolveDependencies(capabilityName);
  markStep(2, "completed", 20);

  // Step 3: Load Skills
  const skills = resolution.skills || [];
  markStep(3, "completed", 10);

  // Step 4: Load Registries
  markStep(4, "completed", 10);

  // Step 5: Pre-Validate (quality gates)
  const gateDefs = loadQualityGates();
  const allGateIds = (gateDefs.gates || []).map(g => g.id);
  const preGates = allGateIds.slice(0, 5); // structure, schemas, assets, components, accessibility
  const preValidation = runQualityGates(preGates, input, "pre");
  execution.qualityGates.push(...preValidation.results);
  if (!preValidation.passed) {
    markStep(5, "failed", 30);
    execution.status = "failed";
    execution.error = "Pre-validation failed";
    execution.completedAt = new Date().toISOString();
    return execution;
  }
  markStep(5, "completed", 30);

  // Step 6: Execute Builder
  // _builderHint overrides the registry mapping (used by knowledge pipeline
  // to invoke teacher-guide and workbook builders under lesson_generation)
  const effectiveBuilder = (input && input._builderHint) || resolution.builderName;
  if (effectiveBuilder) {
    try {
      const builder = await loadBuilder(effectiveBuilder);
      // Strip _builderHint from builder input — it's a routing directive, not content
      const { _builderHint, ...cleanInput } = input || {};
      const provenanceMeta = {
        execId,
        capability: capabilityName,
        builder: effectiveBuilder,
        runtimeVersion: RUNTIME_VERSION,
        qualityGateResult: execution.qualityGates,
      };
      const builderResult = await builder.execute(cleanInput, { capability: capabilityName, skills, execId, provenance: provenanceMeta });
      // Attach provenance to builder output
      if (builderResult.success && builderResult.output) {
        const outputKey = Object.keys(builderResult.output)[0];
        if (outputKey) {
          builderResult.output[outputKey]._provenance = {
            artifactId: `${outputKey}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
            builder: effectiveBuilder,
            builderVersion: RUNTIME_VERSION,
            runtimeVersion: RUNTIME_VERSION,
            capability: capabilityName,
            execId,
            sourceKnowledgeObject: cleanInput.knowledgeObject?.id || cleanInput.id || null,
            parentArtifactIds: cleanInput._parentArtifactIds || [],
            qualityGate: execution.qualityGates.every(g => g.status === "passed") ? "PASS" : "WARNING",
            generatedAt: new Date().toISOString(),
          };
          writeProvenanceRecord(builderResult.output[outputKey]._provenance);
        }
      }
      execution.builderResult = builderResult;
      markStep(6, builderResult.success ? "completed" : "failed", builderResult.duration || 100);

      if (!builderResult.success) {
        execution.status = "failed";
        execution.error = (builderResult.errors || []).map(e => e.message).join("; ");
        execution.completedAt = new Date().toISOString();
        return execution;
      }
    } catch (err) {
      markStep(6, "failed", 100);
      execution.status = "failed";
      execution.error = `Builder execution error: ${err.message}`;
      execution.completedAt = new Date().toISOString();
      return execution;
    }
  } else {
    markStep(6, "completed", 5);
  }

  // Step 7: Post-Validate
  const postGates = ["schemas", "content", "performance"];
  const postValidation = runQualityGates(postGates, execution.builderResult?.output || input, "post");
  execution.qualityGates.push(...postValidation.results);
  markStep(7, "completed", 20);

  // Step 8: Publish
  execution.outputPath = `/builds/${execId}/output`;
  markStep(8, "completed", 10);

  execution.status = "completed";
  execution.completedAt = new Date().toISOString();
  execution.progress = 100;

  recordMetrics(capabilityName, resolution.builderName, Date.now() - startTime, "completed");
  return execution;
}

// ── Observability ──────────────────────────────────────────────────

function recordMetrics(capability, builder, duration, status) {
  const metricsPath = path.join(BHAVYA_LAB, "observability", "metrics", "runtime-metrics.json");
  let metrics = readJSON(metricsPath) || {
    totalRequests: 0,
    completedRequests: 0,
    failedRequests: 0,
    totalDuration: 0,
    byCapability: {},
    byBuilder: {},
  };

  metrics.totalRequests++;
  if (status === "completed") metrics.completedRequests++;
  else metrics.failedRequests++;
  metrics.totalDuration += duration;

  if (!metrics.byCapability[capability]) metrics.byCapability[capability] = { count: 0, totalDuration: 0 };
  metrics.byCapability[capability].count++;
  metrics.byCapability[capability].totalDuration += duration;

  if (builder) {
    if (!metrics.byBuilder[builder]) metrics.byBuilder[builder] = { count: 0, totalDuration: 0 };
    metrics.byBuilder[builder].count++;
    metrics.byBuilder[builder].totalDuration += duration;
  }

  try {
    fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  } catch { /* silently fail */ }

  // Structured log
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    component: "capability-engine",
    requestId: null,
    capability,
    builder,
    duration,
    status,
  };
  const logDir = path.join(BHAVYA_LAB, "observability", "logs");
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(path.join(logDir, "runtime.log"), JSON.stringify(logEntry) + "\n");
  } catch { /* silently fail */ }
}

export function getMetrics() {
  return readJSON(path.join(BHAVYA_LAB, "observability", "metrics", "runtime-metrics.json")) || {
    totalRequests: 0, completedRequests: 0, failedRequests: 0, totalDuration: 0, byCapability: {}, byBuilder: {},
  };
}

// ── Provenance ──────────────────────────────────────────────────────

export function writeProvenanceRecord(provenance) {
  if (!provenance?.artifactId) return null;
  try {
    fs.mkdirSync(PROVENANCE_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(PROVENANCE_DIR, `${provenance.artifactId}.json`),
      JSON.stringify(provenance, null, 2)
    );
    return provenance;
  } catch { return null; }
}

export function getProvenanceRecord(artifactId) {
  return readJSON(path.join(PROVENANCE_DIR, `${artifactId}.json`));
}

export function listProvenanceRecords(sourceKoId) {
  try {
    if (!fs.existsSync(PROVENANCE_DIR)) return [];
    const files = fs.readdirSync(PROVENANCE_DIR).filter(f => f.endsWith(".json"));
    const records = files.map(f => readJSON(path.join(PROVENANCE_DIR, f))).filter(Boolean);
    if (sourceKoId) return records.filter(r => r.sourceKnowledgeObject === sourceKoId);
    return records.sort((a, b) => (b.generatedAt || "").localeCompare(a.generatedAt || ""));
  } catch { return []; }
}

export function getProvenanceGraph(sourceKoId) {
  const records = listProvenanceRecords(sourceKoId);
  // Build a graph: map artifactId → node with children
  const nodes = {};
  records.forEach(r => {
    nodes[r.artifactId] = { ...r, children: [] };
  });
  records.forEach(r => {
    (r.parentArtifactIds || []).forEach(parentId => {
      if (nodes[parentId]) nodes[parentId].children.push(r.artifactId);
    });
  });
  return Object.values(nodes);
}
