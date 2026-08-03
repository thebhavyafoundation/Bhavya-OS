import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(process.cwd());
const KB_DIR = join(ROOT, 'bhavya-ai-lab', 'knowledge', 'objects');
const ARTIFACTS_DIR = join(ROOT, 'bhavya-ai-lab', 'knowledge-studio', 'artifacts');
const PIPELINES_DIR = join(ROOT, 'bhavya-ai-lab', 'knowledge-studio', 'pipelines');

function ensureDir(dir) { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); }

// ─── KO Creation ────────────────────────────────
function createKO(input) {
  const id = `ko-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const text = input.text;
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  const ko = {
    id, title: input.title, domain: input.domain || 'academics',
    subject: input.subject, gradeLevel: input.gradeLevel || '8',
    description: text.slice(0, 200), sourceType: 'text',
    concepts: sentences.slice(0, 8).map((s, i) => ({
      name: s.split(' ').slice(0, 5).join(' '),
      description: s,
      difficulty: i < 3 ? 'beginner' : 'intermediate',
    })),
    definitions: sentences.slice(0, 6).map(s => ({
      term: s.split(' ').slice(0, 3).join(' '),
      definition: s,
    })),
    examples: [{ title: 'Application', description: sentences[0] }],
    misconceptions: [{ misconception: 'Surface understanding', correction: 'Deep understanding needed' }],
    exercises: sentences.slice(0, 4).map(s => ({
      prompt: `Explain: ${s.split(' ').slice(0, 6).join(' ')}...`,
      type: 'short-answer', difficulty: 'intermediate',
    })),
    metadata: { wordCount: text.split(/\s+/).length },
    createdAt: new Date().toISOString(),
  };
  ensureDir(KB_DIR);
  writeFileSync(join(KB_DIR, `${id}.json`), JSON.stringify(ko, null, 2));
  return ko;
}

// ─── Load Builders ──────────────────────────────
import { pathToFileURL } from 'url';
const builderDir = join(ROOT, 'packages', 'runtime', 'builders');
const [lessonMod, assessmentMod, teacherMod, workbookMod, visualMod, videoMod] = await Promise.all([
  import(pathToFileURL(join(builderDir, 'lesson.mjs')).href),
  import(pathToFileURL(join(builderDir, 'assessment.mjs')).href),
  import(pathToFileURL(join(builderDir, 'teacher-guide.mjs')).href),
  import(pathToFileURL(join(builderDir, 'workbook.mjs')).href),
  import(pathToFileURL(join(builderDir, 'visual-spec.mjs')).href),
  import(pathToFileURL(join(builderDir, 'video.mjs')).href),
]);

// ─── Execute Pipeline ───────────────────────────
console.log('=== Knowledge Studio Integration Test ===\n');

// Step 1: Create KO
const ko = createKO({
  title: 'Introduction to Cell Biology',
  text: 'The cell is the basic structural and functional unit of all living organisms. Cells are often called the building blocks of life. The study of cells is called cell biology. Cells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids. Cells can reproduce through cell division. There are two main types of cells: prokaryotic and eukaryotic. Prokaryotic cells, such as bacteria, lack a nucleus and membrane-bound organelles. Eukaryotic cells, found in plants and animals, have a defined nucleus and specialized organelles like mitochondria, endoplasmic reticulum, and Golgi apparatus. The cell theory states that all organisms are composed of one or more cells, that cells are the basic unit of structure and function in organisms, and that all cells arise from pre-existing cells.',
  domain: 'academics', subject: 'biology', gradeLevel: '8',
});

console.log(`Step 1: KO Created — ${ko.id}`);
console.log(`  Title: ${ko.title}`);
console.log(`  Concepts: ${ko.concepts.length}`);
console.log(`  Definitions: ${ko.definitions.length}`);
console.log('');

// Step 2-8: Execute builders
const planId = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const results = [];
ensureDir(ARTIFACTS_DIR);

// Lesson
console.log('Step 2: Generating Lesson...');
const lessonResult = await lessonMod.execute({ knowledgeObject: ko });
const lesson = lessonResult.output.lesson;
console.log(`  ✓ Lesson: ${lesson.title} (${lesson.sections.length} sections, ${lesson.learningOutcomes.length} outcomes)`);

const lessonArt = { id: `art-${Date.now()}-lesson`, planId, type: 'lesson', nodeId: 'n-001', capabilityId: 'D03-C02', data: lesson, provenance: { capabilityId: 'D03-C02', skillId: 'SK-L1-001', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${lessonArt.id}.json`), JSON.stringify(lessonArt, null, 2));
results.push(lessonArt);

