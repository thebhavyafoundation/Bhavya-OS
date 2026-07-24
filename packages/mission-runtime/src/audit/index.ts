export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  detail: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type AuditSeverity = "info" | "warning" | "error" | "critical";

export class AuditLogger {
  private entries: AuditEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries = 10000) {
    this.maxEntries = maxEntries;
  }

  log(actor: string, action: string, resource: string, detail: string, metadata?: Record<string, unknown>): AuditEntry {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      actor,
      action,
      resource,
      detail,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
    return entry;
  }

  query(actor?: string, action?: string, limit = 50): AuditEntry[] {
    let results = [...this.entries];
    if (actor) results = results.filter(e => e.actor === actor);
    if (action) results = results.filter(e => e.action === action);
    return results.slice(-limit).reverse();
  }

  getAll(): AuditEntry[] {
    return [...this.entries];
  }
}
