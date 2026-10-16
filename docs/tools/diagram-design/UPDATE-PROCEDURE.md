# Update Procedure — Diagram Design OpenCode Skill

**Stage:** 2 — Install for OpenCode (update guidance)  
**Status:** CURRENT — pinned to `b46c9701f035844a20b13ab0551315977188933b`

---

## 1. Policy

Diagram Design publishes **no versioned releases**; fixes land on `main`. Bhavya therefore:

- **Pins a commit** and records it in `docs/tools/diagram-design/UPSTREAM-AUDIT.md`.
- **Never enables automatic unpinned updates.**
- Re-pins only after a deliberate review (licence, third-party licences, privacy, security surface).

## 2. Update steps

1. Inspect upstream `main` since the pinned SHA (CHANGELOG.md, SKILL.md, references/, scripts/, assets/).
2. Re-read `LICENSE` and `THIRD_PARTY_LICENSES.md`; stop if either changed to an incompatible licence → human gate.
3. Re-run privacy and security review only if network or script surface changed.
4. Fetch the new commit into the external checkout (`...\Temp\opencode\diagram-design-upstream` or a fresh clone), do **not** commit it into Bhavya.
5. Replace the pinned checkout `~/.local/share/bhavya-tools/diagram-design/skills/diagram-design/` with the new `skills/diagram-design/`.
6. Replace the OpenCode install `~/.config/opencode/skills/diagram-design/` with the new content (copy; symlink if privileges allow).
7. Record the new SHA in `docs/tools/diagram-design/UPSTREAM-AUDIT.md` and in `docs/diagrams/BHAVYA-PROFILE.md` (generator commit field).
8. Run Stage 11 validation against any reference diagrams regenerated under the new skill.
9. Open a PR on the Bhavya branch documenting the re-pin; do not merge/deploy without human authorization.

## 3. Rollback

Restore the previous pinned checkout content into `~/.config/opencode/skills/diagram-design/` and revert the SHA in `UPSTREAM-AUDIT.md`. No application code depends on the skill at runtime, so rollback is limited to authoring tooling.
