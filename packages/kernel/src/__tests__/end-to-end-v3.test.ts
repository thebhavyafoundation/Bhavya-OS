// End-to-End Workflow Test
// Tests complete real-world scenarios.

import { SelfOrganizingEngine } from "../self-organizing/index.js";
import { EventDrivenOrchestrator } from "../orchestrator/index.js";
import { ConsensusEngine } from "../consensus/index.js";
import { CapabilityMatcher } from "../capability-matcher/index.js";
import { Auth } from "../auth/index.js";
import { Monitoring } from "../monitoring/index.js";
import { TransparencyService } from "../services/transparency.js";
import { ResearchService } from "../services/research.js";
import { VolunteerService } from "../services/volunteer.js";
import { GovernanceService } from "../services/governance.js";

interface WorkflowResult {
  workflow: string;
  steps: number;
  artifacts: string[];
  duration: number;
  success: boolean;
}

export class EndToEndTest {
  private results: WorkflowResult[] = [];

  async runAll(): Promise<WorkflowResult[]> {
    console.log("=== End-to-End Workflow Tests ===\n");

    await this.workflow("Volunteer Onboarding", async () => {
      const service = new VolunteerService();
      await service.initialize();

      const { artifacts } = await service.execute({
        action: "onboard",
        name: "Asha Rao",
        email: "asha.rao@example.org",
        skills: ["field-research", "community-outreach"],
        availability: "weekends",
      });

      return artifacts.map((a) => a.path);
    });

    await this.workflow("Release Publishing", async () => {
      const service = new TransparencyService(process.cwd());
      await service.initialize();

      const { artifacts } = await service.execute({
        action: "publish-release",
        version: "3.0.0",
        title: "v3.0.0 Release",
        content: "Bhavya OS is now production-ready.",
      });

      return artifacts.map((a) => a.path);
    });

    await this.workflow("Governance Document", async () => {
      const service = new GovernanceService(process.cwd());
      await service.initialize();

      const { artifacts } = await service.execute({
        action: "create",
        title: "Data Retention Policy",
        content: "All data is retained for 7 years.",
      });

      return artifacts.map((a) => a.path);
    });

    await this.workflow("Research Intake", async () => {
      const service = new ResearchService(process.cwd());
      await service.initialize();

      const { artifacts } = await service.execute({
        action: "ingest",
        title: "Restoration Monitoring Baseline",
        topic: "forest",
        content: "Baseline notes for restoration monitoring.",
        source: "Bhavya Foundation field team",
      });

      return artifacts.map((a) => a.path);
    });

    await this.workflow("Multi-Agent Consensus", async () => {
      const engine = new ConsensusEngine({
        events: { emit: async () => {} },
        memory: { set: async () => ({}) },
        agents: {
          getAll: () => [
            { id: "a1", name: "Designer" },
            { id: "a2", name: "Developer" },
            { id: "a3", name: "Researcher" },
          ],
        },
      });
      await engine.initialize();

      const proposal = await engine.createProposal({
        title: "Use Tailwind CSS",
        description: "Adopt Tailwind for all styling",
        proposedBy: "a1",
        type: "decision",
        quorum: 2,
        threshold: 0.6,
      });

      await engine.castVote(proposal.id, {
        agentId: "a1",
        decision: "approve",
        reasoning: "Best practice",
      });
      await engine.castVote(proposal.id, {
        agentId: "a2",
        decision: "approve",
        reasoning: "Agree",
      });

      return [`proposal:${proposal.id}`];
    });

    console.log(
      `\n=== Results: ${this.results.filter((r) => r.success).length}/${this.results.length} workflows passed ===`,
    );

    return this.results;
  }

  private async workflow(
    name: string,
    fn: () => Promise<string[]>,
  ): Promise<void> {
    const start = Date.now();
    try {
      const artifacts = await fn();
      const duration = Date.now() - start;
      this.results.push({
        workflow: name,
        steps: artifacts.length,
        artifacts,
        duration,
        success: true,
      });
      console.log(
        `  ✓ ${name} (${duration}ms) — ${artifacts.length} artifacts`,
      );
    } catch (err) {
      const duration = Date.now() - start;
      this.results.push({
        workflow: name,
        steps: 0,
        artifacts: [],
        duration,
        success: false,
      });
      console.log(`  ✗ ${name} (${duration}ms): ${err}`);
    }
  }
}
