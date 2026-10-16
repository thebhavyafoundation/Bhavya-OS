# Upstream Audit — Diagram Design

**Stage:** 1 — Upstream due diligence  
**Status:** COMPLETE — licence verified compatible; integration unblocked

---

## 1. Identity

| Field                  | Value                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Repository URL         | https://github.com/cathrynlavery/diagram-design                                                |
| Selected commit SHA    | `b46c9701f035844a20b13ab0551315977188933b`                                                     |
| Selected release / tag | None — repository does not publish versioned releases (security fixes on `main` only)          |
| Checkout location      | `C:\Users\kanta\AppData\Local\Temp\opencode\diagram-design-upstream` (external, not committed) |
| Audited at             | 2026-10-16                                                                                     |

## 2. What it is

Diagram Design is an **agent authoring skill**, not an application library or runtime. It produces one self-contained `.html` file per diagram (embedded CSS, inline SVG, static by default, optional accessible motion). Outputs are exported to SVG/PNG manually. There is no build step, no JavaScript in static output, and no model inference during user requests — layout is authored by the agent from the skill's references.

Bhavya integrates it only as an **installed OpenCode skill** (`skills/diagram-design/` → `.opencode/skills/diagram-design`), never as a production dependency and never cloned into the monorepo.

## 3. Licence (recorded also in LICENSE-REVIEW.md)

| Item                                | Detail                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------- |
| Skill licence                       | MIT — Copyright (c) 2025 Cathryn Lavery                                 |
| Compatibility verdict               | **Compatible** (permissive; copyleft-free)                              |
| Generated output licence conditions | None additional — MIT applies to the skill, not to diagrams it produces |

## 4. Third-party licences (recorded also in LICENSE-REVIEW.md)

| Source                         | Licence             | Use in upstream                                 |
| ------------------------------ | ------------------- | ----------------------------------------------- |
| Tabler Icons                   | MIT                 | Stroked IT/cloud icons                          |
| Simple Icons                   | CC0 1.0             | Filled brand silhouettes                        |
| log-z/logos                    | MIT                 | Brand silhouettes (MySQL, Redis, StarRocks)     |
| Devicon                        | MIT                 | RStudio, SPSS icons                             |
| Instrument Serif               | SIL OFL 1.1         | Plugin logo outline only (no font file bundled) |
| Wikimedia Commons (SAS logo)   | Public domain       | One-off icon                                    |
| IcePanel techicons.dev (Stata) | techicons.dev terms | One-off icon                                    |

No GPL, AGPL, or proprietary components. Brand marks remain trademarks of their owners (documentation/illustrative use only).

## 5. Runtime requirements

| Requirement | Detail                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| Agent host  | Any Agent Skills-compatible host (OpenCode: copy/symlink `skills/diagram-design/`) |
| Scripts     | Python 3 (no third-party deps for `self_check.py`, `export_svg.py`)                |
| PNG export  | Playwright + Chromium (manual, user-provisioned; never auto-installed)             |
| Viewing     | Any modern browser (HTML/SVG)                                                      |
| Build step  | None                                                                               |
| Node/npm    | Not required by the skill itself                                                   |

## 6. Installation paths

| Location                     | Purpose                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Upstream checkout (external) | `...\Temp\opencode\diagram-design-upstream` — reference only, never committed |
| OpenCode skill dir (global)  | `~/.config/opencode/skills/diagram-design` (Windows)                          |
| Repo junction                | `skills/diagram-design` → `.opencode/skills` (junction already present)       |
| Local marker (optional)      | `.diagram-design` project file; canonical profile source stays in Git         |

## 7. Network behaviour

| Destination                                  | Trigger                                                                        | Avoidable?                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `fonts.googleapis.com` / `fonts.gstatic.com` | Diagram HTML `<link>` / SVG `@import` when skin font source is `web`           | Yes — set font source to `system` (Bhavya default)          |
| A website URL the user names                 | Brand onboarding fetch (§ URL in onboarding.md)                                | Yes — user-triggered only, with explicit trust confirmation |
| LittleMight / upstream server                | None — no telemetry, analytics, accounts, or update ping from the skill itself | N/A                                                         |

## 8. Telemetry behaviour

