# Security Review — Design Taste (taste-skill)

## 1. Threat model

The skill is loaded by the agent when design work is requested. The risks
that matter for an instruction-only skill are:

| Risk                | Question                                                           |
| ------------------- | ------------------------------------------------------------------ |
| Code execution      | Does the skill cause code to be run, or bring code with it?        |
| Network access      | Does it direct the agent to fetch or transmit anything?            |
| Credential exposure | Could it cause secrets to be read, printed or sent?                |
| Authority capture   | Could it override Bhavya's constitutional or governance authority? |
| Scope capture       | Could it expand a bounded task into a redesign?                    |
| Fabricated evidence | Could it cause invented institutional facts to be published?       |

## 2. Findings

**S1 — No executable code.** At the pinned commit the skill is a single
Markdown file of design instructions. It ships no scripts, no binaries and
no dependencies. Nothing in it is executed.

**S2 — No direct network instruction.** The pinned file contains no
instruction to fetch a remote asset or to call a hosted service. (The newer
upstream versions do bundle scripts and reference image collections; that is
not the pinned version.)

**S3 — No credential handling.** The file contains no instruction that
reads, prints, transmits or stores credentials, tokens, environment
variables or `.env` files.

**S4 — Authority conflict (material, documented).** The skill states design
rules in the imperative. Read literally, a rule such as "the output fails
the Pre-Flight Check if it contains an em dash" outranks Bhavya's house
voice; a rule requiring a page to actually move adds motion to satisfy a
dial; a section-layout quota and the discouragement of hand-authored SVG
conflict with Bhavya's established editorial rhythm and diagram system.

These are recorded as F1–F4 in `UPSTREAM-PIN.md` and overridden **only**
for Bhavya-branded work, with the override written down rather than
silently applied.

**S5 — Fabricated evidence risk (material, documented).** A design skill
that pushes for "real" imagery and "premium" composition can be read as
licence to place stock or synthetic imagery on a page and present it as
Foundation activity. Bhavya's rule is absolute: synthetic or stock imagery
is never presented as real Foundation activity, and no impact figure,
partnership, accreditation or curriculum count is invented.

**S6 — Scope-creep risk.** The skill's own guidance is written for landing
pages and redesigns, and it encourages large structural change. Bhavya's
bounded-improvement rule wins: no global redesign during a bounded
improvement task, and one implementation owner per bounded visual slice.

## 3. Constraints applied to the Bhavya integration

1. Bhavya authority outranks every upstream default.
2. No fabricated public facts, evidence, imagery or counts.
3. No automatic typography or palette replacement. Brand and token authority
   is `docs/constitution/01-BRAND-CONSTITUTION.md` and
   `packages/platform-ui/src/styles/tokens.css`; the hex/palette conflict
   between them stays open and human-gated.
4. No mandatory number of animations, images or sections.
5. No new animation engine and no runtime dependency for the skill.
6. No motion added to satisfy a visual inspector.
7. No global redesign during a bounded task.
8. `pnpm tokens:check` and `pnpm antislop` still gate the result.

## 4. Sign-off

Reviewed on 2026-11-12 against the pinned commit
`3c7017d636c3a4aad378433ea6d0cfa6c921da4a`. No code execution, no network
instruction and no credential path was found in the pinned artefact. The
material findings are S4, S5 and S6, and each is bounded by an explicit,
written override.
