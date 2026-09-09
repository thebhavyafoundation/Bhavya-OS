import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db.js";
import type { ApprovalRecord, ApprovalStatus } from "../lib/types.js";

export function createApprovalRequest(publicationId: string): ApprovalRecord {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO approval_records (id, publication_id, requested_by, requested_at, status)
    VALUES (?, ?, 'system', ?, 'pending')
  `,
  ).run(id, publicationId, now);

  const item = getApproval(id);
  if (!item) throw new Error("Approval not found after insert");
  return item;
}

export function getApproval(id: string): ApprovalRecord | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM approval_records WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return mapRowToApproval(row);
}

export function getPendingApprovals(): ApprovalRecord[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM approval_records WHERE status = 'pending' ORDER BY requested_at ASC",
    )
    .all() as any[];
  return rows.map(mapRowToApproval);
}

export function approvePublication(
  id: string,
  reviewedBy: string,
  notes?: string,
): ApprovalRecord | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE approval_records SET status = 'approved', reviewed_by = ?, reviewed_at = ?, notes = ? WHERE id = ?
  `,
  ).run(reviewedBy, now, notes || null, id);
  return getApproval(id);
}

export function rejectPublication(
  id: string,
  reviewedBy: string,
  notes?: string,
): ApprovalRecord | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE approval_records SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, notes = ? WHERE id = ?
  `,
  ).run(reviewedBy, now, notes || null, id);
  return getApproval(id);
}

export function editPublication(
  id: string,
  reviewedBy: string,
  notes?: string,
): ApprovalRecord | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE approval_records SET status = 'edited', reviewed_by = ?, reviewed_at = ?, notes = ? WHERE id = ?
  `,
  ).run(reviewedBy, now, notes || null, id);
  return getApproval(id);
}

function mapRowToApproval(row: any): ApprovalRecord {
  return {
    id: row.id,
    publicationId: row.publication_id,
    requestedBy: row.requested_by,
    requestedAt: row.requested_at,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    status: row.status as ApprovalStatus,
    notes: row.notes,
  };
}
