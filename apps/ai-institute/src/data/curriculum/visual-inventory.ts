/**
 * Concept-Visual Inventory
 *
 * Extends the established curriculum schema (`DiagramSpec` in ./types.ts) with the
 * provenance and review metadata a concept visual needs. It does NOT introduce a
 * second content registry: every entry points at a lesson that already exists in
 * `lesson-registry.ts`, and `lessonContent.visual` remains the single runtime
 * source for what is actually rendered.
 *
 * The runtime diagram specification lives in exactly one place:
 * `lessonContent.visual` in `@/data/lesson-content.ts`. This file records
 * provenance, medium and review status for that visual; it does not copy
 * the spec, so the two can never disagree.
 *
 * Field meanings:
 * - id              stable concept identifier (lesson id, or page/concept key)
 * - purpose         learning or narrative purpose the visual serves
 * - existingVisual  what is already rendered for this concept today
 * - missing         the explanation the concept currently lacks
 * - medium          chosen medium + why it is the right medium
 * - source          where the asset or spec comes from + licence/attribution
 * - location        where the asset lives (repo path or published public path)
 * - dimensions      intrinsic size and delivery variants
 * - altText         accessible text equivalent (also used as the SVG <title>)
 * - reviewStatus    who reviewed it and whether it is publishable
 * - loading         loading/performance policy
 */

export type VisualMedium =
  | "diagram"
  | "photography"
  | "annotated-screenshot"
  | "chart"
  | "timeline"
  | "flow"
  | "compare"
  | "simulation"
  | "3d"
  | "illustration";

export type VisualReviewStatus = "published" | "reviewed" | "draft" | "missing";

export interface ConceptVisualEntry {
  id: string;
  purpose: string;
  existingVisual: string;
  missing: string;
  medium: VisualMedium;
  mediumJustification: string;
  source: string;
  license: string;
  location: string;
  dimensions: string;
  altText: string;
  reviewStatus: VisualReviewStatus;
  loading: string;
}

