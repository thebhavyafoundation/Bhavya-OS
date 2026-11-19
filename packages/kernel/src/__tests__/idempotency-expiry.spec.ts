import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Idempotency } from "../idempotency/index.js";

/**
 * Expiry behaviour of the filesystem-backed idempotency store.
 *
 * The persisted representation of `expiresAt` is an ISO-8601 string (JSON has
 * no Date type), while the in-memory value is a Date. A comparison that does
 * not normalise the two representations silently fails after a reload, which
 * is precisely the situation a resumed runner meets.
 */
describe("idempotency expiry", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "bhavya-kernel-expiry-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  const storeDir = (base: string) => join(base, ".kernel", "idempotency");

  it("expires a key after the TTL has elapsed (same process)", async () => {
    const store = new Idempotency({ root, ttlMs: 1 });
    await store.initialize();
    await store.register("job-ttl", "exec-1");
    await new Promise((resolve) => setTimeout(resolve, 15));

    const decision = await store.shouldExecute("job-ttl");
    expect(decision.reason).toBe("key_not_found");
    expect(decision.proceed).toBe(true);
  });

  it("expires a key after the TTL has elapsed (after a reload) — DEFECT PROOF", async () => {
    const store = new Idempotency({ root, ttlMs: 1 });
    await store.initialize();
    await store.register("job-ttl", "exec-1");
    await new Promise((resolve) => setTimeout(resolve, 15));

    // A new process reads the same store from disk.
    const reloaded = new Idempotency({ root, ttlMs: 1 });
    await reloaded.initialize();

    const decision = await reloaded.shouldExecute("job-ttl");
    expect(decision.reason).toBe("key_not_found");
    expect(decision.proceed).toBe(true);
  });

  it("does not expire a key whose TTL has not elapsed (after a reload)", async () => {
    const store = new Idempotency({ root, ttlMs: 60000 });
    await store.initialize();
    await store.register("job-live", "exec-1");

    const reloaded = new Idempotency({ root, ttlMs: 60000 });
    await reloaded.initialize();

    const decision = await reloaded.shouldExecute("job-live");
    expect(decision.reason).toBe("already_in_progress");
    expect(decision.proceed).toBe(false);
  });

  it("uses the one-hour default TTL when none is configured", async () => {
    const store = new Idempotency({ root });
    await store.initialize();
    await store.register("job-default", "exec-1");

    const keys = JSON.parse(
      readFileSync(join(storeDir(root), "keys.json"), "utf8"),
    ) as Record<string, { createdAt: string; expiresAt: string }>;
    const entry = keys["job-default"];
    const created = Date.parse(entry.createdAt);
    const expires = Date.parse(entry.expiresAt);
    expect(expires - created).toBe(3600000);
  });

  it("keeps a key whose persisted expiry cannot be parsed (fails safe, never double-executes)", async () => {
    mkdirSync(storeDir(root), { recursive: true });
    writeFileSync(
      join(storeDir(root), "keys.json"),
      JSON.stringify({
        "job-corrupt": {
          key: "job-corrupt",
          executionId: "exec-1",
          status: "pending",
          createdAt: "2026-01-01T00:00:00.000Z",
          expiresAt: "not-a-date",
        },
      }),
      "utf8",
    );

    const store = new Idempotency({ root });
    await store.initialize();
    const decision = await store.shouldExecute("job-corrupt");

    // An unparseable expiry must not be treated as "expired": the key still
    // blocks a duplicate execution.
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("already_in_progress");
  });

  it("treats a legacy entry written with ISO strings as expiring normally", async () => {
    mkdirSync(storeDir(root), { recursive: true });
    writeFileSync(
      join(storeDir(root), "keys.json"),
      JSON.stringify({
        "job-legacy": {
          key: "job-legacy",
          executionId: "exec-1",
          status: "pending",
          createdAt: "2026-01-01T00:00:00.000Z",
          expiresAt: "2026-01-01T00:00:01.000Z",
        },
      }),
      "utf8",
    );

    const store = new Idempotency({ root });
    await store.initialize();
    const decision = await store.shouldExecute("job-legacy");
    expect(decision.reason).toBe("key_not_found");
    expect(decision.proceed).toBe(true);
  });

  it("does not throw under concurrent calls (the store takes no locks)", async () => {
    const store = new Idempotency({ root, ttlMs: 60000 });
    await store.initialize();

    await Promise.all([
      store.register("job-a", "exec-1"),
      store.register("job-b", "exec-2"),
      store.shouldExecute("job-a"),
      store.shouldExecute("job-b"),
    ]);

    const keys = JSON.parse(
      readFileSync(join(storeDir(root), "keys.json"), "utf8"),
    ) as Record<string, unknown>;
    expect(Object.keys(keys)).toContain("job-a");
    expect(Object.keys(keys)).toContain("job-b");
  });
});
