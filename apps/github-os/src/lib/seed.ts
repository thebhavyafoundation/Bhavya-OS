import { getDb } from "./db";

export function seedData() {
  const db = getDb();

  const repoCount = db
    .prepare("SELECT COUNT(*) as count FROM repositories")
    .get() as { count: number };
  if (repoCount.count > 0) return;

  const repos = [
    {
      id: "bhavya-platform",
      name: "bhavya-platform",
      slug: "bhavya-platform",
      description:
        "Core platform packages — types, security, database, events, workflows",
      language: "TypeScript",
      stars: 45,
      topics: '["platform","infrastructure"]',
      health_score: 92,
      technology_score: 88,
    },
    {
      id: "knowledge-studio",
      name: "knowledge-studio",
      slug: "knowledge-studio",
      description: "Knowledge management and lesson creation IDE",
      language: "TypeScript",
      stars: 32,
      topics: '["knowledge","education"]',
      health_score: 85,
      technology_score: 82,
    },
    {
      id: "github-intelligence-lab",
      name: "github-intelligence-lab",
      slug: "github-intelligence-lab",
      description:
        "GitHub research modules — UI, architecture, automation, courses",
      language: "TypeScript",
      stars: 28,
      topics: '["research","github"]',
      health_score: 78,
      technology_score: 85,
    },
    {
      id: "bhavya-intelligence-network",
      name: "bhavya-intelligence-network",
      slug: "bhavya-intelligence-network",
      description:
        "Autonomous intelligence loop — discover, analyze, recommend",
      language: "TypeScript",
      stars: 35,
      topics: '["intelligence","automation"]',
      health_score: 80,
      technology_score: 90,
    },
    {
      id: "open-source-intelligence",
      name: "open-source-intelligence",
      slug: "open-source-intelligence",
      description: "OSIP — open source project analysis and recommendations",
      language: "TypeScript",
      stars: 22,
      topics: '["osint","analysis"]',
      health_score: 75,
      technology_score: 78,
    },
    {
      id: "capability-center",
      name: "capability-center",
      slug: "capability-center",
      description:
        "Capability registry — score, recommend, and manage engineering capabilities",
      language: "TypeScript",
      stars: 18,
      topics: '["capabilities","registry"]',
      health_score: 82,
      technology_score: 80,
    },
    {
      id: "design-system",
      name: "design-system",
      slug: "design-system",
      description: "Shared UI components and design tokens",
      language: "TypeScript",
      stars: 40,
      topics: '["ui","design"]',
      health_score: 88,
      technology_score: 92,
    },
    {
      id: "runtime-engine",
      name: "runtime-engine",
      slug: "runtime-engine",
      description:
        "Capability engine, knowledge pipeline, course and lesson managers",
      language: "JavaScript",
      stars: 55,
      topics: '["runtime","engine"]',
      health_score: 90,
      technology_score: 85,
    },
  ];

  const insertRepo = db.prepare(`
    INSERT INTO repositories (id, name, slug, description, language, stars, topics, health_score, technology_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const repo of repos) {
    insertRepo.run(
      repo.id,
      repo.name,
      repo.slug,
      repo.description,
      repo.language,
      repo.stars,
      repo.topics,
      repo.health_score,
      repo.technology_score,
    );
  }

  const kps = [
    {
      id: "kp-1",
      repository_id: "bhavya-platform",
      category: "architecture",
      title: "Platform Foundation v2.0 — 11 shared packages",
      content:
        "Built 11 shared packages: platform, types, security, database, api, events, workflows, ai, providers, notifications, platform-ui. Zero circular dependencies enforced by layer model.",
      quality_score: 95,
    },
    {
      id: "kp-2",
      repository_id: "knowledge-studio",
      category: "engineering",
      title: "Knowledge Studio — 6-tab lesson management",
      content:
        "Lesson Studio implements 6 tabs: Content, Assessment, Guide, Workbook, Preview, Publish. Visual spec and video builders enabled. Full pipeline in 173ms.",
      quality_score: 88,
    },
    {
      id: "kp-3",
      repository_id: "github-intelligence-lab",
      category: "research",
      title: "GIL Research Modules — 4 internal domains",
      content:
        "Four research modules: UI discovery, architecture analysis, automation patterns, AI education. All kept internal per ADR-001 — not promoted to packages.",
      quality_score: 82,
    },
    {
      id: "kp-4",
      repository_id: "bhavya-intelligence-network",
      category: "intelligence",
      title: "BIN Intelligence Loop — 12-step pipeline",
      content:
        "Autonomous intelligence loop: Discover → Normalize → Deduplicate → Analyze → Extract Patterns → Generate Knowledge Package → Update Radar → Update Capabilities → Generate Recommendations → Notify → Approve → Apply.",
      quality_score: 90,
    },
    {
      id: "kp-5",
      repository_id: "design-system",
      category: "ui",
      title: "Design System — 10 shared components",
      content:
        "Ten shared React components: Sidebar, StatCard, StatusBadge, Modal, DataTable, SearchBar, EmptyState, LoadingState, ErrorState, Tabs, PageLayout. Dark mode first, glassmorphism.",
      quality_score: 92,
    },
    {
      id: "kp-6",
      repository_id: "runtime-engine",
      category: "architecture",
      title: "Runtime Engine — 9-step capability pipeline",
      content:
        "Capability engine resolves capabilities from registry, runs 9-step pipeline, dynamic builder loading, quality gates (10 gates, 30+ checks), observability metrics.",
      quality_score: 94,
    },
  ];

  const insertKP = db.prepare(`
    INSERT INTO knowledge_packages (id, repository_id, category, title, content, quality_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const kp of kps) {
    insertKP.run(
      kp.id,
      kp.repository_id,
      kp.category,
      kp.title,
      kp.content,
      kp.quality_score,
    );
  }

  const activities = [
    {
      id: "act-1",
      type: "commit",
      entity_type: "repository",
      entity_id: "bhavya-platform",
      title: "Platform Foundation v2.0 committed",
      description: "11 shared packages, 0 circular dependencies",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "act-2",
      type: "knowledge",
      entity_type: "knowledge_package",
      entity_id: "kp-1",
      title: "Knowledge Package created: Platform Foundation",
      description: "Architecture documentation for 11 packages",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "act-3",
      type: "discovery",
      entity_type: "repository",
      entity_id: "github-intelligence-lab",
      title: "GIL research modules analyzed",
      description: "4 internal research modules documented",
      created_at: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "act-4",
      type: "recommendation",
      entity_type: "recommendation",
      entity_id: "rec-1",
      title: "MCP recommendation: Install GitHub MCP",
      description: "Core integration for repository management",
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: "act-5",
      type: "commit",
      entity_type: "repository",
      entity_id: "bhavya-intelligence-network",
      title: "BIN v1.0 intelligence loop deployed",
      description: "12-step autonomous intelligence pipeline",
      created_at: new Date(Date.now() - 18000000).toISOString(),
    },
  ];

  const insertActivity = db.prepare(`
    INSERT INTO activity_events (id, type, entity_type, entity_id, title, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const act of activities) {
    insertActivity.run(
      act.id,
      act.type,
      act.entity_type,
      act.entity_id,
      act.title,
      act.description,
      act.created_at,
    );
  }

  const radar = [
    {
      id: "radar-1",
      name: "Next.js",
      category: "frameworks",
      ring: "adopt",
      description: "React framework with SSR, SSG, and App Router",
      score: 95,
    },
    {
      id: "radar-2",
      name: "TypeScript",
      category: "languages",
      ring: "adopt",
      description: "Type-safe JavaScript",
      score: 98,
    },
    {
      id: "radar-3",
      name: "Tailwind CSS",
      category: "frameworks",
      ring: "adopt",
      description: "Utility-first CSS framework",
      score: 90,
    },
    {
      id: "radar-4",
      name: "SQLite",
      category: "databases",
      ring: "adopt",
      description: "Embedded database for local-first apps",
      score: 88,
    },
    {
      id: "radar-5",
      name: "MCP",
      category: "protocols",
      ring: "trial",
      description: "Model Context Protocol for AI integrations",
      score: 82,
    },
    {
      id: "radar-6",
      name: "Ollama",
      category: "ai",
      ring: "trial",
      description: "Local LLM inference",
      score: 80,
    },
    {
      id: "radar-7",
      name: "Playwright",
      category: "testing",
      ring: "adopt",
      description: "Browser automation and testing",
      score: 92,
    },
    {
      id: "radar-8",
      name: "Vitest",
      category: "testing",
      ring: "adopt",
      description: "Fast unit test framework",
      score: 88,
    },
  ];

  const insertRadar = db.prepare(`
    INSERT INTO technology_radar (id, name, category, ring, description, score)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const r of radar) {
    insertRadar.run(r.id, r.name, r.category, r.ring, r.description, r.score);
  }

  const recs = [
    {
      id: "rec-1",
      type: "mcp",
      title: "Install GitHub MCP",
      description: "Core integration for repository management via MCP",
      priority: "high",
      status: "pending",
    },
    {
      id: "rec-2",
      type: "mcp",
      title: "Install Filesystem MCP",
      description: "Local file operations for code access",
      priority: "high",
      status: "pending",
    },
    {
      id: "rec-3",
      type: "tool",
      title: "Standardize ripgrep",
      description: "Fast search tool for codebase exploration",
      priority: "medium",
      status: "accepted",
    },
    {
      id: "rec-4",
      type: "tool",
      title: "Standardize fzf",
      description: "Fuzzy finder for terminal productivity",
      priority: "medium",
      status: "accepted",
    },
    {
      id: "rec-5",
      type: "action",
      title: "Create CI workflow",
      description: "Standard CI pipeline for all repositories",
      priority: "high",
      status: "pending",
    },
  ];

  const insertRec = db.prepare(`
    INSERT INTO recommendations (id, type, title, description, priority, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const r of recs) {
    insertRec.run(r.id, r.type, r.title, r.description, r.priority, r.status);
  }
}
