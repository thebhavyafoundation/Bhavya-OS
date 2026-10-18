# Update Procedure — Ponytail OpenCode Skill

**Stage:** 2 — Install for OpenCode (update guidance)  
**Status:** CURRENT — pinned to `09c434ab73ca43761c5d8b0c5d341926c2fba710`

---

## 1. Policy

Ponytail publishes **no versioned releases**; fixes land on `main`. Bhavya therefore:

- **Pins a commit** and records it in `docs/tools/ponytail/UPSTREAM-AUDIT.md` and the wrapper frontmatter.
- **Never enables automatic unpinned updates.** Auto-update is opt-in per host and is never turned on.
- Re-pins only after a deliberate review (licence, third-party licences, privacy, security surface).

## 2. Update steps

1. Inspect upstream `main` since the pinned SHA (`SKILL.md`, `commands/`, `hooks/`, `README.md`, `benchmarks/`).
2. Re-read `LICENSE`; stop if it changed to an incompatible licence → human gate.
3. Re-run privacy and security review only if network or script surface changed.
4. Fetch the new commit into the external checkout (`...\Temp\opencode\ponytail-upstream` or a fresh clone),
   do **not** commit it into Bhavya.
5. Replace the pinned OpenCode skill copy `~/.config/opencode/skills/ponytail/` with the new
   `skills/ponytail/`.
6. Replace the Bhavya wrapper `skills/bhavya-ponytail/` (and `.opencode/skills/bhavya-ponytail/`) with
   reviewed content, recording the new SHA in frontmatter and `UPSTREAM-AUDIT.md`.
7. Run `pnpm wrapper:check` to validate the wrapper.
8. Open a PR on the Bhavya branch documenting the re-pin; do not merge/deploy without human authorization.

## 3. Rollback

Restore the previous pinned skill copy into `~/.config/opencode/skills/ponytail/` and revert the SHA in
`UPSTREAM-AUDIT.md` and the wrapper frontmatter. No application code depends on the skill at runtime, so
rollback is limited to authoring/review tooling.
