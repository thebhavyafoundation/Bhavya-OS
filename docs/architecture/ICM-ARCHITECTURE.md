# Bhavya OS ICM Architecture

## Why ICM Was Adopted

Bhavya OS has a sophisticated governance architecture (AGENTS.md, ADRs, RFCs, standards, contracts, registry, agent definitions, memory, workflows, policies). However, the filesystem lacked a **navigation layer** — an agent with no conversational memory could not reliably orient, find contracts, execute work, or validate completion.

ICM (Interpretable Context Methodology) provides the **agent navigation / context architecture layer** that makes the existing governance system discoverable. It does NOT replace governance — it makes governance findable.

**Source:** [Interpretable Context Methodology: Folder Structure as Agent Architecture](https://arxiv.org/abs/2603.16021) (Van Clief & McDermott, MIT-licensed)

## What ICM Is Responsible For

- Agent orientation (where am I, what do I do)
- Navigation routing (where do I go for task X)
- Context scoping (load only what this step needs)
- Status derivation (scan filesystem for current state)
- Deduplication enforcement (one home per fact)

## What Governance Remains Responsible For

- Engineering principles and standards (`AGENTS.md`, `standards/`)
- Architecture decisions (`docs/adr/`)
- RFCs and review processes (`rfcs/`)
- Agent permissions and scope (`.agents/`, `platform/agents/`)
- Security policies (`.policies/`)
- Release governance (`governance/`)
- Quality gates (`scripts/quality-gates.mjs`)

## Directory Architecture

```
Bhavya OS (monorepo)
├── AGENTS.md          ← L0 entry: engineering constitution + routing table
├── CONTEXT.md         ← L1 router: maps tasks to locations
├── apps/              ← Umbrella: 23 applications
│   └── CONTEXT.md     ← L2: app routing
├── packages/          ← Record Library: 64 packages
│   └── CONTEXT.md     ← L2: package routing
├── .ai/               ← Knowledge Bundle: agent context
│   └── CONTEXT.md     ← L2: agent context routing
├── docs/              ← Knowledge Bundle: documentation
│   └── CONTEXT.md     ← L2: doc routing
├── .agents/           ← Context Map: agent definitions
├── platform/          ← Context Map: runtime definitions
├── registry/          ← Catalog: machine-readable indexes
├── schemas/           ← Contract: validation rules
├── standards/         ← Contract: engineering standards
├── governance/        ← Contract: governance rules
├── rfcs/              ← Pipeline: RFC processing
├── contracts/         ← Contract: package interfaces
├── memory/            ← Record Library: institutional memory
├── bar/               ← Catalog: architecture registry (618 entities)
├── knowledge/         ← Knowledge Bundle: engineering graphs
├── content/           ← Record Library: content data
├── scripts/           ← Factory: build/deploy automation
├── bhavya-ai-lab/     ← Umbrella: AI Lab sub-project
└── _archive/          ← Archived: deduplicated/dead files
```

## Routing Model

| Layer | File                                   | Size              | Purpose                                  |
| ----- | -------------------------------------- | ----------------- | ---------------------------------------- |
| L0    | `AGENTS.md`                            | ~220 lines        | Engineering constitution + routing table |
| L1    | `CONTEXT.md`                           | ~74 lines         | Task-to-location map                     |
| L2    | `*/CONTEXT.md`                         | ~30-60 lines each | Subsystem-specific routing               |
| L3    | `standards/`, `contracts/`, `schemas/` | varies            | Stable reference rules                   |
| L4    | `apps/`, `packages/`, `memory/`        | varies            | Per-run products and state               |

## Agent Navigation Model

1. Agent opens root → reads `AGENTS.md` (engineering principles + routing table)
2. Agent reads `CONTEXT.md` → gets full map of where things live
3. Agent follows one link → lands in the right subsystem
4. Agent reads subsystem `CONTEXT.md` → knows exactly what to do
5. Agent executes work → writes to `output/` or appropriate location
6. Agent validates → checks against standards/schemas

**Token budget:** Entry (L0) + routing (L1) + one contract (L2) ≈ 2,000–8,000 tokens.

## Walk Test Results

### BEFORE (14 questions)

| Question                | Navigation Steps                                          | Status      |
| ----------------------- | --------------------------------------------------------- | ----------- |
| What is Bhavya OS?      | 3+ reads (AGENTS.md, README.md, ARCHITECTURE_OVERVIEW.md) | AMBIGUOUS   |
| What apps exist?        | 1 + N reads (no index)                                    | SLOW        |
| What packages exist?    | 1 + N reads (no index)                                    | SLOW        |
| What's active?          | 3+ reads across scattered locations                       | SCATTERED   |
| What release?           | 2+ reads, conflicting info                                | CONFLICTING |
| What missions complete? | 4+ reads                                                  | SCATTERED   |
| What's pending?         | 3 reads, unclear authority                                | UNCLEAR     |
| What standards?         | 2 reads                                                   | OK          |
| Which agents?           | 3 overlapping locations                                   | DUPLICATED  |
| Where's memory?         | 4+ reads                                                  | SCATTERED   |
| Where are decisions?    | 3 reads                                                   | SCATTERED   |
| Where are workflows?    | 3 reads                                                   | SCATTERED   |
| How to execute safely?  | 5+ reads                                                  | COMPLEX     |
| How to validate?        | 3+ reads                                                  | UNCLEAR     |

**Result: FAIL** — 14/14 questions require multiple reads across scattered, duplicated locations.

### AFTER (14 questions)

| Question                | Navigation Steps                                  | Status |
| ----------------------- | ------------------------------------------------- | ------ |
| What is Bhavya OS?      | 1 read (`CONTEXT.md` line 3)                      | PASS   |
| What apps exist?        | 2 reads (`CONTEXT.md` → `apps/CONTEXT.md`)        | PASS   |
| What packages exist?    | 2 reads (`CONTEXT.md` → `packages/CONTEXT.md`)    | PASS   |
| What's active?          | 2 reads (`CONTEXT.md` → `.ai/current-release.md`) | PASS   |
| What release?           | 2 reads (`CONTEXT.md` → `.ai/current-release.md`) | PASS   |
| What missions complete? | 2 reads (`CONTEXT.md` → `docs/wave-*`)            | PASS   |
| What's pending?         | 2 reads (`CONTEXT.md` → `.ai/current-task.md`)    | PASS   |
| What standards?         | 2 reads (`CONTEXT.md` → `standards/README.md`)    | PASS   |
| Which agents?           | 2 reads (`CONTEXT.md` → `.agents/registry.json`)  | PASS   |
| Where's memory?         | 2 reads (`CONTEXT.md` → `memory/engineering/`)    | PASS   |
| Where are decisions?    | 2 reads (`CONTEXT.md` → `docs/adr/`)              | PASS   |
| Where are workflows?    | 2 reads (`CONTEXT.md` → `.ai/WORKFLOWS.md`)       | PASS   |
| How to execute safely?  | 2 reads (`CONTEXT.md` → relevant standard)        | PASS   |
| How to validate?        | 2 reads (`CONTEXT.md` → relevant contract)        | PASS   |

**Result: PASS** — 14/14 questions answerable in 1-2 reads from root entry.

## Naming Conventions

- Entry file: `AGENTS.md` (Bhavya OS convention, compatible with ICM)
- Routing files: `CONTEXT.md` (ICM standard)
- Subsystem routing: `<subsystem>/CONTEXT.md`
- Archive: `_archive/` (ICM underscore prefix for meta)
- Templates: `.opencode/skills/icm-architect/assets/templates/`
- No numbering needed at root (Bhavya OS is a Context Map, not a Pipeline)

## Migration Decisions

| Decision                         | Rationale                                        |
| -------------------------------- | ------------------------------------------------ |
| ICM as skill, not framework      | Navigation layer, not governance replacement     |
| 5 CONTEXT.md files (not 50)      | Token discipline — only where materially helpful |
| No application code changes      | ICM is navigation, not refactoring               |
| Deduplicate schemas/registry     | One home per fact (ICM invariant #8)             |
| Archive dead files, don't delete | Reversible migration (safety principle)          |
| Keep AGENTS.md as L0             | Already exists, already works, just add routing  |

## Anti-patterns Avoided

1. **No competing governance** — ICM adds navigation, not rules
2. **No dozens of redundant markdown files** — only 5 new CONTEXT.md files
3. **No hand-edited indexes** — routing files are small and stable
4. **No content payload in routing** — CONTEXT.md files point, never hold
5. **No deletion of working functionality** — all changes additive or organizational
6. **No restructure of application code** — only navigation/routing layer
