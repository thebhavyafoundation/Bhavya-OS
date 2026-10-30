# PR #62 — Verification Summary

## Candidate

- Branch: feat/visual-learning-batch
- Full app/test SHA: 6ecaebb0c97311d8f1c606ddce18b180f9fbb2dd
- Preview URL: https://bhavya-foundation-preview.thebhavyafoundation.workers.dev
- Preview version ID: 619455a6-9eba-45e5-963c-8675ad951500
- Workflow run: 41123762877 (opennext-preview.yml)
- CI checks: 10/10 PASS (OpenNext build, Build preview bundle, Deploy preview to Cloudflare, Remote Playwright verification, lint-and-typecheck, test, Platform contract, secret-scan, build, Vercel Preview Comments)
- Artifact: playwright-verification (7-day retention)

## Scenarios (PASS unless noted)

- Homepage load + scroll + CLS: PASS
- Mobile menu open/close x10: PASS
- Route transitions (home ↔ missions): PASS
- Reduced-motion homepage + missions: PASS (with documented exception)
- Mission page canvas (ParticleField): PASS
- WebGL fallback: PASS
- No horizontal overflow: PASS
- Desktop dropdown open/close x10 + scroll + Escape: PASS (new coverage)
- Defining AI lesson route: PASS (visual block renders exactly once)
- Nested AI/ML/DL diagram (containment, no arrows): PASS
- Curriculum spotlight homepage: PASS

## Known exceptions (require human acceptance)

1. React #418 hydration mismatch on /missions under reduced motion — two signatures:
   - args[]=text
   - args[]=HTML
     Both present on production baseline. Filtered in test with scoped allowlist (route/scenario/signature). Tracked as explicit exception; root-cause fix not attempted (pre-existing, outside candidate scope).
2. Dialog/Sheet runtime verification: NOT TESTED. No unauthenticated route exercises them in preview (donor page requires auth → 401). Typecheck + build pass only. Not marked runtime-verified.
3. Ruflo: NOT INSTALLED (separate track; no remote runner provisioned).
4. karpathy-guidelines upstream pin: commit 64723a49ea6117894304eb491f0d32a60570bf45 (content verified byte-identical, UTF-8, no BOM).

## Known warnings (non-blocking)

- favicon 404 (cosmetic)
- THREE.Clock deprecation (pre-existing)
- Next.js 15 outside support window (flag already in build)

## Production

- Production worker: bhavya-foundation (unchanged, on 98388ddb)
- PR #62: draft. Production promotion requires separate explicit approval.
- Rollback target: 98388ddb / worker bhavya-foundation.

## Gates

- Required browser/visual checks: PASS (except Dialog/Sheet runtime — gap).
- Subject-matter diagram review: PASS (nested containment).
- Desktop dropdown/scroll coverage: PASS.
- Skill provenance: PASS (SHA recorded, content verified).
