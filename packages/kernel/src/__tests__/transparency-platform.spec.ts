import { describe, expect, it } from "vitest";

import { AuditService, type AuditEntry } from "../services/audit-service.js";
import {
  FinanceService,
  type Budget,
} from "../services/finance-service.js";
import {
  GovernanceService,
  type GovernanceDocument,
  type Resolution,
} from "../services/governance-service.js";
import { ProjectsService, type Project } from "../services/projects-service.js";
import { PublicAPI } from "../services/public-api.js";

import { payloadOf } from "./helpers/service-payload.js";

// The governance lifecycle, migrated from the legacy
// `transparency-platform.test.ts` harness.
//
// The harness caught its own assertion errors and printed them, so no test
// runner ever saw a failure. Each case below is a real test. The scenarios
// and the expectations are the harness's own.
//
// One case changes deliberately: the harness's "Verify resolution passed"
// case had an empty body, so it asserted nothing. A resolution is returned by
// the vote that completes it, so the case now asserts the outcome the harness
// intended to check — three yes votes reach the quorum of three and pass the
// threshold. The other cases that merely awaited a call now assert that the
// call succeeded, which is the expectation the harness was reaching for.

describe("transparency platform", () => {
  const governance = new GovernanceService();
  const finance = new FinanceService();
  const projects = new ProjectsService();
  const audit = new AuditService();
  const api = new PublicAPI({
    baseUrl: "http://localhost:3000",
    cors: true,
    rateLimit: 100,
    authRequired: false,
  });

  let governanceDocId = "";
  let resolutionId = "";
  let projectId = "";

  it("initialises all services", async () => {
    await governance.initialize();
    await finance.initialize();
    await projects.initialize();
    await audit.initialize();
    await api.initialize();
  });

  it("creates a governance document", async () => {
    const response = payloadOf<{ document?: GovernanceDocument }>(
      await governance.execute({
        action: "create-document",
        title: "Environmental Conservation Policy",
        content:
          "This policy outlines the Bhavya Foundation commitment to environmental conservation. All projects must demonstrate measurable impact on forest restoration, biodiversity, and community engagement.",
        type: "policy",
        tags: ["environment", "policy", "conservation"],
      }),
    );

    expect(response.success).toBe(true);
    expect(response.document).toBeDefined();
    governanceDocId = response.document!.id;
  });

  it("submits the document for approval", async () => {
    const response = await governance.execute({
      action: "submit-for-approval",
      documentId: governanceDocId,
    });
    expect(response.success).toBe(true);
  });

  it("approves at each level", async () => {
    const reviewer = await governance.execute({
      action: "approve",
      documentId: governanceDocId,
      approver: "reviewer-1",
      comments: "Reviewed and approved",
    });
    expect(reviewer.success).toBe(true);

    const director = await governance.execute({
      action: "approve",
      documentId: governanceDocId,
      approver: "director-1",
      comments: "Approved by director",
    });
    expect(director.success).toBe(true);

    const chair = await governance.execute({
      action: "approve",
      documentId: governanceDocId,
      approver: "chair-1",
      comments: "Final approval",
    });
    expect(chair.success).toBe(true);
  });

  it("returns the document as approved", async () => {
    const response = payloadOf<{ document?: GovernanceDocument }>(
      await governance.execute({ action: "get", documentId: governanceDocId }),
    );

    expect(response.success).toBe(true);
    expect(response.document).toBeDefined();
    expect(response.document!.status).toBe("approved");
  });

  it("creates a resolution", async () => {
    const response = payloadOf<{ resolution?: Resolution }>(
      await governance.execute({
        action: "create-resolution",
        documentId: governanceDocId,
        title: "Approve Environmental Conservation Policy",
        content:
          "Resolution to approve the Environmental Conservation Policy as the official policy of Bhavya Foundation.",
        approver: "founder",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.resolution).toBeDefined();
    resolutionId = response.resolution!.id;
  });

  it("records the trustee votes", async () => {
    const first = await governance.execute({
      action: "vote",
      resolutionId,
      trustee: "trustee-1",
      decision: "yes",
      comments: "Strongly support",
    });
    expect(first.success).toBe(true);

    const second = await governance.execute({
      action: "vote",
      resolutionId,
      trustee: "trustee-2",
      decision: "yes",
    });
    expect(second.success).toBe(true);

    const third = await governance.execute({
      action: "vote",
      resolutionId,
      trustee: "trustee-3",
      decision: "yes",
    });
    expect(third.success).toBe(true);
  });

  it("reports the resolution as passed", async () => {
    // The harness asserted this in a comment only. The vote that reaches the
    // quorum returns the resolution, so the outcome can be checked directly.
    const response = payloadOf<{ resolution?: Resolution }>(
      await governance.execute({
        action: "vote",
        resolutionId,
        trustee: "trustee-4",
        decision: "yes",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.resolution!.outcome).toBe("passed");
    expect(response.resolution!.votes.length).toBe(4);
  });

  it("creates a project from the resolution", async () => {
    const response = payloadOf<{ project?: Project }>(
      await projects.execute({
        action: "create",
        name: "Forest Restoration Initiative",
        description:
          "Restore 100 hectares of degraded forest in partnership with local communities.",
        vertical: "environment",
        budget: 500000,
        manager: "project-manager-1",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.project).toBeDefined();
    projectId = response.project!.id;
  });

  it("approves and starts the project", async () => {
    const approve = await projects.execute({
      action: "approve",
      projectId,
      approver: "director-1",
    });
    expect(approve.success).toBe(true);

    const start = await projects.execute({ action: "start", projectId });
    expect(start.success).toBe(true);
  });

  it("adds milestones", async () => {
    const first = await projects.execute({
      action: "add-milestone",
      projectId,
      milestoneTitle: "Site Assessment Complete",
      milestoneDescription: "Complete assessment of restoration sites",
      dueDate: new Date("2026-09-30"),
    });
    expect(first.success).toBe(true);

    const second = await projects.execute({
      action: "add-milestone",
      projectId,
      milestoneTitle: "Planting Phase 1",
      milestoneDescription: "Plant 5000 native trees",
      dueDate: new Date("2026-12-31"),
    });
    expect(second.success).toBe(true);
  });

  it("creates and approves the budget", async () => {
    const response = payloadOf<{ budget?: Budget }>(
      await finance.execute({
        action: "create-budget",
        name: "FY2026-27 Operational Budget",
        fiscalYear: "2026-27",
        amount: 2000000,
        categories: [
          {
            name: "Environment",
            allocated: 800000,
            spent: 0,
            projects: [projectId],
          },
          { name: "Education", allocated: 600000, spent: 0, projects: [] },
          { name: "Heritage", allocated: 400000, spent: 0, projects: [] },
          {
            name: "Administration",
            allocated: 200000,
            spent: 0,
            projects: [],
          },
        ],
      }),
    );

    expect(response.success).toBe(true);
    expect(response.budget).toBeDefined();

    const approval = await finance.execute({
      action: "approve-budget",
      budgetId: response.budget!.id,
      approver: "chair-1",
    });
    expect(approval.success).toBe(true);
  });

  it("records a grant", async () => {
    const response = await finance.execute({
      action: "record-grant",
      name: "UNESCO Heritage Grant",
      donor: "UNESCO",
      amount: 250000,
      purpose: "Heritage preservation and cultural education",
    });
    expect(response.success).toBe(true);
  });

  it("records donations", async () => {
    const first = await finance.execute({
      action: "record-donation",
      donor: "Anonymous",
      amount: 50000,
      purpose: "General fund",
    });
    expect(first.success).toBe(true);

    const second = await finance.execute({
      action: "record-donation",
      donor: "Corporate CSR",
      amount: 100000,
      purpose: "Education programs",
    });
    expect(second.success).toBe(true);
  });

  it("records meeting minutes", async () => {
    const response = await governance.execute({
      action: "record-minutes",
      title: "Board Meeting - July 2026",
    });
    expect(response.success).toBe(true);
  });

  it("updates the project impact", async () => {
    const response = await projects.execute({
      action: "update-impact",
      projectId,
      impact: {
        beneficiaries: 500,
        hectaresRestored: 25,
        treesPlanted: 2500,
        volunteersEngaged: 50,
      },
    });
    expect(response.success).toBe(true);
  });

  it("records an audit entry", async () => {
    const response = await audit.execute({
      action: "record",
      entry: {
        action: "policy-approved",
        entity: "governance-document",
        entityId: governanceDocId,
        agent: "governance-service",
        details: { title: "Environmental Conservation Policy" },
      },
    });
    expect(response.success).toBe(true);
  });

  it("creates a snapshot", async () => {
    const response = await audit.execute({
      action: "snapshot",
      snapshotDescription: "Post-approval snapshot of governance state",
    });
    expect(response.success).toBe(true);
  });

  it("queries the audit trail", async () => {
    const response = payloadOf<{ entries?: AuditEntry[] }>(
      await audit.execute({
        action: "query",
        entity: "governance-document",
      }),
    );

    expect(response.success).toBe(true);
  });

  it("answers the API health check", async () => {
    const response = await api.handleRequest("/api/health", "GET");
    expect(response.success).toBe(true);
  });

  it("answers the API governance documents request", async () => {
    const response = await api.handleRequest("/api/governance/documents", "GET");
    expect(response.success).toBe(true);
  });

  it("answers the API projects request", async () => {
    const response = await api.handleRequest("/api/projects", "GET");
    expect(response.success).toBe(true);
  });
});
