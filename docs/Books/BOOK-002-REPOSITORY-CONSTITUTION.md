# BOOK-002 — Repository Constitution

**The Structural Law of Bhavya OS**

> "A repository is not a collection of files. It is a living institution. Every directory has purpose. Every file has meaning. Every convention serves the whole."

**Version:** 1.0
**Status:** Active
**Authority:** Subordinate to BOOK-001 (AI Constitution)
**Last Updated:** 2026-07-27

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Philosophy](#2-philosophy)
3. [Mission](#3-mission)
4. [Architecture](#4-architecture)
5. [Rules](#5-rules)
6. [Implementation](#6-implementation)
7. [Examples](#7-examples)
8. [Anti-patterns](#8-anti-patterns)
9. [Checklists](#9-checklists)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Automation Hooks](#11-automation-hooks)
12. [Future Evolution](#12-future-evolution)
13. [Appendices](#13-appendices)

---

## 1. Introduction

### 1.1 What Is This Document?

This is the **Repository Constitution** — the structural law of Bhavya OS. It defines the physical structure of the repository, how files and directories are organized, naming conventions, and the rules that govern the repository's evolution.

### 1.2 Why Does This Exist?

A repository without structure becomes chaos. As Bhavya OS grows to include 9+ applications, 16+ packages, and hundreds of files, the repository structure must be:

- **Predictable** — Any file can be found by following conventions
- **Scalable** — New apps, packages, and features fit naturally
- **Maintainable** — Changes don't require restructuring
- **Self-documenting** — The structure tells you what's important

### 1.3 Scope

This document governs:

- Directory structure and naming
- File naming conventions
- Package organization
- Monorepo workspace configuration
- Git branch strategy
- Commit message format
- Pull request conventions
- Release process

---

## 2. Philosophy

### 2.1 Core Belief

> "Projects finish. Institutions endure. Buildings age. Knowledge grows. People come and go. Values remain."

The repository is an institution. Its structure must endure beyond any individual project, feature, or contributor.

### 2.2 Design Principles

1. **Convention Over Configuration**
   - If a convention exists, follow it
   - If a convention doesn't exist, establish one
   - Never make contributors guess

2. **Separation of Concerns**
   - Each directory has a single purpose
   - Each package has a single responsibility
   - Each file has a single reason to change

3. **Progressive Disclosure**
   - Simple things are simple
   - Complex things are possible
   - The structure reveals complexity gradually

4. **Deterministic Navigation**
   - Any file can be found in 3 steps or less
   - The index maps every entity to its location
   - No orphan files, no mystery directories

5. **Institutional Memory**
   - The structure preserves history
   - Decisions are documented
   - Evolution is traceable

---

## 3. Mission

### 3.1 Repository Mission

To organize the Bhavya OS codebase in a way that:

1. Any AI model can navigate it instantly
2. Any human contributor can understand it quickly
3. Any stakeholder can audit it completely
4. Any future maintainer can evolve it safely

### 3.2 Success Criteria

The Repository Constitution succeeds when:

- New contributors find their first file in < 30 seconds
- New packages fit the structure without restructuring
- The repository scales to 100+ packages without chaos
- Every file has a clear owner and purpose
- The structure is self-documenting

---

## 4. Architecture

### 4.1 Top-Level Structure

```
Bhavya-OS/
├── .ai/                    # AI Runtime Operating System
├── .agents/                # Agent definitions and skills
├── .changeset/             # Changeset configuration
├── .github/                # GitHub workflows and templates
├── .husky/                 # Git hooks
├── .opencode/              # OpenCode configuration
├── .playwright-mcp/        # Playwright test artifacts
├── .turbo/                 # Turborepo cache
├── .vercel/                # Vercel deployment config
├── .vscode/                # VS Code settings
├── apps/                   # Application packages
├── config/                 # Shared configuration
├── content/                # MDX content layer
├── design-system/          # Design system definitions
├── docs/                   # Documentation
├── governance/             # Governance layer
├── history/                # Historical records
├── memory/                 # Institutional memory
├── navigation/             # Navigation registries
├── openhuman/              # OpenHuman sub-repository
├── packages/               # Shared packages
├── registry/               # Generated registries
├── rfcs/                   # Request for Comments
├── schemas/                # JSON Schema definitions
├── scripts/                # Build and utility scripts
├── specs/                  # Product specifications
├── standards/              # Engineering standards
├── validation/             # Release validation plans
├── 01_The_Constitution.md  # Foundation governance documents
├── 02_Public_Charitable_Trust_Deed.md
├── ... (through 15)
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # Workspace definition
├── pnpm-lock.yaml          # Dependency lock file
├── turbo.json              # Turborepo configuration
└── README.md               # Repository introduction
```

### 4.2 Application Structure

Every application in `apps/` follows this structure:

```
apps/<app-name>/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # CSS and style files
├── public/                 # Static assets
├── tests/                  # Test files
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

### 4.3 Package Structure

Every package in `packages/` follows this structure:

```
packages/<package-name>/
├── src/
│   ├── index.ts            # Main entry point
│   ├── types/              # Type definitions
│   └── utils/              # Utility functions
├── tests/                  # Test files
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Package documentation
```

### 4.4 Naming Conventions

| Entity         | Convention                    | Example                                 |
| -------------- | ----------------------------- | --------------------------------------- |
| Applications   | lowercase, hyphen-separated   | `website`, `admin-app`                  |
| Packages       | lowercase, hyphen-separated   | `mission-runtime`, `bhavya-sdk`         |
| Components     | PascalCase                    | `HeroSection.tsx`, `MissionCards.tsx`   |
| Hooks          | camelCase with `use` prefix   | `useGsapHero.ts`                        |
| Utilities      | camelCase                     | `buildMetadata.ts`                      |
| Types          | PascalCase with `Type` suffix | `MissionType.ts`                        |
| Constants      | UPPER_SNAKE_CASE              | `MAX_RETRY_COUNT`                       |
| CSS Classes    | kebab-case                    | `hero-section`, `nav-link`              |
| CSS Variables  | kebab-case with `--` prefix   | `--forest-700`, `--text-primary`        |
| JSON Files     | kebab-case                    | `registry.json`, `knowledge-graph.json` |
| Markdown Files | UPPER-KEBAB-CASE              | `BOOK-001-AI-CONSTITUTION.md`           |
| YAML Files     | kebab-case                    | `manifest.yaml`, `index.yaml`           |

### 4.5 File Naming Conventions

| File Type         | Convention                 | Example                       |
| ----------------- | -------------------------- | ----------------------------- |
| React Components  | PascalCase.tsx             | `Header.tsx`                  |
| React Hooks       | camelCase.ts               | `useGsapHero.ts`              |
| Utility Functions | camelCase.ts               | `buildMetadata.ts`            |
| Type Definitions  | PascalCase.ts              | `MissionType.ts`              |
| Test Files        | `*.test.ts` or `*.spec.ts` | `Header.test.tsx`             |
| CSS Modules       | `*.module.css`             | `Header.module.css`           |
| Configuration     | lowercase.json/yaml        | `package.json`                |
| Documentation     | UPPER-KEBAB-CASE.md        | `BOOK-001-AI-CONSTITUTION.md` |
| Schemas           | kebab-case.schema.json     | `agent.schema.json`           |
| Registries        | kebab-case.json            | `registry.json`               |

---

## 5. Rules

### 5.1 Directory Rules

1. **No orphan directories** — Every directory must be referenced in the index
2. **No deep nesting** — Maximum 4 levels deep
3. **No mixed concerns** — Each directory has one purpose
4. **No hidden complexity** — Directory purpose must be obvious from name
5. **No dead directories** — Remove empty directories promptly

### 5.2 File Rules

1. **No orphan files** — Every file must be referenced somewhere
2. **No duplicate files** — Single source of truth for every concept
3. **No binary files in git** — Use Git LFS or external storage
4. **No generated files committed** — Regenerate from source
5. **No secrets in files** — Use environment variables

### 5.3 Naming Rules

1. **Be descriptive** — File names tell you what's inside
2. **Be consistent** — Follow established conventions
3. **Be concise** — Short but meaningful names
4. **Be searchable** — Use full words, not abbreviations
5. **Be versioned** — Use semantic versioning for packages

### 5.4 Import Rules

1. **Absolute imports** — Use `@/` prefix for app imports
2. **Package imports** — Use `@bhavya/` prefix for package imports
3. **Relative imports** — Use `./` only for nearby files
4. **No circular dependencies** — Verify with `madge`
5. **No barrel exports** — Import specific files

### 5.5 Git Rules

1. **Conventional commits** — Use `type(scope): description`
2. **Atomic commits** — One logical change per commit
3. **No force pushes** — Except for branch rebasing
4. **No direct pushes to main** — Always use pull requests
5. **No merge commits** — Use squash or rebase

---

## 6. Implementation

### 6.1 Adding a New Application

```bash
# 1. Create directory
mkdir apps/<app-name>

# 2. Initialize package.json
cd apps/<app-name>
pnpm init

# 3. Add to workspace (already configured in pnpm-workspace.yaml)

# 4. Register in .ai/index.yaml
# Add entry: APP-XXX: apps/<app-name>

# 5. Register in .ai/manifest.yaml
# Add to apps section

# 6. Create navigation registry
# Add to navigation/<app-name>.json

# 7. Update registry
pnpm registry:generate
```

### 6.2 Adding a New Package

```bash
# 1. Create directory
mkdir packages/<package-name>

# 2. Initialize package.json
cd packages/<package-name>
pnpm init

# 3. Add to workspace (already configured in pnpm-workspace.yaml)

# 4. Register in .ai/index.yaml
# Add entry: PKG-XXX: packages/<package-name>

# 5. Register in .ai/manifest.yaml
# Add to packages section

# 6. Update registry
pnpm registry:generate
```

### 6.3 Adding a New Standard

```bash
# 1. Create file
touch standards/<standard-name>.md

# 2. Register in .ai/index.yaml
# Add entry: STD-XXX: standards/<standard-name>.md

# 3. Update registry
pnpm registry:generate
```

### 6.4 Adding a New Agent

```bash
# 1. Create agent definition
touch .agents/<agent-name>.agent.json

# 2. Register in .agents/registry.json
# Add entry to agents array

# 3. Update registry
pnpm registry:generate
```

### 6.5 Adding a New Skill

```bash
# 1. Create directory
mkdir .agents/skills/<skill-name>

# 2. Create SKILL.md
touch .agents/skills/<skill-name>/SKILL.md

# 3. Update skill registry if needed
```

---

## 7. Examples

### 7.1 Correct Repository Structure

```
apps/
├── website/              # Public website (port 3000)
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── package.json
├── admin/                # Admin dashboard (port 3001)
│   └── ...
└── docs/                 # Documentation platform (port 3002)
    └── ...
```

**Why this is correct:**

- Each app has a clear purpose
- Each app follows the same structure
- Naming is consistent and descriptive
- Ports are documented

### 7.2 Incorrect Repository Structure

```
apps/
├── my-app/               # Unclear purpose
├── test/                 # Temporary directory
├── old-website/          # Dead directory
└── website-v2/           # Confusing naming
```

**Why this is wrong:**

- `my-app` has no descriptive name
- `test` is temporary and shouldn't be in apps
- `old-website` is dead code
- `website-v2` creates confusion about which is current

---

## 8. Anti-patterns

### 8.1 Never Do This

| Anti-pattern                         | Why it's wrong           | Correct approach                |
| ------------------------------------ | ------------------------ | ------------------------------- |
| Creating files outside the structure | Violates organization    | Follow directory conventions    |
| Using unclear file names             | Violates discoverability | Use descriptive names           |
| Mixing concerns in directories       | Violates separation      | Keep one purpose per directory  |
| Committing generated files           | Violates single source   | Regenerate from source          |
| Using different naming conventions   | Violates consistency     | Follow established conventions  |
| Creating deep directory trees        | Violates simplicity      | Keep to 4 levels max            |
| Leaving empty directories            | Violates cleanliness     | Remove promptly                 |
| Using absolute paths in imports      | Violates portability     | Use relative or aliased imports |

### 8.2 Common Mistakes

1. **The Junk Drawer** — Putting everything in a `utils/` directory
2. **The Migration Trap** — Keeping old versions alongside new
3. **The Feature Branch Graveyard** — Never merging or deleting branches
4. **The Config Sprawl** — Configuration files scattered everywhere
5. **The Test Desert** — No tests or tests in wrong locations
6. **The Documentation Void** — No README or outdated docs
7. **The Dependency Mess** — Circular or unnecessary dependencies
8. **The Naming Chaos** — Inconsistent naming conventions

---

## 9. Checklists

### 9.1 Adding a New File

- [ ] Determine the correct directory
- [ ] Follow naming conventions
- [ ] Check for existing similar files
- [ ] Register in index.yaml if significant
- [ ] Add to manifest.yaml if public
- [ ] Update navigation if user-facing
- [ ] Write commit message in conventional format

### 9.2 Adding a New Directory

- [ ] Verify it's necessary (no existing directory fits)
- [ ] Choose a clear, descriptive name
- [ ] Add a README.md explaining purpose
- [ ] Register in index.yaml
- [ ] Update manifest.yaml
- [ ] Update repository-map.md

### 9.3 Removing a File

- [ ] Check for references in other files
- [ ] Update index.yaml
- [ ] Update manifest.yaml
- [ ] Update any imports
- [ ] Log the decision
- [ ] Commit with clear message

### 9.4 Restructuring

- [ ] Document the current structure
- [ ] Document the proposed structure
- [ ] Create an RFC if significant
- [ ] Get approval from Documentation Agent
- [ ] Plan the migration steps
- [ ] Execute in small, atomic commits
- [ ] Verify all tests pass
- [ ] Update all documentation

---

## 10. Acceptance Criteria

### 10.1 For Repository Structure

The repository structure is compliant when:

1. Every directory has a README.md
2. Every package has a package.json
3. Every app has navigation configuration
4. Every significant entity is in index.yaml
5. Every public entity is in manifest.yaml
6. No orphan files exist
7. No dead directories exist
8. Naming conventions are consistent
9. Import patterns are consistent
10. The structure is self-documenting

### 10.2 For File Changes

A file change is compliant when:

1. The file is in the correct directory
2. The file follows naming conventions
3. The file doesn't duplicate existing content
4. The file is registered in the index
5. The file has appropriate documentation
6. The commit follows conventional format
7. The change is atomic and focused
8. All references are updated
9. All tests pass
10. The change is auditable

---

## 11. Automation Hooks

### 11.1 Structure Validation

```yaml
validation:
  - name: Directory Structure Check
    command: node scripts/validate-structure.mjs
    trigger: pre-commit
  - name: Naming Convention Check
    command: node scripts/validate-naming.mjs
    trigger: pre-commit
  - name: Index Consistency Check
    command: node scripts/validate-index.mjs
    trigger: pre-commit
  - name: Registry Generation
    command: pnpm registry:generate
    trigger: post-commit
```

### 11.2 Cleanup Automation

```yaml
cleanup:
  - name: Empty Directory Detection
    schedule: weekly
    command: node scripts/find-empty-dirs.mjs
  - name: Orphan File Detection
    schedule: weekly
    command: node scripts/find-orphan-files.mjs
  - name: Dead Link Detection
    schedule: weekly
    command: node scripts/check-dead-links.mjs
```

---

## 12. Future Evolution

### 12.1 Planned Enhancements

1. **Automated Structure Validation** — Real-time feedback on structure violations
2. **Visual Repository Map** — Interactive visualization of repository structure
3. **Dependency Graph Visualization** — Visual representation of package dependencies
4. **Automated Cleanup** — AI-powered detection and cleanup of dead code
5. **Structure Metrics** — Metrics on repository health and structure quality
6. **Migration Tools** — Automated tools for repository restructuring
7. **Template Generator** — Scaffolding for new apps, packages, and components
8. **Convention Enforcer** — Automated enforcement of naming conventions

### 12.2 Evolution Process

Changes to this constitution require:

1. RFC submitted to `.ai/rfcs/`
2. Review by Documentation Agent
3. Approval by Governance Agent
4. Update to this document
5. Notification to all agents
6. Update to dependent documents

---

## 13. Appendices

### Appendix A: Directory Purpose Reference

| Directory        | Purpose                      | Owner               |
| ---------------- | ---------------------------- | ------------------- |
| `.ai/`           | AI Runtime Operating System  | Documentation Agent |
| `.agents/`       | Agent definitions and skills | Governance Agent    |
| `apps/`          | Application packages         | Architecture Agent  |
| `config/`        | Shared configuration         | Architecture Agent  |
| `content/`       | MDX content layer            | Documentation Agent |
| `design-system/` | Design system definitions    | Design Agent        |
| `docs/`          | Documentation                | Documentation Agent |
| `governance/`    | Governance layer             | Governance Agent    |
| `history/`       | Historical records           | Documentation Agent |
| `memory/`        | Institutional memory         | AI Runtime          |
| `navigation/`    | Navigation registries        | Frontend Agent      |
| `packages/`      | Shared packages              | Architecture Agent  |
| `registry/`      | Generated registries         | Build System        |
| `rfcs/`          | Request for Comments         | All Agents          |
| `schemas/`       | JSON Schema definitions      | Architecture Agent  |
| `scripts/`       | Build and utility scripts    | DevOps Agent        |
| `specs/`         | Product specifications       | Product Agent       |
| `standards/`     | Engineering standards        | Architecture Agent  |
| `validation/`    | Release validation plans     | QA Agent            |

### Appendix B: Related Documents

- BOOK-001: AI Constitution
- BOOK-003: Engineering Constitution
- `.ai/conventions.md`: Repository conventions
- `.ai/repository-map.md`: Repository map
- `.ai/index.yaml`: Deterministic file lookup

---

_This document defines the structural law of Bhavya OS. All repository organization must comply with these rules._
