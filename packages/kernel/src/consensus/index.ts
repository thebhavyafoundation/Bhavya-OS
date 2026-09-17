// Consensus Engine
// Multi-agent decision making.
// Agents propose, vote, and reach consensus.

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  type: "decision" | "action" | "change";
  status: "proposed" | "voting" | "approved" | "rejected" | "implemented";
  votes: Vote[];
  quorum: number; // minimum votes needed
  threshold: number; // percentage needed to pass (0-1)
  createdAt: Date;
  closesAt: Date;
  metadata: Record<string, unknown>;
}

export interface Vote {
  agentId: string;
  decision: "approve" | "reject" | "abstain";
  reasoning: string;
  timestamp: Date;
}

export interface ConsensusConfig {
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
  };
  memory: {
    set: (entry: Record<string, unknown>) => Promise<void>;
  };
  agents: {
    getAll: () => { id: string; name: string }[];
  };
}

export class ConsensusEngine {
  private config: ConsensusConfig;
  private proposals = new Map<string, Proposal>();

  constructor(config: ConsensusConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Ready
  }

  // Create proposal
  async createProposal(input: {
    title: string;
    description: string;
    proposedBy: string;
    type: Proposal["type"];
    quorum?: number;
    threshold?: number;
    durationMs?: number;
  }): Promise<Proposal> {
    const agents = this.config.agents.getAll();
    const proposal: Proposal = {
      id: `proposal:${crypto.randomUUID()}`,
      title: input.title,
      description: input.description,
      proposedBy: input.proposedBy,
      type: input.type,
      status: "proposed",
      votes: [],
      quorum: input.quorum ?? Math.ceil(agents.length * 0.5),
      threshold: input.threshold ?? 0.6,
      createdAt: new Date(),
      closesAt: new Date(
        Date.now() + (input.durationMs ?? 7 * 24 * 60 * 60 * 1000),
      ),
      metadata: {},
    };

    this.proposals.set(proposal.id, proposal);

    await this.config.events.emit("proposal.created", {
      proposalId: proposal.id,
      title: proposal.title,
      proposedBy: proposal.proposedBy,
    });

    return proposal;
  }

  // Cast vote
  async castVote(
    proposalId: string,
    vote: Omit<Vote, "timestamp">,
  ): Promise<Proposal | null> {
    const proposal = this.proposals.get(proposalId);
    if (
      !proposal ||
      proposal.status === "implemented" ||
      proposal.status === "rejected"
    ) {
      return null;
    }

    // Check if already voted
    const existingVote = proposal.votes.find((v) => v.agentId === vote.agentId);
    if (existingVote) return null;

    proposal.votes.push({ ...vote, timestamp: new Date() });
    proposal.status = "voting";

    await this.config.events.emit("proposal.voted", {
      proposalId,
      agentId: vote.agentId,
      decision: vote.decision,
    });

    // Check if we can close
    await this.checkConsensus(proposalId);

    return proposal;
  }

  // Check consensus
  private async checkConsensus(proposalId: string): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return;

    const totalVotes = proposal.votes.length;
    const approvals = proposal.votes.filter(
      (v) => v.decision === "approve",
    ).length;
    const rejections = proposal.votes.filter(
      (v) => v.decision === "reject",
    ).length;

    // Check quorum
    if (totalVotes < proposal.quorum) return;

    // Check threshold
    const approvalRate = approvals / totalVotes;
    if (approvalRate >= proposal.threshold) {
      proposal.status = "approved";
      await this.config.events.emit("proposal.approved", {
        proposalId,
        approvals,
        rejections,
      });
      await this.config.memory.set({
        type: "consensus",
        content: `Approved: ${proposal.title} (${approvals}/${totalVotes})`,
        tags: ["consensus", "approved", proposalId],
        source: "consensus-engine",
        confidence: 1,
      });
    } else if (rejections / totalVotes > 1 - proposal.threshold) {
      proposal.status = "rejected";
      await this.config.events.emit("proposal.rejected", {
        proposalId,
        approvals,
        rejections,
      });
    }
  }

  // Get proposal
  getProposal(id: string): Proposal | undefined {
    return this.proposals.get(id);
  }

  // Get all proposals
  getProposals(status?: Proposal["status"]): Proposal[] {
    const proposals = Array.from(this.proposals.values());
    if (status) return proposals.filter((p) => p.status === status);
    return proposals;
  }

  async shutdown(): Promise<void> {
    this.proposals.clear();
  }
}
