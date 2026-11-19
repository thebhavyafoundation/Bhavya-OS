import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Idempotency } from "../idempotency/index.js";

/**
 * The failure modes of a persisted idempotency store.
 *
 * The store's job is to stop the same work running twice. Every case here is
 * therefore judged by one question: can this state cause a duplicate
 * execution? A state that cannot be interpreted must block, never permit.
 */
describe("idempotency persisted state", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "bhavya-kernel-persisted-"));
  });

  afterEach(() => {
    vi.useRealTimers();
    rmSync(root, { recursive: true, force: true });
  });

  const storeDir = (base: string) => join(base, ".kernel", "idempotency");
  const keysFile = (base: string) => join(storeDir(base), "keys.json");

  const writeKeys = (base: string, data: unknown) => {
    mkdirSync(storeDir(base), { recursive: true });
    writeFileSync(keysFile(base), JSON.stringify(data), "utf8");
  };

  const readKeys = (base: string) =>
    JSON.parse(readFileSync(keysFile(base), "utf8")) as Record<string, unknown>;

  it("keeps every key when one entry is unreadable", async () => {
    // A null entry in the middle of the file used to abort the whole load,
    // so every key after it was silently lost and its work could run again.
    writeKeys(root, {
      "job-before": {
        key: "job-before",
        executionId: "exec-1",
        status: "completed",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      "job-corrupt": null,
      "job-after": {
        key: "job-after",
        executionId: "exec-2",
        status: "completed",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    });

    const store = new Idempotency({ root });
    await store.initialize();

    const before = await store.shouldExecute("job-before");
    expect(before.reason).toBe("already_completed");
    expect(before.proceed).toBe(false);

    const after = await store.shouldExecute("job-after");
    expect(after.reason).toBe("already_completed");
    expect(after.proceed).toBe(false);
  });

  it("blocks a key whose entry is unreadable instead of running it again", async () => {
    writeKeys(root, { "job-corrupt": null });

    const store = new Idempotency({ root });
    await store.initialize();

    const decision = await store.shouldExecute("job-corrupt");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("corrupt_entry");
  });

  it("blocks a key whose entry has an unknown status", async () => {
    writeKeys(root, {
      "job-unknown-status": {
        key: "job-unknown-status",
        executionId: "exec-1",
        status: "something-else",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    });

    const store = new Idempotency({ root });
    await store.initialize();

    const decision = await store.shouldExecute("job-unknown-status");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("corrupt_entry");
  });

  it("keeps an unreadable entry on disk rather than repairing it silently", async () => {
    writeKeys(root, { "job-corrupt": null });

    const store = new Idempotency({ root });
    await store.initialize();

    // Registering another key rewrites the file; the corrupt entry must
    // survive that rewrite, or the key would be unblocked on the next start.
    await store.register("job-other", "exec-3");

    const persisted = readKeys(root);
    expect(Object.prototype.hasOwnProperty.call(persisted, "job-corrupt")).toBe(
      true,
    );
    expect(persisted["job-corrupt"]).toBeNull();
    expect(Object.prototype.hasOwnProperty.call(persisted, "job-other")).toBe(
      true,
    );
  });

  it("unblocks a corrupt key when it is registered again", async () => {
    writeKeys(root, { "job-corrupt": null });

    const store = new Idempotency({ root });
    await store.initialize();
    expect((await store.shouldExecute("job-corrupt")).proceed).toBe(false);

    await store.register("job-corrupt", "exec-9");

    const decision = await store.shouldExecute("job-corrupt");
    expect(decision.proceed).toBe(false);
    expect(decision.reason).toBe("already_in_progress");
  });

  it("treats a numeric expiry as a timestamp", async () => {
    writeKeys(root, {
      "job-numeric": {
        key: "job-numeric",
        executionId: "exec-1",
        status: "pending",
        createdAt: Date.parse("2026-01-01T00:00:00.000Z"),
        expiresAt: Date.parse("2026-01-01T00:00:01.000Z"),
      },
    });

    const store = new Idempotency({ root });
    await store.initialize();

    const decision = await store.shouldExecute("job-numeric");
    expect(decision.reason).toBe("key_not_found");
    expect(decision.proceed).toBe(true);
  });

  it("expires a key only strictly after its expiry instant", async () => {
    // The comparison is strictly greater than, so a key is still live at the
    // exact instant it expires.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));

    const expiry = Date.parse("2026-06-01T12:00:00.000Z");
    writeKeys(root, {
      "job-boundary": {
        key: "job-boundary",
        executionId: "exec-1",
        status: "pending",
        createdAt: "2026-06-01T11:00:00.000Z",
        expiresAt: expiry,
      },
    });

    const store = new Idempotency({ root });
    await store.initialize();

    const atExpiry = await store.shouldExecute("job-boundary");
    expect(atExpiry.proceed).toBe(false);
    expect(atExpiry.reason).toBe("already_in_progress");

    vi.setSystemTime(new Date(expiry + 1));
    const afterExpiry = await store.shouldExecute("job-boundary");
    expect(afterExpiry.proceed).toBe(true);
    expect(afterExpiry.reason).toBe("key_not_found");
  });

  it("removes expired keys with cleanup() after a reload", async () => {
    const expired = Date.parse("2026-01-01T00:00:00.000Z");
    const live = Date.parse("2099-01-01T00:00:00.000Z");
    writeKeys(root, {
      "job-expired": {
        key: "job-expired",
        executionId: "exec-1",
        status: "pending",
        createdAt: "2025-12-31T23:00:00.000Z",
        expiresAt: expired,
      },
      "job-live": {
        key: "job-live",
        executionId: "exec-2",
        status: "pending",
        createdAt: "2026-01-01T00:00:00.000Z",
        expiresAt: live,
      },
    });

    const store = new Idempotency({ root });
    await store.initialize();

    const removed = await store.cleanup();
    expect(removed).toBe(1);

    const persisted = readKeys(root);
    expect(Object.prototype.hasOwnProperty.call(persisted, "job-expired")).toBe(
      false,
    );
    expect(Object.prototype.hasOwnProperty.call(persisted, "job-live")).toBe(
      true,
    );
  });

  it("keeps the persisted file readable under concurrent calls", async () => {
    // The store takes no locks, so two writes can interleave. The file must
    // still parse afterwards, and every registered key must be present.
    const store = new Idempotency({ root, ttlMs: 60000 });
    await store.initialize();

    await Promise.all([
      store.register("job-a", "exec-1"),
      store.register("job-b", "exec-2"),
      store.register("job-c", "exec-3"),
      store.shouldExecute("job-a"),
      store.shouldExecute("job-b"),
    ]);

    const persisted = readKeys(root);
    expect(Object.keys(persisted).length).toBeGreaterThan(0);
    for (const key of ["job-a", "job-b", "job-c"]) {
      expect(Object.prototype.hasOwnProperty.call(persisted, key)).toBe(true);
    }
  });

  it("does not lose execution records across a reload", async () => {
    const started = new Date("2026-06-01T10:00:00.000Z");
    const store = new Idempotency({ root, ttlMs: 60000 });
    await store.initialize();
    await store.recordExecution({
      executionId: "exec-1",
      type: "research",
      input: {},
      status: "running",
      createdAt: started,
      context: {
        executionId: "exec-1",
        correlationId: "corr-1",
        timestamps: { started, lastUpdated: started },
        retryCount: 0,
        maxRetries: 3,
        state: "running",
        metadata: {},
      },
    });

    const reloaded = new Idempotency({ root, ttlMs: 60000 });
    await reloaded.initialize();

    const record = await reloaded.getExecution("exec-1");
    expect(record).toBeDefined();
    expect(record!.executionId).toBe("exec-1");
  });
});
