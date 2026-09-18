/**
 * Mission Control repository contract (ai-institute).
 *
 * Persistence boundary for the human control plane: jobs, artifacts,
 * versions, approval requests, human decisions. Shapes mirror the shared
 * Mission Control entities in @bhavya/shared (kept local per the
 * academy-mirror precedent — no new workspace dependency).
 */

export type McJobStatus =
  | "queued"
  | "running"
  | "awaiting_approval"
  | "revising"
  | "completed"
  | "stopped"
  | "failed"
  | "cancelled";

export type McArtifactStatus =
  | "draft"
  | "review"
  | "approved"
  | "rejected"
  | "revision_requested"
  | "revising"
  | "verified"
  | "integrating"
  | "integrated"
  | "superseded"
  | "archived";

export type McApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision_requested"
  | "expired"
  | "cancelled";

export type McDecisionAction =
  | "approve"
  | "reject"
  | "request_revision"
  | "approve_with_modification"
  | "regenerate"
  | "upload_replacement"
  | "pause"
  | "resume"
  | "retry"
  | "abort"
  | "takeover"
  | "approve_integration";

/** Actions a human may take on a pending approval request. */
export type McRequestDecision = "approve" | "reject" | "request_revision";

export interface McJob {
  id: string;
  title: string;
  department: string;
  agent: string;
  taskContractIds: string[];
  queueJobId: string;
  sessionId: string;
  status: McJobStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface McArtifact {
  id: string;
  jobId: string;
  kind: string;
  title: string;
  source: string;
  status: McArtifactStatus;
  currentVersion: number;
  /**
   * Publication intent — where the approved output is meant to go.
   * One of McDestination or "". Recording intent is not publication.
   */
  destination: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Allowed publication destinations. Closed set: publication targets are
 * institutional decisions, not free text.
 */
export type McDestination = "website" | "offline-app" | "openskool" | "internal" | "social";

export interface McArtifactVersion {
  id: string;
  artifactId: string;
  version: number;
  path: string;
  hash: string;
  producer: string;
  parentVersion?: number;
  humanReplacement: boolean;
  sessionId: string;
  status: string;
  note: string;
  createdAt: string;
}

export interface McApprovalRequest {
  id: string;
  artifactId: string;
  version: number;
  requestedBy: string;
  status: McApprovalStatus;
  createdAt: string;
  decidedAt?: string;
}

export interface McDecision {
  id: string;
  action: McDecisionAction;
  targetKind: string;
  targetId: string;
  actor: string;
  reason: string;
  instruction: string;
  artifactVersion?: number;
  createdAt: string;
}

export interface MissionControlRepository {
  // Jobs
  createJob(input: {
    title: string;
    department?: string;
    agent?: string;
    taskContractIds?: string[];
    createdBy: string;
    /**
     * Optional idempotency key. When supplied and a job was already created
     * with the same key, the original job is returned instead of a duplicate.
     */
    idempotencyKey?: string;
  }): Promise<McJob>;
  getJob(id: string): Promise<McJob | undefined>;
  listJobs(status?: McJobStatus): Promise<McJob[]>;
  /** Substring search over job id/title (deterministic LIKE, capped). */
  searchJobs(query: string, limit?: number): Promise<McJob[]>;
  /** Recent artifacts across jobs with owning job titles (overview queries). */
  listRecentArtifacts(limit?: number): Promise<{ artifact: McArtifact; jobTitle: string }[]>;
  /** Artifacts in any of the given statuses with owning job titles. */
  listArtifactsByStatus(statuses: McArtifactStatus[]): Promise<{ artifact: McArtifact; jobTitle: string }[]>;
  startJob(id: string): Promise<McJob>;
  submitJobForApproval(id: string): Promise<McJob>;
  completeJob(id: string): Promise<McJob>;
  stopJob(id: string, actor: string, reason: string): Promise<McJob>;
  cancelJob(id: string): Promise<McJob>;
  // Artifacts
  createArtifact(input: {
    jobId: string;
    kind?: string;
    title: string;
    source?: string;
    producer: string;
    note?: string;
  }): Promise<{ artifact: McArtifact; version: McArtifactVersion }>;
  getArtifact(id: string): Promise<McArtifact | undefined>;
  listArtifacts(jobId: string): Promise<McArtifact[]>;
  /** Substring search over artifact id/title (deterministic LIKE, capped). */
  searchArtifacts(query: string, limit?: number): Promise<McArtifact[]>;

  /**
   * Lesson intake adapters. Reference patterns (never copies):
   * academy lessons -> `academy:{lessonId}`, studio lessons -> `studio:lesson:{id}`.
   * Idempotent per (job, lesson) via evidence keys.
   */
  createArtifactFromAcademyLesson(
    jobId: string,
    lessonId: string,
    producer: string,
  ): Promise<{ artifact: McArtifact; version: McArtifactVersion; deduped: boolean }>;
  createArtifactFromStudioLesson(
    jobId: string,
    lessonId: string,
    producer: string,
  ): Promise<{ artifact: McArtifact; version: McArtifactVersion; deduped: boolean }>;
  /**
   * Terminal curation transitions. Supersede keeps the artifact queryable
   * (replaced by newer direction); archive removes it from active queues.
   * Both require actor + reason and append evidence. No rows are deleted.
   */
  supersedeArtifact(artifactId: string, actor: string, reason: string): Promise<McArtifact>;
  archiveArtifact(artifactId: string, actor: string, reason: string): Promise<McArtifact>;

  /**
   * Record publication intent (destination). Allowed from verified,
   * integrating, or integrated states. This records WHERE an approved
   * output is meant to go — it never publishes anything.
   */
  setDestination(artifactId: string, destination: McDestination, actor: string): Promise<McArtifact>;
  addVersion(input: {
    artifactId: string;
    producer: string;
    path?: string;
    hash?: string;
    humanReplacement?: boolean;
    sessionId?: string;
    note?: string;
    /**
     * Optional idempotency key. Retried submissions with the same key
     * return the original version instead of appending a duplicate.
     */
    idempotencyKey?: string;
  }): Promise<McArtifactVersion>;
  listVersions(artifactId: string): Promise<McArtifactVersion[]>;
  // Approvals + decisions
  requestApproval(artifactId: string, requestedBy: string): Promise<McApprovalRequest>;
  listPendingApprovals(): Promise<McApprovalRequest[]>;
  listApprovalRequests(artifactId: string): Promise<McApprovalRequest[]>;
  decide(input: {
    requestId: string;
    action: McRequestDecision;
    actor: string;
    reason?: string;
    instruction?: string;
  }): Promise<McDecision>;
  listDecisions(targetKind?: string, targetId?: string): Promise<McDecision[]>;

  /** Jobs referencing a task contract id (projection join, code-side filter). */
  findJobsByTaskContract(contractId: string): Promise<McJob[]>;

  /**
   * Inbound queue-event reporter (adapter seam for a future real caller).
   * Does NOT execute anything: records evidence, and propagates genuine
   * failure onto a running/awaiting job. Completion is observed only —
   * approvals still gate job completion.
   */
  reportQueueEvent(
    queueJobId: string,
    outcome: "completed" | "failed",
    detail?: string,
  ): Promise<McJob | null>;

  /**
   * Real adapter: GitHub OS evaluation record → persisted MC job + session
   * + evaluation artifact (v1). Idempotent: calling twice with the same
   * repoId returns the original records (deduped: true) instead of
   * creating a second job. No GitHub OS data is copied beyond reference
   * facts (names/scores/license); the row stays canonical in github-os.
   */
  createJobFromEvaluation(input: {
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
  }>;

  /**
   * Explicit integration gate. Approved ≠ integrated: an approved artifact
   * must be verified, then moved to integrating, then integrated — each
   * step persisted with evidence. completeIntegration records an
   * approve_integration decision (actor required).
   */
  markVerified(artifactId: string): Promise<McArtifact>;
  beginIntegration(artifactId: string): Promise<McArtifact>;
  completeIntegration(artifactId: string, actor: string, note?: string): Promise<McArtifact>;

  // Execution bindings + sessions (Phase 2). queueJobId references a
  // workflows JobQueue job; sessionId references mc_sessions. Both stay
  // empty unless a real binding exists — never fabricated.
  bindQueueJob(jobId: string, queueJobId: string): Promise<McJob>;
  startSession(jobId: string, producer: string): Promise<McSession>;
  endSession(id: string, status: "completed" | "failed"): Promise<McSession>;
  listSessions(jobId: string): Promise<McSession[]>;

  // Audit + projection
  listEvidence(activityId: string): Promise<McEvidenceRow[]>;
  getMissionGraph(jobId: string): Promise<MissionGraph>;
}

export interface McSession {
  id: string;
  jobId: string;
  producer: string;
  status: "running" | "completed" | "failed";
  startedAt: string;
  endedAt?: string;
}

export interface McEvidenceRow {
  id: string;
  activityType: string;
  activityId: string;
  timestamp: string;
  description: string;
  metadata: Record<string, unknown>;
}

export type MissionEdgeKind = "fact";

export interface MissionNode {
  id: string;
  kind: "job" | "task_contract" | "artifact" | "version" | "approval" | "decision" | "session";
  label: string;
  status: string;
}

export interface MissionEdge {
  from: string;
  to: string;
  rel:
    | "references_task"
    | "produces"
    | "has_version"
    | "supersedes"
    | "reviews"
    | "decides"
    | "executed_in"
    | "produced_by_session";
  kind: MissionEdgeKind;
}

export interface MissionGraph {
  jobId: string;
  nodes: MissionNode[];
  edges: MissionEdge[];
}
