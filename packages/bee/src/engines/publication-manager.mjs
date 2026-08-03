/**
 * Publication Manager — manages the lifecycle: draft → review → approved → published → archived.
 * Integrates with BEE for approval gates.
 */
export class PublicationManager {
  constructor() {
    this.transitions = {
      draft: ['in_review'],
      in_review: ['approved', 'rejected'],
      approved: ['published'],
      published: ['archived'],
      rejected: ['draft'],
      archived: [],
    };
  }

  /** Check if a state transition is valid */
  canTransition(from, to) {
    return this.transitions[from]?.includes(to) || false;
  }

  /** Submit package for review */
  submitForReview(pkg) {
    if (!this.canTransition(pkg.status, 'in_review')) {
      return { success: false, error: `Cannot move from '${pkg.status}' to 'in_review'` };
    }
    pkg.status = 'in_review';
    pkg.publication = { status: 'in_review', submittedAt: new Date().toISOString() };
    pkg.updatedAt = new Date().toISOString();
    return { success: true, status: pkg.status };
  }

  /** Approve a package — runs quality gates first */
  approve(pkg, approver = 'system') {
    if (!this.canTransition(pkg.status, 'approved')) {
      return { success: false, error: `Cannot move from '${pkg.status}' to 'approved'` };
    }
    const issues = this.runQualityGates(pkg);
    if (issues.length > 0) {
      return { success: false, error: 'Quality gates failed', issues };
    }
    pkg.status = 'approved';
    pkg.publication = {
      ...pkg.publication, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: approver,
    };
    pkg.updatedAt = new Date().toISOString();
    return { success: true, status: pkg.status };
  }

  /** Publish — freezes the package, generates immutable hash */
  publish(pkg) {
    if (!this.canTransition(pkg.status, 'published')) {
      return { success: false, error: `Cannot move from '${pkg.status}' to 'published'` };
    }
    const hash = this.#generateHash(pkg);
    pkg.status = 'published';
    pkg.publication = {
      ...pkg.publication, status: 'published', publishedAt: new Date().toISOString(), immutableHash: hash,
    };
    pkg.versionMeta = { createdAt: new Date().toISOString(), immutableHash: hash, previousVersion: pkg.version };
    pkg.updatedAt = new Date().toISOString();
    return { success: true, status: pkg.status, hash };
  }

  /** Reject — sends back to draft with reason */
  reject(pkg, reason = '') {
    if (!this.canTransition(pkg.status, 'rejected')) {
      return { success: false, error: `Cannot move from '${pkg.status}' to 'rejected'` };
    }
    pkg.status = 'rejected';
    pkg.publication = {
      ...pkg.publication, status: 'rejected', rejectedAt: new Date().toISOString(), reason,
    };
    pkg.updatedAt = new Date().toISOString();
    return { success: true, status: pkg.status };
  }

  /** Archive a published package */
  archive(pkg) {
    if (!this.canTransition(pkg.status, 'archived')) {
      return { success: false, error: `Cannot move from '${pkg.status}' to 'archived'` };
    }
    pkg.status = 'archived';
    pkg.publication = { ...pkg.publication, status: 'archived', archivedAt: new Date().toISOString() };
    pkg.updatedAt = new Date().toISOString();
    return { success: true, status: pkg.status };
  }

  /** Run quality gates — validates completeness of all artifacts */
  runQualityGates(pkg) {
    const issues = [];
    if (!pkg.title) issues.push({ gate: 'completeness', message: 'Package title is required' });
    if (!pkg.ko) issues.push({ gate: 'completeness', message: 'Knowledge Object is required' });
    if (!pkg.lesson) issues.push({ gate: 'completeness', message: 'Lesson is required' });
    if (!pkg.provenance?.length) issues.push({ gate: 'provenance', message: 'No provenance chain recorded' });
    if (pkg.provenance?.some(p => !p.capabilityId)) issues.push({ gate: 'provenance', message: 'Incomplete provenance entries' });
    return issues;
  }

  /** Get publication status report */
  getStatus(pkg) {
    return {
      id: pkg.id, status: pkg.status, title: pkg.title,
      publication: pkg.publication, version: pkg.version,
      qualityGates: this.runQualityGates(pkg),
    };
  }

  #generateHash(pkg) {
    const content = JSON.stringify({ id: pkg.id, version: pkg.version, lesson: pkg.lesson, assessment: pkg.assessment });
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
    }
    return `hash-${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }
}
