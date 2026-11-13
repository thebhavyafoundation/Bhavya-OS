import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Idempotency } from "../idempotency/index.js";

/**
 * These specifications describe the kernel idempotency implementation's REAL
 * behaviour, including the behaviours that are hazardous:
 *
 *  - the default TTL is one hour and an expired key is silently deleted;
 *  - `register` overwrites an existing key without a guard;
 *  - a failed key is retryable, a pending key is not, a completed key is not;
 *  - the store is a filesystem map under `<root>/.kernel/idempotency`, so it
 *    survives a process restart on the same filesystem and does NOT survive a
 *    fresh checkout (a CI runner starts with an empty store);
 *  - there is no attempt counter in the store — attempt accounting lives in
 *    `ExecutionContext.retryCount`.
 *
 * They are characterisation tests: they pin current behaviour so a future
 * change to any of it is a deliberate, visible decision.
 */
describe("kernel Idempotency", () => {
  let root: string;
  let idempotency: Idempotency;

  beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), "bhavya-kernel-idem-"));
    idempotency = new Idempotency({ root });
    await idempotency.initialize();
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  const storedKey = (key: string) => {
    const file = join(root, ".kernel", "idempotency", "keys.json");
    const keys = JSON.parse(readFileSync(file, "utf8")) as Record<string, Record<string, unknown>>;
    return keys[key];
  };

  it("allows a first execution of an unseen key", async () => {
    const decision = await idempotency.shouldExecute("job-1");
    expect(decision).toEqual({ proceed: true, reason: "key_not_found" });
  });

  it("refuses a concurrent duplicate while the key is pending", async () => {
    await idempotency.register("job-1", "exec-1");
    const decision = await idempotency.shouldExecute("job-1");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("already_in_progress");
  });

  it("refuses a completed request", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.complete("job-1", { deployed: true });
    const decision = await idempotency.shouldExecute("job-1");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("already_completed");
    const check = await idempotency.check("job-1");
    expect(check.exists).toBe(true);
    expect(check.status).toBe("completed");
    expect(check.result).toEqual({ deployed: true });
  });

  it("allows an explicit retry after a failure", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.fail("job-1", "boom");
    const decision = await idempotency.shouldExecute("job-1");
    expect(decision.proceed).toBe(true);
    expect(decision.reason).toBe("retry_after_failure");
    const check = await idempotency.check("job-1");
    expect(check.status).toBe("failed");
    expect(check.result).toEqual({ error: "boom" });
  });

  it("silently forgets an expired key, allowing the action again", async () => {
    const shortLived = new Idempotency({ root, ttlMs: 1 });
    await shortLived.initialize();
    await shortLived.register("job-ttl", "exec-1");
    await new Promise((resolve) => setTimeout(resolve, 15));
    const decision = await shortLived.shouldExecute("job-ttl");
    expect(decision.proceed).toBe(true);
    expect(decision.reason).toBe("key_not_found");
  });

  it("overwrites an existing key on re-registration (documented hazard)", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.register("job-1", "exec-2");
    const stored = storedKey("job-1");
    expect(stored.executionId).toBe("exec-2");
    expect(stored.status).toBe("pending");
  });

  it("keeps only the most recent registration under concurrent registration", async () => {
    await Promise.all([
      idempotency.register("job-1", "exec-a"),
      idempotency.register("job-1", "exec-b"),
    ]);
    const stored = storedKey("job-1");
    expect(["exec-a", "exec-b"]).toContain(stored.executionId);
    expect(stored.status).toBe("pending");
  });

  it("records no attempt counter in the store (attempt accounting is elsewhere)", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.fail("job-1", "boom");
    const stored = storedKey("job-1");
    expect(Object.keys(stored)).not.toContain("attempts");
    expect(Object.keys(stored)).not.toContain("attempt");
  });

  it("persists keys across instances on the same filesystem", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.complete("job-1", { ok: true });

    const restarted = new Idempotency({ root });
    await restarted.initialize();
    const decision = await restarted.shouldExecute("job-1");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("already_completed");
  });

  it("does not share state with a different root (a fresh runner has no store)", async () => {
    await idempotency.register("job-1", "exec-1");
    await idempotency.complete("job-1", { ok: true });

    const otherRoot = mkdtempSync(join(tmpdir(), "bhavya-kernel-idem-other-"));
    try {
      const elsewhere = new Idempotency({ root: otherRoot });
      await elsewhere.initialize();
      const decision = await elsewhere.shouldExecute("job-1");
      expect(decision.proceed).toBe(true);
      expect(decision.reason).toBe("key_not_found");
    } finally {
      rmSync(otherRoot, { recursive: true, force: true });
    }
  });

  it("uses a one-hour default TTL (asserted from the persisted record)", async () => {
    await idempotency.register("job-ttl-default", "exec-1");
    const stored = storedKey("job-ttl-default");
    const created = new Date(stored.createdAt as string).getTime();
    const expires = new Date(stored.expiresAt as string).getTime();
    expect(expires - created).toBe(3600000);
  });

  it("does not cap retries: every failure leaves the key retryable", async () => {
    await idempotency.register("job-1", "exec-1");
    for (let attempt = 0; attempt < 6; attempt += 1) {
      await idempotency.fail("job-1", `failure-${attempt}`);
      const decision = await idempotency.shouldExecute("job-1");
      expect(decision.proceed).toBe(true);
      expect(decision.reason).toBe("retry_after_failure");
    }
  });

  it("persists the documented on-disk layout and key fields", async () => {
    await idempotency.register("job-1", "exec-1");
    const store = join(root, ".kernel", "idempotency");
    expect(existsSync(join(store, "keys.json"))).toBe(true);
    expect(existsSync(join(store, "records.json"))).toBe(true);
    expect(Object.keys(storedKey("job-1")).sort()).toEqual(
      ["createdAt", "executionId", "expiresAt", "key", "status"].sort(),
    );
  });

  it("does not expire a reloaded key (documented defect in the reload path)", async () => {
    const shortLived = new Idempotency({ root, ttlMs: 1 });
    await shortLived.initialize();
    await shortLived.register("job-reload", "exec-1");
    await new Promise((resolve) => setTimeout(resolve, 15));

    // In the writing process the key is deleted as expired...
    const inProcess = await shortLived.shouldExecute("job-reload");
    expect(inProcess.reason).toBe("key_not_found");

    // ...but after a reload the persisted expiresAt is a string and the
    // implementation compares it numerically, so the key never expires.
    // Pinned here so the defect is visible; the fix is a separate task.
    const reloaded = new Idempotency({ root, ttlMs: 1 });
    await reloaded.initialize();
    const afterReload = await reloaded.shouldExecute("job-reload");
    expect(afterReload.proceed).toBe(false);
    expect(afterReload.reason).toBe("already_in_progress");
  });
});
