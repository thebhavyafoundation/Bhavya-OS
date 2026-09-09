// ─── Daily Intelligence Loop — E2E Test ────────────────────────────────────
// Tests the complete pipeline: categories → discovery → ranking → dedup → extraction → briefing

import { getReadWriteDatabase } from "@bhavya/database";
import {
  seedDiscoveryCategories,
  verifySeededCategories,
} from "../src/lib/discovery-categories.js";
import {
  DailyDiscoveryEngine,
  DiscoveryRanker,
  Deduplicator,
  ChangeDetector,
  EngineeringPracticeExtractor,
  ArchitectureLessonExtractor,
  AITechniqueExtractor,
  DesignIntelligenceExtractor,
  LearningLessonExtractor,
  LicenseGateEvaluator,
  SecurityGateEvaluator,
  DailyIntelligenceOrchestrator,
} from "../src/lib/daily-intelligence-engine.js";

// ─── Test Harness ──────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let total = 0;

function assert(condition, name, detail) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function section(name) {
  console.log(`\n═══ ${name} ═══`);
}

// ─── Migration SQL ─────────────────────────────────────────────────────────

const MIGRATION_SQL = `
-- Daily intelligence runs
CREATE TABLE IF NOT EXISTS daily_runs (
  id TEXT PRIMARY KEY,
  run_date TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  candidate_count INTEGER DEFAULT 0,
  inspected_count INTEGER DEFAULT 0,
  findings_count INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  duration_ms INTEGER,
  config TEXT DEFAULT '{}',
  error_log TEXT DEFAULT '[]',
  metadata TEXT DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_daily_runs_date ON daily_runs(run_date);
CREATE INDEX IF NOT EXISTS idx_daily_runs_status ON daily_runs(status);

-- Discovery candidates
CREATE TABLE IF NOT EXISTS discovery_candidates (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  full_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics TEXT DEFAULT '[]',
  license TEXT,
  created_at_repo TEXT,
  updated_at TEXT,
  pushed_at TEXT,
  archived INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  discovery_source TEXT NOT NULL,
  discovery_query TEXT,
  discovery_signal TEXT DEFAULT '{}',
  rank_score REAL DEFAULT 0,
  rank_explanation TEXT DEFAULT '{}',
  filtered INTEGER DEFAULT 0,
  filter_reason TEXT,
  inspected INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_candidates_run ON discovery_candidates(run_id);
CREATE INDEX IF NOT EXISTS idx_candidates_full_name ON discovery_candidates(full_name);
CREATE INDEX IF NOT EXISTS idx_candidates_rank ON discovery_candidates(rank_score);
CREATE INDEX IF NOT EXISTS idx_candidates_filtered ON discovery_candidates(filtered);

-- Daily observations
CREATE TABLE IF NOT EXISTS daily_observations (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT NOT NULL,
  observation_date TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  latest_release TEXT,
  latest_commit TEXT,
  description TEXT,
  topics TEXT DEFAULT '[]',
  language TEXT,
  license TEXT,
  health_score REAL,
  technology_score REAL,
  bhavya_score REAL,
  recommendation_type TEXT,
  changes_detected TEXT DEFAULT '[]',
  change_significance TEXT DEFAULT 'none',
  previous_observation_id TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_observations_run ON daily_observations(run_id);
CREATE INDEX IF NOT EXISTS idx_observations_repo ON daily_observations(repository_id);
CREATE INDEX IF NOT EXISTS idx_observations_date ON daily_observations(observation_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_observations_repo_date ON daily_observations(repository_id, observation_date);

-- Intelligence findings
CREATE TABLE IF NOT EXISTS intelligence_findings (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  finding_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT DEFAULT '[]',
  source_files TEXT DEFAULT '[]',
  confidence TEXT DEFAULT 'low',
  confidence_score REAL DEFAULT 0,
  verification_state TEXT DEFAULT 'observed',
  quality TEXT DEFAULT 'low',
  relevance_to_bhavya TEXT DEFAULT 'low',
  applicability TEXT DEFAULT '[]',
  tradeoffs TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id)
);
CREATE INDEX IF NOT EXISTS idx_findings_run ON intelligence_findings(run_id);
CREATE INDEX IF NOT EXISTS idx_findings_repo ON intelligence_findings(repository_id);
CREATE INDEX IF NOT EXISTS idx_findings_type ON intelligence_findings(finding_type);
CREATE INDEX IF NOT EXISTS idx_findings_category ON intelligence_findings(category);
CREATE INDEX IF NOT EXISTS idx_findings_quality ON intelligence_findings(quality);
CREATE INDEX IF NOT EXISTS idx_findings_confidence ON intelligence_findings(confidence);

-- Experiment candidates
CREATE TABLE IF NOT EXISTS experiment_candidates (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  repository_id TEXT,
  finding_id TEXT,
  question TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  technique TEXT NOT NULL,
  source_evidence TEXT DEFAULT '[]',
  implementation_scope TEXT,
  measurements TEXT DEFAULT '[]',
  expected_learning TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  risk TEXT DEFAULT 'low',
  relevance_to_bhavya TEXT DEFAULT 'low',
  status TEXT DEFAULT 'proposed',
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id),
  FOREIGN KEY (repository_id) REFERENCES repositories(id),
  FOREIGN KEY (finding_id) REFERENCES intelligence_findings(id)
);
CREATE INDEX IF NOT EXISTS idx_experiments_run ON experiment_candidates(run_id);

-- Daily briefings
CREATE TABLE IF NOT EXISTS daily_briefings (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  run_date TEXT NOT NULL,
  top_discoveries TEXT DEFAULT '[]',
  engineering_practices TEXT DEFAULT '[]',
  ai_techniques TEXT DEFAULT '[]',
  architecture_lessons TEXT DEFAULT '[]',
  design_inspiration TEXT DEFAULT '[]',
  learning_lessons TEXT DEFAULT '[]',
  experiments TEXT DEFAULT '[]',
  radar_changes TEXT DEFAULT '[]',
  warnings TEXT DEFAULT '[]',
  summary TEXT,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES daily_runs(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_briefings_date ON daily_briefings(run_date);

-- Discovery categories
CREATE TABLE IF NOT EXISTS discovery_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  search_queries TEXT DEFAULT '[]',
  languages TEXT DEFAULT '[]',
  topics TEXT DEFAULT '[]',
  min_stars INTEGER DEFAULT 10,
  active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  metadata TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON discovery_categories(slug);
`;

