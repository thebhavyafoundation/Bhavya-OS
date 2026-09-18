/**
 * SQLite Mission Control repository (async adapter — local + Turso).
 *
 * Enforces the job and artifact state machines in code (the DB CHECK
 * constraints are a second line of defense). Every mutation appends an
 * `evidence_records` row (activity_type `mission-control.*`) so the
 * existing audit timeline observes the control plane. Decisions are
 * append-only: rows are never updated or deleted.
 */

import { getAsyncDb } from "../db";
import type {
  McApprovalRequest,
  McArtifact,
  McArtifactStatus,
  McArtifactVersion,
  McDecision,
  McDecisionAction,
  McJob,
  McJobStatus,
  McRequestDecision,
  MissionControlRepository,
} from "./mission-control-repository";

type Row = Record<string, unknown>;

const JOB_TRANSITIONS: Record<McJobStatus, McJobStatus[]> = {
  queued: ["running", "cancelled"],
  running: ["awaiting_approval", "stopped", "failed", "cancelled"],
  awaiting_approval: ["revising", "completed", "stopped"],
  revising: ["awaiting_approval", "stopped"],
  completed: [],
  stopped: [],
  failed: [],
  cancelled: [],
};

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

function rowToJob(r: Row): McJob {
  return {
    id: r.id as string,
    title: r.title as string,
    department: r.department as string,
    agent: r.agent as string,
    taskContractIds: JSON.parse((r.task_contract_ids as string) ?? "[]"),
    status: r.status as McJobStatus,
    createdBy: r.created_by as string,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function rowToArtifact(r: Row): McArtifact {
  return {
    id: r.id as string,
    jobId: r.job_id as string,
    kind: r.kind as string,
    title: r.title as string,
    source: r.source as string,
    status: r.status as McArtifactStatus,
    currentVersion: r.current_version as number,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function rowToVersion(r: Row): McArtifactVersion {
  return {
    id: r.id as string,
    artifactId: r.artifact_id as string,
    version: r.version as number,
    path: r.path as string,
    hash: r.hash as string,
    producer: r.producer as string,
    parentVersion: (r.parent_version as number) ?? undefined,
    humanReplacement: (r.human_replacement as number) === 1,
    status: r.status as string,
    note: r.note as string,
    createdAt: r.created_at as string,
  };
}

function rowToApproval(r: Row): McApprovalRequest {
  return {
    id: r.id as string,
    artifactId: r.artifact_id as string,
    version: r.version as number,
    requestedBy: r.requested_by as string,
    status: r.status as McApprovalRequest["status"],
    createdAt: r.created_at as string,
    decidedAt: (r.decided_at as string) ?? undefined,
  };
}

function rowToDecision(r: Row): McDecision {
  return {
    id: r.id as string,
    action: r.action as McDecisionAction,
    targetKind: r.target_kind as string,
    targetId: r.target_id as string,
    actor: r.actor as string,
    reason: r.reason as string,
    instruction: r.instruction as string,
    artifactVersion: (r.artifact_version as number) ?? undefined,
    createdAt: r.created_at as string,
  };
}

export class SqliteMissionControlRepository implements MissionControlRepository {
  private async evidence(
    activityType: string,
    activityId: string,
    description: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const db = getAsyncDb();
    await db.run(
      `INSERT INTO evidence_records (id, activity_type, activity_id, timestamp, description, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      uid("ev-mc"),
      activityType,
      activityId,
      now(),
      description,
      JSON.stringify(metadata),
    );
  }

  // ── Jobs ──────────────────────────────────────────────────────────

  async createJob(input: {
    title: string;
    department?: string;
    agent?: string;
    taskContractIds?: string[];
    createdBy: string;
  }): Promise<McJob> {
    if (!input.title.trim()) throw new Error("Job title is required");
    if (!input.createdBy.trim()) throw new Error("createdBy actor is required");
    const db = getAsyncDb();
    const id = uid("mc-job");
    await db.run(
      `INSERT INTO mc_jobs (id, title, department, agent, task_contract_ids, status, created_by)
       VALUES (?, ?, ?, ?, ?, 'queued', ?)`,
      id,
      input.title.trim(),
      input.department?.trim() || "engineering",
      input.agent?.trim() || "",
      JSON.stringify(input.taskContractIds ?? []),
      input.createdBy.trim(),
    );
    await this.evidence("mission-control.job", id, `Job created: ${input.title.trim()}`, {
      department: input.department ?? "engineering",
    });
    return (await this.getJob(id)) as McJob;
  }

  async getJob(id: string): Promise<McJob | undefined> {
    const db = getAsyncDb();
    const row = await db.get<Row>("SELECT * FROM mc_jobs WHERE id = ?", id);
    return row ? rowToJob(row) : undefined;
  }

  async listJobs(status?: McJobStatus): Promise<McJob[]> {
    const db = getAsyncDb();
    const rows = status
      ? await db.all<Row>("SELECT * FROM mc_jobs WHERE status = ? ORDER BY updated_at DESC", status)
      : await db.all<Row>("SELECT * FROM mc_jobs ORDER BY updated_at DESC");
    return rows.map(rowToJob);
  }

  private async transitionJob(id: string, to: McJobStatus): Promise<McJob> {
    const db = getAsyncDb();
    const job = await this.getJob(id);
    if (!job) throw new Error(`Job not found: ${id}`);
    if (!JOB_TRANSITIONS[job.status].includes(to)) {
      throw new Error(`Invalid job transition: ${job.status} -> ${to}`);
    }
    await db.run("UPDATE mc_jobs SET status = ?, updated_at = ? WHERE id = ?", to, now(), id);
    await this.evidence("mission-control.job", id, `Job ${job.status} -> ${to}`, {});
    return (await this.getJob(id)) as McJob;
  }

  async startJob(id: string): Promise<McJob> {
    return this.transitionJob(id, "running");
  }

  async submitJobForApproval(id: string): Promise<McJob> {
    return this.transitionJob(id, "awaiting_approval");
  }

  async completeJob(id: string): Promise<McJob> {
    const artifacts = await this.listArtifacts(id);
    const blocking = artifacts.filter(
      (a) => a.status !== "approved" && a.status !== "integrated" && a.status !== "archived",
    );
    if (blocking.length > 0) {
      throw new Error(
        `Cannot complete job: ${blocking.length} artifact(s) not approved (${blocking.map((a) => a.id).join(", ")})`,
      );
    }
    return this.transitionJob(id, "completed");
  }

  async stopJob(id: string, actor: string, reason: string): Promise<McJob> {
    if (!reason.trim()) throw new Error("A reason is required to stop a job");
    const job = await this.transitionJob(id, "stopped");
    const db = getAsyncDb();
    await db.run(
      `INSERT INTO mc_decisions (id, action, target_kind, target_id, actor, reason)
       VALUES (?, 'abort', 'job', ?, ?, ?)`,
      uid("mc-dec"),
      id,
      actor,
      reason.trim(),
    );
    await this.evidence("mission-control.decision", id, `Job stopped by ${actor}: ${reason.trim()}`, {});
    return job;
  }

  async cancelJob(id: string): Promise<McJob> {
    return this.transitionJob(id, "cancelled");
  }

  // ── Artifacts ─────────────────────────────────────────────────────

  async createArtifact(input: {
    jobId: string;
    kind?: string;
    title: string;
    source?: string;
    producer: string;
    note?: string;
  }): Promise<{ artifact: McArtifact; version: McArtifactVersion }> {
    const db = getAsyncDb();
    const job = await this.getJob(input.jobId);
    if (!job) throw new Error(`Job not found: ${input.jobId}`);
    if (!input.title.trim()) throw new Error("Artifact title is required");
    if (!input.producer.trim()) throw new Error("Producer is required");
    const id = uid("mc-art");
    await db.run(
      `INSERT INTO mc_artifacts (id, job_id, kind, title, source, status)
       VALUES (?, ?, ?, ?, ?, 'draft')`,
      id,
      input.jobId,
      input.kind?.trim() || "document",
      input.title.trim(),
      input.source?.trim() || "bhavya-internal",
    );
    const version = await this.addVersionInternal(
      id,
      1,
      undefined,
      input.producer.trim(),
      "",
      "",
      false,
      input.note?.trim() || "",
    );
    await this.evidence("mission-control.artifact", id, `Artifact created: ${input.title.trim()}`, {
      jobId: input.jobId,
    });
    return { artifact: (await this.getArtifact(id)) as McArtifact, version };
  }

  async getArtifact(id: string): Promise<McArtifact | undefined> {
    const db = getAsyncDb();
    const row = await db.get<Row>("SELECT * FROM mc_artifacts WHERE id = ?", id);
    return row ? rowToArtifact(row) : undefined;
  }

  async listArtifacts(jobId: string): Promise<McArtifact[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT * FROM mc_artifacts WHERE job_id = ? ORDER BY created_at ASC",
      jobId,
    );
    return rows.map(rowToArtifact);
  }

  private async addVersionInternal(
    artifactId: string,
    version: number,
    parentVersion: number | undefined,
    producer: string,
    path: string,
    hash: string,
    humanReplacement: boolean,
    note: string,
  ): Promise<McArtifactVersion> {
    const db = getAsyncDb();
    const id = uid("mc-ver");
    await db.run(
      `INSERT INTO mc_artifact_versions (id, artifact_id, version, path, hash, producer, parent_version, human_replacement, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
      id,
      artifactId,
      version,
      path,
      hash,
      producer,
      parentVersion ?? null,
      humanReplacement ? 1 : 0,
      note,
    );
    await db.run(
      "UPDATE mc_artifacts SET current_version = ?, status = 'review', updated_at = ? WHERE id = ?",
      version,
      now(),
      artifactId,
    );
    const row = await db.get<Row>("SELECT * FROM mc_artifact_versions WHERE id = ?", id);
    return rowToVersion(row!);
  }

  async addVersion(input: {
    artifactId: string;
    producer: string;
    path?: string;
    hash?: string;
    humanReplacement?: boolean;
    note?: string;
  }): Promise<McArtifactVersion> {
    const artifact = await this.getArtifact(input.artifactId);
    if (!artifact) throw new Error(`Artifact not found: ${input.artifactId}`);
    if (artifact.status === "integrated" || artifact.status === "archived") {
      throw new Error(`Cannot version a ${artifact.status} artifact`);
    }
    if (!input.producer.trim()) throw new Error("Producer is required");
    const version = await this.addVersionInternal(
      artifact.id,
      artifact.currentVersion + 1,
      artifact.currentVersion,
      input.producer.trim(),
      input.path?.trim() || "",
      input.hash?.trim() || "",
      input.humanReplacement ?? false,
      input.note?.trim() || "",
    );
    // A superseded pending request must not linger: cancel it so the new
    // version goes through a fresh explicit approval round.
    const db = getAsyncDb();
    await db.run(
      "UPDATE mc_approval_requests SET status = 'cancelled' WHERE artifact_id = ? AND status = 'pending'",
      artifact.id,
    );
    await this.evidence(
      "mission-control.artifact",
      artifact.id,
      `Version ${version.version} recorded${input.humanReplacement ? " (human replacement)" : ""}`,
      { version: version.version },
    );
    return version;
  }

  async listVersions(artifactId: string): Promise<McArtifactVersion[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT * FROM mc_artifact_versions WHERE artifact_id = ? ORDER BY version ASC",
      artifactId,
    );
    return rows.map(rowToVersion);
  }

  // ── Approvals + decisions ─────────────────────────────────────────

  async requestApproval(artifactId: string, requestedBy: string): Promise<McApprovalRequest> {
    const db = getAsyncDb();
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) throw new Error(`Artifact not found: ${artifactId}`);
    if (!requestedBy.trim()) throw new Error("requestedBy actor is required");
    const existing = await db.get<Row>(
      "SELECT * FROM mc_approval_requests WHERE artifact_id = ? AND status = 'pending' LIMIT 1",
      artifactId,
    );
    if (existing) throw new Error(`Approval already pending for artifact: ${artifactId}`);
    const id = uid("mc-appr");
    await db.run(
      `INSERT INTO mc_approval_requests (id, artifact_id, version, requested_by, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      id,
      artifactId,
      artifact.currentVersion,
      requestedBy.trim(),
    );
    await db.run("UPDATE mc_artifacts SET status = 'review', updated_at = ? WHERE id = ?", now(), artifactId);
    await this.evidence("mission-control.approval", id, `Approval requested for ${artifact.title} v${artifact.currentVersion}`, {});
    const row = await db.get<Row>("SELECT * FROM mc_approval_requests WHERE id = ?", id);
    return rowToApproval(row!);
  }

  async listPendingApprovals(): Promise<McApprovalRequest[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT * FROM mc_approval_requests WHERE status = 'pending' ORDER BY created_at ASC",
    );
    return rows.map(rowToApproval);
  }

  async decide(input: {
    requestId: string;
    action: McRequestDecision;
    actor: string;
    reason?: string;
    instruction?: string;
  }): Promise<McDecision> {
    const db = getAsyncDb();
    const req = await db.get<Row>("SELECT * FROM mc_approval_requests WHERE id = ?", input.requestId);
    if (!req) throw new Error(`Approval request not found: ${input.requestId}`);
    if (req.status !== "pending") throw new Error(`Request already decided: ${req.status}`);
    if (!input.actor.trim()) throw new Error("Actor is required");
    if ((input.action === "reject" || input.action === "request_revision") && !input.reason?.trim()) {
      throw new Error(`A reason is required to ${input.action.replace("_", " ")}`);
    }
    const request = rowToApproval(req);
    const artifact = (await this.getArtifact(request.artifactId)) as McArtifact;
    // Guard against deciding a stale round: the request must match the artifact's current version.
    if (request.version !== artifact.currentVersion) {
      throw new Error(
        `Request targets v${request.version} but artifact is at v${artifact.currentVersion} — superseded`,
      );
    }

    const nextRequestStatus = input.action === "approve" ? "approved" : input.action === "reject" ? "rejected" : "revision_requested";
    const nextArtifactStatus: McArtifactStatus =
      input.action === "approve" ? "approved" : input.action === "reject" ? "rejected" : "revision_requested";
    const ts = now();
    await db.run("UPDATE mc_approval_requests SET status = ?, decided_at = ? WHERE id = ?", nextRequestStatus, ts, request.id);
    await db.run("UPDATE mc_artifact_versions SET status = ? WHERE artifact_id = ? AND version = ?", nextRequestStatus === "revision_requested" ? "revision_requested" : nextRequestStatus, request.artifactId, request.version);
    await db.run("UPDATE mc_artifacts SET status = ?, updated_at = ? WHERE id = ?", nextArtifactStatus, ts, request.artifactId);

    const job = (await this.getJob(artifact.jobId)) as McJob;
    if (input.action === "reject" || input.action === "request_revision") {
      if (job.status === "awaiting_approval") {
        await db.run("UPDATE mc_jobs SET status = 'revising', updated_at = ? WHERE id = ?", ts, job.id);
      }
    }

    const decisionId = uid("mc-dec");
    await db.run(
      `INSERT INTO mc_decisions (id, action, target_kind, target_id, actor, reason, instruction, artifact_version)
       VALUES (?, ?, 'approval_request', ?, ?, ?, ?, ?)`,
      decisionId,
      input.action,
      request.id,
      input.actor.trim(),
      input.reason?.trim() || "",
      input.instruction?.trim() || "",
      request.version,
    );
    await this.evidence(
      "mission-control.decision",
      decisionId,
      `${input.action} by ${input.actor.trim()} on ${artifact.title} v${request.version}`,
      { requestId: request.id, artifactId: request.artifactId },
    );
    const row = await db.get<Row>("SELECT * FROM mc_decisions WHERE id = ?", decisionId);
    return rowToDecision(row!);
  }

  async listDecisions(targetKind?: string, targetId?: string): Promise<McDecision[]> {
    const db = getAsyncDb();
    let rows: Row[];
    if (targetKind && targetId) {
      rows = await db.all<Row>(
        "SELECT * FROM mc_decisions WHERE target_kind = ? AND target_id = ? ORDER BY created_at ASC",
        targetKind,
        targetId,
      );
    } else {
      rows = await db.all<Row>("SELECT * FROM mc_decisions ORDER BY created_at DESC LIMIT 200");
    }
    return rows.map(rowToDecision);
  }
}
