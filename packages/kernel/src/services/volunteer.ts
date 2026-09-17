// Volunteer Service
// Solves: Onboard, manage, recognize volunteers
// Exercises: Agents, workflows, permissions

import type { InstitutionService } from "./index.js";
import type { Artifact } from "../types/index.js";

export interface VolunteerInput {
  action: "onboard" | "assign" | "recognize" | "offboard";
  name: string;
  email: string;
  skills?: string[];
  availability?: string;
  team?: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  availability: string;
  status: "active" | "inactive";
  joinedAt: Date;
  team?: string;
  assignedAt?: Date;
  recognitions?: Array<{ date: Date; reason: string }>;
  leftAt?: Date;
}

export class VolunteerService implements InstitutionService {
  name = "volunteer";
  description = "Onboard, manage, recognize volunteers";
  capabilities = [
    "onboard-volunteer",
    "assign-team",
    "recognize-contribution",
    "offboard-volunteer",
  ];
  private volunteers = new Map<string, Volunteer>();

  async initialize(): Promise<void> {
    // Service ready
  }

  async execute(input: VolunteerInput): Promise<{
    artifacts: Artifact[];
    success: boolean;
    volunteer?: Volunteer;
  }> {
    const artifacts: Artifact[] = [];

    switch (input.action) {
      case "onboard":
        return this.onboard(input, artifacts);
      case "assign":
        return this.assign(input, artifacts);
      case "recognize":
        return this.recognize(input, artifacts);
      case "offboard":
        return this.offboard(input, artifacts);
    }
  }

  private async onboard(
    input: VolunteerInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    volunteer: Volunteer;
  }> {
    const volunteer = {
      id: `vol:${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      skills: input.skills ?? [],
      availability: input.availability ?? "flexible",
      status: "active" as const,
      joinedAt: new Date(),
    };

    this.volunteers.set(volunteer.id, volunteer);

    artifacts.push({
      path: `volunteers/${volunteer.id}.json`,
      action: "created",
      content: JSON.stringify(volunteer, null, 2),
      metadata: {},
    });

    return { artifacts, success: true, volunteer };
  }

  private async assign(
    input: VolunteerInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    volunteer: Volunteer | undefined;
  }> {
    const volunteer = Array.from(this.volunteers.values()).find(
      (v) => v.email === input.email,
    );
    if (!volunteer) return { artifacts, success: false, volunteer: undefined };

    volunteer.team = input.team;
    volunteer.assignedAt = new Date();

    artifacts.push({
      path: `volunteers/${volunteer.id}.json`,
      action: "updated",
      content: JSON.stringify(volunteer, null, 2),
      metadata: {},
    });

    return { artifacts, success: true, volunteer };
  }

  private async recognize(
    input: VolunteerInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    volunteer: Volunteer | undefined;
  }> {
    const volunteer = Array.from(this.volunteers.values()).find(
      (v) => v.email === input.email,
    );
    if (!volunteer) return { artifacts, success: false, volunteer: undefined };

    volunteer.recognitions = volunteer.recognitions ?? [];
    volunteer.recognitions.push({
      date: new Date(),
      reason: input.skills?.[0] ?? "contribution",
    });

    artifacts.push({
      path: `volunteers/${volunteer.id}.json`,
      action: "updated",
      content: JSON.stringify(volunteer, null, 2),
      metadata: {},
    });

    return { artifacts, success: true, volunteer };
  }

  private async offboard(
    input: VolunteerInput,
    artifacts: Artifact[],
  ): Promise<{
    artifacts: Artifact[];
    success: boolean;
    volunteer: Volunteer | undefined;
  }> {
    const volunteer = Array.from(this.volunteers.values()).find(
      (v) => v.email === input.email,
    );
    if (!volunteer) return { artifacts, success: false, volunteer: undefined };

    volunteer.status = "inactive";
    volunteer.leftAt = new Date();

    artifacts.push({
      path: `volunteers/${volunteer.id}.json`,
      action: "updated",
      content: JSON.stringify(volunteer, null, 2),
      metadata: {},
    });

    return { artifacts, success: true, volunteer };
  }

  async shutdown(): Promise<void> {
    this.volunteers.clear();
  }
}
