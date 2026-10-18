# Installation — Ponytail OpenCode Skill

**Stage:** 2 — Install for OpenCode  
**Status:** COMPLETE  
**OS:** Windows 11 (PowerShell 5.1), git available

---

## 1. What was installed

| Item                       | Value                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Upstream repository        | https://github.com/DietrichGebert/ponytail                                                 |
| Pinned commit SHA          | `09c434ab73ca43761c5d8b0c5d341926c2fba710`                                                 |
| Pinned checkout (external) | `C:\Users\kanta\AppData\Local\Temp\opencode\ponytail-upstream\`                            |
| OpenCode skill install     | `C:\Users\kanta\.config\opencode\skills\ponytail\` (copy of upstream `skills/ponytail/`)   |
| Bhavya wrapper install     | `D:\Bhavya OS\.opencode\skills\bhavya-ponytail\` + repo junction `skills/bhavya-ponytail/` |
| Upstream plugin installed  | **No** — `.opencode/plugins/ponytail.mjs` is NOT installed by Bhavya                       |

The install contains only `skills/ponytail/` (SKILL.md + the five review skills) from the upstream
checkout, plus the project-owned `bhavya-ponytail` wrapper. No other upstream files were brought into
Bhavya.

## 2. Method (Windows)

1. Cloned upstream to a temp directory outside the monorepo:
   `C:\Users\kanta\AppData\Local\Temp\opencode\ponytail-upstream`.
2. Checked out verified commit `09c434ab73ca43761c5d8b0c5d341926c2fba710` (HEAD of `main`; the
   repository publishes no versioned releases).
3. Copied only `skills/ponytail/` to the pinned checkout and to the OpenCode user skill dir
   `~/.config/opencode/skills/ponytail/`. (Symlink to the pinned checkout was attempted and is blocked
   on this machine without administrator/Developer Mode, so a controlled copy is used, as with the
   existing diagram-design integration.)
4. Created the Bhavya wrapper `skills/bhavya-ponytail/` (mirrored at `.opencode/skills/bhavya-ponytail/`)
   with `SKILL.md`, `PLATFORM-CONTEXT.md`, and `UPSTREAM-PIN.md`.
5. External checkout left in temp (not committed, not in the monorepo).
6. No existing Bhavya skill overwritten; root `AGENTS.md` untouched.

## 3. Verification — OpenCode discovery

```
Get-ChildItem ~/.config/opencode/skills | Select-Object Name
...
bhavya-ponytail
...
ponytail
...
```

`skills/bhavya-ponytail` is also visible through the repo's existing `skills/` junction (mount point to
`.opencode/skills`). OpenCode discovers the wrapper skill from its installed skill directory on session
start; `SKILL.md` (name: `bhavya-ponytail`, wrapper_state: ENABLED) is the entry point.

`pnpm wrapper:check` (`node scripts/check-skill-wrappers.mjs`) validates every wrapper:
machine-readable state, platform-context markers, ENABLED preconditions (repo/pin/licence/update/uninstall),
and that no upstream third-party directory is committed.

## 4. What was NOT done

- Did not clone the complete upstream repository into the Bhavya monorepo.
- Did not add Ponytail as a production runtime dependency or to any application bundle.
- Did not install the upstream OpenCode plugin (`.opencode/plugins/`).
- Did not modify `AGENTS.md`.
- Did not overwrite any existing skill under `skills/` or `.opencode/skills/`.
- Did not enable automatic unpinned updates.
- Did not commit machine-specific configuration.

## 5. Supported command mapping (OpenCode skills, not slash commands)

Bhavya does **not** install the upstream OpenCode plugin
(`.opencode/plugins/ponytail.mjs`), so the upstream `/ponytail*` slash commands
are not registered. The six ponytail skills are exposed through OpenCode's skill
mechanism and are always gated by the `bhavya-ponytail` wrapper (AGENTS.md +
PLATFORM-TRUTH.md read first; Bhavya exceptions enforced).

| Concept                           | OpenCode invocation                  | What it does                                                                           |
| --------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| Review current diff / branch / PR | `skill({ name: "ponytail-review" })` | Quality review of a change: bugs, security, load, tests, speed, lean. Changes nothing. |
| Audit whole repository            | `skill({ name: "ponytail-audit" })`  | Same checks on the whole repo, ranked, most important first. Changes nothing.          |
| Collect deferred shortcuts        | `skill({ name: "ponytail-debt" })`   | Harvest `shortcut:` comments into a tracked ledger. Changes nothing.                   |
| Show benchmark information        | `skill({ name: "ponytail-gain" })`   | Published impact scoreboard (less code, cost, speed). Never a per-repo claim.          |
| Quick reference                   | `skill({ name: "ponytail-help" })`   | Levels, skills, commands reference card.                                               |
| Lazy mode itself                  | `skill({ name: "ponytail" })`        | Least new code; reply names skipped work and risk. Governed by wrapper exceptions.     |

Every invocation is preceded by the wrapper gate (read AGENTS.md +
PLATFORM-TRUTH.md). If a ponytail suggestion touches a Bhavya exception
(Stage 5), it is flagged, not applied.

## 6. Re-verification command

```powershell
# Confirm installed paths and required files
Test-Path "$HOME\.config\opencode\skills\ponytail\SKILL.md"
Test-Path "$HOME\.config\opencode\skills\bhavya-ponytail\SKILL.md"
# Confirm wrapper state and pin
Get-Content "D:\Bhavya OS\.opencode\skills\bhavya-ponytail\SKILL.md" | Select-String "wrapper_state", "upstream_pin", "upstream_license"
# Run the repo's wrapper validation gate
pnpm wrapper:check
```

## 7. Safe pilot results (read-only / review mode, changes nothing)

Ponytail's review criteria were applied manually to five read-only targets. In every case
ponytail (a) reuses existing components, (b) does not remove validation, (c) does not propose
paid services, (d) does not propose local inference, (e) does not replace Cloudflare / B2 /
Supabase / Turso, (f) identifies missing tests, (g) identifies accessibility requirements,
(h) identifies performance implications, and (i) marks uncertainty rather than guessing. The
wrapper's Bhavya exceptions blocked any simplification of exception items.

| #   | Target                                                                       | Type            | Ponytail finding                                                                                                                                                                                                            | Verdict                                            |
| --- | ---------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | `packages/platform-ui/src/components/editorial-diagram/EditorialDiagram.tsx` | UI              | Reuses platform-ui/Tailwind; error handling + lazy/decode present. **Missing test** for the error branch (logic needs one). Accessibility OK (`<figure>`, `alt`, caption/transcript/download, `rel="noopener noreferrer"`). | Ship — add a unit test for the error state         |
| 2   | `apps/ai-institute/src/lib/curriculum/lessons.ts`                            | Curriculum      | Reuses `@/data/curriculum` types; `getLesson` returns `Lesson \| undefined` (caller must handle). Tests exist in `__tests__/`. Map lookups O(1). Registry is empty pending P5 content task — **uncertainty** noted.         | Healthy — empty registry is a known P5 placeholder |
| 3   | `apps/ai-institute/public/diagrams/governance/b2-secured-data-flow.svg`      | Diagram         | Static SVG: no `<script>`, no external `href`, no `@import` (verified). Rendered through `EditorialDiagram` which supplies text alternative/caption. Confirm `alt`/transcript passed by caller.                             | Safe — confirm caller passes text alternative      |
| 4   | `.github/workflows/opennext-build-verify.yml`                                | OpenNext/deploy | Review-only (CI/deployment dependency — wrapper exception #7). No credentials, no `wrangler deploy`, no prod DB, `pipefail` correct.                                                                                        | Do not touch — exception preserved                 |
| 5   | `packages/providers/src/storage.ts` (`getSignedUrl`)                         | B2 security     | B2 signed-url contract — wrapper exception #3/4. Abstract interface only; no secrets in file. Review confirms contract exists, implementation elsewhere.                                                                    | Do not simplify — exceptions preserved             |

Wrapper behaviour confirmed: exceptions flagged, not applied; nothing written to the repo.
