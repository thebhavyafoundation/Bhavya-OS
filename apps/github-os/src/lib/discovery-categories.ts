// ─── Discovery Category Seeds ──────────────────────────────────────────────
// Pre-populates discovery_categories with Bhavya Foundation's research domains

import { getDb } from "./db";

export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  search_queries: string[];
  languages: string[];
  topics: string[];
  min_stars: number;
  priority: number;
}

export const BHAVYA_DISCOVERY_CATEGORIES: SeedCategory[] = [
  {
    name: "AI Infrastructure",
    slug: "ai-infrastructure",
    description:
      "LLM integrations, model serving, inference optimization, vector databases, embeddings",
    search_queries: [
      "llm inference optimization",
      "vector database",
      "embedding model",
      "model serving",
      "rag retrieval augmented",
      "prompt engineering framework",
      "ai agent framework",
    ],
    languages: ["Python", "TypeScript", "Rust", "Go"],
    topics: [
      "llm",
      "ai",
      "machine-learning",
      "nlp",
      "deep-learning",
      "vector",
      "embeddings",
    ],
    min_stars: 50,
    priority: 10,
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    description:
      "CLIs, dev experience, code quality, testing frameworks, build tools",
    search_queries: [
      "developer experience tool",
      "cli framework",
      "code quality linter",
      "testing framework",
      "build tool optimization",
      "typescript tooling",
    ],
    languages: ["TypeScript", "JavaScript", "Rust", "Go"],
    topics: [
      "cli",
      "developer-tools",
      "devex",
      "testing",
      "linter",
      "build-tool",
    ],
    min_stars: 30,
    priority: 8,
  },
  {
    name: "Web Experience",
    slug: "web-experience",
    description:
      "UI frameworks, design systems, CSS solutions, animation, accessibility",
    search_queries: [
      "design system",
      "ui component library",
      "css framework",
      "web animation",
      "accessibility tool",
      "responsive design",
      "motion design css",
    ],
    languages: ["TypeScript", "JavaScript", "CSS"],
    topics: [
      "ui",
      "design-system",
      "css",
      "animation",
      "a11y",
      "accessibility",
      "responsive",
    ],
    min_stars: 50,
    priority: 9,
  },
  {
    name: "Knowledge & Education",
    slug: "education",
    description:
      "Learning platforms, knowledge management, educational content, documentation",
    search_queries: [
      "knowledge management",
      "learning platform",
      "educational tool",
      "documentation generator",
      "knowledge graph",
      "note taking knowledge",
    ],
    languages: ["TypeScript", "Python", "JavaScript"],
    topics: [
      "education",
      "knowledge",
      "learning",
      "documentation",
      "knowledge-graph",
    ],
    min_stars: 20,
    priority: 7,
  },
  {
    name: "Infrastructure & DevOps",
    slug: "infrastructure",
    description:
      "Cloud tools, containerization, monitoring, deployment, databases",
    search_queries: [
      "cloud infrastructure tool",
      "container orchestration",
      "monitoring observability",
      "database management",
      "deployment automation",
      "serverless framework",
    ],
    languages: ["Go", "Rust", "Python", "TypeScript"],
    topics: [
      "infrastructure",
      "devops",
      "cloud",
      "docker",
      "kubernetes",
      "monitoring",
      "database",
    ],
    min_stars: 50,
    priority: 6,
  },
  {
    name: "Data & Analytics",
    slug: "data-analytics",
    description: "Data pipelines, analytics, visualization, ETL, streaming",
    search_queries: [
      "data pipeline",
      "analytics dashboard",
      "data visualization",
      "etl tool",
      "streaming data",
      "real-time analytics",
    ],
    languages: ["Python", "TypeScript", "Rust"],
    topics: [
      "data",
      "analytics",
      "visualization",
      "pipeline",
      "streaming",
      "etl",
    ],
    min_stars: 30,
    priority: 5,
  },
  {
    name: "Open Source Patterns",
    slug: "open-source",
    description:
      "Successful open source projects with governance, community, and documentation",
    search_queries: [
      "open source project",
      "awesome list",
      "community governance",
      "contributor guidelines",
      "open source license",
    ],
    languages: [],
    topics: ["open-source", "oss", "awesome", "community", "governance"],
    min_stars: 100,
    priority: 4,
  },
];

/**
 * Seed discovery categories into the database.
 * Idempotent — uses INSERT OR REPLACE.
 */
export function seedDiscoveryCategories(): number {
  const db = getDb();
  let count = 0;

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO discovery_categories
    (id, name, slug, description, search_queries, languages, topics, min_stars, active, priority, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, '{}')
  `);

  const insertMany = db.transaction((categories: SeedCategory[]) => {
    for (const cat of categories) {
      stmt.run(
        `cat_${cat.slug}`,
        cat.name,
        cat.slug,
        cat.description,
        JSON.stringify(cat.search_queries),
        JSON.stringify(cat.languages),
        JSON.stringify(cat.topics),
        cat.min_stars,
        cat.priority,
      );
      count++;
    }
  });

  insertMany(BHAVYA_DISCOVERY_CATEGORIES);
  return count;
}

/**
 * Verify seeded categories exist.
 */
export function verifySeededCategories(): SeedCategory[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM discovery_categories WHERE active = 1 ORDER BY priority DESC`,
    )
    .all() as Record<string, unknown>[];

  return rows.map((row) => ({
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    search_queries: JSON.parse((row.search_queries as string) ?? "[]"),
    languages: JSON.parse((row.languages as string) ?? "[]"),
    topics: JSON.parse((row.topics as string) ?? "[]"),
    min_stars: row.min_stars as number,
    priority: row.priority as number,
  }));
}
