/**
 * Mission Workspace
 * Bhavya Ecosystem v1.0
 * 
 * Collaborative workspaces with:
 * - Goals
 * - Tasks
 * - Documents
 * - Knowledge
 * - Timeline
 * - Reports
 * - Impact
 * - Metrics
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'mission-workspace', 'data');

interface Workspace {
  id: string;
  name: string;
  description: string;
  missionId: string;
  goals: Goal[];
  tasks: Task[];
  documents: DocumentRef[];
  knowledge: KnowledgeRef[];
  timeline: TimelineEvent[];
  reports: Report[];
  impact: ImpactMetric[];
  metrics: WorkspaceMetrics;
  members: string[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  progress: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
}

interface DocumentRef {
  id: string;
  title: string;
  type: string;
  url: string;
  addedAt: string;
}

interface KnowledgeRef {
  id: string;
  title: string;
  type: string;
  url: string;
  addedAt: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'update' | 'meeting' | 'deadline';
}

interface Report {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'annual';
}

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

interface WorkspaceMetrics {
  totalTasks: number;
  completedTasks: number;
  totalGoals: number;
  completedGoals: number;
  totalDocuments: number;
  totalKnowledge: number;
  lastActivity: string;
}

export class MissionWorkspace {
  private workspaces: Workspace[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadWorkspaces();
  }

  private loadWorkspaces(): void {
    const workspacesFile = join(this.dataDir, 'workspaces.json');
    if (existsSync(workspacesFile)) {
      this.workspaces = JSON.parse(readFileSync(workspacesFile, 'utf-8'));
    }
  }

  private saveWorkspaces(): void {
    writeFileSync(
      join(this.dataDir, 'workspaces.json'),
      JSON.stringify(this.workspaces, null, 2)
    );
  }

  /**
   * Create workspace
   */
  createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Workspace {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...workspace,
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        totalGoals: 0,
        completedGoals: 0,
        totalDocuments: 0,
        totalKnowledge: 0,
        lastActivity: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.workspaces.push(newWorkspace);
    this.saveWorkspaces();
    return newWorkspace;
  }

  /**
   * Get workspace
   */
  getWorkspace(id: string): Workspace | undefined {
    return this.workspaces.find(w => w.id === id);
  }

  /**
   * Get all workspaces
   */
  getAllWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  /**
   * Add goal to workspace
   */
  addGoal(workspaceId: string, goal: Omit<Goal, 'id' | 'progress'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.goals.push({
        id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...goal,
        progress: 0
      });
      workspace.metrics.totalGoals = workspace.goals.length;
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Add task to workspace
   */
  addTask(workspaceId: string, task: Omit<Task, 'id'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.tasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...task
      });
      workspace.metrics.totalTasks = workspace.tasks.length;
      workspace.metrics.lastActivity = new Date().toISOString();
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Complete task
   */
  completeTask(workspaceId: string, taskId: string): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      const task = workspace.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'done';
        workspace.metrics.completedTasks = workspace.tasks.filter(t => t.status === 'done').length;
        workspace.metrics.lastActivity = new Date().toISOString();
        workspace.updatedAt = new Date().toISOString();
        this.saveWorkspaces();
      }
    }
  }

  /**
   * Add document
   */
  addDocument(workspaceId: string, doc: Omit<DocumentRef, 'id' | 'addedAt'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.documents.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...doc,
        addedAt: new Date().toISOString()
      });
      workspace.metrics.totalDocuments = workspace.documents.length;
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Add knowledge
   */
  addKnowledge(workspaceId: string, knowledge: Omit<KnowledgeRef, 'id' | 'addedAt'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.knowledge.push({
        id: `know-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...knowledge,
        addedAt: new Date().toISOString()
      });
      workspace.metrics.totalKnowledge = workspace.knowledge.length;
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Add timeline event
   */
  addTimelineEvent(workspaceId: string, event: Omit<TimelineEvent, 'id'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.timeline.push({
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...event
      });
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Add report
   */
  addReport(workspaceId: string, report: Omit<Report, 'id'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.reports.push({
        id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...report
      });
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Add impact metric
   */
  addImpactMetric(workspaceId: string, metric: Omit<ImpactMetric, 'id'>): void {
    const workspace = this.getWorkspace(workspaceId);
    if (workspace) {
      workspace.impact.push({
        id: `impact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...metric
      });
      workspace.updatedAt = new Date().toISOString();
      this.saveWorkspaces();
    }
  }

  /**
   * Get workspace summary
   */
  getSummary(): {
    totalWorkspaces: number;
    activeWorkspaces: number;
    totalTasks: number;
    totalGoals: number;
  } {
    return {
      totalWorkspaces: this.workspaces.length,
      activeWorkspaces: this.workspaces.filter(w => w.status === 'active').length,
      totalTasks: this.workspaces.reduce((sum, w) => sum + w.metrics.totalTasks, 0),
      totalGoals: this.workspaces.reduce((sum, w) => sum + w.metrics.totalGoals, 0)
    };
  }
}

// Singleton instance
let instance: MissionWorkspace | null = null;

export function getMissionWorkspace(): MissionWorkspace {
  if (!instance) {
    instance = new MissionWorkspace();
  }
  return instance;
}
