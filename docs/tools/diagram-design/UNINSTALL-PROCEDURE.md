# Uninstall Procedure — Diagram Design OpenCode Skill

**Stage:** 2 — Install for OpenCode (removal guidance)  
**Status:** CURRENT

---

## 1. Removal steps

1. Delete `C:\Users\kanta\.config\opencode\skills\diagram-design\` (the OpenCode skill install).
2. Optionally delete the pinned checkout `C:\Users\kanta\.local\share\bhavya-tools\diagram-design\`.
3. OpenCode will no longer discover the `diagram-design` skill on session start; diagram authoring via the skill is unavailable until reinstalled.

## 2. What remains (intentional)

- `docs/tools/diagram-design/` — audit and procedure records (retain for provenance).
- `docs/diagrams/` — Bhavya profile, authoring guide, registry, checklist, licences (retain while any diagram references them).
- `content/diagrams/` — manifests and HTML sources (retain; they are Bhavya content).
- `apps/ai-institute/public/diagrams/` — exported SVG/PNG assets (inert static files; delete only with the owning route).
- Generated diagram HTML sources under `content/diagrams/sources/html/` (retain as authoring sources).

## 3. What must NOT be removed without review

- Any manifest or asset still referenced by a production route or a curriculum `DiagramBlock`.
- Any file referenced by `docs/diagrams/DIAGRAM-REGISTRY.md`.

## 4. No uninstall script

The skill is a file copy with no installer, no registry entries, and no system changes. Deletion of the skill directory is complete removal.