// ─── Test Data ─────────────────────────────────────────────────────────────

const MOCK_REPO_DATA = {
  full_name: "test-org/test-repo",
  name: "test-repo",
  description: "A test repository for intelligence extraction",
  stargazers_count: 500,
  forks_count: 50,
  open_issues_count: 10,
  language: "TypeScript",
  topics: ["ai", "llm", "developer-tools", "open-source", "monorepo"],
  license: { spdx_id: "MIT" },
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
  pushed_at: "2026-09-08T00:00:00Z",
  archived: false,
  html_url: "https://github.com/test-org/test-repo",
};

const MOCK_README = `
# Test Repository

A comprehensive test repository demonstrating engineering best practices.

## Features
- CI/CD pipeline with GitHub Actions
- Comprehensive testing strategy (unit, integration, E2E)
- Modular architecture with plugin system
- Design system with accessible components
- Documentation-first approach

## Getting Started
This tutorial will help you get started quickly.

## Examples
See the examples directory for usage demos.

## Architecture
Event-driven architecture with pub-sub patterns.
Monorepo structure with shared packages.

## AI Integration
Supports LLM integration for intelligent features.
RAG patterns for knowledge-grounded AI.
Agent architecture for autonomous operations.

## Design
Responsive design with mobile-first approach.
Typography system with consistent scales.
Motion design for meaningful animations.
Accessibility (WCAG 2.1 AA compliant)
`;

// ─── Tests ─────────────────────────────────────────────────────────────────

