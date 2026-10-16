# Diagram Design — Upstream Pin Record

**Wrapper:** `bhavya-diagram-design` (state: `ENABLED`)
**Authority:** `AGENTS.md` + `docs/architecture/PLATFORM-TRUTH.md`
**Verification date:** 2026-10-16
**Verified by:** direct GitHub API inspection, not inherited from a prior report.

---

## Pin

| Field                            | Value                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| Upstream repository              | `https://github.com/cathrynlavery/diagram-design`                                        |
| Pinned commit                    | `b46c9701f035844a20b13ab0551315977188933b`                                               |
| Commit exists                    | **CONFIRMED** — resolved via `GET /repos/cathrynlavery/diagram-design/commits/b46c9701…` |
| Commit date                      | 2026-10-16T03:03:39Z                                                                     |
| Commit subject                   | `chore(release): bump plugin manifests to 2.6.107`                                       |
| Default branch                   | `main`                                                                                   |
| Repository archived              | No                                                                                       |
| Licence (GitHub-reported)        | `MIT`                                                                                    |
| Licence (file content)           | `MIT License — Copyright (c) 2025 Cathryn Lavery`                                        |
| Tree entries at pin              | 732                                                                                      |
| Install location                 | `~/.config/opencode/skills/diagram-design` (OpenCode user level)                         |
| Installed file count             | 287                                                                                      |
| Upstream files committed to repo | **0** — verified by `pnpm wrapper:check`                                                 |
| Production dependency            | **No.** Authoring-time only.                                                             |

## Why the pin matters

Installation must come from this exact commit, never from a moving branch.
`main` advances continuously; a moving branch would silently change what an
agent is permitted to execute. Any update is a deliberate, reviewed action via
`UPDATE-PROCEDURE.md`.

## Independent verification performed

| Check                               | Method                           | Result                                                         |
| ----------------------------------- | -------------------------------- | -------------------------------------------------------------- |
| Repository exists and is public     | GitHub API repo lookup           | CONFIRMED                                                      |
| Pinned commit resolves              | GitHub API commit lookup         | CONFIRMED                                                      |
| Licence is MIT                      | Read `LICENSE` at the pin        | CONFIRMED — MIT, Cathryn Lavery                                |
| Third-party licences declared       | Read `THIRD_PARTY_LICENSES.md`   | CONFIRMED — Tabler Icons (MIT), Simple Icons (CC0 1.0)         |
| Security policy exists              | Read `SECURITY.md`               | CONFIRMED — GitHub private advisory reporting                  |
| Privacy policy exists               | Read `PRIVACY.md`                | CONFIRMED — no server, no accounts, no analytics, no telemetry |
| No upstream code shipped in the app | `git ls-files` + `wrapper:check` | CONFIRMED — 0 committed upstream files                         |

## Findings that constrain Bhavya use

### F1 — Google Fonts dependency (material)

**224** files in the installed skill reference `fonts.googleapis.com` in
`<link href="https://fonts.googleapis.com/css2?family=…">`.

Consequences if exported unchanged:

- an external network request at render time, from a page the Foundation controls;
- the visitor's IP address reaches a third party, contradicting the upstream
  privacy claim that content "stays in your agent session";
- typography would not come from the canonical Bhavya tokens
  (`packages/platform-ui/src/styles/tokens.css`: Playfair Display + Inter).

**Mitigation is already in place.** `scripts/diagrams/validate-diagrams.mjs`
rejects any exported SVG containing:

```
fonts.googleapis.com | fonts.gstatic.com          → "SVG references Google Fonts"
(href|src|xlink:href)="http(s)://"                → "SVG contains external URL"
@import url(http…)                                 → "SVG contains external @import URL"
<script>                                           → "SVG contains <script>"
```

The Bhavya Diagram Design profile must therefore **strip** Google Fonts
references before export, not merely rely on the validator to catch them.
A caught violation is a failed build, not a shipped artefact.

### F2 — Playwright export is local, not a hosted service

`playwright` appears in the installed skill's `doctor.md` and in upstream export
scripts. Playwright runs a local browser for HTML → PNG/SVG export. It is not a
service dependency and makes no Bhavya data request. Per the machine contract,
Playwright-heavy rendering belongs in GitHub Actions, not on the i5/8 GB control
centre.

### F3 — Icons carry their own licences

Tabler Icons (MIT) and Simple Icons (CC0) are redistributed inside the skill.
Produced diagrams may include those icon shapes. Attribution is recorded in
`docs/diagrams/licences/THIRD_PARTY.md` and `diagram-design-LICENSE.md`.

## Licence status

**VERIFIED — MIT.** This is the only third-party skill permitted to reach
`ENABLED`. `apple-design` and `design-taste-frontend` remain
`DISABLED_LICENSE_UNVERIFIED` and are unrelated to this pin.

## Re-verification

Re-run these after any upstream movement, and before any update:

```bash
node scripts/check-skill-wrappers.mjs          # pin + licence + wrapper state
node scripts/diagrams/validate-diagrams.mjs    # exported SVG safety
git ls-files .opencode/skills/diagram-design   # must return nothing
```
