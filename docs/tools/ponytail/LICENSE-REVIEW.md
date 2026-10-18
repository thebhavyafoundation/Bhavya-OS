# Licence Review — Ponytail

**Stage:** 1 — Upstream due diligence  
**Verdict:** COMPATIBLE — proceed

---

## 1. Skill licence

| Field               | Value                                                                           |
| ------------------- | ------------------------------------------------------------------------------- |
| Licence             | MIT License                                                                     |
| Copyright holder    | Dietrich Gebert, 2026                                                           |
| Source              | `LICENSE` at repository root, commit `09c434ab73ca43761c5d8b0c5d341926c2fba710` |
| Upstream URL        | https://github.com/DietrichGebert/ponytail                                      |
| npm package licence | MIT (`npm view @dietrichgebert/ponytail license`, v5.3.2)                       |

MIT is permissive, copyleft-free, and compatible with Bhavya's repository use. No notice requirements
beyond retaining the copyright and permission notice in copies/substantial portions of the skill —
satisfied by retaining `LICENSE` and the audit record here. No patent, trademark, or use restrictions
relevant to an internal authoring/review skill.

## 2. Third-party components bundled by the skill

None. Ponytail ships no icon, font, image, or asset bundles; the skill is a system prompt. The README
references external images (logos, charts, badges) as documentation assets only — none are loaded by the
skill at runtime and none are redistributed by Bhavya.

## 3. Trade marks

GitHub and npm badges in the README remain trademarks of their owners. Bhavya does not use them in
application code or imply endorsement, sponsorship, or affiliation.

## 4. Generated output

Ponytail review/audit/debt/gain output is text produced in the agent session. The MIT licence governs
the skill, not its output. Bhavya-owned review reports are Bhavya Foundation material. No upstream
licence condition attaches to generated output.

## 5. Conditions for Bhavya use

1. Do not clone the upstream repository into the monorepo — the skill is installed into OpenCode's
   user skill directory only, governed by the `bhavya-ponytail` wrapper.
2. Do not modify `docs/constitution/` or brand meaning as part of this integration.
3. Do not enable upstream auto-update; re-pin only after a deliberate review.
4. If the upstream licence ever changes to an incompatible licence, re-run this review before re-pinning.

## 6. Sign-off

- Licence read: MIT (compatible) ✓
- Third-party components: none bundled ✓
- No copyleft, no proprietary, no payment-gated components ✓
- Outputs carry no additional conditions ✓

**Verdict: COMPATIBLE. Integration unblocked.**