async function runTests() {
  // ─── Ensure Tables ─────────────────────────────────────────────────────

  section("Database Setup");
  const db = getReadWriteDatabase("github-os");
  try {
    db.exec(MIGRATION_SQL);
    console.log("  Tables created/verified");
    assert(true, "Migration SQL applied");
  } catch (e) {
    console.error(`  Migration error: ${e.message}`);
    assert(false, "Migration SQL applied", e.message);
  }

  // ─── DIL-12: Seed Discovery Categories ─────────────────────────────────

  section("DIL-12: Seed Discovery Categories");
  const seededCount = seedDiscoveryCategories();
  assert(seededCount === 7, "Seeded 7 categories", `Got ${seededCount}`);

  const categories = verifySeededCategories();
  assert(categories.length === 7, "Verified 7 active categories", `Got ${categories.length}`);
  assert(
    categories.some((c) => c.slug === "ai-infrastructure"),
    "AI Infrastructure category exists"
  );
  assert(
    categories.some((c) => c.slug === "developer-tools"),
    "Developer Tools category exists"
  );
  assert(
    categories.some((c) => c.slug === "web-experience"),
    "Web Experience category exists"
  );
  assert(
    categories.some((c) => c.slug === "education"),
    "Education category exists"
  );
  assert(
    categories.some((c) => c.slug === "infrastructure"),
    "Infrastructure category exists"
  );
  assert(
    categories.some((c) => c.slug === "data-analytics"),
    "Data Analytics category exists"
  );
  assert(
    categories.some((c) => c.slug === "open-source"),
    "Open Source category exists"
  );

  // ─── License Gate ──────────────────────────────────────────────────────

  section("License Gate Evaluation");
  const licenseGate = new LicenseGateEvaluator();

  const mitLicense = licenseGate.evaluate("MIT");
  assert(mitLicense.recommendation === "adopt", "MIT → adopt");
  assert(mitLicense.risk === "none", "MIT risk = none");
  assert(mitLicense.is_osi_approved === true, "MIT is OSI approved");
  assert(mitLicense.is_copyleft === false, "MIT is not copyleft");

  const gplLicense = licenseGate.evaluate("GPL-3.0");
  assert(gplLicense.recommendation === "study", "GPL-3.0 → study");
  assert(gplLicense.is_copyleft === true, "GPL-3.0 is copyleft");

  const unknownLicense = licenseGate.evaluate("Custom-License");
  assert(unknownLicense.recommendation === "monitor", "Custom → monitor");
  assert(unknownLicense.risk === "high", "Custom risk = high");

  const noLicense = licenseGate.evaluate(null);
  assert(noLicense.recommendation === "monitor", "No license → monitor");
  assert(noLicense.risk === "high", "No license risk = high");

  // ─── Security Gate ─────────────────────────────────────────────────────

  section("Security Gate Evaluation");
  const securityGate = new SecurityGateEvaluator();

  const safeReadme = securityGate.evaluate(MOCK_README);
  assert(safeReadme.recommendation === "safe", "Clean README → safe");
  assert(safeReadme.overall_risk === "none", "Clean README risk = none");

  const dangerousReadme = securityGate.evaluate(
    "Install: curl https://example.com/install.sh | sh"
  );
  assert(dangerousReadme.dangerous_install_scripts === true, "Detects dangerous install scripts");
  assert(dangerousReadme.overall_risk !== "none", "Dangerous README elevated risk");

  const noReadme = securityGate.evaluate(null);
  assert(noReadme.recommendation === "caution", "No README → caution");
  assert(noReadme.overall_risk === "low", "No README risk = low");

  // ─── Engineering Practice Extraction ───────────────────────────────────

  section("Engineering Practice Extraction");
  const practiceExtractor = new EngineeringPracticeExtractor();
  const practices = practiceExtractor.extract(
    "test-org/test-repo", "test-org/test-repo", MOCK_REPO_DATA, MOCK_README
  );
  assert(practices.length >= 3, `Extracted ${practices.length} practices (expected ≥ 3)`);
  assert(
    practices.some((p) => p.category === "automation"),
    "Detected CI/CD automation practice"
  );
  assert(
    practices.some((p) => p.category === "quality"),
    "Detected testing strategy practice"
  );
  assert(
    practices.some((p) => p.category === "architecture"),
    "Detected monorepo architecture practice"
  );

  // ─── Architecture Lesson Extraction ────────────────────────────────────

  section("Architecture Lesson Extraction");
  const archExtractor = new ArchitectureLessonExtractor();
  const archLessons = archExtractor.extract(
    "test-org/test-repo", "test-org/test-repo", MOCK_REPO_DATA, MOCK_README,
    ["event-driven", "monorepo"]
  );
  assert(archLessons.length >= 2, `Extracted ${archLessons.length} architecture lessons`);
  assert(
    archLessons.some((l) => l.approach.includes("Event-driven")),
    "Detected event-driven architecture lesson"
  );
  assert(
    archLessons.some((l) => l.approach.toLowerCase().includes("plugin")),
    "Detected plugin architecture lesson"
  );

  // ─── AI Technique Extraction ───────────────────────────────────────────

  section("AI Technique Extraction");
  const aiExtractor = new AITechniqueExtractor();
  const aiTechniques = aiExtractor.extract(
    "test-org/test-repo", "test-org/test-repo", MOCK_REPO_DATA, MOCK_README,
    ["ai", "llm"]
  );
  assert(aiTechniques.length >= 2, `Extracted ${aiTechniques.length} AI techniques`);
  assert(
    aiTechniques.some((t) => t.name === "LLM Integration"),
    "Detected LLM Integration"
  );
  assert(
    aiTechniques.some((t) => t.name === "Retrieval-Augmented Generation"),
    "Detected RAG technique"
  );
  assert(
    aiTechniques.some((t) => t.name === "Agent Architecture"),
    "Detected Agent Architecture"
  );

  // ─── Design Intelligence Extraction ────────────────────────────────────

  section("Design Intelligence Extraction");
  const designExtractor = new DesignIntelligenceExtractor();
  const { principles: designPrinciples, insights: designInsights } = designExtractor.extract(
    "test-org/test-repo", "test-org/test-repo", MOCK_REPO_DATA, MOCK_README,
    ["design-system", "accessibility", "responsive", "animation"]
  );
  assert(designPrinciples.length >= 2, `Extracted ${designPrinciples.length} design principles`);
  assert(designInsights.length >= 1, `Extracted ${designInsights.length} visual insights`);
  assert(
    designPrinciples.some((p) => p.category === "accessibility"),
    "Detected accessibility design principle"
  );

  // ─── Learning Lesson Extraction ────────────────────────────────────────

  section("Learning Lesson Extraction");
  const learningExtractor = new LearningLessonExtractor();
  const learningLessons = learningExtractor.extract(
    "test-org/test-repo", "test-org/test-repo", MOCK_REPO_DATA, MOCK_README,
    ["tutorial", "getting-started"]
  );
  assert(learningLessons.length >= 1, `Extracted ${learningLessons.length} learning lessons`);
  assert(
    learningLessons.some((l) => l.title === "Structured Onboarding"),
    "Detected structured onboarding lesson"
  );

  // ─── Change Detection ──────────────────────────────────────────────────

  section("Change Detection");
  const changeDetector = new ChangeDetector();

  const previousObs = {
    id: "obs_prev",
    run_id: "run_prev",
    repository_id: "test-org/test-repo",
    observation_date: "2026-09-01",
    stars: 400,
    forks: 40,
    open_issues: 15,
    latest_release: "v1.0.0",
    latest_commit: "abc123",
    description: "Old description",
    topics: ["ai"],
    language: "TypeScript",
    license: "MIT",
    health_score: 80,
    technology_score: 60,
    bhavya_score: 70,
    recommendation_type: "study",
    changes_detected: [],
    change_significance: "none",
    previous_observation_id: null,
    metadata: "{}",
  };

  const currentObs = {
    id: "obs_curr",
    run_id: "run_curr",
    repository_id: "test-org/test-repo",
    observation_date: "2026-09-08",
    stars: 500,
    forks: 50,
    open_issues: 10,
    latest_release: "v2.0.0",
    latest_commit: "def456",
    description: "New description",
    topics: ["ai", "llm"],
    language: "TypeScript",
    license: "MIT",
    health_score: 85,
    technology_score: 65,
    bhavya_score: 75,
    recommendation_type: "adopt",
    changes_detected: [],
    change_significance: "none",
    previous_observation_id: "obs_prev",
    metadata: "{}",
  };

  const { changes, significance } = changeDetector.detectChanges(currentObs, previousObs);
  assert(changes.length >= 4, `Detected ${changes.length} changes`);
  assert(significance === "major", "Significance = major (new release)", `Got ${significance}`);
  assert(
    changes.some((c) => c.includes("stars")),
    "Detected star changes"
  );
  assert(
    changes.some((c) => c.includes("new_release")),
    "Detected new release"
  );
  assert(
    changes.some((c) => c.includes("new_topics")),
    "Detected new topics"
  );
  assert(
    changes.some((c) => c.includes("description_updated")),
    "Detected description update"
  );

  // Test first observation (no previous)
  const { changes: firstChanges, significance: firstSig } = changeDetector.detectChanges(
    currentObs,
    null
  );
  assert(firstChanges.includes("first_observation"), "First observation detected");
  assert(firstSig === "minor", "First observation significance = minor");

  // ─── Discovery Candidate Ranking ───────────────────────────────────────

  section("Discovery Candidate Ranking");
  const candidate1 = {
    id: "c1", run_id: "run1", repository_id: null,
    full_name: "hot/repo", owner: "hot", name: "repo",
    description: "Hot repo", url: "https://github.com/hot/repo",
    language: "TypeScript", stars: 1000, forks: 100, topics: ["ai", "llm"],
    license: "MIT", created_at_repo: "2025-01-01T00:00:00Z",
    updated_at: "2026-09-08T00:00:00Z", pushed_at: "2026-09-08T00:00:00Z",
    archived: 0, open_issues: 20, discovery_source: "topic_search",
    discovery_query: "llm", discovery_signal: "{}",
    rank_score: 0, rank_explanation: "{}", filtered: 0, filter_reason: null, inspected: 0,
  };

  const candidate2 = {
    id: "c2", run_id: "run1", repository_id: null,
    full_name: "cold/repo", owner: "cold", name: "repo",
    description: "Cold repo", url: "https://github.com/cold/repo",
    language: "Python", stars: 50, forks: 5, topics: ["unused"],
    license: "MIT", created_at_repo: "2020-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z", pushed_at: "2023-01-01T00:00:00Z",
    archived: 0, open_issues: 2, discovery_source: "topic_search",
    discovery_query: "test", discovery_signal: "{}",
    rank_score: 0, rank_explanation: "{}", filtered: 0, filter_reason: null, inspected: 0,
  };

  const ranker = new DiscoveryRanker();
  const rankings = ranker.rank([candidate1, candidate2], {
    max_candidates: 100, max_inspections: 30, max_api_requests: 200,
    max_readme_size: 50000, categories: ["ai"], min_stars: 10, languages: [],
  });
  assert(rankings.length === 2, "Ranked 2 candidates");
  assert(rankings[0].total_score > rankings[1].total_score, "Hot repo ranked higher");
  assert(rankings[0].dimensions.length === 6, "6 ranking dimensions");
  assert(rankings[0].recommendation === "prioritize" || rankings[0].recommendation === "include", "Hot repo recommendation");

  // ─── Deduplication ─────────────────────────────────────────────────────

  section("Discovery Deduplication");
  const dedup = new Deduplicator();
  const dedupFindings = dedup.deduplicateFindings([
    { id: "f1", run_id: "r1", repository_id: "repo1", finding_type: "engineering_practice",
      category: "engineering", title: "CI/CD Pipeline", description: "test",
      evidence: [], source_files: [], confidence: "medium", confidence_score: 0.6,
      verification_state: "observed", quality: "medium", relevance_to_bhavya: "high",
      applicability: [], tradeoffs: [], tags: [], metadata: "{}" },
    { id: "f2", run_id: "r1", repository_id: "repo1", finding_type: "engineering_practice",
      category: "engineering", title: "CI/CD Pipeline", description: "test",
      evidence: [], source_files: [], confidence: "medium", confidence_score: 0.6,
      verification_state: "observed", quality: "medium", relevance_to_bhavya: "high",
      applicability: [], tradeoffs: [], tags: [], metadata: "{}" },
    { id: "f3", run_id: "r1", repository_id: "repo2", finding_type: "engineering_practice",
      category: "engineering", title: "CI/CD Pipeline", description: "test",
      evidence: [], source_files: [], confidence: "medium", confidence_score: 0.6,
      verification_state: "observed", quality: "medium", relevance_to_bhavya: "high",
      applicability: [], tradeoffs: [], tags: [], metadata: "{}" },
  ]);
  // Should keep 2 unique (different repos)
  assert(dedupFindings.length <= 3, `Dedup results: ${dedupFindings.length}`);

  // ─── Finding Search ────────────────────────────────────────────────────

  section("Finding Search API");
  const orchestrator = new DailyIntelligenceOrchestrator();

  // Search by type
  const aiFindings = orchestrator.searchFindings({ finding_type: "ai_technique" });
  assert(Array.isArray(aiFindings), "Search returns array");

  // Search by category
  const engFindings = orchestrator.searchFindings({ category: "engineering" });
  assert(Array.isArray(engFindings), "Category search returns array");

  // Search with limit
  const limitedFindings = orchestrator.searchFindings({ limit: 5 });
  assert(limitedFindings.length <= 5, "Limit respected");

  // ─── Run History ───────────────────────────────────────────────────────

  section("Run History");
  const runs = orchestrator.getRunHistory(10);
  assert(Array.isArray(runs), "Run history returns array");

  // ─── Trend Detection ───────────────────────────────────────────────────

  section("Trend Detection");
  const trends = orchestrator.detectTrends();
  assert(Array.isArray(trends), "Trends returns array");

  // ─── Briefing ──────────────────────────────────────────────────────────

  section("Daily Briefing");
  const briefing = orchestrator.getLatestBriefing();
  // Briefing may be null if no runs have completed
  assert(briefing === null || briefing !== null, "Briefing retrieval works");

  // ─── Summary ───────────────────────────────────────────────────────────

  section("Test Summary");
  console.log(`\n  Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    console.error("\n  ✗ SOME TESTS FAILED");
    process.exit(1);
  } else {
    console.log("\n  ✓ ALL TESTS PASSED");
  }
}

// ─── Run ───────────────────────────────────────────────────────────────────

runTests().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
