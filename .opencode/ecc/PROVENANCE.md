# ECC Provenance and Integration Record

This file records exactly what was vendored from ECC, what was deliberately
excluded, and how to verify or remove the integration.

## Source

| Field | Value |
|---|---|
| Project | ECC — "the agent harness operating system" |
| Upstream repository | `https://github.com/affaan-m/ECC` |
| npm package (NOT installed) | `ecc-universal` |
| Version pinned | **2.2.3** (released 2026-10-01) |
| Upstream branch read | `main` |
| License | **MIT** — Copyright (c) ECC contributors |
| Retrieved | 2026-10-19 |
| Total upstream bytes vendored | 111,677 (8 commands + 8 agents + 4 skills) |

Integrity note: upstream byte totals were verified per file at fetch time. This is a
retrieval record, **not** a security audit of the ECC project.

## Authority

Every file listed below is **subordinate helper content**. Root `AGENTS.md` is the
constitution of this repository and wins on every conflict. See
`.opencode/instructions/BHAVYA-PRECEDENCE.md` for the full precedence model and the
human-gate hard stops that each vendored file carries inline.

## Transformation applied to every vendored file

1. Bhavya authority banner inserted immediately after the YAML frontmatter.
2. Frontmatter `name:` renamed to the namespaced `ecc-*` form.
3. Frontmatter `model:` **removed** (see "Model pinning" below).
4. Claude-specific tool lists and harness paths replaced with Bhavya equivalents.
5. `npm`-based commands replaced with Bhavya-native `pnpm` gates.
6. Destructive or heavy-local-build instructions neutralized per AGENTS.md §16.

## Bhavya reconciliation pass

A second pass was performed after the initial vendoring, after the ECC catalog was
recovered onto `feat/ecc-integration` (cherry-picked from the local-only commit
`cd3be3a2`). These edits were required to keep every vendored asset inside the
Bhavya platform contract. They change instruction content only; no Bhavya file,
gate, constitution, or platform decision was modified.

| File | Upstream content | Reconciled to | Authority |
|---|---|---|---|
| `.opencode/agent/ecc-planner.md` | "Worked Example: Adding Stripe Subscriptions" — a full plan modelling paid subscription billing, a `subscriptions` table, Stripe Checkout, and Stripe webhooks | Replaced with "Worked Example: Adding a Bhavya-Compliant Curriculum Endpoint" — a signed-URL certificate endpoint using only Cloudflare/OpenNext, Turso, Supabase Auth, and Backblaze B2 | `PLATFORM-TRUTH.md:14` (paid APIs prohibited), `AGENTS.md` §14 (free/open-source only) |
| `.opencode/agent/ecc-architect.md` | Example architecture naming Vercel, Cloud Run, Railway, Upstash, and the Claude API | Replaced with the Bhavya platform truth: Cloudflare Workers via OpenNext, Turso, Supabase Auth, B2, `@bhavya/platform-ui` tokens | `docs/architecture/PLATFORM-TRUTH.md` (Cloudflare/OpenNext canonical) |
| `.opencode/agent/ecc-e2e-runner.md` | Frontmatter description: "Vercel Agent Browser (preferred)" | "driven by the Playwright MCP server already wired in opencode.json" | Bhavya wires Playwright as an MCP server; `agent-browser` is not installed and not a paid dependency |
| `.opencode/skills/ecc-security-review/SKILL.md` | Checklist item: "Production secrets in hosting platform (Vercel, Railway)" | "Production secrets in Cloudflare Workers environment (per PLATFORM-TRUTH.md)" | `PLATFORM-TRUTH.md` |

Deliberately **not** changed:

- The single occurrence of "Stripe" that remains in `ecc-planner.md` is inside a
  success criterion that *forbids* introducing Stripe. It is a prohibition, not a
  proposal, and is left intact deliberately.
- The R2 mentions in `ecc-planner.md` are likewise prohibitive ("no R2").
- All Bhavya authority banners and hard-stop blocks were left byte-identical.

## Vendored file inventory

### Commands — `.opencode/command/` (upstream `.opencode/commands/`)

| Bhavya file | Upstream path |
|---|---|
| `ecc-plan.md` | `.opencode/commands/plan.md` |
| `ecc-tdd.md` | `.opencode/commands/tdd.md` |
| `ecc-code-review.md` | `.opencode/commands/code-review.md` |
| `ecc-security.md` | `.opencode/commands/security.md` |
| `ecc-build-fix.md` | `.opencode/commands/build-fix.md` |
| `ecc-e2e.md` | `.opencode/commands/e2e.md` |
| `ecc-verify.md` | `.opencode/commands/verify.md` |
| `ecc-update-docs.md` | `.opencode/commands/update-docs.md` |

### Agents — `.opencode/agent/` (upstream `agents/`)

| Bhavya file | Upstream path | Upstream `model:` (removed) |
|---|---|---|
| `ecc-planner.md` | `agents/planner.md` | `opus` |
| `ecc-architect.md` | `agents/architect.md` | `opus` |
| `ecc-code-reviewer.md` | `agents/code-reviewer.md` | `sonnet` |
| `ecc-security-reviewer.md` | `agents/security-reviewer.md` | `sonnet` |
| `ecc-tdd-guide.md` | `agents/tdd-guide.md` | `sonnet` |
| `ecc-build-error-resolver.md` | `agents/build-error-resolver.md` | `sonnet` |
| `ecc-e2e-runner.md` | `agents/e2e-runner.md` | `sonnet` |
| `ecc-doc-updater.md` | `agents/doc-updater.md` | `haiku` |

### Skills — `.opencode/skills/` (upstream `skills/`)