// Assessment
console.log('Step 3: Generating Assessment...');
const assessResult = await assessmentMod.execute({ lesson, knowledgeObject: ko });
const assessment = assessResult.output.assessment;
console.log(`  ✓ Assessment: ${assessment.questionCount} questions (${assessment.questions.filter(q => q.type === 'mcq').length} MCQ)`);

const assessArt = { id: `art-${Date.now()}-assessment`, planId, type: 'assessment', nodeId: 'n-002', capabilityId: 'D03-C04', data: assessment, provenance: { capabilityId: 'D03-C04', skillId: 'SK-L1-002', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${assessArt.id}.json`), JSON.stringify(assessArt, null, 2));
results.push(assessArt);

// Teacher Guide
console.log('Step 4: Generating Teacher Guide...');
const guideResult = await teacherMod.execute({ lesson, knowledgeObject: ko });
const guide = guideResult.output.teacherGuide;
console.log(`  ✓ Teacher Guide: ${guide.objectives.length} objectives, ${guide.materials.length} materials`);

const guideArt = { id: `art-${Date.now()}-guide`, planId, type: 'teacher-guide', nodeId: 'n-003', capabilityId: 'D03-C05', data: guide, provenance: { capabilityId: 'D03-C05', skillId: 'SK-L1-003', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${guideArt.id}.json`), JSON.stringify(guideArt, null, 2));
results.push(guideArt);

// Workbook
console.log('Step 5: Generating Workbook...');
const wbResult = await workbookMod.execute({ lesson, knowledgeObject: ko });
const workbook = wbResult.output.workbook;
console.log(`  ✓ Workbook: ${workbook.totalPages} pages, ${workbook.totalPoints} points`);

const wbArt = { id: `art-${Date.now()}-workbook`, planId, type: 'workbook', nodeId: 'n-004', capabilityId: 'D03-C01', data: workbook, provenance: { capabilityId: 'D03-C01', skillId: 'SK-L1-004', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${wbArt.id}.json`), JSON.stringify(wbArt, null, 2));
results.push(wbArt);

// Visual Spec
console.log('Step 6: Generating Visual Spec...');
const vsResult = await visualMod.execute({ lesson });
const visualSpec = vsResult.output.visualSpec;
console.log(`  ✓ Visual Spec: ${visualSpec.totalScenes} scenes, ${visualSpec.totalDuration}ms`);

const vsArt = { id: `art-${Date.now()}-visual-spec`, planId, type: 'visual-spec', nodeId: 'n-005', capabilityId: 'D08-C01', data: visualSpec, provenance: { capabilityId: 'D08-C01', skillId: 'SK-L3-001', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${vsArt.id}.json`), JSON.stringify(vsArt, null, 2));
results.push(vsArt);

// Video
console.log('Step 7: Generating Video Spec...');
const vidResult = await videoMod.execute({ visualSpec, lesson });
const video = vidResult.output.video;
console.log(`  ✓ Video: ${video.compositions} compositions, ${video.durationSeconds}s at ${video.fps}fps`);

const vidArt = { id: `art-${Date.now()}-video`, planId, type: 'video', nodeId: 'n-006', capabilityId: 'D08-C02', data: video, provenance: { capabilityId: 'D08-C02', skillId: 'SK-L3-002', sourceKoId: ko.id }, createdAt: new Date().toISOString() };
writeFileSync(join(ARTIFACTS_DIR, `${vidArt.id}.json`), JSON.stringify(vidArt, null, 2));
results.push(vidArt);

// ─── Summary ────────────────────────────────────
console.log('\n=== Pipeline Complete ===');
console.log(`Plan ID: ${planId}`);
console.log(`Artifacts: ${results.length}`);
console.log(`Types: ${results.map(a => a.type).join(' → ')}`);
console.log('');
console.log('Provenance Chain:');
for (const art of results) {
  console.log(`  ${art.type}: capability=${art.provenance.capabilityId}, skill=${art.provenance.skillId}, source=${art.provenance.sourceKoId}`);
}
console.log('');
console.log(`All artifacts saved to: ${ARTIFACTS_DIR}`);
console.log('✓ Integration test passed');
