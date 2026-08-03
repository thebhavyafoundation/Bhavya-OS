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
      forks: 8,
      license: "MIT",
      topics: '["platform","infrastructure","packages"]',
      health_score: 92,
      technology_score: 88,
      bhavya_score: 90,
      engineering_maturity: "mature",
      architecture_summary:
        "Layered architecture with 11 shared packages. Foundation Layer (platform, types, security) → Data Layer (database) → Communication Layer (api, events, workflows) → Integration Layer (ai, providers, notifications) → Presentation Layer (platform-ui). Zero circular dependencies enforced.",
      folder_structure:
        '{"packages":{"platform":"ID generation, fs utilities","types":"30+ canonical domain types","security":"Auth, rate limiting, crypto","database":"SQLite abstraction, migrations","api":"ApiClient, ApiError, middleware","events":"EventBus with history, retry","workflows":"DAG workflow engine","ai":"AiProviderRegistry, PromptRegistry","providers":"Git, Storage, Email, Search providers","notifications":"NotificationManager, channels","platform-ui":"10 shared React components"}}',
      readme_content:
        "# Bhavya Platform\n\nCore platform packages for Bhavya OS.",
      readme_summary:
        "Foundation layer providing 11 shared packages for the Bhavya OS ecosystem. Implements layered architecture with zero circular dependencies.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","database":"SQLite","styling":"Tailwind CSS 4","testing":"Vitest","build":"Turborepo","package_manager":"pnpm"}',
      patterns:
        '["Provider Pattern","Repository Pattern","Event Bus","Strategy Pattern"]',
      dependencies: '["next","react","better-sqlite3","lucide-react"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v2.0.0",
      latest_commit: "Platform Foundation v2.0 committed",
      why_bhavya_cares:
        "Core infrastructure that all other packages depend on. Defines the architectural patterns and conventions for the entire ecosystem.",
      learning_difficulty: "intermediate",
      learning_prerequisites:
        '["TypeScript basics","Node.js","Package management"]',
      learning_reading_order:
        "Start with @bhavya/types to understand the domain model, then @bhavya/platform for utilities, then @bhavya/database for data access.",
      mcp_recommendations: '["GitHub MCP","Filesystem MCP"]',
      cli_recommendations: '["pnpm","turbo","vitest"]',
      recommendation_type: "adopt",
    },
    {
      id: "knowledge-studio",
      name: "knowledge-studio",
      slug: "knowledge-studio",
      description: "Knowledge management and lesson creation IDE",
      language: "TypeScript",
      stars: 32,
      forks: 5,
      license: "MIT",
      topics: '["knowledge","education","studio"]',
      health_score: 85,
      technology_score: 82,
      bhavya_score: 84,
      engineering_maturity: "developing",
      architecture_summary:
        "Next.js App Router with 6-tab lesson management. Content, Assessment, Guide, Workbook, Preview, Publish tabs. Visual spec and video builders enabled.",
      folder_structure:
        '{"src":{"app":"Next.js pages","components":"React components","lib":"Utilities and database"}}',
      readme_content:
        "# Knowledge Studio\n\nKnowledge management and lesson creation IDE.",
      readme_summary:
        "A comprehensive IDE for creating and managing educational content. Supports 6 tabs for different aspects of lesson creation.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","database":"SQLite","styling":"Tailwind CSS 4","auth":"NextAuth v4"}',
      patterns: '["Tab-based UI","CRUD Operations","Form Validation"]',
      dependencies: '["next","react","better-sqlite3","next-auth","bcryptjs"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "Knowledge Studio with 6-tab management",
      why_bhavya_cares:
        "Primary tool for creating educational content. Demonstrates the knowledge extraction and management patterns.",
      learning_difficulty: "beginner",
      learning_prerequisites: '["React basics","Next.js basics"]',
      learning_reading_order:
        "Start with the page layout, then explore each tab's implementation.",
      mcp_recommendations: '["Filesystem MCP"]',
      cli_recommendations: '["pnpm","next"]',
      recommendation_type: "adopt",
    },
    {
      id: "github-intelligence-lab",
      name: "github-intelligence-lab",
      slug: "github-intelligence-lab",
      description:
        "GitHub research modules — UI, architecture, automation, courses",
      language: "TypeScript",
      stars: 28,
      forks: 3,
      license: "MIT",
      topics: '["research","github","intelligence"]',
      health_score: 78,
      technology_score: 85,
      bhavya_score: 80,
      engineering_maturity: "developing",
      architecture_summary:
        "Four internal research modules: UI discovery, architecture analysis, automation patterns, AI education. All kept internal per ADR-001.",
      folder_structure:
        '{"src":{"research":{"ui":"UI discovery modules","architecture":"Architecture analysis","automation":"Automation patterns","courses":"AI education"}}}',
      readme_content:
        "# GitHub Intelligence Lab\n\nResearch modules for GitHub analysis.",
      readme_summary:
        "Internal research lab with 4 modules analyzing different aspects of engineering platforms.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","research":"Internal modules"}',
      patterns: '["Research Module Pattern","Internal Package Pattern"]',
      dependencies:
        '["next","react","@bhavya/github-intelligence","@bhavya/mcp-manager"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "GIL research modules documented",
      why_bhavya_cares:
        "Research backbone that feeds intelligence into the platform. Demonstrates how to structure research modules.",
      learning_difficulty: "advanced",
      learning_prerequisites:
        '["TypeScript","Research methodology","GitHub API"]',
      learning_reading_order:
        "Start with the research directory structure, then dive into each module.",
      mcp_recommendations: '["GitHub MCP","Playwright MCP"]',
      cli_recommendations: '["gh","git"]',
      recommendation_type: "study",
    },
    {
      id: "bhavya-intelligence-network",
      name: "bhavya-intelligence-network",
      slug: "bhavya-intelligence-network",
      description:
        "Autonomous intelligence loop — discover, analyze, recommend",
      language: "TypeScript",
      stars: 35,
      forks: 6,
      license: "MIT",
      topics: '["intelligence","automation","loop"]',
      health_score: 80,
      technology_score: 90,
      bhavya_score: 85,
      engineering_maturity: "mature",
      architecture_summary:
        "12-step autonomous intelligence loop: Discover → Normalize → Deduplicate → Analyze → Extract Patterns → Generate Knowledge Package → Update Radar → Update Capabilities → Generate Recommendations → Notify → Approve → Apply.",
      folder_structure:
        '{"src":{"app":"Next.js pages","lib":{"engine":"Intelligence loop engine","events":"Domain events"}}}',
      readme_content:
        "# Bhavya Intelligence Network\n\nAutonomous intelligence loop.",
      readme_summary:
        "Self-operating intelligence system that continuously discovers, analyzes, and recommends engineering improvements.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","events":"Custom EventBus","engine":"12-step pipeline"}',
      patterns:
        '["Event Bus","Pipeline Pattern","Observer Pattern","State Machine"]',
      dependencies: '["next","react"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "BIN v1.0 intelligence loop deployed",
      why_bhavya_cares:
        "Core intelligence engine that powers all automated analysis and recommendations.",
      learning_difficulty: "expert",
      learning_prerequisites:
        '["Event-driven architecture","Pipeline design","TypeScript"]',
      learning_reading_order:
        "Start with the engine.ts file to understand the pipeline, then explore event types.",
      mcp_recommendations: '["GitHub MCP","Search MCP"]',
      cli_recommendations: '["node","pnpm"]',
      recommendation_type: "adopt",
    },
    {
      id: "open-source-intelligence",
      name: "open-source-intelligence",
      slug: "open-source-intelligence",
      description: "OSIP — open source project analysis and recommendations",
      language: "TypeScript",
      stars: 22,
      forks: 4,
      license: "MIT",
      topics: '["osint","analysis","open-source"]',
      health_score: 75,
      technology_score: 78,
      bhavya_score: 76,
      engineering_maturity: "developing",
      architecture_summary:
        "Open Source Intelligence Platform for analyzing and recommending open source projects. Uses crawlers, analyzers, and knowledge extraction.",
      folder_structure:
        '{"src":{"app":"Dashboard","lib":{"crawlers":"Data collection","analyzers":"Analysis engines","extraction":"Knowledge extraction"}}}',
      readme_content: "# Open Source Intelligence\n\nOSIP platform.",
      readme_summary:
        "Platform for analyzing open source projects and generating recommendations.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","crawlers":"Custom crawlers","analysis":"Bhavya Score"}',
      patterns: '["Crawler Pattern","Analyzer Pattern","Knowledge Extraction"]',
      dependencies: '["next","react","@bhavya/crawlers","@bhavya/analyzers"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "OSIP with Bhavya Score",
      why_bhavya_cares:
        "Source of external intelligence that feeds into technology radar and recommendations.",
      learning_difficulty: "intermediate",
      learning_prerequisites: '["Web scraping","Data analysis","TypeScript"]',
      learning_reading_order:
        "Start with the dashboard to understand the UI, then explore crawlers and analyzers.",
      mcp_recommendations: '["Playwright MCP","Fetch MCP"]',
      cli_recommendations: '["curl","jq"]',
      recommendation_type: "study",
    },
    {
      id: "capability-center",
      name: "capability-center",
      slug: "capability-center",
      description:
        "Capability registry — score, recommend, and manage engineering capabilities",
      language: "TypeScript",
      stars: 18,
      forks: 2,
      license: "MIT",
      topics: '["capabilities","registry","scoring"]',
      health_score: 82,
      technology_score: 80,
      bhavya_score: 81,
      engineering_maturity: "developing",
      architecture_summary:
        "Capability registry with 12-factor Bhavya Score. Scores capabilities and generates recommendations.",
      folder_structure:
        '{"src":{"app":"Dashboard","lib":{"scoring":"Bhavya Score calculator","registry":"Capability registry"}}}',
      readme_content: "# Capability Center\n\nCapability registry.",
      readme_summary:
        "Registry for scoring and managing engineering capabilities using the 12-factor Bhavya Score.",
      tech_stack:
        '{"framework":"Next.js 15","language":"TypeScript","scoring":"12-factor model"}',
      patterns:
        '["Registry Pattern","Scoring Pattern","Recommendation Engine"]',
      dependencies: '["next","react"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "Capability Center with scoring",
      why_bhavya_cares:
        "Central registry for evaluating and recommending engineering capabilities.",
      learning_difficulty: "intermediate",
      learning_prerequisites:
        '["Scoring systems","Registry patterns","TypeScript"]',
      learning_reading_order:
        "Start with the scoring algorithm, then explore the registry interface.",
      mcp_recommendations: '["Filesystem MCP"]',
      cli_recommendations: '["node","pnpm"]',
      recommendation_type: "monitor",
    },
    {
      id: "design-system",
      name: "design-system",
      slug: "design-system",
      description: "Shared UI components and design tokens",
      language: "TypeScript",
      stars: 40,
      forks: 7,
      license: "MIT",
      topics: '["ui","design","components"]',
      health_score: 88,
      technology_score: 92,
      bhavya_score: 90,
      engineering_maturity: "mature",
      architecture_summary:
        "10 shared React components with dark mode first design. Glassmorphism aesthetic inspired by Linear, Vercel, Raycast.",
      folder_structure:
        '{"src":{"components":"10 shared components","tokens":"Design tokens","styles":"Global styles"}}',
      readme_content: "# Design System\n\nShared UI components.",
      readme_summary:
        "Design system providing 10 shared React components with dark mode first, glassmorphism aesthetic.",
      tech_stack:
        '{"framework":"React","styling":"Tailwind CSS 4","components":"10 shared","theme":"Dark mode first"}',
      patterns: '["Component Library","Design Tokens","Theme System"]',
      dependencies: '["react","tailwindcss","lucide-react"]',
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "Design System with 10 components",
      why_bhavya_cares:
        "Visual foundation for all Bhavya applications. Ensures consistency across the ecosystem.",
      learning_difficulty: "beginner",
      learning_prerequisites: '["React basics","CSS basics","Tailwind CSS"]',
      learning_reading_order:
        "Start with design tokens, then explore each component.",
      mcp_recommendations: "[]",
      cli_recommendations: '["tailwindcss","postcss"]',
      recommendation_type: "adopt",
    },
    {
      id: "runtime-engine",
      name: "runtime-engine",
      slug: "runtime-engine",
      description:
        "Capability engine, knowledge pipeline, course and lesson managers",
      language: "JavaScript",
      stars: 55,
      forks: 9,
      license: "MIT",
      topics: '["runtime","engine","pipeline"]',
      health_score: 90,
      technology_score: 85,
      bhavya_score: 88,
      engineering_maturity: "mature",
      architecture_summary:
        "9-step capability pipeline with quality gates (10 gates, 30+ checks). Dynamic builder loading and observability metrics.",
      folder_structure:
        '{"packages":{"engine":"Capability engine","builders":"Lesson builders","pipeline":"Knowledge pipeline"}}',
      readme_content: "# Runtime Engine\n\nCapability engine.",
      readme_summary:
        "Core runtime engine powering the capability pipeline with quality gates and observability.",
      tech_stack:
        '{"runtime":"Node.js","language":"JavaScript","pipeline":"9-step","gates":"10 gates, 30+ checks"}',
      patterns:
        '["Pipeline Pattern","Builder Pattern","Quality Gates","Observability"]',
      dependencies: "[]",
      maintainers: '["Bhavya Foundation"]',
      latest_release: "v1.0.0",
      latest_commit: "Runtime Engine with 9-step pipeline",
      why_bhavya_cares:
        "Core engine that powers all capability resolution and lesson generation.",
      learning_difficulty: "expert",
      learning_prerequisites:
        '["Pipeline design","Builder pattern","Quality engineering"]',
      learning_reading_order:
        "Start with the engine entry point, then explore the pipeline steps.",
      mcp_recommendations: "[]",
      cli_recommendations: '["node"]',
      recommendation_type: "adopt",
    },
  ];

  const insertRepo = db.prepare(`
    INSERT INTO repositories (id, name, slug, description, language, stars, forks, license, topics, health_score, technology_score, bhavya_score, engineering_maturity, architecture_summary, folder_structure, readme_content, readme_summary, tech_stack, patterns, dependencies, maintainers, latest_release, latest_commit, why_bhavya_cares, learning_difficulty, learning_prerequisites, learning_reading_order, mcp_recommendations, cli_recommendations, recommendation_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const repo of repos) {
    insertRepo.run(
      repo.id,
      repo.name,
      repo.slug,
      repo.description,
      repo.language,
      repo.stars,
      repo.forks,
      repo.license,
      repo.topics,
      repo.health_score,
      repo.technology_score,
      repo.bhavya_score,
      repo.engineering_maturity,
      repo.architecture_summary,
      repo.folder_structure,
      repo.readme_content,
      repo.readme_summary,
      repo.tech_stack,
      repo.patterns,
      repo.dependencies,
      repo.maintainers,
      repo.latest_release,
      repo.latest_commit,
      repo.why_bhavya_cares,
      repo.learning_difficulty,
      repo.learning_prerequisites,
      repo.learning_reading_order,
      repo.mcp_recommendations,
      repo.cli_recommendations,
      repo.recommendation_type,
    );
  }

  // Engineering patterns
  const patterns = [
    {
      id: "pat-1",
      repository_id: "bhavya-platform",
      pattern_name: "Provider Pattern",
      confidence: 95,
      evidence:
        "All integrations use provider interfaces (GitProvider, StorageProvider, EmailProvider)",
      description:
        "Every external integration is abstracted behind a provider interface, enabling swappability and testability.",
    },
    {
      id: "pat-2",
      repository_id: "bhavya-platform",
      pattern_name: "Repository Pattern",
      confidence: 90,
      evidence: "SqliteRepository class with generic CRUD operations",
      description:
        "Data access is abstracted behind repository interfaces, separating domain logic from persistence.",
    },
    {
      id: "pat-3",
      repository_id: "bhavya-platform",
      pattern_name: "Event Bus",
      confidence: 92,
      evidence: "EventBus class with history, retry, and metrics",
      description:
        "Components communicate through domain events, enabling loose coupling and async processing.",
    },
    {
      id: "pat-4",
      repository_id: "bhavya-platform",
      pattern_name: "Strategy Pattern",
      confidence: 85,
      evidence: "Multiple AI providers, storage providers, email providers",
      description:
        "Algorithms and behaviors are encapsulated behind interfaces, allowing runtime selection.",
    },
    {
      id: "pat-5",
      repository_id: "bhavya-intelligence-network",
      pattern_name: "Pipeline Pattern",
      confidence: 98,
      evidence: "12-step intelligence loop with clear stages",
      description:
        "Complex processing is broken into sequential steps with clear inputs/outputs.",
    },
    {
      id: "pat-6",
      repository_id: "bhavya-intelligence-network",
      pattern_name: "Observer Pattern",
      confidence: 88,
      evidence: "Event subscriptions for intelligence triggers",
      description: "Components subscribe to events and react when they occur.",
    },
    {
      id: "pat-7",
      repository_id: "bhavya-intelligence-network",
      pattern_name: "State Machine",
      confidence: 82,
      evidence: "Pipeline stages with state transitions",
      description:
        "System behavior is modeled as states with defined transitions.",
    },
    {
      id: "pat-8",
      repository_id: "runtime-engine",
      pattern_name: "Builder Pattern",
      confidence: 95,
      evidence: "Dynamic builder loading for lesson generation",
      description:
        "Complex objects are constructed step by step through builder interfaces.",
    },
    {
      id: "pat-9",
      repository_id: "runtime-engine",
      pattern_name: "Quality Gates",
      confidence: 90,
      evidence: "10 gates with 30+ checks in the pipeline",
      description:
        "Automated quality checks at defined stages ensure standards are met.",
    },
    {
      id: "pat-10",
      repository_id: "design-system",
      pattern_name: "Component Library",
      confidence: 98,
      evidence: "10 shared React components with consistent API",
      description:
        "Reusable UI components with standardized interfaces and documentation.",
    },
  ];

  const insertPattern = db.prepare(`
    INSERT INTO engineering_patterns (id, repository_id, pattern_name, confidence, evidence, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const pat of patterns) {
    insertPattern.run(
      pat.id,
      pat.repository_id,
      pat.pattern_name,
      pat.confidence,
      pat.evidence,
      pat.description,
    );
  }

  // ADRs
  const adrs = [
    {
      id: "adr-1",
      repository_id: "bhavya-platform",
      number: 1,
      title: "Package Promotion Rule",
      status: "accepted",
      context:
        "Need a rule for when to create shared packages vs keeping code in applications.",
      decision:
        "Shared packages are earned, not planned. Promotion path: Application Module → Used Successfully → Required By Second App → Promote To Package.",
      consequences:
        "Reduces premature abstraction, ensures packages solve real problems, creates natural versioning.",
    },
    {
      id: "adr-2",
      repository_id: "bhavya-platform",
      number: 2,
      title: "API-Free First",
      status: "accepted",
      context: "Need to decide how to integrate with external services.",
      decision:
        "Prefer MCP > CLI > Browser > Official API > Build from scratch.",
      consequences:
        "Reduces API key management, increases reliability, improves security, enables offline operation.",
    },
    {
      id: "adr-3",
      repository_id: "bhavya-platform",
      number: 3,
      title: "Dark Mode First",
      status: "accepted",
      context: "Need to decide the visual design direction.",
      decision: "Dark mode first, light mode later. Linear/Vercel aesthetic.",
      consequences:
        "Reduces eye strain, modern aesthetic, better for developers.",
    },
    {
      id: "adr-4",
      repository_id: "bhavya-platform",
      number: 4,
      title: "SQLite for Local Storage",
      status: "accepted",
      context: "Need to decide the database for local storage.",
      decision: "SQLite with better-sqlite3 for Windows compatibility.",
      consequences:
        "Simple deployment, no server required, portable, Windows compatible.",
    },
    {
      id: "adr-5",
      repository_id: "bhavya-platform",
      number: 5,
      title: "Event-Driven Architecture",
      status: "accepted",
      context: "Need to decide how components communicate.",
      decision: "Event-driven architecture with domain events.",
      consequences:
        "Loose coupling, scalability, observability, async processing.",
    },
  ];

  const insertADR = db.prepare(`
    INSERT INTO adrs (id, repository_id, number, title, status, context, decision, consequences)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const adr of adrs) {
    insertADR.run(
      adr.id,
      adr.repository_id,
      adr.number,
      adr.title,
      adr.status,
      adr.context,
      adr.decision,
      adr.consequences,
    );
  }

  // Knowledge packages
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

  // Activities
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

  // Technology radar
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

  // Recommendations
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

  // Pattern Library
  const patternLibrary = [
    {
      id: "plib-1",
      name: "Provider Pattern",
      slug: "provider-pattern",
      category: "creational",
      explanation:
        "Abstracts external integrations behind interfaces, enabling swappability and testability. Each provider implements a common interface but can use different underlying implementations.",
      use_cases:
        '["Database drivers","Cloud storage","Email sending","Payment processing","Authentication"]',
      related_patterns:
        '["Strategy Pattern","Abstract Factory","Dependency Injection"]',
      educational_value:
        "Teaches how to decouple business logic from infrastructure concerns. Essential for testing and migration.",
      bhavya_recommendation:
        "Use for all external integrations. Ensures vendor lock-in is minimal.",
      learning_mode: "hands-on",
      difficulty: "intermediate",
    },
    {
      id: "plib-2",
      name: "Repository Pattern",
      slug: "repository-pattern",
      category: "architectural",
      explanation:
        "Mediates between domain and data mapping layers, acting as an in-memory collection of domain objects. Separates domain logic from persistence concerns.",
      use_cases:
        '["Data access layer","CRUD operations","Query building","Domain-driven design"]',
      related_patterns: '["Unit of Work","Active Record","Data Mapper"]',
      educational_value:
        "Core pattern in DDD. Teaches separation of concerns and makes data access testable.",
      bhavya_recommendation:
        "Use for all data access. Combine with Unit of Work for complex transactions.",
      learning_mode: "reading",
      difficulty: "intermediate",
    },
    {
      id: "plib-3",
      name: "Event Bus",
      slug: "event-bus",
      category: "behavioral",
      explanation:
        "Enables loose coupling between components through domain events. Components publish events without knowing who subscribes, and subscribers react without knowing who published.",
      use_cases:
        '["Microservices communication","UI state management","Audit logging","Real-time notifications"]',
      related_patterns: '["Observer Pattern","Pub/Sub","Mediator"]',
      educational_value:
        "Teaches asynchronous communication and loose coupling. Foundation for event-driven architecture.",
      bhavya_recommendation:
        "Use for cross-cutting concerns and async processing. Avoid for synchronous operations.",
      learning_mode: "hands-on",
      difficulty: "advanced",
    },
    {
      id: "plib-4",
      name: "Strategy Pattern",
      slug: "strategy-pattern",
      category: "behavioral",
      explanation:
        "Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.",
      use_cases:
        '["Sorting algorithms","Pricing strategies","Validation rules","Authentication methods"]',
      related_patterns:
        '["Provider Pattern","State Pattern","Template Method"]',
      educational_value:
        "Teaches polymorphism and open/closed principle. Essential for flexible systems.",
      bhavya_recommendation:
        "Use when you need to swap algorithms at runtime. Keep strategies stateless.",
      learning_mode: "reading",
      difficulty: "intermediate",
    },
    {
      id: "plib-5",
      name: "Pipeline Pattern",
      slug: "pipeline-pattern",
      category: "architectural",
      explanation:
        "Breaks complex processing into sequential stages with clear inputs/outputs. Each stage transforms data and passes it to the next. Stages can be parallelized or reordered.",
      use_cases:
        '["Data processing","Build systems","ETL pipelines","Request handling"]',
      related_patterns: '["Chain of Responsibility","Decorator","Middleware"]',
      educational_value:
        "Teaches decomposition of complex problems. Foundation for data engineering and build systems.",
      bhavya_recommendation:
        "Use for multi-step processing. Add quality gates between stages.",
      learning_mode: "hands-on",
      difficulty: "advanced",
    },
    {
      id: "plib-6",
      name: "Builder Pattern",
      slug: "builder-pattern",
      category: "creational",
      explanation:
        "Separates construction of a complex object from its representation. Same construction process can create different representations step by step.",
      use_cases:
        '["Complex object construction","SQL query building","HTML generation","Configuration objects"]',
      related_patterns: '["Factory Method","Abstract Factory","Prototype"]',
      educational_value:
        "Teaches step-by-step construction and fluent interfaces. Useful for complex initialization.",
      bhavya_recommendation:
        "Use when object construction has many optional parameters. Consider telescoping constructor anti-pattern.",
      learning_mode: "reading",
      difficulty: "beginner",
    },
    {
      id: "plib-7",
      name: "State Machine",
      slug: "state-machine",
      category: "behavioral",
      explanation:
        "Models system behavior as states with defined transitions. Each state has allowed actions and transition rules. Prevents invalid state changes.",
      use_cases:
        '["Order processing","Game logic","Workflow engines","Protocol handling"]',
      related_patterns:
        '["Strategy Pattern","State Pattern","Transition Table"]',
      educational_value:
        "Teaches formal modeling of behavior. Essential for reliable workflow systems.",
      bhavya_recommendation:
        "Use for complex state transitions. Document all states and transitions.",
      learning_mode: "reading",
      difficulty: "advanced",
    },
    {
      id: "plib-8",
      name: "Plugin Architecture",
      slug: "plugin-architecture",
      category: "architectural",
      explanation:
        "Extends application functionality through dynamically loaded modules. Core system defines interfaces, plugins implement them. Enables third-party extensibility.",
      use_cases:
        '["IDE extensions","Browser extensions","CMS themes","Game mods"]',
      related_patterns:
        '["Microkernel","Service Locator","Dependency Injection"]',
      educational_value:
        "Teaches extensibility and interface-based design. Foundation for ecosystem development.",
      bhavya_recommendation:
        "Use when you need third-party extensibility. Define clear plugin interfaces.",
      learning_mode: "hands-on",
      difficulty: "expert",
    },
    {
      id: "plib-9",
      name: "Workflow Engine",
      slug: "workflow-engine",
      category: "architectural",
      explanation:
        "Orchestrates multi-step processes with defined states, transitions, and conditions. Supports parallel execution, error handling, and compensation.",
      use_cases:
        '["Business process automation","CI/CD pipelines","Approval workflows","Data pipelines"]',
      related_patterns: '["State Machine","Pipeline Pattern","Saga Pattern"]',
      educational_value:
        "Teaches process orchestration and distributed systems. Essential for enterprise applications.",
      bhavya_recommendation:
        "Use for complex business processes. Add monitoring and compensation logic.",
      learning_mode: "hands-on",
      difficulty: "expert",
    },
    {
      id: "plib-10",
      name: "Dependency Injection",
      slug: "dependency-injection",
      category: "creational",
      explanation:
        "Provides dependencies to a class from outside rather than creating them internally. Promotes loose coupling, testability, and configuration flexibility.",
      use_cases:
        '["Test mocking","Configuration management","Service registration","Module systems"]',
      related_patterns:
        '["Service Locator","Factory Pattern","Inversion of Control"]',
      educational_value:
        "Core principle of SOLID design. Essential for testable and maintainable code.",
      bhavya_recommendation:
        "Use throughout the codebase. Combine with DI containers for complex systems.",
      learning_mode: "reading",
      difficulty: "beginner",
    },
  ];

  const insertPatternLib = db.prepare(`
    INSERT INTO pattern_library (id, name, slug, category, explanation, use_cases, related_patterns, educational_value, bhavya_recommendation, learning_mode, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of patternLibrary) {
    insertPatternLib.run(
      p.id,
      p.name,
      p.slug,
      p.category,
      p.explanation,
      p.use_cases,
      p.related_patterns,
      p.educational_value,
      p.bhavya_recommendation,
      p.learning_mode,
      p.difficulty,
    );
  }

  // Repository Timelines
  const timelines = [
    {
      id: "tl-1",
      repository_id: "bhavya-platform",
      event_type: "release",
      title: "Platform v2.0 released",
      description: "11 shared packages with zero circular dependencies",
      event_date: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: "tl-2",
      repository_id: "bhavya-platform",
      event_type: "architecture",
      title: "Layer model established",
      description:
        "Foundation → Data → Communication → Integration → Presentation",
      event_date: new Date(Date.now() - 86400000 * 25).toISOString(),
    },
    {
      id: "tl-3",
      repository_id: "bhavya-platform",
      event_type: "adr",
      title: "ADR-001: Package Promotion Rule",
      description: "Shared packages are earned, not planned",
      event_date: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: "tl-4",
      repository_id: "bhavya-platform",
      event_type: "technology",
      title: "TypeScript adopted",
      description: "Full type safety across all packages",
      event_date: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      id: "tl-5",
      repository_id: "bhavya-platform",
      event_type: "milestone",
      title: "Zero circular dependencies achieved",
      description: "Enforced by layer model",
      event_date: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "tl-6",
      repository_id: "knowledge-studio",
      event_type: "release",
      title: "Knowledge Studio v1.0",
      description: "6-tab lesson management with visual spec builder",
      event_date: new Date(Date.now() - 86400000 * 28).toISOString(),
    },
    {
      id: "tl-7",
      repository_id: "knowledge-studio",
      event_type: "architecture",
      title: "Runtime engine integrated",
      description: "9-step capability pipeline with quality gates",
      event_date: new Date(Date.now() - 86400000 * 22).toISOString(),
    },
    {
      id: "tl-8",
      repository_id: "bhavya-intelligence-network",
      event_type: "release",
      title: "BIN v1.0 deployed",
      description: "12-step autonomous intelligence loop",
      event_date: new Date(Date.now() - 86400000 * 26).toISOString(),
    },
    {
      id: "tl-9",
      repository_id: "bhavya-intelligence-network",
      event_type: "architecture",
      title: "Event-driven architecture adopted",
      description: "Domain events for loose coupling",
      event_date: new Date(Date.now() - 86400000 * 24).toISOString(),
    },
    {
      id: "tl-10",
      repository_id: "design-system",
      event_type: "release",
      title: "Design System v1.0",
      description: "10 shared React components with dark mode",
      event_date: new Date(Date.now() - 86400000 * 27).toISOString(),
    },
  ];

  const insertTimeline = db.prepare(`
    INSERT INTO repository_timelines (id, repository_id, event_type, title, description, event_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const t of timelines) {
    insertTimeline.run(
      t.id,
      t.repository_id,
      t.event_type,
      t.title,
      t.description,
      t.event_date,
    );
  }

  // Engineering Health
  const healthData = [
    {
      id: "health-1",
      repository_id: "bhavya-platform",
      overall_score: 92,
      documentation_score: 95,
      test_coverage_score: 88,
      dependency_freshness_score: 90,
      release_cadence_score: 85,
      architecture_consistency_score: 98,
      knowledge_coverage_score: 94,
      adr_coverage_score: 90,
      educational_completeness_score: 88,
      calculation_methodology:
        "Weighted average of 8 health dimensions. Architecture consistency weighted highest (20%), documentation and knowledge coverage weighted 15% each.",
      recommendations:
        '["Add more unit tests","Create onboarding guide","Document API reference"]',
    },
    {
      id: "health-2",
      repository_id: "knowledge-studio",
      overall_score: 85,
      documentation_score: 80,
      test_coverage_score: 75,
      dependency_freshness_score: 88,
      release_cadence_score: 82,
      architecture_consistency_score: 90,
      knowledge_coverage_score: 85,
      adr_coverage_score: 70,
      educational_completeness_score: 92,
      calculation_methodology:
        "Weighted average of 8 health dimensions. Educational completeness weighted highest for this repository.",
      recommendations:
        '["Improve test coverage","Add ADRs for key decisions","Document learning paths"]',
    },
    {
      id: "health-3",
      repository_id: "bhavya-intelligence-network",
      overall_score: 88,
      documentation_score: 85,
      test_coverage_score: 82,
      dependency_freshness_score: 90,
      release_cadence_score: 88,
      architecture_consistency_score: 92,
      knowledge_coverage_score: 90,
      adr_coverage_score: 85,
      educational_completeness_score: 86,
      calculation_methodology:
        "Balanced scoring across all dimensions. Intelligence loop complexity requires high architecture consistency.",
      recommendations:
        '["Add more ADRs","Create pattern documentation","Build learning exercises"]',
    },
    {
      id: "health-4",
      repository_id: "design-system",
      overall_score: 90,
      documentation_score: 92,
      test_coverage_score: 85,
      dependency_freshness_score: 95,
      release_cadence_score: 88,
      architecture_consistency_score: 94,
      knowledge_coverage_score: 88,
      adr_coverage_score: 82,
      educational_completeness_score: 90,
      calculation_methodology:
        "Component library metrics emphasize documentation and consistency. Dependency freshness critical for UI libraries.",
      recommendations:
        '["Add Storybook documentation","Create component usage guides","Document accessibility patterns"]',
    },
    {
      id: "health-5",
      repository_id: "runtime-engine",
      overall_score: 94,
      documentation_score: 90,
      test_coverage_score: 92,
      dependency_freshness_score: 88,
      release_cadence_score: 95,
      architecture_consistency_score: 96,
      knowledge_coverage_score: 92,
      adr_coverage_score: 88,
      educational_completeness_score: 94,
      calculation_methodology:
        "Core engine requires high scores across all dimensions. Pipeline complexity drives architecture consistency weight.",
      recommendations:
        '["Document pipeline stages","Create debugging guide","Add performance benchmarks"]',
    },
  ];

  const insertHealth = db.prepare(`
    INSERT INTO engineering_health (id, repository_id, overall_score, documentation_score, test_coverage_score, dependency_freshness_score, release_cadence_score, architecture_consistency_score, knowledge_coverage_score, adr_coverage_score, educational_completeness_score, calculation_methodology, recommendations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const h of healthData) {
    insertHealth.run(
      h.id,
      h.repository_id,
      h.overall_score,
      h.documentation_score,
      h.test_coverage_score,
      h.dependency_freshness_score,
      h.release_cadence_score,
      h.architecture_consistency_score,
      h.knowledge_coverage_score,
      h.adr_coverage_score,
      h.educational_completeness_score,
      h.calculation_methodology,
      h.recommendations,
    );
  }

  // Learning Paths
  const learningPaths = [
    {
      id: "lp-1",
      repository_id: "bhavya-platform",
      prerequisites:
        '["TypeScript basics","Node.js fundamentals","Package management"]',
      learning_objectives:
        '["Understand layered architecture","Learn provider pattern implementation","Master event-driven design","Apply dependency injection"]',
      reading_order:
        '["@bhavya/types → domain model","@bhavya/platform → utilities","@bhavya/database → data access","@bhavya/events → async communication","@bhavya/security → auth patterns"]',
      important_folders:
        '["packages/platform","packages/types","packages/database","packages/events"]',
      key_files:
        '["packages/platform/src/index.ts","packages/types/src/index.ts","packages/database/src/index.ts"]',
      concepts_demonstrated:
        '["Provider Pattern","Repository Pattern","Event Bus","Strategy Pattern","Dependency Injection"]',
      suggested_exercises:
        '["Create a new provider","Implement a custom event handler","Add a new database migration","Write unit tests for security module"]',
      mini_projects:
        '["Build a notification system","Create a caching layer","Implement audit logging"]',
      capstone_ideas:
        '["Design a plugin system","Build a workflow engine","Create a API gateway"]',
      estimated_hours: 40,
      difficulty: "intermediate",
    },
    {
      id: "lp-2",
      repository_id: "knowledge-studio",
      prerequisites:
        '["React basics","Next.js fundamentals","Database concepts"]',
      learning_objectives:
        '["Understand tab-based UI architecture","Learn lesson content management","Master knowledge extraction","Apply visual spec generation"]',
      reading_order:
        '["src/app/page.tsx → layout","src/lib/db.ts → data layer","src/components/ → UI patterns"]',
      important_folders: '["src/app","src/components","src/lib"]',
      key_files: '["src/app/page.tsx","src/lib/db.ts","src/lib/seed.ts"]',
      concepts_demonstrated:
        '["Tab-based UI","CRUD Operations","Form Validation","Data Seeding"]',
      suggested_exercises:
        '["Add a new tab","Create a custom widget","Implement search functionality","Build a data export feature"]',
      mini_projects:
        '["Build a quiz generator","Create a lesson planner","Implement a progress tracker"]',
      capstone_ideas:
        '["Design a curriculum management system","Build an AI-powered content generator","Create a student assessment platform"]',
      estimated_hours: 30,
      difficulty: "beginner",
    },
    {
      id: "lp-3",
      repository_id: "bhavya-intelligence-network",
      prerequisites:
        '["Event-driven architecture","Pipeline design","TypeScript advanced"]',
      learning_objectives:
        '["Understand autonomous intelligence loops","Learn event sourcing","Master pipeline orchestration","Apply quality gates"]',
      reading_order:
        '["src/lib/engine.ts → pipeline","src/lib/events.ts → domain events","src/app/page.tsx → dashboard"]',
      important_folders: '["src/lib/engine","src/lib/events","src/app"]',
      key_files: '["src/lib/engine.ts","src/lib/events.ts","src/app/page.tsx"]',
      concepts_demonstrated:
        '["Pipeline Pattern","Event Bus","Observer Pattern","State Machine","Quality Gates"]',
      suggested_exercises:
        '["Add a new pipeline stage","Create a custom event handler","Implement a quality gate","Build a monitoring dashboard"]',
      mini_projects:
        '["Build a code analysis pipeline","Create a dependency scanner","Implement a security audit system"]',
      capstone_ideas:
        '["Design a self-healing system","Build an automated refactoring tool","Create a knowledge extraction engine"]',
      estimated_hours: 50,
      difficulty: "expert",
    },
  ];

  const insertLearningPath = db.prepare(`
    INSERT INTO learning_paths (id, repository_id, prerequisites, learning_objectives, reading_order, important_folders, key_files, concepts_demonstrated, suggested_exercises, mini_projects, capstone_ideas, estimated_hours, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const lp of learningPaths) {
    insertLearningPath.run(
      lp.id,
      lp.repository_id,
      lp.prerequisites,
      lp.learning_objectives,
      lp.reading_order,
      lp.important_folders,
      lp.key_files,
      lp.concepts_demonstrated,
      lp.suggested_exercises,
      lp.mini_projects,
      lp.capstone_ideas,
      lp.estimated_hours,
      lp.difficulty,
    );
  }

  // Knowledge Graph Nodes
  const graphNodes = [
    {
      id: "gn-1",
      node_type: "repository",
      label: "bhavya-platform",
      metadata: '{"score":90,"language":"TypeScript"}',
    },
    {
      id: "gn-2",
      node_type: "repository",
      label: "knowledge-studio",
      metadata: '{"score":84,"language":"TypeScript"}',
    },
    {
      id: "gn-3",
      node_type: "repository",
      label: "bhavya-intelligence-network",
      metadata: '{"score":85,"language":"TypeScript"}',
    },
    {
      id: "gn-4",
      node_type: "pattern",
      label: "Provider Pattern",
      metadata: '{"difficulty":"intermediate"}',
    },
    {
      id: "gn-5",
      node_type: "pattern",
      label: "Repository Pattern",
      metadata: '{"difficulty":"intermediate"}',
    },
    {
      id: "gn-6",
      node_type: "pattern",
      label: "Event Bus",
      metadata: '{"difficulty":"advanced"}',
    },
    {
      id: "gn-7",
      node_type: "technology",
      label: "TypeScript",
      metadata: '{"category":"languages","ring":"adopt"}',
    },
    {
      id: "gn-8",
      node_type: "technology",
      label: "Next.js",
      metadata: '{"category":"frameworks","ring":"adopt"}',
    },
    {
      id: "gn-9",
      node_type: "technology",
      label: "SQLite",
      metadata: '{"category":"databases","ring":"adopt"}',
    },
    {
      id: "gn-10",
      node_type: "technology",
      label: "Tailwind CSS",
      metadata: '{"category":"frameworks","ring":"adopt"}',
    },
    {
      id: "gn-11",
      node_type: "course",
      label: "Platform Architecture",
      metadata: '{"difficulty":"intermediate"}',
    },
    {
      id: "gn-12",
      node_type: "course",
      label: "Event-Driven Design",
      metadata: '{"difficulty":"advanced"}',
    },
    {
      id: "gn-13",
      node_type: "mcp",
      label: "GitHub MCP",
      metadata: '{"category":"repository"}',
    },
    {
      id: "gn-14",
      node_type: "mcp",
      label: "Filesystem MCP",
      metadata: '{"category":"file"}',
    },
    {
      id: "gn-15",
      node_type: "framework",
      label: "React",
      metadata: '{"category":"ui"}',
    },
  ];

  const insertGraphNode = db.prepare(`
    INSERT INTO knowledge_graph_nodes (id, node_type, label, metadata)
    VALUES (?, ?, ?, ?)
  `);

  for (const n of graphNodes) {
    insertGraphNode.run(n.id, n.node_type, n.label, n.metadata);
  }

  // Knowledge Graph Edges
  const graphEdges = [
    {
      id: "ge-1",
      source_id: "gn-1",
      target_id: "gn-4",
      relationship: "implements",
      weight: 0.9,
    },
    {
      id: "ge-2",
      source_id: "gn-1",
      target_id: "gn-5",
      relationship: "implements",
      weight: 0.85,
    },
    {
      id: "ge-3",
      source_id: "gn-1",
      target_id: "gn-6",
      relationship: "implements",
      weight: 0.8,
    },
    {
      id: "ge-4",
      source_id: "gn-3",
      target_id: "gn-6",
      relationship: "implements",
      weight: 0.95,
    },
    {
      id: "ge-5",
      source_id: "gn-1",
      target_id: "gn-7",
      relationship: "uses",
      weight: 1,
    },
    {
      id: "ge-6",
      source_id: "gn-2",
      target_id: "gn-7",
      relationship: "uses",
      weight: 1,
    },
    {
      id: "ge-7",
      source_id: "gn-3",
      target_id: "gn-7",
      relationship: "uses",
      weight: 1,
    },
    {
      id: "ge-8",
      source_id: "gn-1",
      target_id: "gn-8",
      relationship: "uses",
      weight: 0.9,
    },
    {
      id: "ge-9",
      source_id: "gn-2",
      target_id: "gn-8",
      relationship: "uses",
      weight: 1,
    },
    {
      id: "ge-10",
      source_id: "gn-1",
      target_id: "gn-9",
      relationship: "uses",
      weight: 0.8,
    },
    {
      id: "ge-11",
      source_id: "gn-2",
      target_id: "gn-9",
      relationship: "uses",
      weight: 0.7,
    },
    {
      id: "ge-12",
      source_id: "gn-2",
      target_id: "gn-10",
      relationship: "uses",
      weight: 0.9,
    },
    {
      id: "ge-13",
      source_id: "gn-1",
      target_id: "gn-11",
      relationship: "teaches",
      weight: 0.9,
    },
    {
      id: "ge-14",
      source_id: "gn-3",
      target_id: "gn-12",
      relationship: "teaches",
      weight: 0.85,
    },
    {
      id: "ge-15",
      source_id: "gn-1",
      target_id: "gn-13",
      relationship: "recommends",
      weight: 0.8,
    },
    {
      id: "ge-16",
      source_id: "gn-1",
      target_id: "gn-14",
      relationship: "recommends",
      weight: 0.7,
    },
    {
      id: "ge-17",
      source_id: "gn-2",
      target_id: "gn-15",
      relationship: "uses",
      weight: 1,
    },
    {
      id: "ge-18",
      source_id: "gn-1",
      target_id: "gn-2",
      relationship: "depends_on",
      weight: 0.6,
    },
    {
      id: "ge-19",
      source_id: "gn-1",
      target_id: "gn-3",
      relationship: "depends_on",
      weight: 0.5,
    },
  ];

  const insertGraphEdge = db.prepare(`
    INSERT INTO knowledge_graph_edges (id, source_id, target_id, relationship, weight)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const e of graphEdges) {
    insertGraphEdge.run(
      e.id,
      e.source_id,
      e.target_id,
      e.relationship,
      e.weight,
    );
  }

  // Educational Exports
  const eduExports = [
    {
      id: "edu-1",
      repository_id: "bhavya-platform",
      export_type: "lesson",
      title: "Understanding Layered Architecture",
      content:
        "# Lesson: Layered Architecture\n\n## Objective\nUnderstand how layered architecture creates clean separation of concerns.\n\n## Key Concepts\n- Foundation Layer: Core types and utilities\n- Data Layer: Database abstraction\n- Communication Layer: API, events, workflows\n- Integration Layer: AI, providers, notifications\n- Presentation Layer: UI components\n\n## Exercise\nCreate a new package in the Integration Layer that depends only on Foundation and Data layers.",
      metadata: '{"duration":"2 hours","level":"intermediate"}',
    },
    {
      id: "edu-2",
      repository_id: "bhavya-platform",
      export_type: "workshop",
      title: "Provider Pattern Workshop",
      content:
        "# Workshop: Implementing the Provider Pattern\n\n## Duration\n4 hours\n\n## Agenda\n1. Introduction to Provider Pattern (30 min)\n2. Analyze existing providers (45 min)\n3. Implement a new provider (90 min)\n4. Testing providers (45 min)\n\n## Materials\n- Reference implementation: @bhavya/providers\n- Test harness: Mock provider interface\n- Documentation: Provider pattern guide",
      metadata:
        '{"duration":"4 hours","level":"intermediate","max_participants":20}',
    },
    {
      id: "edu-3",
      repository_id: "knowledge-studio",
      export_type: "lab",
      title: "Building a Knowledge Package",
      content:
        "# Lab: Creating Knowledge Packages\n\n## Objective\nLearn to create structured knowledge packages from raw content.\n\n## Steps\n1. Identify key concepts from source material\n2. Structure content into categories\n3. Add quality scores and metadata\n4. Link to related repositories\n5. Test knowledge retrieval\n\n## Deliverable\nA complete knowledge package with 5+ concepts.",
      metadata: '{"duration":"1.5 hours","level":"beginner"}',
    },
    {
      id: "edu-4",
      repository_id: "bhavya-intelligence-network",
      export_type: "reading",
      title: "Event-Driven Architecture Reading Guide",
      content:
        '# Reading Guide: Event-Driven Architecture\n\n## Core Reading\n1. "Designing Data-Intensive Applications" - Chapter on Distributed Systems\n2. BIN source code: src/lib/events.ts\n3. Platform events package: packages/events/\n\n## Discussion Questions\n1. How does the Event Bus pattern differ from direct method calls?\n2. What are the trade-offs of eventual consistency?\n3. How do quality gates interact with event processing?\n\n## Further Reading\n- Event Sourcing patterns\n- CQRS implementation\n- Saga pattern for distributed transactions',
      metadata: '{"estimated_hours":5,"level":"advanced"}',
    },
    {
      id: "edu-5",
      repository_id: "bhavya-platform",
      export_type: "capstone",
      title: "Design a Plugin System",
      content:
        "# Capstone Project: Plugin System\n\n## Objective\nDesign and implement a plugin system for Bhavya OS.\n\n## Requirements\n1. Define plugin interfaces\n2. Implement plugin discovery\n3. Handle plugin lifecycle\n4. Ensure security isolation\n5. Support hot-reloading\n\n## Evaluation Criteria\n- Interface design quality\n- Security implementation\n- Test coverage\n- Documentation completeness\n\n## Timeline\n2 weeks (40 hours)",
      metadata:
        '{"duration":"2 weeks","level":"expert","prerequisites":["Provider Pattern","Dependency Injection","Security basics"]}',
    },
  ];

  const insertEduExport = db.prepare(`
    INSERT INTO educational_exports (id, repository_id, export_type, title, content, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const e of eduExports) {
    insertEduExport.run(
      e.id,
      e.repository_id,
      e.export_type,
      e.title,
      e.content,
      e.metadata,
    );
  }

  // Institutional Memory
  const memory = [
    {
      id: "mem-1",
      repository_id: "bhavya-platform",
      question: "Have we studied this before?",
      answer:
        "Yes, bhavya-platform is the foundational package ecosystem. It has been analyzed for architecture patterns, dependency management, and coding conventions.",
      evidence:
        '["Architecture analysis completed","Pattern detection: 4 patterns identified","Knowledge packages: 6 created"]',
      confidence: 0.95,
    },
    {
      id: "mem-2",
      repository_id: "bhavya-platform",
      question: "Which Knowledge Packages reference it?",
      answer:
        "6 knowledge packages reference bhavya-platform, covering architecture, engineering, and UI topics.",
      evidence:
        '["kp-1: Platform Foundation v2.0","kp-5: Design System","kp-6: Runtime Engine"]',
      confidence: 0.9,
    },
    {
      id: "mem-3",
      repository_id: "bhavya-platform",
      question: "Which internal projects use similar patterns?",
      answer:
        "All Bhavya OS repositories use patterns from bhavya-platform. The Provider Pattern and Repository Pattern are used across the ecosystem.",
      evidence:
        '["knowledge-studio: uses Repository Pattern","bhavya-intelligence-network: uses Event Bus","design-system: uses Component Library pattern"]',
      confidence: 0.88,
    },
    {
      id: "mem-4",
      repository_id: "bhavya-platform",
      question: "Which ADRs reference it?",
      answer:
        "3 ADRs reference bhavya-platform: Package Promotion Rule, API-Free First, and Dark Mode First.",
      evidence:
        '["ADR-001: Package Promotion Rule","ADR-002: API-Free First","ADR-003: Dark Mode First"]',
      confidence: 0.92,
    },
    {
      id: "mem-5",
      repository_id: "bhavya-platform",
      question: "Which future Bhavya OS modules can reuse ideas from it?",
      answer:
        "The Provider Pattern can be reused for any new integration. The Event Bus pattern is reusable for async processing. The layered architecture model can guide future module design.",
      evidence:
        '["Provider Pattern: reusable for new integrations","Event Bus: reusable for async processing","Layer model: reusable for module architecture"]',
      confidence: 0.85,
    },
    {
      id: "mem-6",
      repository_id: "knowledge-studio",
      question: "Have we studied this before?",
      answer:
        "Yes, knowledge-studio has been analyzed for UI architecture and content management patterns.",
      evidence:
        '["UI analysis completed","Tab-based architecture documented","Knowledge extraction patterns identified"]',
      confidence: 0.9,
    },
    {
      id: "mem-7",
      repository_id: "bhavya-intelligence-network",
      question: "Have we studied this before?",
      answer:
        "Yes, bhavya-intelligence-network has been analyzed for event-driven architecture and pipeline design.",
      evidence:
        '["Event-driven analysis completed","Pipeline patterns documented","12-step loop analyzed"]',
      confidence: 0.92,
    },
  ];

  const insertMemory = db.prepare(`
    INSERT INTO institutional_memory (id, repository_id, question, answer, evidence, confidence)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const m of memory) {
    insertMemory.run(
      m.id,
      m.repository_id,
      m.question,
      m.answer,
      m.evidence,
      m.confidence,
    );
  }

  // Engineering Reviews
  const reviews = [
    {
      id: "rev-1",
      repository_id: "bhavya-platform",
      review_type: "comprehensive",
      overall_score: 91,
      architecture_score: 95,
      code_organization_score: 92,
      documentation_score: 88,
      testing_score: 85,
      automation_score: 90,
      maintainability_score: 93,
      extensibility_score: 94,
      developer_experience_score: 87,
      educational_value_score: 90,
      future_risk_score: 85,
      strengths:
        '["Zero circular dependencies","Clean layer model","Strong type safety","Provider pattern consistency","Well-defined package boundaries"]',
      weaknesses:
        '["Limited test coverage in some packages","Missing onboarding documentation","No performance benchmarks","Incomplete API reference"]',
      missing_patterns:
        '["Unit of Work","CQRS","Saga Pattern","Circuit Breaker"]',
      recommendations:
        '["Add integration tests","Create architecture decision records for layer boundaries","Document package interaction patterns","Add performance benchmarks"]',
      verdict:
        "Mature and well-architected. Primary risk is documentation gap as system grows.",
    },
    {
      id: "rev-2",
      repository_id: "knowledge-studio",
      review_type: "comprehensive",
      overall_score: 82,
      architecture_score: 85,
      code_organization_score: 83,
      documentation_score: 78,
      testing_score: 72,
      automation_score: 80,
      maintainability_score: 84,
      extensibility_score: 82,
      developer_experience_score: 85,
      educational_value_score: 88,
      future_risk_score: 78,
      strengths:
        '["Excellent educational value","6-tab UI is intuitive","Runtime engine integration","Knowledge extraction pipeline"]',
      weaknesses:
        '["Low test coverage","Missing error handling patterns","No loading states for some operations","Limited offline support"]',
      missing_patterns:
        '["Error Boundary","Optimistic Updates","Cache Invalidation","Background Sync"]',
      recommendations:
        '["Add unit tests for all components","Implement error boundaries","Add loading skeletons","Create offline-first architecture"]',
      verdict:
        "Good educational tool with room for engineering maturity improvements.",
    },
    {
      id: "rev-3",
      repository_id: "bhavya-intelligence-network",
      review_type: "comprehensive",
      overall_score: 87,
      architecture_score: 90,
      code_organization_score: 88,
      documentation_score: 82,
      testing_score: 80,
      automation_score: 88,
      maintainability_score: 86,
      extensibility_score: 92,
      developer_experience_score: 84,
      educational_value_score: 85,
      future_risk_score: 82,
      strengths:
        '["12-step pipeline is well-designed","Event-driven architecture","Quality gates enforce standards","Extensible intelligence loop"]',
      weaknesses:
        '["Pipeline stages could be more modular","Limited observability","No circuit breaker for external calls","Missing retry policies"]',
      missing_patterns:
        '["Circuit Breaker","Retry with Backoff","Bulkhead","Rate Limiting"]',
      recommendations:
        '["Add circuit breakers for external APIs","Implement retry with exponential backoff","Add distributed tracing","Create pipeline monitoring dashboard"]',
      verdict: "Strong architecture with production hardening needed.",
    },
  ];

  const insertReview = db.prepare(`
    INSERT INTO engineering_reviews (id, repository_id, review_type, overall_score, architecture_score, code_organization_score, documentation_score, testing_score, automation_score, maintainability_score, extensibility_score, developer_experience_score, educational_value_score, future_risk_score, strengths, weaknesses, missing_patterns, recommendations, verdict)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of reviews) {
    insertReview.run(
      r.id,
      r.repository_id,
      r.review_type,
      r.overall_score,
      r.architecture_score,
      r.code_organization_score,
      r.documentation_score,
      r.testing_score,
      r.automation_score,
      r.maintainability_score,
      r.extensibility_score,
      r.developer_experience_score,
      r.educational_value_score,
      r.future_risk_score,
      r.strengths,
      r.weaknesses,
      r.missing_patterns,
      r.recommendations,
      r.verdict,
    );
  }

  // Technical Debt
  const debt = [
    {
      id: "debt-1",
      repository_id: "bhavya-platform",
      category: "documentation",
      title: "Missing API reference for @bhavya/platform",
      description:
        "The platform package lacks comprehensive API documentation for exported utilities.",
      severity: "medium",
      business_impact: "New developers spend extra time understanding APIs",
      engineering_impact: "Delays onboarding and increases support requests",
      estimated_effort: "2-3 days",
      suggested_solution: "Generate API docs from JSDoc comments using TypeDoc",
      related_knowledge_packages: '["kp-1"]',
      related_adrs: '["adr-1"]',
      status: "open",
    },
    {
      id: "debt-2",
      repository_id: "bhavya-platform",
      category: "testing",
      title: "Integration tests missing for database package",
      description:
        "The database package has unit tests but no integration tests with real SQLite.",
      severity: "high",
      business_impact: "Risk of data corruption in production",
      engineering_impact: "Bugs discovered in production instead of CI",
      estimated_effort: "3-4 days",
      suggested_solution: "Add integration tests using temp SQLite databases",
      related_knowledge_packages: '["kp-1"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "debt-3",
      repository_id: "knowledge-studio",
      category: "testing",
      title: "No end-to-end tests for lesson creation flow",
      description: "The 6-tab lesson creation flow has no E2E tests.",
      severity: "high",
      business_impact: "Lesson creation bugs affect all users",
      engineering_impact: "Manual testing required for every release",
      estimated_effort: "4-5 days",
      suggested_solution: "Add Playwright E2E tests for critical paths",
      related_knowledge_packages: '["kp-2"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "debt-4",
      repository_id: "bhavya-intelligence-network",
      category: "infrastructure",
      title: "No circuit breaker for external API calls",
      description:
        "The intelligence loop makes external API calls without circuit breaker pattern.",
      severity: "high",
      business_impact: "External API failures cascade to entire system",
      engineering_impact: "System becomes unstable during outages",
      estimated_effort: "2-3 days",
      suggested_solution: "Implement circuit breaker with state machine",
      related_knowledge_packages: '["kp-4"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "debt-5",
      repository_id: "design-system",
      category: "documentation",
      title: "Missing Storybook for component documentation",
      description: "Components lack interactive documentation and examples.",
      severity: "medium",
      business_impact: "Developers don't know how to use components",
      engineering_impact: "Inconsistent component usage across apps",
      estimated_effort: "3-4 days",
      suggested_solution: "Add Storybook with stories for all components",
      related_knowledge_packages: '["kp-5"]',
      related_adrs: "[]",
      status: "open",
    },
  ];

  const insertDebt = db.prepare(`
    INSERT INTO technical_debt (id, repository_id, category, title, description, severity, business_impact, engineering_impact, estimated_effort, suggested_solution, related_knowledge_packages, related_adrs, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const d of debt) {
    insertDebt.run(
      d.id,
      d.repository_id,
      d.category,
      d.title,
      d.description,
      d.severity,
      d.business_impact,
      d.engineering_impact,
      d.estimated_effort,
      d.suggested_solution,
      d.related_knowledge_packages,
      d.related_adrs,
      d.status,
    );
  }

  // Architecture Advisor
  const advisors = [
    {
      id: "adv-1",
      repository_id: "bhavya-platform",
      comparison_repo: "vercel/next.js",
      missing_layers:
        '["Monitoring Layer","Observability Layer","Caching Layer"]',
      architectural_drift:
        '["Some packages have grown beyond single responsibility","Event bus used for sync operations in some places"]',
      duplicated_concepts:
        '["ID generation logic duplicated in platform and database packages","Error handling patterns inconsistent across packages"]',
      improvement_recommendations:
        '["Extract monitoring into separate package","Standardize error handling with Result type","Add package size limits to prevent bloat","Create package dependency graph visualization"]',
      migration_effort: "Medium — 2-3 weeks for refactoring",
      tradeoffs:
        '["More packages = more complexity but better separation","Strict layers = less flexibility but more predictability","Type safety everywhere = slower iteration but fewer bugs"]',
    },
    {
      id: "adv-2",
      repository_id: "knowledge-studio",
      comparison_repo: "linear/linear",
      missing_layers:
        '["State Management Layer","Optimistic Updates Layer","Offline Support Layer"]',
      architectural_drift:
        '["Tab components have grown too large","Some business logic leaked into UI components"]',
      duplicated_concepts:
        '["Form validation logic repeated across tabs","Search functionality duplicated"]',
      improvement_recommendations:
        '["Extract shared form components","Create custom hooks for search","Implement Zustand for state management","Add service worker for offline support"]',
      migration_effort: "Medium — 2 weeks for state management",
      tradeoffs:
        '["More abstraction = more indirection but better reusability","Offline support = more complexity but better UX","State management = more files but better predictability"]',
    },
  ];

  const insertAdvisor = db.prepare(`
    INSERT INTO architecture_advisor (id, repository_id, comparison_repo, missing_layers, architectural_drift, duplicated_concepts, improvement_recommendations, migration_effort, tradeoffs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of advisors) {
    insertAdvisor.run(
      a.id,
      a.repository_id,
      a.comparison_repo,
      a.missing_layers,
      a.architectural_drift,
      a.duplicated_concepts,
      a.improvement_recommendations,
      a.migration_effort,
      a.tradeoffs,
    );
  }

  // Technical Debt Center
  const technicalDebt = [
    {
      id: "td-1",
      repository_id: "bhavya-platform",
      category: "documentation",
      title: "Missing API reference for @bhavya/platform",
      description:
        "The platform package lacks comprehensive API documentation for exported utilities.",
      severity: "medium",
      business_impact: "New developers spend extra time understanding APIs",
      engineering_impact: "Delays onboarding and increases support requests",
      estimated_effort: "2-3 days",
      suggested_solution: "Generate API docs from JSDoc comments using TypeDoc",
      related_knowledge_packages: '["kp-1"]',
      related_adrs: '["adr-1"]',
      status: "open",
    },
    {
      id: "td-2",
      repository_id: "bhavya-platform",
      category: "testing",
      title: "Integration tests missing for database package",
      description:
        "The database package has unit tests but no integration tests with real SQLite.",
      severity: "high",
      business_impact: "Risk of data corruption in production",
      engineering_impact: "Bugs discovered in production instead of CI",
      estimated_effort: "3-4 days",
      suggested_solution: "Add integration tests using temp SQLite databases",
      related_knowledge_packages: '["kp-1"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "td-3",
      repository_id: "knowledge-studio",
      category: "testing",
      title: "No end-to-end tests for lesson creation flow",
      description: "The 6-tab lesson creation flow has no E2E tests.",
      severity: "high",
      business_impact: "Lesson creation bugs affect all users",
      engineering_impact: "Manual testing required for every release",
      estimated_effort: "4-5 days",
      suggested_solution: "Add Playwright E2E tests for critical paths",
      related_knowledge_packages: '["kp-2"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "td-4",
      repository_id: "bhavya-intelligence-network",
      category: "infrastructure",
      title: "No circuit breaker for external API calls",
      description:
        "The intelligence loop makes external API calls without circuit breaker pattern.",
      severity: "high",
      business_impact: "External API failures cascade to entire system",
      engineering_impact: "System becomes unstable during outages",
      estimated_effort: "2-3 days",
      suggested_solution: "Implement circuit breaker with state machine",
      related_knowledge_packages: '["kp-4"]',
      related_adrs: "[]",
      status: "open",
    },
    {
      id: "td-5",
      repository_id: "design-system",
      category: "documentation",
      title: "Missing Storybook for component documentation",
      description: "Components lack interactive documentation and examples.",
      severity: "medium",
      business_impact: "Developers don't know how to use components",
      engineering_impact: "Inconsistent component usage across apps",
      estimated_effort: "3-4 days",
      suggested_solution: "Add Storybook with stories for all components",
      related_knowledge_packages: '["kp-5"]',
      related_adrs: "[]",
      status: "open",
    },
  ];

  // Implementation Plans
  const plans = [
    {
      id: "plan-1",
      repository_id: "bhavya-platform",
      plan_type: "improvement",
      title: "Platform Hardening Roadmap",
      roadmap:
        '["Phase 1: Documentation (Week 1-2)","Phase 2: Testing (Week 3-4)","Phase 3: Monitoring (Week 5-6)","Phase 4: Performance (Week 7-8)"]',
      epics:
        '["Epic 1: API Documentation","Epic 2: Integration Testing","Epic 3: Observability","Epic 4: Performance Benchmarks"]',
      milestones:
        '["M1: All packages have API docs","M2: 80% test coverage","M3: Distributed tracing enabled","M4: Performance baseline established"]',
      phases:
        '["Phase 1: Low-hanging fruit (docs, examples)","Phase 2: Quality gates (tests, linting)","Phase 3: Production readiness (monitoring, alerting)","Phase 4: Optimization (caching, profiling)"]',
      dependencies:
        '["TypeDoc for API docs","Playwright for E2E tests","OpenTelemetry for tracing","Clinic.js for profiling"]',
      suggested_order:
        '["Start with documentation (highest ROI)","Then testing (reduces risk)","Then monitoring (visibility)","Then performance (optimization)"]',
      risk_analysis:
        "Low risk — incremental improvements to existing stable system.",
      learning_prerequisites:
        '["TypeDoc API documentation","Playwright E2E testing","OpenTelemetry instrumentation","Node.js performance profiling"]',
      status: "draft",
    },
  ];

  const insertPlan = db.prepare(`
    INSERT INTO implementation_plans (id, repository_id, plan_type, title, roadmap, epics, milestones, phases, dependencies, suggested_order, risk_analysis, learning_prerequisites, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of plans) {
    insertPlan.run(
      p.id,
      p.repository_id,
      p.plan_type,
      p.title,
      p.roadmap,
      p.epics,
      p.milestones,
      p.phases,
      p.dependencies,
      p.suggested_order,
      p.risk_analysis,
      p.learning_prerequisites,
      p.status,
    );
  }

  // Repository Fitness
  const fitness = [
    {
      id: "fit-1",
      repository_id: "bhavya-platform",
      engineering_quality: 92,
      educational_quality: 88,
      architecture_quality: 95,
      maintainability: 90,
      extensibility: 93,
      reusability: 94,
      innovation: 85,
      community: 80,
      bhavya_score: 90,
      explanations:
        '{"engineering_quality":"High-quality code with consistent patterns","educational_value":"Good documentation but missing onboarding guides","architecture":"Excellent layer model with zero circular deps","maintainability":"Well-organized packages with clear boundaries","extensibility":"Provider pattern enables easy extension","reusability":"11 packages designed for reuse","innovation":"Standard patterns applied well","community":"Internal project, limited external adoption"}',
    },
    {
      id: "fit-2",
      repository_id: "knowledge-studio",
      engineering_quality: 82,
      educational_quality: 90,
      architecture_quality: 85,
      maintainability: 83,
      extensibility: 80,
      reusability: 75,
      innovation: 82,
      community: 70,
      bhavya_score: 84,
      explanations:
        '{"engineering_quality":"Solid code with some areas for improvement","educational_value":"Excellent for learning knowledge management","architecture":"Good tab-based UI with clear separation","maintainability":"Some components too large, need decomposition","extensibility":"Limited extension points currently","reusability":"Some UI components reusable","innovation":"Creative approach to knowledge management","community":"Internal tool, growing adoption"}',
    },
    {
      id: "fit-3",
      repository_id: "bhavya-intelligence-network",
      engineering_quality: 87,
      educational_quality: 85,
      architecture_quality: 90,
      maintainability: 85,
      extensibility: 92,
      reusability: 88,
      innovation: 90,
      community: 75,
      bhavya_score: 85,
      explanations:
        '{"engineering_quality":"Strong pipeline design with quality gates","educational_value":"Good for learning event-driven architecture","architecture":"Excellent 12-step intelligence loop","maintainability":"Well-structured but complex","extensibility":"Highly extensible pipeline stages","reusability":"Intelligence loop reusable for other domains","innovation":"Autonomous intelligence is innovative","community":"Internal project, high internal adoption"}',
    },
  ];

  const insertFitness = db.prepare(`
    INSERT INTO repository_fitness (id, repository_id, engineering_quality, educational_quality, architecture_quality, maintainability, extensibility, reusability, innovation, community, bhavya_score, explanations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const f of fitness) {
    insertFitness.run(
      f.id,
      f.repository_id,
      f.engineering_quality,
      f.educational_quality,
      f.architecture_quality,
      f.maintainability,
      f.extensibility,
      f.reusability,
      f.innovation,
      f.community,
      f.bhavya_score,
      f.explanations,
    );
  }

  // Student Mode
  const studentMode = [
    {
      id: "sm-1",
      repository_id: "bhavya-platform",
      study_guide:
        "A comprehensive guide to understanding layered architecture through Bhavya Platform. Start with the types package to understand the domain model, then explore how each layer builds on the previous.",
      learning_roadmap:
        '["Week 1: TypeScript basics and package structure","Week 2: Understanding the types package","Week 3: Database layer and data access patterns","Week 4: Events and async communication","Week 5: Security patterns","Week 6: Building your own package"]',
      prerequisites:
        '["TypeScript fundamentals","Node.js basics","Git version control","Package management with pnpm"]',
      exercises:
        '["Create a new type in @bhavya/types","Implement a simple provider","Write a database query","Create an event handler","Add a security middleware","Write unit tests for each package"]',
      mini_projects:
        '["Build a simple CRUD API using the platform packages","Create a notification system using events","Implement a caching layer","Build a monitoring dashboard"]',
      capstone_projects:
        '["Design and implement a plugin system","Build a workflow engine","Create an API gateway with rate limiting","Implement a distributed task queue"]',
      interview_questions:
        '["Explain the layered architecture and why each layer exists","How does the Provider Pattern work and when would you use it?","What is the purpose of the Event Bus and how does it enable loose coupling?","How would you add a new integration to the platform?","What are the trade-offs of using SQLite vs PostgreSQL?"]',
      discussion_questions:
        '["Why was the Package Promotion Rule chosen over pre-planning packages?","How does zero circular dependencies improve the system?","What would change if we needed to support multiple databases?","How would you migrate from one provider to another?"]',
      reflection_notes:
        '["What patterns did you recognize from your previous experience?","How does this architecture compare to systems you have worked with?","What would you do differently if designing from scratch?","What principles can you apply to your own projects?"]',
      engineering_challenges:
        '["Add a new package that depends on three existing packages without creating circular dependencies","Implement a provider that works with both local and cloud storage","Design an event schema that supports versioning","Create a migration strategy for schema changes"]',
      difficulty_score: 75,
    },
    {
      id: "sm-2",
      repository_id: "knowledge-studio",
      study_guide:
        "Learn how to build educational software by studying Knowledge Studio. Focus on the tab-based UI architecture, knowledge extraction patterns, and content management strategies.",
      learning_roadmap:
        '["Week 1: React and Next.js basics","Week 2: Understanding the tab-based UI","Week 3: Database design for knowledge management","Week 4: Content creation workflows","Week 5: Knowledge extraction patterns","Week 6: Building your own knowledge tool"]',
      prerequisites:
        '["React fundamentals","Next.js App Router basics","TypeScript","Database concepts"]',
      exercises:
        '["Create a new tab for the lesson manager","Implement a search feature","Build a knowledge package editor","Add form validation","Create a data export feature","Write component tests"]',
      mini_projects:
        '["Build a quiz generator","Create a lesson planner","Implement a progress tracker","Build a content recommendation engine"]',
      capstone_projects:
        '["Design a curriculum management system","Build an AI-powered content generator","Create a student assessment platform","Implement a collaborative editing tool"]',
      interview_questions:
        '["How does the 6-tab architecture improve user experience?","What patterns are used for knowledge extraction?","How would you add a new content type?","What are the trade-offs of client-side vs server-side rendering?"]',
      discussion_questions:
        '["Why were these specific 6 tabs chosen?","How does the runtime engine integration improve the workflow?","What would change if we needed real-time collaboration?","How would you handle offline support?"]',
      reflection_notes:
        '["What makes educational software different from other software?","How does the knowledge extraction pipeline work?","What patterns from this project could apply to other domains?","How would you improve the learning experience?"]',
      engineering_challenges:
        '["Implement optimistic updates for the lesson editor","Add offline support with service workers","Build a real-time collaboration feature","Create a plugin system for custom tabs"]',
      difficulty_score: 60,
    },
  ];

  const insertStudent = db.prepare(`
    INSERT INTO student_mode (id, repository_id, study_guide, learning_roadmap, prerequisites, exercises, mini_projects, capstone_projects, interview_questions, discussion_questions, reflection_notes, engineering_challenges, difficulty_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of studentMode) {
    insertStudent.run(
      s.id,
      s.repository_id,
      s.study_guide,
      s.learning_roadmap,
      s.prerequisites,
      s.exercises,
      s.mini_projects,
      s.capstone_projects,
      s.interview_questions,
      s.discussion_questions,
      s.reflection_notes,
      s.engineering_challenges,
      s.difficulty_score,
    );
  }

  // Elite Engineering Library
  const eliteLibrary = [
    {
      id: "elite-1",
      category: "architecture",
      title: "Layered Architecture Pattern",
      description:
        "Clean separation of concerns through layered dependencies. Foundation → Data → Communication → Integration → Presentation.",
      repository_id: "bhavya-platform",
      tags: '["architecture","layering","separation-of-concerns"]',
      quality_score: 95,
    },
    {
      id: "elite-2",
      category: "architecture",
      title: "Provider Pattern for External Integrations",
      description:
        "Abstract external services behind interfaces for swappability and testability.",
      repository_id: "bhavya-platform",
      tags: '["pattern","provider","integration","testability"]',
      quality_score: 92,
    },
    {
      id: "elite-3",
      category: "testing",
      title: "Quality Gates in Pipeline",
      description:
        "Automated quality checks at each pipeline stage with 30+ checks.",
      repository_id: "bhavya-intelligence-network",
      tags: '["testing","quality","pipeline","automation"]',
      quality_score: 90,
    },
    {
      id: "elite-4",
      category: "documentation",
      title: "Architecture Decision Records",
      description:
        "Structured format for documenting architectural decisions with context, decision, and consequences.",
      repository_id: "bhavya-platform",
      tags: '["documentation","adr","decisions","architecture"]',
      quality_score: 88,
    },
    {
      id: "elite-5",
      category: "folder-structures",
      title: "Monorepo with Package Boundaries",
      description:
        "pnpm workspaces with Turborepo enforcing package boundaries and dependency rules.",
      repository_id: "bhavya-platform",
      tags: '["monorepo","packages","turborepo","pnpm"]',
      quality_score: 93,
    },
    {
      id: "elite-6",
      category: "design-systems",
      title: "Dark Mode First Component Library",
      description:
        "10 shared React components with dark mode first design and glassmorphism aesthetic.",
      repository_id: "design-system",
      tags: '["ui","components","dark-mode","design-system"]',
      quality_score: 90,
    },
    {
      id: "elite-7",
      category: "ai-agents",
      title: "12-Step Intelligence Loop",
      description:
        "Autonomous intelligence pipeline with discovery, analysis, and recommendation stages.",
      repository_id: "bhavya-intelligence-network",
      tags: '["ai","pipeline","intelligence","automation"]',
      quality_score: 94,
    },
    {
      id: "elite-8",
      category: "architecture",
      title: "Event-Driven Architecture",
      description:
        "Domain events for loose coupling between components with history, retry, and metrics.",
      repository_id: "bhavya-platform",
      tags: '["events","async","loose-coupling","architecture"]',
      quality_score: 91,
    },
  ];

  const insertElite = db.prepare(`
    INSERT INTO elite_engineering_library (id, category, title, description, repository_id, tags, quality_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of eliteLibrary) {
    insertElite.run(
      e.id,
      e.category,
      e.title,
      e.description,
      e.repository_id,
      e.tags,
      e.quality_score,
    );
  }
}
