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
  createdAt: string;
  updatedAt: string;
}

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
  }): Promise<McJob>;
  getJob(id: string): Promise<McJob | undefined>;
  listJobs(status?: McJobStatus): Promise<McJob[]>;
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
  addVersion(input: {
    artifactId: string;
    producer: string;
    path?: string;
    hash?: string;
    humanReplacement?: boolean;
    sessionId?: string;
    note?: string;
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
