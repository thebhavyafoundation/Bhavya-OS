import { writeFileSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');

function entity(kind, id, name, opts = {}) {
  return {
    id, name, kind,
    version: '0.1.0',
    status: opts.status || 'proposed',
    owner: opts.owner || 'bhavya-core',
    description: opts.description || '',
    domain: opts.domain || '',
    sourceAdr: 'ADR-006',
    dependsOn: opts.dependsOn || [],
    upstream: opts.upstream || [],
    downstream: opts.downstream || [],
    related: opts.related || [],
    implementation: { status: opts.impl || 'not-started', location: '', files: [] },
    tests: { status: 'none' },
    docs: { status: 'none' },
    release: '',
    automation: opts.automation || 'manual',
    tags: opts.tags || [],
    metadata: opts.metadata || {}
  };
}

// ═══════════════════════════════════════════════════
// EVENTS (85)
// ═══════════════════════════════════════════════════
const events = [
  // Knowledge events
  entity('event', 'EV-KM-001', 'ko.created', { domain: 'D05', description: 'New knowledge object created', related: ['D05-C01'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-002', 'ko.updated', { domain: 'D05', description: 'Knowledge object updated', related: ['D05-C01'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-003', 'ko.published', { domain: 'D05', description: 'Knowledge object published', related: ['D05-C01'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-004', 'ko.deleted', { domain: 'D05', description: 'Knowledge object deleted', related: ['D05-C01'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-005', 'ko.validated', { domain: 'D05', description: 'Knowledge object passed validation', related: ['D05-C05'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-006', 'ko.versioned', { domain: 'D05', description: 'New version created', related: ['D05-C06'], tags: ['knowledge'] }),
  entity('event', 'EV-KM-007', 'kg.edge-added', { domain: 'D05', description: 'New edge in knowledge graph', related: ['D05-C03'], tags: ['knowledge', 'graph'] }),
  entity('event', 'EV-KM-008', 'kg.edge-removed', { domain: 'D05', description: 'Edge removed from knowledge graph', related: ['D05-C03'], tags: ['knowledge', 'graph'] }),
  entity('event', 'EV-KM-009', 'kg.node-added', { domain: 'D05', description: 'New node in knowledge graph', related: ['D05-C03'], tags: ['knowledge', 'graph'] }),
  entity('event', 'EV-KM-010', 'ingestion.completed', { domain: 'D05', description: 'Knowledge ingestion batch completed', related: ['D05-C02'], tags: ['knowledge', 'ingestion'] }),

  // Education events
  entity('event', 'EV-EDU-001', 'lesson.generated', { domain: 'D03', description: 'Lesson generated from KO', related: ['D03-C02'], tags: ['education'] }),
  entity('event', 'EV-EDU-002', 'lesson.published', { domain: 'D03', description: 'Lesson published', related: ['D03-C02'], tags: ['education'] }),
  entity('event', 'EV-EDU-003', 'assessment.generated', { domain: 'D03', description: 'Assessment generated', related: ['D03-C04'], tags: ['education'] }),
  entity('event', 'EV-EDU-004', 'assessment.submitted', { domain: 'D03', description: 'Student submitted assessment', related: ['D03-C04'], tags: ['education'] }),
  entity('event', 'EV-EDU-005', 'assessment.graded', { domain: 'D03', description: 'Assessment graded', related: ['D03-C05'], tags: ['education'] }),
  entity('event', 'EV-EDU-006', 'grade.posted', { domain: 'D03', description: 'Grade posted to student record', related: ['D03-C05'], tags: ['education'] }),
  entity('event', 'EV-EDU-007', 'progress.updated', { domain: 'D03', description: 'Student progress updated', related: ['D03-C06'], tags: ['education'] }),
  entity('event', 'EV-EDU-008', 'curriculum.published', { domain: 'D03', description: 'Curriculum published', related: ['D03-C01'], tags: ['education'] }),
  entity('event', 'EV-EDU-009', 'certificate.issued', { domain: 'D03', description: 'Certificate issued', related: ['D03-C10'], tags: ['education'] }),
  entity('event', 'EV-EDU-010', 'enrollment.completed', { domain: 'D03', description: 'Student enrolled', related: ['D02-C01'], tags: ['education', 'admin'] }),

  // Media events
  entity('event', 'EV-MED-001', 'video.generated', { domain: 'D08', description: 'Video generated from visual spec', related: ['D08-C01'], tags: ['media'] }),
  entity('event', 'EV-MED-002', 'website.generated', { domain: 'D08', description: 'Website generated', related: ['D08-C03'], tags: ['media'] }),
  entity('event', 'EV-MED-003', 'slides.generated', { domain: 'D08', description: 'Presentation generated', related: ['D08-C04'], tags: ['media'] }),
  entity('event', 'EV-MED-004', 'content.published', { domain: 'D08', description: 'Content published to channel', related: ['D08-C05'], tags: ['media'] }),
  entity('event', 'EV-MED-005', 'content.distributed', { domain: 'D08', description: 'Content distributed to platforms', related: ['D08-C05'], tags: ['media'] }),

  // Operations events
  entity('event', 'EV-OPS-001', 'workflow.started', { domain: 'D14', description: 'Workflow execution started', related: ['D14-C03'], tags: ['operations'] }),
  entity('event', 'EV-OPS-002', 'workflow.completed', { domain: 'D14', description: 'Workflow execution completed', related: ['D14-C03'], tags: ['operations'] }),
  entity('event', 'EV-OPS-003', 'workflow.failed', { domain: 'D14', description: 'Workflow execution failed', related: ['D14-C03'], tags: ['operations'] }),
  entity('event', 'EV-OPS-004', 'task.created', { domain: 'D14', description: 'New task created', related: ['D14-C01'], tags: ['operations'] }),
  entity('event', 'EV-OPS-005', 'task.assigned', { domain: 'D14', description: 'Task assigned to agent', related: ['D14-C01'], tags: ['operations'] }),
  entity('event', 'EV-OPS-006', 'task.completed', { domain: 'D14', description: 'Task completed', related: ['D14-C01'], tags: ['operations'] }),
  entity('event', 'EV-OPS-007', 'incident.detected', { domain: 'D14', description: 'Operational incident detected', related: ['D14-C06'], tags: ['operations'] }),
  entity('event', 'EV-OPS-008', 'incident.resolved', { domain: 'D14', description: 'Incident resolved', related: ['D14-C06'], tags: ['operations'] }),
  entity('event', 'EV-OPS-009', 'sla.breached', { domain: 'D14', description: 'SLA breach detected', related: ['D14-C05'], tags: ['operations'] }),
  entity('event', 'EV-OPS-010', 'change.deployed', { domain: 'D14', description: 'Change deployed to production', related: ['D14-C07'], tags: ['operations'] }),

  // Finance events
  entity('event', 'EV-FIN-001', 'budget.created', { domain: 'D11', description: 'New budget created', related: ['D11-C01'], tags: ['finance'] }),
  entity('event', 'EV-FIN-002', 'budget.approved', { domain: 'D11', description: 'Budget approved', related: ['D11-C01'], tags: ['finance'] }),
  entity('event', 'EV-FIN-003', 'expense.recorded', { domain: 'D11', description: 'Expense recorded', related: ['D11-C04'], tags: ['finance'] }),
  entity('event', 'EV-FIN-004', 'payment.processed', { domain: 'D11', description: 'Payment processed', related: ['D11-C04'], tags: ['finance'] }),
  entity('event', 'EV-FIN-005', 'invoice.received', { domain: 'D11', description: 'Invoice received', related: ['D11-C04'], tags: ['finance'] }),
  entity('event', 'EV-FIN-006', 'payroll.processed', { domain: 'D11', description: 'Payroll processed', related: ['D11-C07'], tags: ['finance'] }),
  entity('event', 'EV-FIN-007', 'grant.received', { domain: 'D11', description: 'Grant funds received', related: ['D11-C06'], tags: ['finance'] }),
  entity('event', 'EV-FIN-008', 'financial-report.generated', { domain: 'D11', description: 'Financial report generated', related: ['D11-C03'], tags: ['finance'] }),
  entity('event', 'EV-FIN-009', 'donation.received', { domain: 'D11', description: 'Donation received', related: ['D11-C05'], tags: ['finance'] }),

  // Compliance events
  entity('event', 'EV-COM-001', 'audit.started', { domain: 'D13', description: 'Audit started', related: ['D13-C01'], tags: ['compliance'] }),
  entity('event', 'EV-COM-002', 'audit.completed', { domain: 'D13', description: 'Audit completed', related: ['D13-C01'], tags: ['compliance'] }),
  entity('event', 'EV-COM-003', 'violation.detected', { domain: 'D13', description: 'Compliance violation detected', related: ['D13-C08'], tags: ['compliance'] }),
  entity('event', 'EV-COM-004', 'violation.resolved', { domain: 'D13', description: 'Violation resolved', related: ['D13-C08'], tags: ['compliance'] }),
  entity('event', 'EV-COM-005', 'policy.updated', { domain: 'D13', description: 'Policy updated', related: ['D01-C02'], tags: ['compliance', 'governance'] }),
  entity('event', 'EV-COM-006', 'compliance-report.generated', { domain: 'D13', description: 'Compliance report generated', related: ['D13-C03'], tags: ['compliance'] }),

  // Admin events
  entity('event', 'EV-ADM-001', 'student.admitted', { domain: 'D02', description: 'Student admitted', related: ['D02-C01'], tags: ['admin'] }),
  entity('event', 'EV-ADM-002', 'student.enrolled', { domain: 'D02', description: 'Student enrolled in program', related: ['D02-C01'], tags: ['admin'] }),
  entity('event', 'EV-ADM-003', 'staff.hired', { domain: 'D02', description: 'Staff member hired', related: ['D02-C03'], tags: ['admin'] }),
  entity('event', 'EV-ADM-004', 'attendance.recorded', { domain: 'D02', description: 'Attendance recorded', related: ['D02-C04'], tags: ['admin'] }),
  entity('event', 'EV-ADM-005', 'announcement.published', { domain: 'D02', description: 'Announcement published', related: ['D02-C05'], tags: ['admin'] }),
  entity('event', 'EV-ADM-006', 'event.created', { domain: 'D02', description: 'Event created', related: ['D02-C06'], tags: ['admin'] }),

  // Engineering events
  entity('event', 'EV-ENG-001', 'deploy.started', { domain: 'D17', description: 'Deployment started', related: ['D17-C06'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-002', 'deploy.completed', { domain: 'D17', description: 'Deployment completed', related: ['D17-C06'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-003', 'deploy.failed', { domain: 'D17', description: 'Deployment failed', related: ['D17-C06'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-004', 'build.succeeded', { domain: 'D17', description: 'Build succeeded', related: ['D17-C06'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-005', 'build.failed', { domain: 'D17', description: 'Build failed', related: ['D17-C06'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-006', 'test.passed', { domain: 'D17', description: 'All tests passed', related: ['D17-C01'], tags: ['engineering'] }),
  entity('event', 'EV-ENG-007', 'test.failed', { domain: 'D17', description: 'Tests failed', related: ['D17-C01'], tags: ['engineering'] }),

  // AI events
  entity('event', 'EV-AI-001', 'model.trained', { domain: 'D16', description: 'AI model training completed', related: ['D16-C01'], tags: ['ai'] }),
  entity('event', 'EV-AI-002', 'model.deployed', { domain: 'D16', description: 'AI model deployed', related: ['D16-C01'], tags: ['ai'] }),
  entity('event', 'EV-AI-003', 'content.generated', { domain: 'D16', description: 'AI generated content', related: ['D16-C02'], tags: ['ai'] }),
  entity('event', 'EV-AI-004', 'recommendation.made', { domain: 'D16', description: 'Recommendation generated', related: ['D16-C04'], tags: ['ai'] }),
  entity('event', 'EV-AI-005', 'rag.query', { domain: 'D16', description: 'RAG query executed', related: ['D16-C02'], tags: ['ai'] }),

  // Community events
  entity('event', 'EV-CMT-001', 'member.joined', { domain: 'D09', description: 'Community member joined', related: ['D09-C01'], tags: ['community'] }),
  entity('event', 'EV-CMT-002', 'post.created', { domain: 'D09', description: 'Community post created', related: ['D09-C02'], tags: ['community'] }),
  entity('event', 'EV-CMT-003', 'comment.added', { domain: 'D09', description: 'Comment added', related: ['D09-C02'], tags: ['community'] }),
  entity('event', 'EV-CMT-004', 'feedback.submitted', { domain: 'D09', description: 'Feedback submitted', related: ['D09-C05'], tags: ['community'] }),

  // Volunteer events
  entity('event', 'EV-VOL-001', 'volunteer.applied', { domain: 'D10', description: 'Volunteer application received', related: ['D10-C01'], tags: ['volunteers'] }),
  entity('event', 'EV-VOL-002', 'volunteer.approved', { domain: 'D10', description: 'Volunteer approved', related: ['D10-C01'], tags: ['volunteers'] }),
  entity('event', 'EV-VOL-003', 'hours.logged', { domain: 'D10', description: 'Volunteer hours logged', related: ['D10-C06'], tags: ['volunteers'] }),
  entity('event', 'EV-VOL-004', 'task.completed', { domain: 'D10', description: 'Volunteer task completed', related: ['D10-C03'], tags: ['volunteers'] }),

  // Governance events
  entity('event', 'EV-GOV-001', 'policy.enacted', { domain: 'D01', description: 'Policy enacted', related: ['D01-C02'], tags: ['governance'] }),
  entity('event', 'EV-GOV-002', 'decision.recorded', { domain: 'D01', description: 'Decision recorded', related: ['D01-C04'], tags: ['governance'] }),
  entity('event', 'EV-GOV-003', 'board-meeting.completed', { domain: 'D01', description: 'Board meeting completed', related: ['D01-C03'], tags: ['governance'] }),

  // Research events
  entity('event', 'EV-RES-001', 'proposal.submitted', { domain: 'D04', description: 'Research proposal submitted', related: ['D04-C01'], tags: ['research'] }),
  entity('event', 'EV-RES-002', 'proposal.approved', { domain: 'D04', description: 'Research proposal approved', related: ['D04-C01'], tags: ['research'] }),
  entity('event', 'EV-RES-003', 'paper.submitted', { domain: 'D04', description: 'Paper submitted for review', related: ['D04-C07'], tags: ['research'] }),
  entity('event', 'EV-RES-004', 'paper.published', { domain: 'D04', description: 'Paper published', related: ['D07-C03'], tags: ['research'] }),

  // Analytics events
  entity('event', 'EV-ANL-001', 'metric.recorded', { domain: 'D18', description: 'Metric recorded', related: ['D18-C01'], tags: ['analytics'] }),
  entity('event', 'EV-ANL-002', 'dashboard.refreshed', { domain: 'D18', description: 'Dashboard data refreshed', related: ['D18-C03'], tags: ['analytics'] }),
  entity('event', 'EV-ANL-003', 'report.generated', { domain: 'D18', description: 'Analytics report generated', related: ['D18-C05'], tags: ['analytics'] }),

  // Infrastructure events
  entity('event', 'EV-INF-001', 'alert.triggered', { domain: 'D15', description: 'Infrastructure alert triggered', related: ['D15-C04'], tags: ['infrastructure'] }),
  entity('event', 'EV-INF-002', 'alert.resolved', { domain: 'D15', description: 'Alert resolved', related: ['D15-C04'], tags: ['infrastructure'] }),
  entity('event', 'EV-INF-003', 'backup.completed', { domain: 'D15', description: 'Backup completed', related: ['D15-C03'], tags: ['infrastructure'] }),
  entity('event', 'EV-INF-004', 'scaling.triggered', { domain: 'D15', description: 'Auto-scaling triggered', related: ['D15-C05'], tags: ['infrastructure'] }),
];

// ═══════════════════════════════════════════════════
// PERMISSIONS (120)
// ═══════════════════════════════════════════════════
const permGroups = [
  { prefix: 'knowledge', domain: 'D05', perms: ['read', 'create', 'update', 'delete', 'publish', 'validate', 'ingest', 'graph.manage', 'search', 'version'] },
  { prefix: 'lesson', domain: 'D03', perms: ['read', 'create', 'update', 'delete', 'publish', 'generate', 'assign', 'grade'] },
  { prefix: 'assessment', domain: 'D03', perms: ['read', 'create', 'update', 'delete', 'publish', 'submit', 'grade', 'review'] },
  { prefix: 'curriculum', domain: 'D03', perms: ['read', 'create', 'update', 'delete', 'publish', 'approve'] },
  { prefix: 'student', domain: 'D02', perms: ['read', 'create', 'update', 'delete', 'enroll', 'transfer', 'graduate', 'suspend'] },
  { prefix: 'staff', domain: 'D02', perms: ['read', 'create', 'update', 'delete', 'hire', 'terminate', 'promote'] },
  { prefix: 'finance', domain: 'D11', perms: ['read', 'create', 'update', 'delete', 'approve', 'reject', 'export'] },
  { prefix: 'budget', domain: 'D11', perms: ['read', 'create', 'update', 'delete', 'approve'] },
  { prefix: 'grant', domain: 'D04', perms: ['read', 'create', 'update', 'delete', 'apply', 'report'] },
  { prefix: 'compliance', domain: 'D13', perms: ['read', 'create', 'update', 'delete', 'audit', 'report', 'enforce'] },
  { prefix: 'media', domain: 'D08', perms: ['read', 'create', 'update', 'delete', 'publish', 'distribute'] },
  { prefix: 'community', domain: 'D09', perms: ['read', 'create', 'update', 'delete', 'moderate', 'ban'] },
  { prefix: 'volunteer', domain: 'D10', perms: ['read', 'create', 'update', 'delete', 'approve', 'assign', 'log-hours'] },
  { prefix: 'contract', domain: 'D12', perms: ['read', 'create', 'update', 'delete', 'approve', 'sign', 'renew'] },
  { prefix: 'report', domain: 'D18', perms: ['read', 'create', 'export', 'schedule'] },
  { prefix: 'system', domain: 'D17', perms: ['admin', 'deploy', 'configure', 'monitor', 'backup', 'restore'] },
  { prefix: 'user', domain: 'D17', perms: ['read', 'create', 'update', 'delete', 'suspend', 'role.assign'] },
  { prefix: 'research', domain: 'D04', perms: ['read', 'create', 'update', 'delete', 'submit', 'approve'] },
  { prefix: 'publication', domain: 'D07', perms: ['read', 'create', 'update', 'delete', 'publish', 'review'] },
  { prefix: 'partner', domain: 'D20', perms: ['read', 'create', 'update', 'delete', 'activate'] },
];

const permissions = [];
for (const g of permGroups) {
  for (const p of g.perms) {
    permissions.push(entity('permission', `PM-${g.prefix.toUpperCase().slice(0,4)}-${p.toUpperCase().replace(/\./g,'-').slice(0,8)}`, `${g.prefix}.${p}`, {
      domain: g.domain,
      description: `${p} ${g.prefix}`,
      tags: ['permission', g.prefix],
      metadata: { group: g.prefix, action: p }
    }));
  }
}

// ═══════════════════════════════════════════════════
// KNOWLEDGE OBJECT TYPES
// ═══════════════════════════════════════════════════
const koTypes = [
  entity('knowledge-object', 'KO-LESSON', 'Lesson KO', { domain: 'D03', description: 'Lesson content knowledge object', related: ['D03-C02'], impl: 'implemented', tags: ['ko', 'lesson'] }),
  entity('knowledge-object', 'KO-CONCEPT', 'Concept KO', { domain: 'D05', description: 'Conceptual knowledge object', related: ['D05-C01'], impl: 'implemented', tags: ['ko', 'concept'] }),
  entity('knowledge-object', 'KO-ASSESSMENT', 'Assessment KO', { domain: 'D03', description: 'Assessment knowledge object', related: ['D03-C04'], impl: 'implemented', tags: ['ko', 'assessment'] }),
  entity('knowledge-object', 'KO-CURRICULUM', 'Curriculum KO', { domain: 'D03', description: 'Curriculum structure KO', related: ['D03-C01'], tags: ['ko', 'curriculum'] }),
  entity('knowledge-object', 'KO-EXERCISE', 'Exercise KO', { domain: 'D03', description: 'Practice exercise KO', related: ['D03-C02'], tags: ['ko', 'exercise'] }),
  entity('knowledge-object', 'KO-EXAMPLE', 'Example KO', { domain: 'D05', description: 'Illustrative example KO', related: ['D05-C01'], tags: ['ko', 'example'] }),
  entity('knowledge-object', 'KO-VOCABULARY', 'Vocabulary KO', { domain: 'D05', description: 'Term definition KO', related: ['D05-C01'], tags: ['ko', 'vocabulary'] }),
  entity('knowledge-object', 'KO-MISCONCEPTION', 'Misconception KO', { domain: 'D03', description: 'Common misconception KO', related: ['D03-C02'], tags: ['ko', 'misconception'] }),
  entity('knowledge-object', 'KO-RESEARCH', 'Research KO', { domain: 'D04', description: 'Research finding KO', related: ['D04-C03'], tags: ['ko', 'research'] }),
  entity('knowledge-object', 'KO-POLICY', 'Policy KO', { domain: 'D01', description: 'Institutional policy KO', related: ['D01-C02'], tags: ['ko', 'policy'] }),
  entity('knowledge-object', 'KO-FINANCIAL', 'Financial KO', { domain: 'D11', description: 'Financial record KO', related: ['D11-C03'], tags: ['ko', 'financial'] }),
  entity('knowledge-object', 'KO-COMPLIANCE', 'Compliance KO', { domain: 'D13', description: 'Compliance record KO', related: ['D13-C01'], tags: ['ko', 'compliance'] }),
  entity('knowledge-object', 'KO-LEGAL', 'Legal KO', { domain: 'D12', description: 'Legal document KO', related: ['D12-C01'], tags: ['ko', 'legal'] }),
  entity('knowledge-object', 'KO-MEDIA', 'Media KO', { domain: 'D08', description: 'Media asset KO', related: ['D08-C02'], tags: ['ko', 'media'] }),
  entity('knowledge-object', 'KO-STUDENT', 'Student KO', { domain: 'D02', description: 'Student record KO', related: ['D02-C02'], tags: ['ko', 'student'] }),
  entity('knowledge-object', 'KO-STAFF', 'Staff KO', { domain: 'D02', description: 'Staff record KO', related: ['D02-C03'], tags: ['ko', 'staff'] }),
  entity('knowledge-object', 'KO-EVENT', 'Event KO', { domain: 'D02', description: 'Event record KO', related: ['D02-C06'], tags: ['ko', 'event'] }),
  entity('knowledge-object', 'KO-GRANT', 'Grant KO', { domain: 'D04', description: 'Grant record KO', related: ['D04-C02'], tags: ['ko', 'grant'] }),
  entity('knowledge-object', 'KO-CONTRACT', 'Contract KO', { domain: 'D12', description: 'Contract KO', related: ['D12-C01'], tags: ['ko', 'contract'] }),
  entity('knowledge-object', 'KO-REPORT', 'Report KO', { domain: 'D18', description: 'Analytics report KO', related: ['D18-C05'], tags: ['ko', 'report'] }),
];

// ═══════════════════════════════════════════════════
// UI SURFACES (100)
// ═══════════════════════════════════════════════════
const uiSurfaces = [
  // Bhavya AI Lab pages
  entity('ui-surface', 'UI-LAB-001', 'Knowledge Browser', { domain: 'D05', description: 'Browse and search knowledge objects', related: ['D05-C01', 'D05-C04'], impl: 'implemented', tags: ['app:lab', 'knowledge'] }),
  entity('ui-surface', 'UI-LAB-002', 'KO Editor', { domain: 'D05', description: 'Edit knowledge object details', related: ['D05-C01'], impl: 'implemented', tags: ['app:lab', 'knowledge'] }),
  entity('ui-surface', 'UI-LAB-003', 'Lesson Builder', { domain: 'D03', description: 'Build lessons from KOs', related: ['D03-C02'], impl: 'implemented', tags: ['app:lab', 'education'] }),
  entity('ui-surface', 'UI-LAB-004', 'Assessment Builder', { domain: 'D03', description: 'Create assessments', related: ['D03-C04'], impl: 'implemented', tags: ['app:lab', 'education'] }),
  entity('ui-surface', 'UI-LAB-005', 'Pipeline Monitor', { domain: 'D17', description: 'Monitor pipeline execution', related: ['D17-C01'], impl: 'implemented', tags: ['app:lab', 'engineering'] }),
  entity('ui-surface', 'UI-LAB-006', 'Quality Gates View', { domain: 'D17', description: 'View quality gate results', related: ['D17-C01'], impl: 'implemented', tags: ['app:lab', 'engineering'] }),
  entity('ui-surface', 'UI-LAB-007', 'Provenance Timeline', { domain: 'D05', description: 'View artifact lineage', related: ['D05-C09'], impl: 'implemented', tags: ['app:lab', 'knowledge'] }),
  entity('ui-surface', 'UI-LAB-008', 'Video Preview', { domain: 'D08', description: 'Preview generated video', related: ['D08-C01'], impl: 'implemented', tags: ['app:lab', 'media'] }),
  entity('ui-surface', 'UI-LAB-009', 'Website Preview', { domain: 'D08', description: 'Preview generated website', related: ['D08-C03'], impl: 'implemented', tags: ['app:lab', 'media'] }),
  entity('ui-surface', 'UI-LAB-010', 'Visual Spec Editor', { domain: 'D08', description: 'Edit visual specifications', related: ['D08-C02'], impl: 'implemented', tags: ['app:lab', 'media'] }),
  entity('ui-surface', 'UI-LAB-011', 'Command Palette', { domain: 'D17', description: '⌘K command palette', related: ['D17-C01'], impl: 'implemented', tags: ['app:lab', 'navigation'] }),
  entity('ui-surface', 'UI-LAB-012', 'Sidebar Navigation', { domain: 'D17', description: 'OS-like sidebar', related: ['D17-C01'], impl: 'implemented', tags: ['app:lab', 'navigation'] }),
  entity('ui-surface', 'UI-LAB-013', 'Dashboard Home', { domain: 'D17', description: 'Main dashboard page', related: ['D17-C01'], impl: 'implemented', tags: ['app:lab', 'home'] }),
  entity('ui-surface', 'UI-LAB-014', 'Settings Panel', { domain: 'D17', description: 'Application settings', related: ['D17-C01'], tags: ['app:lab', 'settings'] }),

  // Dashboard pages
  entity('ui-surface', 'UI-DASH-001', 'Analytics Dashboard', { domain: 'D18', description: 'Main analytics view', related: ['D18-C03'], tags: ['app:dashboard', 'analytics'] }),
  entity('ui-surface', 'UI-DASH-002', 'Real-time Metrics', { domain: 'D18', description: 'Live system metrics', related: ['D18-C07'], tags: ['app:dashboard', 'analytics'] }),
  entity('ui-surface', 'UI-DASH-003', 'System Health', { domain: 'D15', description: 'Infrastructure health', related: ['D15-C04'], tags: ['app:dashboard', 'infrastructure'] }),
  entity('ui-surface', 'UI-DASH-004', 'Deployment Status', { domain: 'D17', description: 'Deployment pipeline status', related: ['D17-C06'], tags: ['app:dashboard', 'engineering'] }),
  entity('ui-surface', 'UI-DASH-005', 'Error Tracker', { domain: 'D17', description: 'Error monitoring', related: ['D14-C06'], tags: ['app:dashboard', 'operations'] }),

  // Knowledge Portal pages
  entity('ui-surface', 'UI-KP-001', 'Knowledge Explorer', { domain: 'D05', description: 'Explore knowledge graph', related: ['D05-C03'], tags: ['app:kp', 'knowledge'] }),
  entity('ui-surface', 'UI-KP-002', 'Search Results', { domain: 'D05', description: 'Search results page', related: ['D05-C04'], tags: ['app:kp', 'knowledge'] }),
  entity('ui-surface', 'UI-KP-003', 'KO Detail View', { domain: 'D05', description: 'Detailed KO view', related: ['D05-C01'], tags: ['app:kp', 'knowledge'] }),
  entity('ui-surface', 'UI-KP-004', 'Knowledge Collections', { domain: 'D05', description: 'Curated knowledge collections', related: ['D05-C07'], tags: ['app:kp', 'knowledge'] }),

  // Admin Console pages
  entity('ui-surface', 'UI-ADM-001', 'Student Management', { domain: 'D02', description: 'Manage students', related: ['D02-C02'], tags: ['app:admin', 'admin'] }),
  entity('ui-surface', 'UI-ADM-002', 'Staff Management', { domain: 'D02', description: 'Manage staff', related: ['D02-C03'], tags: ['app:admin', 'admin'] }),
  entity('ui-surface', 'UI-ADM-003', 'Attendance Dashboard', { domain: 'D02', description: 'View attendance', related: ['D02-C04'], tags: ['app:admin', 'admin'] }),
  entity('ui-surface', 'UI-ADM-004', 'Event Calendar', { domain: 'D02', description: 'Institutional calendar', related: ['D02-C06'], tags: ['app:admin', 'admin'] }),
  entity('ui-surface', 'UI-ADM-005', 'Document Manager', { domain: 'D02', description: 'Manage documents', related: ['D02-C09'], tags: ['app:admin', 'admin'] }),
  entity('ui-surface', 'UI-ADM-006', 'Report Generator', { domain: 'D02', description: 'Generate reports', related: ['D02-C10'], tags: ['app:admin', 'admin'] }),

  // Finance Portal pages
  entity('ui-surface', 'UI-FIN-001', 'Budget Overview', { domain: 'D11', description: 'Budget dashboard', related: ['D11-C01'], tags: ['app:finance', 'finance'] }),
  entity('ui-surface', 'UI-FIN-002', 'Expense Tracker', { domain: 'D11', description: 'Track expenses', related: ['D11-C04'], tags: ['app:finance', 'finance'] }),
  entity('ui-surface', 'UI-FIN-003', 'Invoice Manager', { domain: 'D11', description: 'Manage invoices', related: ['D11-C04'], tags: ['app:finance', 'finance'] }),
  entity('ui-surface', 'UI-FIN-004', 'Payroll View', { domain: 'D11', description: 'View payroll', related: ['D11-C07'], tags: ['app:finance', 'finance'] }),
  entity('ui-surface', 'UI-FIN-005', 'Financial Reports', { domain: 'D11', description: 'Financial reporting', related: ['D11-C03'], tags: ['app:finance', 'finance'] }),
  entity('ui-surface', 'UI-FIN-006', 'Grant Tracker', { domain: 'D11', description: 'Track grants', related: ['D11-C06'], tags: ['app:finance', 'finance'] }),

  // Community Hub pages
  entity('ui-surface', 'UI-CMT-001', 'Community Feed', { domain: 'D09', description: 'Community posts feed', related: ['D09-C02'], tags: ['app:community', 'community'] }),
  entity('ui-surface', 'UI-CMT-002', 'Events Board', { domain: 'D09', description: 'Community events', related: ['D09-C03'], tags: ['app:community', 'community'] }),
  entity('ui-surface', 'UI-CMT-003', 'Mentorship Hub', { domain: 'D09', description: 'Mentorship matching', related: ['D09-C04'], tags: ['app:community', 'community'] }),
  entity('ui-surface', 'UI-CMT-004', 'Showcase Gallery', { domain: 'D09', description: 'Community showcase', related: ['D09-C06'], tags: ['app:community', 'community'] }),
  entity('ui-surface', 'UI-CMT-005', 'Feedback Portal', { domain: 'D09', description: 'Submit feedback', related: ['D09-C05'], tags: ['app:community', 'community'] }),

  // Research Portal pages
  entity('ui-surface', 'UI-RES-001', 'Research Programs', { domain: 'D04', description: 'View research programs', related: ['D04-C01'], tags: ['app:research', 'research'] }),
  entity('ui-surface', 'UI-RES-002', 'Grant Applications', { domain: 'D04', description: 'Manage grant applications', related: ['D04-C02'], tags: ['app:research', 'research'] }),
  entity('ui-surface', 'UI-RES-003', 'Research Data', { domain: 'D04', description: 'View research data', related: ['D04-C03'], tags: ['app:research', 'research'] }),
  entity('ui-surface', 'UI-RES-004', 'Publication Pipeline', { domain: 'D04', description: 'Track publications', related: ['D04-C07'], tags: ['app:research', 'research'] }),

  // Compliance Dashboard pages
  entity('ui-surface', 'UI-CMP-001', 'Compliance Overview', { domain: 'D13', description: 'Compliance status', related: ['D13-C01'], tags: ['app:compliance', 'compliance'] }),
  entity('ui-surface', 'UI-CMP-002', 'Audit Trail Viewer', { domain: 'D13', description: 'View audit trail', related: ['D13-C02'], tags: ['app:compliance', 'compliance'] }),
  entity('ui-surface', 'UI-CMP-003', 'Violation Tracker', { domain: 'D13', description: 'Track violations', related: ['D13-C08'], tags: ['app:compliance', 'compliance'] }),
  entity('ui-surface', 'UI-CMP-004', 'Policy Manager', { domain: 'D01', description: 'Manage policies', related: ['D01-C02'], tags: ['app:compliance', 'governance'] }),

  // Transparency Portal pages
  entity('ui-surface', 'UI-TRN-001', 'Public Reports', { domain: 'D01', description: 'Public transparency reports', related: ['D01-C08'], tags: ['app:transparency', 'governance'] }),
  entity('ui-surface', 'UI-TRN-002', 'Impact Metrics', { domain: 'D21', description: 'Impact measurement', related: ['D21-C01'], tags: ['app:transparency', 'sustainability'] }),
  entity('ui-surface', 'UI-TRN-003', 'Financial Disclosure', { domain: 'D11', description: 'Public financial data', related: ['D11-C03'], tags: ['app:transparency', 'finance'] }),

  // Volunteer Portal pages
  entity('ui-surface', 'UI-VOL-001', 'Volunteer Dashboard', { domain: 'D10', description: 'Volunteer self-service', related: ['D10-C07'], tags: ['app:volunteer', 'volunteers'] }),
  entity('ui-surface', 'UI-VOL-002', 'Task Board', { domain: 'D10', description: 'Volunteer tasks', related: ['D10-C03'], tags: ['app:volunteer', 'volunteers'] }),
  entity('ui-surface', 'UI-VOL-003', 'Hours Log', { domain: 'D10', description: 'Log volunteer hours', related: ['D10-C06'], tags: ['app:volunteer', 'volunteers'] }),
  entity('ui-surface', 'UI-VOL-004', 'Training Hub', { domain: 'D10', description: 'Volunteer training', related: ['D10-C04'], tags: ['app:volunteer', 'volunteers'] }),

  // Library Portal pages
  entity('ui-surface', 'UI-LIB-001', 'Catalog Browser', { domain: 'D06', description: 'Browse library catalog', related: ['D06-C01'], tags: ['app:library', 'library'] }),
  entity('ui-surface', 'UI-LIB-002', 'Digital Lending', { domain: 'D06', description: 'Borrow digital resources', related: ['D06-C02'], tags: ['app:library', 'library'] }),
  entity('ui-surface', 'UI-LIB-003', 'Citation Manager', { domain: 'D06', description: 'Manage citations', related: ['D06-C06'], tags: ['app:library', 'library'] }),

  // Heritage Portal pages
  entity('ui-surface', 'UI-HER-001', 'Heritage Gallery', { domain: 'D21', description: 'Cultural heritage showcase', related: ['D21-C02'], tags: ['app:heritage', 'heritage'] }),
  entity('ui-surface', 'UI-HER-002', 'Impact Stories', { domain: 'D19', description: 'Success stories', related: ['D19-C06'], tags: ['app:heritage', 'outreach'] }),

  // Monitoring Console pages
  entity('ui-surface', 'UI-MON-001', 'System Metrics', { domain: 'D15', description: 'Infrastructure metrics', related: ['D15-C04'], tags: ['app:monitoring', 'infrastructure'] }),
  entity('ui-surface', 'UI-MON-002', 'Alert Dashboard', { domain: 'D15', description: 'View alerts', related: ['D15-C04'], tags: ['app:monitoring', 'infrastructure'] }),
  entity('ui-surface', 'UI-MON-003', 'Cost Dashboard', { domain: 'D15', description: 'Infrastructure costs', related: ['D15-C07'], tags: ['app:monitoring', 'infrastructure'] }),

  // Documentation pages
  entity('ui-surface', 'UI-DOC-001', 'API Reference', { domain: 'D17', description: 'API documentation', related: ['D17-C07'], tags: ['app:docs', 'engineering'] }),
  entity('ui-surface', 'UI-DOC-002', 'Architecture Docs', { domain: 'D17', description: 'Architecture documentation', related: ['D17-C01'], tags: ['app:docs', 'engineering'] }),
  entity('ui-surface', 'UI-DOC-003', 'User Guides', { domain: 'D17', description: 'User documentation', related: ['D17-C01'], tags: ['app:docs', 'engineering'] }),

  // Design System pages
  entity('ui-surface', 'UI-DS-001', 'Component Library', { domain: 'D08', description: 'UI components', related: ['D08-C09'], tags: ['app:ds', 'design'] }),
  entity('ui-surface', 'UI-DS-002', 'Token Reference', { domain: 'D08', description: 'Design tokens', related: ['D08-C09'], tags: ['app:ds', 'design'] }),
  entity('ui-surface', 'UI-DS-003', 'Pattern Gallery', { domain: 'D08', description: 'UI patterns', related: ['D08-C09'], tags: ['app:ds', 'design'] }),

  // API Playground
  entity('ui-surface', 'UI-API-001', 'API Explorer', { domain: 'D17', description: 'Interactive API testing', related: ['D17-C07'], tags: ['app:api', 'engineering'] }),
  entity('ui-surface', 'UI-API-002', 'Schema Viewer', { domain: 'D17', description: 'View API schemas', related: ['D17-C07'], tags: ['app:api', 'engineering'] }),

  // Lesson Studio pages
  entity('ui-surface', 'UI-LS-001', 'Lesson Editor', { domain: 'D03', description: 'Edit lessons', related: ['D03-C02'], impl: 'implemented', tags: ['app:studio', 'education'] }),
  entity('ui-surface', 'UI-LS-002', 'Assessment Editor', { domain: 'D03', description: 'Edit assessments', related: ['D03-C04'], impl: 'implemented', tags: ['app:studio', 'education'] }),
  entity('ui-surface', 'UI-LS-003', 'Teacher Guide View', { domain: 'D03', description: 'View teacher guide', related: ['D03-C02'], impl: 'implemented', tags: ['app:studio', 'education'] }),
  entity('ui-surface', 'UI-LS-004', 'Workbook View', { domain: 'D03', description: 'View workbook', related: ['D03-C02'], impl: 'implemented', tags: ['app:studio', 'education'] }),
  entity('ui-surface', 'UI-LS-005', 'Preview Pane', { domain: 'D03', description: 'Preview content', related: ['D03-C02'], impl: 'implemented', tags: ['app:studio', 'education'] }),
  entity('ui-surface', 'UI-LS-006', 'Publish Workflow', { domain: 'D03', description: 'Publish content', related: ['D03-C02'], impl: 'implemented', tags: ['app:studio', 'education'] }),
];

// Write all
function writeAll(kind, items, dirName) {
  const dir = join(BAR, dirName);
  const indexItems = [];
  for (const e of items) {
    writeFileSync(join(dir, `${e.id}.json`), JSON.stringify(e, null, 2));
    indexItems.push({ id: e.id, name: e.name, domain: e.domain, status: e.status, impl: e.implementation?.status || 'not-started' });
  }
  writeFileSync(join(dir, 'index.json'), JSON.stringify({ registryVersion: '1.0.0', generatedAt: new Date().toISOString(), total: items.length, items: indexItems }, null, 2));
}

writeAll('event', events, 'events');
writeAll('permission', permissions, 'permissions');
writeAll('knowledge-object', koTypes, 'knowledge-objects');
writeAll('ui-surface', uiSurfaces, 'ui-surfaces');

console.log(`Events: ${events.length}`);
console.log(`Permissions: ${permissions.length}`);
console.log(`Knowledge Objects: ${koTypes.length}`);
console.log(`UI Surfaces: ${uiSurfaces.length}`);
