# Lessons Source Analysis — Source B (2026-09-17, Phase 2)

## Identity

Raspberry Pi Foundation "Experience AI" (experience-ai.org, en-US locale). Manifest carries per-file Drive download URLs + unit page URLs. License CC BY-NC-ND 4.0 (in-deck text) — ATTRIBUTION required, NON-COMMERCIAL, NO DERIVATIVES (no remix/adapt; reference/link model only).

## Counts (explicit)

- 31 lesson packs (`lessons-extracted/` + 1:1 `lesson-zips/` originals, verified on LLM pack 6==6)
- 130 extracted files: 83 docx + 47 pptx; 0 missing; 0 invalid (stdlib XML parse, 0 failures)
- ~110,285 words extracted
- 28 root unit files (overviews, learning graphs, summative Q+A with answers, educator guides, glossaries) + `_manifest.json`
- Exact path: `D:\Bhavya-Foundation-Source\Lessons\Experience-AI-Resources\`; extraction 2026-09-17 ~02:56 UTC; source ZIP untouched

## Structural categories (5 strands)

1. **Foundations L1–L8 (classroom units, 11–14):** L1 What is AI · L2 How computers learn from data (+answers) · L3 Bias in bias out · L4 Decision trees · L5 Solving problems with ML models (3 projects: ocean data, fake news, waste) · L6 Model cards + careers (+summative) · L7 LLMs (Blah model card) · L8 Ecosystems+AI (Biology cross-curricular)
2. **Module 1 Understanding AI (M1-L1–L4):** What is AI · Machine learning · Classification · Bias in bias out (+ summative Q+A, learning graph, overview)
3. **Module 2 Solving problems with AI (M2-L1–L5):** AI around you · Creating AI projects (model-card review) · ML models part 1 (wildfire/organic-waste projects) · part 2 · Model cards + careers (+ summative Q+A, learning graph, overview)
4. **Flood forecasting thread (env-L1–L4 + detectives):** What is a flood · AI flood detectives (Google Flood Hub) · Predicting floods (problematic predictions) · AI Quests Market Marshes (data collection + reflections)
5. **AI & society:** Social media L1–L3 (exploring, engagement bait, designed for attention) · AI safety (manager challenge, safety guide, L9 data / L10 media literacy / L11 using tools responsibly) · AI detectives (clever claim) · Media literacy · Your data and AI · Discovering AI 8–12 / 14–16 (Lesson 0 entry points)

## File-role terminology (prefix code)

LP lesson plan · SL slides · A activity/worksheet (+A answers) · PRJ/PB/PW project brief/worksheet · INTRO overview · SA summative (Q questions, A answers) · LG learning graph · GLO glossary · EG educator guide · SL learner-worksheet variants.

## Content kinds

Instructional (LP/SL/INTRO/guides) · exercises/worksheets (A) · assessment (exit tickets, SA Q+A) · projects (L5 PRJ1-3, M2 wildfire/waste) · reference (glossaries, model cards, info sheets) · media (slide decks; videos referenced externally — NOT in corpus, online dependency flagged).

## Metadata available / missing

Available: pack slug, locale, age band (dir/file names), role prefix, educator answers, assessment keys, license. MISSING: machine-readable ages/durations/objectives/prerequisites (all inside prose LP docs — extraction needed for catalog), version/date stamps, media files for referenced videos, answer keys for some worksheets.

## Duplicates / overlap (packaging variants, NOT distinct lessons)

Bias (Foundations L3 ≡ M1-L4) · What-is-AI (L1 ≡ M1-L1) · ML-models projects (L5 ≡ M2-L3/L4) · Model cards+careers (L6 ≡ M2-L5). Same program, two packagings (classroom L-units vs module pathway). Record both slugs, map to one concept — never deduplicate files.

## Notable concepts

Project lifecycle · user-centered design (personas) · model cards (incl. Google Flood Hub card) · decision trees (stellar classification data) · data types · problematic predictions · engagement bait/attention design · ethical inspector · prediction pathway.

## Overlap with Source A (no merge — mapping only)

Source A L1 (found/py/dl/llm code lessons) :: Source B Foundations+M1 (classroom AI literacy) — complementary (code-first vs concept-first), shared concepts (ML, bias, LLMs, model cards). Sequencing opportunity: B as conceptual on-ramp → A as implementation track. Age fit: B targets 8–16 classroom; A targets academy progression — compatible with Himachal rural cohort, PENDING human pedagogy decision.
