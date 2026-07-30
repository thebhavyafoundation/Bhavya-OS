# Bhavya AI Lab Operating System — Architecture

**Version:** 3.0.0  
**Status:** ENGINEERING FROZEN — No new infrastructure  
**Last Updated:** 2026-07-30  
**License:** MIT  
**Maintainer:** Bhavya Foundation (thebhavyafoundation@gmail.com)

---

## Table of Contents

1. [Why This Platform Exists](#1-why-this-platform-exists)
2. [Core Architectural Principles](#2-core-architectural-principles)
3. [Layer Architecture](#3-layer-architecture)
4. [Workspace Architecture](#4-workspace-architecture)
5. [Context System](#5-context-system)
6. [Capability Model](#6-capability-model)
7. [Builder System](#7-builder-system)
8. [AI Provider Layer](#8-ai-provider-layer)
9. [Knowledge Objects](#9-knowledge-objects)
10. [Skill System](#10-skill-system)
11. [Registry System](#11-registry-system)
12. [Package Manager (BPR)](#12-package-manager-bpr)
13. [Design System](#13-design-system)
14. [Runtime Flow](#14-runtime-flow)
15. [Orchestrator](#15-orchestrator)
16. [Dependency Graph](#16-dependency-graph)
17. [Multi-Agent Runtime](#17-multi-agent-runtime)
18. [Quality Gates](#18-quality-gates)
19. [Security Model](#19-security-model)
20. [Observability](#20-observability)
21. [Release Pipeline](#21-release-pipeline)
22. [Extension Guidelines](#22-extension-guidelines)
23. [Decision Records](#23-decision-records)
24. [Roadmap](#24-roadmap)

---

## 1. Why This Platform Exists

### Mission

The Bhavya AI Lab Operating System exists to provide free, offline-first AI and computer science education to students in rural Himachal Pradesh. It is designed for environments where internet access is unreliable, devices are shared, and teachers may have no prior CS background.

### Institutional Context

Bhavya Foundation, founded by Shri Manohar Lal, operates under the motto:

> **"Restoring Nature. Empowering Humanity. Preserving Heritage."**

The AI Lab is one of several initiatives under this foundation, alongside forest conservation, cultural heritage preservation, research, volunteer coordination, and transparency reporting.

### Why an Operating System?

Traditional educational software fails in rural contexts because it depends on:

- **Internet connectivity** — Online-only platforms are unusable during connectivity disruptions
- **Specific hardware** — Modern web apps assume fast devices with ample memory
- **Proprietary ecosystems** — Vendor lock-in creates unsustainable costs
- **Centralized updates** — Rural schools cannot reliably download new content

The OS approach solves these by treating the filesystem as the runtime, content as data, and AI as an interchangeable execution engine. No internet, no server, no vendor dependency.

### Design Tenets

1. **The OS belongs to the workspace, not to any AI model**
2. **AI models are execution engines — replaceable at any time**
3. **Knowledge is the center, not AI or tools**
4. **The folder structure is a context router, not a storage hierarchy**
5. **Every component must work offline**
6. **Every component must be versioned, testable, and replaceable**

---

## 2. Core Architectural Principles

### 2.1 Model Independence

The operating system never depends on a specific AI model. Claude, GPT-5, Gemini, Qwen, Codex, DeepSeek, Devstral, and any future model are interchangeable.

**Enforcement:**
- The `providers/` layer defines a common interface (`AIProvider`) with 5 methods
- No component references a model by name
- The runtime routes by capability, not by model capability
- Provider configuration is external (not hardcoded)

### 2.2 Deterministic Execution

Given the same input, the system produces the same output. This is critical for educational content where accuracy matters.

**Enforcement:**
- Builders use frame-based timing (not `Date.now()`)
- Randomness uses seeded generators (`remotion.random()`)
- No side effects in render functions
- All pipeline steps are pure transformations

### 2.3 Filesystem-First Architecture

All state lives on the filesystem as JSON, Markdown, or TypeScript files. There is no database, no API server, no cloud dependency.

**Enforcement:**
- Workspaces are directories with `CONTEXT.md` and `MANIFEST.md`
- Knowledge Objects are JSON files in `knowledge/objects/`
- The registry is `_config/skills/registry.json`
- Build output goes to `build/` or `output/`
- Observability logs to `observability/logs/`

### 2.4 Context Isolation

Each workspace knows only its own domain. A curriculum workspace does not need production rendering skills loaded in its context window.

**Enforcement:**
- The `CLAUDE.md` bootloader is under 800 tokens
- Each workspace has its own `CONTEXT.md` (~300 tokens)
- Skills are loaded by workspace, not globally
- Context is assembled per task, not per session

### 2.5 Deterministic Build Pipeline

No builder directly calls an AI model. Builders request capabilities from the runtime, which resolves them through the provider layer.

**Enforcement:**
- Builders declare required skills and registries
- The orchestrator resolves dependencies before any execution
- Quality gates validate at every pipeline stage
- Outputs are validated against schemas

### 2.6 Portability

Every component is a file. The entire OS can be copied to a USB drive or MicroSD card and run on any machine with Node.js installed.

**Enforcement:**
- No database dependencies
- No runtime-specific binaries (except Node.js)
- All config is text (JSON, Markdown, TypeScript)
- Relative paths throughout

---

## 3. Layer Architecture

The OS is organized into five layers:

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: Institution                                        │
│  (institution/)                                              │
│  Purpose: Memory, governance, identity                       │
│  Contents: decisions/, adr/, releases/, roadmap/,             │
│            governance/, history/, changelog/                  │
│  Token budget: ~200 tokens (CLAUDE.md identity section)      │
├──────────────────────────────────────────────────────────────┤
│  Layer 2: Operating System                                   │
│  (runtime.json, orchestrator/, quality-gates/, security/,    │
│   observability/, release/, dependency-graph/, docs-gen/)    │
│  Purpose: Orchestration, validation, governance              │
│  Contents: Pipeline engine, quality gates, security policies │
│            Metrics, release management, dependency graph     │
│  Token budget: ~400 tokens (loaded on demand)                │
├──────────────────────────────────────────────────────────────┤
│  Layer 3: Skills + Registries + Design                       │
│  (skills/, _config/skills/, _config/registries/,             │
│   _config/design/, packages/)                                │
│  Purpose: Reusable engineering knowledge and assets          │
│  Contents: Skill definitions, component registries,          │
│            design tokens, reusable packages                  │
│  Token budget: ~500-1000 tokens (loaded by workspace)        │
├──────────────────────────────────────────────────────────────┤
│  Layer 4: Execution Engine                                   │
│  (providers/, agents/)                                       │
│  Purpose: AI provider abstraction and agent orchestration    │
│  Contents: Provider interface, provider implementations,     │
│            agent definitions, capability-to-agent mapping    │
│  Token budget: ~200 tokens (resolved per request)            │
├──────────────────────────────────────────────────────────────┤
│  Layer 5: Applications                                       │
│  (apps/, dashboard/, examples/)                              │
│  Purpose: User-facing products built on the OS               │
│  Contents: Lesson Studio, Animation Studio, Knowledge        │
│            Browser, Engineering Dashboard, assessment tools  │
│  Token budget: Varies by application                         │
└──────────────────────────────────────────────────────────────┘
```

### Layer Communication

Layers communicate through the runtime, never directly. Layer 4 (Execution Engine) is the only layer that interfaces with an AI model. Layer 2 (OS) coordinates all activity.

```
Layer 5 → Layer 2 → Layer 3 → Layer 2 → Layer 4
          ↓                      ↓
    Quality Gates          Registry Resolution
```

---

## 4. Workspace Architecture

### 4.1 Workspace Model

Workspaces represent mental mode changes. Each workspace is a distinct domain of work with its own context, skills, and outputs.

| Workspace | Purpose | Skills | Outputs |
|-----------|---------|--------|---------|
| `research/` | Research topics | research, writing | Research briefs |
| `curriculum/` | Create lessons | education, writing, qa | Lessons, quizzes |
| `production/` | Render videos | remotion, animation, react | MP4, WebM, GIF |
| `platform/` | Deploy content | deployment, react | Websites, offline packages |

### 4.2 Workspace Structure

Each workspace follows a standard structure:

```
workspace/
├── CONTEXT.md      # For AI execution engines (10 sections)
├── MANIFEST.md     # For humans (8 metadata fields)
├── README.md       # Human documentation
└── output/         # Workspace output (gitignored)
```

### 4.3 CONTEXT.md Standard

Every `CONTEXT.md` contains exactly these 10 sections:

1. **Purpose** — What this workspace does
2. **Audience** — Who the outputs serve
3. **Current Goal** — Current objective
4. **Inputs** — What this workspace receives
5. **Outputs** — What this workspace produces
6. **Dependencies** — What this workspace depends on
7. **Constraints** — Boundaries and rules
8. **Quality Standard** — What "done" looks like
9. **Recent Decisions** — Why things are the way they are
10. **Last Updated** — Date of last change

### 4.4 MANIFEST.md Standard

| Field | Description |
|-------|-------------|
| Workspace | Name of workspace |
| Purpose | One-line description |
| Owner | Responsible team |
| Dependencies | External dependencies |
| Inputs | Expected inputs |
| Outputs | Produced outputs |
| Last Updated | Date |
| Version | Semantic version |

---

## 5. Context System

### 5.1 Context Hierarchy (from ICM)

Adapted from Van Clief & McDermott's Interpretable Context Methodology:

| Layer | What | Size |
|-------|------|------|
| 0 | CLAUDE.md (bootloader) | ~800 tokens |
| 1 | Workspace CONTEXT.md | ~300 tokens |
| 2 | Step CONTEXT.md | 200-500 tokens |
| 3 | Reference material | 500-2k tokens |
| 4 | Working artifacts | Varies |
| **Total per stage** | | **2,000-8,000 tokens** |

### 5.2 Context Assembly

```
CLAUDE.md → Identity + Routing Table + Folder Map
    ↓
Workspace CONTEXT.md → Domain + Goal + Constraints
    ↓
Skill Patterns → Loaded from registry per workspace
    ↓
Reference Material → Schemas, examples, templates
```

### 5.3 Token Optimization

- No workspace loads another workspace's context
- Skills are loaded by workspace, not globally
- CLAUDE.md is a bootloader, not documentation
- Each step has its own context boundary

---

## 6. Capability Model

### 6.1 What Is a Capability?

A capability is a named operation that the system can perform. Capabilities are the public API of the OS.

### 6.2 Capability Registry

Defined in `_config/skills/registry.json`:

```json
{
  "capabilities": {
    "video_generation": {
      "builder": "video",
      "skills": ["remotion", "animation", "react"],
      "workspace": "production"
    }
  }
}
```

### 6.3 Capability Resolution

```
User Request → "Generate a video about AI"
    ↓
CLAUDE.md → Route to capability: video_generation
    ↓
Registry → Find builder: video
    ↓
Registry → Find skills: remotion, animation, react
    ↓
Registry → Find registries: components, animations
    ↓
Registry → Find workspace: production
    ↓
Orchestrator → Execute pipeline
```

### 6.4 Current Capabilities

| Capability | Builder | Skills | Workspace |
|------------|---------|--------|-----------|
| `video_generation` | video | remotion, animation, react | production |
| `lesson_generation` | lesson | education, writing | curriculum |
| `quiz_generation` | quiz | education, qa | curriculum |
| `website_generation` | website | deployment, react | platform |
| `slides_generation` | slides | education, writing | curriculum |
| `pdf_generation` | pdf | education, writing | curriculum |
| `animation_generation` | video | remotion, animation | production |
| `diagram_generation` | video | diagramming, animation | production |
| `research_analysis` | — | research, writing | research |
| `translation` | — | translation, writing | curriculum |

---

## 7. Builder System

### 7.1 Philosophy

Builders are deterministic pipelines that transform inputs into outputs. No builder calls an AI model directly. Builders request capabilities from the runtime.

### 7.2 Builder Structure

```
builders/
└── lesson/
    ├── builder.json    # Metadata, pipeline, validation
    └── README.md       # Documentation
```

### 7.3 builder.json Schema

```json
{
  "id": "lesson",
  "name": "Lesson Builder",
  "version": "1.0.0",
  "description": "Compiles Knowledge Objects into structured lessons",
  "input": "knowledge-object",
  "output": ["lesson-json", "web-html", "pdf", "slides", "quiz", "teacher-guide"],
  "skills": ["education", "writing"],
  "registries": ["curriculum", "schemas"],
  "pipeline": [
    { "step": "validate", "action": "Validate input against schema" },
    { "step": "compile", "action": "Compile lesson sections" },
    { "step": "generate", "action": "Generate output formats" },
    { "step": "validate-output", "action": "Validate outputs against schemas" }
  ]
}
```

### 7.4 Current Builders

| Builder | Input | Outputs | Skills |
|---------|-------|---------|--------|
| lesson | Knowledge Object | lesson, web, pdf, slides, quiz, teacher-guide | education, writing |
| video | Script | mp4, webm, gif, thumbnail, transcript | remotion, animation, react |
| website | Content | static-site, offline-package | deployment, react |
| slides | Lesson | pptx, pdf-slides, html-slides | education, writing |
| pdf | Lesson | workbook-pdf, teacher-guide-pdf | education, writing |
| quiz | Knowledge Object | quiz-json, flashcards, online-quiz | education, qa |
| teacher-guide | Lesson | teacher-guide-md, teacher-guide-pdf | education, writing |
| workbook | Lesson | workbook-pdf, workbook-html | education, writing |

### 7.5 Builder Invocation

```
# Via capability
bhavya capability lesson_generation --input ko-ai-what-is-ai

# Via builder directly
bhavya build lesson ko-ai-what-is-ai
```

---

## 8. AI Provider Layer

### 8.1 Provider Interface

Defined in `providers/interfaces/ai-provider.json`:

```typescript
interface AIProvider {
  generate(req: GenerateRequest): GenerateResponse;
  generateStream(req: GenerateRequest): Stream<GenerateResponse>;
  generateCode(req: CodeRequest): CodeResponse;
  analyze(req: AnalysisRequest): AnalysisResponse;
  validate(req: ValidationRequest): ValidationResponse;
}
```

### 8.2 Supported Providers

| Provider | Status | Version |
|----------|--------|---------|
| OpenCode | Active | 1.0.0 |
| GPT-5 | Available | 1.0.0 |
| Codex | Available | 1.0.0 |
| Gemini | Available | 1.0.0 |
| Qwen | Available | 1.0.0 |
| DeepSeek | Available | 1.0.0 |
| Devstral | Available | 1.0.0 |
| Claude | Available | 1.0.0 |

### 8.3 Abstraction Principle

The runtime never imports or references a specific provider. Provider selection is done through configuration:

```json
{
  "runtime": {
    "provider": "opencode",
    "config": {
      "temperature": 0.2,
      "maxTokens": 4096
    }
  }
}
```

Changing the provider requires a config file change, not a code change.

---

## 9. Knowledge Objects

### 9.1 What Is a Knowledge Object?

A Knowledge Object is the atomic unit of educational content. It is a JSON file that captures a single concept with all its pedagogical components.

### 9.2 Knowledge Object Schema

```json
{
  "id": "ko-ai-what-is-ai",
  "domain": "ai",
  "title": "What is AI?",
  "concepts": [],
  "definitions": [],
  "examples": [],
  "misconceptions": [],
  "exercises": [],
  "references": [],
  "prerequisites": [],
  "related": []
}
```

### 9.3 Knowledge Object Store

```
knowledge/
├── concepts/         # Concept definitions (markdown)
├── glossary/         # Terminology (key: value)
├── citations/        # Source citations
├── objects/          # Knowledge Objects (JSON)
├── taxonomy/         # Classification system
└── graph/            # Knowledge Graph
    ├── nodes/
    ├── edges/
    └── queries/
```

### 9.4 From Knowledge Object to Output

```
Knowledge Object
    ↓
Lesson Builder
    ↓
┌──────┬──────┬──────┬──────┬──────┐
Lesson  Quiz  Video  PDF   Slides
    ↓
Website → Student → Teacher
```

---

## 10. Skill System

### 10.1 What Is a Skill?

A skill is a portable package of engineering knowledge for a specific domain. Skills are model-independent — any AI execution engine can consume them.

### 10.2 Skill Structure

```
skills/
└── remotion/
    ├── skill.json          # Metadata
    ├── README.md           # Human documentation
    ├── CONTEXT.md          # AI context
    ├── patterns.md         # Preferred patterns
    ├── anti_patterns.md    # What to avoid
    ├── best_practices.md   # Guidelines
    ├── validation.md       # Validation rules
    ├── references.md       # External references
    ├── examples/           # Sample implementations
    ├── templates/          # Starter files
    └── prompts/            # Task-specific prompts
```

### 10.3 skill.json Schema

```json
{
  "id": "remotion",
  "name": "Remotion Video Engineering",
  "version": "2.0.0",
  "description": "Production-ready Remotion patterns",
  "workspaces": ["production"],
  "dependencies": ["react", "typescript"],
  "registries": ["components", "layouts", "animations"]
}
```

### 10.4 Current Skills

| Skill | Workspace | Version |
|-------|-----------|---------|
| research | research/ | 2.0.0 |
| education | curriculum/ | 2.0.0 |
| writing | curriculum/ | 2.0.0 |
| qa | platform/ | 2.0.0 |
| remotion | production/ | 2.0.0 |
| animation | production/ | 2.0.0 |
| diagramming | production/ | 2.0.0 |
| react | production/ | 2.0.0 |
| deployment | platform/ | 2.0.0 |
| typescript | platform/ | 2.0.0 |
| translation | curriculum/ | 2.0.0 |
| python | build/ | 2.0.0 |
| uiux | platform/ | 2.0.0 |

### 10.5 Skill Loading

Skills are loaded by workspace, not globally. When `production/` is active, only `remotion`, `animation`, `react`, and `diagramming` patterns are loaded.

---

## 11. Registry System

### 11.1 What Is a Registry?

A registry is a collection of reusable assets. Builders check registries before generating new components.

### 11.2 Registry Structure

```
_config/registries/
├── components/      # Reusable React components
├── layouts/         # Page layouts
├── animations/      # Animation presets
├── charts/          # Chart components
├── diagrams/        # Diagram components
├── backgrounds/     # Background patterns
├── audio/           # Audio tracks
├── voice/           # Voice rules
├── branding/        # Brand assets
├── icons/           # Icon components
├── maps/            # Map visualizations
├── datasets/        # Reference datasets
└── templates/       # Page templates
```

### 11.3 Registry Resolution

```
Builder requests component
    ↓
Check registry: _config/registries/components/
    ↓
If found → Reuse with configuration
If not found → Generate new component
    ↓
Optionally add new component to registry for future reuse
```

---

## 12. Package Manager (BPR)

### 12.1 What Is BPR?

The Bhavya Package Registry (BPR) is the plugin system for the OS. Packages can contribute builders, skills, components, schemas, templates, and registries.

### 12.2 Core Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@bhavya/core` | 1.0.0 | OS utilities, routing, shared types |
| `@bhavya/education` | 1.0.0 | Curriculum design, lesson creation |
| `@bhavya/remotion` | 1.0.0 | Video rendering, animation |
| `@bhavya/website` | 1.0.0 | Static site generation |
| `@bhavya/knowledge` | 1.0.0 | Knowledge Object storage |
| `@bhavya/assessment` | 1.0.0 | Quizzes, rubrics, certificates |
| `@bhavya/community` | 1.0.0 | Community features |

### 12.3 Package Structure

```
package/
├── package.json     # npm-style metadata
├── skill.json       # Skill registration
├── components/      # Reusable UI components
├── schemas/         # Data schemas
├── registries/      # Registry contributions
├── skills/          # Skill contributions
├── builders/        # Builder contributions
└── tests/           # Validation tests
```

### 12.4 BPR Commands

```
bpr install <package>     # Install a package
bpr uninstall <package>   # Remove a package
bpr list                  # List installed packages
bpr search <query>        # Search available packages
bpr publish               # Publish a package
bpr verify <package>      # Verify package integrity
```

---

## 13. Design System

### 13.1 Architecture

```
_config/design/
├── typography/     # Type scale, font families, weights
├── spacing/        # Spacing scale, padding, margin, gap
├── grid/           # Breakpoints, columns, layouts
├── colors/         # Primary, secondary, neutral, semantic
├── animation/      # Duration scale, easing, reduced motion
├── responsive/     # Mobile-first patterns
├── accessibility/  # WCAG standards
└── patterns/       # Common layout patterns
```

### 13.2 Design Tokens

All values use a token system:

```json
{
  "colors": {
    "primary": "#1E3A5F",
    "primary-light": "#2D5A8C",
    "primary-dark": "#142A45",
    "background": "#FFFFFF",
    "foreground": "#1A1A1A",
    "muted": "#F5F5F5",
    "muted-foreground": "#737373",
    "border": "#E5E5E5",
    "destructive": "#EF4444",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "info": "#3B82F6"
  },
  "fonts": {
    "heading": "Poppins",
    "body": "Inter",
    "mono": "JetBrains Mono"
  }
}
```

### 13.3 Responsive Breakpoints

| Token | Width | Devices |
|-------|-------|---------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## 14. Runtime Flow

### 14.1 Complete Flow

```
User Request
    ↓
CLAUDE.md (Capability Routing)
    ↓
┌──────────────────────────────────────────────────┐
│ Orchestrator                                     │
│                                                  │
│ 1. Receive Request                               │
│    ↓                                             │
│ 2. Resolve Capability → Find builder + skills    │
│    ↓                                             │
│ 3. Resolve Dependencies → Build execution tree   │
│    ↓                                             │
│ 4. Load Skills → Load skill patterns             │
│    ↓                                             │
│ 5. Load Registries → Load reusable assets        │
│    ↓                                             │
│ 6. Pre-Validate → Run quality gates              │
│    ↓                                             │
│ 7. Execute Builder → Run pipeline steps          │
│    ↓                                             │
│ 8. Post-Validate → Validate outputs              │
│    ↓                                             │
│ 9. Publish Artifacts → Write output files        │
└──────────────────────────────────────────────────┘
    ↓
Observability (Metrics + Logs + Traces)
    ↓
Published output in build/ or output/
```

### 14.2 Parallel Execution

Steps 4 and 5 (Load Skills, Load Registries) can run in parallel because they have no interdependency.

### 14.3 Retry Policy

- **Max retries:** 3
- **Backoff:** Exponential
- **Initial delay:** 1,000 ms

---

## 15. Orchestrator

### 15.1 Responsibilities

The orchestrator (`orchestrator/pipeline/orchestrator.json`) is the central coordination engine. It:

1. Receives capability requests from users or agents
2. Resolves capabilities to builders, skills, registries, and schemas
3. Resolves dependencies and detects cycles
4. Loads required resources
5. Runs pre-validation quality gates
6. Executes builder pipelines
7. Runs post-validation quality gates
8. Publishes artifacts with versioning

### 15.2 Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| `capability-not-found` | Capability not in registry | Check `_config/skills/registry.json` |
| `builder-not-found` | Builder path does not exist | Check `builders/` directory |
| `skill-not-found` | Required skill not installed | Install with `bpr install` |
| `dependency-cycle` | Circular dependency detected | Break cycle in graph |
| `validation-failed` | Quality gate failed | Fix validation error |
| `build-failed` | Builder execution error | Check builder pipeline |

---

## 16. Dependency Graph

### 16.1 Graph Structure

The dependency graph (`dependency-graph/data/graph.json`) is a directed graph with nodes and typed edges.

**Node types:** capability, builder, skill, schema, registry, package, agent

**Edge types:** requires, uses, validates-against, contains, depends-on

### 16.2 Graph Size (Current)

- **Nodes:** 50+
- **Edges:** 60+
- **Node types:** 6

### 16.3 Graph Queries

| Query | Description |
|-------|-------------|
| `resolve-capability` | Find builder, skills, registries for a capability |
| `find-dependencies` | Find all dependencies for a node |
| `detect-cycles` | Detect circular dependencies |
| `validate-skill-registry` | Verify all skills are installed |
| `impact-analysis` | Find nodes affected by a change |

---

## 17. Multi-Agent Runtime

### 17.1 Agent Model

Agents are specialized workers that own capabilities and communicate through the runtime.

### 17.2 Agents

| Agent | Capabilities | Skills |
|-------|-------------|--------|
| Research Agent | research_analysis | research, writing |
| Curriculum Agent | lesson_generation, quiz_generation, slides_generation, pdf_generation | education, writing, qa |
| Animation Agent | video_generation, animation_generation, diagram_generation | remotion, animation, diagramming, react |
| Website Agent | website_generation | deployment, react |
| Documentation Agent | — | writing |
| QA Agent | — | qa |
| Release Agent | — | deployment |
| Governance Agent | — | — |

### 17.3 Communication Protocol

Agents communicate via capability requests through the runtime:

```
Agent A → Runtime → Resolve Capability → Agent B owns it
         ↓
    Runtime forwards request
         ↓
Agent B → Execute → Return result → Runtime → Agent A
```

---

## 18. Quality Gates

### 18.1 Gate Categories

| Gate | Checks | Severity |
|------|--------|----------|
| Structure | Required folders, CONTEXT.md, MANIFEST.md | Error |
| Schemas | Knowledge Object, Lesson, Video schemas | Error |
| Assets | Images, fonts, audio exist | Error |
| Components | Registry check, reuse existing | Warning |
| Accessibility | Color contrast, alt text, keyboard nav | Error |
| Performance | Image optimization, bundle size, layout shift | Warning |
| Responsive | Mobile-first, breakpoints, touch targets | Warning |
| Naming | File naming, component naming, type naming | Warning |
| Imports | No broken imports, no unused imports | Error |
| Dependencies | Skills, registries, schemas available | Error |

### 18.2 Pre-Validation vs. Post-Validation

- **Pre-validation** runs before builder execution (inputs, dependencies, assets)
- **Post-validation** runs after builder execution (outputs, quality, performance)

### 18.3 Failure Policy

- Error severity gates block the build
- Warning severity gates warn but allow the build to continue

---

## 19. Security Model

### 19.1 Package Verification

- **System packages** (`@bhavya/*`): Trusted by default
- **Community packages**: Require verification (ed25519 signing)
- **External packages**: Loaded in sandbox

### 19.2 Plugin Permissions

| Permission | Description |
|------------|-------------|
| `read-config` | Read `_config/` contents |
| `write-output` | Write to `build/` or `output/` |
| `register-skills` | Add entries to registry.json |

**Restrictions:** No network access, no filesystem access outside workspace

### 19.3 Execution Constraints

| Constraint | Value |
|------------|-------|
| Max concurrent builds | 4 |
| Timeout per build | 300,000 ms |
| Max output size | 1 GB |
| Audit log | Enabled |

---

## 20. Observability

### 20.1 Metrics

| Group | Metrics | Type |
|-------|---------|------|
| Execution | totalRequests, activeRequests, executionDuration | Counter, Gauge, Histogram |
| Builders | buildsStarted, buildsCompleted, buildsFailed, buildDuration | Counter, Histogram |
| Validation | totalChecks, passedChecks, failedChecks | Counter |
| Dependencies | resolvedDeps, failedResolutions, cycleDetections | Counter |
| Quality | gatesPassed, gatesFailed, gatesSkipped | Counter |
| Packages | installedPackages, packageUpdates | Gauge, Counter |
| Providers | providerCalls, providerErrors, providerLatency | Counter, Histogram |

### 20.2 Structured Logs

All logs are structured JSON:

```json
{
  "timestamp": "2026-07-30T06:14:14.835Z",
  "level": "info",
  "component": "orchestrator",
  "requestId": "req-abc123",
  "capability": "video_generation",
  "builder": "video",
  "duration": 45200,
  "error": null
}
```

### 20.3 Alerts

| Alert | Threshold | Window |
|-------|-----------|--------|
| Build failure rate | > 10% | 5 minutes |
| Validation failure rate | > 20% | 5 minutes |
| Dependency failure rate | > 10% | 5 minutes |
| Provider error rate | > 5% | 5 minutes |

---

## 21. Release Pipeline

### 21.1 Release Channels

| Channel | Description | Validation |
|---------|-------------|------------|
| `development` | Daily builds | Lint, typecheck, unit tests |
| `staging` | Integration | Full test suite |
| `release-candidate` | Pre-production | Full test suite + QA + security |
| `production` | Live release | Full validation + approval |

### 21.2 Versioning (SemVer)

| Bump | Meaning |
|------|---------|
| MAJOR | Breaking changes to public API or architecture |
| MINOR | New capabilities, builders, packages |
| PATCH | Bug fixes, docs, minor improvements |

### 21.3 Release Pipeline Steps

```
1. Bump version
2. Run lint → typecheck → tests → validate schemas → validate registries
3. Generate changelog
4. Generate release notes
5. Tag release
6. Promote to next channel
```

---

## 22. Extension Guidelines

### 22.1 Adding a New Package

1. Create `packages/@bhavya/new-package/`
2. Add `package.json` with metadata
3. Add `skill.json` for skill registration
4. Add `components/`, `schemas/`, `skills/`, `builders/` as needed
5. Register in `_config/skills/registry.json`
6. Add tests in `tests/packages/`
7. Run `bhavya validate` to verify

### 22.2 Adding a New Builder

1. Create `builders/new-builder/`
2. Add `builder.json` with pipeline definition
3. Link to existing skills and registries
4. Register in `_config/skills/registry.json` under `builders`
5. Add a capability entry if this is a new operation
6. Add tests in `tests/builders/`

### 22.3 Adding a New Skill

1. Create `skills/new-skill/`
2. Add `skill.json`, `README.md`, `CONTEXT.md`
3. Add `patterns.md`, `anti_patterns.md`, `best_practices.md`
4. Add `validation.md`, `references.md`
5. Add `examples/`, `templates/`, `prompts/`
6. Register in `_config/skills/registry.json`
7. Add tests in `tests/skills/`

### 22.4 Adding a New Capability

1. Add entry to `_config/skills/registry.json#/capabilities`
2. Specify `builder`, `skills`, and `workspace`
3. If no builder exists, create one (see 22.2)
4. If skills are missing, create them (see 22.3)
5. Add nodes and edges to `dependency-graph/data/graph.json`

### 22.5 Adding a New Registry

1. Create `_config/registries/new-registry/`
2. Add reusable assets
3. Add `README.md` with usage docs
4. Update any builder `registries` arrays that should use it

---

## 23. Decision Records

### ADR-001: Model Independence

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** The initial prototype used Claude-specific files. This created vendor lock-in.  
**Decision:** The OS must be model-agnostic. No files reference a specific AI provider.  
**Consequence:** All skills, registries, and context files are model-independent. Providers are interchangeable.

### ADR-002: Knowledge at Center

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should the system be organized around AI capabilities or educational content?  
**Decision:** Knowledge is the center. AI is a runtime. Lessons, videos, and assessments are compiled from Knowledge Objects.  
**Consequence:** Knowledge Objects are the atomic unit. Everything else is a build artifact.

### ADR-003: Filesystem-First

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should we use a database or the filesystem for state?  
**Decision:** All state lives on the filesystem. No database, no API server.  
**Consequence:** The OS can be copied to a USB drive and run anywhere.

### ADR-004: Capability Routing

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should we route by tool name or by capability?  
**Decision:** Route by capability. The registry maps capabilities to builders, skills, and workspaces.  
**Consequence:** The same builder can serve multiple capabilities. The same capability can use different builders.

### ADR-005: Builders Are Deterministic

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should builders call AI models directly?  
**Decision:** No. Builders request capabilities from the runtime. The runtime resolves through the provider layer.  
**Consequence:** Builders are deterministic and testable. AI is abstracted away.

### ADR-006: Workspace Context Isolation

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** How much context should each workspace have access to?  
**Decision:** Each workspace knows only its own domain. Skills are loaded by workspace. Workspaces never cross-reference.  
**Consequence:** Token budgets stay under 2,000 per stage. Each workspace is independently manageable.

### ADR-007: Registry-First Component Reuse

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should we always generate new components or reuse existing ones?  
**Decision:** Builders check registries first. New components are only generated when no existing one fits.  
**Consequence:** Component library grows organically through actual use.

### ADR-008: Multi-Agent, Single Runtime

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Should agents be independent processes or coordinated through a runtime?  
**Decision:** Agents communicate through the runtime. The runtime owns capability resolution and dependency management.  
**Consequence:** Agents are lightweight definitions (JSON), not processes. No inter-agent communication complexity.

### ADR-009: CLAUDE.md as Bootloader

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** CLAUDE.md was growing into a documentation file.  
**Decision:** CLAUDE.md is a bootloader only: identity, routing table, folder map, naming rules. Under one screen.  
**Consequence:** Under 800 tokens. Fast loading. No documentation drift.

### ADR-010: Skill Packages (Portable, Not Platform-Specific)

**Status:** Accepted  
**Date:** 2026-07-30  
**Context:** Skills were previously Claude Code-specific.  
**Decision:** Skills are portable packages with `skill.json` manifests. Any AI agent can consume them.  
**Consequence:** Skills/ directory is model-independent. Skills can be published, shared, and versioned.

---

## 24. Roadmap

### 24.1 Current Status: v3.0.0 — Engineering Frozen

**Date:** 2026-07-30  
**State:** ENGINEERING FROZEN — No new infrastructure  

All platform-level components are production-ready. The OS is stable enough for application development.

### 24.2 Next: Mission Applications 1.0

Build applications on top of the platform to validate the architecture through real use.

#### Priority 1: Lesson Studio

The flagship application. Validates the entire content pipeline:

```
Knowledge Object → Lesson Builder → Assessment → Visual Spec → Animation → Teacher Guide → Student Workbook → Website
```

#### Priority 2: Animation Studio

Validates Remotion integration, builder system, skills, and registries:

- Timeline editor
- Scene graph
- Component browser
- Motion presets
- SVG animation
- Audio timeline
- Voice synchronization
- Preview renderer
- Render queue
- Asset manager

#### Priority 3: Knowledge Browser

Validates the Knowledge Graph in practice:

- Navigate concepts hierarchically (AI → ML → Neural Networks → Backpropagation)
- Every concept linked to lessons, videos, assessments, references, projects, citations
- Learning path generation

#### Priority 4: Assessment Studio

Validates quiz builder, scoring, and evaluation:

- MCQs, flashcards, worksheets, coding exercises
- Practical activities, rubrics, teacher answer keys
- All compiled from Knowledge Objects

#### Priority 5: Engineering Dashboard

The backend already exists. Build the actual UI:

- Build status, active builders, running agents
- Validation results, render queue
- Package versions, provider health
- Capability execution, runtime metrics

### 24.3 Future: v4.0+

| Milestone | Focus |
|-----------|-------|
| Mission Applications 1.0 | Lesson Studio, Animation Studio, Knowledge Browser |
| Mission Applications 1.5 | Assessment Studio, Engineering Dashboard |
| Community Platform | Forums, collaborative learning, volunteer portal |
| Public BPR | Public package registry for community contributions |
| Bhavya AI Lab v4 | Full production release |

### 24.4 Application Development Guidelines

When building Mission Applications:

1. **Do not add new platform infrastructure** unless an application proves it is needed
2. **Validate the existing architecture** by exercising it through real use
3. **Report gaps** — If a builder is missing a step, file an issue, not a platform change
4. **Reuse before building** — Check registries before generating new components
5. **Test the pipeline** — If the Lesson Studio works end-to-end, the architecture works

---

*This document is the canonical reference for the Bhavya AI Lab Operating System v3.0.0.  
All future contributors and AI agents should read this document first before making changes.*
