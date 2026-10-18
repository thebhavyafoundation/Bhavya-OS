# Uninstall Procedure — Ponytail OpenCode Skill

**Stage:** 2 — Install for OpenCode (removal guidance)  
**Status:** CURRENT

---

## 1. Removal steps

1. Delete `C:\Users\kanta\.config\opencode\skills\ponytail\` (the OpenCode upstream skill install).
2. Delete `D:\Bhavya OS\.opencode\skills\bhavya-ponytail\` and the repo junction
   `skills/bhavya-ponytail/` (the Bhavya wrapper).
3. OpenCode will no longer discover the `ponytail` or `bhavya-ponytail` skills on session start;
   ponytail-assisted review/audit is unavailable until reinstalled.

## 2. What remains (intentional)

- `docs/tools/ponytail/` — audit and procedure records (retain for provenance).
- Any review/audit/debt reports generated during the pilot (Bhavya artifacts; delete with the owning
  content).
- The external pinned checkout in temp (may be left or deleted; it is not part of the repository).

## 3. What must NOT be removed without review

- No application code depends on the skill, so no runtime references exist.

## 4. No uninstall script

The skill and wrapper are file copies with no installer, no registry entries, and no system changes.
Deletion of the directories is complete removal. (The upstream `scripts/uninstall.js` is part of the
upstream plugin, which Bhavya does not install.)
