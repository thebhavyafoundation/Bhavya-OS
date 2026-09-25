# MASTER BHAVYA RECONSTRUCTION (2026-09-17, execution mission — updated)

Prior audit artifacts in `.ai/audits/master-reconstruction/` remain valid; this update resolves Source B, Docs provenance, capabilities, verification, and records what was implemented.

## 1–6. What Bhavya OS is / intends / has / lacks / contradicts

Unchanged from prior reconstruction (see `00_EXECUTIVE_SUMMARY.md`, `02_CONSTITUTION_FOUNDATION_MISSION.md`, `05_REPOSITORY_ARCHITECTURE.md`, `09_AI_INSTITUTE_EXISTING_CURRICULUM.md`): 4-mission institution; Institute-in-Knowledge; one canonical app (127 routes, L1-real rest-shell/stub); 6-layer doctrine vs app-SQLite reality; 8 conflicts on record. ONE CONFLICT RESOLVED this mission: "missing constitution docs 10–15" — the series EXISTS as Drive PDF originals + `_archive/constitution-2026-09-05/01–15` transcriptions (1:1 filename match verified); live `docs/constitution/` is the OS-layer subset, text-identical to Drive `.md` (difflib: 0 added/0 removed across all 10).

## 7–10. External source material

YES — both corpora found, inspected, extracted (read-only; ZIPs unmodified):

- Docs: `C:\Users\kanta\Downloads\drive-download-20260917T203310Z-1-001.zip` (6.5 MB, 26 files) → `D:\Bhavya-Foundation-Source\Docs\` — 10 `.md` (provenance-clean, see §6) + 15 scanned PDF originals (Trust Deed, charters, manuals, 8 policies, Constitution, Brand) + logo.png. PDF contents NOT yet text-read (no local PDF libs) — highest-value follow-up; may hold the only VERIFIED institutional facts.
- Lessons (Source B): `.../Experience-AI-Resources-20260917T203559Z-1-001.zip` (518.5 MB, 189 entries) → `D:\Bhavya-Foundation-Source\Lessons\Experience-AI-Resources\` — Raspberry Pi Foundation "Experience AI", en-US, ages 8–12/11–14/14–16, CC BY-NC-ND 4.0. **31 packs, 130 files (83 docx + 47 pptx), ~110,285 words**, 0 missing/invalid; nested zips 1:1 with extracted dirs (verified); +28 unit files + `_manifest.json` with source URLs. Full breakdown: `LESSONS_SOURCE_ANALYSIS.md`; machine catalog: `source-b-catalog.json`. Location deviates from recommended C: path — C: has 2.1 GB free; corpus stays outside the repo as required.

## 11–12. Source A vs B, separation

Source A = repo academy (`src/data/academy-*.ts`, L1 code-first). Source B = external Experience AI (classroom concept-first). Model: `SOURCE_SEPARATION_MODEL.md` — no merge/overwrite/rewrite/ingest ( reinforced by CC BY-NC-ND NoDerivatives); repo may hold only generated catalog facts; future relationship layer (mapping/references/prerequisites/enrichment) specified but EMPTY pending human pedagogy sign-off. No repo file references B yet (grep confirms only audit files mention it).

## 13–16. Machine capabilities

Inventoried (`bootstrap/`): Win11/AMD64, git 2.53, node 24, pnpm 10.17, python 3.12 stdlib, Vercel CLI 58.9 (DO NOT operate without authorization), no gh/wrangler/Playwright/browser, GITHUB_TOKEN present (unused/unprinted), C: constrained. Recovered: 12 bhavya skills + 13 superpowers skills (opencode cache copy; project mirror absent, harmless) + MemoryEngine + runtime daemon + MCP configs. Still missing: Playwright/browser (required eventually), gh (useful). Nothing installed this mission — nothing needed installation.

## 17. Product architecture to build

Per `25_EXECUTION_ROADMAP.md`: AUTHORITY → TRUTH → DATA → ARCHITECTURE → CURRICULUM MODEL → PRODUCT → VERIFICATION. B-capable library view (list B packs with attribution, open externally) is the only B-touching surface permitted without further approval.

## 18–19. Implemented + verified this mission

Implemented (additive only): 5 bootstrap + 4 corpus/separation docs + `source-b-catalog.json`; zero modifications/deletions/renames to existing files. Verified: `git diff --check` clean; antislop PASS (1199 files); drift-check PASS (3 pre-existing example warnings); catalog JSON parses; constitution difflib clean; extraction 1:1 spot-check. Deliberately NOT changed (needs human approval): video-engine test relocation (deletion required), deploy.yml branch, public numbers, KP-001 disposition.

## 20–22. Remains / blocked / next sequence

Remains: PDF text verification, content-truth remediation, DB/auth unification, token rebuild, duplicate retirement, branch fix, B-mapping, stub→real journey, preview→browser wiring. Blocked: NOTHING genuinely — remote CI push deferred (docs-only change; needs user-authenticated push context, exact command recorded in checkpoint). Next: human reads §24 decisions → push audit branch → PDFs → truth → data, in roadmap order.
