import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');
const CAP_DIR = join(BAR, 'capabilities');

function cap(id, name, domain, opts = {}) {
  return {
    id,
    name,
    kind: 'capability',
    version: '0.1.0',
    status: opts.status || 'proposed',
    owner: opts.owner || 'bhavya-core',
    description: opts.description || '',
    domain,
    sourceAdr: 'ADR-006',
    dependsOn: opts.dependsOn || [],
    upstream: opts.upstream || [],
    downstream: opts.downstream || [],
    related: opts.related || [],
    implementation: {
      status: opts.implStatus || 'not-started',
      location: opts.implLocation || '',
      files: opts.implFiles || []
    },
    tests: { status: 'none' },
    docs: { status: opts.docsStatus || 'none' },
    release: '',
    automation: opts.automation || 'manual',
    tags: opts.tags || [],
    metadata: opts.metadata || {}
  };
}

const capabilities = [
  // D01 - Governance (9)
  cap('D01-C01', 'Strategic Planning', 'D01', { description: 'Define institutional vision, mission, and strategic goals', dependsOn: ['D02-C01', 'D03-C01'], downstream: ['D01-C02', 'D01-C03'], tags: ['governance', 'strategy'], implStatus: 'not-started' }),
  cap('D01-C02', 'Policy Management', 'D01', { description: 'Create, version, and enforce institutional policies', dependsOn: ['D01-C01', 'D13-C01'], downstream: ['D01-C03', 'D13-C02'], tags: ['governance', 'policy'], implStatus: 'not-started' }),
  cap('D01-C03', 'Board Management', 'D01', { description: 'Board meetings, resolutions, and governance records', dependsOn: ['D01-C01', 'D01-C02'], downstream: ['D01-C04'], tags: ['governance', 'board'], implStatus: 'not-started' }),
  cap('D01-C04', 'Decision Logging', 'D01', { description: 'Record and trace all institutional decisions', dependsOn: ['D01-C03', 'D05-C01'], downstream: ['D18-C01'], tags: ['governance', 'decisions', 'audit'], implStatus: 'not-started' }),
  cap('D01-C05', 'Compliance Oversight', 'D01', { description: 'Monitor compliance across all domains', dependsOn: ['D13-C01', 'D01-C02'], downstream: ['D01-C06'], tags: ['governance', 'compliance'], implStatus: 'not-started' }),
  cap('D01-C06', 'Risk Management', 'D01', { description: 'Identify, assess, and mitigate institutional risks', dependsOn: ['D01-C05', 'D18-C01'], downstream: ['D01-C07'], tags: ['governance', 'risk'], implStatus: 'not-started' }),
  cap('D01-C07', 'Performance Review', 'D01', { description: 'Evaluate institutional and departmental performance', dependsOn: ['D18-C01', 'D01-C04'], downstream: ['D01-C08'], tags: ['governance', 'performance'], implStatus: 'not-started' }),
  cap('D01-C08', 'Transparency Reporting', 'D01', { description: 'Public transparency and accountability reports', dependsOn: ['D01-C04', 'D18-C01'], downstream: ['D09-C01'], tags: ['governance', 'transparency'], implStatus: 'partial' }),
  cap('D01-C09', 'Election Management', 'D01', { description: 'Manage board and committee elections', dependsOn: ['D01-C03', 'D02-C01'], downstream: [], tags: ['governance', 'elections'], implStatus: 'not-started' }),

  // D02 - Administration (10)
  cap('D02-C01', 'Admission Management', 'D02', { description: 'End-to-end student admission workflow', dependsOn: ['D03-C01'], downstream: ['D02-C02', 'D03-C02'], tags: ['admin', 'admissions'], implStatus: 'not-started' }),
  cap('D02-C02', 'Student Records', 'D02', { description: 'Maintain student academic and personal records', dependsOn: ['D02-C01', 'D05-C01'], downstream: ['D02-C03', 'D03-C03'], tags: ['admin', 'records', 'students'], implStatus: 'not-started' }),
  cap('D02-C03', 'Staff Management', 'D02', { description: 'HR records, contracts, and staff lifecycle', dependsOn: ['D02-C01', 'D11-C01'], downstream: ['D02-C04'], tags: ['admin', 'hr', 'staff'], implStatus: 'not-started' }),
  cap('D02-C04', 'Attendance Tracking', 'D02', { description: 'Student and staff attendance monitoring', dependsOn: ['D02-C02', 'D02-C03'], downstream: ['D18-C01'], tags: ['admin', 'attendance'], implStatus: 'not-started' }),
  cap('D02-C05', 'Communication Hub', 'D02', { description: 'Internal messaging, announcements, notifications', dependsOn: ['D05-C01', 'D17-C01'], downstream: ['D09-C01', 'D02-C06'], tags: ['admin', 'communication'], implStatus: 'not-started' }),
  cap('D02-C06', 'Event Management', 'D02', { description: 'Institutional events, scheduling, logistics', dependsOn: ['D02-C05'], downstream: ['D09-C01'], tags: ['admin', 'events'], implStatus: 'not-started' }),
  cap('D02-C07', 'Asset Management', 'D02', { description: 'Track institutional assets and inventory', dependsOn: ['D11-C01', 'D14-C01'], downstream: [], tags: ['admin', 'assets'], implStatus: 'not-started' }),
  cap('D02-C08', 'Facility Management', 'D02', { description: 'Building, room, and infrastructure management', dependsOn: ['D02-C07', 'D14-C02'], downstream: [], tags: ['admin', 'facilities'], implStatus: 'not-started' }),
  cap('D02-C09', 'Document Management', 'D02', { description: 'Centralized document storage and retrieval', dependsOn: ['D05-C01', 'D17-C02'], downstream: ['D02-C10', 'D13-C01'], tags: ['admin', 'documents'], implStatus: 'partial' }),
  cap('D02-C10', 'Report Generation', 'D02', { description: 'Generate institutional reports and summaries', dependsOn: ['D18-C01', 'D02-C09'], downstream: ['D01-C07'], tags: ['admin', 'reports'], implStatus: 'not-started' }),

  // D03 - Academics (11)
  cap('D03-C01', 'Curriculum Design', 'D03', { description: 'Design and structure academic curriculum', dependsOn: ['D05-C01', 'D04-C01'], downstream: ['D03-C02', 'D03-C04'], tags: ['academics', 'curriculum'], implStatus: 'partial' }),
  cap('D03-C02', 'Lesson Planning', 'D03', { description: 'Create detailed lesson plans from curriculum', dependsOn: ['D03-C01', 'D05-C02'], downstream: ['D03-C03', 'D08-C01'], tags: ['academics', 'lessons'], implStatus: 'implemented' }),
  cap('D03-C03', 'Classroom Delivery', 'D03', { description: 'Tools and workflows for in-class teaching', dependsOn: ['D03-C02', 'D08-C01'], downstream: ['D03-C05'], tags: ['academics', 'delivery'], implStatus: 'not-started' }),
  cap('D03-C04', 'Assessment Design', 'D03', { description: 'Create assessments, rubrics, and evaluation criteria', dependsOn: ['D03-C01', 'D05-C02'], downstream: ['D03-C05', 'D18-C02'], tags: ['academics', 'assessment'], implStatus: 'implemented' }),
  cap('D03-C05', 'Grading & Evaluation', 'D03', { description: 'Grade submissions and compute results', dependsOn: ['D03-C04', 'D03-C03'], downstream: ['D02-C02', 'D18-C02'], tags: ['academics', 'grading'], implStatus: 'not-started' }),
  cap('D03-C06', 'Student Progress', 'D03', { description: 'Track individual student learning progress', dependsOn: ['D03-C05', 'D18-C02'], downstream: ['D03-C07', 'D02-C05'], tags: ['academics', 'progress'], implStatus: 'not-started' }),
  cap('D03-C07', 'Parent Portal', 'D03', { description: 'Parent access to student academic information', dependsOn: ['D03-C06', 'D02-C05'], downstream: [], tags: ['academics', 'parents'], implStatus: 'not-started' }),
  cap('D03-C08', 'Timetable Management', 'D03', { description: 'Class scheduling and timetable generation', dependsOn: ['D02-C03', 'D03-C01'], downstream: ['D03-C03'], tags: ['academics', 'timetable'], implStatus: 'not-started' }),
  cap('D03-C09', 'Exam Management', 'D03', { description: 'Exam scheduling, seating, and conduct', dependsOn: ['D03-C04', 'D03-C08'], downstream: ['D03-C05'], tags: ['academics', 'exams'], implStatus: 'not-started' }),
  cap('D03-C10', 'Certification', 'D03', { description: 'Issue certificates and transcripts', dependsOn: ['D03-C05', 'D02-C02'], downstream: [], tags: ['academics', 'certificates'], implStatus: 'not-started' }),
  cap('D03-C11', 'Remedial Programs', 'D03', { description: 'Identify and support struggling students', dependsOn: ['D03-C06', 'D16-C01'], downstream: ['D03-C07'], tags: ['academics', 'remedial'], implStatus: 'not-started' }),

  // D04 - Research (8)
  cap('D04-C01', 'Research Programs', 'D04', { description: 'Define and manage research programs', dependsOn: ['D05-C01', 'D03-C01'], downstream: ['D04-C02', 'D07-C01'], tags: ['research', 'programs'], implStatus: 'not-started' }),
  cap('D04-C02', 'Grant Management', 'D04', { description: 'Apply for, track, and report on grants', dependsOn: ['D04-C01', 'D11-C02'], downstream: ['D04-C03'], tags: ['research', 'grants'], implStatus: 'not-started' }),
  cap('D04-C03', 'Research Data', 'D04', { description: 'Collect, store, and manage research data', dependsOn: ['D04-C01', 'D05-C01', 'D17-C03'], downstream: ['D04-C04', 'D07-C01'], tags: ['research', 'data'], implStatus: 'not-started' }),
  cap('D04-C04', 'Ethics Review', 'D04', { description: 'Research ethics approval and compliance', dependsOn: ['D04-C03', 'D13-C01'], downstream: ['D04-C05'], tags: ['research', 'ethics'], implStatus: 'not-started' }),
  cap('D04-C05', 'Collaboration Hub', 'D04', { description: 'Multi-institutional research collaboration', dependsOn: ['D04-C01', 'D20-C01'], downstream: ['D04-C06'], tags: ['research', 'collaboration'], implStatus: 'not-started' }),
  cap('D04-C06', 'IP Management', 'D04', { description: 'Patent and intellectual property tracking', dependsOn: ['D04-C05', 'D12-C01'], downstream: ['D20-C01'], tags: ['research', 'ip'], implStatus: 'not-started' }),
  cap('D04-C07', 'Publication Pipeline', 'D04', { description: 'Research paper writing and submission', dependsOn: ['D04-C03', 'D07-C01'], downstream: ['D07-C02'], tags: ['research', 'publications'], implStatus: 'not-started' }),
  cap('D04-C08', 'Impact Tracking', 'D04', { description: 'Track research citations and impact', dependsOn: ['D04-C07', 'D18-C01'], downstream: ['D01-C07'], tags: ['research', 'impact'], implStatus: 'not-started' }),

  // D05 - Knowledge Management (9)
  cap('D05-C01', 'Knowledge Repository', 'D05', { description: 'Central store for all knowledge objects', dependsOn: ['D17-C03'], downstream: ['D05-C02', 'D05-C03', 'D05-C04'], tags: ['km', 'repository'], implStatus: 'implemented' }),
  cap('D05-C02', 'Knowledge Ingestion', 'D05', { description: 'Import and process knowledge from external sources', dependsOn: ['D05-C01', 'D16-C02'], downstream: ['D05-C03'], tags: ['km', 'ingestion'], implStatus: 'not-started' }),
  cap('D05-C03', 'Knowledge Graph', 'D05', { description: 'Interconnect knowledge objects in a graph', dependsOn: ['D05-C01', 'D17-C03'], downstream: ['D05-C04', 'D16-C01'], tags: ['km', 'graph'], implStatus: 'not-started' }),
  cap('D05-C04', 'Knowledge Search', 'D05', { description: 'Full-text and semantic search across knowledge', dependsOn: ['D05-C01', 'D16-C02'], downstream: ['D03-C01', 'D04-C01'], tags: ['km', 'search'], implStatus: 'not-started' }),
  cap('D05-C05', 'Knowledge Validation', 'D05', { description: 'Quality checks on knowledge objects', dependsOn: ['D05-C01'], downstream: ['D05-C06'], tags: ['km', 'validation'], implStatus: 'partial' }),
  cap('D05-C06', 'Knowledge Versioning', 'D05', { description: 'Version control for knowledge objects', dependsOn: ['D05-C01', 'D17-C04'], downstream: ['D05-C07'], tags: ['km', 'versioning'], implStatus: 'implemented' }),
  cap('D05-C07', 'Knowledge Curation', 'D05', { description: 'Curate and organize knowledge collections', dependsOn: ['D05-C03', 'D05-C04'], downstream: ['D06-C01'], tags: ['km', 'curation'], implStatus: 'not-started' }),
  cap('D05-C08', 'Ontology Management', 'D05', { description: 'Define and maintain knowledge ontologies', dependsOn: ['D05-C03'], downstream: ['D16-C01'], tags: ['km', 'ontology'], implStatus: 'not-started' }),
  cap('D05-C09', 'Provenance Tracking', 'D05', { description: 'Track origin and lineage of knowledge', dependsOn: ['D05-C06', 'D17-C04'], downstream: ['D01-C08'], tags: ['km', 'provenance'], implStatus: 'implemented' }),

  // D06 - Library (7)
  cap('D06-C01', 'Catalog Management', 'D06', { description: 'Manage library catalog of resources', dependsOn: ['D05-C07', 'D05-C01'], downstream: ['D06-C02'], tags: ['library', 'catalog'], implStatus: 'not-started' }),
  cap('D06-C02', 'Digital Lending', 'D06', { description: 'Digital resource borrowing and returns', dependsOn: ['D06-C01', 'D02-C02'], downstream: ['D06-C03'], tags: ['library', 'lending'], implStatus: 'not-started' }),
  cap('D06-C03', 'Resource Discovery', 'D06', { description: 'Help users find relevant resources', dependsOn: ['D06-C01', 'D05-C04'], downstream: ['D06-C04'], tags: ['library', 'discovery'], implStatus: 'not-started' }),
  cap('D06-C04', 'Acquisition Management', 'D06', { description: 'Purchase and license new resources', dependsOn: ['D06-C01', 'D11-C01'], downstream: [], tags: ['library', 'acquisition'], implStatus: 'not-started' }),
  cap('D06-C05', 'Archive Management', 'D06', { description: 'Long-term preservation of materials', dependsOn: ['D06-C01', 'D15-C01'], downstream: [], tags: ['library', 'archive'], implStatus: 'not-started' }),
  cap('D06-C06', 'Citation Management', 'D06', { description: 'Generate and manage citations', dependsOn: ['D06-C01', 'D04-C07'], downstream: ['D07-C01'], tags: ['library', 'citations'], implStatus: 'not-started' }),
  cap('D06-C07', 'Interlibrary Loan', 'D06', { description: 'Share resources with partner institutions', dependsOn: ['D06-C02', 'D20-C01'], downstream: [], tags: ['library', 'loan'], implStatus: 'not-started' }),

  // D07 - Publications (6)
  cap('D07-C01', 'Journal Management', 'D07', { description: 'Manage institutional journals', dependsOn: ['D04-C07', 'D06-C06'], downstream: ['D07-C02'], tags: ['publications', 'journals'], implStatus: 'not-started' }),
  cap('D07-C02', 'Peer Review', 'D07', { description: 'Manage peer review workflow', dependsOn: ['D07-C01', 'D04-C04'], downstream: ['D07-C03'], tags: ['publications', 'peer-review'], implStatus: 'not-started' }),
  cap('D07-C03', 'Content Publishing', 'D07', { description: 'Publish articles, papers, and books', dependsOn: ['D07-C02', 'D08-C05'], downstream: ['D07-C04'], tags: ['publications', 'publishing'], implStatus: 'not-started' }),
  cap('D07-C04', 'Distribution', 'D07', { description: 'Distribute publications to channels', dependsOn: ['D07-C03', 'D09-C01'], downstream: [], tags: ['publications', 'distribution'], implStatus: 'not-started' }),
  cap('D07-C05', 'Impact Analytics', 'D07', { description: 'Track publication readership and citations', dependsOn: ['D07-C03', 'D18-C01'], downstream: ['D04-C08'], tags: ['publications', 'analytics'], implStatus: 'not-started' }),
  cap('D07-C06', 'Preprint Server', 'D07', { description: 'Manage preprint submissions', dependsOn: ['D07-C01', 'D05-C01'], downstream: ['D07-C02'], tags: ['publications', 'preprint'], implStatus: 'not-started' }),

  // D08 - Media Production (9)
  cap('D08-C01', 'Lesson Video Production', 'D08', { description: 'Produce educational videos from lessons', dependsOn: ['D03-C02', 'D05-C01'], downstream: ['D08-C02', 'D08-C03'], tags: ['media', 'video', 'lessons'], implStatus: 'implemented' }),
  cap('D08-C02', 'Visual Design', 'D08', { description: 'Create visual assets for educational content', dependsOn: ['D08-C01', 'D17-C01'], downstream: ['D08-C03'], tags: ['media', 'design'], implStatus: 'partial' }),
  cap('D08-C03', 'Website Builder', 'D08', { description: 'Generate educational websites', dependsOn: ['D08-C01', 'D17-C01'], downstream: ['D08-C04'], tags: ['media', 'website'], implStatus: 'implemented' }),
  cap('D08-C04', 'Presentation Builder', 'D08', { description: 'Create slide presentations', dependsOn: ['D08-C02', 'D17-C01'], downstream: ['D08-C05'], tags: ['media', 'slides'], implStatus: 'partial' }),
  cap('D08-C05', 'Content Distribution', 'D08', { description: 'Distribute content across platforms', dependsOn: ['D08-C03', 'D08-C04'], downstream: ['D09-C01', 'D19-C01'], tags: ['media', 'distribution'], implStatus: 'not-started' }),
  cap('D08-C06', 'Audio Production', 'D08', { description: 'Produce podcasts and audio content', dependsOn: ['D08-C01', 'D17-C01'], downstream: ['D08-C05'], tags: ['media', 'audio'], implStatus: 'not-started' }),
  cap('D08-C07', 'Animation Studio', 'D08', { description: 'Create educational animations', dependsOn: ['D08-C02', 'D17-C01'], downstream: ['D08-C05'], tags: ['media', 'animation'], implStatus: 'not-started' }),
  cap('D08-C08', 'Interactive Content', 'D08', { description: 'Build interactive learning modules', dependsOn: ['D08-C01', 'D17-C01'], downstream: ['D08-C05'], tags: ['media', 'interactive'], implStatus: 'not-started' }),
  cap('D08-C09', 'Brand Management', 'D08', { description: 'Maintain visual identity across outputs', dependsOn: ['D08-C02'], downstream: ['D08-C01', 'D08-C03', 'D08-C04'], tags: ['media', 'brand'], implStatus: 'partial' }),

  // D09 - Community (8)
  cap('D09-C01', 'Community Portal', 'D09', { description: 'Public-facing community platform', dependsOn: ['D02-C05', 'D08-C05'], downstream: ['D09-C02'], tags: ['community', 'portal'], implStatus: 'not-started' }),
  cap('D09-C02', 'Discussion Forums', 'D09', { description: 'Community discussion spaces', dependsOn: ['D09-C01', 'D05-C01'], downstream: ['D09-C03'], tags: ['community', 'forums'], implStatus: 'not-started' }),
  cap('D09-C03', 'Events & Meetups', 'D09', { description: 'Community events and gatherings', dependsOn: ['D09-C01', 'D02-C06'], downstream: ['D09-C04'], tags: ['community', 'events'], implStatus: 'not-started' }),
  cap('D09-C04', 'Mentorship Network', 'D09', { description: 'Connect mentors and mentees', dependsOn: ['D09-C01', 'D10-C01'], downstream: ['D09-C05'], tags: ['community', 'mentorship'], implStatus: 'not-started' }),
  cap('D09-C05', 'Feedback Collection', 'D09', { description: 'Gather community feedback and suggestions', dependsOn: ['D09-C01'], downstream: ['D01-C07', 'D03-C06'], tags: ['community', 'feedback'], implStatus: 'not-started' }),
  cap('D09-C06', 'Showcase Gallery', 'D09', { description: 'Display community projects and achievements', dependsOn: ['D09-C01', 'D03-C10'], downstream: ['D19-C01'], tags: ['community', 'showcase'], implStatus: 'not-started' }),
  cap('D09-C07', 'Parent Community', 'D09', { description: 'Parent engagement and communication', dependsOn: ['D09-C01', 'D03-C07'], downstream: [], tags: ['community', 'parents'], implStatus: 'not-started' }),
  cap('D09-C08', 'Alumni Network', 'D09', { description: 'Alumni relations and engagement', dependsOn: ['D09-C01', 'D02-C02'], downstream: ['D20-C01'], tags: ['community', 'alumni'], implStatus: 'not-started' }),

  // D10 - Volunteers (7)
  cap('D10-C01', 'Volunteer Recruitment', 'D10', { description: 'Attract and onboard volunteers', dependsOn: ['D09-C01', 'D02-C01'], downstream: ['D10-C02'], tags: ['volunteers', 'recruitment'], implStatus: 'not-started' }),
  cap('D10-C02', 'Volunteer Matching', 'D10', { description: 'Match volunteers to tasks and programs', dependsOn: ['D10-C01', 'D16-C01'], downstream: ['D10-C03'], tags: ['volunteers', 'matching'], implStatus: 'not-started' }),
  cap('D10-C03', 'Task Management', 'D10', { description: 'Assign and track volunteer tasks', dependsOn: ['D10-C02', 'D14-C01'], downstream: ['D10-C04'], tags: ['volunteers', 'tasks'], implStatus: 'not-started' }),
  cap('D10-C04', 'Training Programs', 'D10', { description: 'Train volunteers for their roles', dependsOn: ['D10-C03', 'D03-C02'], downstream: ['D10-C05'], tags: ['volunteers', 'training'], implStatus: 'not-started' }),
  cap('D10-C05', 'Recognition System', 'D10', { description: 'Recognize and reward volunteer contributions', dependsOn: ['D10-C03', 'D18-C01'], downstream: ['D10-C06'], tags: ['volunteers', 'recognition'], implStatus: 'not-started' }),
  cap('D10-C06', 'Hours Tracking', 'D10', { description: 'Track volunteer service hours', dependsOn: ['D10-C03'], downstream: ['D10-C05', 'D18-C01'], tags: ['volunteers', 'hours'], implStatus: 'not-started' }),
  cap('D10-C07', 'Volunteer Portal', 'D10', { description: 'Self-service portal for volunteers', dependsOn: ['D10-C01', 'D09-C01'], downstream: [], tags: ['volunteers', 'portal'], implStatus: 'not-started' }),

  // D11 - Finance (9)
  cap('D11-C01', 'Budget Management', 'D11', { description: 'Create and manage institutional budgets', dependsOn: ['D02-C01', 'D05-C01'], downstream: ['D11-C02', 'D11-C03'], tags: ['finance', 'budget'], implStatus: 'not-started' }),
  cap('D11-C02', 'Fund Accounting', 'D11', { description: 'Track restricted and unrestricted funds', dependsOn: ['D11-C01', 'D13-C01'], downstream: ['D11-C03'], tags: ['finance', 'funds'], implStatus: 'not-started' }),
  cap('D11-C03', 'Financial Reporting', 'D11', { description: 'Generate financial statements and reports', dependsOn: ['D11-C02', 'D18-C01'], downstream: ['D01-C07', 'D13-C02'], tags: ['finance', 'reporting'], implStatus: 'not-started' }),
  cap('D11-C04', 'Accounts Payable', 'D11', { description: 'Process payments to vendors', dependsOn: ['D11-C01', 'D14-C01'], downstream: ['D11-C05'], tags: ['finance', 'payable'], implStatus: 'not-started' }),
  cap('D11-C05', 'Accounts Receivable', 'D11', { description: 'Collect fees and payments', dependsOn: ['D11-C01', 'D02-C01'], downstream: ['D11-C06'], tags: ['finance', 'receivable'], implStatus: 'not-started' }),
  cap('D11-C06', 'Grant Accounting', 'D11', { description: 'Track grant funds and expenditures', dependsOn: ['D11-C02', 'D04-C02'], downstream: ['D11-C03'], tags: ['finance', 'grants'], implStatus: 'not-started' }),
  cap('D11-C07', 'Payroll', 'D11', { description: 'Process staff payroll', dependsOn: ['D02-C03', 'D11-C04'], downstream: [], tags: ['finance', 'payroll'], implStatus: 'not-started' }),
  cap('D11-C08', 'Tax Compliance', 'D11', { description: 'Tax filings and compliance', dependsOn: ['D11-C03', 'D13-C01'], downstream: ['D12-C01'], tags: ['finance', 'tax'], implStatus: 'not-started' }),
  cap('D11-C09', 'Financial Audit', 'D11', { description: 'Internal and external financial audits', dependsOn: ['D11-C03', 'D13-C01'], downstream: ['D01-C08'], tags: ['finance', 'audit'], implStatus: 'not-started' }),

  // D12 - Legal (7)
  cap('D12-C01', 'Contract Management', 'D12', { description: 'Draft, review, and manage contracts', dependsOn: ['D02-C09', 'D11-C01'], downstream: ['D12-C02'], tags: ['legal', 'contracts'], implStatus: 'not-started' }),
  cap('D12-C02', 'Compliance Monitoring', 'D12', { description: 'Monitor legal compliance', dependsOn: ['D12-C01', 'D13-C01'], downstream: ['D12-C03'], tags: ['legal', 'compliance'], implStatus: 'not-started' }),
  cap('D12-C03', 'Policy Enforcement', 'D12', { description: 'Enforce institutional policies', dependsOn: ['D01-C02', 'D12-C02'], downstream: ['D12-C04'], tags: ['legal', 'enforcement'], implStatus: 'not-started' }),
  cap('D12-C04', 'Incident Response', 'D12', { description: 'Handle legal incidents and disputes', dependsOn: ['D12-C02', 'D01-C06'], downstream: ['D12-C05'], tags: ['legal', 'incidents'], implStatus: 'not-started' }),
  cap('D12-C05', 'Data Protection', 'D12', { description: 'Ensure data privacy compliance', dependsOn: ['D12-C02', 'D17-C05'], downstream: ['D12-C06'], tags: ['legal', 'privacy'], implStatus: 'not-started' }),
  cap('D12-C06', 'Intellectual Property', 'D12', { description: 'Protect institutional IP', dependsOn: ['D12-C01', 'D04-C06'], downstream: [], tags: ['legal', 'ip'], implStatus: 'not-started' }),
  cap('D12-C07', 'Legal Advisory', 'D12', { description: 'Provide legal guidance to departments', dependsOn: ['D12-C01'], downstream: ['D01-C06'], tags: ['legal', 'advisory'], implStatus: 'not-started' }),

  // D13 - Compliance (8)
  cap('D13-C01', 'Regulatory Compliance', 'D13', { description: 'Track and ensure regulatory compliance', dependsOn: ['D01-C02', 'D05-C01'], downstream: ['D13-C02', 'D12-C02'], tags: ['compliance', 'regulatory'], implStatus: 'not-started' }),
  cap('D13-C02', 'Audit Trail', 'D13', { description: 'Maintain complete audit trail', dependsOn: ['D13-C01', 'D17-C04'], downstream: ['D13-C03'], tags: ['compliance', 'audit'], implStatus: 'not-started' }),
  cap('D13-C03', 'Compliance Reporting', 'D13', { description: 'Generate compliance reports', dependsOn: ['D13-C02', 'D18-C01'], downstream: ['D01-C05'], tags: ['compliance', 'reporting'], implStatus: 'not-started' }),
  cap('D13-C04', 'Data Governance', 'D13', { description: 'Manage data quality and standards', dependsOn: ['D13-C01', 'D05-C05'], downstream: ['D13-C05'], tags: ['compliance', 'data-governance'], implStatus: 'not-started' }),
  cap('D13-C05', 'Security Compliance', 'D13', { description: 'Ensure cybersecurity compliance', dependsOn: ['D13-C04', 'D17-C05'], downstream: ['D13-C06'], tags: ['compliance', 'security'], implStatus: 'not-started' }),
  cap('D13-C06', 'Accreditation', 'D13', { description: 'Manage accreditation processes', dependsOn: ['D13-C03', 'D03-C05'], downstream: [], tags: ['compliance', 'accreditation'], implStatus: 'not-started' }),
  cap('D13-C07', 'Disaster Recovery', 'D13', { description: 'Business continuity and disaster recovery', dependsOn: ['D15-C03', 'D13-C05'], downstream: [], tags: ['compliance', 'recovery'], implStatus: 'not-started' }),
  cap('D13-C08', 'Incident Reporting', 'D13', { description: 'Report and track compliance incidents', dependsOn: ['D13-C01', 'D12-C04'], downstream: ['D13-C03'], tags: ['compliance', 'incidents'], implStatus: 'not-started' }),

  // D14 - Operations (8)
  cap('D14-C01', 'Task Orchestration', 'D14', { description: 'Orchestrate cross-department tasks', dependsOn: ['D17-C01', 'D05-C01'], downstream: ['D14-C02'], tags: ['operations', 'tasks'], implStatus: 'not-started' }),
  cap('D14-C02', 'Process Automation', 'D14', { description: 'Automate repetitive business processes', dependsOn: ['D14-C01', 'D17-C01'], downstream: ['D14-C03'], tags: ['operations', 'automation'], implStatus: 'not-started' }),
  cap('D14-C03', 'Workflow Engine', 'D14', { description: 'Execute complex multi-step workflows', dependsOn: ['D14-C02', 'D05-C01'], downstream: ['D14-C04'], tags: ['operations', 'workflow'], implStatus: 'not-started' }),
  cap('D14-C04', 'Queue Management', 'D14', { description: 'Manage task queues and priorities', dependsOn: ['D14-C03', 'D17-C01'], downstream: ['D14-C05'], tags: ['operations', 'queue'], implStatus: 'not-started' }),
  cap('D14-C05', 'SLA Monitoring', 'D14', { description: 'Track service level agreements', dependsOn: ['D14-C04', 'D18-C01'], downstream: ['D14-C06'], tags: ['operations', 'sla'], implStatus: 'not-started' }),
  cap('D14-C06', 'Incident Management', 'D14', { description: 'Handle operational incidents', dependsOn: ['D14-C05', 'D13-C08'], downstream: ['D14-C07'], tags: ['operations', 'incidents'], implStatus: 'not-started' }),
  cap('D14-C07', 'Change Management', 'D14', { description: 'Manage system changes and deployments', dependsOn: ['D14-C06', 'D17-C06'], downstream: ['D14-C08'], tags: ['operations', 'change'], implStatus: 'not-started' }),
  cap('D14-C08', 'Service Desk', 'D14', { description: 'Help desk and support ticketing', dependsOn: ['D14-C01', 'D02-C05'], downstream: [], tags: ['operations', 'support'], implStatus: 'not-started' }),

  // D15 - Infrastructure (7)
  cap('D15-C01', 'Cloud Infrastructure', 'D15', { description: 'Manage cloud compute, storage, networking', dependsOn: ['D17-C05'], downstream: ['D15-C02', 'D15-C03'], tags: ['infra', 'cloud'], implStatus: 'not-started' }),
  cap('D15-C02', 'CI/CD Pipeline', 'D15', { description: 'Continuous integration and deployment', dependsOn: ['D15-C01', 'D17-C06'], downstream: ['D15-C04'], tags: ['infra', 'cicd'], implStatus: 'not-started' }),
  cap('D15-C03', 'Backup & Recovery', 'D15', { description: 'Automated backups and disaster recovery', dependsOn: ['D15-C01'], downstream: ['D13-C07'], tags: ['infra', 'backup'], implStatus: 'not-started' }),
  cap('D15-C04', 'Monitoring & Alerting', 'D15', { description: 'System health monitoring and alerts', dependsOn: ['D15-C01', 'D18-C01'], downstream: ['D15-C05'], tags: ['infra', 'monitoring'], implStatus: 'not-started' }),
  cap('D15-C05', 'Auto Scaling', 'D15', { description: 'Automatic resource scaling', dependsOn: ['D15-C04', 'D15-C01'], downstream: [], tags: ['infra', 'scaling'], implStatus: 'not-started' }),
  cap('D15-C06', 'Network Management', 'D15', { description: 'Network configuration and security', dependsOn: ['D15-C01', 'D17-C05'], downstream: ['D15-C04'], tags: ['infra', 'network'], implStatus: 'not-started' }),
  cap('D15-C07', 'Cost Optimization', 'D15', { description: 'Optimize infrastructure costs', dependsOn: ['D15-C04', 'D11-C03'], downstream: [], tags: ['infra', 'cost'], implStatus: 'not-started' }),

  // D16 - AI & Intelligence (7)
  cap('D16-C01', 'Knowledge Reasoning', 'D16', { description: 'Reason over knowledge graph and KO relationships', dependsOn: ['D05-C03', 'D05-C08'], downstream: ['D16-C02', 'D03-C11'], tags: ['ai', 'reasoning'], implStatus: 'not-started' }),
  cap('D16-C02', 'Content Generation', 'D16', { description: 'Generate educational content via AI', dependsOn: ['D16-C01', 'D05-C01'], downstream: ['D03-C02', 'D08-C01'], tags: ['ai', 'generation'], implStatus: 'partial' }),
  cap('D16-C03', 'Assessment AI', 'D16', { description: 'AI-powered assessment and grading', dependsOn: ['D16-C02', 'D03-C04'], downstream: ['D03-C05'], tags: ['ai', 'assessment'], implStatus: 'not-started' }),
  cap('D16-C04', 'Recommendation Engine', 'D16', { description: 'Recommend learning paths and resources', dependsOn: ['D16-C01', 'D18-C01'], downstream: ['D03-C06', 'D06-C03'], tags: ['ai', 'recommendations'], implStatus: 'not-started' }),
  cap('D16-C05', 'NLP Pipeline', 'D16', { description: 'Natural language processing for education', dependsOn: ['D16-C02'], downstream: ['D16-C06'], tags: ['ai', 'nlp'], implStatus: 'not-started' }),
  cap('D16-C06', 'Computer Vision', 'D16', { description: 'Visual analysis for educational content', dependsOn: ['D16-C05', 'D17-C03'], downstream: ['D16-C07'], tags: ['ai', 'vision'], implStatus: 'not-started' }),
  cap('D16-C07', 'AI Safety & Ethics', 'D16', { description: 'Ensure responsible AI use', dependsOn: ['D16-C01', 'D13-C01'], downstream: [], tags: ['ai', 'safety'], implStatus: 'not-started' }),

  // D17 - Engineering (8)
  cap('D17-C01', 'Runtime Engine', 'D17', { description: 'Core capability resolution and pipeline engine', dependsOn: ['D05-C01'], downstream: ['D14-C01', 'D14-C02', 'D15-C01'], tags: ['engineering', 'runtime'], implStatus: 'implemented' }),
  cap('D17-C02', 'File System Layer', 'D17', { description: 'File-based data persistence and CRUD', dependsOn: [], downstream: ['D05-C01', 'D02-C09'], tags: ['engineering', 'filesystem'], implStatus: 'implemented' }),
  cap('D17-C03', 'Data Store', 'D17', { description: 'Structured data storage (JSON, future DB)', dependsOn: [], downstream: ['D05-C01', 'D05-C03', 'D04-C03'], tags: ['engineering', 'datastore'], implStatus: 'implemented' }),
  cap('D17-C04', 'Version Control', 'D17', { description: 'Version tracking for all artifacts', dependsOn: ['D17-C02'], downstream: ['D05-C06', 'D05-C09', 'D13-C02'], tags: ['engineering', 'versioning'], implStatus: 'implemented' }),
  cap('D17-C05', 'Security Layer', 'D17', { description: 'Authentication, authorization, encryption', dependsOn: [], downstream: ['D12-C05', 'D13-C05', 'D15-C01', 'D15-C06'], tags: ['engineering', 'security'], implStatus: 'not-started' }),
  cap('D17-C06', 'Deployment Engine', 'D17', { description: 'Build and deploy applications', dependsOn: ['D17-C01', 'D15-C02'], downstream: ['D14-C07', 'D15-C02'], tags: ['engineering', 'deployment'], implStatus: 'partial' }),
  cap('D17-C07', 'API Gateway', 'D17', { description: 'API routing, rate limiting, auth', dependsOn: ['D17-C05', 'D17-C01'], downstream: ['D14-C08'], tags: ['engineering', 'api'], implStatus: 'not-started' }),
  cap('D17-C08', 'Event Bus', 'D17', { description: 'Inter-service event messaging', dependsOn: ['D17-C01'], downstream: ['D14-C03', 'D18-C01'], tags: ['engineering', 'events'], implStatus: 'not-started' }),

  // D18 - Analytics (7)
  cap('D18-C01', 'Analytics Engine', 'D18', { description: 'Core analytics and aggregation', dependsOn: ['D17-C03', 'D17-C08'], downstream: ['D18-C02', 'D18-C03'], tags: ['analytics', 'engine'], implStatus: 'not-started' }),
  cap('D18-C02', 'Learning Analytics', 'D18', { description: 'Analyze student learning patterns', dependsOn: ['D18-C01', 'D03-C05'], downstream: ['D18-C03', 'D03-C06'], tags: ['analytics', 'learning'], implStatus: 'not-started' }),
  cap('D18-C03', 'Dashboards', 'D18', { description: 'Interactive analytics dashboards', dependsOn: ['D18-C01'], downstream: ['D01-C07', 'D02-C10'], tags: ['analytics', 'dashboards'], implStatus: 'partial' }),
  cap('D18-C04', 'Predictive Analytics', 'D18', { description: 'Predict student outcomes and trends', dependsOn: ['D18-C02', 'D16-C04'], downstream: ['D03-C11'], tags: ['analytics', 'predictive'], implStatus: 'not-started' }),
  cap('D18-C05', 'Report Builder', 'D18', { description: 'Custom report generation', dependsOn: ['D18-C01', 'D02-C09'], downstream: ['D01-C07', 'D13-C03'], tags: ['analytics', 'reports'], implStatus: 'not-started' }),
  cap('D18-C06', 'Data Export', 'D18', { description: 'Export data in various formats', dependsOn: ['D18-C01'], downstream: [], tags: ['analytics', 'export'], implStatus: 'not-started' }),
  cap('D18-C07', 'Real-time Metrics', 'D18', { description: 'Live system and business metrics', dependsOn: ['D18-C01', 'D15-C04'], downstream: ['D14-C05'], tags: ['analytics', 'realtime'], implStatus: 'not-started' }),

  // D19 - Outreach (6)
  cap('D19-C01', 'Social Media', 'D19', { description: 'Manage social media presence', dependsOn: ['D08-C05', 'D09-C01'], downstream: ['D19-C02'], tags: ['outreach', 'social'], implStatus: 'not-started' }),
  cap('D19-C02', 'Email Campaigns', 'D19', { description: 'Email marketing and newsletters', dependsOn: ['D19-C01', 'D02-C05'], downstream: ['D19-C03'], tags: ['outreach', 'email'], implStatus: 'not-started' }),
  cap('D19-C03', 'SEO & Web Presence', 'D19', { description: 'Search engine optimization', dependsOn: ['D08-C03', 'D19-C01'], downstream: ['D19-C04'], tags: ['outreach', 'seo'], implStatus: 'not-started' }),
  cap('D19-C04', 'Press & Media', 'D19', { description: 'Media relations and press releases', dependsOn: ['D19-C01', 'D01-C08'], downstream: ['D19-C05'], tags: ['outreach', 'press'], implStatus: 'not-started' }),
  cap('D19-C05', 'Brand Ambassadorship', 'D19', { description: 'Represent the institution publicly', dependsOn: ['D19-C01', 'D08-C09'], downstream: [], tags: ['outreach', 'brand'], implStatus: 'not-started' }),
  cap('D19-C06', 'Impact Stories', 'D19', { description: 'Share success stories and impact data', dependsOn: ['D18-C01', 'D09-C06'], downstream: ['D19-C01'], tags: ['outreach', 'stories'], implStatus: 'not-started' }),

  // D20 - Partnerships (6)
  cap('D20-C01', 'Partner Management', 'D20', { description: 'Manage institutional partnerships', dependsOn: ['D02-C01', 'D04-C05'], downstream: ['D20-C02'], tags: ['partnerships', 'management'], implStatus: 'not-started' }),
  cap('D20-C02', 'MOU Management', 'D20', { description: 'Manage memoranda of understanding', dependsOn: ['D20-C01', 'D12-C01'], downstream: ['D20-C03'], tags: ['partnerships', 'mou'], implStatus: 'not-started' }),
  cap('D20-C03', 'Joint Programs', 'D20', { description: 'Run programs with partner institutions', dependsOn: ['D20-C02', 'D03-C01'], downstream: ['D20-C04'], tags: ['partnerships', 'programs'], implStatus: 'not-started' }),
  cap('D20-C04', 'Resource Sharing', 'D20', { description: 'Share resources across institutions', dependsOn: ['D20-C03', 'D06-C07'], downstream: [], tags: ['partnerships', 'sharing'], implStatus: 'not-started' }),
  cap('D20-C05', 'Industry Connections', 'D20', { description: 'Connect with industry partners', dependsOn: ['D20-C01', 'D04-C06'], downstream: ['D20-C06'], tags: ['partnerships', 'industry'], implStatus: 'not-started' }),
  cap('D20-C06', 'Sponsorship Management', 'D20', { description: 'Manage sponsors and funding partners', dependsOn: ['D20-C01', 'D11-C01'], downstream: [], tags: ['partnerships', 'sponsorship'], implStatus: 'not-started' }),

  // D21 - Sustainability (5)
  cap('D21-C01', 'Environmental Impact', 'D21', { description: 'Track and reduce environmental footprint', dependsOn: ['D18-C01', 'D01-C01'], downstream: ['D21-C02'], tags: ['sustainability', 'environment'], implStatus: 'not-started' }),
  cap('D21-C02', 'Social Impact', 'D21', { description: 'Measure social impact and community benefit', dependsOn: ['D18-C01', 'D09-C05'], downstream: ['D21-C03'], tags: ['sustainability', 'social'], implStatus: 'not-started' }),
  cap('D21-C03', 'Financial Sustainability', 'D21', { description: 'Ensure long-term financial viability', dependsOn: ['D11-C03', 'D20-C06'], downstream: ['D21-C04'], tags: ['sustainability', 'financial'], implStatus: 'not-started' }),
  cap('D21-C04', 'Sustainability Reporting', 'D21', { description: 'Publish sustainability reports', dependsOn: ['D21-C01', 'D21-C02', 'D21-C03'], downstream: ['D21-C05'], tags: ['sustainability', 'reporting'], implStatus: 'not-started' }),
  cap('D21-C05', 'Long-term Planning', 'D21', { description: 'Strategic sustainability roadmap', dependsOn: ['D21-C04', 'D01-C01'], downstream: [], tags: ['sustainability', 'planning'], implStatus: 'not-started' })
];

// Validate
const ids = new Set(capabilities.map(c => c.id));
for (const c of capabilities) {
  for (const dep of c.dependsOn) {
    if (!ids.has(dep)) {
      console.error(`ERROR: ${c.id} depends on unknown ${dep}`);
    }
  }
}

// Write individual files
for (const c of capabilities) {
  writeFileSync(join(CAP_DIR, `${c.id}.json`), JSON.stringify(c, null, 2));
}

// Write index
const index = {
  registryVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  totalCapabilities: capabilities.length,
  byDomain: {}
};
for (const c of capabilities) {
  if (!index.byDomain[c.domain]) index.byDomain[c.domain] = [];
  index.byDomain[c.domain].push(c.id);
}
writeFileSync(join(CAP_DIR, 'index.json'), JSON.stringify(index, null, 2));

console.log(`Generated ${capabilities.length} capability entries`);
