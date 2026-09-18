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
  McEvidenceRow,
  McJob,
  McJobStatus,
  McRequestDecision,
  McSession,
  MissionControlRepository,
  MissionEdge,
  MissionGraph,
  MissionNode,
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
    queueJobId: (r.queue_job_id as string) ?? "",
    sessionId: (r.session_id as string) ?? "",
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
    sessionId: (r.session_id as string) ?? "",
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
    idempotencyKey?: string;
  }): Promise<McJob> {
    if (!input.title.trim()) throw new Error("Job title is required");
    if (!input.createdBy.trim()) throw new Error("createdBy actor is required");
    const db = getAsyncDb();
    if (input.idempotencyKey?.trim()) {
      const key = `job-create:${input.idempotencyKey.trim()}`;
      const prior = await db.get<Row>(
        "SELECT * FROM evidence_records WHERE idempotency_key = ? LIMIT 1",
        key,
      );
      if (prior) {
        const meta = JSON.parse((prior.metadata as string) ?? "{}") as { jobId?: string };
        const existing = meta.jobId ? await this.getJob(meta.jobId) : undefined;
        if (existing) return existing;
      }
    }
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
    const meta: Record<string, unknown> = { department: input.department ?? "engineering" };
    let idemKey: string | null = null;
    if (input.idempotencyKey?.trim()) {
      idemKey = `job-create:${input.idempotencyKey.trim()}`;
      meta.jobId = id;
    }
    const evId = uid("ev-mc");
    await db.run(
      `INSERT INTO evidence_records (id, activity_type, activity_id, timestamp, description, metadata, idempotency_key)
       VALUES (?, 'mission-control.job', ?, ?, ?, ?, ?)`,
      evId,
      id,
      now(),
      `Job created: ${input.title.trim()}`,
      JSON.stringify(meta),
      idemKey,
    );
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

  async searchJobs(query: string, limit: number = 50): Promise<McJob[]> {
    const q = query.trim();
    if (!q) return [];
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT * FROM mc_jobs WHERE id LIKE ? OR title LIKE ? ORDER BY updated_at DESC LIMIT ?",
      `%${q}%`,
      `%${q}%`,
      Math.min(Math.max(limit, 1), 200),
    );
    return rows.map(rowToJob);
  }

  async listRecentArtifacts(limit: number = 20): Promise<{ artifact: McArtifact; jobTitle: string }[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      `SELECT a.*, j.title AS job_title FROM mc_artifacts a
       JOIN mc_jobs j ON j.id = a.job_id
       ORDER BY a.created_at DESC LIMIT ?`,
      Math.min(Math.max(limit, 1), 200),
    );
    return rows.map((r) => ({ artifact: rowToArtifact(r), jobTitle: r.job_title as string }));
  }

  async listArtifactsByStatus(statuses: McArtifactStatus[]): Promise<{ artifact: McArtifact; jobTitle: string }[]> {
    if (statuses.length === 0) return [];
    const db = getAsyncDb();
    const placeholders = statuses.map(() => "?").join(", ");
    const rows = await db.all<Row>(
      `SELECT a.*, j.title AS job_title FROM mc_artifacts a
       JOIN mc_jobs j ON j.id = a.job_id
       WHERE a.status IN (${placeholders}) ORDER BY a.updated_at DESC LIMIT 200`,
      ...statuses,
    );
    return rows.map((r) => ({ artifact: rowToArtifact(r), jobTitle: r.job_title as string }));
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
      "",
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
    sessionId: string,
  ): Promise<McArtifactVersion> {
    const db = getAsyncDb();
    const id = uid("mc-ver");
    await db.run(
      `INSERT INTO mc_artifact_versions (id, artifact_id, version, path, hash, producer, parent_version, human_replacement, session_id, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
      id,
      artifactId,
      version,
      path,
      hash,
      producer,
      parentVersion ?? null,
      humanReplacement ? 1 : 0,
      sessionId,
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
    sessionId?: string;
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
      input.sessionId?.trim() || "",
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

  async listApprovalRequests(artifactId: string): Promise<McApprovalRequest[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT * FROM mc_approval_requests WHERE artifact_id = ? ORDER BY created_at ASC",
      artifactId,
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

  async findJobsByTaskContract(contractId: string): Promise<McJob[]> {
    if (!contractId.trim()) return [];
    const jobs = await this.listJobs();
    return jobs.filter((j) => j.taskContractIds.includes(contractId.trim()));
  }

  async createJobFromEvaluation(input: {
    repoId: string;
    repoName: string;
    language?: string;
    stars?: number;
    forks?: number;
    license?: string;
    healthScore?: number;
    technologyScore?: number;
    bhavyaScore?: number;
    maturity?: string;
    recommendation?: string;
    relevance?: string;
    taskContractIds?: string[];
    createdBy: string;
    producer?: string;
  }): Promise<{
    job: McJob;
    session: McSession;
    artifact: McArtifact;
    version: McArtifactVersion;
    deduped: boolean;
  }> {
    if (!input.repoId.trim()) throw new Error("repoId is required");
    if (!input.repoName.trim()) throw new Error("repoName is required");
    if (!input.createdBy.trim()) throw new Error("createdBy actor is required");
    const db = getAsyncDb();
    const key = `ghos-eval:${input.repoId.trim()}`;
    const prior = await db.get<Row>(
      "SELECT * FROM evidence_records WHERE idempotency_key = ? LIMIT 1",
      key,
    );
    if (prior) {
      const meta = JSON.parse((prior.metadata as string) ?? "{}") as {
        jobId?: string;
        artifactId?: string;
        sessionId?: string;
      };
      const job = meta.jobId ? await this.getJob(meta.jobId) : undefined;
      const priorSession = meta.sessionId
        ? await db.get<Row>("SELECT * FROM mc_sessions WHERE id = ?", meta.sessionId)
        : undefined;
      const session = priorSession ? rowToSession(priorSession) : undefined;
      const artifact = meta.artifactId ? await this.getArtifact(meta.artifactId) : undefined;
      if (job && session && artifact) {
        const versions = await this.listVersions(artifact.id);
        return { job, session, artifact, version: versions[0], deduped: true };
      }
      // Prior record is stale (rows removed) — fall through and rebuild.
    }
    const producer = input.producer?.trim() || "github-os";
    const job = await this.createJob({
      title: `Evaluate ${input.repoName.trim()}`,
      department: "intelligence",
      agent: producer,
      taskContractIds: input.taskContractIds ?? [],
      createdBy: input.createdBy.trim(),
    });
    await this.startJob(job.id);
    const session = await this.startSession(job.id, producer);
    const facts = [
      `Repository: ${input.repoName.trim()}`,
      input.language ? `Language: ${input.language}` : null,
      typeof input.stars === "number" ? `Stars: ${input.stars}` : null,
      typeof input.forks === "number" ? `Forks: ${input.forks}` : null,
      input.license ? `License: ${input.license}` : null,
      typeof input.healthScore === "number" ? `Health: ${input.healthScore}` : null,
      typeof input.technologyScore === "number" ? `Technology: ${input.technologyScore}` : null,
      typeof input.bhavyaScore === "number" ? `Bhavya score: ${input.bhavyaScore}` : null,
      input.maturity ? `Maturity: ${input.maturity}` : null,
      input.recommendation ? `Recommendation: ${input.recommendation}` : null,
      input.relevance ? `Relevance: ${input.relevance}` : null,
    ]
      .filter((x): x is string => Boolean(x))
      .join(" · ");
    const { artifact, version } = await this.createArtifact({
      jobId: job.id,
      kind: "evaluation",
      title: `Capability evaluation: ${input.repoName.trim()}`,
      source: "github-os",
      producer,
      note: facts,
    });
    await db.run(
      "UPDATE mc_artifact_versions SET session_id = ?, path = ? WHERE id = ?",
      session.id,
      `github-os:repository:${input.repoId.trim()}`,
      version.id,
    );
    await db.run(
      `INSERT INTO evidence_records (id, activity_type, activity_id, timestamp, description, metadata, idempotency_key)
       VALUES (?, 'mission-control.evaluation', ?, ?, ?, ?, ?)`,
      uid("ev-mc"),
      job.id,
      now(),
      `Evaluation job created from github-os record ${input.repoId.trim()}`,
      JSON.stringify({ jobId: job.id, artifactId: artifact.id, sessionId: session.id, repoId: input.repoId.trim() }),
      key,
    );
    const running = (await this.getJob(job.id)) as McJob;
    const v1 = (await this.listVersions(artifact.id))[0];
    return { job: running, session, artifact, version: v1, deduped: false };
  }

  private async transitionArtifact(id: string, to: McArtifactStatus): Promise<McArtifact> {
    const db = getAsyncDb();
    const artifact = await this.getArtifact(id);
    if (!artifact) throw new Error(`Artifact not found: ${id}`);
    await db.run("UPDATE mc_artifacts SET status = ?, updated_at = ? WHERE id = ?", to, now(), id);
    await this.evidence("mission-control.artifact", id, `Artifact ${artifact.status} -> ${to}`, {});
    return (await this.getArtifact(id)) as McArtifact;
  }

  async markVerified(artifactId: string): Promise<McArtifact> {
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) throw new Error(`Artifact not found: ${artifactId}`);
    if (artifact.status !== "approved") {
      throw new Error(`Only approved artifacts can be verified (current: ${artifact.status})`);
    }
    return this.transitionArtifact(artifactId, "verified");
  }

  async beginIntegration(artifactId: string): Promise<McArtifact> {
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) throw new Error(`Artifact not found: ${artifactId}`);
    if (artifact.status !== "verified") {
      throw new Error(`Only verified artifacts can integrate (current: ${artifact.status})`);
    }
    return this.transitionArtifact(artifactId, "integrating");
  }

  async completeIntegration(artifactId: string, actor: string, note?: string): Promise<McArtifact> {
    const artifact = await this.getArtifact(artifactId);
    if (!artifact) throw new Error(`Artifact not found: ${artifactId}`);
    if (artifact.status !== "integrating") {
      throw new Error(`Only integrating artifacts can complete (current: ${artifact.status})`);
    }
    if (!actor.trim()) throw new Error("Actor is required to complete integration");
    const db = getAsyncDb();
    const ts = now();
    await db.run("UPDATE mc_artifacts SET status = 'integrated', updated_at = ? WHERE id = ?", ts, artifactId);
    await db.run(
      `INSERT INTO mc_decisions (id, action, target_kind, target_id, actor, reason, instruction, artifact_version)
       VALUES (?, 'approve_integration', 'artifact', ?, ?, ?, ?, ?)`,
      uid("mc-dec"),
      artifactId,
      actor.trim(),
      (note?.trim() || "Integration completed").slice(0, 500),
      "",
      artifact.currentVersion,
    );
    await this.evidence("mission-control.decision", artifactId, `Integration approved by ${actor.trim()} for ${artifact.title} v${artifact.currentVersion}`, {});
    return (await this.getArtifact(artifactId)) as McArtifact;
  }

  // ── Execution bindings + sessions ───────────────────────────────

  async bindQueueJob(jobId: string, queueJobId: string): Promise<McJob> {
    const db = getAsyncDb();
    const job = await this.getJob(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);
    if (!queueJobId.trim()) throw new Error("queueJobId is required");
    if (job.queueJobId) {
      throw new Error(`Job already bound to queue job: ${job.queueJobId}`);
    }
    await db.run("UPDATE mc_jobs SET queue_job_id = ?, updated_at = ? WHERE id = ?", queueJobId.trim(), now(), jobId);
    await this.evidence("mission-control.job", jobId, `Bound to queue job ${queueJobId.trim()}`, {});
    return (await this.getJob(jobId)) as McJob;
  }

  async startSession(jobId: string, producer: string): Promise<McSession> {
    const db = getAsyncDb();
    const job = await this.getJob(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);
    if (!producer.trim()) throw new Error("Producer is required");
    const id = uid("mc-sess");
    await db.run("INSERT INTO mc_sessions (id, job_id, producer, status) VALUES (?, ?, ?, 'running')", id, jobId, producer.trim());
    await db.run("UPDATE mc_jobs SET session_id = ?, updated_at = ? WHERE id = ?", id, now(), jobId);
    await this.evidence("mission-control.session", id, `Session started for job ${jobId} by ${producer.trim()}`, { jobId });
    const row = await db.get<Row>("SELECT * FROM mc_sessions WHERE id = ?", id);
    return rowToSession(row!);
  }

  async endSession(id: string, status: "completed" | "failed"): Promise<McSession> {
    const db = getAsyncDb();
    const row = await db.get<Row>("SELECT * FROM mc_sessions WHERE id = ?", id);
    if (!row) throw new Error(`Session not found: ${id}`);
    const session = rowToSession(row);
    if (session.status !== "running") throw new Error(`Session already ended: ${session.status}`);
    await db.run("UPDATE mc_sessions SET status = ?, ended_at = ? WHERE id = ?", status, now(), id);
    await this.evidence("mission-control.session", id, `Session ${status}`, { jobId: session.jobId });
    const updated = await db.get<Row>("SELECT * FROM mc_sessions WHERE id = ?", id);
    return rowToSession(updated!);
  }

  async listSessions(jobId: string): Promise<McSession[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>("SELECT * FROM mc_sessions WHERE job_id = ? ORDER BY started_at ASC", jobId);
    return rows.map(rowToSession);
  }

  async listEvidence(activityId: string): Promise<McEvidenceRow[]> {
    const db = getAsyncDb();
    const rows = await db.all<Row>(
      "SELECT id, activity_type, activity_id, timestamp, description, metadata FROM evidence_records WHERE activity_id = ? ORDER BY timestamp ASC",
      activityId,
    );
    return rows.map((r: Row) => ({
      id: r.id as string,
      activityType: r.activity_type as string,
      activityId: r.activity_id as string,
      timestamp: r.timestamp as string,
      description: r.description as string,
      metadata: JSON.parse((r.metadata as string) ?? "{}"),
    }));
  }

  // ── Graph projection (read-only, derived, FACT edges only) ──────

  async getMissionGraph(jobId: string): Promise<MissionGraph> {
    const job = await this.getJob(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);
    const nodes: MissionNode[] = [
      { id: `job:${job.id}`, kind: "job", label: job.title, status: job.status },
    ];
    const edges: MissionEdge[] = [];
    for (const tc of job.taskContractIds) {
      nodes.push({ id: `task:${tc}`, kind: "task_contract", label: tc, status: "referenced" });
      edges.push({ from: `job:${job.id}`, to: `task:${tc}`, rel: "references_task", kind: "fact" });
    }
    const artifacts = await this.listArtifacts(jobId);
    const sessions = await this.listSessions(jobId);
    const sessionIds = new Set(sessions.map((s) => s.id));
    for (const s of sessions) {
      nodes.push({ id: `session:${s.id}`, kind: "session", label: `${s.producer} session`, status: s.status });
      edges.push({ from: `session:${s.id}`, to: `job:${job.id}`, rel: "executed_in", kind: "fact" });
    }
    const db = getAsyncDb();
    for (const a of artifacts) {
      nodes.push({ id: `artifact:${a.id}`, kind: "artifact", label: a.title, status: a.status });
      edges.push({ from: `job:${job.id}`, to: `artifact:${a.id}`, rel: "produces", kind: "fact" });
      const versions = await this.listVersions(a.id);
      for (const v of versions) {
        nodes.push({
          id: `version:${a.id}:${v.version}`,
          kind: "version",
          label: `${a.title} v${v.version}${v.humanReplacement ? " (human)" : ""}`,
          status: v.status,
        });
        edges.push({ from: `artifact:${a.id}`, to: `version:${a.id}:${v.version}`, rel: "has_version", kind: "fact" });
        if (v.parentVersion !== undefined) {
          edges.push({
            from: `version:${a.id}:${v.parentVersion}`,
            to: `version:${a.id}:${v.version}`,
            rel: "supersedes",
            kind: "fact",
          });
        }
        if (v.sessionId && sessionIds.has(v.sessionId)) {
          edges.push({
            from: `version:${a.id}:${v.version}`,
            to: `session:${v.sessionId}`,
            rel: "produced_by_session",
            kind: "fact",
          });
        }
      }
      const approvals = await db.all<Row>("SELECT * FROM mc_approval_requests WHERE artifact_id = ? ORDER BY created_at ASC", a.id);
      for (const r of approvals) {
        const ap = rowToApproval(r);
        nodes.push({ id: `approval:${ap.id}`, kind: "approval", label: `Review ${a.title} v${ap.version}`, status: ap.status });
        edges.push({ from: `approval:${ap.id}`, to: `artifact:${a.id}`, rel: "reviews", kind: "fact" });
        const decisions = await this.listDecisions("approval_request", ap.id);
        for (const d of decisions) {
          nodes.push({ id: `decision:${d.id}`, kind: "decision", label: `${d.action} by ${d.actor}`, status: d.action });
          edges.push({ from: `decision:${d.id}`, to: `approval:${ap.id}`, rel: "decides", kind: "fact" });
        }
      }
    }
    return { jobId, nodes, edges };
  }
}

function rowToSession(r: Row): McSession {
  return {
    id: r.id as string,
    jobId: r.job_id as string,
    producer: r.producer as string,
    status: r.status as McSession["status"],
    startedAt: r.started_at as string,
    endedAt: (r.ended_at as string) ?? undefined,
  };
}
