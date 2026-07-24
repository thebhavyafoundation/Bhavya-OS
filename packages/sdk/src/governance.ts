import { AuditLogger, PermissionEngine, type AuditEntry } from "@bhavya/mission-runtime";

export interface ADRRecord {
  id: string;
  title: string;
  status: "APPROVED" | "PROPOSED" | "REJECTED" | "SUPERSEDED";
  date: string;
  owner: string;
}

export class GovernanceSDK {
  audit: AuditLogger;
  permissions: PermissionEngine;

  constructor() {
    this.audit = new AuditLogger();
    this.permissions = new PermissionEngine();
  }

  getDecisionLog(limit = 50): AuditEntry[] {
    return this.audit.query(undefined, undefined, limit);
  }

  logDecision(action: string, resource: string, actor: string, detail: string): void {
    this.audit.log(actor, action, resource, detail);
  }
}
