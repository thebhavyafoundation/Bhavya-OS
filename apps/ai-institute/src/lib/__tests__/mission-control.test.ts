/**
 * Mission Control repository tests — job/artifact/approval/decision loop.
 *
 * Runs against the isolated test database (see __tests__/setup.ts), so no
 * residue escapes. Covers: artifact creation + auto v1, versioning/lineage
 * incl. human replacement, approval request/decide persistence, reason
 * enforcement, stale-round guard, completion gate, invalid transitions.
 */

import { describe, it, expect } from "vitest";
import { initDatabase } from "@/lib/db";
import { getMissionControlRepository } from "@/lib/repositories";

const TAG = `mc-test-${Date.now()}`;

async function freshJob(title: string) {
  const repo = getMissionControlRepository();
  await initDatabase();
  return repo.createJob({ title: `${title} ${TAG}`, createdBy: "test-operator" });
}

describe("mission control job lifecycle", () => {
  it("creates, starts, and submits a job for approval", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Evaluation run");
    expect(job.status).toBe("queued");
    expect((await repo.startJob(job.id)).status).toBe("running");
    expect((await repo.submitJobForApproval(job.id)).status).toBe("awaiting_approval");
  });

  it("rejects invalid transitions", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Bad transition");
    await expect(repo.completeJob(job.id)).rejects.toThrow("Invalid job transition");
    await expect(repo.submitJobForApproval(job.id)).rejects.toThrow("Invalid job transition");
  });

  it("refuses completion while artifacts are unapproved", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Gated completion");
    await repo.startJob(job.id);
    await repo.submitJobForApproval(job.id);
    await repo.createArtifact({ jobId: job.id, title: `Draft ${TAG}`, producer: "agent-1" });
    await expect(repo.completeJob(job.id)).rejects.toThrow("not approved");
  });
});

describe("mission control artifact lineage", () => {
  it("auto-creates version 1 and versions with parent lineage", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Lineage");
    const { artifact, version } = await repo.createArtifact({
      jobId: job.id,
      title: `Brief ${TAG}`,
      producer: "agent-1",
    });
    expect(version.version).toBe(1);
    expect(artifact.currentVersion).toBe(1);
    const v2 = await repo.addVersion({
      artifactId: artifact.id,
      producer: "human-operator",
      humanReplacement: true,
      note: "Replacement draft",
    });
    expect(v2.version).toBe(2);
    expect(v2.parentVersion).toBe(1);
    expect(v2.humanReplacement).toBe(true);
    const versions = await repo.listVersions(artifact.id);
    expect(versions.map((v) => v.version)).toEqual([1, 2]);
  });

  it("refuses versions on integrated artifacts", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Frozen");
    const { artifact } = await repo.createArtifact({
      jobId: job.id,
      title: `Frozen ${TAG}`,
      producer: "agent-1",
    });
    const db = (await import("@/lib/db")).getAsyncDb();
    await db.run("UPDATE mc_artifacts SET status = 'integrated' WHERE id = ?", artifact.id);
    await expect(
      repo.addVersion({ artifactId: artifact.id, producer: "agent-1" }),
    ).rejects.toThrow("Cannot version");
  });
});

describe("mission control approval loop", () => {
  it("reject persists reason, moves job to revising, blocks stale rounds", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Review round");
    await repo.startJob(job.id);
    await repo.submitJobForApproval(job.id);
    const { artifact } = await repo.createArtifact({
      jobId: job.id,
      title: `Proposal ${TAG}`,
      producer: "agent-1",
    });
    const req = await repo.requestApproval(artifact.id, "test-operator");
    expect(req.status).toBe("pending");
    expect((await repo.listPendingApprovals()).some((r) => r.id === req.id)).toBe(true);

    await expect(
      repo.decide({ requestId: req.id, action: "reject", actor: "human-1" }),
    ).rejects.toThrow("reason is required");

    const decision = await repo.decide({
      requestId: req.id,
      action: "reject",
      actor: "human-1",
      reason: "Style does not represent Bhavya",
      instruction: "Rewrite in institutional voice",
    });
    expect(decision.action).toBe("reject");
    expect(decision.reason).toBe("Style does not represent Bhavya");
    expect((await repo.getJob(job.id))?.status).toBe("revising");
    expect((await repo.listPendingApprovals()).some((r) => r.id === req.id)).toBe(false);

    // New version cancels nothing pending here, but the decided round is stale.
    await repo.addVersion({ artifactId: artifact.id, producer: "human-1" });
    await expect(
      repo.decide({ requestId: req.id, action: "approve", actor: "human-1" }),
    ).rejects.toThrow("already decided");
  });

  it("approve then complete closes the loop", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Full loop");
    await repo.startJob(job.id);
    await repo.submitJobForApproval(job.id);
    const { artifact } = await repo.createArtifact({
      jobId: job.id,
      title: `Report ${TAG}`,
      producer: "agent-1",
    });
    const req = await repo.requestApproval(artifact.id, "test-operator");
    await repo.decide({ requestId: req.id, action: "approve", actor: "human-1" });
    expect((await repo.getArtifact(artifact.id))?.status).toBe("approved");
    expect((await repo.completeJob(job.id)).status).toBe("completed");
    const history = await repo.listDecisions("approval_request", req.id);
    expect(history.length).toBe(1);
    expect(history[0].actor).toBe("human-1");
  });

  it("stopJob records an abort decision with reason", async () => {
    const repo = getMissionControlRepository();
    const job = await freshJob("Stopped");
    await repo.startJob(job.id);
    await expect(repo.stopJob(job.id, "human-1", "")).rejects.toThrow("reason is required");
    const stopped = await repo.stopJob(job.id, "human-1", "Superseded by new brief");
    expect(stopped.status).toBe("stopped");
    const decisions = await repo.listDecisions("job", job.id);
    expect(decisions.some((d) => d.action === "abort")).toBe(true);
  });
});
