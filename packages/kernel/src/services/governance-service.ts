// Governance Service
// The institution's source of truth for decisions, approvals, and official documents.

export interface GovernanceDocument {
  id: string;
  title: string;
  content: string;
  type: "policy" | "resolution" | "minutes" | "charter" | "bylaw" | "guideline";
  status: "draft" | "pending-approval" | "approved" | "rejected" | "archived";
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  approvalChain: ApprovalStep[];
  tags: string[];
  effectiveDate?: Date;
  expiryDate?: Date;
  metadata: Record<string, unknown>;
}

export interface ApprovalStep {
  step: number;
  role: string;
  approver?: string;
  status: "pending" | "approved" | "rejected";
  timestamp?: Date;
  comments?: string;
}

export interface Resolution {
  id: string;
  documentId: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: Date;
  votedAt?: Date;
  outcome: "pending" | "passed" | "failed" | "tabled";
  votes: Vote[];
  quorum: number;
  threshold: number;
  metadata: Record<string, unknown>;
}

export interface Vote {
  trustee: string;
  decision: "yes" | "no" | "abstain";
  timestamp: Date;
  comments?: string;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  title: string;
  date: Date;
  attendees: string[];
  agenda: string[];
  resolutions: string[];
  actionItems: ActionItem[];
  approvedBy?: string;
  approvedAt?: Date;
  documentId?: string;
  metadata: Record<string, unknown>;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
}

export interface GovernanceInput {
  action:
    | "create-document"
    | "submit-for-approval"
    | "approve"
    | "reject"
    | "create-resolution"
    | "vote"
    | "record-minutes"
    | "list"
    | "get"
    | "archive";
  title?: string;
  content?: string;
  type?: GovernanceDocument["type"];
  documentId?: string;
  resolutionId?: string;
  minutesId?: string;
  approver?: string;
  comments?: string;
  trustee?: string;
  decision?: "yes" | "no" | "abstain";
  tags?: string[];
  query?: string;
}

export class GovernanceService {
  name = "governance";
  description =
    "Institutional source of truth for decisions, approvals, and official documents";
  capabilities = [
    "create-document",
    "route-approvals",
    "record-approvals",
    "create-resolutions",
    "record-votes",
    "record-minutes",
    "search-governance",
    "archive-documents",
    "audit-trail",
  ];

