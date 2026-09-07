---
type: rfc
status: draft
---

# RFC status vocabulary — canonical proposal (governance decision, not cleanup)

## Canonical vocabulary (all new RFCs)

`draft → published → approved → implemented`, recorded as YAML frontmatter:

```yaml
---
type: rfc
status: draft
---
```

Blank starter: `_templates/rfc-record.md`. Contract: `rfcs/CONTEXT.md`.
The `status:` frontmatter is the state surface — `FILE-MAP.md` scans it.

## Existing records (DO NOT normalize without approver sign-off)

| RFC                       | Current value | Shape                   | Proposed mapping                                                         |
| ------------------------- | ------------- | ----------------------- | ------------------------------------------------------------------------ |
| RFC-0001 Volunteer Portal | `published`   | `**Status:**` body line | `published` (no content change needed beyond frontmatter, when approved) |
| RFC-0002 Forest GIS       | `published`   | `**Status:**` body line | `published` (same)                                                       |
| RFC-0003 AI Gateway       | `Accepted`    | `## Status` heading     | needs a human ruling: `approved` or `published`?                         |

## Generator stance

`scripts/generate-file-map.mjs` reads all three shapes so status stays
derivable during the transition. Tolerance is intentional and stays until
every RFC carries frontmatter.

## Decision asked

1. Adopt the canonical vocabulary above for all future RFCs?
2. Grandfather RFC-0001…0003 as-is (recommended), or normalize with sign-off?
3. Ruling on RFC-0003 `Accepted` → `approved`?
