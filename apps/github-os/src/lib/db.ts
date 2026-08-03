import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "github-os.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS repositories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      language TEXT,
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      license TEXT,
      topics TEXT DEFAULT '[]',
      health_score REAL DEFAULT 0,
      technology_score REAL DEFAULT 0,
      bhavya_score REAL DEFAULT 0,
      engineering_maturity TEXT DEFAULT 'emerging',
      architecture_summary TEXT,
      folder_structure TEXT,
      readme_content TEXT,
      readme_summary TEXT,
      tech_stack TEXT DEFAULT '{}',
      patterns TEXT DEFAULT '[]',
      dependencies TEXT DEFAULT '[]',
      maintainers TEXT DEFAULT '[]',
      latest_release TEXT,
      latest_commit TEXT,
      why_bhavya_cares TEXT,
      learning_difficulty TEXT DEFAULT 'intermediate',
      learning_prerequisites TEXT DEFAULT '[]',
      learning_reading_order TEXT,
      mcp_recommendations TEXT DEFAULT '[]',
      cli_recommendations TEXT DEFAULT '[]',
      recommendation_type TEXT DEFAULT 'monitor',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS knowledge_packages (
      id TEXT PRIMARY KEY,
      repository_id TEXT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      tags TEXT DEFAULT '[]',
      quality_score REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS technology_radar (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      ring TEXT NOT NULL DEFAULT 'assess',
      description TEXT,
      score REAL DEFAULT 0,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS engineering_patterns (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      pattern_name TEXT NOT NULL,
      confidence REAL DEFAULT 0,
      evidence TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS adrs (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'proposed',
      context TEXT,
      decision TEXT,
      consequences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS repository_comparisons (
      id TEXT PRIMARY KEY,
      repo_a_id TEXT NOT NULL,
      repo_b_id TEXT NOT NULL,
      comparison TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repo_a_id) REFERENCES repositories(id),
      FOREIGN KEY (repo_b_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS pattern_library (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      category TEXT NOT NULL,
      explanation TEXT NOT NULL,
      use_cases TEXT DEFAULT '[]',
      related_patterns TEXT DEFAULT '[]',
      educational_value TEXT,
      bhavya_recommendation TEXT,
      learning_mode TEXT,
      difficulty TEXT DEFAULT 'intermediate',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repository_timelines (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      metadata TEXT DEFAULT '{}',
      event_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS engineering_health (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      overall_score REAL DEFAULT 0,
      documentation_score REAL DEFAULT 0,
      test_coverage_score REAL DEFAULT 0,
      dependency_freshness_score REAL DEFAULT 0,
      release_cadence_score REAL DEFAULT 0,
      architecture_consistency_score REAL DEFAULT 0,
      knowledge_coverage_score REAL DEFAULT 0,
      adr_coverage_score REAL DEFAULT 0,
      educational_completeness_score REAL DEFAULT 0,
      calculation_methodology TEXT,
      recommendations TEXT DEFAULT '[]',
      calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS learning_paths (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      prerequisites TEXT DEFAULT '[]',
      learning_objectives TEXT DEFAULT '[]',
      reading_order TEXT DEFAULT '[]',
      important_folders TEXT DEFAULT '[]',
      key_files TEXT DEFAULT '[]',
      concepts_demonstrated TEXT DEFAULT '[]',
      suggested_exercises TEXT DEFAULT '[]',
      mini_projects TEXT DEFAULT '[]',
      capstone_ideas TEXT DEFAULT '[]',
      estimated_hours REAL DEFAULT 0,
      difficulty TEXT DEFAULT 'intermediate',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS knowledge_graph_nodes (
      id TEXT PRIMARY KEY,
      node_type TEXT NOT NULL,
      label TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relationship TEXT NOT NULL,
      weight REAL DEFAULT 1,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS educational_exports (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      export_type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE TABLE IF NOT EXISTS institutional_memory (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      evidence TEXT DEFAULT '[]',
      confidence REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_knowledge_repo ON knowledge_packages(repository_id);
    CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_packages(category);
    CREATE INDEX IF NOT EXISTS idx_radar_category ON technology_radar(category);
    CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
    CREATE INDEX IF NOT EXISTS idx_patterns_repo ON engineering_patterns(repository_id);
    CREATE INDEX IF NOT EXISTS idx_adrs_repo ON adrs(repository_id);
    CREATE INDEX IF NOT EXISTS idx_pattern_library_category ON pattern_library(category);
    CREATE INDEX IF NOT EXISTS idx_timeline_repo ON repository_timelines(repository_id);
    CREATE INDEX IF NOT EXISTS idx_health_repo ON engineering_health(repository_id);
    CREATE INDEX IF NOT EXISTS idx_learning_repo ON learning_paths(repository_id);
    CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON knowledge_graph_nodes(node_type);
    CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON knowledge_graph_edges(source_id);
    CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON knowledge_graph_edges(target_id);
    CREATE INDEX IF NOT EXISTS idx_educational_repo ON educational_exports(repository_id);
    CREATE INDEX IF NOT EXISTS idx_memory_repo ON institutional_memory(repository_id);
  `);
}
