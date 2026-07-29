// People Registry
// Unified profile for every person.
// A volunteer who later becomes a project lead shouldn't need a second account.

export interface Person {
  id: string;
  identity: PersonIdentity;
  skills: Skill[];
  interests: string[];
  languages: string[];
  availability: Availability;
  location: PersonLocation;
  missionHistory: MissionHistoryEntry[];
  training: TrainingRecord[];
  certifications: Certification[];
  roles: PersonRole[];
  permissions: string[];
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface PersonIdentity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  photograph?: string;
  bio?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface Availability {
  status: 'available' | 'busy' | 'unavailable';
  hoursPerWeek: number;
  preferredDays: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  startDate?: Date;
  endDate?: Date;
}

export interface PersonLocation {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
  remote: boolean;
}

export interface MissionHistoryEntry {
  missionId: string;
  missionName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  hoursLogged: number;
  tasksCompleted: number;
}

export interface TrainingRecord {
  id: string;
  name: string;
  description: string;
  completedAt: Date;
  expiresAt?: Date;
  certificateUrl?: string;
  score?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issuedAt: Date;
  expiresAt?: Date;
  credentialId?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface PersonRole {
  role: 'volunteer' | 'trustee' | 'advisor' | 'researcher' | 'donor' | 'staff' | 'partner' | 'community-member';
  assignedAt: Date;
  assignedBy: string;
  missionId?: string;
  permissions: string[];
}

export interface PeopleInput {
  action: 'register' | 'update' | 'verify' | 'assign-role' | 'add-skill' | 'add-certification' | 'log-training' | 'get' | 'list' | 'search' | 'get-by-role' | 'get-by-skill';
  personId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  skills?: Skill[];
  interests?: string[];
  languages?: string[];
  role?: PersonRole['role'];
  missionId?: string;
  skillName?: string;
  certName?: string;
  certOrg?: string;
  trainingName?: string;
  roleFilter?: string;
  skillFilter?: string;
  query?: string;
  status?: Person['status'];
}

export class PeopleRegistry {
  name = 'people';
  description = 'Unified profile for every person in the institution';
  capabilities = [
    'register-person',
    'update-profile',
    'verify-person',
    'assign-roles',
    'manage-skills',
    'manage-certifications',
    'log-training',
    'search-people',
    'audit-trail',
  ];

  private people = new Map<string, Person>();
  private auditLog: Array<{ action: string; personId: string; agent: string; timestamp: Date; details: Record<string, unknown> }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(input: PeopleInput): Promise<{ success: boolean; result?: any }> {
    switch (input.action) {
      case 'register':
        return this.register(input);
      case 'update':
        return this.update(input);
      case 'verify':
        return this.verify(input);
      case 'assign-role':
        return this.assignRole(input);
      case 'add-skill':
        return this.addSkill(input);
      case 'add-certification':
        return this.addCertification(input);
      case 'log-training':
        return this.logTraining(input);
      case 'get':
        return this.get(input);
      case 'list':
        return this.list();
      case 'search':
        return this.search(input);
      case 'get-by-role':
        return this.getByRole(input);
      case 'get-by-skill':
        return this.getBySkill(input);
    }
  }

  private async register(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.firstName || !input.lastName || !input.email) return { success: false };

    // Check for duplicate email
    const existing = Array.from(this.people.values()).find((p) => p.identity.email === input.email);
    if (existing) return { success: false };

    const person: Person = {
      id: `person:${crypto.randomUUID()}`,
      identity: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
      },
      skills: input.skills ?? [],
      interests: input.interests ?? [],
      languages: input.languages ?? ['english'],
      availability: { status: 'available', hoursPerWeek: 10, preferredDays: [], preferredTime: 'flexible' },
      location: { remote: true },
      missionHistory: [],
      training: [],
      certifications: [],
      roles: [],
      permissions: ['read'],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    this.people.set(person.id, person);
    this.audit('register', person.id, 'people-registry', { name: `${input.firstName} ${input.lastName}` });

    return { success: true, person };
  }

  private async update(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    if (input.firstName) person.identity.firstName = input.firstName;
    if (input.lastName) person.identity.lastName = input.lastName;
    if (input.phone) person.identity.phone = input.phone;
    if (input.skills) person.skills = input.skills;
    if (input.interests) person.interests = input.interests;
    if (input.languages) person.languages = input.languages;
    person.updatedAt = new Date();
    this.audit('update', person.id, 'people-registry', {});

    return { success: true, person };
  }