**None.** The skill has no server, sends no data, and LittleMight receives nothing. Data stays in the agent session/provider workspace under that provider's own privacy policy (see PRIVACY-REVIEW.md).

## 9. Security concerns (recorded also in SECURITY-REVIEW.md)

- Upstream publishes no versioned releases; fixes land on `main`. Bhavya pins commit `b46c970...` and re-pins manually — no unpinned auto-update.
- Generated HTML is self-contained and static by default; the only network reference is the Google Fonts stylesheet (dropped in `system` mode).
- `self_check.py` rejects remote assets beyond the approved Google Fonts stylesheet, executable attributes, and non-canonical scripts.
- `export_svg.py` XML-escapes carried CSS and normalizes `rgba()` presentation attributes.
- Import extractors treat draw.io/Mermaid/Excalidraw content as untrusted data (DTD/entity rejection, size caps, duplicate-ID rejection).
- No credentials, secret names, or internal URLs may appear in Bhavya diagram content (enforced by Stage 11 validation).

## 10. Update procedure (recorded also in UPDATE-PROCEDURE.md)

1. Review upstream `main` diff since `b46c970...` (CHANGELOG.md, SKILL.md, references/).
2. Re-read LICENSE/THIRD_PARTY_LICENSES.md for changes.
3. Re-run privacy/security review only if network or script surface changes.
4. Check out the new commit into the external checkout.
5. Replace the OpenCode skill copy (`~/.config/opencode/skills/diagram-design`) with the new `skills/diagram-design/`.
6. Record the new SHA in docs/tools/diagram-design/ and the Bhavya profile.
7. Never enable automatic unpinned updates.

## 11. Removal procedure (recorded also in UNINSTALL-PROCEDURE.md)

1. Delete `~/.config/opencode/skills/diagram-design` (and the `skills/diagram-design` junction target if it was a copy).
2. Remove `docs/tools/diagram-design/` and `docs/diagrams/` only when no diagram references remain.
3. Generated SVG/PNG assets under `apps/ai-institute/public/diagrams/` may be left or deleted per the owning route; they are inert static files.
4. No uninstall script is required — the skill is a file copy.

## 12. Outputs and licensing of generated diagrams

Diagrams produced by the skill carry **no additional licensing conditions** beyond MIT applying to the skill itself. Bhavya-owned diagram content (manifests, HTML sources, exported SVG/PNG) is Bhavya Foundation material and follows the repository's normal IP treatment.

## 13. Blocked?

No. MIT licence is compatible, privacy/security surface is bounded and avoidable, and no runtime dependency is introduced. Integration proceeds to Stage 2.

---

## Independent re-verification � 2026-10-16

This audit was re-verified against the live upstream repository rather than
inherited. Full record in [UPSTREAM-PIN.md](./UPSTREAM-PIN.md).

| Claim                            | Verified by                                                 | Result                                      |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| Repository and licence           | GitHub API + read of `LICENSE` at pin                       | MIT, Copyright (c) 2025 Cathryn Lavery      |
| Pinned commit resolves           | commit lookup at `b46c9701f035844a20b13ab0551315977188933b` | CONFIRMED, dated 2026-10-16                 |
| Third-party licences             | read of `THIRD_PARTY_LICENSES.md`                           | Tabler Icons (MIT), Simple Icons (CC0 1.0)  |
| Security policy                  | read of `SECURITY.md`                                       | GitHub private advisory reporting           |
| Privacy policy                   | read of `PRIVACY.md`                                        | No server, accounts, analytics or telemetry |
| Upstream code shipped in the app | `git ls-files`                                              | 0 files committed                           |

### Material finding: Google Fonts dependency

**224** files in the installed skill reference `fonts.googleapis.com`. Left
unescaped, an exported diagram would make an external font request at render
time, disclose a visitor IP to a third party, and render in typography that is
not the canonical Bhavya system.

Two controls already cover this and are verified in the repository:

1. `scripts/diagrams/validate-diagrams.mjs` fails any exported SVG containing
   Google Fonts references, external `http(s)` hrefs, `@import` URLs, or
   `<script>`.
2. `scripts/diagrams/check-manifests.mjs` enforces manifest metadata including
   licence and approval status.

Required operating rule: the Bhavya Diagram Design profile must **strip** Google
Fonts before export. The validator is a backstop, not a substitute.
