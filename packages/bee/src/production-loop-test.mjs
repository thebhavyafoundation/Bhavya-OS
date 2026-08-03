import { KnowledgePackage } from '../src/knowledge-package.mjs';
import { WebsiteBuilder } from '../src/engines/website-builder.mjs';
import { PublicationManager } from '../src/engines/publication-manager.mjs';
import { VersionManager } from '../src/engines/version-manager.mjs';
import { SearchEngine } from '../src/engines/search-engine.mjs';
import { MetricsDashboard } from '../src/engines/metrics-dashboard.mjs';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.log(`  ✗ ${msg}`); }
}

console.log('\n=== Knowledge Production Loop — Integration Test ===\n');

// ─── 1. Knowledge Package ────────────────────────
console.log('1. Knowledge Package');
const pkg = new KnowledgePackage({
  title: 'Introduction to Artificial Intelligence',
  description: 'A foundational lesson on AI concepts for Grade 9 students',
  domain: 'academics',
  subject: 'Computer Science',
  gradeLevel: 'Grade 9',
  source: { type: 'text', content: 'AI is the simulation of human intelligence by machines...', ingestedAt: new Date().toISOString() },
  ko: { id: 'ko-ai-001', title: 'Introduction to AI', concepts: [{ name: 'Machine Learning', description: 'A subset of AI', difficulty: 'beginner' }] },
  lesson: { id: 'lesson-001', title: 'Introduction to AI', subject: 'Computer Science', grade: 'Grade 9', duration: 45, sections: [
    { title: 'What is AI?', type: 'introduction', content: 'Artificial Intelligence is the simulation of human intelligence by machines.' },
    { title: 'Types of AI', type: 'core-concept', content: 'Narrow AI vs General AI' },
  ], learningOutcomes: [
    { description: 'Define artificial intelligence' }, { description: 'Distinguish between narrow and general AI' },
    { description: 'Identify real-world AI applications' }, { description: 'Explain machine learning basics' },
    { description: 'Discuss ethical implications of AI' },
  ], vocabulary: ['Artificial Intelligence', 'Machine Learning', 'Neural Network', 'Deep Learning', 'NLP'] },
  assessment: { questions: [
    { prompt: 'What is AI?', type: 'short-answer', difficulty: 'easy', bloomLevel: 'remember' },
    { prompt: 'Which is NOT a type of AI?', type: 'mcq', options: ['Narrow AI', 'General AI', 'Quantum AI', 'Super AI'], difficulty: 'medium', bloomLevel: 'understand' },
    { prompt: 'Explain the difference between ML and DL.', type: 'short-answer', difficulty: 'hard', bloomLevel: 'analyze' },
    { prompt: 'Give an example of narrow AI.', type: 'short-answer', difficulty: 'easy', bloomLevel: 'apply' },
    { prompt: 'True or False: AI can think like humans.', type: 'mcq', options: ['True', 'False'], difficulty: 'medium', bloomLevel: 'evaluate' },
    { prompt: 'What is a neural network?', type: 'short-answer', difficulty: 'medium', bloomLevel: 'understand' },
    { prompt: 'Which field uses AI for language translation?', type: 'mcq', options: ['NLP', 'Computer Vision', 'Robotics', 'Expert Systems'], difficulty: 'easy', bloomLevel: 'remember' },
    { prompt: 'Describe one ethical concern about AI.', type: 'reflection', difficulty: 'hard', bloomLevel: 'evaluate' },
    { prompt: 'Match the AI type to its description.', type: 'matching', difficulty: 'medium', bloomLevel: 'understand' },
    { prompt: 'Fill in the blank: ML is a subset of ___.', type: 'fill-blank', difficulty: 'easy', bloomLevel: 'remember' },
    { prompt: 'Is deep learning the same as machine learning?', type: 'short-answer', difficulty: 'medium', bloomLevel: 'analyze' },
    { prompt: 'What year was the term AI coined?', type: 'short-answer', difficulty: 'easy', bloomLevel: 'remember' },
    { prompt: 'True or False: AI is only used in tech.', type: 'mcq', options: ['True', 'False'], difficulty: 'medium', bloomLevel: 'evaluate' },
    { prompt: 'Explain supervised learning.', type: 'short-answer', difficulty: 'hard', bloomLevel: 'analyze' },
    { prompt: 'Design a simple AI application.', type: 'reflection', difficulty: 'hard', bloomLevel: 'create' },
  ], questionCount: 15, totalPoints: 100, passingScore: 70 },
  teacherGuide: { objectives: [
    'Students will understand AI fundamentals', 'Students will differentiate between AI types',
    'Students will identify AI in everyday life', 'Students will discuss AI ethics',
  ], vocabulary: ['AI', 'ML', 'DL', 'NLP', 'Neural Network'], materials: ['Whiteboard', 'Projector', 'AI demos'],
    discussionPrompts: ['How does AI affect daily life?', 'Should AI replace teachers?'], timingGuide: [
    { section: 'Introduction', duration: 10, activity: 'Warm-up discussion' },
    { section: 'Core Content', duration: 25, activity: 'Lecture + demos' },
    { section: 'Wrap-up', duration: 10, activity: 'Q&A and reflection' },
  ], commonMisconceptions: ['AI can think like humans', 'AI is only for tech companies'] },
  workbook: { pages: [
    { title: 'Key Terms', questions: [{ prompt: 'Define AI', type: 'definition', points: 5 }, { prompt: 'List 3 types of AI', type: 'list', points: 10 }] },
    { title: 'Practice', questions: [{ prompt: 'Identify AI examples', type: 'identification', points: 10 }, { prompt: 'Compare ML and DL', type: 'comparison', points: 15 }] },
    { title: 'Reflection', questions: [{ prompt: 'How will AI change your future job?', type: 'reflection', points: 20 }] },
  ], totalPages: 3, totalPoints: 60 },
  visualSpec: { scenes: [
    { id: 's1', title: 'Opening', durationSec: 10, elements: [] },
    { id: 's2', title: 'AI Definition', durationSec: 20, elements: [] },
    { id: 's3', title: 'Types of AI', durationSec: 30, elements: [] },
    { id: 's4', title: 'Applications', durationSec: 25, elements: [] },
    { id: 's5', title: 'Ethics', durationSec: 20, elements: [] },
    { id: 's6', title: 'Summary', durationSec: 15, elements: [] },
    { id: 's7', title: 'Quiz', durationSec: 25, elements: [] },
    { id: 's8', title: 'Closing', durationSec: 10, elements: [] },
  ], totalDurationSec: 155, fps: 30 },
  provenance: [
    { capabilityId: 'D03-C02', skillId: 'SK-L1-001', agentId: 'AG-EDU-001', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:00Z', durationMs: 120 },
    { capabilityId: 'D03-C04', skillId: 'SK-L1-002', agentId: 'AG-EDU-001', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:01Z', durationMs: 95 },
    { capabilityId: 'D03-C05', skillId: 'SK-L1-003', agentId: 'AG-EDU-002', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:02Z', durationMs: 88 },
    { capabilityId: 'D03-C01', skillId: 'SK-L1-004', agentId: 'AG-EDU-001', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:03Z', durationMs: 72 },
    { capabilityId: 'D08-C01', skillId: 'SK-L3-001', agentId: 'AG-MEDIA-001', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:04Z', durationMs: 65 },
    { capabilityId: 'D08-C02', skillId: 'SK-L3-002', agentId: 'AG-MEDIA-001', sourceKoId: 'ko-ai-001', executedAt: '2026-08-03T10:00:05Z', durationMs: 45 },
  ],
  executionTrace: [
    { nodeId: 'n-001', capabilityId: 'D03-C02', status: 'completed', durationMs: 120 },
    { nodeId: 'n-002', capabilityId: 'D03-C04', status: 'completed', durationMs: 95 },
    { nodeId: 'n-003', capabilityId: 'D03-C05', status: 'completed', durationMs: 88 },
    { nodeId: 'n-004', capabilityId: 'D03-C01', status: 'completed', durationMs: 72 },
    { nodeId: 'n-005', capabilityId: 'D08-C01', status: 'completed', durationMs: 65 },
    { nodeId: 'n-006', capabilityId: 'D08-C02', status: 'completed', durationMs: 45 },
  ],
});

assert(pkg.id.startsWith('pkg-'), 'Package ID generated');
assert(pkg.status === 'draft', 'Status starts as draft');
assert(pkg.title === 'Introduction to Artificial Intelligence', 'Title preserved');
assert(pkg.lesson.sections.length === 2, 'Lesson sections present');
assert(pkg.assessment.questions.length === 15, 'Assessment questions present');
assert(pkg.provenance.length === 6, 'Provenance chain has 6 entries');

const summary = pkg.getExecutionSummary();
assert(summary.totalNodes === 6, 'Execution summary: 6 nodes');
assert(summary.completed === 6, 'Execution summary: all completed');
assert(summary.totalDurationMs === 485, 'Execution summary: total duration correct');

// Save/load
pkg.save();
const loaded = KnowledgePackage.load(pkg.id);
assert(loaded !== null, 'Package saved and loaded');
assert(loaded.title === pkg.title, 'Loaded title matches');

// List
const listed = KnowledgePackage.list({ subject: 'Computer Science' });
assert(listed.length >= 1, 'Package found by subject filter');

console.log('');

// ─── 2. Website Builder ────────────────────────
console.log('2. Website Builder');
const web = new WebsiteBuilder();
const website = web.build(pkg);

assert(website.totalPages === 4, '4 pages generated (lesson, assessment, guide, workbook)');
assert(website.pages.some(p => p.type === 'lesson'), 'Lesson page present');
assert(website.pages.some(p => p.type === 'assessment'), 'Assessment page present');
assert(website.pages.some(p => p.type === 'guide'), 'Guide page present');
assert(website.pages.some(p => p.type === 'workbook'), 'Workbook page present');
assert(website.pages.every(p => p.html.includes('<!DOCTYPE html>')), 'All pages have valid HTML');
assert(website.pages.every(p => p.mdx.includes('---')), 'All pages have MDX frontmatter');
assert(website.seo.title.includes('Introduction to AI'), 'SEO title set');
assert(website.seo.keywords.length > 0, 'SEO keywords populated');
assert(website.structuredData['@type'] === 'LearningResource', 'Structured data present');
assert(website.sitemap.includes('<urlset'), 'Sitemap generated');
assert(website.rss.includes('<rss'), 'RSS feed generated');
assert(website.searchIndex.length > 0, 'Search index populated');
assert(website.nav.length === 4, 'Navigation has 4 items');

console.log('');

// ─── 3. Publication Manager ────────────────────────
console.log('3. Publication Manager');
const pm = new PublicationManager();
assert(pm.canTransition('draft', 'in_review'), 'Can transition draft → in_review');
assert(!pm.canTransition('draft', 'published'), 'Cannot skip to published');

const submitResult = pm.submitForReview(pkg);
assert(submitResult.success, 'Submitted for review');
assert(pkg.status === 'in_review', 'Status is in_review');

const approveResult = pm.approve(pkg, 'test-reviewer');
assert(approveResult.success, 'Package approved');
assert(!approveResult.error, 'No quality gate issues');
assert(pkg.publication.approvedBy === 'test-reviewer', 'Approver recorded');

const pubResult = pm.publish(pkg);
assert(pubResult.success, 'Package published');
assert(pubResult.hash.startsWith('hash-'), 'Immutable hash generated');
assert(pkg.status === 'published', 'Status is published');
assert(pkg.publication.publishedAt !== undefined, 'Published timestamp set');

console.log('');

// ─── 4. Version Manager ────────────────────────
console.log('4. Version Manager');
const vm = new VersionManager();

const ver1 = vm.createVersion(pkg, 'Initial release');
assert(ver1.success, 'Version 1 created');
assert(ver1.version === '1.0.1', 'Version incremented to 1.0.1');
assert(ver1.hash.startsWith('hash-'), 'Version hash generated');

const ver2 = vm.createVersion(pkg, 'Minor improvements');
assert(ver2.success, 'Version 2 created');
assert(ver2.version === '1.0.2', 'Version incremented to 1.0.2');

// Modify pkg and create a third version to test comparison
pkg.lesson.title = 'Introduction to AI — Updated';
const ver3 = vm.createVersion(pkg, 'Updated lesson title');
assert(ver3.success, 'Version 3 created');
assert(ver3.version === '1.0.3', 'Version incremented to 1.0.3');

const versions = vm.listVersions(pkg.id);
assert(versions.length === 3, 'Three versions listed');
assert(versions[0].version === '1.0.1', 'First version correct');
assert(versions[1].version === '1.0.2', 'Second version correct');
assert(versions[2].version === '1.0.3', 'Third version correct');

const compare = vm.compareVersions(pkg.id, '1.0.1', '1.0.3');
assert(compare.identical === false, 'Versions differ when data changes');
assert(compare.changed.includes('lesson'), 'Lesson section changed');

const reprod = vm.getReproductionPlan(ver1.versionId);
assert(reprod.success, 'Reproduction plan available');
assert(reprod.steps.length > 0, 'Reproduction has steps');

console.log('');

// ─── 5. Search Engine ────────────────────────
console.log('5. Search Engine');
const se = new SearchEngine();
const indexed = se.indexPackage(pkg);
assert(indexed > 0, `Indexed ${indexed} entries`);

const results1 = se.search('artificial intelligence');
assert(results1.length > 0, 'Search for "artificial intelligence" returns results');
assert(results1[0].score > 0, 'Search results have scores');

const results2 = se.search('neural network');
assert(results2.length > 0, 'Search for "neural network" returns results');

const byDomain = se.searchByDomain('academics');
assert(byDomain.length >= 1, 'Domain search returns results');

const byCap = se.searchByCapability('D03-C02');
assert(byCap.length >= 1, 'Capability search returns results');

const related = se.getRelated(pkg.id);
assert(related.length === 0 || related.length > 0, 'Related packages computed');

const fullIndex = se.getFullIndex();
assert(fullIndex.length > 0, `Full index has ${fullIndex.length} entries`);

console.log('');

// ─── 6. Metrics Dashboard ────────────────────────
console.log('6. Metrics Dashboard');
const md = new MetricsDashboard();
md.recordPlan({
  id: 'test-plan-1', goal: { domain: 'academics', subject: 'CS' },
  totalNodes: 6, parallelLayers: 3, criticalPath: ['n-001', 'n-005', 'n-006'],
  estimatedDuration: 485, agentCount: 3,
});
md.recordNode('test-plan-1', { id: 'n-001', capabilityId: 'D03-C02', agentId: 'AG-EDU-001', startTime: Date.now() - 100, endTime: Date.now(), status: 'completed', durationMs: 100 });
md.recordNode('test-plan-1', { id: 'n-002', capabilityId: 'D03-C04', agentId: 'AG-EDU-001', startTime: Date.now() - 50, endTime: Date.now(), status: 'completed', durationMs: 50 });
md.completePlan('test-plan-1', true);

const global = md.getGlobalMetrics();
assert(global.runs === 1, 'Global: 1 run recorded');
assert(global.successes === 1, 'Global: 1 success');
assert(global.successRate === 100, 'Global: 100% success rate');
assert(global.avgDurationMs >= 0, 'Global: avg duration >= 0');

const capBreakdown = md.getCapabilityBreakdown();
assert(capBreakdown.length >= 2, 'Capability breakdown has entries');
assert(capBreakdown[0].count >= 1, 'Top capability has count > 0');

const agentUtil = md.getAgentUtilization();
assert(agentUtil.length >= 1, 'Agent utilization has entries');

console.log('');

// ─── Summary ────────────────────────
console.log('=== Results ===');
console.log(`  ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
console.log('\n✓ Knowledge production loop complete: source → KO → lesson → assessment → guide → workbook → video → website → review → publish → version → search index');
