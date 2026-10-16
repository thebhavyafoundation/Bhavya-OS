# RFC Process Reference

**For Stage 01: Discovery — How to read and write RFCs.**

---

## RFC Structure (per `rfcs/RFC-NNNN-<slug>.md`)

```markdown
---
type: rfc
status: draft | published | approved | implemented
owner: [name]
date: YYYY-MM-DD
---

# RFC-NNNN: [Title]

## Summary

[What this RFC decides, in three sentences.]

## Motivation

[Why the institution needs this.]

## Proposal

[The change: routes, packages, schemas, or policy.]

## Alternatives considered

[What was rejected, and why.]

## Migration / rollout

[Steps, in order. What a human verifies at each step.]

## Open questions

[What the reviewer must answer before approval.]
```

---

## RFC Lifecycle

| Status        | Meaning           | Next Action                        |
| ------------- | ----------------- | ---------------------------------- |
| `draft`       | Author writing    | Author completes, requests review  |
| `published`   | Under review      | Reviewers comment, author responds |
| `approved`    | Consensus reached | Author implements                  |
| `implemented` | Done              | Close RFC                          |

---

## Reading RFCs for Discovery

When scanning `rfcs/` for relevant decisions:

1. **Filter by domain** — Match RFC topic to your discovery domain
2. **Check status** — Only `approved`/`implemented` are binding
3. **Extract decisions** — Proposal section = what was decided
4. **Note constraints** — Alternatives considered = what was rejected
5. **Map to ownership** — Proposal → packages/routes affected

---

## Writing RFCs (if needed)

If discovery reveals need for architectural decision:

1. Copy `_templates/rfc-record.md` to `rfcs/RFC-NNNN-<slug>.md`
2. Fill all sections
3. Set status: `draft`
4. Link from discovery report
5. Request review via PR

---

## RFC Numbering

- Sequential: `RFC-0001`, `RFC-0002`, ...
- Format: `RFC-NNNN-<kebab-case-slug>.md`
- Example: `RFC-0014-icm-adoption.md`

---

## Related Files

- `_templates/rfc-record.md` — Template
- `rfcs/CONTEXT.md` — RFC index and routing
