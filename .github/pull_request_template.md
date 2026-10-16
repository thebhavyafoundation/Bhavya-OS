<!--
Bhavya OS — Pull Request Checklist (zero-budget compliance)
Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md
Automated guard: scripts/validate-platform-contract.mjs (CI job "Platform contract")
-->

## What this PR does

<!-- One or two sentences. Link the issue or RFC. -->

## Zero-budget compliance (required)

- [ ] **No Cloudflare R2.** Storage stays on Backblaze B2.
- [ ] **No paid APIs.** No OpenAI / Anthropic / Gemini / Stripe / other billable SDK or key.
- [ ] **No payment-method-requiring service.** If a new provider needs a card, it is prohibited.
- [ ] **Deployment target unchanged.** Application still deploys to Cloudflare/OpenNext.
      Vercel remains preview-only.
- [ ] **No large binaries added to Git.** New media go to B2 with a manifest + licence record.
- [ ] **No new authentication or database system.** Supabase stays the identity provider;
      Turso stays the production database.
- [ ] **No production action taken by the author.** Merging to `master` triggers a Cloudflare
      deploy — confirm that is intended for this PR.

## Dependencies

- [ ] Every new dependency has been verified: official repository, exact licence, exact version,
      install behaviour, telemetry, network calls, transitive deps, Next 15 / React 19 / OpenNext
      compatibility.
- [ ] Licence recorded in the licence register.
- [ ] Uninstall or rollback procedure documented.
- [ ] If an existing dependency already does the job, it was used instead.

## Assets

- [ ] Every asset has an individually verified licence (a platform's general licence is not enough).
- [ ] Provenance recorded in the manifest: source URL, creator, licence, attribution, checksums.
- [ ] Nothing downloaded merely because it "looks impressive" — it serves a stated purpose.

## Security

- [ ] No secrets committed. `.env` files remain untracked.
- [ ] Privileged B2 credentials are never referenced in a Client Component.
- [ ] Server-only boundary preserved; no privileged credentials reach the browser.
- [ ] No production migration without explicit human approval.

## Accessibility & design

- [ ] WCAG 2.2 AA target met; automated checks are not a substitute for manual review.
- [ ] Design tokens only — no hardcoded colours or fonts; `pnpm tokens:check` clean.
- [ ] No duplicate design system; reused `@bhavya/platform-ui` primitives.
- [ ] Motion gated by `prefers-reduced-motion`; static fallback holds the composition.

## Content

- [ ] Curriculum changes reviewed by a human; AI-generated content is draft until approved.
- [ ] Child-facing content has safeguarding review.
- [ ] Governance/evidence claims are sourced, not invented.

## Verification

- [ ] Local gates run: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm antislop`,
      `pnpm tokens:check`, `pnpm file-map:check`, `pnpm drift:check`.
- [ ] Heavy work was **not** run locally — `pnpm build` / `turbo build` / `next build` /
      `opennextjs-cloudflare build` belong to GitHub Actions.
- [ ] `pnpm platform:check` (or `node scripts/validate-platform-contract.mjs`) passes locally.
- [ ] CI is green, including the "Platform contract" job.
- [ ] Evidence attached: command output, and a live-URL check or screenshot for visual work.

## Human-only actions

<!-- Anything requiring the project owner: merge, production deploy, migration, licence
     approval, credential entry, governance sign-off. -->

- [ ] Merge requires a human — the authoring agent must not merge its own PR.
