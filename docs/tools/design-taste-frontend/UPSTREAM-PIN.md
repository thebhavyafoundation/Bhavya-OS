# Design Taste (taste-skill) — Upstream Pin Record

## Pin

| Field                | Value                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Upstream repository  | https://github.com/Leonxlnx/taste-skill                                                                                      |
| Pinned commit        | `3c7017d636c3a4aad378433ea6d0cfa6c921da4a` (2026-05-26, "feat(skill): round-5 hardening from test-13/14/15 + test-16/17/18") |
| Upstream path        | `skills/taste-skill/SKILL.md`                                                                                                |
| Upstream file size   | 87,253 bytes                                                                                                                 |
| Local canonical path | `.opencode/skills/design-taste-frontend/SKILL.md`                                                                            |
| Licence              | MIT — Copyright (c) 2026 Leonxlnx (verified 2026-11-12 from the upstream `LICENSE` at `main`)                                |
| Wrapper              | `.opencode/skills/bhavya-design-taste/SKILL.md` (`wrapper_state: ENABLED`)                                                   |
| Compatibility        | opencode                                                                                                                     |

## Why the pin matters

The upstream repository changes shape between major versions. At the pinned
commit the skill is a **single self-contained `SKILL.md`**. At `main` it is a
v2.5 tree: a 30,970-byte `SKILL.md` plus `references/` (23 files),
`scripts/` (12 files), `library/` and `assets/`. Those are different
artifacts with different licence surfaces and different runtime behaviour.

An unpinned "latest" install would therefore silently change what the skill
is, what it can execute, and what it pulls in. The pin is the reason the
Bhavya copy can be reviewed once and trusted afterwards.

## Independent verification performed — 2026-11-12

- Fetched `skills/taste-skill/SKILL.md` at the pinned commit from the GitHub
  contents API and compared it with the installed copy.
- After normalising line endings, the two files differ by **one line**: the
  installed copy omits a single blank line between the YAML frontmatter and
  the first heading. Nothing else differs — the diff is empty for the
  remaining 1,205 lines.
- The installed file carries CRLF line endings, which is what
  `core.autocrlf=true` produces on a Windows checkout. The upstream blob
  carries a mix. This is a checkout artefact, not an edit.
- The upstream licence file was read directly and is MIT, Copyright (c) 2026
  Leonxlnx.
- The upstream repository tree was listed recursively at `main`: the pinned
  version ships exactly one `SKILL.md` and no executable code. The pinned
  copy contains **no references** to `references/`, `scripts/`, `assets/` or
  `library/` paths (0 matches), so no supporting file is missing from this
  installation.

## Findings that constrain Bhavya use

### F1 — The upstream pre-flight check bans em dashes and en dashes

The pinned skill fails any output containing `—` or `–`. Bhavya's house
voice, the constitution-derived copy and the existing design tokens all use
em dashes and en dashes (`Ages 6–8`, "Nature restored. Knowledge opened.").
Adopting the upstream rule verbatim would rewrite Bhavya's voice and its
typography.

**Adaptation:** the em-dash rule is recorded and **not applied** to Bhavya
copy. It applies only to work that is not Bhavya-branded.

### F2 — The upstream motion dial requires motion to be shown

The pinned skill defines a `MOTION_INTENSITY` dial and requires that a page
declaring a value above 4 actually moves. Bhavya's rule is the opposite in
spirit: motion is added when it strengthens meaning, never to satisfy a
dial, and a bounded improvement task must not gain a motion quota.

**Adaptation:** the dial is not adopted. Bhavya's motion rules —
`_config/design-gate.md`, `design-integration-plan.md` §5, and the
reduced-motion requirement — govern.

### F3 — The upstream section-layout quota

The pinned skill requires a landing page with eight sections to use at least
four different layout families and bans repeating a layout family more than
once. That is a numeric quota aimed at marketing pages, and it conflicts with
an editorial rhythm that is part of Bhavya's existing, working identity.

**Adaptation:** the quota is not adopted. Repetition is judged by whether
the page reads as one composed piece, not by counting families.

### F4 — The upstream discourages hand-rolled SVG

The pinned skill strongly discourages hand-authored decorative SVGs. Bhavya's
diagram system is deliberately hand-authored SVG under
`content/diagrams/`, with a manifest, a text equivalent and a review state.

**Adaptation:** the upstream rule does not apply to Bhavya's own diagram
system, which is governed by `scripts/diagrams/check-manifests.mjs` and
`validate-diagrams.mjs` instead.

### F5 — No runtime dependency was added

The skill is instruction-only. It ships no executable code, adds no package,
and no animation or font library was added to the application bundle. This
matches the constraint that installing an engineering skill must not add a
runtime frontend dependency.

## Licence status

**Verified.** MIT, compatible with Bhavya use. The licence permits use,
modification and redistribution provided the copyright notice and permission
notice travel with the copy. The upstream copyright line is recorded in
`docs/tools/design-taste-frontend/LICENSE-REVIEW.md`.

## Re-verification

```bash
# Confirm the installed copy and the wrapper state
git hash-object .opencode/skills/design-taste-frontend/SKILL.md
head -8 .opencode/skills/bhavya-design-taste/SKILL.md

# Confirm the repository's wrapper gate still passes
node scripts/check-skill-wrappers.mjs
```