  private documents = new Map<string, GovernanceDocument>();
  private resolutions = new Map<string, Resolution>();
  private minutes = new Map<string, MeetingMinutes>();
  private auditLog: Array<{
    action: string;
    documentId: string;
    agent: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(
    input: GovernanceInput,
  ): Promise<{ success: boolean; result?: unknown }> {
    switch (input.action) {
      case "create-document":
        return this.createDocument(input);
      case "submit-for-approval":
        return this.submitForApproval(input);
      case "approve":
        return this.approve(input);
      case "reject":
        return this.reject(input);
      case "create-resolution":
        return this.createResolution(input);
      case "vote":
        return this.vote(input);
      case "record-minutes":
        return this.recordMinutes(input);
      case "list":
        return this.list(input);
      case "get":
        return this.get(input);
      case "archive":
        return this.archive(input);
    }
  }

  // Create a governance document
  private async createDocument(
    input: GovernanceInput,
  ): Promise<{ success: boolean; document?: GovernanceDocument }> {
    if (!input.title || !input.content || !input.type) {
      return { success: false };
    }

    const doc: GovernanceDocument = {
      id: `gov:${crypto.randomUUID()}`,
      title: input.title,
      content: input.content,
      type: input.type,
      status: "draft",
      version: 1,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
      approvalChain: [],
      tags: input.tags ?? [],
      metadata: {},
    };

    this.documents.set(doc.id, doc);
    this.audit("create-document", doc.id, "governance", {
      title: doc.title,
      type: doc.type,
    });

    return { success: true, document: doc };
  }

  // Submit for approval
  private async submitForApproval(
    input: GovernanceInput,
  ): Promise<{ success: boolean; document?: GovernanceDocument }> {
    if (!input.documentId) return { success: false };

    const doc = this.documents.get(input.documentId);
    if (!doc) return { success: false };

    doc.status = "pending-approval";
    doc.approvalChain = [
      { step: 1, role: "reviewer", status: "pending" },
      { step: 2, role: "director", status: "pending" },
      { step: 3, role: "chair", status: "pending" },
    ];
    doc.updatedAt = new Date();

    this.audit("submit-for-approval", doc.id, "governance", {});

    return { success: true, document: doc };
  }

  // Approve a document
  private async approve(
    input: GovernanceInput,
  ): Promise<{ success: boolean; document?: GovernanceDocument }> {
    if (!input.documentId || !input.approver) return { success: false };

    const doc = this.documents.get(input.documentId);
    if (!doc) return { success: false };

    const pendingStep = doc.approvalChain.find((s) => s.status === "pending");
    if (pendingStep) {
      pendingStep.status = "approved";
      pendingStep.approver = input.approver;
      pendingStep.timestamp = new Date();
      pendingStep.comments = input.comments;
    }

    // Check if all steps approved
    const allApproved = doc.approvalChain.every((s) => s.status === "approved");
    if (allApproved) {
      doc.status = "approved";
    }

    doc.updatedAt = new Date();
    this.audit("approve", doc.id, input.approver, { step: pendingStep?.step });

    return { success: true, document: doc };
  }

  // Reject a document
  private async reject(
    input: GovernanceInput,
  ): Promise<{ success: boolean; document?: GovernanceDocument }> {
    if (!input.documentId || !input.approver) return { success: false };

    const doc = this.documents.get(input.documentId);
    if (!doc) return { success: false };

    const pendingStep = doc.approvalChain.find((s) => s.status === "pending");
    if (pendingStep) {
      pendingStep.status = "rejected";
      pendingStep.approver = input.approver;
      pendingStep.timestamp = new Date();
      pendingStep.comments = input.comments;
    }

    doc.status = "rejected";
    doc.updatedAt = new Date();
    this.audit("reject", doc.id, input.approver, { reason: input.comments });

    return { success: true, document: doc };
  }

  // Create a resolution
  private async createResolution(
    input: GovernanceInput,
  ): Promise<{ success: boolean; resolution?: Resolution }> {
    if (!input.title || !input.content || !input.documentId)
      return { success: false };

    const resolution: Resolution = {
      id: `res:${crypto.randomUUID()}`,
      documentId: input.documentId,
      title: input.title,
      description: input.content,
      proposedBy: input.approver ?? "system",
      proposedAt: new Date(),
      outcome: "pending",
      votes: [],
      quorum: 3,
      threshold: 0.6,
      metadata: {},
    };

    this.resolutions.set(resolution.id, resolution);
    this.audit("create-resolution", resolution.id, "governance", {
      title: resolution.title,
    });

    return { success: true, resolution };
  }

  // Vote on a resolution
  private async vote(
    input: GovernanceInput,
  ): Promise<{ success: boolean; resolution?: Resolution }> {
    if (!input.resolutionId || !input.trustee || !input.decision)
      return { success: false };

    const resolution = this.resolutions.get(input.resolutionId);
    if (!resolution) return { success: false };

    // Check if already voted
    if (resolution.votes.some((v) => v.trustee === input.trustee)) {
      return { success: false };
    }

    resolution.votes.push({
      trustee: input.trustee,
      decision: input.decision,
      timestamp: new Date(),
      comments: input.comments,
    });

    // Check outcome
    if (resolution.votes.length >= resolution.quorum) {
      const yesVotes = resolution.votes.filter(
        (v) => v.decision === "yes",
      ).length;
      if (yesVotes / resolution.votes.length >= resolution.threshold) {
        resolution.outcome = "passed";
      } else {
        resolution.outcome = "failed";
      }
      resolution.votedAt = new Date();
    }

    this.audit("vote", resolution.id, input.trustee, {
      decision: input.decision,
    });

    return { success: true, resolution };
  }

  // Record meeting minutes
  private async recordMinutes(
    input: GovernanceInput,
  ): Promise<{ success: boolean; minutes?: MeetingMinutes }> {
    if (!input.title) return { success: false };

    const meetingMinutes: MeetingMinutes = {
      id: `min:${crypto.randomUUID()}`,
      meetingId: `meeting:${Date.now()}`,
      title: input.title,
      date: new Date(),
      attendees: [],
      agenda: [],
      resolutions: [],
      actionItems: [],
      metadata: {},
    };

    this.minutes.set(meetingMinutes.id, meetingMinutes);
    this.audit("record-minutes", meetingMinutes.id, "governance", {
      title: meetingMinutes.title,
    });

    return { success: true, minutes: meetingMinutes };
  }

  // List documents
  private async list(
    _input: GovernanceInput,
  ): Promise<{ success: boolean; documents: GovernanceDocument[] }> {
    return { success: true, documents: Array.from(this.documents.values()) };
  }

  // Get a document
  private async get(
    input: GovernanceInput,
  ): Promise<{ success: boolean; document?: GovernanceDocument }> {
    if (!input.documentId) return { success: false };
    const doc = this.documents.get(input.documentId);
    return { success: !!doc, document: doc };
  }

  // Archive a document
  private async archive(input: GovernanceInput): Promise<{ success: boolean }> {
    if (!input.documentId) return { success: false };
    const doc = this.documents.get(input.documentId);
    if (!doc) return { success: false };

    doc.status = "archived";
    doc.updatedAt = new Date();
    this.audit("archive", doc.id, "governance", {});

    return { success: true };
  }

  // Get audit log
  getAuditLog(): Array<{
    action: string;
    documentId: string;
    agent: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }> {
    return [...this.auditLog];
  }

  private audit(
    action: string,
    documentId: string,
    agent: string,
    details: Record<string, unknown>,
  ): void {
    this.auditLog.push({
      action,
      documentId,
      agent,
      timestamp: new Date(),
      details,
    });
  }

  async shutdown(): Promise<void> {
    this.documents.clear();
    this.resolutions.clear();
    this.minutes.clear();
    this.auditLog = [];
  }
}
