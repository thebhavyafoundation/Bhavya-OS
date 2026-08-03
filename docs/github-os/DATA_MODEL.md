# GitHub OS — Data Model

## Storage Strategy

| Data Type     | Storage                 | Reason                             |
| ------------- | ----------------------- | ---------------------------------- |
| Core entities | SQLite (better-sqlite3) | Local first, simple, portable      |
| Files         | Filesystem              | Large objects, git-like storage    |
| Search        | SQLite FTS5             | Full-text search, no external deps |
| Cache         | In-memory + disk        | Performance optimization           |
| Queue         | File-based              | Persistence across restarts        |
| Session       | SQLite                  | Auth sessions                      |

## Schema

### organizations

```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  settings TEXT DEFAULT '{}',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### teams

```sql
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);
```

### members

```sql
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  role TEXT CHECK(role IN ('owner','admin','engineer','instructor','student','volunteer')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_members_org ON members(organization_id);
CREATE INDEX idx_members_user ON members(user_id);
```

### team_members

```sql
CREATE TABLE team_members (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, member_id)
);
```

### repositories

```sql
CREATE TABLE repositories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  visibility TEXT CHECK(visibility IN ('public','private','internal')) DEFAULT 'private',
  default_branch TEXT DEFAULT 'main',
  language TEXT,
  topics TEXT DEFAULT '[]',  -- JSON array
  license TEXT,
  health TEXT DEFAULT '{}',  -- JSON
  archived_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, slug)
);

CREATE INDEX idx_repos_org ON repositories(organization_id);
CREATE INDEX idx_repos_visibility ON repositories(visibility);
```

### team_repositories

```sql
CREATE TABLE team_repositories (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  repository_id TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  permission TEXT CHECK(permission IN ('read','write','admin')) DEFAULT 'read',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, repository_id)
);
```

### issues

```sql
CREATE TABLE issues (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  author_id TEXT NOT NULL REFERENCES members(id),
  status TEXT CHECK(status IN ('open','in_progress','in_review','closed')) DEFAULT 'open',
  priority TEXT CHECK(priority IN ('low','medium','high','critical')) DEFAULT 'medium',
  milestone_id TEXT REFERENCES milestones(id),
  epic_id TEXT REFERENCES epics(id),
  estimate TEXT,
  ai_suggestions TEXT DEFAULT '[]',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  UNIQUE(repository_id, number)
);

