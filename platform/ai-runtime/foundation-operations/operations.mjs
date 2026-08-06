/**
 * Foundation Operations
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Manages:
 * - Volunteers
 * - Projects
 * - Donations
 * - Events
 * - Outreach
 * - Governance
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'foundation-operations', 'data');

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  availability: 'full-time' | 'part-time' | 'weekends';
  joinedAt: string;
  status: 'active' | 'inactive' | 'pending';
  contributions: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  volunteers: string[];
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
}

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  method: 'online' | 'bank' | 'cash';
  status: 'received' | 'pending' | 'failed';
  projectId?: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export class FoundationOperations {
  private volunteers: Volunteer[] = [];
  private projects: Project[] = [];
  private donations: Donation[] = [];
  private events: Event[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const volunteersFile = join(this.dataDir, 'volunteers.json');
    if (existsSync(volunteersFile)) {
      this.volunteers = JSON.parse(readFileSync(volunteersFile, 'utf-8'));
    }

    const projectsFile = join(this.dataDir, 'projects.json');
    if (existsSync(projectsFile)) {
      this.projects = JSON.parse(readFileSync(projectsFile, 'utf-8'));
    }

    const donationsFile = join(this.dataDir, 'donations.json');
    if (existsSync(donationsFile)) {
      this.donations = JSON.parse(readFileSync(donationsFile, 'utf-8'));
    }

    const eventsFile = join(this.dataDir, 'events.json');
    if (existsSync(eventsFile)) {
      this.events = JSON.parse(readFileSync(eventsFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(
      join(this.dataDir, 'volunteers.json'),
      JSON.stringify(this.volunteers, null, 2)
    );

    writeFileSync(
      join(this.dataDir, 'projects.json'),
      JSON.stringify(this.projects, null, 2)
    );

    writeFileSync(
      join(this.dataDir, 'donations.json'),
      JSON.stringify(this.donations, null, 2)
    );

    writeFileSync(
      join(this.dataDir, 'events.json'),
      JSON.stringify(this.events, null, 2)
    );
  }

  // Volunteer Management
  addVolunteer(volunteer: Omit<Volunteer, 'id' | 'joinedAt' | 'contributions'>): Volunteer {
    const newVolunteer: Volunteer = {
      id: `vol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...volunteer,
      joinedAt: new Date().toISOString(),
      contributions: 0
    };

    this.volunteers.push(newVolunteer);
    this.saveData();
    return newVolunteer;
  }

  getVolunteers(): Volunteer[] {
    return this.volunteers;
  }

  getActiveVolunteers(): Volunteer[] {
    return this.volunteers.filter(v => v.status === 'active');
  }

  // Project Management
  addProject(project: Omit<Project, 'id' | 'spent'>): Project {
    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  getActiveProjects(): Project[] {
    return this.projects.filter(p => p.status === 'active');
  }

  // Donation Management
  addDonation(donation: Omit<Donation, 'id' | 'date'>): Donation {
    const newDonation: Donation = {
      id: `don-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...donation,
      date: new Date().toISOString()
    };

    this.donations.push(newDonation);
    this.saveData();
    return newDonation;
  }

  getDonations(): Donation[] {
    return this.donations;
  }

  getTotalDonations(): number {
    return this.donations
      .filter(d => d.status === 'received')
      .reduce((sum, d) => sum + d.amount, 0);
  }

  // Event Management
  addEvent(event: Omit<Event, 'id' | 'attendees'>): Event {
    const newEvent: Event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...event,
      attendees: 0
    };

    this.events.push(newEvent);
    this.saveData();
    return newEvent;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getUpcomingEvents(): Event[] {
    return this.events.filter(e => e.status === 'upcoming');
  }

  // Summary
  getSummary(): {
    volunteers: { total: number; active: number };
    projects: { total: number; active: number; completed: number };
    donations: { total: number; count: number };
    events: { total: number; upcoming: number };
  } {
    return {
      volunteers: {
        total: this.volunteers.length,
        active: this.getActiveVolunteers().length
      },
      projects: {
        total: this.projects.length,
        active: this.getActiveProjects().length,
        completed: this.projects.filter(p => p.status === 'completed').length
      },
      donations: {
        total: this.getTotalDonations(),
        count: this.donations.filter(d => d.status === 'received').length
      },
      events: {
        total: this.events.length,
        upcoming: this.getUpcomingEvents().length
      }
    };
  }
}

// Singleton instance
let instance: FoundationOperations | null = null;

export function getFoundationOperations(): FoundationOperations {
  if (!instance) {
    instance = new FoundationOperations();
  }
  return instance;
}
