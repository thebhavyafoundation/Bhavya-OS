/**
 * Governance Engine
 * Bhavya Ecosystem v1.0
 * 
 * Implements:
 * - Approval workflows
 * - Version control
 * - Review lifecycle
 * - Audit history
 * - Policy enforcement
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'governance', 'data');

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'policy' | 'document' | 'project' | 'release' | 'deployment';
  steps: ApprovalStep[];
  status: 'active' | 'inactive';
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

interface ApprovalStep {
  id: string;
  name: string;
  approver: string;
  required: boolean;
  order: number;
}

interface ApprovalRequest {
  id: string;
  workflowId: string;
  itemId: string;
  itemType: string;
  title: string;
  description: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  currentStep: number;
  steps: ApprovalStepExecution[];
  createdAt: string;
  updatedAt: string;
}

interface ApprovalStepExecution {
  stepId: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  executedAt?: string;
}

interface VersionedItem {
  id: string;
  type: 'policy' | 'document' | 'procedure' | 'config';
  title: string;
  currentVersion: number;
  versions: ItemVersion[];
  status: 'draft' | 'review' | 'approved' | 'archived';
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

interface ItemVersion {
  version: number;
  content: string;
  changes: string;
  author: string;
  approvedBy?: string;
  date: string;
}

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: string;
  timestamp: string;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  effectiveDate: string;
  reviewDate?: string;
  status: 'draft' | 'review' | 'active' | 'archived';
  versions: ItemVersion[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export class GovernanceEngine {
  private workflows: ApprovalWorkflow[] = [];
  private requests: ApprovalRequest[] = [];
  private versionedItems: VersionedItem[] = [];
  private auditLog: AuditEntry[] = [];
  private policies: Policy[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const loadFile = (filename: string) => {
      const filepath = join(this.dataDir, filename);
      return existsSync(filepath) ? JSON.parse(readFileSync(filepath, 'utf-8')) : [];
    };

    this.workflows = loadFile('workflows.json');
    this.requests = loadFile('requests.json');
    this.versionedItems = loadFile('versioned-items.json');
    this.auditLog = loadFile('audit-log.json');
    this.policies = loadFile('policies.json');
  }

  private saveData(): void {
    const saveFile = (filename: string, data: any) => {
      writeFileSync(join(this.dataDir, filename), JSON.stringify(data, null, 2));
    };

    saveFile('workflows.json', this.workflows);
    saveFile('requests.json', this.requests);
    saveFile('versioned-items.json', this.versionedItems);
    saveFile('audit-log.json', this.auditLog);
    saveFile('policies.json', this.policies);
  }

  /**
   * Create approval workflow
   */
  createWorkflow(workflow: Omit<ApprovalWorkflow, 'id' | 'metadata'>): ApprovalWorkflow {
    const newWorkflow: ApprovalWorkflow = {
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...workflow,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.workflows.push(newWorkflow);
    this.saveData();
    return newWorkflow;
  }

  /**
   * Get workflow
   */
  getWorkflow(id: string): ApprovalWorkflow | undefined {
    return this.workflows.find(w => w.id === id);
  }

  /**
   * Create approval request
   */
  createRequest(request: Omit<ApprovalRequest, 'id' | 'status' | 'currentStep' | 'steps' | 'createdAt' | 'updatedAt'>): ApprovalRequest {
    const workflow = this.getWorkflow(request.workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${request.workflowId} not found`);
    }

    const newRequest: ApprovalRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...request,
      status: 'pending',
      currentStep: 0,
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        approver: step.approver,
        status: 'pending'
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveData();
    return newRequest;
  }

  /**
   * Approve step
   */
  approveStep(requestId: string, stepId: string, approver: string, comment?: string): void {
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      const step = request.steps.find(s => s.stepId === stepId);
      if (step && step.approver === approver) {
        step.status = 'approved';
        step.comment = comment;
        step.executedAt = new Date().toISOString();

        const allApproved = request.steps.every(s => s.status === 'approved');
        if (allApproved) {
          request.status = 'approved';
        } else {
          request.currentStep++;
        }

        request.updatedAt = new Date().toISOString();
        this.addAuditEntry('approve', 'request', requestId, approver, `Approved step ${stepId}`);
        this.saveData();
      }
    }
  }

  /**
   * Reject step
   */
  rejectStep(requestId: string, stepId: string, approver: string, comment?: string): void {
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      const step = request.steps.find(s => s.stepId === stepId);
      if (step && step.approver === approver) {
        step.status = 'rejected';
        step.comment = comment;
        step.executedAt = new Date().toISOString();
        request.status = 'rejected';
        request.updatedAt = new Date().toISOString();
        this.addAuditEntry('reject', 'request', requestId, approver, `Rejected step ${stepId}`);
        this.saveData();
      }
    }
  }

  /**
   * Create versioned item
   */
  createVersionedItem(item: Omit<VersionedItem, 'id' | 'currentVersion' | 'versions' | 'metadata'>): VersionedItem {
    const newItem: VersionedItem = {
      id: `vi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      currentVersion: 1,
      versions: [{ version: 1, content: '', changes: 'Initial version', author: 'system', date: new Date().toISOString() }],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.versionedItems.push(newItem);
    this.saveData();
    return newItem;
  }

  /**
   * Add version
   */
  addVersion(itemId: string, version: Omit<ItemVersion, 'version'>): void {
    const item = this.versionedItems.find(i => i.id === itemId);
    if (item) {
      item.currentVersion++;
      item.versions.push({ ...version, version: item.currentVersion });
      item.metadata.updatedAt = new Date().toISOString();
      this.addAuditEntry('version', 'item', itemId, version.author, `Added version ${item.currentVersion}`);
      this.saveData();
    }
  }

  /**
   * Add audit entry
   */
  addAuditEntry(action: string, entityType: string, entityId: string, userId: string, details: string): void {
    this.auditLog.push({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      entityType,
      entityId,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
    this.saveData();
  }

  /**
   * Get audit log
   */
  getAuditLog(entityType?: string, entityId?: string): AuditEntry[] {
    let log = this.auditLog;
    if (entityType) {
      log = log.filter(e => e.entityType === entityType);
    }
    if (entityId) {
      log = log.filter(e => e.entityId === entityId);
    }
    return log.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Create policy
   */
  createPolicy(policy: Omit<Policy, 'id' | 'versions' | 'metadata'>): Policy {
    const newPolicy: Policy = {
      id: `pol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...policy,
      versions: [{ version: 1, content: policy.content, changes: 'Initial version', author: 'system', date: new Date().toISOString() }],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.policies.push(newPolicy);
    this.saveData();
    return newPolicy;
  }

  /**
   * Get all policies
   */
  getPolicies(): Policy[] {
    return this.policies;
  }

  /**
   * Get governance summary
   */
  getSummary(): {
    totalWorkflows: number;
    totalRequests: number;
    pendingRequests: number;
    totalVersionedItems: number;
    totalAuditEntries: number;
    totalPolicies: number;
  } {
    return {
      totalWorkflows: this.workflows.length,
      totalRequests: this.requests.length,
      pendingRequests: this.requests.filter(r => r.status === 'pending').length,
      totalVersionedItems: this.versionedItems.length,
      totalAuditEntries: this.auditLog.length,
      totalPolicies: this.policies.length
    };
  }
}

// Singleton instance
let instance: GovernanceEngine | null = null;

export function getGovernanceEngine(): GovernanceEngine {
  if (!instance) {
    instance = new GovernanceEngine();
  }
  return instance;
}
