import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';
import type { ContentKnowledgePackage, MediaAsset, ProductionMetrics, KPStatus, ProductionStage, MediaAssetType } from './types';

// Schema created by migrate("ioc") via packages/database

// ─── Knowledge Packages ─────────────────────────────────────

export function createKP(input: {
  title: string;
  level?: string;
  domain?: string;
  assignee?: string;
  dueDate?: string;
  concepts?: number;
}): ContentKnowledgePackage {

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO ioc_content_packages (id, title, level, domain, status, stage, assignee, due_date, concepts, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'draft', 'research', ?, ?, ?, ?, ?)
  `).run(id, input.title, input.level || 'L1', input.domain || 'general', input.assignee || null, input.dueDate || null, input.concepts || 0, now, now);

  return getKP(id)!;
}

export function getKP(id: string): ContentKnowledgePackage | null {

  const db = getDb();
  const row = db.prepare('SELECT * FROM ioc_content_packages WHERE id = ?').get(id) as any;
  if (!row) return null;
  return mapRowToKP(row);
}

export function listKPs(filter?: { status?: KPStatus; level?: string; stage?: ProductionStage }): ContentKnowledgePackage[] {

  const db = getDb();
  let query = 'SELECT * FROM ioc_content_packages';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.status) { conditions.push('status = ?'); params.push(filter.status); }
  if (filter?.level) { conditions.push('level = ?'); params.push(filter.level); }
  if (filter?.stage) { conditions.push('stage = ?'); params.push(filter.stage); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map(mapRowToKP);
}

export function updateKPStatus(id: string, status: KPStatus, stage?: ProductionStage): ContentKnowledgePackage | null {

  const db = getDb();
  const now = new Date().toISOString();
  if (stage) {
    db.prepare('UPDATE ioc_content_packages SET status = ?, stage = ?, updated_at = ? WHERE id = ?').run(status, stage, now, id);
  } else {
    db.prepare('UPDATE ioc_content_packages SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
  }
  if (status === 'published') {
    db.prepare('UPDATE ioc_content_packages SET published_at = ? WHERE id = ?').run(now, id);
  }
  return getKP(id);
}

export function advanceKP(id: string): ContentKnowledgePackage | null {

  const kp = getKP(id);
  if (!kp) return null;

  const stageOrder: ProductionStage[] = ['research', 'writing', 'review', 'design', 'media', 'publishing'];
  const statusOrder: KPStatus[] = ['draft', 'in-review', 'approved', 'published'];

  const currentStageIdx = stageOrder.indexOf(kp.stage);
  const currentStatusIdx = statusOrder.indexOf(kp.status);

  let newStage = kp.stage;
  let newStatus = kp.status;

  if (currentStageIdx < stageOrder.length - 1) {
    newStage = stageOrder[currentStageIdx + 1];
    if (newStage === 'review') newStatus = 'in-review';
    if (newStage === 'publishing') newStatus = 'approved';
  } else {
    newStatus = 'published';
  }

  return updateKPStatus(id, newStatus, newStage);
}

// ─── Media Assets ───────────────────────────────────────────

export function createMediaAsset(input: {
  kpId: string;
  type: MediaAssetType;
  title: string;
  platform?: string;
}): MediaAsset {

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO ioc_media_assets (id, kp_id, type, title, status, platform, created_at)
    VALUES (?, ?, ?, ?, 'draft', ?, ?)
  `).run(id, input.kpId, input.type, input.title, input.platform || null, now);

  const row = db.prepare('SELECT * FROM ioc_media_assets WHERE id = ?').get(id) as any;
  return { id: row.id, kpId: row.kp_id, type: row.type, title: row.title, status: row.status, platform: row.platform, createdAt: row.created_at };
}

export function listMediaAssets(filter?: { kpId?: string; type?: MediaAssetType }): MediaAsset[] {

  const db = getDb();
  let query = 'SELECT * FROM ioc_media_assets';
  const params: any[] = [];
  const conditions: string[] = [];

  if (filter?.kpId) { conditions.push('kp_id = ?'); params.push(filter.kpId); }
  if (filter?.type) { conditions.push('type = ?'); params.push(filter.type); }

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map((row: any) => ({
    id: row.id, kpId: row.kp_id, type: row.type, title: row.title,
    status: row.status, platform: row.platform, createdAt: row.created_at,
  }));
}

// ─── Community Requests ─────────────────────────────────────

