# docs/ — Institutional Knowledge Base

This directory is the **institutional knowledge base** of Bhavya OS.

## Structure

```
docs/
├── governance/          # Governance documents
│   ├── active/          # Currently authoritative
│   ├── superseded/      # Replaced by newer documents
│   └── archived/        # Historical reference only
├── architecture/        # System architecture decisions
├── standards/           # Coding, design, documentation standards
├── releases/            # Release notes and changelogs
├── research/            # Research findings and reports
├── decisions/           # Architecture Decision Records (ADRs)
└── archive/             # Historical snapshots
```

## Rules

1. **Never permanently delete governance documents** — archive them
2. Every document must be classified: active, superseded, or archived
3. New capabilities are added through versioned releases
4. The runtime (`.ai/`, `.agents/`, etc.) is separate from knowledge (`docs/`)

## Navigation

- **Looking for runtime?** Start at `.ai/MASTER_CONTEXT.md`
- **Looking for governance?** Start at `docs/governance/active/`
- **Looking for decisions?** Start at `docs/decisions/`
