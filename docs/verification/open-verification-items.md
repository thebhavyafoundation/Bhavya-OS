# Open verification items

**Recorded:** 2026-11-13
**Context:** PR #62 (`feat/visual-learning-batch`) reached an acknowledged
candidate at `6d40870e9ebde3f3a9e5f077b1b905c3ff397a26`, with the two
approved defects fixed and the remote acceptance matrix green.

**Why this file exists.** The items below are real, they are known, and
none of them belongs to PR #62. PR #62 is frozen at the acknowledged
candidate and must not grow to absorb them. Each one is written down here so
that a later, bounded piece of work can start from evidence rather than from
a re-investigation.

This is a record, not a plan of record. Nothing here has been started.

---

## 1. Assessment route: render-time randomness can break hydration

**Severity:** the same class as the defect fixed on the lesson route in
`b2dbb0d3`. It has not been observed firing, and it is not covered by an
acceptance check.

**Where:** `apps/ai-institute/src/components/assessment/index.tsx`

```tsx
const [startTime, setStartTime] = useState<number>(Date.now());
...
Math.max(0, 60 + Math.floor(Math.random() * 40)),
```

A value derived from `Math.random()` or `Date.now()` that is read during
render is evaluated once on the server and again in the browser, and the two
results do not have to agree. When they do not, the browser's first render
disagrees with the server's markup and React reports hydration error #418.
This is precisely the mechanism that produced the tap-match defect, which
was confirmed by fetching the lesson page twice and observing a different
order in the server's markup each time.

**What is known and what is not.** The assessment route is a student-facing
page. It has not been observed producing a hydration error, and no
acceptance check visits it. Whether the random value is reached during
render or only inside an event handler has not been traced to a
conclusion; the line above is inside a hook initialiser or a derived
expression and has to be read in place.

**Proposed bounded fix.** Move any render-time random or clock value behind
a mount effect, exactly as the tap-match shuffle was moved, so the first
render is deterministic. Keep the behaviour the value produces; only its
timing changes.

**Acceptance criteria for that fix.**

1. The assessment route produces no hydration error on repeated loads, proven
   by a remote acceptance check that visits it.
2. The route's server-rendered markup is identical across consecutive
   requests for the part that the random value reaches.
3. No `suppressHydrationWarning` and no error filtering.
4. A unit test that pins the determinism property, in the style of
   `tap-match-order.test.ts`.

**Bounded to:** the assessment route and the shared progress/quiz code it
uses. It must not touch the lesson route, which is already fixed.

---

## 2. The lesson page shows an "Asset pending download" placeholder

**Where:** `apps/ai-institute/src/app/curriculum/modules/[moduleId]/lessons/[lessonId]/page.tsx`,
through `VisualComponent`.

The module's `recommendedAssetUrl` resolves to an external address that is
not published, so the page renders a grey placeholder above the lesson
content. The behaviour is honest — it does not pretend to have the asset —
but a large empty panel at the top of a published lesson is a poor first
impression, and it is the first thing a reader sees.

**Options, in order of preference.**

1. Publish the asset, if it is Bhavya's to publish, and point
   `recommendedAssetUrl` at it.
2. If the asset is not available, remove the recommended-asset slot for
   modules that have no published asset, rather than reserving the space.
3. Keep the placeholder but make it a single line of text rather than a
   200 pixel panel.

**Bounded to:** the curriculum's module asset references. It is asset
work and belongs with the next visual batch, not with a stabilisation pass.

---

## 3. Excess whitespace inside the "Lesson anatomy" plate

**Where:** the homepage curriculum spotlight, the infographic card that
holds the lesson-anatomy pipeline diagram.

The diagram renders correctly and legibly, but the plate reserves more
height than the graphic needs, leaving a band of empty space below it.

**Bounded to:** the infographic card's layout. It is a composition detail and
belongs with the next visual batch.

---

## 4. The curriculum index prefetches a large grid of links

**Where:** `apps/ai-institute/src/app/curriculum/page.tsx` and
`AICurriculumTimeline`.

The index renders a grid of module rows and the browser prefetches each
one. The page therefore does not settle to network idle within thirty
seconds on the preview worker, which is why the overflow acceptance check
waits for the page's own content rather than for an idle network.

**Note.** This was measured, not assumed. It is recorded so that the next
batch does not re-derive it. Whether to reduce the prefetch volume, to
paginate the index, or to accept it is a design decision.

**Bounded to:** the curriculum index.

---

## 5. The application build depends on a third-party font fetch

**Where:** `apps/ai-institute/src/app/layout.tsx`, through `next/font/google`.

`next/font/google` downloads the font CSS from `fonts.googleapis.com`
while the application is being built. On a GitHub Actions runner that
request fails intermittently and the loader throws
`TypeError: Cannot read properties of null (reading '1')`. The build
currently survives it because `scripts/build-with-retry.sh` retries the
build a bounded number of times.

Self-hosting the fonts removes the dependency entirely and is the durable
answer. It changes how the brand's fonts are delivered, so it is a
separate piece of work on its own branch, and it is **not** part of any
stabilisation pass.

**Bounded to:** font delivery and the build.

---

## 6. Ruflo: the remote endpoint is up but not independently reachable

**State.** Installed remotely and previously verified from a remote sandbox:
discovery, dispatch, remote execution with a written artifact, status
observability, cancellation of a task, agent termination, and the
permission boundaries (unauthenticated and wrong-token requests refused; no
production credential in the sandbox environment; the bearer token absent
from the repository).

**Two open facts.**

1. The free local model (`qwen2.5:0.5b-instruct`) answers, but it answered
   a two-digit multiplication wrongly across two runs. The execution path
   works; the model's capability is not sufficient for engineering work, and
   a capable model would be a paid provider, which `PLATFORM-TRUTH.md`
   prohibits without explicit approval.
2. `task_cancel` marks a task cancelled but does **not** interrupt an
   `agent_execute` that is already in flight. That is the tool's behaviour,
   not a defect in the integration, and it is recorded rather than asserted
   as a capability.

**Blocked on access.** The Vercel CLI has lost the `bhavya-foundation` team
scope — sandbox endpoints answer 403 — and the `ruflo` MCP server is no
longer present in the OpenCode tool catalogue. The published sandbox URLs
now answer 410 because the session behind them has ended. The endpoint
cannot be republished until that team scope is restored.

**Bounded to:** branch `chore/ruflo-endpoint-recovery`, worktree
`D:\Bhavya-OS-wt\ruflo-recovery`. Its scripts and records are already
committed there.

---

## Not on this list

- **Subject-matter review of the published lessons.** This is a human gate,
  not a defect, and it is not satisfied by engineering work.
- **The two defects fixed on the lesson route** (`b2dbb0d3`): the
  tap-match render-time shuffle, and the progress read that wrote. Both are
  fixed, both have tests that fail without the fix, and both are verified
  against the deployed preview.
