/**
 * Customer Feedback Engine
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Collects and classifies:
 * - Feedback
 * - Bug reports
 * - Feature requests
 * - Ideas
 * 
 * Automatically classifies as:
 * - bug
 * - feature
 * - question
 * - documentation
 * - security
 * - performance
 * 
 * Generates backlog automatically
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'feedback-engine', 'data');

interface FeedbackItem {
  id: string;
  timestamp: string;
  appId: string;
  type: 'feedback' | 'bug' | 'feature' | 'idea';
  title: string;
  description: string;
  classification: 'bug' | 'feature' | 'question' | 'documentation' | 'security' | 'performance';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'new' | 'classified' | 'backlog' | 'in-progress' | 'completed' | 'closed';
  source: 'email' | 'form' | 'issue' | 'social' | 'support';
  userId?: string;
  email?: string;
  metadata?: Record<string, any>;
}

export class FeedbackEngine {
  private feedback: FeedbackItem[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadFeedback();
  }

  private loadFeedback(): void {
    const feedbackFile = join(this.dataDir, 'feedback.json');
    if (existsSync(feedbackFile)) {
      this.feedback = JSON.parse(readFileSync(feedbackFile, 'utf-8'));
    }
  }

  private saveFeedback(): void {
    writeFileSync(
      join(this.dataDir, 'feedback.json'),
      JSON.stringify(this.feedback, null, 2)
    );
  }

  /**
   * Add feedback item
   */
  addFeedback(item: Omit<FeedbackItem, 'id' | 'timestamp' | 'classification' | 'priority' | 'status'>): FeedbackItem {
    const newItem: FeedbackItem = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...item,
      classification: this.classifyFeedback(item),
      priority: this.determinePriority(item),
      status: 'new'
    };

    this.feedback.push(newItem);
    this.saveFeedback();
    return newItem;
  }

  /**
   * Classify feedback automatically
   */
  private classifyFeedback(item: { type: string; title: string; description: string }): FeedbackItem['classification'] {
    const text = `${item.title} ${item.description}`.toLowerCase();

    // Bug detection
    if (item.type === 'bug' || text.includes('error') || text.includes('broken') || text.includes('crash') || text.includes('fail')) {
      return 'bug';
    }

    // Security detection
    if (text.includes('security') || text.includes('vulnerability') || text.includes('hack') || text.includes('exploit')) {
      return 'security';
    }

    // Performance detection
    if (text.includes('slow') || text.includes('performance') || text.includes('lag') || text.includes('loading')) {
      return 'performance';
    }

    // Documentation detection
    if (text.includes('documentation') || text.includes('docs') || text.includes('guide') || text.includes('tutorial')) {
      return 'documentation';
    }

    // Question detection
    if (text.includes('how') || text.includes('why') || text.includes('what') || text.includes('?')) {
      return 'question';
    }

    // Feature detection
    if (item.type === 'feature' || text.includes('feature') || text.includes('request') || text.includes('add') || text.includes('need')) {
      return 'feature';
    }

    return 'feature';
  }

  /**
   * Determine priority automatically
   */
  private determinePriority(item: { type: string; title: string; description: string }): FeedbackItem['priority'] {
    const text = `${item.title} ${item.description}`.toLowerCase();

    // P0 - Critical
    if (text.includes('critical') || text.includes('urgent') || text.includes('security') || text.includes('data loss')) {
      return 'P0';
    }

    // P1 - High
    if (item.type === 'bug' || text.includes('error') || text.includes('broken') || text.includes('crash')) {
      return 'P1';
    }

    // P2 - Medium
    if (item.type === 'feature' || text.includes('feature') || text.includes('request')) {
      return 'P2';
    }

    // P3 - Low
    return 'P3';
  }

  /**
   * Get all feedback
   */
  getAllFeedback(): FeedbackItem[] {
    return this.feedback;
  }

  /**
   * Get feedback by app
   */
  getAppFeedback(appId: string): FeedbackItem[] {
    return this.feedback.filter(f => f.appId === appId);
  }

  /**
   * Get feedback by classification
   */
  getByClassification(classification: FeedbackItem['classification']): FeedbackItem[] {
    return this.feedback.filter(f => f.classification === classification);
  }

  /**
   * Get feedback by priority
   */
  getByPriority(priority: FeedbackItem['priority']): FeedbackItem[] {
    return this.feedback.filter(f => f.priority === priority);
  }

  /**
   * Get feedback by status
   */
  getByStatus(status: FeedbackItem['status']): FeedbackItem[] {
    return this.feedback.filter(f => f.status === status);
  }

  /**
   * Update feedback status
   */
  updateStatus(id: string, status: FeedbackItem['status']): void {
    const item = this.feedback.find(f => f.id === id);
    if (item) {
      item.status = status;
      this.saveFeedback();
    }
  }

  /**
   * Get feedback summary
   */
  getSummary(): {
    total: number;
    byType: Record<string, number>;
    byClassification: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    const byClassification: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const item of this.feedback) {
      byType[item.type] = (byType[item.type] || 0) + 1;
      byClassification[item.classification] = (byClassification[item.classification] || 0) + 1;
      byPriority[item.priority] = (byPriority[item.priority] || 0) + 1;
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    }

    return {
      total: this.feedback.length,
      byType,
      byClassification,
      byPriority,
      byStatus
    };
  }

  /**
   * Generate backlog items from feedback
   */
  generateBacklogItems(): { title: string; description: string; type: string; priority: string }[] {
    return this.feedback
      .filter(f => f.status === 'new' || f.status === 'classified')
      .map(f => ({
        title: f.title,
        description: f.description,
        type: f.classification,
        priority: f.priority
      }));
  }
}

// Singleton instance
let instance: FeedbackEngine | null = null;

export function getFeedbackEngine(): FeedbackEngine {
  if (!instance) {
    instance = new FeedbackEngine();
  }
  return instance;
}
