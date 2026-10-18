# Ponytail — Upstream Pin Record

**Wrapper:** `bhavya-ponytail` (state: `ENABLED`)  
**Authority:** `AGENTS.md` + `docs/architecture/PLATFORM-TRUTH.md`  
**Verification date:** 2026-10-19  
**Verified by:** direct `git clone` + `git log`/`git tag`/`git remote -v` inspection and
`npm view @dietrichgebert/ponytail`, not inherited from a prior report.

---

## Pin

| Field                              | Value                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| Upstream repository                | `https://github.com/DietrichGebert/ponytail`                                      |
| Pinned commit                      | `09c434ab73ca43761c5d8b0c5d341926c2fba710`                                        |
| Commit exists                      | **CONFIRMED** — HEAD of `main`, `git log -1` resolved                             |
| Commit date                        | 2026-10-18T03:55:14+02:00                                                         |
| Commit subject                     | `fix(bench): wait for the killed todo server before the workdir cleanup (#1116)`  |
| Default branch                     | `main`                                                                            |
| Repository archived                | No                                                                                |
| Licence (GitHub-reported)          | `MIT`                                                                             |
| Licence (file content)             | `MIT License — Copyright (c) 2026 Dietrich Gebert`                                |
| npm package                        | `@dietrichgebert/ponytail` v5.3.2, MIT (`npm view` confirmed)                     |
| Tags / releases                    | None published (`git tag` empty)                                                  |
| Install location                   | `~/.config/opencode/skills/ponytail` (OpenCode user level, copy of pinned skill)  |
| Bhavya wrapper location            | `.opencode/skills/bhavya-ponytail/` (+ repo junction `skills/bhavya-ponytail/`)   |
| Upstream files committed to repo   | **0** — skill is a user-level install, never committed                            |
| Production dependency              | **No.** Authoring/review-time only. Never imported by application code.           |
| Upstream OpenCode plugin installed | **No.** Only `skills/ponytail/` is copied; `.opencode/plugins/` is not installed. |

---

## Why the pin matters

Installation must come from this exact commit, never from a moving branch.
`main` advances continuously; a moving branch would silently change what an
agent is permitted to execute. Any update is a deliberate, reviewed action via
`UPDATE-PROCEDURE.md`.

## Independent verification performed

| Check                               | Method                                              | Result               |
| ----------------------------------- | --------------------------------------------------- | -------------------- |
| Repository exists and is public     | `git clone` / `git remote -v`                       | CONFIRMED            |
| Pinned commit resolves              | `git log -1`                                        | CONFIRMED            |
| No versioned releases/tags          | `git tag`                                           | CONFIRMED none       |
| Licence is MIT                      | Read `LICENSE` at the pin                           | CONFIRMED            |
| npm package matches                 | `npm view @dietrichgebert/ponytail version license` | CONFIRMED v5.3.2 MIT |
| No runtime network in the skill     | grep of `skills/`, `hooks/`, `.opencode/`           | CONFIRMED none       |
| No telemetry                        | README + skill bodies                               | CONFIRMED none       |
| No upstream code shipped in the app | Planned `git ls-files` verification                 | 0 committed          |

## Findings that constrain Bhavya use

### F1 — Zero network, no telemetry (favorable)

Ponytail makes no network requests and sends no telemetry in the Bhavya install. No Google Fonts,
no analytics, no update ping from the skill itself. Auto-update is opt-in per host and never enabled.

### F2 — Agent-local state files outside the repo

The upstream plugin (not installed by Bhavya) would write `~/.config/opencode/.ponytail-active` and
`~/.config/ponytail/config.json`. The Bhavya skill-only install does not run the plugin; any mode state
written by an OpenCode V2 skill transform is agent-local preference state, not application data, and is
not committed. Removed by uninstall.

### F3 — "Smallest change" philosophy vs Bhavya validation boundaries

Ponytail's core rule is to write the least new code and never cut "validation at trust boundaries,
error handling that prevents data loss, security, accessibility." This is compatible with Bhavya,
but the wrapper must make the Bhavya exceptions explicit (Stage 5) so ponytail's minimalism cannot
simplify auth, RLS, B2 signed URLs, Turso access, OpenNext builds, CI/deployment deps, curriculum
standards, safeguarding, governance/policy content, WebGL fallbacks, reduced motion, audio captions/
transcripts, or asset licence/attribution records.

## Licence status

**VERIFIED — MIT.** Compatible with Bhavya's repository use.

## Re-verification

Re-run these after any upstream movement, and before any update:

```bash
git -C ...\Temp\opencode\ponytail-upstream log -1 --format="%H"
npm view @dietrichgebert/ponytail version license
pnpm wrapper:check            # pin + licence + wrapper state
git ls-files .opencode/skills # must not contain any upstream third-party skill dir
```
