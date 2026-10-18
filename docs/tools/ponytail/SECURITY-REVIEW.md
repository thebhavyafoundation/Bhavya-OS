# Security Review — Ponytail

**Stage:** 1 — Upstream due diligence  
**Verdict:** ACCEPTABLE with constraints — proceed

---

## 1. Threat model

Ponytail is an **offline agent skill** run inside OpenCode. It is a system prompt plus read-only review
skills. It has no server, no database, no authentication surface, and no user-facing endpoint introduced
into Bhavya apps. The attack surface is:

1. The installed skill files themselves (read-only content OpenCode loads on demand).
2. The Bhavya wrapper `skills/bhavya-ponytail/` (project-owned, read-only).
3. Agent-local mode state files (`~/.config/opencode/.ponytail-active`, `~/.config/ponytail/config.json`).
4. Review/audit output produced in the agent session (not stored by the skill).

## 2. Findings

| Area           | Finding                                                                                                              | Bhavya control                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Network        | The skill makes **zero network requests**. No telemetry, analytics, or update ping.                                  | N/A                                                                                         |
| Telemetry      | None — no server, no accounts, no analytics                                                                          | N/A                                                                                         |
| Code execution | Ponytail does not execute code; it advises the agent. The agent retains full responsibility for any change it makes. | Bhavya wrapper forbids simplifying security/auth/a11y/curriculum logic (Stage 5 exceptions) |
| Supply chain   | No versioned releases; fixes on `main`                                                                               | Pinned commit `09c434ab...`; manual re-pin review; no auto-update                           |
| Secrets        | Skill never handles credentials; Bhavya content policy forbids secrets in review input/output                        | Secret scan (CI) + no-client-B2-secret scan enforced in Stage 7                             |
| State files    | Plugin writes agent-local mode state outside the repo (`~/.config/opencode/.ponytail-active`)                        | Not committed; not application data; removed by uninstall                                   |

## 3. Constraints applied to Bhavya integration

- Ponytail never modifies Bhavya application code directly; the agent decides, under Bhavya's gates.
- The wrapper blocks simplification of: Authentication, Supabase RLS, B2 signed URLs, B2 role/prefix checks,
  Turso access, OpenNext production build, CI/deployment dependencies, curriculum standards, safeguarding
  logic, governance/policy content, WebGL fallbacks, reduced-motion support, audio captions/transcripts,
  asset licence/attribution records (Stage 5).
- Review/audit/debt/gain are one-shot, change-nothing skills.
- No production runtime dependency; never added to the application bundle.

## 4. Sign-off

- No server / no telemetry ✓
- Zero network requests from the skill ✓
- Pinned commit; no auto-update ✓
- No credentials handled ✓
- Security exceptions enforced by wrapper ✓

**Verdict: ACCEPTABLE.** Proceed to Stage 2 with the constraints above recorded.
