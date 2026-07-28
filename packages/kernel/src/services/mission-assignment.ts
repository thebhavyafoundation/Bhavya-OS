// Mission Assignment Service
// Bridge between missions and people.
// Matches required skills to available people.

export interface Assignment {
  id: string;
  missionId: string;
  projectId?: string;
  personId: string;
  role: string;
  requiredSkills: string[];
  matchedSkills: string[];
  status: 'proposed' | 'accepted' | 'declined' | 'active' | 'completed' | 'cancelled';
  assignedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  hoursLogged: number;
  tasksCompleted: number;
  notes: string;
  metadata: Record<string, unknown>;
}

export interface AssignmentInput {
  action: 'propose' | 'accept' | 'decline' | 'complete' | 'log-hours' | 'log-task' | 'list' | 'get' | 'get-by-mission' | 'get-by-person' | 'find-matches';
  assignmentId?: string;
  missionId?: string;
  projectId?: string;
  personId?: string;
  role?: string;
  requiredSkills?: string[];
  hours?: number;
}

export class MissionAssignmentService {
  name = 'mission-assignment';
  description = 'Bridge between missions and people';
  capabilities = [
    'propose-assignment',
    'accept-assignment',
    'decline-assignment',
    'complete-assignment',
    'log-hours',
    'log-task',
    'find-matches',
    'audit-trail',
  ];

  private assignments = new Map<string, Assignment>();
  private auditLog: Array<{ action: string; assignmentId: string; agent: string; timestamp: Date; details: Record<string, unknown> }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(input: AssignmentInput): Promise<{ success: boolean; result?: any }> {
    switch (input.action) {
      case 'propose':
        return this.propose(input);
      case 'accept':
        return this.accept(input);
      case 'decline':
        return this.decline(input);
      case 'complete':
        return this.complete(input);
      case 'log-hours':
        return this.logHours(input);
      case 'log-task':
        return this.logTask(input);
      case 'list':
        return this.list();
      case 'get':
        return this.get(input);
      case 'get-by-mission':
        return this.getByMission(input);
      case 'get-by-person':
        return this.getByPerson(input);
      case 'find-matches':
        return this.findMatches(input);
    }
  }

  private async propose(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.missionId || !input.personId || !input.role || !input.requiredSkills) {
      return { success: false };
    }

    const assignment: Assignment = {
      id: `assign:${crypto.randomUUID()}`,
      missionId: input.missionId,
      projectId: input.projectId,
      personId: input.personId,
      role: input.role,
      requiredSkills: input.requiredSkills,
      matchedSkills: [],
      status: 'proposed',
      assignedAt: new Date(),
      hoursLogged: 0,
      tasksCompleted: 0,
      notes: '',
      metadata: {},
    };

    this.assignments.set(assignment.id, assignment);
    this.audit('propose', assignment.id, 'mission-assignment', { role: input.role });

    return { success: true, assignment };
  }

  private async accept(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId) return { success: false };

    const assignment = this.assignments.get(input.assignmentId);
    if (!assignment) return { success: false };

    assignment.status = 'active';
    assignment.acceptedAt = new Date();
    this.audit('accept', assignment.id, 'mission-assignment', {});

    return { success: true, assignment };
  }

  private async decline(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId) return { success: false };

    const assignment = this.assignments.get(input.assignmentId);
    if (!assignment) return { success: false };

    assignment.status = 'declined';
    this.audit('decline', assignment.id, 'mission-assignment', {});

    return { success: true, assignment };
  }

  private async complete(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId) return { success: false };

    const assignment = this.assignments.get(input.assignmentId);
    if (!assignment) return { success: false };

    assignment.status = 'completed';
    assignment.completedAt = new Date();
    this.audit('complete', assignment.id, 'mission-assignment', {});

    return { success: true, assignment };
  }

  private async logHours(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId || !input.hours) return { success: false };

    const assignment = this.assignments.get(input.assignmentId);
    if (!assignment) return { success: false };

    assignment.hoursLogged += input.hours;
    this.audit('log-hours', assignment.id, 'mission-assignment', { hours: input.hours });

    return { success: true, assignment };
  }

  private async logTask(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId) return { success: false };

    const assignment = this.assignments.get(input.assignmentId);
    if (!assignment) return { success: false };

    assignment.tasksCompleted++;
    this.audit('log-task', assignment.id, 'mission-assignment', {});

    return { success: true, assignment };
  }

  private async list(): Promise<{ success: boolean; assignments: Assignment[] }> {
    return { success: true, assignments: Array.from(this.assignments.values()) };
  }

  private async get(input: AssignmentInput): Promise<{ success: boolean; assignment?: Assignment }> {
    if (!input.assignmentId) return { success: false };
    const assignment = this.assignments.get(input.assignmentId);
    return { success: !!assignment, assignment };
  }

  private async getByMission(input: AssignmentInput): Promise<{ success: boolean; assignments: Assignment[] }> {
    if (!input.missionId) return { success: false, assignments: [] };
    const assignments = Array.from(this.assignments.values()).filter((a) => a.missionId === input.missionId);
    return { success: true, assignments };
  }

  private async getByPerson(input: AssignmentInput): Promise<{ success: boolean; assignments: Assignment[] }> {
    if (!input.personId) return { success: false, assignments: [] };
    const assignments = Array.from(this.assignments.values()).filter((a) => a.personId === input.personId);
    return { success: true, assignments };
  }

  private async findMatches(input: AssignmentInput): Promise<{ success: boolean; matches: Array<{ personId: string; score: number }> }> {
    if (!input.requiredSkills || input.requiredSkills.length === 0) {
      return { success: false, matches: [] };
    }

    // This would integrate with PeopleRegistry in production
    // For now, return empty matches
    return { success: true, matches: [] };
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(action: string, assignmentId: string, agent: string, details: Record<string, unknown>): void {
    this.auditLog.push({ action, assignmentId, agent, timestamp: new Date(), details });
  }

  async shutdown(): Promise<void> {
    this.assignments.clear();
    this.auditLog = [];
  }
}
