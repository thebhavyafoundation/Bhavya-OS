import { describe, expect, it } from "vitest";

import {
  MissionAssignmentService,
  type Assignment,
} from "../services/mission-assignment.js";
import { PeopleRegistry, type Person } from "../services/people-registry.js";
import { RecognitionService } from "../services/recognition-service.js";

import { payloadOf } from "./helpers/service-payload.js";

// The people lifecycle, migrated from the legacy `human-capital.test.ts`
// harness.
//
// The harness caught its own assertion errors and reported them as a summary
// line, so a failure was invisible to any test runner. Each case below is now
// a real test: a failed assertion fails the suite. The scenarios and the
// expectations are the harness's own — only the error handling changed.
//
// The services are exercised in sequence and share state (a person id, an
// assignment id), which vitest preserves because the cases in a file run in
// order.

describe("human capital platform", () => {
  const people = new PeopleRegistry();
  const assignments = new MissionAssignmentService();
  const recognition = new RecognitionService();

  let personId = "";
  let assignmentId = "";

  it("initialises all services", async () => {
    await people.initialize();
    await assignments.initialize();
    await recognition.initialize();
  });

  it("registers a new person", async () => {
    const response = payloadOf<{ person?: Person }>(
      await people.execute({
        action: "register",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@example.com",
        phone: "+91-9876543210",
        skills: [{ name: "tree-plantation", level: "intermediate", verified: true }],
        interests: ["environment", "education"],
        languages: ["english", "hindi"],
      }),
    );

    expect(response.success).toBe(true);
    expect(response.person).toBeDefined();
    personId = response.person!.id;
  });

  it("verifies the person", async () => {
    const response = await people.execute({ action: "verify", personId });
    expect(response.success).toBe(true);
  });

  it("assigns a role", async () => {
    const response = await people.execute({
      action: "assign-role",
      personId,
      role: "volunteer",
    });
    expect(response.success).toBe(true);
  });

  it("adds a skill", async () => {
    const response = await people.execute({
      action: "add-skill",
      personId,
      skillName: "first-aid",
      skills: [{ name: "first-aid", level: "beginner", verified: false }],
    });
    expect(response.success).toBe(true);
  });

  it("adds a certification", async () => {
    const response = await people.execute({
      action: "add-certification",
      personId,
      certName: "Tree Plantation Expert",
      certOrg: "Bhavya Foundation",
    });
    expect(response.success).toBe(true);
  });

  it("logs training", async () => {
    const response = await people.execute({
      action: "log-training",
      personId,
      trainingName: "Volunteer Orientation",
    });
    expect(response.success).toBe(true);
  });

  it("proposes an assignment", async () => {
    const response = payloadOf<{ assignment?: Assignment }>(
      await assignments.execute({
        action: "propose",
        missionId: "mission:forest-restoration",
        personId,
        role: "plantation-lead",
        requiredSkills: ["tree-plantation", "first-aid"],
      }),
    );

    expect(response.success).toBe(true);
    expect(response.assignment).toBeDefined();
    assignmentId = response.assignment!.id;
  });

  it("accepts the assignment", async () => {
    const response = await assignments.execute({ action: "accept", assignmentId });
    expect(response.success).toBe(true);
  });

  it("logs hours", async () => {
    const response = await assignments.execute({
      action: "log-hours",
      assignmentId,
      hours: 8,
    });
    expect(response.success).toBe(true);
  });

  it("logs a task completion", async () => {
    const response = await assignments.execute({
      action: "log-task",
      assignmentId,
    });
    expect(response.success).toBe(true);
  });

  it("awards hours", async () => {
    const response = await recognition.execute({
      action: "award-hours",
      personId,
      missionId: "mission:forest-restoration",
      hours: 8,
      description: "Plantation work at Village A",
      publicVisible: true,
    });
    expect(response.success).toBe(true);
  });

  it("awards an achievement", async () => {
    const response = await recognition.execute({
      action: "award-achievement",
      personId,
      achievementName: "First 100 Trees Planted",
      description: "Planted 100 native trees in single session",
      publicVisible: true,
    });
    expect(response.success).toBe(true);
  });

  it("awards a certificate", async () => {
    const response = await recognition.execute({
      action: "award-certificate",
      personId,
      certName: "Forest Guardian Certificate",
      description: "Awarded for outstanding contribution to forest restoration",
      publicVisible: true,
    });
    expect(response.success).toBe(true);
  });

  it("adds a recommendation", async () => {
    const response = await recognition.execute({
      action: "add-recommendation",
      personId,
      recommendedBy: "project-lead",
      description: "Priya showed exceptional leadership during plantation drive.",
    });
    expect(response.success).toBe(true);
  });

  it("returns the person profile with a role and an active status", async () => {
    const response = payloadOf<{ person?: Person }>(
      await people.execute({ action: "get", personId }),
    );

    expect(response.success).toBe(true);
    expect(response.person).toBeDefined();
    expect(response.person!.status).toBe("active");
    expect(response.person!.roles.length).toBeGreaterThan(0);
  });

  it("searches for people", async () => {
    const response = payloadOf<{ people?: Person[] }>(
      await people.execute({ action: "search", query: "Priya" }),
    );

    expect(response.success).toBe(true);
    expect(response.people!.length).toBeGreaterThan(0);
  });

  it("returns people by skill", async () => {
    const response = payloadOf<{ people?: Person[] }>(
      await people.execute({
        action: "get-by-skill",
        skillFilter: "tree-plantation",
      }),
    );

    expect(response.success).toBe(true);
  });

  it("returns the assignments of a person", async () => {
    const response = payloadOf<{ assignments?: Assignment[] }>(
      await assignments.execute({ action: "get-by-person", personId }),
    );

    expect(response.success).toBe(true);
    expect(response.assignments!.length).toBeGreaterThan(0);
  });

  it("returns the recognition statistics of a person", async () => {
    const response = await recognition.execute({
      action: "get-stats",
      personId,
    });
    expect(response.success).toBe(true);
  });

  it("returns the public recognitions", async () => {
    const response = await recognition.execute({ action: "get-public" });
    expect(response.success).toBe(true);
  });
});
