# Privacy Review — Diagram Design

**Stage:** 1 — Upstream due diligence  
**Verdict:** ACCEPTABLE — proceed

---

## 1. Upstream privacy position

Diagram Design is published by LittleMight (Cathryn Lavery). Per `PRIVACY.md` (effective 2026-10-01):

- **No server, no accounts, no analytics, no telemetry.** LittleMight receives no data from use of the skill.
- **No personal data collected** through the skill.
- Content (diagram description, files to redraw, onboarding URL) stays in the agent session / provider workspace under that provider's own privacy policy.
- **Google Fonts** is the only third-party contact: `fonts.googleapis.com` and `fonts.gstatic.com`. Google receives the viewer's IP address and browser details under Google's own privacy policy; the request names fonts only and contains no diagram content.
- **Brand onboarding** fetches user-named websites only on explicit request; nothing is fetched unless the user asks.
- Diagrams and profiles are local files retained until the user deletes them.

## 2. Bhavya data handling

| Data                           | Handling                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diagram content                | Authored locally from Bhavya content sources; never sent to upstream                                                                                          |
| User-provided URLs             | Not used for onboarding automatically; Bhavya onboarding is manual, from local `tokens.css` and brand documents, not live websites                            |
| Generated files                | Local artifacts under `docs/diagrams/` and `apps/ai-institute/public/diagrams/`; deleted with the owning content                                              |
| IP addresses / browser details | Not collected by Bhavya or upstream; only relevant if a viewer opens a diagram that still references Google Fonts (Bhavya diagrams use system fonts, so none) |

## 3. Constraints

- Bhavya profile derives tokens from local `packages/platform-ui/src/styles/tokens.css` and brand documents — **no live website fetch**, no external font request.
- No personal data is captured by diagrams (diagrams depict systems, org structure, curriculum — not individuals).
- No analytics or telemetry added around diagram rendering.

## 4. Sign-off

- No upstream data collection ✓
- No Bhavya telemetry added ✓
- No external font request in production ✓
- No personal data in diagram content ✓

**Verdict: ACCEPTABLE.** Proceed to Stage 2.
