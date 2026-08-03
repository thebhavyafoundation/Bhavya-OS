import { writeFileSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');
const DIR = {
  workflows: join(BAR, 'workflows'),
  skills: join(BAR, 'skills'),
  agents: join(BAR, 'agents'),
  services: join(BAR, 'services'),
  packages: join(BAR, 'packages'),
  applications: join(BAR, 'applications')
};

function entity(kind, id, name, opts = {}) {
  return {
    id, name, kind,
    version: '0.1.0',
    status: opts.status || 'proposed',
    owner: opts.owner || 'bhavya-core',
    description: opts.description || '',
    domain: opts.domain || '',
    sourceAdr: opts.sourceAdr || 'ADR-006',
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
// WORKFLOWS
// ═══════════════════════════════════════════════════
const workflows = [
  entity('workflow', 'WF-001', 'Lesson Generation Pipeline', { domain: 'D03', description: 'KO → Lesson → Assessment → Teacher Guide → Workbook → Visual Spec → Video → Website', dependsOn: ['D05-C01', 'D17-C01'], related: ['D03-C02', 'D08-C01'], impl: 'implemented', tags: ['pipeline', 'content'] }),
  entity('workflow', 'WF-002', 'Knowledge Ingestion Pipeline', { domain: 'D05', description: 'External content → KO → Validation → Graph → Search index', dependsOn: ['D05-C01', 'D16-C02'], related: ['D05-C02'], tags: ['km', 'ingestion'] }),
  entity('workflow', 'WF-003', 'Assessment Grading Pipeline', { domain: 'D03', description: 'Submission → AI Grade → Review → Record → Feedback', dependsOn: ['D16-C03', 'D03-C04'], related: ['D03-C05'], tags: ['academics', 'grading'] }),
  entity('workflow', 'WF-004', 'Admission Workflow', { domain: 'D02', description: 'Application → Review → Interview → Decision → Enrollment', dependsOn: ['D02-C01', 'D05-C01'], related: ['D02-C01'], tags: ['admin', 'admissions'] }),
  entity('workflow', 'WF-005', 'Grant Application Workflow', { domain: 'D04', description: 'Identify → Write → Submit → Track → Report', dependsOn: ['D04-C02', 'D11-C02'], related: ['D04-C02'], tags: ['research', 'grants'] }),
  entity('workflow', 'WF-006', 'Publication Workflow', { domain: 'D07', description: 'Draft → Review → Revise → Approve → Publish → Distribute', dependsOn: ['D07-C01', 'D07-C02'], related: ['D07-C01'], tags: ['publications'] }),
  entity('workflow', 'WF-007', 'Compliance Audit Workflow', { domain: 'D13', description: 'Schedule → Collect → Review → Report → Remediate', dependsOn: ['D13-C01', 'D13-C02'], related: ['D13-C01'], tags: ['compliance'] }),
  entity('workflow', 'WF-008', 'Incident Response Workflow', { domain: 'D14', description: 'Detect → Triage → Investigate → Resolve → Review', dependsOn: ['D14-C06', 'D13-C08'], related: ['D14-C06'], tags: ['operations'] }),
  entity('workflow', 'WF-009', 'Volunteer Onboarding Workflow', { domain: 'D10', description: 'Apply → Screen → Match → Train → Assign', dependsOn: ['D10-C01', 'D10-C02'], related: ['D10-C01'], tags: ['volunteers'] }),
  entity('workflow', 'WF-010', 'Financial Reporting Workflow', { domain: 'D11', description: 'Collect → Reconcile → Analyze → Report → Submit', dependsOn: ['D11-C02', 'D11-C03'], related: ['D11-C03'], tags: ['finance'] }),
  entity('workflow', 'WF-011', 'Media Production Pipeline', { domain: 'D08', description: 'Script → Design → Produce → Review → Publish', dependsOn: ['D08-C01', 'D08-C02'], related: ['D08-C01'], tags: ['media'] }),
  entity('workflow', 'WF-012', 'Contract Lifecycle', { domain: 'D12', description: 'Draft → Review → Negotiate → Sign → Monitor → Renew', dependsOn: ['D12-C01'], related: ['D12-C01'], tags: ['legal'] }),
  entity('workflow', 'WF-013', 'Event Planning Workflow', { domain: 'D09', description: 'Plan → Promote → Register → Execute → Follow-up', dependsOn: ['D09-C03', 'D02-C06'], related: ['D09-C03'], tags: ['community', 'events'] }),
  entity('workflow', 'WF-014', 'Data Governance Workflow', { domain: 'D13', description: 'Classify → Catalog → Monitor → Audit → Report', dependsOn: ['D13-C04', 'D05-C05'], related: ['D13-C04'], tags: ['compliance', 'data'] }),
  entity('workflow', 'WF-015', 'Content Distribution Workflow', { domain: 'D08', description: 'Produce → Format → Distribute → Track → Optimize', dependsOn: ['D08-C05', 'D19-C01'], related: ['D08-C05'], tags: ['media', 'distribution'] }),
  entity('workflow', 'WF-016', 'Knowledge Graph Build', { domain: 'D05', description: 'Extract → Link → Validate → Index → Publish', dependsOn: ['D05-C03', 'D05-C02'], related: ['D05-C03'], tags: ['km', 'graph'] }),
  entity('workflow', 'WF-017', 'Partner Onboarding', { domain: 'D20', description: 'Identify → Assess → Negotiate → MOU → Activate', dependsOn: ['D20-C01', 'D20-C02'], related: ['D20-C01'], tags: ['partnerships'] }),
  entity('workflow', 'WF-018', 'Sustainability Reporting', { domain: 'D21', description: 'Collect → Measure → Analyze → Report → Plan', dependsOn: ['D21-C01', 'D21-C02'], related: ['D21-C04'], tags: ['sustainability'] }),
  entity('workflow', 'WF-019', 'CI/CD Pipeline', { domain: 'D17', description: 'Build → Test → Lint → Stage → Deploy → Monitor', dependsOn: ['D17-C06', 'D15-C02'], related: ['D17-C06'], tags: ['engineering', 'cicd'] }),
  entity('workflow', 'WF-020', 'AI Model Pipeline', { domain: 'D16', description: 'Train → Validate → Test → Deploy → Monitor', dependsOn: ['D16-C01', 'D17-C01'], related: ['D16-C01'], tags: ['ai', 'ml'] }),
];

// ═══════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════
const skills = [
  // L1 Foundation
  entity('skill', 'SK-L1-001', 'lesson', { domain: 'D03', description: 'KO → 6-section lesson with learning outcomes and vocabulary', related: ['D03-C02', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'content'] }),
  entity('skill', 'SK-L1-002', 'assessment', { domain: 'D03', description: 'Lesson → 15 questions (MCQ, short-answer, reflection, practical)', related: ['D03-C04', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'assessment'] }),
  entity('skill', 'SK-L1-003', 'teacher-guide', { domain: 'D03', description: 'Lesson → objectives, materials, discussion prompts, timing', related: ['D03-C02', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'teaching'] }),
  entity('skill', 'SK-L1-004', 'workbook', { domain: 'D03', description: 'Lesson → 8-page workbook with exercises and reflection', related: ['D03-C02', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'practice'] }),
  entity('skill', 'SK-L1-005', 'visual-spec', { domain: 'D08', description: 'Lesson → scene graph with subject-aware palette', related: ['D08-C02', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'media'] }),
  entity('skill', 'SK-L1-006', 'video', { domain: 'D08', description: 'Visual spec → Remotion scene graph', related: ['D08-C01', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'video'] }),
  entity('skill', 'SK-L1-007', 'website', { domain: 'D08', description: 'Artifacts → 4-page HTML/CSS website', related: ['D08-C03', 'D17-C01'], impl: 'implemented', tags: ['core', 'foundation', 'web'] }),
  // L2 Knowledge
  entity('skill', 'SK-L2-001', 'ko-editor', { domain: 'D05', description: 'Edit and manage knowledge objects', related: ['D05-C01'], impl: 'implemented', tags: ['core', 'knowledge'] }),
  entity('skill', 'SK-L2-002', 'knowledge-search', { domain: 'D05', description: 'Full-text and semantic search across KOs', related: ['D05-C04'], tags: ['core', 'knowledge'] }),
  entity('skill', 'SK-L2-003', 'knowledge-graph', { domain: 'D05', description: 'Build and query knowledge graph', related: ['D05-C03'], tags: ['core', 'knowledge'] }),
  entity('skill', 'SK-L2-004', 'ko-validation', { domain: 'D05', description: 'Validate KO structure and content quality', related: ['D05-C05'], impl: 'implemented', tags: ['core', 'knowledge'] }),
  entity('skill', 'SK-L2-005', 'provenance-tracker', { domain: 'D05', description: 'Track artifact lineage and origin', related: ['D05-C09'], impl: 'implemented', tags: ['core', 'knowledge'] }),
  // L3 Education
  entity('skill', 'SK-L3-001', 'curriculum-designer', { domain: 'D03', description: 'Design curriculum structures', related: ['D03-C01'], tags: ['core', 'education'] }),
  entity('skill', 'SK-L3-002', 'grading-engine', { domain: 'D03', description: 'Grade submissions with rubrics', related: ['D03-C05', 'D16-C03'], tags: ['core', 'education'] }),
  entity('skill', 'SK-L3-003', 'progress-tracker', { domain: 'D03', description: 'Track student learning progress', related: ['D03-C06'], tags: ['core', 'education'] }),
  // L4 Media
  entity('skill', 'SK-L4-001', 'slides', { domain: 'D08', description: 'Create HTML presentations with Chart.js', related: ['D08-C04'], tags: ['core', 'media'] }),
  entity('skill', 'SK-L4-002', 'design-system', { domain: 'D08', description: 'Token architecture and component specs', related: ['D08-C09'], tags: ['core', 'media'] }),
  entity('skill', 'SK-L4-003', 'banner-design', { domain: 'D08', description: 'Design banners for social and web', related: ['D08-C02'], tags: ['core', 'media'] }),
  entity('skill', 'SK-L4-004', 'faceless-explainer', { domain: 'D08', description: 'Text-to-video explainer', related: ['D08-C01'], tags: ['core', 'media'] }),
  entity('skill', 'SK-L4-005', 'hyperframes-core', { domain: 'D17', description: 'Composition contract for video rendering', related: ['D08-C01'], tags: ['core', 'media'] }),
  entity('skill', 'SK-L4-006', 'media-resolver', { domain: 'D08', description: 'Resolve media assets (BGM, SFX, images)', related: ['D08-C05'], tags: ['core', 'media'] }),
  // L5 Governance
  entity('skill', 'SK-L5-001', 'audit-logger', { domain: 'D13', description: 'Log all system actions for audit trail', related: ['D13-C02'], tags: ['core', 'governance'] }),
  entity('skill', 'SK-L5-002', 'policy-enforcer', { domain: 'D01', description: 'Enforce institutional policies', related: ['D01-C02', 'D12-C03'], tags: ['core', 'governance'] }),
  entity('skill', 'SK-L5-003', 'compliance-checker', { domain: 'D13', description: 'Check compliance with regulations', related: ['D13-C01'], tags: ['core', 'governance'] }),
  // L6 Research
  entity('skill', 'SK-L6-001', 'rag-pipeline', { domain: 'D16', description: 'Retrieval-augmented generation', related: ['D16-C02', 'D05-C04'], tags: ['core', 'research'] }),
  entity('skill', 'SK-L6-002', 'citation-manager', { domain: 'D06', description: 'Generate and manage citations', related: ['D06-C06'], tags: ['core', 'research'] }),
  // L7 Engineering
  entity('skill', 'SK-L7-001', 'runtime-engine', { domain: 'D17', description: 'Capability resolution and pipeline execution', related: ['D17-C01'], impl: 'implemented', tags: ['core', 'engineering'] }),
  entity('skill', 'SK-L7-002', 'quality-gates', { domain: 'D17', description: '10 gates, 30+ quality checks', related: ['D17-C01'], impl: 'implemented', tags: ['core', 'engineering'] }),
  entity('skill', 'SK-L7-003', 'api-gateway', { domain: 'D17', description: 'API routing and auth', related: ['D17-C07'], tags: ['core', 'engineering'] }),
  entity('skill', 'SK-L7-004', 'event-bus', { domain: 'D17', description: 'Inter-service event messaging', related: ['D17-C08'], tags: ['core', 'engineering'] }),
  entity('skill', 'SK-L7-005', 'deploy-engine', { domain: 'D17', description: 'Build and deploy applications', related: ['D17-C06'], impl: 'partial', tags: ['core', 'engineering'] }),
  // L8 Operations
  entity('skill', 'SK-L8-001', 'monitoring', { domain: 'D15', description: 'System health monitoring', related: ['D15-C04'], tags: ['core', 'operations'] }),
  entity('skill', 'SK-L8-002', 'incident-handler', { domain: 'D14', description: 'Handle operational incidents', related: ['D14-C06'], tags: ['core', 'operations'] }),
  entity('skill', 'SK-L8-003', 'task-orchestrator', { domain: 'D14', description: 'Orchestrate cross-department tasks', related: ['D14-C01'], tags: ['core', 'operations'] }),
  // L9 Mission
  entity('skill', 'SK-L9-001', 'impact-analyzer', { domain: 'D21', description: 'Measure institutional impact', related: ['D21-C01', 'D21-C02'], tags: ['core', 'mission'] }),
  entity('skill', 'SK-L9-002', 'storyteller', { domain: 'D19', description: 'Craft impact narratives', related: ['D19-C06'], tags: ['core', 'mission'] }),
];

// ═══════════════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════════════
const agents = [
  entity('agent', 'AG-EDU-001', 'curriculum-agent', { domain: 'D03', description: 'Design and manage curriculum', related: ['D03-C01', 'D03-C02', 'D03-C03'], tags: ['education'], metadata: { capabilities: ['D03-C01', 'D03-C02', 'D03-C03', 'D03-C04', 'D03-C06', 'D03-C08', 'D03-C09', 'D03-C10', 'D03-C11'] } }),
  entity('agent', 'AG-EDU-002', 'assessment-agent', { domain: 'D03', description: 'Create and grade assessments', related: ['D03-C04', 'D03-C05'], tags: ['education'], metadata: { capabilities: ['D03-C04', 'D03-C05', 'D03-C09'] } }),
  entity('agent', 'AG-EDU-003', 'research-agent', { domain: 'D04', description: 'Manage research programs and publications', related: ['D04-C01', 'D04-C07'], tags: ['research'], metadata: { capabilities: ['D04-C01', 'D04-C02', 'D04-C03', 'D04-C04', 'D04-C05', 'D04-C06', 'D04-C07', 'D04-C08'] } }),
  entity('agent', 'AG-EDU-004', 'library-agent', { domain: 'D06', description: 'Manage library resources', related: ['D06-C01'], tags: ['library'], metadata: { capabilities: ['D06-C01', 'D06-C02', 'D06-C03', 'D06-C04', 'D06-C05', 'D06-C06', 'D06-C07'] } }),
  entity('agent', 'AG-OPS-001', 'admin-agent', { domain: 'D02', description: 'Administrative operations', related: ['D02-C01'], tags: ['admin'], metadata: { capabilities: ['D02-C01', 'D02-C02', 'D02-C03', 'D02-C04', 'D02-C05', 'D02-C06', 'D02-C07', 'D02-C08', 'D02-C09', 'D02-C10'] } }),
  entity('agent', 'AG-OPS-002', 'finance-agent', { domain: 'D11', description: 'Financial operations', related: ['D11-C01'], tags: ['finance'], metadata: { capabilities: ['D11-C01', 'D11-C02', 'D11-C03', 'D11-C04', 'D11-C05', 'D11-C06', 'D11-C07', 'D11-C08', 'D11-C09'] } }),
  entity('agent', 'AG-OPS-003', 'compliance-agent', { domain: 'D13', description: 'Compliance and audit', related: ['D13-C01'], tags: ['compliance'], metadata: { capabilities: ['D13-C01', 'D13-C02', 'D13-C03', 'D13-C04', 'D13-C05', 'D13-C06', 'D13-C07', 'D13-C08'] } }),
  entity('agent', 'AG-OPS-004', 'legal-agent', { domain: 'D12', description: 'Legal operations', related: ['D12-C01'], tags: ['legal'], metadata: { capabilities: ['D12-C01', 'D12-C02', 'D12-C03', 'D12-C04', 'D12-C05', 'D12-C06', 'D12-C07'] } }),
  entity('agent', 'AG-OPS-005', 'operations-agent', { domain: 'D14', description: 'Operational orchestration', related: ['D14-C01'], tags: ['operations'], metadata: { capabilities: ['D14-C01', 'D14-C02', 'D14-C03', 'D14-C04', 'D14-C05', 'D14-C06', 'D14-C07', 'D14-C08'] } }),
  entity('agent', 'AG-MEDIA-001', 'media-agent', { domain: 'D08', description: 'Media production', related: ['D08-C01'], tags: ['media'], metadata: { capabilities: ['D08-C01', 'D08-C02', 'D08-C03', 'D08-C04', 'D08-C05', 'D08-C06', 'D08-C07', 'D08-C08', 'D08-C09'] } }),
  entity('agent', 'AG-KM-001', 'knowledge-agent', { domain: 'D05', description: 'Knowledge management', related: ['D05-C01'], tags: ['knowledge'], metadata: { capabilities: ['D05-C01', 'D05-C02', 'D05-C03', 'D05-C04', 'D05-C05', 'D05-C06', 'D05-C07', 'D05-C08', 'D05-C09'] } }),
  entity('agent', 'AG-AI-001', 'ai-agent', { domain: 'D16', description: 'AI and intelligence', related: ['D16-C01'], tags: ['ai'], metadata: { capabilities: ['D16-C01', 'D16-C02', 'D16-C03', 'D16-C04', 'D16-C05', 'D16-C06', 'D16-C07'] } }),
  entity('agent', 'AG-ENG-001', 'engineering-agent', { domain: 'D17', description: 'Platform engineering', related: ['D17-C01'], tags: ['engineering'], metadata: { capabilities: ['D17-C01', 'D17-C02', 'D17-C03', 'D17-C04', 'D17-C05', 'D17-C06', 'D17-C07', 'D17-C08'] } }),
  entity('agent', 'AG-AN-001', 'analytics-agent', { domain: 'D18', description: 'Analytics and reporting', related: ['D18-C01'], tags: ['analytics'], metadata: { capabilities: ['D18-C01', 'D18-C02', 'D18-C03', 'D18-C04', 'D18-C05', 'D18-C06', 'D18-C07'] } }),
  entity('agent', 'AG-GOV-001', 'governance-agent', { domain: 'D01', description: 'Governance and policy', related: ['D01-C01'], tags: ['governance'], metadata: { capabilities: ['D01-C01', 'D01-C02', 'D01-C03', 'D01-C04', 'D01-C05', 'D01-C06', 'D01-C07', 'D01-C08', 'D01-C09'] } }),
  entity('agent', 'AG-INF-001', 'infrastructure-agent', { domain: 'D15', description: 'Infrastructure management', related: ['D15-C01'], tags: ['infrastructure'], metadata: { capabilities: ['D15-C01', 'D15-C02', 'D15-C03', 'D15-C04', 'D15-C05', 'D15-C06', 'D15-C07'] } }),
  entity('agent', 'AG-COM-001', 'community-agent', { domain: 'D09', description: 'Community engagement', related: ['D09-C01'], tags: ['community'], metadata: { capabilities: ['D09-C01', 'D09-C02', 'D09-C03', 'D09-C04', 'D09-C05', 'D09-C06', 'D09-C07', 'D09-C08'] } }),
  entity('agent', 'AG-VOL-001', 'volunteer-agent', { domain: 'D10', description: 'Volunteer management', related: ['D10-C01'], tags: ['volunteers'], metadata: { capabilities: ['D10-C01', 'D10-C02', 'D10-C03', 'D10-C04', 'D10-C05', 'D10-C06', 'D10-C07'] } }),
  entity('agent', 'AG-PUB-001', 'publications-agent', { domain: 'D07', description: 'Publication management', related: ['D07-C01'], tags: ['publications'], metadata: { capabilities: ['D07-C01', 'D07-C02', 'D07-C03', 'D07-C04', 'D07-C05', 'D07-C06'] } }),
  entity('agent', 'AG-OUT-001', 'outreach-agent', { domain: 'D19', description: 'Outreach and marketing', related: ['D19-C01'], tags: ['outreach'], metadata: { capabilities: ['D19-C01', 'D19-C02', 'D19-C03', 'D19-C04', 'D19-C05', 'D19-C06'] } }),
  entity('agent', 'AG-PART-001', 'partnerships-agent', { domain: 'D20', description: 'Partnership management', related: ['D20-C01'], tags: ['partnerships'], metadata: { capabilities: ['D20-C01', 'D20-C02', 'D20-C03', 'D20-C04', 'D20-C05', 'D20-C06'] } }),
  entity('agent', 'AG-SUS-001', 'sustainability-agent', { domain: 'D21', description: 'Sustainability tracking', related: ['D21-C01'], tags: ['sustainability'], metadata: { capabilities: ['D21-C01', 'D21-C02', 'D21-C03', 'D21-C04', 'D21-C05'] } }),
];

// ═══════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════
const services = [
  entity('service', 'SV-CORE-001', 'notification-service', { domain: 'D17', description: 'Send notifications across channels', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 80 } }),
  entity('service', 'SV-CORE-002', 'document-service', { domain: 'D17', description: 'Document CRUD and storage', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 60 } }),
  entity('service', 'SV-CORE-003', 'analytics-service', { domain: 'D18', description: 'Event ingestion and aggregation', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 40 } }),
  entity('service', 'SV-CORE-004', 'auth-service', { domain: 'D17', description: 'Authentication and authorization', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 100 } }),
  entity('service', 'SV-CORE-005', 'search-service', { domain: 'D05', description: 'Full-text and semantic search', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 30 } }),
  entity('service', 'SV-CORE-006', 'file-service', { domain: 'D17', description: 'File upload, download, and management', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 50 } }),
  entity('service', 'SV-CORE-007', 'cache-service', { domain: 'D17', description: 'Redis/in-memory caching', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 45 } }),
  entity('service', 'SV-CORE-008', 'queue-service', { domain: 'D14', description: 'Async task queue management', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 25 } }),
  entity('service', 'SV-CORE-009', 'email-service', { domain: 'D02', description: 'Send emails and newsletters', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 20 } }),
  entity('service', 'SV-CORE-010', 'audit-service', { domain: 'D13', description: 'Audit trail logging', tags: ['cross-cutting'], metadata: { crossCutting: true, usedBy: 70 } }),
  entity('service', 'SV-D05-001', 'ko-service', { domain: 'D05', description: 'Knowledge Object CRUD', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D05-002', 'kg-service', { domain: 'D05', description: 'Knowledge graph operations', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D03-001', 'lesson-service', { domain: 'D03', description: 'Lesson generation and management', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D03-002', 'assessment-service', { domain: 'D03', description: 'Assessment creation and grading', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D03-003', 'grading-service', { domain: 'D03', description: 'Automated grading engine', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D08-001', 'media-service', { domain: 'D08', description: 'Media asset management', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D08-002', 'video-service', { domain: 'D08', description: 'Video generation and rendering', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D08-003', 'website-service', { domain: 'D08', description: 'Website generation', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D17-001', 'pipeline-service', { domain: 'D17', description: 'Pipeline orchestration', tags: ['domain'], impl: 'implemented', metadata: { crossCutting: false } }),
  entity('service', 'SV-D17-002', 'deploy-service', { domain: 'D17', description: 'Deployment management', tags: ['domain'], impl: 'partial', metadata: { crossCutting: false } }),
  entity('service', 'SV-D11-001', 'finance-service', { domain: 'D11', description: 'Financial operations', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D13-001', 'compliance-service', { domain: 'D13', description: 'Compliance monitoring', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D14-001', 'workflow-service', { domain: 'D14', description: 'Workflow execution engine', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D16-001', 'ai-service', { domain: 'D16', description: 'AI model serving', tags: ['domain'], metadata: { crossCutting: false } }),
  entity('service', 'SV-D15-001', 'infra-service', { domain: 'D15', description: 'Infrastructure management', tags: ['domain'], metadata: { crossCutting: false } }),
];

// ═══════════════════════════════════════════════════
// PACKAGES
// ═══════════════════════════════════════════════════
const packages = [
  entity('package', 'PK-001', '@bhavya/core', { domain: 'D17', description: 'Runtime engine, knowledge pipeline, config', dependsOn: [], impl: 'implemented', tags: ['core'] }),
  entity('package', 'PK-002', '@bhavya/knowledge', { domain: 'D05', description: 'KO CRUD, knowledge graph, search', dependsOn: ['PK-001'], impl: 'partial', tags: ['knowledge'] }),
  entity('package', 'PK-003', '@bhavya/education', { domain: 'D03', description: 'Lesson, assessment, grading, curriculum', dependsOn: ['PK-001', 'PK-002'], impl: 'partial', tags: ['education'] }),
  entity('package', 'PK-004', '@bhavya/media', { domain: 'D08', description: 'Video, visual, website, slides', dependsOn: ['PK-001', 'PK-003'], impl: 'partial', tags: ['media'] }),
  entity('package', 'PK-005', '@bhavya/ai', { domain: 'D16', description: 'AI models, RAG, recommendations', dependsOn: ['PK-001', 'PK-002'], tags: ['ai'] }),
  entity('package', 'PK-006', '@bhavya/operations', { domain: 'D14', description: 'Workflow, tasks, orchestration', dependsOn: ['PK-001'], tags: ['operations'] }),
  entity('package', 'PK-007', '@bhavya/finance', { domain: 'D11', description: 'Budget, accounting, payroll', dependsOn: ['PK-001', 'PK-006'], tags: ['finance'] }),
  entity('package', 'PK-008', '@bhavya/compliance', { domain: 'D13', description: 'Compliance, audit, governance', dependsOn: ['PK-001'], tags: ['compliance'] }),
  entity('package', 'PK-009', '@bhavya/community', { domain: 'D09', description: 'Community, events, forums', dependsOn: ['PK-001', 'PK-006'], tags: ['community'] }),
  entity('package', 'PK-010', '@bhavya/analytics', { domain: 'D18', description: 'Analytics, dashboards, reports', dependsOn: ['PK-001', 'PK-002'], tags: ['analytics'] }),
  entity('package', 'PK-011', '@bhavya/infra', { domain: 'D15', description: 'Cloud, CI/CD, monitoring', dependsOn: ['PK-001'], tags: ['infrastructure'] }),
  entity('package', 'PK-012', '@bhavya/legal', { domain: 'D12', description: 'Contracts, IP, legal', dependsOn: ['PK-001', 'PK-008'], tags: ['legal'] }),
  entity('package', 'PK-013', '@bhavya/research', { domain: 'D04', description: 'Research programs, grants, publications', dependsOn: ['PK-001', 'PK-002', 'PK-005'], tags: ['research'] }),
  entity('package', 'PK-014', '@bhavya/outreach', { domain: 'D19', description: 'Social, email, SEO', dependsOn: ['PK-001', 'PK-004'], tags: ['outreach'] }),
  entity('package', 'PK-015', '@bhavya/governance', { domain: 'D01', description: 'Policy, board, elections', dependsOn: ['PK-001', 'PK-008'], tags: ['governance'] }),
  entity('package', 'PK-016', '@bhavya/library', { domain: 'D06', description: 'Catalog, lending, citations', dependsOn: ['PK-001', 'PK-002'], tags: ['library'] }),
  entity('package', 'PK-017', '@bhavya/sustainability', { domain: 'D21', description: 'Environmental, social, financial impact', dependsOn: ['PK-001', 'PK-010', 'PK-015'], tags: ['sustainability'] }),
];

// ═══════════════════════════════════════════════════
// APPLICATIONS
// ═══════════════════════════════════════════════════
const applications = [
  entity('application', 'APP-001', 'Bhavya AI Lab', { domain: 'D05', description: 'Knowledge management and content generation UI', dependsOn: ['PK-001', 'PK-002', 'PK-003', 'PK-004'], impl: 'implemented', tags: ['app', 'core'] }),
  entity('application', 'APP-002', 'Lesson Studio', { domain: 'D03', description: 'Educational content authoring platform', dependsOn: ['PK-001', 'PK-003', 'PK-004'], impl: 'implemented', tags: ['app', 'education'] }),
  entity('application', 'APP-003', 'Dashboard', { domain: 'D18', description: 'Analytics and monitoring dashboard', dependsOn: ['PK-001', 'PK-010'], tags: ['app', 'analytics'] }),
  entity('application', 'APP-004', 'Knowledge Portal', { domain: 'D05', description: 'Public knowledge browsing and search', dependsOn: ['PK-002'], tags: ['app', 'knowledge'] }),
  entity('application', 'APP-005', 'Admin Console', { domain: 'D02', description: 'Administrative operations panel', dependsOn: ['PK-001', 'PK-006'], tags: ['app', 'admin'] }),
  entity('application', 'APP-006', 'Finance Portal', { domain: 'D11', description: 'Financial management interface', dependsOn: ['PK-007'], tags: ['app', 'finance'] }),
  entity('application', 'APP-007', 'Community Hub', { domain: 'D09', description: 'Community engagement platform', dependsOn: ['PK-009'], tags: ['app', 'community'] }),
  entity('application', 'APP-008', 'Research Portal', { domain: 'D04', description: 'Research management interface', dependsOn: ['PK-013'], tags: ['app', 'research'] }),
  entity('application', 'APP-009', 'Design System', { domain: 'D08', description: 'UI component library and tokens', dependsOn: [], impl: 'implemented', tags: ['app', 'design'] }),
  entity('application', 'APP-010', 'Documentation', { domain: 'D17', description: 'Platform documentation site', dependsOn: [], tags: ['app', 'docs'] }),
  entity('application', 'APP-011', 'Volunteer Portal', { domain: 'D10', description: 'Volunteer self-service platform', dependsOn: ['PK-009'], tags: ['app', 'volunteers'] }),
  entity('application', 'APP-012', 'Library Portal', { domain: 'D06', description: 'Library catalog and resources', dependsOn: ['PK-016'], tags: ['app', 'library'] }),
  entity('application', 'APP-013', 'Heritage Portal', { domain: 'D21', description: 'Cultural heritage and outreach', dependsOn: ['PK-014', 'PK-017'], tags: ['app', 'heritage'] }),
  entity('application', 'APP-014', 'Compliance Dashboard', { domain: 'D13', description: 'Compliance monitoring interface', dependsOn: ['PK-008'], tags: ['app', 'compliance'] }),
  entity('application', 'APP-015', 'Transparency Portal', { domain: 'D01', description: 'Public transparency reporting', dependsOn: ['PK-015', 'PK-010'], tags: ['app', 'transparency'] }),
  entity('application', 'APP-016', 'API Playground', { domain: 'D17', description: 'Interactive API documentation', dependsOn: ['PK-001'], tags: ['app', 'api'] }),
  entity('application', 'APP-017', 'Mobile App', { domain: 'D02', description: 'Mobile companion application', dependsOn: ['PK-001', 'PK-006'], tags: ['app', 'mobile'] }),
  entity('application', 'APP-018', 'Monitoring Console', { domain: 'D15', description: 'Infrastructure monitoring dashboard', dependsOn: ['PK-011'], tags: ['app', 'monitoring'] }),
];

// Write all entities
function writeEntities(kind, entities) {
  const dir = DIR[kind + 's'] || DIR[kind];
  if (!dir) return;
  const indexItems = [];
  for (const e of entities) {
    writeFileSync(join(dir, `${e.id}.json`), JSON.stringify(e, null, 2));
    indexItems.push({ id: e.id, name: e.name, domain: e.domain, status: e.status, impl: e.implementation?.status || 'not-started' });
  }
  writeFileSync(join(dir, 'index.json'), JSON.stringify({ registryVersion: '1.0.0', generatedAt: new Date().toISOString(), total: entities.length, items: indexItems }, null, 2));
}

writeEntities('workflow', workflows);
writeEntities('skill', skills);
writeEntities('agent', agents);
writeEntities('service', services);
writeEntities('package', packages);
writeEntities('application', applications);

console.log(`Workflows: ${workflows.length}`);
console.log(`Skills: ${skills.length}`);
console.log(`Agents: ${agents.length}`);
console.log(`Services: ${services.length}`);
console.log(`Packages: ${packages.length}`);
console.log(`Applications: ${applications.length}`);
