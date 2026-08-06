/**
 * Foundation CRM
 * Bhavya Ecosystem v1.0
 * 
 * Lightweight CRM for:
 * - Donors
 * - Volunteers
 * - Partners
 * - Beneficiaries
 * - Organizations
 * - History
 * - Interactions
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'crm', 'data');

interface Contact {
  id: string;
  type: 'donor' | 'volunteer' | 'partner' | 'beneficiary' | 'organization';
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
  tags: string[];
  notes: string;
  interactions: Interaction[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

interface Interaction {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'event' | 'donation' | 'volunteer' | 'other';
  description: string;
  date: string;
  outcome?: string;
  followUp?: string;
}

interface Donor extends Contact {
  type: 'donor';
  totalDonations: number;
  lastDonationDate?: string;
  donationFrequency: 'one-time' | 'monthly' | 'quarterly' | 'annual';
  campaigns: string[];
}

interface Volunteer extends Contact {
  type: 'volunteer';
  skills: string[];
  availability: 'full-time' | 'part-time' | 'weekends';
  hoursLogged: number;
  projects: string[];
  status: 'active' | 'inactive' | 'pending';
}

interface Partner extends Contact {
  type: 'partner';
  partnerType: 'corporate' | 'ngo' | 'government' | 'academic' | 'individual';
  since: string;
  projects: string[];
  status: 'active' | 'inactive' | 'pending';
}

interface Beneficiary extends Contact {
  type: 'beneficiary';
  programs: string[];
  projects: string[];
  status: 'active' | 'completed' | 'inactive';
}

interface Organization extends Contact {
  type: 'organization';
  orgType: 'corporate' | 'ngo' | 'government' | 'academic' | 'other';
  employees?: number;
  website?: string;
}

export class FoundationCRM {
  private contacts: Contact[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadContacts();
  }

  private loadContacts(): void {
    const contactsFile = join(this.dataDir, 'contacts.json');
    if (existsSync(contactsFile)) {
      this.contacts = JSON.parse(readFileSync(contactsFile, 'utf-8'));
    }
  }

  private saveContacts(): void {
    writeFileSync(
      join(this.dataDir, 'contacts.json'),
      JSON.stringify(this.contacts, null, 2)
    );
  }

  /**
   * Add contact
   */
  addContact(contact: Omit<Contact, 'id' | 'interactions' | 'metadata'>): Contact {
    const newContact: Contact = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...contact,
      interactions: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.contacts.push(newContact);
    this.saveContacts();
    return newContact;
  }

  /**
   * Get contact
   */
  getContact(id: string): Contact | undefined {
    return this.contacts.find(c => c.id === id);
  }

  /**
   * Get all contacts
   */
  getAllContacts(): Contact[] {
    return this.contacts;
  }

  /**
   * Get contacts by type
   */
  getContactsByType(type: Contact['type']): Contact[] {
    return this.contacts.filter(c => c.type === type);
  }

  /**
   * Search contacts
   */
  searchContacts(query: string): Contact[] {
    const lowerQuery = query.toLowerCase();
    return this.contacts.filter(c => {
      return (
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Add interaction
   */
  addInteraction(contactId: string, interaction: Omit<Interaction, 'id'>): void {
    const contact = this.getContact(contactId);
    if (contact) {
      contact.interactions.push({
        id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...interaction
      });
      contact.metadata.updatedAt = new Date().toISOString();
      this.saveContacts();
    }
  }

  /**
   * Get contact history
   */
  getContactHistory(contactId: string): Interaction[] {
    const contact = this.getContact(contactId);
    return contact ? contact.interactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
  }

  /**
   * Get CRM summary
   */
  getSummary(): {
    totalContacts: number;
    byType: Record<string, number>;
    totalInteractions: number;
    recentContacts: number;
  } {
    const byType: Record<string, number> = {};
    for (const contact of this.contacts) {
      byType[contact.type] = (byType[contact.type] || 0) + 1;
    }

    const totalInteractions = this.contacts.reduce((sum, c) => sum + c.interactions.length, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentContacts = this.contacts.filter(c => new Date(c.metadata.createdAt) > oneWeekAgo).length;

    return {
      totalContacts: this.contacts.length,
      byType,
      totalInteractions,
      recentContacts
    };
  }
}

// Singleton instance
let instance: FoundationCRM | null = null;

export function getFoundationCRM(): FoundationCRM {
  if (!instance) {
    instance = new FoundationCRM();
  }
  return instance;
}
