# OpenCode Prompt — Cinematic Public Pages

Read first:

- `/AGENTS.md`
- `/docs/architecture/PLATFORM-TRUTH.md`
- `/docs/audit/`
- `/docs/experience/`
- current route map
- current design tokens
- current public route components

## Goal

Design and implement Bhavya Foundation Tier A public pages as cinematic editorial
experiences using existing architecture.

## Permanent constraints

- Do not replace Next.js, OpenNext or current routing.
- Do not introduce paid tools, paid APIs or Cloudflare R2.
- Do not run heavy rendering locally.
- Do not place 3D on every page.
- Do not break mobile, accessibility or reduced-motion behaviour.
- Use GitHub Actions for heavy asset processing where needed.
- Use Backblaze B2 for large production assets only after review-ready outputs exist.

## Public-page style

Bhavya public pages should feel like:

- a modern Himalayan knowledge institution;
- editorial and documentary rather than startup-generic;
- calm, intelligent and trustworthy;
- futuristic through structure and motion, not neon decoration.

Avoid:

- purple SaaS gradients;
- glowing blobs;
- decorative meaningless 3D;
- generic three-card sections;
- centred-everything layouts;
- motion on every paragraph.

## Route classification

Only Tier A public routes should receive:

- pinned scroll chapters;
- major visual stage transitions;
- 3D scenes;
- cinematic infographics;
- chapter progress indicators.

Tier B public routes should receive:

- lighter scroll reveals;
- diagrams;
- timelines;
- maps;
- limited 3D explainers.

## Deliverables

For each selected route:

1. Current-state audit.
2. Narrative arc.
3. Visual system.
4. Motion plan.
5. Mobile plan.
6. Reduced-motion plan.
7. Asset requirements.
8. Components to reuse.
9. Files to change.
10. Tests to run.

## Story structure

Each public page should follow:

1. Question.
2. Context.
3. Human meaning.
4. Visual explanation.
5. Foundation response.
6. Outcome.
7. Action.

## Technical rules

- Text stays semantic HTML.
- Visual stage may be pinned, but normal page scroll remains understandable.
- Use dynamic imports for heavy 3D or chart code.
- Pause expensive rendering when off-screen.
- Provide poster/static fallbacks.
- Use explicit width/height for media.
- Do not make content dependent on animation completion.

## Output format

Before coding, report:

- `CONFIRMED` current implementation
- `PROPOSED` route changes
- `ASSETS NEEDED`
- `PERFORMANCE IMPACT`
- `ACCESSIBILITY PLAN`
- `ROLLBACK PLAN`

Then implement in small reversible commits.

## Verify before claiming done

A cinematic page is not done because it looks right in a desktop browser. Before
reporting completion:

- Confirm zero horizontal overflow at 375, 390, 768, 1280 and 1440 px.
- Confirm the page is fully readable with animation disabled.
- Confirm content does not depend on an animation completing to be seen.
- Report measured transfer size, not an estimate.
- State which behaviours are untested. A page verified only visually is
  `PROPOSED`, not `CONFIRMED`.
