# Uninstall Procedure — Design Taste OpenCode Skill

## 1. Removal steps

1. Delete the vendored upstream copy:
   - `.opencode/skills/design-taste-frontend/`
2. Delete the wrapper:
   - `.opencode/skills/bhavya-design-taste/`
3. Keep the records in `docs/tools/design-taste-frontend/` — they are the
   provenance of what was installed, and removing them loses the licence
   trail. They are inert Markdown.
4. Remove the routing line for this skill from `AGENTS.md`, if one exists.
5. Re-run the repository's wrapper gate:
   ```bash
   node scripts/check-skill-wrappers.mjs
   ```

## 2. What remains (intentional)

- `docs/tools/design-taste-frontend/` — the licence, pin, security and
  install records.
- Any design work already produced under the skill. Removing the skill does
  not remove the work, and the work is not retro-fitted to the skill's
  rules: Bhavya's own design gate governs it.

## 3. What must NOT be removed without review

- `packages/platform-ui/src/styles/tokens.css` and the design tokens. The
  skill is an instruction; it does not own Bhavya's brand values.
- `scripts/diagrams/check-manifests.mjs` and `validate-diagrams.mjs`.
- `docs/constitution/`.
- `packages/platform-ui/src/components/` — Bhavya's own primitives.

## 4. No uninstall script

There is deliberately no uninstall script. The skill adds no runtime
dependency, writes nothing outside the repository, registers no hook, no MCP
server and no background process, and adds no environment variable. Removing
the two directories is the whole uninstall.
