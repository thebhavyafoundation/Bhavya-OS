---
name: bhavya-diagram-design
description: Bhavya-governed wrapper around the third-party "diagram-design" authoring skill. Use for published curriculum pathways, governance explainers, architecture diagrams, policy processes, learning journeys, concept maps and editorial infographics. Enforces AGENTS.md and PLATFORM-TRUTH.md before the third-party skill may load, and enforces human factual review before export.
compatibility: opencode
wrapper_state: ENABLED
upstream_skill: diagram-design
upstream_repo: https://github.com/cathrynlavery/diagram-design
upstream_pin: b46c9701f035844a20b13ab0551315977188933b
upstream_license: MIT
update_procedure: docs/tools/diagram-design/UPDATE-PROCEDURE.md
uninstall_procedure: docs/tools/diagram-design/UNINSTALL-PROCEDURE.md
---

# Bhavya · Diagram Design Wrapper

**State: `ENABLED`**

A project-owned wrapper. The third-party `diagram-design` skill is an
**authoring** skill installed at OpenCode user level — it is **not** a web
runtime and is **not** a production dependency. This wrapper governs it.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Only then load the third-party skill with `skill({ name: "diagram-design" })`.

If either file cannot be read, **stop**. Do not load the third-party skill.

## Precedence

```
AGENTS.md + PLATFORM-TRUTH.md
  > Bhavya constitution
    > verified curriculum content
      > this wrapper's Bhavya constraints
        > third-party diagram-design guidance
```

## Upstream record

| Field | Value |
|---|---|
| Skill id | `diagram-design` |
| Repository | `cathrynlavery/diagram-design` |
| Pinned commit | `b46c9701f035844a20b13ab0551315977188933b` |
| Licence | MIT (declared in the skill frontmatter) |
| Install location | `~/.config/opencode/skills/diagram-design` (OpenCode user level) |
| Modification policy | **Do not edit upstream files.** The install is pinned and audited under `docs/tools/diagram-design/` (`UPSTREAM-AUDIT.md`, `LICENSE-REVIEW.md`, `SECURITY-REVIEW.md`, `INSTALLATION.md`, `UPDATE.md`, `UNINSTALL.md`). Change it through that documented update procedure, never by direct edit — a direct edit invalidates the integrity records. |
| Production dependency | **No.** Authoring-time only. Never imported by application code. |

## Authoring pipeline (contract §19)

```
Verified content
  → Diagram Design authoring
    → HTML/SVG source
      → Human factual review
        → Accessibility review
          → SVG safety validation
            → Static SVG export
              → Bhavya EditorialDiagram component
```

Steps 4–5 are **human gates**. An agent may not self-certify factual accuracy of
a diagram about the Foundation, its governance, or its evidence.

## Do not use for

- Runtime AI generation of diagrams.
- Automatically on every page.
- Frequently changing technical documentation where Mermaid is better.
- Unverified factual diagrams.
- Replacing numeric interactive-chart libraries.
- Interpreting legal documents without human review.

## Bhavya constraints

- Diagrams render through `@bhavya/platform-ui` `EditorialDiagram`, which must keep its `"use client"` directive (it uses `useState`).
- Every diagram needs a text alternative, a caption and, where it conveys meaning, a transcript link — WCAG 2.2 AA.
- Diagrams are static SVG in git (lightweight); large exports go to Backblaze B2 with a manifest and licence record. Never in Git LFS as binaries without a manifest.
- Governance and curriculum content requires authorised human review before publication.