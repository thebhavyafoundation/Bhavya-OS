---
name: bhavya-design-taste
description: DISABLED â€” licence unverified. Wrapper gate for the third-party "design-taste-frontend" skill. This wrapper currently REFUSES to load the upstream skill. Use only to report the licence block; it must not be used for design or landing-page work until the upstream licence is verified and this wrapper is changed to ENABLED.
wrapper_state: DISABLED_LICENSE_UNVERIFIED
upstream_skill: design-taste-frontend
upstream_repo: https://github.com/Leonxlnx/taste-skill
upstream_pin: none
upstream_license: UNVERIFIED
update_procedure: none
uninstall_procedure: docs/tools/design-taste-frontend/UNINSTALL-PROCEDURE.md
compatibility: opencode
---

# Bhavya Â· Design Taste Wrapper â€” â›” DISABLED_LICENSE_UNVERIFIED

**State: `DISABLED_LICENSE_UNVERIFIED`**

This wrapper is a gate, not a gateway. It stops before reaching the third-party
skill. Loading the upstream skill through this wrapper is **prohibited**.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate â€” mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. **Stop here. Report the block. Do not load the upstream skill.**

## Required response when invoked

Report exactly this, then stop:

```
BLOCKED: SKILL_DISABLED_LICENSE_UNVERIFIED
Skill:    design-taste-frontend
Wrapper:  bhavya-design-taste
Upstream: https://github.com/Leonxlnx/taste-skill
Reason:   upstream licence has not been verified; contract Â§15 classifies an
          unverified licence as "prohibited without explicit written approval".
Action:   no Bhavya design or landing-page work may depend on this skill.
To enable: verify the upstream licence, record it in docs/tools/design-taste/,
          then change this wrapper's state to ENABLED.
```

Do **not**:
- call `skill({ name: "design-taste-frontend" })`
- paraphrase, quote or reconstruct the upstream skill's instructions from memory
- substitute a different third-party design skill to fill the gap

## What to do instead

- `bhavya-design-system` â€” canonical Bhavya design rules and quality floor
- `bhavya-impeccable` â€” the *enabled*, Apache-2.0 verified wrapper, for frontend
  design and audit work
- `bhavya-ui-verification` â€” verification after visual work
- `packages/platform-ui/src/styles/tokens.css` â€” canonical tokens

## Upstream record

| Field | Value |
|---|---|
| Skill id | `design-taste-frontend` |
| Repository | `https://github.com/Leonxlnx/taste-skill` |
| Pinned commit | **none** |
| Licence | **UNVERIFIED** â€” no licence field is declared in the skill frontmatter |
| Licence status | Not verified. Treated as prohibited under contract Â§15. |
| Local path | `.opencode/skills/design-taste-frontend/` (untracked; not committed) |
| Committed upstream files | **No.** Upstream directories must never be committed. |
| Modification policy | **Do not edit upstream files.** |
| Update procedure | Not established â€” blocked until licence verification |
| Uninstall procedure | See `docs/tools/design-taste/` (to be created on verification) |

## Enabling this wrapper requires

1. Verify the upstream licence by reading the repository's licence file.
2. Record it under `docs/tools/design-taste/LICENSE-REVIEW.md`.
3. Pin an exact upstream commit.
4. Establish update and uninstall procedures.
5. Change this wrapper's state to `ENABLED` and update `docs/tools/` records.
6. Re-run `pnpm wrapper:check`.

All of the above are human-gated. An agent must not self-certify a licence.