export function createCommunityRequest(input: { title: string; description?: string; requestedBy?: string }): { id: string; title: string; status: string } {

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO ioc_community_requests (id, title, description, status, requested_by, created_at) VALUES (?, ?, ?, 'pending', ?, ?)`).run(id, input.title, input.description || '', input.requestedBy || null, now);
  return { id, title: input.title, status: 'pending' };
}

export function countCommunityRequests(): number {

  const db = getDb();
  return (db.prepare("SELECT COUNT(*) as c FROM ioc_community_requests WHERE status = 'pending'").get() as any).c;
}

// ─── Student Feedback ───────────────────────────────────────

export function addStudentFeedback(kpId: string, score: number, comment?: string): void {

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO ioc_student_feedback (id, kp_id, score, comment, created_at) VALUES (?, ?, ?, ?, ?)`).run(id, kpId, score, comment || null, now);
}

export function getAverageFeedback(): number {

  const db = getDb();
  const result = db.prepare('SELECT AVG(score) as avg FROM ioc_student_feedback').get() as any;
  return result?.avg ? Math.round(result.avg * 10) / 10 : 0;
}

// ─── Metrics & Analytics ────────────────────────────────────

export function getProductionMetrics(): ProductionMetrics {

  const db = getDb();

  const completed = (db.prepare("SELECT COUNT(*) as c FROM ioc_content_packages WHERE status = 'published'").get() as any).c;
  const inReview = (db.prepare("SELECT COUNT(*) as c FROM ioc_content_packages WHERE status = 'in-review'").get() as any).c;
  const total = (db.prepare('SELECT COUNT(*) as c FROM ioc_content_packages').get() as any).c;

  // Velocity: KPs published in last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const velocity = (db.prepare("SELECT COUNT(*) as c FROM ioc_content_packages WHERE status = 'published' AND published_at >= ?").get(weekAgo) as any).c;

  // By level
  const levelRows = db.prepare('SELECT level, COUNT(*) as c FROM ioc_content_packages GROUP BY level').all() as any[];
  const byLevel: Record<string, number> = {};
  for (const row of levelRows) byLevel[row.level] = row.c;

  // By stage
  const stageRows = db.prepare('SELECT stage, COUNT(*) as c FROM ioc_content_packages WHERE status != \'published\' GROUP BY stage').all() as any[];
  const byStage: Record<string, number> = {};
  for (const row of stageRows) byStage[row.stage] = row.c;

  // Media breakdown
  const articles = (db.prepare("SELECT COUNT(*) as c FROM ioc_media_assets WHERE type = 'article'").get() as any).c;
  const videos = (db.prepare("SELECT COUNT(*) as c FROM ioc_media_assets WHERE type = 'video'").get() as any).c;
  const carousels = (db.prepare("SELECT COUNT(*) as c FROM ioc_media_assets WHERE type = 'carousel'").get() as any).c;

  // Publishing queue
  const publishingQueue = (db.prepare("SELECT COUNT(*) as c FROM ioc_content_packages WHERE status = 'approved'").get() as any).c;

  // Community requests
  const communityRequests = countCommunityRequests();

  // Student feedback
  const studentFeedbackAvg = getAverageFeedback();

  // Upcoming releases (next 5 non-published KPs ordered by due date)
  const upcomingReleases = db.prepare("SELECT * FROM ioc_content_packages WHERE status != 'published' ORDER BY due_date ASC NULLS LAST, created_at ASC LIMIT 5").all().map(mapRowToKP);

  // Bottleneck detection: stage with most items
  const bottleneckRow = db.prepare("SELECT stage, COUNT(*) as c FROM ioc_content_packages WHERE status != 'published' GROUP BY stage ORDER BY c DESC LIMIT 1").get() as any;
  const bottleneck = bottleneckRow?.stage || 'none';

  // Mission progress
  const missionProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    inReview,
    velocity,
    byLevel,
    byStage,
    mediaBreakdown: { articles, videos, carousels },
    publishingQueue,
    communityRequests,
    studentFeedbackAvg,
    upcomingReleases,
    bottleneck,
    missionProgress,
  };
}

// ─── Helpers ────────────────────────────────────────────────

function mapRowToKP(row: any): ContentKnowledgePackage {
  return {
    id: row.id,
    title: row.title,
    level: row.level,
    domain: row.domain,
    status: row.status,
    stage: row.stage,
    assignee: row.assignee,
    dueDate: row.due_date,
    publishedAt: row.published_at,
    concepts: row.concepts,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
