import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const PKG_DIR = join(process.cwd(), '..', '..', 'bhavya-ai-lab', 'knowledge-packages');

function ensureDir(dir) { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); }

/**
 * Knowledge Package — the unit of publishing, sharing, versioning, and federation.
 * Contains every artifact + metadata + provenance + execution trace.
 */
export class KnowledgePackage {
  constructor(data) {
    this.id = data.id || `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.version = data.version || '1.0.0';
    this.status = data.status || 'draft';
    this.title = data.title;
    this.description = data.description || '';
    this.domain = data.domain || 'academics';
    this.subject = data.subject || '';
    this.gradeLevel = data.gradeLevel || '';
    this.source = data.source || null;        // { type, content, url, ingestedAt }
    this.ko = data.ko || null;                // Knowledge Object
    this.lesson = data.lesson || null;
    this.assessment = data.assessment || null;
    this.teacherGuide = data.teacherGuide || null;
    this.workbook = data.workbook || null;
    this.visualSpec = data.visualSpec || null;
    this.video = data.video || null;
    this.website = data.website || null;      // { pages, html, mdx, nav, seo, sitemap, rss }
    this.publication = data.publication || null;  // { status, publishedAt, approvedBy, ... }
    this.versionMeta = data.versionMeta || null;  // { createdAt, immutableHash, previousVersion }
    this.provenance = data.provenance || [];  // [{ capabilityId, skillId, agentId, sourceKoId, executedAt }]
    this.executionTrace = data.executionTrace || [];  // [{ nodeId, capabilityId, status, durationMs }]
    this.metrics = data.metrics || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /** Save package to filesystem */
  save() {
    ensureDir(PKG_DIR);
    const filepath = join(PKG_DIR, `${this.id}.json`);
    writeFileSync(filepath, JSON.stringify(this.toJSON(), null, 2));
    return this;
  }

  /** Convert to plain object */
  toJSON() {
    return {
      id: this.id, version: this.version, status: this.status,
      title: this.title, description: this.description,
      domain: this.domain, subject: this.subject, gradeLevel: this.gradeLevel,
      source: this.source, ko: this.ko,
      lesson: this.lesson, assessment: this.assessment,
      teacherGuide: this.teacherGuide, workbook: this.workbook,
      visualSpec: this.visualSpec, video: this.video, website: this.website,
      publication: this.publication, versionMeta: this.versionMeta,
      provenance: this.provenance, executionTrace: this.executionTrace,
      metrics: this.metrics,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }

  /** Load package by ID */
  static load(id) {
    const filepath = join(PKG_DIR, `${id}.json`);
    if (!existsSync(filepath)) return null;
    return new KnowledgePackage(JSON.parse(readFileSync(filepath, 'utf-8')));
  }

  /** List all packages */
  static list(opts = {}) {
    if (!existsSync(PKG_DIR)) return [];
    let pkgs = readdirSync(PKG_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try { return new KnowledgePackage(JSON.parse(readFileSync(join(PKG_DIR, f), 'utf-8'))); }
        catch { return null; }
      })
      .filter(Boolean);

    if (opts.status) pkgs = pkgs.filter(p => p.status === opts.status);
    if (opts.domain) pkgs = pkgs.filter(p => p.domain === opts.domain);
    if (opts.limit) pkgs = pkgs.slice(-opts.limit);

    return pkgs;
  }

  /** Get full provenance chain */
  getProvenanceChain() {
    return this.provenance.map(p => ({
      capabilityId: p.capabilityId,
      skillId: p.skillId,
      agentId: p.agentId,
      sourceKoId: p.sourceKoId,
      executedAt: p.executedAt,
      durationMs: p.durationMs,
    }));
  }

  /** Get execution summary */
  getExecutionSummary() {
    const trace = this.executionTrace;
    return {
      totalNodes: trace.length,
      completed: trace.filter(t => t.status === 'completed').length,
      failed: trace.filter(t => t.status === 'failed').length,
      totalDurationMs: trace.reduce((sum, t) => sum + (t.durationMs || 0), 0),
      capabilities: [...new Set(trace.map(t => t.capabilityId))],
    };
  }
}
