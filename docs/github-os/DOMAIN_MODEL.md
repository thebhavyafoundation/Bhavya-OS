# GitHub OS — Domain Model

## Core Entities

### 1. Organization

The top-level container. Represents Bhavya Foundation or a department.

```
Organization
├── id: string
├── name: string
├── slug: string
├── description: string
├── settings: OrganizationSettings
├── teams: Team[]
├── repositories: Repository[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 2. Team

A group of members with shared responsibilities.

```
Team
├── id: string
├── name: string
├── slug: string
├── description: string
├── organizationId: string (FK)
├── members: Member[]
├── repositories: Repository[] (access)
├── permissions: Permission[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 3. Member

A user within an organization. Can belong to multiple teams.

```
Member
├── id: string
├── userId: string (FK to auth)
├── organizationId: string (FK)
├── role: MemberRole (owner | admin | engineer | instructor | student | volunteer)
├── teams: Team[]
├── contributions: Contribution[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 4. Repository

The core entity. A code repository with intelligence.

```
Repository
├── id: string
├── name: string
├── slug: string
├── description: string
├── organizationId: string (FK)
├── visibility: Visibility (public | private | internal)
├── defaultBranch: string
├── language: string
├── topics: string[]
├── license: string | null
├── health: RepositoryHealth
├── knowledge: KnowledgePackage[]
├── architecture: ArchitectureAnalysis
├── automation: Workflow[]
├── mcpCapabilities: MCPCapability[]
├── createdAt: timestamp
├── updatedAt: timestamp
└── archivedAt: timestamp | null
```

### 5. Issue

A work item linked to repository context.

```
Issue
├── id: string
├── number: integer
├── title: string
├── description: string
├── repositoryId: string (FK)
├── authorId: string (FK to Member)
├── assignees: Member[]
├── labels: Label[]
├── milestone: Milestone | null
├── epic: Epic | null
├── status: IssueStatus
├── priority: Priority
├── aiSuggestions: AISuggestion[]
├── linkedADRs: ADR[]
├── linkedLearningResources: LearningResource[]
├── estimate: Estimate | null
├── createdAt: timestamp
├── updatedAt: timestamp
├── closedAt: timestamp | null
└── events: Event[]
```

### 6. PullRequest

A code change proposal with review workflow.

```
PullRequest
├── id: string
├── number: integer
├── title: string
├── description: string
├── repositoryId: string (FK)
├── authorId: string (FK to Member)
├── sourceBranch: string
├── targetBranch: string
├── status: PRStatus (open | review | approved | merged | closed)
├── reviews: Review[]
├── commits: Commit[]
├── aiReview: AIReview | null
├── knowledgeGenerated: KnowledgePackage[]
├── checks: Check[]
├── createdAt: timestamp
├── updatedAt: timestamp
├── mergedAt: timestamp | null
└── events: Event[]
```

### 7. Review

A code review on a pull request.

```
Review
├── id: string
├── pullRequestId: string (FK)
├── reviewerId: string (FK to Member)
├── status: ReviewStatus (pending | approved | changes_requested | commented)
├── comments: ReviewComment[]
├── aiAssisted: boolean
├── learningPoints: string[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 8. Commit

A git commit with metadata.

```
Commit
├── id: string
├── sha: string
├── message: string
├── repositoryId: string (FK)
├── authorId: string (FK to Member)
├── branch: string
├── filesChanged: integer
├── additions: integer
├── deletions: integer
├── aiGenerated: boolean
├── knowledgeExtracted: KnowledgePackage | null
├── createdAt: timestamp
└── verified: boolean
```

### 9. Branch

A git branch with lifecycle tracking.

```
Branch
├── id: string
├── name: string
├── repositoryId: string (FK)
├── isDefault: boolean
├── protection: BranchProtection
├── commits: Commit[]
├── pullRequests: PullRequest[]
├── createdAt: timestamp
└── deletedAt: timestamp | null
```

### 10. Release

A versioned release with changelog.

```
Release
├── id: string
├── version: string
├── name: string
├── description: string
├── repositoryId: string (FK)
├── authorId: string (FK to Member)
├── tag: string
├── changelog: Changelog
├── assets: ReleaseAsset[]
├── breakingChanges: BreakingChange[]
├── knowledgePackages: KnowledgePackage[]
├── createdAt: timestamp
└── publishedAt: timestamp
```

### 11. Epic

A large body of work containing issues.

```
Epic
├── id: string
├── title: string
├── description: string
├── repositoryId: string (FK)
├── issues: Issue[]
├── progress: Progress
├── milestones: Milestone[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 12. Milestone

A time-boxed collection of issues.

```
Milestone
├── id: string
├── title: string
├── description: string
├── repositoryId: string (FK)
├── dueDate: timestamp
├── issues: Issue[]
├── progress: Progress
├── createdAt: timestamp
└── closedAt: timestamp | null
```

### 13. KnowledgePackage

An extracted insight from engineering activity.

```
KnowledgePackage
├── id: string
├── sourceType: SourceType (repository | issue | pr | review | commit | release)
├── sourceId: string
├── repositoryId: string (FK)
├── category: KnowledgeCategory
├── title: string
├── content: string
├── metadata: JSON
├── tags: string[]
├── aiAnalysis: AIAnalysis
├── relatedPackages: KnowledgePackage[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 14. ADR (Architecture Decision Record)

A documented architectural decision.

```
ADR
├── id: string
├── number: integer
├── title: string
├── status: ADRStatus (proposed | accepted | deprecated | superseded)
├── context: string
├── decision: string
├── consequences: string
├── alternatives: string[]
├── repositoryId: string (FK)
├── authorId: string (FK to Member)
├── linkedIssues: Issue[]
├── linkedPRs: PullRequest[]
├── supersededBy: ADR | null
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 15. Workflow

An automation workflow definition.

```
Workflow
├── id: string
├── name: string
├── description: string
├── repositoryId: string (FK | null, null = org-level)
├── triggers: Trigger[]
├── steps: WorkflowStep[]
├── enabled: boolean
├── lastRun: WorkflowRun | null
├── runs: WorkflowRun[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 16. MCPCapability

An integrated MCP server capability.

```
MCPCapability
├── id: string
├── name: string
├── type: MCPServerType
├── repositoryId: string (FK | null)
├── installation: InstallationGuide
├── configuration: JSON
├── status: MCPStatus (active | inactive | error)
├── capabilities: string[]
├── hardwareImpact: HardwareImpact
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 17. Task

An AI-generated or human-created task.

```
Task
├── id: string
├── title: string
├── description: string
├── source: TaskSource (ai | human | automation)
├── type: TaskType (feature | bug | refactor | docs | test | security)
├── repositoryId: string (FK)
├── assignee: Member | null
├── status: TaskStatus
├── priority: Priority
├── aiContext: AIContext | null
├── estimatedEffort: string | null
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 18. Discussion

A conversation thread on any entity.

```
Discussion
├── id: string
├── title: string
├── entityType: string
├── entityId: string
├── authorId: string (FK to Member)
├── messages: DiscussionMessage[]
├── ai参与: boolean
├── resolved: boolean
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 19. AISession

An AI interaction session with context.

```
AISession
├── id: string
├── userId: string (FK to Member)
├── repositoryId: string (FK | null)
├── context: AIContext
├── messages: AIMessage[]
├── suggestions: AISuggestion[]
├── actions: AIAction[]
├── createdAt: timestamp
└── updatedAt: timestamp
```

### 20. Deployment

A deployment event with environment tracking.

```
Deployment
├── id: string
├── environment: Environment (staging | production)
├── repositoryId: string (FK)
├── releaseId: string (FK)
├── status: DeploymentStatus
├── triggeredBy: string (Member | automation)
├── logs: string
├── createdAt: timestamp
└── completedAt: timestamp | null
```

### 21. LearningResource

An educational resource linked to engineering work.

```
LearningResource
├── id: string
├── title: string
├── type: ResourceType (course | tutorial | article | video | documentation)
├── url: string
├── topics: string[]
├── difficulty: DifficultyLevel
├── linkedEntities: LinkedEntity[]
├── bhavyaScore: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

## Relationships

```
Organization ──1:N── Team
Organization ──1:N── Repository
Organization ──1:N── Member
Team ──M:N── Member
Team ──M:N── Repository (access)

Repository ──1:N── Issue
Repository ──1:N── PullRequest
Repository ──1:N── Branch
Repository ──1:N── Release
Repository ──1:N── Commit
Repository ──1:N── KnowledgePackage
Repository ──1:N── ADR
Repository ──1:N── Workflow
Repository ──1:N── MCPCapability
Repository ──1:N── Task
Repository ──1:N── Deployment

PullRequest ──1:N── Review
PullRequest ──1:N── Commit
PullRequest ──M:N── Issue

Issue ──M:N── Label
Issue ──N:1── Milestone
Issue ──N:1── Epic

Review ──1:N── ReviewComment

KnowledgePackage ──M:N── KnowledgePackage (related)
ADR ──M:N── Issue (linked)
ADR ──M:N── PullRequest (linked)
```

## Lifecycle States

### Repository

`active` → `archived` → `deleted`

### Issue

`open` → `in_progress` → `in_review` → `closed`

### PullRequest

`draft` → `open` → `review` → `approved` → `merged` → `closed`

### ADR

`proposed` → `accepted` → `deprecated` → `superseded`

### Workflow

`draft` → `active` → `disabled`

### Release

`draft` → `prerelease` → `published`

### Deployment

`pending` → `in_progress` → `success` → `failed` → `rolled_back`

## Aggregate Roots

The following entities are aggregate roots (manage their own consistency):

1. **Organization** — owns all entities
2. **Repository** — owns issues, PRs, branches, releases, ADRs, workflows
3. **PullRequest** — owns reviews, commits
4. **Issue** — owns discussions, labels

## Invariants

1. A Repository must belong to exactly one Organization
2. An Issue must have a status transition that follows the lifecycle
3. A PullRequest cannot be merged without at least one approval
4. An ADR cannot be deprecated without a superseding ADR (or explicit reason)
5. A Workflow cannot run if disabled
6. A Deployment cannot succeed without passing checks
7. A KnowledgePackage must link to a valid source entity
