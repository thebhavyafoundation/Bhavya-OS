# ICM Implementation Guide — Bhavya AI Lab

**Source:** "Interpretable Context Methodology: Folder Structure as Agent Architecture" by Jake Van Clief, David McDermott (Eduba, University of Edinburgh)
**Purpose:** Reference for implementing ICM in Bhavya AI Lab
**Date:** 2026-07-30

---

## Core Insight

**The filesystem IS the orchestration framework.** No code needed for sequential, human-reviewed workflows.

```
Instead of:
Prompt → LLM → Output

ICM:
Folder Structure → Agent reads right files → Right context → Right output
```

---

## Five Design Principles

### 1. One Stage, One Job
- Each folder = one step of the workflow
- Each stage reads defined input, transforms it, writes defined output
- Follows Unix philosophy and Parnas information-hiding

### 2. Plain Text as Interface
- Stages communicate through markdown and JSON files
- No binary formats, no databases, no proprietary serialization
- Any tool that reads text can participate
- Any human with a text editor can inspect/modify

### 3. Layered Context Loading
- Agents load ONLY what they need for current stage
- Less irrelevant context = better model performance
- Prevents "lost in the middle" degradation (Liu et al.)

### 4. Every Output is an Edit Surface
- Intermediate output = file human can open, read, edit, save
- Next stage reads whatever human left there
- Implements Horvitz mixed-initiative principles

### 5. Configure the Factory, Not the Product
- Workspace set up once with preferences, brand, style
- Each run produces new deliverable using same configuration
- Follows continuous delivery principle

---

## Five-Layer Context Hierarchy

| Layer | Name | Purpose | Token Cost | Changes Between Runs |
|-------|------|---------|------------|---------------------|
| 0 | CLAUDE.md | "Where am I?" — global identity | ~800 | No |
| 1 | CONTEXT.md | "Where do I go?" — task routing | ~300 | No |
| 2 | Stage CONTEXT.md | "What do I do?" — stage contract | 200-500 | No |
| 3 | Reference Material | "What rules apply?" — factory config | 500-2k | No |
| 4 | Working Artifacts | "What am I working with?" — per-run input | Varies | Yes |

**Key distinction:** Layer 3 = The Recipe (stable), Layer 4 = The Ingredients (changes each run)

**Total context per stage:** 2,000-8,000 tokens (optimal range)
**Monolithic alternative:** 30,000-50,000 tokens (degradation zone)

---

## Folder Structure

```
workspace/
├── CLAUDE.md                    # Layer 0: Identity
├── CONTEXT.md                   # Layer 1: Routing
├── stages/
│   ├── 01_research/
│   │   ├── CONTEXT.md           # Layer 2: Stage contract
│   │   ├── references/          # Layer 3: Stage-specific rules
│   │   └── output/              # Layer 4: Stage output (input to next)
│   ├── 02_script/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   └── 03_production/
│       ├── CONTEXT.md
│       ├── references/
│       └── output/
├── _config/                     # Layer 3: Global reference material
│   ├── voice.md
│   ├── design-system.md
│   └── conventions.md
└── shared/                      # Layer 3: Cross-stage resources
```

**Numbering encodes execution order.** Folder boundaries enforce separation of concerns.

---

## Stage Contract Format

Each stage's CONTEXT.md contains:

```markdown
## Inputs
- Layer 4 (working): ../01_research/output/
- Layer 3 (reference): ../../_config/voice.md
- Layer 3 (reference): references/structure.md

## Process
Write a script based on the research output.
Follow the structure in structure.md.
Match the tone described in voice.md.

## Outputs
- script_draft.md -> output/
```

**Inputs table** distinguishes Layer 3 (reference) from Layer 4 (working).

---

## Pipeline Flow

```
Stage 1 (Research)
    ↓ output/
    [REVIEW GATE — human edits here]
    ↓
Stage 2 (Script)
    ↓ output/
    [REVIEW GATE — human edits here]
    ↓
Stage 3 (Production)
    ↓ output/
    [FINAL REVIEW]
```

**Same model executes every stage.** Folder structure controls what context it receives.

---

## Implementation Rules for Bhavya AI Lab

### 1. Folder Naming
- Numbered prefixes: `01_`, `02_`, `03_`
- Lowercase, hyphenated: `01_research`, `02_script`
- Each folder has `CONTEXT.md` and `output/`

### 2. File Naming
- `CONTEXT.md` — Stage contract (always this name)
- `references/` — Layer 3 material
- `output/` — Layer 4 handoff point
- `_config/` — Global Layer 3 material

### 3. Context Scoping
- Stage CONTEXT.md Lists EXACTLY which files to load
- No "load everything" — scoping is explicit, editable, auditable
- Agent reads only what the stage needs

### 4. Human Review Gates
- Every stage boundary = review gate
- Human can edit output before next stage reads it
- Agent picks up whatever human left there

### 5. Portability
- Workspace = folder
- Can be copied, zipped, emailed, Git-committed
- No server, no deployment, no environment setup

---

## What ICM Replaces

| Framework Feature | ICM Equivalent |
|-------------------|----------------|
| Agent classes | Folder + CONTEXT.md |
| Orchestration code | Folder numbering |
| Context passing | File handoffs |
| State management | Files on disk |
| Message passing | Output folders |
| Configuration | _config/ folder |
| Logging | Read the output files |
| Dashboard | Open the folder |

---

## What ICM Does NOT Replace

- Real-time multi-agent collaboration
- High-concurrency systems
- Complex automated branching
- Dynamic message passing

**ICM is for:** Sequential, reviewable, repeatable workflows.

---

## U-Shaped Intervention Pattern

Observed across 33 practitioners:

| Stage | Edit Frequency | Type of Edit |
|-------|---------------|--------------|
| Stage 1 (Direction) | 92% | Creative judgment — narrowing possibilities |
| Stage 2 (Execution) | 30% | Light touch — constrained by reference material |
| Stage 3 (Final) | 78% | Alignment work — debugging misalignment |

**Insight:** Middle stages get lightest touch because they sit between well-defined anchors.

---

## Source Integrity Principle

**Two responses to bad output:**

1. Edit the output (patch the binary) — fixes this run
2. Edit the source (fix the compiler) — fixes every future run

**Recurring edits are debugging information.** They point to fixable source-level problems.

---

## Key Quotes

> "The folder structure tells it what to do at each step." — On agent orchestration

> "Any human who can open a text editor can inspect or modify any artifact." — On accessibility

> "The simplest viable architecture for this class of problem is one that already exists on every computer: the filesystem." — On conclusion

> "Configure the factory, not the product." — On workspace design

---

## Implementation Checklist

- [ ] Create workspace root with CLAUDE.md (Layer 0)
- [ ] Create CONTEXT.md routing (Layer 1)
- [ ] Create numbered stage folders with CONTEXT.md each (Layer 2)
- [ ] Create _config/ for global reference material (Layer 3)
- [ ] Create references/ in each stage for stage-specific rules (Layer 3)
- [ ] Create output/ in each stage for handoffs (Layer 4)
- [ ] Define Inputs table in each stage CONTEXT.md
- [ ] Set up review gates at every stage boundary
- [ ] Test: Can a memory-less agent navigate using local context alone?
- [ ] Test: Can the workspace be copied and still work?

---

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial implementation guide from ICM paper |
