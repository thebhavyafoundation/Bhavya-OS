# Upstream Audit — Ponytail

**Stage:** 1 — Upstream due diligence  
**Status:** COMPLETE — licence verified compatible; integration unblocked  
**Audited at:** 2026-10-19

---

## 1. Identity

| Field                  | Value                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Repository URL         | https://github.com/DietrichGebert/ponytail                                               |
| Selected commit SHA    | `09c434ab73ca43761c5d8b0c5d341926c2fba710`                                               |
| Selected release / tag | None — repository publishes no versioned releases or tags (`git tag` empty)              |
| Checkout location      | `C:\Users\kanta\AppData\Local\Temp\opencode\ponytail-upstream` (external, not committed) |
| Verified by            | direct `git clone` + `git log`, `git tag`, `git remote -v`                               |
| Official npm package   | `@dietrichgebert/ponytail` v5.3.2, MIT (matches the pinned commit)                       |

---

## 2. What it is

Ponytail is an **agent behavior skill**, not an application library or runtime. It is a system prompt
("lazy senior dev mode": the smallest change that fully solves the task) plus six read-only/review skills:

- `ponytail` — lazy mode itself (least new code, reply names skipped work and risk)
- `ponytail-review` — quality review of a diff/branch/PR (bugs, security, load, tests, speed, lean)
- `ponytail-audit` — the same review for the whole repo, ranked
- `ponytail-debt` — harvest `shortcut:` comments into a tracked ledger
- `ponytail-gain` — measured-impact scoreboard from the published benchmark
- `ponytail-help` — quick reference for levels, skills, commands

Bhavya integrates it only as an **installed OpenCode skill** governed by the `bhavya-ponytail` wrapper,
never as a production runtime dependency and never cloned into the monorepo. The upstream OpenCode plugin
(`.opencode/plugins/ponytail.mjs`) is **not** installed by Bhavya; only the `skills/ponytail/` skill content
is copied, governed by the wrapper.

---

## 3. Licence (recorded also in LICENSE-REVIEW.md)

| Item                      | Detail                                                                           |
| ------------------------- | -------------------------------------------------------------------------------- |
| Skill licence             | MIT — Copyright (c) 2026 Dietrich Gebert                                         |
| Compatibility verdict     | **Compatible** (permissive; copyleft-free)                                       |
| npm package licence       | MIT (confirmed via `npm view @dichrichgebert/ponytail license`)                  |
| Output licence conditions | None additional — MIT applies to the skill, not to any review output it produces |

No GPL, AGPL, or proprietary components. No payment-gated components.

---

## 4. Third-party files and licences

| Source       | Licence | Use in upstream                                                                                                                                                                                                                 |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| None bundled | n/a     | Ponytail ships no icon/font/asset bundles; the skill is a prompt. The README references external images (logos, charts, trendshift/star-history badges) as documentation assets only — none are loaded by the skill at runtime. |

No third-party runtime dependencies. Brand marks (GitHub, npm badges) remain trademarks of their owners (documentation/illustrative use only).

---

## 5. Runtime requirements

| Requirement | Detail                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Agent host  | Any OpenCode-compatible host (copy/symlink `skills/ponytail/` into the OpenCode skills dir)                                  |
| Scripts     | None required by the skill itself (pure prompt); the upstream plugin's hooks are Node.js and are **not** installed by Bhavya |
| Build step  | None                                                                                                                         |
| Node/npm    | Not required by the skill itself                                                                                             |

---

## 6. Installation paths

| Location                         | Purpose                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Upstream checkout (external)     | `...\Temp\opencode\ponytail-upstream` — reference only, never committed                      |
| OpenCode skill dir (global/user) | `~/.config/opencode/skills/ponytail` (Windows) — copy of pinned `skills/ponytail/`           |
| Repo junction                    | `skills/ponytail` → `.opencode/skills` (junction pattern used by other Bhavya skills)        |
| Bhavya wrapper                   | `skills/bhavya-ponytail/` → `.opencode/skills/bhavya-ponytail/` (governs the upstream skill) |
| Audit records                    | `docs/tools/ponytail/`                                                                       |

---

## 7. Network behaviour

