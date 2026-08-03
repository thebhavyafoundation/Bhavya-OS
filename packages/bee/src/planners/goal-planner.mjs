/**
 * Goal Planner — parses natural language goals into structured Goal objects.
 * Extracts intent, domain, subject, grade level, and parameters from text.
 */

const INTENT_PATTERNS = [
  { pattern: /\b(create|build|make|generate|produce|develop)\b/i, intent: 'create' },
  { pattern: /\b(update|modify|edit|revise|improve|enhance)\b/i, intent: 'update' },
  { pattern: /\b(publish|release|deploy|ship|launch)\b/i, intent: 'publish' },
  { pattern: /\b(analyze|review|audit|inspect|examine)\b/i, intent: 'analyze' },
  { pattern: /\b(delete|remove|archive|deprecate)\b/i, intent: 'delete' },
  { pattern: /\b(ingest|import|consume|absorb|process)\b/i, intent: 'ingest' },
  { pattern: /\b(design|plan|architect|outline|storyboard)\b/i, intent: 'design' },
  { pattern: /\b(test|validate|verify|check|grade)\b/i, intent: 'validate' },
];

const DOMAIN_KEYWORDS = {
  knowledge: ['knowledge', 'ko', 'concept', 'definition', 'ingest', 'ontolog', 'graph', 'taxonomy', 'paper', 'absorb'],
  academics: ['lesson', 'curriculum', 'course', 'class', 'teach', 'student', 'grade', 'syllabus', 'pedagog', 'learn'],
  research: ['research', 'journal', 'study', 'experiment', 'hypothesis', 'methodology', 'literature'],
  media: ['video', 'audio', 'image', 'visual', 'design', 'banner', 'photo', 'animation', 'graphic'],
  library: ['book', 'catalog', 'archive', 'reference', 'citation', 'bibliography'],
  publications: ['article', 'blog', 'post', 'newsletter', 'report', 'whitepaper'],
  community: ['event', 'volunteer', 'member', 'outreach', 'engagement'],
  engineering: ['deploy', 'build', 'ci', 'cd', 'infrastructure', 'api', 'code'],
  analytics: ['metric', 'dashboard', 'report', 'kpi', 'data', 'visualization'],
  governance: ['policy', 'compliance', 'audit', 'governance', 'regulation'],
  operations: ['workflow', 'process', 'pipeline', 'automation'],
  finance: ['budget', 'grant', 'fund', 'donation', 'expense'],
};

const SUBJECT_KEYWORDS = {
  biology: ['biology', 'bio', 'cell', 'genetic', 'ecology', 'organism', 'evolution', 'anatomy'],
  mathematics: ['math', 'algebra', 'geometry', 'calculus', 'statistics', 'arithmetic'],
  physics: ['physics', 'mechanics', 'thermodynamic', 'electromagnetic', 'quantum'],
  chemistry: ['chemistry', 'chemical', 'element', 'compound', 'reaction', 'molecule'],
  computer_science: ['programming', 'algorithm', 'data structure', 'ai', 'machine learning', 'software'],
  english: ['english', 'grammar', 'writing', 'literature', 'composition', 'reading'],
  history: ['history', 'civilization', 'war', 'revolution', 'empire', 'ancient'],
  environmental_science: ['environment', 'climate', 'sustainability', 'ecosystem', 'pollution'],
};

const GRADE_PATTERNS = [
  { pattern: /\bgrade\s*(\d{1,2})\b/i, capture: 1 },
  { pattern: /\b(\d{1,2})(?:st|nd|rd|th)\s*grade\b/i, capture: 1 },
  { pattern: /\b(primary|elementary|middle|high school|secondary|senior)\b/i, map: { primary: '1-5', elementary: '1-5', middle: '6-8', 'high school': '9-12', secondary: '9-12', senior: '11-12' } },
];

/**
 * Parse a natural language goal into a structured Goal object.
 * @param {string} text
 * @returns {import('../types.mjs').Goal}
 */
export function parseGoal(text) {
  const lower = text.toLowerCase();

  // Classify intent
  let intent = 'create'; // default
  for (const { pattern, intent: i } of INTENT_PATTERNS) {
    if (pattern.test(text)) { intent = i; break; }
  }

  // Classify domain
  let domain = 'academics'; // default
  let maxHits = 0;
  for (const [d, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const hits = keywords.filter(k => lower.includes(k)).length;
    if (hits > maxHits) { maxHits = hits; domain = d; }
  }

  // Extract subject
  let subject = null;
  let maxSubjectHits = 0;
  for (const [s, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    const hits = keywords.filter(k => lower.includes(k)).length;
    if (hits > maxSubjectHits) { maxSubjectHits = hits; subject = s; }
  }

  // Extract grade level
  let gradeLevel = null;
  for (const { pattern, capture, map } of GRADE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      if (capture) gradeLevel = match[capture];
      else if (map) gradeLevel = map[match[1].toLowerCase()];
      break;
    }
  }

  // Extract parameters
  const params = {};
  if (gradeLevel) params.gradeLevel = gradeLevel;
  if (subject) params.subject = subject;

  // Count-based extraction
  const countMatch = text.match(/(\d+)\s*(questions?|problems?|exercises?|quizzes?|mcq)/i);
  if (countMatch) {
    params.itemCount = parseInt(countMatch[1]);
    params.itemType = countMatch[2].toLowerCase();
  }

  return { text, intent, domain, subject, gradeLevel, params, capabilities: [] };
}
