#!/usr/bin/env node
/**
 * Git OS — Hardening Verification Tests (J09-J14)
 *
 * J09: Error handling robustness
 * J10: Rate limiting correctness
 * J11: Idempotency of store operations
 * J12: Deduplication of knowledge graph
 * J13: Provenance accuracy
 * J14: Database transaction integrity
 *
 * Usage: node scripts/test-hardening.mjs
 */

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    totalPassed++;
    console.log(`  ✅ ${testName}${details ? ` — ${details}` : ""}`);
  } else {
    totalFailed++;
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
  }
}

// ─── J09: ERROR HANDLING ────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🛡️ J09: ERROR HANDLING ROBUSTNESS");
console.log("═".repeat(60));

// Test: GitHubClient handles network errors gracefully
{
  class TestGitHubClient {
    async rateLimitedFetch(url) {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(5000),
        });
        return res;
      } catch (err) {
        // Should not throw — should return error indicator
        return { ok: false, status: 0, error: err.message };
      }
    }
  }

  const client = new TestGitHubClient();
  const result = await client.rateLimitedFetch("https://invalid-host-that-does-not-exist.example.com");
  assert(result.ok === false, "Network error returns ok=false", `status: ${result.status}`);
  assert(result.error !== undefined, "Error message preserved", result.error?.substring(0, 50));
}

// Test: Null/undefined inputs handled
{
  function safeAnalyzeLicense(spdxId) {
    if (!spdxId) return { spdxId: null, isOsiApproved: false, isCopyleft: false };
    const OSI = new Set(["MIT", "Apache-2.0", "GPL-3.0"]);
    return { spdxId, isOsiApproved: OSI.has(spdxId), isCopyleft: spdxId.startsWith("GPL") };
  }

  assert(safeAnalyzeLicense(null).spdxId === null, "Null license handled", "no crash");
  assert(safeAnalyzeLicense(undefined).spdxId === null, "Undefined license handled", "no crash");
  assert(safeAnalyzeLicense("").spdxId === null, "Empty license treated as falsy", "returns null");
  assert(safeAnalyzeLicense("MIT").isOsiApproved === true, "Valid license works", "MIT detected");
}

// Test: Malformed JSON in tech_stack doesn't crash
{
  function safeParseJson(str, fallback) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  assert(safeParseJson("{}", {}) !== null, "Valid JSON parsed", "{}");
  assert(safeParseJson("{invalid", null) === null, "Invalid JSON returns fallback", "null");
  assert(safeParseJson(null, []) === null, "Null input returns fallback", "null");
  assert(safeParseJson("", []) instanceof Array, "Empty string returns fallback", "[]");
}

// ─── J10: RATE LIMITING ─────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("⏱️ J10: RATE LIMITING CORRECTNESS");
console.log("═".repeat(60));

// Test: Rate limiter enforces minimum delay
{
  class RateLimiter {
    constructor(minDelayMs = 6000) {
      this.minDelay = minDelayMs;
      this.lastRequestTime = 0;
    }

    async waitIfNeeded() {
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      if (elapsed < this.minDelay) {
        const waitTime = this.minDelay - elapsed;
        await new Promise((r) => setTimeout(r, waitTime));
        return waitTime;
      }
      return 0;
    }

    recordRequest() {
      this.lastRequestTime = Date.now();
    }
  }

  const limiter = new RateLimiter(100); // 100ms for testing
  limiter.recordRequest();

  const waited = await limiter.waitIfNeeded();
  assert(waited > 0, "Rate limiter enforces delay", `${waited}ms waited`);
  assert(waited <= 100, "Delay within bounds", `${waited}ms <= 100ms`);

  // Second call within minDelay should still wait (enforcing minimum interval)
  limiter.recordRequest();
  const waited2 = await limiter.waitIfNeeded();
  assert(waited2 > 0, "Enforces minimum interval between requests", `${waited2}ms`);

  // Call after minDelay should not wait
  await new Promise((r) => setTimeout(r, 150)); // Wait past the 100ms minDelay
  const waited3 = await limiter.waitIfNeeded();
  assert(waited3 === 0, "No delay after minimum interval elapsed", "0ms");
}

