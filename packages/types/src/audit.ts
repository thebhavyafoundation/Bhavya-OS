/**
 * @bhavya/types — Audit Types
 *
 * Canonical audit log types.
 */

/** An audit log entry */
export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/** Audit action */
export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "publish"
  | "approve"
  | "reject"
  | "execute"
  | "export"
  | "import";
