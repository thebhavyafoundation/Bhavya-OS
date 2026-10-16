---
name: bhavya-apple-design
description: DISABLED â€” licence unverified. Wrapper gate for the third-party "apple-design" skill. This wrapper currently REFUSES to load the upstream skill. Use only to report the licence block; it must not be used for motion or design work until the upstream licence is verified and this wrapper is changed to ENABLED.
wrapper_state: DISABLED_LICENSE_UNVERIFIED
upstream_skill: apple-design
upstream_repo: https://github.com/emilkowalski/skills
upstream_pin: none
upstream_license: UNVERIFIED
update_procedure: none
uninstall_procedure: docs/tools/apple-design/UNINSTALL-PROCEDURE.md
compatibility: opencode
---

# Bhavya Â· Apple Design Wrapper â€” â›” DISABLED_LICENSE_UNVERIFIED

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
Skill:    apple-design
Wrapper:  bhavya-apple-design
Upstream: https://github.com/emilkowalski/skills
Reason:   upstream licence has not been verified; contract Â§15 classifies an
          unverified licence as "prohibited without explicit written approval".
Action:   no Bhavya motion or interaction work may depend on this skill.
To enable: verify the upstream licence, record it in docs/tools/apple-design/,
          then change this wrapper's state to ENABLED.
```

Do **not**:
- call `skill({ name: "apple-design" })`
- paraphrase, quote or reconstruct the upstream skill's instructions from memory
- substitute a different third-party motion skill to fill the gap

## What to do instead

For motion and interaction work, use the existing, contract-compliant path:

- `bhavya-design-system` â€” canonical motion/two-mode rules
- `bhavya-ui-verification` â€” verification after visual work
- `packages/platform-ui/src/styles/tokens.css` â€” motion tokens

## Upstream record

| Field | Value |
|---|---|
| Skill id | `apple-design` |
| Repository | `https://github.com/emilkowalski/skills` |
| Pinned commit | **none** |
| Licence | **UNVERIFIED** â€” no licence field is declared in the skill frontmatter |
| Licence status | Not verified. Treated as prohibited under contract Â§15. |
| Local path | `.opencode/skills/apple-design/` (untracked; not committed) |
| Committed upstream files | **No.** Upstream directories must never be committed. |
| Modification policy | **Do not edit upstream files.** |
| Update procedure | Not established â€” blocked until licence verification |
| Uninstall procedure | See `docs/tools/apple-design/` (to be created on verification) |

## Enabling this wrapper requires

1. Verify the upstream licence by reading the repository's licence file.
2. Record it under `docs/tools/apple-design/LICENSE-REVIEW.md`.
3. Pin an exact upstream commit.
4. Establish update and uninstall procedures.
5. Change this wrapper's state to `ENABLED` and update `docs/tools/` records.
6. Re-run `pnpm wrapper:check`.

All of the above are human-gated. An agent must not self-certify a licence.