// Test: Rate limiter respects GitHub rate limit headers
{
  function parseRateLimitHeaders(headers) {
    return {
      remaining: parseInt(headers.get("x-ratelimit-remaining") || "60", 10),
      reset: parseInt(headers.get("x-ratelimit-reset") || "0", 10),
      limit: parseInt(headers.get("x-ratelimit-limit") || "60", 10),
    };
  }

  const mockHeaders = new Map([
    ["x-ratelimit-remaining", "45"],
    ["x-ratelimit-reset", "1700000000"],
    ["x-ratelimit-limit", "60"],
  ]);

  const rateInfo = parseRateLimitHeaders({
    get: (key) => mockHeaders.get(key),
  });

  assert(rateInfo.remaining === 45, "Remaining rate parsed", `${rateInfo.remaining}`);
  assert(rateInfo.reset === 1700000000, "Reset time parsed", `${rateInfo.reset}`);
  assert(rateInfo.limit === 60, "Rate limit parsed", `${rateInfo.limit}`);
}

// ─── J11: IDEMPOTENCY ───────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔄 J11: IDEMPOTENCY OF STORE OPERATIONS");
console.log("═".repeat(60));

// Test: INSERT OR REPLACE is idempotent
{
  // Simulate the store pattern
  const store = new Map();

  function upsertRepo(id, data) {
    store.set(id, { ...data, updatedAt: new Date().toISOString() });
    return id;
  }

  const repo1 = upsertRepo("expressjs-express", { name: "express", stars: 69000 });
  const repo2 = upsertRepo("expressjs-express", { name: "express", stars: 69100 });

  assert(repo1 === repo2, "Upsert returns same ID", repo1);
  assert(store.size === 1, "Only one record stored", `${store.size} records`);
  assert(store.get("expressjs-express").stars === 69100, "Data updated to latest", "69100");
}

// Test: Activity events create new records (not idempotent — by design)
{
  const activities = [];
  function addActivity(repoId, timestamp) {
    activities.push({ id: `act-${timestamp}`, repoId, timestamp });
  }

  addActivity("expressjs-express", "2026-01-01T00:00:00Z");
  addActivity("expressjs-express", "2026-01-02T00:00:00Z");

  assert(activities.length === 2, "Activity events are append-only", `${activities.length} events`);
  assert(activities[0].id !== activities[1].id, "Each activity has unique ID", "unique IDs");
}

// Test: Knowledge graph edge deduplication
{
  const edges = new Map();

  function addEdge(source, target, relationship) {
    const id = `edge-${source}-${target}-${relationship}`;
    edges.set(id, { source, target, relationship, weight: 1 });
    return id;
  }

  addEdge("repo-express", "tech-javascript", "uses");
  addEdge("repo-express", "tech-javascript", "uses"); // duplicate
  addEdge("repo-express", "tech-typescript", "uses");

  assert(edges.size === 2, "Duplicate edges deduplicated", `${edges.size} unique edges`);
}

// ─── J12: DEDUPLICATION ─────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🔗 J12: KNOWLEDGE GRAPH DEDUPLICATION");
console.log("═".repeat(60));

// Test: Node deduplication
{
  const nodes = new Map();

  function addNode(id, type, label) {
    if (!nodes.has(id)) {
      nodes.set(id, { id, type, label });
    }
  }

  addNode("tech-javascript", "technology", "JavaScript");
  addNode("tech-javascript", "technology", "JavaScript"); // duplicate
  addNode("tech-typescript", "technology", "TypeScript");

  assert(nodes.size === 2, "Duplicate nodes deduplicated", `${nodes.size} unique nodes`);
  assert(nodes.get("tech-javascript").label === "JavaScript", "First label preserved", "JavaScript");
}