  private async verify(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    person.status = 'active';
    person.updatedAt = new Date();
    this.audit('verify', person.id, 'people-registry', {});

    return { success: true, person };
  }

  private async assignRole(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId || !input.role) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    person.roles.push({
      role: input.role,
      assignedAt: new Date(),
      assignedBy: 'system',
      missionId: input.missionId,
      permissions: this.getDefaultPermissions(input.role),
    });
    person.updatedAt = new Date();
    this.audit('assign-role', person.id, 'people-registry', { role: input.role });

    return { success: true, person };
  }

  private async addSkill(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId || !input.skillName) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    // Check if skill already exists
    const existing = person.skills.find((s) => s.name === input.skillName);
    if (existing) {
      existing.level = input.skills?.[0]?.level ?? existing.level;
    } else {
      person.skills.push({
        name: input.skillName,
        level: input.skills?.[0]?.level ?? 'beginner',
        verified: false,
      });
    }
    person.updatedAt = new Date();
    this.audit('add-skill', person.id, 'people-registry', { skill: input.skillName });

    return { success: true, person };
  }

  private async addCertification(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId || !input.certName || !input.certOrg) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    person.certifications.push({
      id: `cert:${crypto.randomUUID()}`,
      name: input.certName,
      issuingOrganization: input.certOrg,
      issuedAt: new Date(),
      status: 'active',
    });
    person.updatedAt = new Date();
    this.audit('add-certification', person.id, 'people-registry', { cert: input.certName });

    return { success: true, person };
  }

  private async logTraining(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId || !input.trainingName) return { success: false };

    const person = this.people.get(input.personId);
    if (!person) return { success: false };

    person.training.push({
      id: `training:${crypto.randomUUID()}`,
      name: input.trainingName,
      description: '',
      completedAt: new Date(),
    });
    person.updatedAt = new Date();
    this.audit('log-training', person.id, 'people-registry', { training: input.trainingName });

    return { success: true, person };
  }

  private async get(input: PeopleInput): Promise<{ success: boolean; person?: Person }> {
    if (!input.personId) return { success: false };
    const person = this.people.get(input.personId);
    return { success: !!person, person };
  }

  private async list(): Promise<{ success: boolean; people: Person[] }> {
    return { success: true, people: Array.from(this.people.values()) };
  }

  private async search(input: PeopleInput): Promise<{ success: boolean; people: Person[] }> {
    if (!input.query) return { success: false, people: [] };

    const lower = input.query.toLowerCase();
    const people = Array.from(this.people.values()).filter((p) => {
      const searchable = `${p.identity.firstName} ${p.identity.lastName} ${p.identity.email} ${p.skills.map((s) => s.name).join(' ')}`.toLowerCase();
      return searchable.includes(lower);
    });

    return { success: true, people };
  }

  private async getByRole(input: PeopleInput): Promise<{ success: boolean; people: Person[] }> {
    if (!input.roleFilter) return { success: false, people: [] };

    const people = Array.from(this.people.values()).filter((p) =>
      p.roles.some((r) => r.role === input.roleFilter),
    );

    return { success: true, people };
  }

  private async getBySkill(input: PeopleInput): Promise<{ success: boolean; people: Person[] }> {
    if (!input.skillFilter) return { success: false, people: [] };

    const people = Array.from(this.people.values()).filter((p) =>
      p.skills.some((s) => s.name.toLowerCase() === input.skillFilter!.toLowerCase()),
    );

    return { success: true, people };
  }

  private getDefaultPermissions(role: PersonRole['role']): string[] {
    switch (role) {
      case 'trustee': return ['read', 'write', 'approve', 'govern'];
      case 'staff': return ['read', 'write', 'execute'];
      case 'volunteer': return ['read', 'execute'];
      case 'advisor': return ['read', 'advise'];
      case 'researcher': return ['read', 'write', 'research'];
      case 'donor': return ['read', 'donate'];
      case 'partner': return ['read', 'collaborate'];
      case 'community-member': return ['read'];
    }
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(action: string, personId: string, agent: string, details: Record<string, unknown>): void {
    this.auditLog.push({ action, personId, agent, timestamp: new Date(), details });
  }

  async shutdown(): Promise<void> {
    this.people.clear();
    this.auditLog = [];
  }
}
