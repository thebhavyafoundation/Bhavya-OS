---
name: bhavya-content-truth
description: Ensure institutional claims are traceable and honest. Use when creating content, displaying data, or making claims about Bhavya Foundation impact.
compatibility: opencode
---

# Bhavya Content Truth Skill

## Purpose

Prevent fabrication of institutional impact data. Every claim about Bhavya Foundation must be traceable to a source or explicitly marked as unverified.

## Absolute Rules

### Never Invent

Do not fabricate any of the following:
- Tree counts or hectares planted
- Beneficiary numbers
- Student or volunteer counts
- Funding amounts
- Partner organizations
- Government relationships
- Certifications or awards
- Research results
- Project completion dates
- Geographic locations of operations
- Institutional achievements

### Honest Empty States

When real data is unavailable, use honest empty states:

```
"Data not yet published."
"Details coming soon."
"Information pending verification."
```

### Demo Data Labeling

If demo/placeholder data is used, it MUST be explicitly labeled:

```
[DEMO DATA] — This is sample data for demonstration purposes.
```

## Verification States

All institutional data should carry a verification state:

| State | Meaning |
|-------|---------|
| `verified` | Confirmed by authoritative source |
| `reported` | Stated by institution, not independently verified |
| `estimated` | Approximate or calculated value |
| `pending verification` | Submitted but not yet confirmed |
| `demo` | Sample data, not real |

## Content Sources

Before displaying institutional data:
1. Check `content/` directory for canonical content
2. Check `packages/shared/` for canonical types
3. Check `docs/` for documented facts
4. If no source exists, use empty state

## API Responses

API endpoints returning institutional data should:
1. Return real data from the database
2. Return empty arrays/objects when no data exists
3. Never return hardcoded fake statistics
4. Include verification state in responses when applicable

## UI Display

When displaying institutional metrics:
1. Show real data when available
2. Show "—" or "N/A" when data is unavailable
3. Never show placeholder numbers that look real
4. Always provide data source attribution where possible
