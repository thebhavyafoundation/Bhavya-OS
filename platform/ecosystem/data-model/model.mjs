/**
 * Unified Data Model
 * Bhavya Ecosystem v1.0
 * 
 * Canonical schema for:
 * - People
 * - Projects
 * - Programs
 * - Events
 * - Articles
 * - Research
 * - Media
 * - Documents
 * - Policies
 * - Donations
 * - Volunteers
 * - Knowledge
 */

export interface Person {
  id: string;
  type: 'trustee' | 'volunteer' | 'donor' | 'partner' | 'staff' | 'beneficiary';
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  programId: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  volunteers: string[];
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Program {
  id: string;
  name: string;
  description: string;
  missionId: string;
  projects: string[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Event {
  id: string;
  name: string;
  description: string;
  type: 'workshop' | 'seminar' | 'conference' | 'meeting' | 'outreach' | 'fundraiser';
  date: string;
  endDate?: string;
  location: string;
  virtualLink?: string;
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Research {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  tags: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'published';
  startDate: string;
  endDate?: string;
  findings?: string;
  publications?: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Media {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'policy' | 'procedure' | 'report' | 'proposal' | 'minutes' | 'other';
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  version: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  effectiveDate: string;
  reviewDate?: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  approvedBy?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  date: string;
  method: 'online' | 'bank' | 'cash' | 'cheque';
  status: 'pending' | 'received' | 'failed' | 'refunded';
  projectId?: string;
  campaign?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Volunteer {
  id: string;
  personId: string;
  skills: string[];
  availability: 'full-time' | 'part-time' | 'weekends';
  joinedAt: string;
  status: 'active' | 'inactive' | 'pending';
  contributions: number;
  projects: string[];
  hoursLogged: number;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export interface Knowledge {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'tutorial' | 'guide' | 'reference' | 'faq';
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  version: number;
  relatedContent: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

export class UnifiedDataModel {
  private people: Person[] = [];
  private projects: Project[] = [];
  private programs: Program[] = [];
  private events: Event[] = [];
  private articles: Article[] = [];
  private research: Research[] = [];
  private media: Media[] = [];
  private documents: Document[] = [];
  private policies: Policy[] = [];
  private donations: Donation[] = [];
  private volunteers: Volunteer[] = [];
  private knowledge: Knowledge[] = [];

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    // Initialize with default data structure
  }

  // Generic CRUD operations
  add<T extends { id: string }>(collection: string, item: T): void {
    switch (collection) {
      case 'people':
        this.people.push(item as Person);
        break;
      case 'projects':
        this.projects.push(item as Project);
        break;
      case 'programs':
        this.programs.push(item as Program);
        break;
      case 'events':
        this.events.push(item as Event);
        break;
      case 'articles':
        this.articles.push(item as Article);
        break;
      case 'research':
        this.research.push(item as Research);
        break;
      case 'media':
        this.media.push(item as Media);
        break;
      case 'documents':
        this.documents.push(item as Document);
        break;
      case 'policies':
        this.policies.push(item as Policy);
        break;
      case 'donations':
        this.donations.push(item as Donation);
        break;
      case 'volunteers':
        this.volunteers.push(item as Volunteer);
        break;
      case 'knowledge':
        this.knowledge.push(item as Knowledge);
        break;
    }
  }

  get<T extends { id: string }>(collection: string, id: string): T | undefined {
    let items: T[] = [];
    switch (collection) {
      case 'people':
        items = this.people as unknown as T[];
        break;
      case 'projects':
        items = this.projects as unknown as T[];
        break;
      case 'programs':
        items = this.programs as unknown as T[];
        break;
      case 'events':
        items = this.events as unknown as T[];
        break;
      case 'articles':
        items = this.articles as unknown as T[];
        break;
      case 'research':
        items = this.research as unknown as T[];
        break;
      case 'media':
        items = this.media as unknown as T[];
        break;
      case 'documents':
        items = this.documents as unknown as T[];
        break;
      case 'policies':
        items = this.policies as unknown as T[];
        break;
      case 'donations':
        items = this.donations as unknown as T[];
        break;
      case 'volunteers':
        items = this.volunteers as unknown as T[];
        break;
      case 'knowledge':
        items = this.knowledge as unknown as T[];
        break;
    }
    return items.find(item => item.id === id);
  }

  getAll<T>(collection: string): T[] {
    switch (collection) {
      case 'people':
        return this.people as unknown as T[];
      case 'projects':
        return this.projects as unknown as T[];
      case 'programs':
        return this.programs as unknown as T[];
      case 'events':
        return this.events as unknown as T[];
      case 'articles':
        return this.articles as unknown as T[];
      case 'research':
        return this.research as unknown as T[];
      case 'media':
        return this.media as unknown as T[];
      case 'documents':
        return this.documents as unknown as T[];
      case 'policies':
        return this.policies as unknown as T[];
      case 'donations':
        return this.donations as unknown as T[];
      case 'volunteers':
        return this.volunteers as unknown as T[];
      case 'knowledge':
        return this.knowledge as unknown as T[];
      default:
        return [];
    }
  }

  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): void {
    const item = this.get<T>(collection, id);
    if (item) {
      Object.assign(item, updates);
    }
  }

  delete(collection: string, id: string): void {
    switch (collection) {
      case 'people':
        this.people = this.people.filter(p => p.id !== id);
        break;
      case 'projects':
        this.projects = this.projects.filter(p => p.id !== id);
        break;
      case 'programs':
        this.programs = this.programs.filter(p => p.id !== id);
        break;
      case 'events':
        this.events = this.events.filter(e => e.id !== id);
        break;
      case 'articles':
        this.articles = this.articles.filter(a => a.id !== id);
        break;
      case 'research':
        this.research = this.research.filter(r => r.id !== id);
        break;
      case 'media':
        this.media = this.media.filter(m => m.id !== id);
        break;
      case 'documents':
        this.documents = this.documents.filter(d => d.id !== id);
        break;
      case 'policies':
        this.policies = this.policies.filter(p => p.id !== id);
        break;
      case 'donations':
        this.donations = this.donations.filter(d => d.id !== id);
        break;
      case 'volunteers':
        this.volunteers = this.volunteers.filter(v => v.id !== id);
        break;
      case 'knowledge':
        this.knowledge = this.knowledge.filter(k => k.id !== id);
        break;
    }
  }

  // Search
  search(query: string): { collection: string; item: any }[] {
    const results: { collection: string; item: any }[] = [];
    const lowerQuery = query.toLowerCase();

    const searchCollection = (collection: string, items: any[]) => {
      for (const item of items) {
        const values = Object.values(item).filter(v => typeof v === 'string');
        if (values.some(v => (v as string).toLowerCase().includes(lowerQuery))) {
          results.push({ collection, item });
        }
      }
    };

    searchCollection('people', this.people);
    searchCollection('projects', this.projects);
    searchCollection('programs', this.programs);
    searchCollection('events', this.events);
    searchCollection('articles', this.articles);
    searchCollection('research', this.research);
    searchCollection('media', this.media);
    searchCollection('documents', this.documents);
    searchCollection('policies', this.policies);
    searchCollection('donations', this.donations);
    searchCollection('volunteers', this.volunteers);
    searchCollection('knowledge', this.knowledge);

    return results;
  }

  // Summary
  getSummary(): Record<string, number> {
    return {
      people: this.people.length,
      projects: this.projects.length,
      programs: this.programs.length,
      events: this.events.length,
      articles: this.articles.length,
      research: this.research.length,
      media: this.media.length,
      documents: this.documents.length,
      policies: this.policies.length,
      donations: this.donations.length,
      volunteers: this.volunteers.length,
      knowledge: this.knowledge.length
    };
  }
}

// Singleton instance
let instance: UnifiedDataModel | null = null;

export function getUnifiedDataModel(): UnifiedDataModel {
  if (!instance) {
    instance = new UnifiedDataModel();
  }
  return instance;
}
