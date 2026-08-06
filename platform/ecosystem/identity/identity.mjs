/**
 * Institution Identity
 * Bhavya Ecosystem v1.0
 * 
 * Core identity for Bhavya Foundation:
 * - Organization Profile
 * - Mission Registry
 * - Programs
 * - Projects
 * - Partners
 * - Trustees
 * - Volunteers
 * - Public Directory
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'identity', 'data');

interface Organization {
  id: string;
  name: string;
  mission: string;
  vision: string;
  values: string[];
  foundedAt: string;
  location: string;
  website: string;
  email: string;
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface Mission {
  id: string;
  title: string;
  description: string;
  goals: string[];
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  missionId: string;
  projects: string[];
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  programId: string;
  volunteers: string[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
}

interface Partner {
  id: string;
  name: string;
  type: 'corporate' | 'ngo' | 'government' | 'academic' | 'individual';
  description: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  since: string;
}

interface Trustee {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  since: string;
  status: 'active' | 'inactive';
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  availability: 'full-time' | 'part-time' | 'weekends';
  joinedAt: string;
  status: 'active' | 'inactive' | 'pending';
  contributions: number;
  projects: string[];
}

interface DirectoryEntry {
  id: string;
  type: 'organization' | 'partner' | 'trustee' | 'volunteer' | 'program' | 'project';
  name: string;
  description: string;
  contact?: string;
  location?: string;
  status: string;
}

export class InstitutionIdentity {
  private organization: Organization | null = null;
  private missions: Mission[] = [];
  private programs: Program[] = [];
  private projects: Project[] = [];
  private partners: Partner[] = [];
  private trustees: Trustee[] = [];
  private volunteers: Volunteer[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const orgFile = join(this.dataDir, 'organization.json');
    if (existsSync(orgFile)) {
      this.organization = JSON.parse(readFileSync(orgFile, 'utf-8'));
    }

    const missionsFile = join(this.dataDir, 'missions.json');
    if (existsSync(missionsFile)) {
      this.missions = JSON.parse(readFileSync(missionsFile, 'utf-8'));
    }

    const programsFile = join(this.dataDir, 'programs.json');
    if (existsSync(programsFile)) {
      this.programs = JSON.parse(readFileSync(programsFile, 'utf-8'));
    }

    const projectsFile = join(this.dataDir, 'projects.json');
    if (existsSync(projectsFile)) {
      this.projects = JSON.parse(readFileSync(projectsFile, 'utf-8'));
    }

    const partnersFile = join(this.dataDir, 'partners.json');
    if (existsSync(partnersFile)) {
      this.partners = JSON.parse(readFileSync(partnersFile, 'utf-8'));
    }

    const trusteesFile = join(this.dataDir, 'trustees.json');
    if (existsSync(trusteesFile)) {
      this.trustees = JSON.parse(readFileSync(trusteesFile, 'utf-8'));
    }

    const volunteersFile = join(this.dataDir, 'volunteers.json');
    if (existsSync(volunteersFile)) {
      this.volunteers = JSON.parse(readFileSync(volunteersFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(join(this.dataDir, 'organization.json'), JSON.stringify(this.organization, null, 2));
    writeFileSync(join(this.dataDir, 'missions.json'), JSON.stringify(this.missions, null, 2));
    writeFileSync(join(this.dataDir, 'programs.json'), JSON.stringify(this.programs, null, 2));
    writeFileSync(join(this.dataDir, 'projects.json'), JSON.stringify(this.projects, null, 2));
    writeFileSync(join(this.dataDir, 'partners.json'), JSON.stringify(this.partners, null, 2));
    writeFileSync(join(this.dataDir, 'trustees.json'), JSON.stringify(this.trustees, null, 2));
    writeFileSync(join(this.dataDir, 'volunteers.json'), JSON.stringify(this.volunteers, null, 2));
  }

  // Organization
  setOrganization(org: Organization): void {
    this.organization = org;
    this.saveData();
  }

  getOrganization(): Organization | null {
    return this.organization;
  }

  // Missions
  addMission(mission: Omit<Mission, 'id'>): Mission {
    const newMission: Mission = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...mission
    };
    this.missions.push(newMission);
    this.saveData();
    return newMission;
  }

  getMissions(): Mission[] {
    return this.missions;
  }

  // Programs
  addProgram(program: Omit<Program, 'id'>): Program {
    const newProgram: Program = {
      id: `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...program
    };
    this.programs.push(newProgram);
    this.saveData();
    return newProgram;
  }

  getPrograms(): Program[] {
    return this.programs;
  }

  // Projects
  addProject(project: Omit<Project, 'id' | 'spent'>): Project {
    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...project,
      spent: 0
    };
    this.projects.push(newProject);
    this.saveData();
    return newProject;
  }

  getProjects(): Project[] {
    return this.projects;
  }

  // Partners
  addPartner(partner: Omit<Partner, 'id'>): Partner {
    const newPartner: Partner = {
      id: `partner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...partner
    };
    this.partners.push(newPartner);
    this.saveData();
    return newPartner;
  }

  getPartners(): Partner[] {
    return this.partners;
  }

  // Trustees
  addTrustee(trustee: Omit<Trustee, 'id'>): Trustee {
    const newTrustee: Trustee = {
      id: `trustee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...trustee
    };
    this.trustees.push(newTrustee);
    this.saveData();
    return newTrustee;
  }

  getTrustees(): Trustee[] {
    return this.trustees;
  }

  // Volunteers
  addVolunteer(volunteer: Omit<Volunteer, 'id' | 'contributions' | 'projects'>): Volunteer {
    const newVolunteer: Volunteer = {
      id: `vol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...volunteer,
      contributions: 0,
      projects: []
    };
    this.volunteers.push(newVolunteer);
    this.saveData();
    return newVolunteer;
  }

  getVolunteers(): Volunteer[] {
    return this.volunteers;
  }

  // Public Directory
  getDirectory(): DirectoryEntry[] {
    const entries: DirectoryEntry[] = [];

    if (this.organization) {
      entries.push({
        id: this.organization.id,
        type: 'organization',
        name: this.organization.name,
        description: this.organization.mission,
        contact: this.organization.email,
        location: this.organization.location,
        status: 'active'
      });
    }

    for (const partner of this.partners) {
      entries.push({
        id: partner.id,
        type: 'partner',
        name: partner.name,
        description: partner.description,
        contact: partner.contact.email,
        status: partner.status
      });
    }

    for (const trustee of this.trustees) {
      entries.push({
        id: trustee.id,
        type: 'trustee',
        name: trustee.name,
        description: trustee.bio,
        contact: trustee.email,
        status: trustee.status
      });
    }

    for (const volunteer of this.volunteers) {
      entries.push({
        id: volunteer.id,
        type: 'volunteer',
        name: volunteer.name,
        description: volunteer.skills.join(', '),
        contact: volunteer.email,
        status: volunteer.status
      });
    }

    for (const program of this.programs) {
      entries.push({
        id: program.id,
        type: 'program',
        name: program.name,
        description: program.description,
        status: program.status
      });
    }

    for (const project of this.projects) {
      entries.push({
        id: project.id,
        type: 'project',
        name: project.name,
        description: project.description,
        status: project.status
      });
    }

    return entries;
  }

  // Summary
  getSummary(): {
    organization: boolean;
    missions: number;
    programs: number;
    projects: number;
    partners: number;
    trustees: number;
    volunteers: number;
    directoryEntries: number;
  } {
    return {
      organization: this.organization !== null,
      missions: this.missions.length,
      programs: this.programs.length,
      projects: this.projects.length,
      partners: this.partners.length,
      trustees: this.trustees.length,
      volunteers: this.volunteers.length,
      directoryEntries: this.getDirectory().length
    };
  }
}

// Singleton instance
let instance: InstitutionIdentity | null = null;

export function getInstitutionIdentity(): InstitutionIdentity {
  if (!instance) {
    instance = new InstitutionIdentity();
  }
  return instance;
}