export const CONCEPT_VISUAL_INVENTORY: ConceptVisualEntry[] = [
  {
    id: "defining-ai",
    purpose:
      "Establish that AI, machine learning and deep learning are nested, not parallel or interchangeable.",
    existingVisual:
      "Inline nested DiagramSpec rendered by DiagramRenderer (nested containment, no arrows).",
    missing:
      "Nothing structural. The containment relationship is now explicit and was corrected from a misleading network graph.",
    medium: "diagram",
    mediumJustification:
      "Containment is a set relationship; a nested box diagram shows subset/superset directly. A network graph implied peer relationships and was wrong.",
    source:
      "Original diagram authored in-repo as a DiagramSpec (no third-party asset, no licence obligation).",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/data/lesson-content.ts (lesson `defining-ai`, field `visual`).",
    dimensions:
      "Inline SVG, viewBox 800x220, scales to container width; text set in --font-sans at 13px.",
    altText:
      "Nested diagram: Deep Learning sits inside Machine Learning, which sits inside Artificial Intelligence.",
    reviewStatus: "published",
    loading:
      "Rendered inline with lesson content — no separate request, no lazy-loading decision needed.",
  },
  {
    id: "history-of-ai",
    purpose:
      "Explain why the field had periods of hype and withdrawal, so learners see progress as non-linear.",
    existingVisual:
      "Timeline DiagramSpec rendered by DiagramRenderer, with a text equivalent and a 'Read this diagram as text' disclosure.",
    missing:
      "Nothing structural. The visual now exists and carries a text equivalent.",
    medium: "timeline",
    mediumJustification:
      "A sequence over time with causes and effects is exactly what a timeline explains; prose lists dates but not the driver at each turn.",
    source:
      "Original DiagramSpec authored in-repo; the runtime source is lessonContent.visual.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/data/lesson-content.ts (lesson `history-of-ai`, field `visual`).",
    dimensions:
      "Inline SVG, viewBox 800x220, never scaled below 760px rendered width; scrolls horizontally on narrow screens.",
    altText:
      "Timeline of AI progress: early optimism, 1974 first funding collapse, expert-system era, 1980s second winter, 2012 deep-learning resurgence.",
    reviewStatus: "published",
    loading: "Inline with lesson content.",
  },
  {
    id: "types-of-ai-systems",
    purpose:
      "Distinguish reactive and limited-memory systems by the state each one keeps.",
    existingVisual:
      "Two-column comparison DiagramSpec rendered by DiagramRenderer, with a text equivalent and a 'Read this diagram as text' disclosure.",
    missing:
      "Nothing structural. The visual now exists and carries a text equivalent.",
    medium: "compare",
    mediumJustification:
      "Two labelled columns with their properties show the contrast directly; a diagram of the same would add noise without adding understanding.",
    source:
      "Original DiagramSpec authored in-repo; the runtime source is lessonContent.visual.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/data/lesson-content.ts (lesson `types-of-ai-systems`, field `visual`).",
    dimensions:
      "Inline SVG, viewBox 800x220, never scaled below 760px rendered width; scrolls horizontally on narrow screens.",
    altText:
      "Comparison: Reactive AI has no memory and answers from the current input; Limited Memory AI keeps recent context and uses it.",
    reviewStatus: "published",
    loading: "Inline with lesson content.",
  },
  {
    id: "the-ai-workflow",
    purpose:
      "Show the ordered stages a dataset moves through to become a prediction.",
    existingVisual:
      "Four-stage pipeline DiagramSpec rendered by DiagramRenderer, with a text equivalent and a 'Read this diagram as text' disclosure.",
    missing:
      "Nothing structural. The visual now exists and carries a text equivalent.",
    medium: "flow",
    mediumJustification:
      "The concept is order and transition between stages, which is what a left-to-right chain communicates.",
    source:
      "Original DiagramSpec authored in-repo; the runtime source is lessonContent.visual.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/data/lesson-content.ts (lesson `the-ai-workflow`, field `visual`).",
    dimensions:
      "Inline SVG, 896x220, never scaled below 760px rendered width; scrolls horizontally on narrow screens.",
    altText:
      "Pipeline: collect data, clean data, split into training and test sets, train a model, evaluate, then deploy.",
    reviewStatus: "published",
    loading: "Inline with lesson content.",
  },
  {
    id: "ethics-in-ai",
    purpose:
      "Make responsible-AI checkpoints concrete at the point where a learner builds something.",
    existingVisual:
      "Three-pillar flow DiagramSpec rendered by DiagramRenderer, with a text equivalent and a 'Read this diagram as text' disclosure.",
    missing:
      "Nothing structural. The visual now exists and carries a text equivalent.",
    medium: "flow",
    mediumJustification:
      "Ethics gates are sequential checkpoints in a build process, so a chain of decision points is the faithful form.",
    source:
      "Original DiagramSpec authored in-repo; the runtime source is lessonContent.visual.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/data/lesson-content.ts (lesson `ethics-in-ai`, field `visual`).",
    dimensions:
      "Inline SVG, 672x220, never scaled below 672px rendered width; scrolls horizontally on narrow screens.",
    altText:
      "Responsible AI lifecycle with checkpoints for fairness, transparency, privacy and human review at each build stage.",
    reviewStatus: "published",
    loading: "Inline with lesson content.",
  },
  {
    id: "python-basics",
    purpose: "Orient a beginner in how a program reads top to bottom.",
    existingVisual: "None. Lesson is prose, notebook cells and a lab.",
    missing:
      "A minimal execution-order visual. Beginners who see only prose often assume code runs in editing order.",
    medium: "illustration",
    mediumJustification:
      "A short annotated snippet with numbered call-outs teaches reading order better than an abstract diagram would.",
    source: "Original annotated code sample authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added at apps/ai-institute/src/data/lesson-content.ts (lesson `python-basics`, field `visual`).",
    dimensions:
      "Code block with call-out annotations; text-based fallback is the source itself.",
    altText:
      "Numbered code sample showing that statements execute in order from top to bottom, with the value of each variable at that point.",
    reviewStatus: "draft",
    loading: "Inline with lesson content.",
  },
  {
    id: "data-structures",
    purpose:
      "Contrast how lists, stacks, queues and dictionaries store and return values.",
    existingVisual: "None. Lesson is prose plus a lab.",
    missing:
      "A per-structure visual. The differences are about access order, which prose describes slowly.",
    medium: "diagram",
    mediumJustification:
      "Each structure is a different ordering rule; showing the order of the elements makes the rule visible.",
    source: "Original DiagramSpec to be authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added at apps/ai-institute/src/data/lesson-content.ts (lesson `data-structures`, field `visual`).",
    dimensions: "Inline SVG, viewBox 800x220.",
    altText:
      "Four structures side by side: a list keeps insertion order, a stack returns the newest item, a queue returns the oldest, a dictionary returns by key.",
    reviewStatus: "draft",
    loading: "Inline with lesson content.",
  },
  {
    id: "numpy-fundamentals",
    purpose: "Show that an array is a grid of numbers, not a list of lists.",
    existingVisual: "None. Lesson is prose, notebook cells and a lab.",
    missing:
      "A shape/dimension visual. Shape is the concept that trips beginners up.",
    medium: "illustration",
    mediumJustification:
      "A labelled grid with its shape (rows x columns) stated is the shortest correct explanation.",
    source: "Original annotated illustration authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added at apps/ai-institute/src/data/lesson-content.ts (lesson `numpy-fundamentals`, field `visual`).",
    dimensions: "Inline SVG grid with axis labels.",
    altText:
      "A 3 by 4 grid of numbers labelled shape (3, 4), showing rows, columns and a single indexed cell.",
    reviewStatus: "draft",
    loading: "Inline with lesson content.",
  },
  {
    id: "pandas-dataframes",
    purpose:
      "Show a table as rows and columns with a labelled header and index.",
    existingVisual: "None. Lesson is prose, notebook cells and a lab.",
    missing:
      "A table anatomy visual naming the index, the columns and the cells.",
    medium: "illustration",
    mediumJustification:
      "The concept is the anatomy of a table; annotating a real table with named parts is more direct than a diagram of one.",
    source: "Original annotated illustration authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added at apps/ai-institute/src/data/lesson-content.ts (lesson `pandas-dataframes`, field `visual`).",
    dimensions: "Inline SVG table with call-out labels.",
    altText:
      "A table with its index column, header row and body cells labelled, and a note that each row is one record.",
    reviewStatus: "draft",
    loading: "Inline with lesson content.",
  },
  {
    id: "data-visualization",
    purpose: "Teach that a chart choice encodes a claim, not just a rendering.",
    existingVisual: "None. Lesson is prose, notebook cells and a lab.",
    missing: "A chart-selection visual linking question type to chart type.",
    medium: "diagram",
    mediumJustification:
      "The lesson's point is a mapping between a question and a chart; a mapping is what the diagram kind expresses.",
    source:
      "Original DiagramSpec (network or compare kind) to be authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added at apps/ai-institute/src/data/lesson-content.ts (lesson `data-visualization`, field `visual`).",
    dimensions: "Inline SVG, viewBox 800x220.",
    altText:
      "Mapping: comparison question to bar chart, change over time to line chart, relationship to scatter plot, composition to stacked bar.",
    reviewStatus: "draft",
    loading: "Inline with lesson content.",
  },
  {
    id: "module:concept-map",
    purpose:
      "Show where a module sits in the curriculum: what comes before it, what it is for, which lessons are published, and which standards it is accountable to.",
    existingVisual:
      "None. The module page stated a title, a description and a lesson list.",
    missing:
      "The relationship between prerequisites, module, lessons and standards was left to be inferred.",
    medium: "diagram",
    mediumJustification:
      "A relationship between four named things is a structure, and the structure is what a reader needs. It is drawn in HTML rather than SVG because every part of it is already text: it reads at 320px, it needs no separate asset request, and a screen reader receives the same order the eye does.",
    source:
      "Original component authored in-repo (components/curriculum/ModuleConceptMap.tsx). Every value is read from the live curriculum registry at render time.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/components/curriculum/ModuleConceptMap.tsx, rendered by apps/ai-institute/src/app/curriculum/modules/[moduleId]/page.tsx.",
    dimensions:
      "Responsive HTML; four ordered stages, each a labelled group. No fixed pixel box.",
    altText:
      "Module concept map: the modules that come before this one, the module's own learning objective and topics, its published lessons in order, and the standards it is mapped to.",
    reviewStatus: "published",
    loading:
      "Rendered inline with the module page - no separate request, no lazy-loading decision needed.",
  },
  {
    id: "homepage:publication-status",
    purpose:
      "State honestly what is built, published and reviewed today, so the homepage's promise and the curriculum's actual state agree.",
    existingVisual:
      "None. The homepage described the institution but never said how much of the curriculum is readable.",
    missing:
      "Any quantitative statement of current state. A reader could not tell five published lessons from eighty-six catalogued modules.",
    medium: "chart",
    mediumJustification:
      "The honest statement is a ratio - how much of each age band is published - and a ratio is what a bar states directly. The counts are printed beside every bar, so the chart is never the only way to read it and colour is never the only carrier of meaning.",
    source:
      "Original component authored in-repo (components/home/WhereWeStand.tsx). Every count is derived at render time from the live curriculum registry.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/src/components/home/WhereWeStand.tsx, rendered by apps/ai-institute/src/app/page.tsx.",
    dimensions:
      "Responsive HTML; one horizontal bar per age band with a printed figure.",
    altText:
      "Per age band, how many modules are catalogued and how many are published: Junior A 10 catalogued 0 published, Junior B 8 catalogued 0 published, Core 56 catalogued 3 published, Advanced 12 catalogued 0 published. Five lessons are readable today, all in the Core band.",
    reviewStatus: "published",
    loading:
      "Below the hero, above the fold on a large screen. Server-rendered, so it arrives with the HTML - no client fetch, no layout shift.",
  },
  {
    id: "homepage:mission-constellation",
    purpose:
      "Connect the four missions (Forest, Knowledge, Heritage, Community) as one institution rather than four unrelated pages.",
    existingVisual:
      "Published photograph per mission plus a curriculum pathway diagram; no visual states the relationship between the missions.",
    missing:
      "The connection itself. Readers currently infer the relationship rather than being shown it.",
    medium: "diagram",
    mediumJustification:
      "A relationship between four named things is a structure; a relationship diagram states it once instead of implying it through layout.",
    source: "Original DiagramSpec (network kind) to be authored in-repo.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "To be added to the homepage section in apps/ai-institute/src/app/page.tsx using the existing DiagramRenderer.",
    dimensions: "Inline SVG, viewBox 800x220.",
    altText:
      "Four mission nodes (Forest, Knowledge, Heritage, Community) connected to a shared Bhavya Foundation node, showing they are one institution.",
    reviewStatus: "draft",
    loading:
      "Below the fold. Must not be lazy-loaded if it becomes the LCP element; otherwise lazy-load.",
  },
  {
    id: "homepage:learning-journey",
    purpose:
      "Show the learner's route from first lesson to a published piece of work.",
    existingVisual:
      "Published curriculum pathway diagram (apps/ai-institute/public/diagrams/curriculum/curriculum-learning-pathway.svg).",
    missing:
      "Nothing structural. The pathway diagram already carries this explanation.",
    medium: "diagram",
    mediumJustification:
      "An ordered pathway is a sequence, and the existing published diagram already does this correctly.",
    source:
      "Original SVG authored in-repo; published under the diagram manifest system.",
    license: "Project-owned (Bhavya Foundation).",
    location:
      "apps/ai-institute/public/diagrams/curriculum/curriculum-learning-pathway.svg — published at /diagrams/curriculum/curriculum-learning-pathway.svg",
    dimensions: "960x540 published SVG.",
    altText:
      "The curriculum pathway moves from Institute through Programme and Course to Module, Lesson and practice, ending in a project or published piece.",
    reviewStatus: "published",
    loading:
      "Lazy-loaded as a non-critical media asset; explicit dimensions set; decodes at 960x540.",
  },
];

/** Lessons whose concept has a published or drafted visual in this inventory. */
export function getVisualizedConceptIds(): string[] {
  return CONCEPT_VISUAL_INVENTORY.map((e) => e.id);
}

/** Lessons in the curriculum that have no visual recorded yet. */
export function getUncoveredConceptIds(allLessonIds: string[]): string[] {
  const covered = new Set(getVisualizedConceptIds());
  return allLessonIds.filter((id) => !covered.has(id));
}

export function getInventoryEntry(id: string): ConceptVisualEntry | undefined {
  return CONCEPT_VISUAL_INVENTORY.find((e) => e.id === id);
}
