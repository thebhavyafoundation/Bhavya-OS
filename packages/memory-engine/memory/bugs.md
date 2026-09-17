# Memory — Bugs

## Active Bugs

None currently tracked.

## Resolved Bugs

1. **Vercel Deployment 404**
   - **Date:** 2026-07-27
   - **Issue:** Vercel project rename caused 404
   - **Resolution:** Verified URL and redeployed

2. **Git Email Mismatch**
   - **Date:** 2026-07-27
   - **Issue:** Git email didn't match Vercel account
   - **Resolution:** Changed git email to thebhavyafoundation@gmail.com

3. **TypeScript Errors**
   - **Date:** 2026-07-27
   - **Issue:** Missing comma in type union, unused variables
   - **Resolution:** Fixed syntax errors in decision-engine.ts, governance-engine.ts, reasoning-engine.ts

## Bug Prevention

1. Always run lint before commit
2. Always run typecheck before commit
3. Always test before deploy
4. Always verify environment variables