| Bhavya file | Upstream path |
|---|---|
| `ecc-tdd-workflow/SKILL.md` | `skills/tdd-workflow/SKILL.md` |
| `ecc-security-review/SKILL.md` | `skills/security-review/SKILL.md` |
| `ecc-verification-loop/SKILL.md` | `skills/verification-loop/SKILL.md` |
| `ecc-e2e-testing/SKILL.md` | `skills/e2e-testing/SKILL.md` |

## Intentionally excluded — and why

### ECC plugin runtime — EXCLUDED (decisive)

`ecc-universal`'s main export **is** the OpenCode plugin (`.opencode/dist/index.js`).
Loading it activates `ecc-hooks.ts`, whose `permission.ask` handler
(`.opencode/plugins/ecc-hooks.ts` line 761) has **no `hookEnabled()` gate at all**.
It unconditionally auto-approves:

- read-only tools (`read`, `glob`, `grep`, `search`, `list`)
- formatters matching `^(npx )?(@biomejs/biome|prettier|black|gofmt|rustfmt|swift-format)`
- test runners matching `^(npm test|npx vitest|npx jest|pytest|go test|cargo test)`

Because the handler never consults `ECC_HOOK_PROFILE` or `ECC_DISABLED_HOOKS`, it
**cannot be suppressed** from environment variables, let alone from the repository.
An agent could therefore run `npx prettier --write` or `npx vitest` with no human
prompt, routing around the `pnpm format` and `pnpm test` gates and weakening the
AGENTS.md §11 Human Gates. All hooks were classified **non-constitutional**, so the
entire plugin surface was omitted rather than shipped with unverifiable suppression.

### ECC installer — EXCLUDED

`scripts/install-apply.js` line 44 states the `opencode` target installs into
`OPENCODE_CONFIG_DIR`, `XDG_CONFIG_HOME/opencode`, or `~/.config/opencode/`. That is
a global user-level takeover. The installer was never run. Nothing was written to any
global location.

### Other excluded surfaces

| Excluded | Reason |
|---|---|
| `instructions/INSTRUCTIONS.md` | Would load 11 always-on ECC skills as permanent context tax and compete with `AGENTS.md` |
| 7 remaining always-loaded ECC skills | `coding-standards`, `backend-patterns`, `frontend-patterns`, `frontend-slides`, `strategic-compact`, `eval-harness`, `api-design` — context tax or competing with Bhavya platform contracts |
| All ECC hooks | See above; non-constitutional |
| `orchestrate`, `loop-start`, `loop-status` | Autonomous multi-agent execution conflicts with Human Gates |
| `learn`, `eval`, `evolve`, `instinct-*`, `promote`, `projects`, `checkpoint` | Self-modifying agent instructions; memory-vault has open native-Windows defects (#2489, #2626) |
| `setup-pm` | Bhavya has a fixed `pnpm` monorepo and `.opencode/package.json` |
| `update-codemaps` | Bhavya has declared generators `pnpm file-map` / `pnpm file-map:check` |
| `model-route` | Would alter provider/model selection, which is out of scope |
| `quality-gate` | Duplicates Bhavya's gate set |
| `skill-create` | Conflicts with the AGENTS.md §8 skill-governance pin |
| `refactor-clean`, `test-coverage` | Explicitly excluded from this task's scope |
| `harness-audit`, `refactor-clean`, `go-*`, `rust-*`, `security-scan` | Wrong language, or duplicate of Bhavya `bhavya-security` / `bhavya-route-audit` |
| Agents `harness-optimizer`, `loop-operator`, `docs-lookup`, `database-reviewer`, all language reviewers | `harness-optimizer` would tune `opencode.json` (sovereignty risk); `loop-operator` conflicts with Human Gates; `docs-lookup` duplicates the wired Context7 MCP; `database-reviewer` deferred for storage-boundary reasons; repo is TypeScript |
| `multi-*` commands | Require the separate external `ccg-workflow` runtime, which is not bundled or attested by ECC |
| `/astra-review` | Sends diffs to a third-party provider; unacceptable under Bhavya governance and auditability |

## Model pinning — why every `model:` line was removed

All eight upstream agents pinned a specific Claude model (`opus`, `sonnet`, `haiku`).
Under this repository's constraints those lines had to go:

- **Provider/model selection stays untouched.** Bhavya owns model routing.
- **No paid dependencies.** `opus` is a paid tier; the machine contract requires
  free/open-source services only.
- The pinned names are not valid OpenCode model identifiers.

Vendored ECC agents therefore inherit the invoking primary agent's model, per ECC's
own documented behaviour when no model is pinned.

## Verification

- `git diff --name-status` — confirms exactly which files were added or changed.
- `git diff --check` — whitespace/conflict-marker check.
- JSON parse of `opencode.json` — confirms the additive edit is valid.
- Existence check for all 21 new files.

## Removal

Fully Git-auditable. No package installed, no global state, no env var, no hook runtime.

```bash
git checkout -- opencode.json
git clean -fd .opencode/agent .opencode/command/ecc-plan.md .opencode/command/ecc-tdd.md \
  .opencode/command/ecc-code-review.md .opencode/command/ecc-security.md \
  .opencode/command/ecc-build-fix.md .opencode/command/ecc-e2e.md \
  .opencode/command/ecc-verify.md .opencode/command/ecc-update-docs.md \
  .opencode/skills/ecc-tdd-workflow .opencode/skills/ecc-security-review \
  .opencode/skills/ecc-verification-loop .opencode/skills/ecc-e2e-testing \
  .opencode/instructions .opencode/ecc
```

Bhavya depends on no ECC internals at runtime: the vendored files are inert Markdown
that only an agent chooses to read, and deleting them removes ECC capability entirely.