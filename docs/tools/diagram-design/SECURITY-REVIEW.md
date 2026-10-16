# Security Review — Diagram Design

**Stage:** 1 — Upstream due diligence  
**Verdict:** ACCEPTABLE with constraints — proceed

---

## 1. Threat model

Diagram Design is an **offline authoring skill** run inside OpenCode. It generates local `.html`/`.svg`/`.png` files. It has no server, no database, no authentication surface, and no user-facing endpoint introduced into Bhavya apps. The attack surface is:

1. The installed skill files themselves (read-only content OpenCode loads on demand).
2. Generated diagram HTML (self-contained, static by default).
3. The optional Google Fonts stylesheet request (dropped in Bhavya `system` mode).
4. Optional brand-onboarding fetch of a user-named website (never automatic; explicit trust confirmation required upstream).

## 2. Findings

| Area            | Finding                                                                                                                                                            | Bhavya control                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Network         | Google Fonts is the only network destination, only when skin font source = `web`                                                                                   | Bhavya profile sets font source to `system`; zero network requests from production diagrams                          |
| Telemetry       | None — no server, no analytics, no update ping                                                                                                                     | N/A                                                                                                                  |
| Code execution  | Static HTML has no JavaScript; motion uses one scoped canonical controller only                                                                                    | Bhavya uses static (`mode: "none"`) diagrams; no interactive HTML embedded in routes                                 |
| Supply chain    | No versioned releases; fixes on `main`                                                                                                                             | Pinned commit `b46c970...`; manual re-pin review; no auto-update                                                     |
| Untrusted input | Import extractors treat draw.io/Mermaid/Excalidraw as untrusted (DTD/entity rejection, caps, duplicate-ID rejection)                                               | Bhavya does not run imports against untrusted third-party files; any import is a manual, reviewed authoring step     |
| SVG safety      | `self_check.py` rejects remote assets beyond approved fonts, executable attributes, non-canonical scripts; `export_svg.py` XML-escapes CSS and namespaces defs IDs | Stage 11 validation enforces: no `<script>`, no external URLs, no unsafe event attributes, valid viewBox, unique IDs |
| Secrets         | Skill never handles credentials; Bhavya content policy forbids credentials in diagrams                                                                             | Stage 11 validation rejects secret-like strings; no secret names in diagram sources                                  |

## 3. Constraints applied to Bhavya integration

- No interactive HTML embedded in application routes (static SVG via `` only).
- Sandboxed iframe would be required only if interactive HTML were ever needed (not planned; would need strict CSP, no top navigation, no forms, no cookie access).
- No automatic exports; export is a manual authoring command (Stage 10).
- No generated output on pages where it adds no explanatory value (Stage 14 / authoring guide).

## 4. Sign-off

- No server / no telemetry ✓
- Network avoidable and avoided in production ✓
- Pinned commit; no auto-update ✓
- SVG safety validated at authoring time (Stage 11) ✓
- Credential exclusion enforced ✓

**Verdict: ACCEPTABLE.** Proceed to Stage 2 with the constraints above recorded.