CREATE INDEX idx_issues_repo ON issues(repository_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_author ON issues(author_id);
CREATE INDEX idx_issues_milestone ON issues(milestone_id);
```

### issue_labels

```sql
CREATE TABLE issue_labels (
  issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  label_id TEXT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (issue_id, label_id)
);
```

### issue_assignees

```sql
CREATE TABLE issue_assignees (
  issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  PRIMARY KEY (issue_id, member_id)
);
```

### labels

```sql
CREATE TABLE labels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  repository_id TEXT REFERENCES repositories(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(repository_id, name)
);
```

### pull_requests

```sql
CREATE TABLE pull_requests (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  author_id TEXT NOT NULL REFERENCES members(id),
  source_branch TEXT NOT NULL,
  target_branch TEXT NOT NULL,
  status TEXT CHECK(status IN ('draft','open','review','approved','merged','closed')) DEFAULT 'draft',
  ai_review TEXT,  -- JSON
  checks TEXT DEFAULT '[]',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  merged_at DATETIME,
  closed_at DATETIME,
  UNIQUE(repository_id, number)
);

CREATE INDEX idx_prs_repo ON pull_requests(repository_id);
CREATE INDEX idx_prs_status ON pull_requests(status);
CREATE INDEX idx_prs_author ON pull_requests(author_id);
```

### reviews

```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  pull_request_id TEXT NOT NULL REFERENCES pull_requests(id),
  reviewer_id TEXT NOT NULL REFERENCES members(id),
  status TEXT CHECK(status IN ('pending','approved','changes_requested','commented')),
  ai_assisted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_pr ON reviews(pull_request_id);
```

### review_comments

```sql
CREATE TABLE review_comments (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES members(id),
  file_path TEXT,
  line_number INTEGER,
  body TEXT NOT NULL,
  suggestion TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_comments_review ON review_comments(review_id);
```

### commits

```sql
CREATE TABLE commits (
  id TEXT PRIMARY KEY,
  sha TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  author_id TEXT REFERENCES members(id),
  branch TEXT,
  files_changed INTEGER DEFAULT 0,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT FALSE,
  knowledge_extracted TEXT,  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_commits_repo ON commits(repository_id);
CREATE INDEX idx_commits_sha ON commits(sha);
CREATE INDEX idx_commits_branch ON commits(branch);
```

### branches

```sql
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  is_default BOOLEAN DEFAULT FALSE,
  protection TEXT DEFAULT '{}',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  UNIQUE(repository_id, name)
);

CREATE INDEX idx_branches_repo ON branches(repository_id);
```

### releases

```sql
CREATE TABLE releases (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  name TEXT,
  description TEXT,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  author_id TEXT REFERENCES members(id),
  tag TEXT NOT NULL,
  changelog TEXT DEFAULT '[]',  -- JSON
  breaking_changes TEXT DEFAULT '[]',  -- JSON
  published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME
);

CREATE INDEX idx_releases_repo ON releases(repository_id);
```

### epics

```sql
CREATE TABLE epics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  progress INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_epics_repo ON epics(repository_id);
```

### milestones

```sql
CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  due_date DATETIME,
  progress INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME
);

CREATE INDEX idx_milestones_repo ON milestones(repository_id);
```

### knowledge_packages

```sql
CREATE TABLE knowledge_packages (
  id TEXT PRIMARY KEY,
  source_type TEXT CHECK(source_type IN ('repository','issue','pr','review','commit','release')),
  source_id TEXT NOT NULL,
  repository_id TEXT REFERENCES repositories(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',  -- JSON
  tags TEXT DEFAULT '[]',  -- JSON
  ai_analysis TEXT,  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kp_repo ON knowledge_packages(repository_id);
CREATE INDEX idx_kp_source ON knowledge_packages(source_type, source_id);
CREATE INDEX idx_kp_category ON knowledge_packages(category);
```

### knowledge_package_relations

```sql
CREATE TABLE knowledge_package_relations (
  source_id TEXT NOT NULL REFERENCES knowledge_packages(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES knowledge_packages(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  PRIMARY KEY (source_id, target_id)
);
```

### adr (Architecture Decision Records)

```sql
CREATE TABLE adr (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT CHECK(status IN ('proposed','accepted','deprecated','superseded')) DEFAULT 'proposed',
  context TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  consequences TEXT,
  alternatives TEXT DEFAULT '[]',  -- JSON
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  author_id TEXT NOT NULL REFERENCES members(id),
  superseded_by TEXT REFERENCES adr(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(repository_id, number)
);

CREATE INDEX idx_adr_repo ON adr(repository_id);
CREATE INDEX idx_adr_status ON adr(status);
```

### adr_linked_issues

```sql
CREATE TABLE adr_linked_issues (
  adr_id TEXT NOT NULL REFERENCES adr(id) ON DELETE CASCADE,
  issue_id TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  PRIMARY KEY (adr_id, issue_id)
);
```

### workflows

```sql
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  repository_id TEXT REFERENCES repositories(id),
  triggers TEXT DEFAULT '[]',  -- JSON
  steps TEXT DEFAULT '[]',  -- JSON
  enabled BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflows_repo ON workflows(repository_id);
```

### workflow_runs

```sql
CREATE TABLE workflow_runs (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL REFERENCES workflows(id),
  status TEXT CHECK(status IN ('pending','running','success','failure','cancelled')) DEFAULT 'pending',
  trigger TEXT NOT NULL,
  input TEXT DEFAULT '{}',  -- JSON
  output TEXT DEFAULT '{}',  -- JSON
  error TEXT,
  duration_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow_id);
```

### mcp_capabilities

```sql
CREATE TABLE mcp_capabilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('file_system','github','database','browser','container','custom')),
  repository_id TEXT REFERENCES repositories(id),
  installation TEXT DEFAULT '{}',  -- JSON
  configuration TEXT DEFAULT '{}',  -- JSON
  status TEXT CHECK(status IN ('active','inactive','error')) DEFAULT 'active',
  capabilities TEXT DEFAULT '[]',  -- JSON
  hardware_impact TEXT DEFAULT '{}',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mcp_repo ON mcp_capabilities(repository_id);
```

### tasks

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT CHECK(source IN ('ai','human','automation')) DEFAULT 'human',
  type TEXT CHECK(type IN ('feature','bug','refactor','docs','test','security')) DEFAULT 'feature',
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  assignee_id TEXT REFERENCES members(id),
  status TEXT CHECK(status IN ('todo','in_progress','done','cancelled')) DEFAULT 'todo',
  priority TEXT CHECK(priority IN ('low','medium','high','critical')) DEFAULT 'medium',
  ai_context TEXT,  -- JSON
  estimated_effort TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_repo ON tasks(repository_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### discussions

```sql
CREATE TABLE discussions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES members(id),
  resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discussions_entity ON discussions(entity_type, entity_id);
```

### discussion_messages

```sql
CREATE TABLE discussion_messages (
  id TEXT PRIMARY KEY,
  discussion_id TEXT NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES members(id),
  content TEXT NOT NULL,
  ai参与 BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_discussion ON discussion_messages(discussion_id);
```

### ai_sessions

```sql
CREATE TABLE ai_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  repository_id TEXT REFERENCES repositories(id),
  context TEXT DEFAULT '{}',  -- JSON
  messages TEXT DEFAULT '[]',  -- JSON
  suggestions TEXT DEFAULT '[]',  -- JSON
  actions TEXT DEFAULT '[]',  -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_sessions_user ON ai_sessions(user_id);
```

### deployments

```sql
CREATE TABLE deployments (
  id TEXT PRIMARY KEY,
  environment TEXT CHECK(environment IN ('staging','production')) NOT NULL,
  repository_id TEXT NOT NULL REFERENCES repositories(id),
  release_id TEXT NOT NULL REFERENCES releases(id),
  status TEXT CHECK(status IN ('pending','in_progress','success','failed','rolled_back')) DEFAULT 'pending',
  triggered_by TEXT NOT NULL,
  logs TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE INDEX idx_deployments_repo ON deployments(repository_id);
```

### learning_resources

```sql
CREATE TABLE learning_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK(type IN ('course','tutorial','article','video','documentation')) NOT NULL,
  url TEXT NOT NULL,
  topics TEXT DEFAULT '[]',  -- JSON
  difficulty TEXT CHECK(difficulty IN ('beginner','intermediate','advanced','expert')) DEFAULT 'intermediate',
  bhavya_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### learning_resource_links

```sql
CREATE TABLE learning_resource_links (
  resource_id TEXT NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  PRIMARY KEY (resource_id, entity_type, entity_id)
);
```

## Indexes Summary

| Table              | Index              | Purpose                |
| ------------------ | ------------------ | ---------------------- |
| members            | idx_members_org    | Org member lookup      |
| repositories       | idx_repos_org      | Org repository listing |
| issues             | idx_issues_repo    | Repository issues      |
| pull_requests      | idx_prs_repo       | Repository PRs         |
| commits            | idx_commits_repo   | Repository commits     |
| knowledge_packages | idx_kp_repo        | Repository knowledge   |
| adr                | idx_adr_repo       | Repository ADRs        |
| workflows          | idx_workflows_repo | Repository workflows   |
| tasks              | idx_tasks_repo     | Repository tasks       |

## Migrations

Migrations run automatically on startup via `@bhavya/database`:

```typescript
// packages/database/src/migrations.ts
export const migrations = [
  { version: 1, name: "init", up: "..." },
  { version: 2, name: "add_knowledge_packages", up: "..." },
  // ... auto-generated from schema
];
```

## Backup Strategy

```bash
# SQLite backup
cp bhavya-os.db bhavya-os.db.backup

# Automated daily backup
0 0 * * * cp /path/to/bhavya-os.db /backups/bhavya-os.$(date +%Y%m%d).db
```

## Data Retention

| Data Type           | Retention      | Action         |
| ------------------- | -------------- | -------------- |
| AI sessions         | 90 days        | Archive        |
| Workflow runs       | 1 year         | Archive        |
| Deployment logs     | 6 months       | Archive        |
| Discussion messages | Indefinite     | Keep           |
| Audit logs          | 7 years        | Keep           |
| Knowledge packages  | Indefinite     | Keep           |
| User data           | Until deletion | GDPR compliant |