| Destination                                | Trigger                                                                                               | Avoidable?                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------- |
| None                                       | The `skills/ponytail/` skill is a pure system prompt; it makes no network requests                    | N/A                              |
| `github.com` (link only)                   | `ponytail-help` SKILL.md line 76 documents the docs URL; never fetched by the skill                   | Yes — never fetched              |
| SVG namespace `http://www.w3.org/2000/svg` | Upstream `hooks/band/` XML namespace strings (Claude Code band feature only; not installed by Bhavya) | N/A — not part of Bhavya install |

**Finding:** Ponytail makes **zero network requests** in the Bhavya install. The upstream OpenCode plugin
(`.opencode/plugins/ponytail.mjs`) is local-only: it reads local skill/command files and writes local mode
state files (`~/.config/opencode/.ponytail-active`, `~/.config/ponytail/config.json`). The band/telemetry
features are Claude Code-only and are **not** part of the OpenCode skill install.

---

## 8. Telemetry behaviour

**None.** The skill sends no data, has no server, no analytics, no update ping. The upstream plugin's
auto-update is opt-in per host (`/plugin marketplace update ponytail`) and Bhavya **never enables it**.
Mode state is persisted locally only (`~/.config/opencode/.ponytail-active`).

---

## 9. Security concerns (recorded also in SECURITY-REVIEW.md)

- Upstream publishes no versioned releases; fixes land on `main`. Bhavya pins commit `09c434ab...` and
  re-pins manually — no unpinned auto-update.
- The skill is a read-only prompt; it changes no code unless the agent is directed to, and Bhavya's
  wrapper explicitly forbids simplifying security/auth/a11y/curriculum logic (Stage 5 exceptions).
- `ponytail-review` / `ponytail-audit` / `ponytail-debt` are one-shot reports that change nothing.
- `ponytail-gain` displays published benchmark averages only; it never prints a per-repo savings number
  (honesty boundary documented in the skill).
- No credentials, secret names, or internal URLs are handled by the skill.
- The upstream plugin writes mode state outside the repo (`~/.config/opencode/.ponytail-active`);
  this is agent-local preference state, not application data, and is not committed.

---

## 10. Update procedure (recorded also in UPDATE-PROCEDURE.md)

1. Review upstream `main` diff since `09c434ab...` (SKILL.md, commands/, hooks/, README.md, benchmarks/).
2. Re-read `LICENSE`; stop if it changed to an incompatible licence → human gate.
3. Re-run privacy/security review only if network or script surface changes.
4. Fetch the new commit into the external checkout, do **not** commit it into Bhavya.
5. Replace the pinned user-level skill copy with the new `skills/ponytail/`.
6. Record the new SHA in `docs/tools/ponytail/` and the wrapper frontmatter.
7. Never enable automatic unpinned updates.

---

## 11. Removal procedure (recorded also in UNINSTALL-PROCEDURE.md)

1. Delete `~/.config/opencode/skills/ponytail` (the OpenCode skill install) and
   `.opencode/skills/bhavya-ponytail` (the Bhavya wrapper).
2. Optionally remove the pinned external checkout.
3. OpenCode will no longer discover the `ponytail` or `bhavya-ponytail` skills on session start.
4. Retain `docs/tools/ponytail/` for provenance. No uninstall script is required — the skill is a file copy.

---

## 12. Blocked?

No. MIT licence is compatible, the skill makes no network requests, sends no telemetry, introduces no
runtime dependency, and changes no code by itself. Integration proceeds to Stage 2 behind the `bhavya-ponytail`
wrapper, which enforces the Bhavya exceptions (Stage 5).

---

## Independent re-verification — 2026-10-19

| Claim                      | Method                                    | Result                                                                 |
| -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| Repository and licence     | `git clone` + read `LICENSE` at pin       | MIT, Copyright (c) 2026 Dietrich Gebert                                |
| Pinned commit resolves     | `git log -1`                              | CONFIRMED `09c434ab73ca43761c5d8b0c5d341926c2fba710`, dated 2026-10-18 |
| Official npm package       | `npm view @dietrichgebert/ponytail`       | CONFIRMED v5.3.2, MIT                                                  |
| No tags/releases           | `git tag`                                 | CONFIRMED none                                                         |
| No upstream code committed | `git ls-files` check (planned)            | 0 upstream files to be committed                                       |
| No network in skill        | grep of `skills/`, `hooks/`, `.opencode/` | CONFIRMED zero runtime network calls                                   |
| Telemetry                  | README + skill bodies                     | CONFIRMED none                                                         |
