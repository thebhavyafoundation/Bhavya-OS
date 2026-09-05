/**
 * Audit repository tests — append-only sensitive-action log.
 *
 * The audit store lives in the app database (same store the routes
 * use); these tests insert uniquely-tagged rows and delete every one
 * of them afterwards, leaving zero residue in development data.
 */

import { describe, it, expect, afterAll } from "vitest";
import { recordAuditEvent, listAuditEvents } from "@/lib/audit-repository";
import { initDatabase, getDb } from "@/lib/db";

const TAG = `audit-test-${Date.now()}`;
const email = (n: string) => `${n}-${TAG}@example.com`;

afterAll(async () => {
  await initDatabase();
  getDb()
    .prepare("DELETE FROM audit_events WHERE actor_email LIKE ?")
    .run(`%-${TAG}@example.com`);
  const remaining = (
    getDb()
      .prepare(
        "SELECT COUNT(*) as n FROM audit_events WHERE actor_email LIKE ?",
      )
      .get(`%-${TAG}@example.com`) as { n: number }
  ).n;
  expect(remaining).toBe(0);
});

describe("audit event log", () => {
  it("records and lists a login event", async () => {
    await initDatabase();
    await recordAuditEvent({
      actorId: "u_1",
      actorEmail: email("a"),
      action: "login",
      resource: "session",
      result: "success",
    });
    const events = await listAuditEvents(500);
    const found = events.find((e) => e.actorEmail === email("a"));
    expect(found).toBeDefined();
    expect(found!.action).toBe("login");
    expect(found!.result).toBe("success");
  });

  it("records failures distinctly from successes", async () => {
    await initDatabase();
    await recordAuditEvent({
      actorEmail: email("b"),
      action: "login",
      resource: "session",
      result: "failure",
    });
    const events = await listAuditEvents(500);
    const found = events.find((e) => e.actorEmail === email("b"));
    expect(found?.result).toBe("failure");
  });

  it("never rejects the caller", async () => {
    await initDatabase();
    await expect(
      recordAuditEvent({
        actorEmail: email("c"),
        action: "probe",
        metadata: { ok: true },
      }),
    ).resolves.toBeUndefined();
  });
});
