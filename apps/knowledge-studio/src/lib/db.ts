import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const DB_DIR = join(process.cwd(), "data");
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const DB_PATH = join(DB_DIR, "knowledge-studio.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'editor',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_objects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      domain TEXT DEFAULT 'academics',
      subject TEXT,
      grade_level TEXT,
      description TEXT,
      source_type TEXT DEFAULT 'text',
      source_content TEXT,
      source_url TEXT,
      source_file TEXT,
      concepts TEXT DEFAULT '[]',
      definitions TEXT DEFAULT '[]',
      examples TEXT DEFAULT '[]',
      misconceptions TEXT DEFAULT '[]',
      exercises TEXT DEFAULT '[]',
      metadata TEXT DEFAULT '{}',
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      user_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS knowledge_packages (
      id TEXT PRIMARY KEY,
      version TEXT DEFAULT '1.0.0',
      status TEXT DEFAULT 'draft',
      title TEXT NOT NULL,
      description TEXT,
      domain TEXT,
      subject TEXT,
      grade_level TEXT,
      lesson TEXT,
      assessment TEXT,
      teacher_guide TEXT,
      workbook TEXT,
      visual_spec TEXT,
      video TEXT,
      website TEXT,
      publication_status TEXT DEFAULT 'draft',
      published_at TEXT,
      approved_by TEXT,
      immutable_hash TEXT,
      previous_version TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      user_id TEXT NOT NULL,
      ko_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (ko_id) REFERENCES knowledge_objects(id)
    );

    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      capability_id TEXT,
      skill_id TEXT,
      agent_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      ko_id TEXT,
      package_id TEXT,
      FOREIGN KEY (ko_id) REFERENCES knowledge_objects(id),
      FOREIGN KEY (package_id) REFERENCES knowledge_packages(id)
    );

    CREATE TABLE IF NOT EXISTS pipeline_executions (
      id TEXT PRIMARY KEY,
      goal TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      started_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      total_duration_ms INTEGER,
      error TEXT,
      node_results TEXT DEFAULT '[]',
      events TEXT DEFAULT '[]',
      metrics TEXT,
      trace TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      user_id TEXT NOT NULL,
      ko_id TEXT NOT NULL,
      package_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (ko_id) REFERENCES knowledge_objects(id),
      FOREIGN KEY (package_id) REFERENCES knowledge_packages(id)
    );

    CREATE INDEX IF NOT EXISTS idx_ko_user_id ON knowledge_objects(user_id);
    CREATE INDEX IF NOT EXISTS idx_ko_domain ON knowledge_objects(domain);
    CREATE INDEX IF NOT EXISTS idx_pkg_user_id ON knowledge_packages(user_id);
    CREATE INDEX IF NOT EXISTS idx_pkg_ko_id ON knowledge_packages(ko_id);
    CREATE INDEX IF NOT EXISTS idx_art_ko_id ON artifacts(ko_id);
    CREATE INDEX IF NOT EXISTS idx_art_pkg_id ON artifacts(package_id);
    CREATE INDEX IF NOT EXISTS idx_pipe_user_id ON pipeline_executions(user_id);
    CREATE INDEX IF NOT EXISTS idx_pipe_ko_id ON pipeline_executions(ko_id);
    CREATE INDEX IF NOT EXISTS idx_pipe_pkg_id ON pipeline_executions(package_id);
  `);
}

// ─── User operations ────────────────────────

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export function createUser(
  email: string,
  password: string,
  name?: string,
  role = "editor",
) {
  const db = getDb();
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  db.prepare(
    "INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)",
  ).run(id, email, name || null, password, role);
  return { id, email, name, role };
}

export function getUserByEmail(email: string): UserRow | undefined {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as
    UserRow | undefined;
}

export function getUserById(id: string): UserRow | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    UserRow | undefined;
}

// ─── Knowledge Object operations ────────────────────────

export interface KORow {
  id: string;
  title: string;
  domain: string;
  subject: string | null;
  grade_level: string | null;
  description: string | null;
  source_type: string;
  source_content: string | null;
  source_url: string | null;
  source_file: string | null;
  concepts: string;
  definitions: string;
  examples: string;
  misconceptions: string;
  exercises: string;
  metadata: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function createKO(data: {
  id: string;
  title: string;
  domain?: string;
  subject?: string;
  gradeLevel?: string;
  description?: string;
  sourceType?: string;
  sourceContent?: string;
  sourceUrl?: string;
  sourceFile?: string;
  concepts?: any[];
  definitions?: any[];
  examples?: any[];
  misconceptions?: any[];
  exercises?: any[];
  metadata?: any;
  userId: string;
}) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO knowledge_objects
    (id, title, domain, subject, grade_level, description, source_type,
     source_content, source_url, source_file, concepts, definitions,
     examples, misconceptions, exercises, metadata, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    data.id,
    data.title,
    data.domain || "academics",
    data.subject || null,
    data.gradeLevel || null,
    data.description || null,
    data.sourceType || "text",
    data.sourceContent || null,
    data.sourceUrl || null,
    data.sourceFile || null,
    JSON.stringify(data.concepts || []),
    JSON.stringify(data.definitions || []),
    JSON.stringify(data.examples || []),
    JSON.stringify(data.misconceptions || []),
    JSON.stringify(data.exercises || []),
    JSON.stringify(data.metadata || {}),
    data.userId,
  );
  return getKO(data.id)!;
}

export function getKO(id: string): (KORow & { parsed: any }) | null {
  const row = getDb()
    .prepare("SELECT * FROM knowledge_objects WHERE id = ?")
    .get(id) as KORow | undefined;
  if (!row) return null;
  return { ...row, parsed: parseKO(row) };
}

export function listKOs(
  userId?: string,
  limit = 50,
): (KORow & { parsed: any })[] {
  let query = "SELECT * FROM knowledge_objects";
  const params: any[] = [];
  if (userId) {
    query += " WHERE user_id = ?";
    params.push(userId);
  }
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);
  const rows = getDb()
    .prepare(query)
    .all(...params) as KORow[];
  return rows.map((r) => ({ ...r, parsed: parseKO(r) }));
}

export function updateKO(
  id: string,
  data: Partial<{
    title: string;
    domain: string;
    subject: string;
    gradeLevel: string;
    description: string;
    status: string;
    concepts: any[];
    definitions: any[];
    exercises: any[];
  }>,
) {
  const db = getDb();
  const sets: string[] = [];
  const vals: any[] = [];
  if (data.title) {
    sets.push("title = ?");
    vals.push(data.title);
  }
  if (data.domain) {
    sets.push("domain = ?");
    vals.push(data.domain);
  }
  if (data.subject) {
    sets.push("subject = ?");
    vals.push(data.subject);
  }
  if (data.gradeLevel) {
    sets.push("grade_level = ?");
    vals.push(data.gradeLevel);
  }
  if (data.description) {
    sets.push("description = ?");
    vals.push(data.description);
  }
  if (data.status) {
    sets.push("status = ?");
    vals.push(data.status);
  }
  if (data.concepts) {
    sets.push("concepts = ?");
    vals.push(JSON.stringify(data.concepts));
  }
  if (data.definitions) {
    sets.push("definitions = ?");
    vals.push(JSON.stringify(data.definitions));
  }
  if (data.exercises) {
    sets.push("exercises = ?");
    vals.push(JSON.stringify(data.exercises));
  }
  if (sets.length === 0) return getKO(id);
  sets.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(
    `UPDATE knowledge_objects SET ${sets.join(", ")} WHERE id = ?`,
  ).run(...vals);
  return getKO(id);
}

export function deleteKO(id: string) {
  const db = getDb();
  const deleteAll = db.transaction(() => {
    db.prepare("DELETE FROM artifacts WHERE ko_id = ?").run(id);
    db.prepare("DELETE FROM pipeline_executions WHERE ko_id = ?").run(id);
    db.prepare("DELETE FROM knowledge_packages WHERE ko_id = ?").run(id);
    db.prepare("DELETE FROM knowledge_objects WHERE id = ?").run(id);
  });
  deleteAll();
}

// ─── Package operations ────────────────────────

export interface PackageRow {
  id: string;
  version: string;
  status: string;
  title: string;
  description: string | null;
  domain: string | null;
  subject: string | null;
  grade_level: string | null;
  lesson: string | null;
  assessment: string | null;
  teacher_guide: string | null;
  workbook: string | null;
  visual_spec: string | null;
  video: string | null;
  website: string | null;
  publication_status: string | null;
  published_at: string | null;
  approved_by: string | null;
  immutable_hash: string | null;
  previous_version: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  ko_id: string;
}

export function createPackage(data: {
  id: string;
  title: string;
  koId: string;
  userId: string;
  description?: string;
  domain?: string;
  subject?: string;
  gradeLevel?: string;
}) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO knowledge_packages (id, title, ko_id, user_id, description, domain, subject, grade_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    data.id,
    data.title,
    data.koId,
    data.userId,
    data.description || null,
    data.domain || null,
    data.subject || null,
    data.gradeLevel || null,
  );
  return getPackage(data.id)!;
}

export function getPackage(id: string): (PackageRow & { parsed: any }) | null {
  const row = getDb()
    .prepare("SELECT * FROM knowledge_packages WHERE id = ?")
    .get(id) as PackageRow | undefined;
  if (!row) return null;
  return { ...row, parsed: parsePackage(row) };
}

export function listPackages(
  userId?: string,
  limit = 50,
): (PackageRow & { parsed: any })[] {
  let query = "SELECT * FROM knowledge_packages";
  const params: any[] = [];
  if (userId) {
    query += " WHERE user_id = ?";
    params.push(userId);
  }
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);
  const rows = getDb()
    .prepare(query)
    .all(...params) as PackageRow[];
  return rows.map((r) => ({ ...r, parsed: parsePackage(r) }));
}

export function updatePackage(
  id: string,
  data: Partial<{
    status: string;
    lesson: any;
    assessment: any;
    teacherGuide: any;
    workbook: any;
    visualSpec: any;
    video: any;
    website: any;
    publicationStatus: string;
    publishedAt: string;
    approvedBy: string;
    immutableHash: string;
    version: string;
  }>,
) {
  const db = getDb();
  const sets: string[] = [];
  const vals: any[] = [];
  if (data.status) {
    sets.push("status = ?");
    vals.push(data.status);
  }
  if (data.lesson) {
    sets.push("lesson = ?");
    vals.push(JSON.stringify(data.lesson));
  }
  if (data.assessment) {
    sets.push("assessment = ?");
    vals.push(JSON.stringify(data.assessment));
  }
  if (data.teacherGuide) {
    sets.push("teacher_guide = ?");
    vals.push(JSON.stringify(data.teacherGuide));
  }
  if (data.workbook) {
    sets.push("workbook = ?");
    vals.push(JSON.stringify(data.workbook));
  }
  if (data.visualSpec) {
    sets.push("visual_spec = ?");
    vals.push(JSON.stringify(data.visualSpec));
  }
  if (data.video) {
    sets.push("video = ?");
    vals.push(JSON.stringify(data.video));
  }
  if (data.website) {
    sets.push("website = ?");
    vals.push(JSON.stringify(data.website));
  }
  if (data.publicationStatus) {
    sets.push("publication_status = ?");
    vals.push(data.publicationStatus);
  }
  if (data.publishedAt) {
    sets.push("published_at = ?");
    vals.push(data.publishedAt);
  }
  if (data.approvedBy) {
    sets.push("approved_by = ?");
    vals.push(data.approvedBy);
  }
  if (data.immutableHash) {
    sets.push("immutable_hash = ?");
    vals.push(data.immutableHash);
  }
  if (data.version) {
    sets.push("version = ?");
    vals.push(data.version);
  }
  if (sets.length === 0) return getPackage(id);
  sets.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(
    `UPDATE knowledge_packages SET ${sets.join(", ")} WHERE id = ?`,
  ).run(...vals);
  return getPackage(id);
}

// ─── Artifact operations ────────────────────────

export function createArtifact(data: {
  id: string;
  type: string;
  data: any;
  capabilityId?: string;
  skillId?: string;
  agentId?: string;
  koId?: string;
  packageId?: string;
}) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO artifacts (id, type, data, capability_id, skill_id, agent_id, ko_id, package_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    data.id,
    data.type,
    JSON.stringify(data.data),
    data.capabilityId || null,
    data.skillId || null,
    data.agentId || null,
    data.koId || null,
    data.packageId || null,
  );
  return data;
}

export function listArtifacts(koId?: string, packageId?: string) {
  let query = "SELECT * FROM artifacts";
  const conditions: string[] = [];
  const params: any[] = [];
  if (koId) {
    conditions.push("ko_id = ?");
    params.push(koId);
  }
  if (packageId) {
    conditions.push("package_id = ?");
    params.push(packageId);
  }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";
  const rows = getDb()
    .prepare(query)
    .all(...params) as any[];
  return rows.map((r) => ({ ...r, data: JSON.parse(r.data) }));
}

// ─── Pipeline Execution operations ────────────────────────

export function createExecution(data: {
  id: string;
  goal: string;
  userId: string;
  koId: string;
  packageId?: string;
}) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO pipeline_executions (id, goal, user_id, ko_id, package_id)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(data.id, data.goal, data.userId, data.koId, data.packageId || null);
  return data;
}

export function updateExecution(
  id: string,
  data: Partial<{
    status: string;
    completedAt: string;
    totalDurationMs: number;
    error: string;
    nodeResults: any[];
    events: any[];
    metrics: any;
    trace: any[];
  }>,
) {
  const db = getDb();
  const sets: string[] = [];
  const vals: any[] = [];
  if (data.status) {
    sets.push("status = ?");
    vals.push(data.status);
  }
  if (data.completedAt) {
    sets.push("completed_at = ?");
    vals.push(data.completedAt);
  }
  if (data.totalDurationMs != null) {
    sets.push("total_duration_ms = ?");
    vals.push(data.totalDurationMs);
  }
  if (data.error) {
    sets.push("error = ?");
    vals.push(data.error);
  }
  if (data.nodeResults) {
    sets.push("node_results = ?");
    vals.push(JSON.stringify(data.nodeResults));
  }
  if (data.events) {
    sets.push("events = ?");
    vals.push(JSON.stringify(data.events));
  }
  if (data.metrics) {
    sets.push("metrics = ?");
    vals.push(JSON.stringify(data.metrics));
  }
  if (data.trace) {
    sets.push("trace = ?");
    vals.push(JSON.stringify(data.trace));
  }
  if (sets.length === 0) return;
  sets.push("updated_at = datetime('now')");
  vals.push(id);
  db.prepare(
    `UPDATE pipeline_executions SET ${sets.join(", ")} WHERE id = ?`,
  ).run(...vals);
}

export function getExecution(id: string) {
  const row = getDb()
    .prepare("SELECT * FROM pipeline_executions WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return {
    ...row,
    nodeResults: JSON.parse(row.node_results || "[]"),
    events: JSON.parse(row.events || "[]"),
    metrics: row.metrics ? JSON.parse(row.metrics) : null,
    trace: row.trace ? JSON.parse(row.trace) : null,
  };
}

// ─── Helpers ────────────────────────

function parseKO(row: KORow) {
  return {
    concepts: JSON.parse(row.concepts || "[]"),
    definitions: JSON.parse(row.definitions || "[]"),
    examples: JSON.parse(row.examples || "[]"),
    misconceptions: JSON.parse(row.misconceptions || "[]"),
    exercises: JSON.parse(row.exercises || "[]"),
    metadata: JSON.parse(row.metadata || "{}"),
  };
}

function parsePackage(row: PackageRow) {
  return {
    lesson: row.lesson ? JSON.parse(row.lesson) : null,
    assessment: row.assessment ? JSON.parse(row.assessment) : null,
    teacherGuide: row.teacher_guide ? JSON.parse(row.teacher_guide) : null,
    workbook: row.workbook ? JSON.parse(row.workbook) : null,
    visualSpec: row.visual_spec ? JSON.parse(row.visual_spec) : null,
    video: row.video ? JSON.parse(row.video) : null,
    website: row.website ? JSON.parse(row.website) : null,
  };
}
