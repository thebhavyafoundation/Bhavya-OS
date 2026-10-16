# Storytelling Architecture (UX-0)

## Four-Pillar Structure

1. **Narrative On-Ramp** — Story-first entry points that orient new learners to the platform's mission and their role within it. Each Tier route begins with a "hook" chapter that establishes context, stakes, and learning objectives through narrative rather than enumeration.

2. **Chapter Progress Model** — Long-form chapters broken into sequenced beats, each with a clear narrative arc (introduction → exploration → synthesis → application). Progress is tracked per chapter and aggregated across bands. Beats contain embedded WidgetSpec references that auto-render the appropriate component.

3. **Story-Beat Taxonomy** — Every chapter beat follows a validated pattern:
   - **Setup**: Context, character/intro, question or problem
   - **Explore**: Interactive investigation, discovery through WidgetSpec-governed components
   - **Synthesize**: Structured reflection, summary, key takeaway
   - **Apply**: Transfer task, mini-project, or quiz that validates transfer

4. **Tier-A Story Beats** — Tier A (Junior A, ages 6-8) routes use simplified beats with more guided exploration and fewer synthesis steps. Tier D (Advanced, ages 16-18) beats are more open-ended, requiring independent synthesis and application.

## Chapter Progress Model

- **Per-chapter tracking**: Each chapter maintains a progress state: `not_started`, `in_progress`, `complete`, `mastered`
- **Beat-level granularity**: Individual beats within a chapter track `pending`, `visited`, `completed`
- **Cross-band aggregation**: Progress across related chapters in different bands is aggregated; completing a Core band chapter unlocks associated Advanced band entry points
- **Story state persistence**: Progress is stored per learner and persists across sessions via the platform's session state layer

## Story Beats for Tier A Routes

Tier A (Junior A, ages 6-8) routes feature simplified story beats:

- **Hook Beats** (1 per route): Single introductory chapter that establishes the route's theme, introduces the "guide" character, and sets the learning goal
- **Explore Beats** (3-5 per route): Guided interactive beats that use WidgetSpec-registered components to demonstrate concepts. Beats are sequenced and cannot be skipped.
- **Synthesize Beats** (1 per route): Brief reflection beat that asks the learner to identify the "big idea" from the exploration
- **Apply Beats** (1 per route): Simple quiz or matching task that validates comprehension of the big idea

Each Tier A beat references a WidgetSpec from the lesson-registry, and the platform auto-renders the appropriate TSX component. Beats that require 3D, Lenis, or GSAP effects are flagged and handled via the motion system (see MOTION-SYSTEM.md).

## Narrative Touchpoints Across All Tiers

- **Opening narrator**: A consistent voice/character appears at the start of each Tier band, introducing the platform's mission
- **Chapter milestones**: Every 4th chapter in a band marks a "milestone" beat that synthesizes prior learning and unlocks the next band's entry point
- **End-of-band rituals**: Upon completing all chapters in a band, learners participate in a narrative "graduation" beat that celebrates progress and sets expectations for the next band

## WidgetSpec Integration

All story beats reference WidgetSpec unions from `apps/ai-institute/src/data/curriculum/lesson-registry.ts`. The platform resolves the appropriate TSX component at runtime based on the beat's `component` field. Example WidgetSpec:

```typescript
{
  name: "hero-3d",
  kind: "3d-scene",
  tier: "A",
  components: [Hero3DCanvas, CurriculumHero3D],
  params: { theme: "forest", showNav: true },
}
```

Beats without a `component` field render as plain text + reflection prompts.

## Reduced-Motion Policy

Beats that use GSAP/Lenis/3D effects must include a `reducedMotion: true` flag. When `reducedMotion` is enabled in the user's profile, the platform substitutes static images or simplified interactions per the MOTION-SYSTEM.md policy.
