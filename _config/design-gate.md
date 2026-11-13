# Design Gate (Constitutional)

1. **Brand authority:** `docs/constitution/01-BRAND-CONSTITUTION.md` — palette, fonts, voice; on conflict with 05, **01 prevails** (00 §5.4).
2. **Mechanics:** `docs/constitution/05-DESIGN-SYSTEM.md` — token architecture, spacing, motion, a11y.
3. **Implementation SoT:** `packages/platform-ui/src/styles/tokens.css` + `packages/platform-ui/src/components/` (`--color-*` forest/ivory/gold, `--font-display` Playfair, `--font-sans` Inter).
4. **Skills:** `bhavya-design-system`, then `bhavya-ui-verification` after visual work.
5. **Gate:** `pnpm tokens:check`. No hardcoded colors/fonts; no new primitive when platform-ui already has one.

**OPEN (human):** exact hex/palette alignment among 01 vs 05 vs `tokens.css` is unresolved. Do not amend constitutional text or tokens to force agreement during routine work.
