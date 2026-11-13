import { describe, expect, it } from "vitest";

import { ImpactRegistry, type ImpactReport } from "../services/impact-registry.js";
import { MissionService, type Mission } from "../services/mission-service.js";
import { ResourceRegistry, type Resource } from "../services/resource-registry.js";

import { payloadOf } from "./helpers/service-payload.js";

// The mission lifecycle, migrated from the legacy `mission-operations.test.ts`
// harness.
//
// The harness caught its own assertion errors and printed them, so no test
// runner ever saw a failure. Each case below is a real test. The scenarios
// and the expectations are the harness's own.
//
// One field did not survive: the harness registered a grant with a `source`
// property, which the current `ResourceInput` no longer accepts. The
// registration itself is preserved; the unsupported field is dropped rather
// than smuggled past the type checker.

describe("mission operations", () => {
  const missions = new MissionService();
  const resources = new ResourceRegistry();
  const impact = new ImpactRegistry();

  let missionId = "";
  let volunteerId = "";
  let equipmentId = "";

  it("initialises all services", async () => {
    await missions.initialize();
    await resources.initialize();
    await impact.initialize();
  });

  it("creates a forest restoration mission", async () => {
    const response = payloadOf<{ mission?: Mission }>(
      await missions.execute({
        action: "create",
        name: "Forest Restoration Initiative",
        description:
          "Restore 100 hectares of degraded forest in partnership with local communities.",
        domain: "environment",
        owner: "founder",
        budget: 500000,
      }),
    );

    expect(response.success).toBe(true);
    expect(response.mission).toBeDefined();
    missionId = response.mission!.id;
  });

  it("adds objectives", async () => {
    await missions.execute({
      action: "add-objective",
      missionId,
      objectiveTitle: "Plant 50,000 native trees",
      objectiveDescription: "Plant native species across degraded areas",
      measurableOutcome: "Trees planted",
      targetValue: 50000,
    });
    await missions.execute({
      action: "add-objective",
      missionId,
      objectiveTitle: "Restore 100 hectares",
      measurableOutcome: "Hectares restored",
      targetValue: 100,
    });
  });

  it("approves and starts the mission", async () => {
    await missions.execute({ action: "approve", missionId, approver: "chair" });
    await missions.execute({ action: "start", missionId });
  });

  it("registers volunteers", async () => {
    const response = payloadOf<{ resource?: Resource }>(
      await resources.execute({
        action: "register",
        missionId,
        type: "volunteer",
        name: "Volunteer Group A",
        description: "10 trained volunteers for plantation",
        quantity: 10,
        unit: "people",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.resource).toBeDefined();
    volunteerId = response.resource!.id;
  });

  it("registers equipment", async () => {
    const response = payloadOf<{ resource?: Resource }>(
      await resources.execute({
        action: "register",
        missionId,
        type: "equipment",
        name: "Planting Tools",
        description: "Shovels, spades, watering cans",
        quantity: 20,
        unit: "pieces",
        cost: 5000,
      }),
    );

    expect(response.success).toBe(true);
    expect(response.resource).toBeDefined();
    equipmentId = response.resource!.id;
  });

  it("registers a grant", async () => {
    const response = await resources.execute({
      action: "register",
      missionId,
      type: "grant",
      name: "UNESCO Environmental Grant",
      description: "Grant for forest restoration",
      quantity: 1,
      unit: "grant",
      cost: 250000,
    });

    expect(response.success).toBe(true);
  });

  it("assigns the resources", async () => {
    await resources.execute({
      action: "assign",
      resourceId: volunteerId,
      assignedTo: "project:village-a",
    });
    await resources.execute({
      action: "assign",
      resourceId: equipmentId,
      assignedTo: "project:village-a",
    });
  });

  it("records impact metrics", async () => {
    await impact.execute({
      action: "record-metric",
      missionId,
      metricId: "trees-planted",
      value: 5000,
      notes: "Phase 1 planting complete",
    });
    await impact.execute({
      action: "record-metric",
      missionId,
      metricId: "hectares-restored",
      value: 15,
    });
  });

  it("generates an impact report", async () => {
    const response = payloadOf<{ report?: ImpactReport }>(
      await impact.execute({
        action: "generate-report",
        missionId,
        period: "2026-Q1",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.report).toBeDefined();
  });

  it("adds timeline events", async () => {
    await missions.execute({
      action: "add-timeline",
      missionId,
      timelineTitle: "Phase 1 Complete",
      timelineDate: new Date("2026-09-30"),
      timelineType: "milestone",
    });
    await missions.execute({
      action: "add-timeline",
      missionId,
      timelineTitle: "Mid-term Review",
      timelineDate: new Date("2026-12-31"),
      timelineType: "review",
    });
  });

  it("returns the mission with an active status and both objectives", async () => {
    const response = payloadOf<{ mission?: Mission }>(
      await missions.execute({ action: "get", missionId }),
    );

    expect(response.success).toBe(true);
    expect(response.mission).toBeDefined();
    expect(response.mission!.status).toBe("active");
    expect(response.mission!.objectives.length).toBe(2);
  });

  it("returns the three resources of the mission", async () => {
    const response = payloadOf<{ resources?: Resource[] }>(
      await resources.execute({ action: "get-by-mission", missionId }),
    );

    expect(response.success).toBe(true);
    expect(response.resources!.length).toBe(3);
  });

  it("returns the impact summary of the mission", async () => {
    const response = await impact.execute({
      action: "get-summary",
      missionId,
    });
    expect(response.success).toBe(true);
  });

  it("returns the single environment mission", async () => {
    const response = payloadOf<{ missions?: Mission[] }>(
      await missions.execute({
        action: "get-by-domain",
        domainFilter: "environment",
      }),
    );

    expect(response.success).toBe(true);
    expect(response.missions!.length).toBe(1);
  });
});