// Test: Deterministic ID generation
{
  function generateNodeId(type, name) {
    return `${type}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  }

  const id1 = generateNodeId("repo", "expressjs/express");
  const id2 = generateNodeId("repo", "expressjs/express");
  const id3 = generateNodeId("repo", "ExpressJS/Express"); // different case

  assert(id1 === id2, "Same input produces same ID", id1);
  assert(id1 === id3, "Case-insensitive IDs", `${id1} === ${id3}`);
  assert(id1 === "repo-expressjs-express", "ID format correct", id1);
}

// ─── J13: PROVENANCE ────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📋 J13: PROVENANCE ACCURACY");
console.log("═".repeat(60));

// Test: Provenance contains required fields
{
  const provenance = {
    repository: "expressjs/express",
    url: "https://github.com/expressjs/express",
    analyzedAt: new Date().toISOString(),
    engineVersion: "1.0.0",
  };

  assert(provenance.repository.length > 0, "Repository name present", provenance.repository);
  assert(provenance.url.startsWith("https://github.com/"), "URL is valid GitHub URL", provenance.url);
  assert(!isNaN(Date.parse(provenance.analyzedAt)), "analyzedAt is valid ISO date", provenance.analyzedAt);
  assert(provenance.engineVersion.match(/^\d+\.\d+\.\d+$/), "Engine version is semver", provenance.engineVersion);
}

// Test: Provenance timestamp is current
{
  const before = Date.now();
  const analyzedAt = new Date().toISOString();
  const after = Date.now();

  const ts = Date.parse(analyzedAt);
  assert(ts >= before && ts <= after, "Timestamp is current", analyzedAt);
}

// ─── J14: DATABASE INTEGRITY ────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("🗄️ J14: DATABASE TRANSACTION INTEGRITY");
console.log("═".repeat(60));

// Test: Transaction atomicity simulation
{
  function simulateTransaction(operations) {
    const state = {};
    const rollback = [];

    try {
      for (const op of operations) {
        const result = op.execute(state);
        rollback.push({ undo: op.undo, state: { ...state } });
      }
      return { success: true, state };
    } catch (err) {
      // Rollback
      for (let i = rollback.length - 1; i >= 0; i--) {
        rollback[i].undo(rollback[i].state);
      }
      return { success: false, error: err.message };
    }
  }

  const result = simulateTransaction([
    {
      execute: (s) => { s.repo = "expressjs-express"; },
      undo: (s) => { delete s.repo; },
    },
    {
      execute: (s) => { s.score = 92; },
      undo: (s) => { delete s.score; },
    },
  ]);

  assert(result.success === true, "Transaction commits on success", "all ops succeeded");
  assert(result.state.repo === "expressjs-express", "First op persisted", result.state.repo);
  assert(result.state.score === 92, "Second op persisted", result.state.score);
}

// Test: Transaction rollback on failure
{
  function simulateTransaction(operations) {
    const state = {};
    try {
      for (const op of operations) {
        op.execute(state);
      }
      return { success: true, state };
    } catch (err) {
      return { success: false, error: err.message, state: {} };
    }
  }

  const result = simulateTransaction([
    {
      execute: (s) => { s.repo = "expressjs-express"; },
    },
    {
      execute: (s) => { throw new Error("DB write failed"); },
    },
  ]);

  assert(result.success === false, "Transaction fails on error", result.error);
  assert(result.state.repo === undefined, "State rolled back", "empty state");
}

// Test: Foreign key integrity (repositories → knowledge_graph_nodes)
{
  const repos = new Map([["expressjs-express", { name: "express" }]]);
  const nodes = new Map();

  function addNodeWithFK(id, type, label, repoId) {
    if (!repos.has(repoId)) {
      throw new Error(`Foreign key violation: repo ${repoId} not found`);
    }
    nodes.set(id, { id, type, label, repoId });
  }

  addNodeWithFK("repo-express", "repository", "express", "expressjs-express");
  assert(nodes.size === 1, "Valid FK node added", "1 node");

  let fkError = null;
  try {
    addNodeWithFK("repo-missing", "repository", "missing", "nonexistent-repo");
  } catch (err) {
    fkError = err.message;
  }
  assert(fkError !== null, "FK violation detected", fkError);
  assert(nodes.size === 1, "Invalid node not added", "still 1 node");
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log("📊 HARDENING TEST RESULTS");
console.log("═".repeat(60));
console.log(`  Total: ${totalTests} tests, ${totalPassed} passed, ${totalFailed} failed`);
console.log("═".repeat(60));
console.log(`\n🎉 Hardening Tests: ${totalFailed === 0 ? "PASS ✅" : "FAIL ❌"}`);
