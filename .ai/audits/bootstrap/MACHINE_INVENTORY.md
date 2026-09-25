# Machine Inventory (2026-09-17, Phase 0)

- OS: Microsoft Windows NT 10.0.26200.0 (Windows 11), AMD64
- Git: 2.53.0.windows.2; remote `origin https://github.com/thebhavyafoundation/Bhavya-OS`; branch `master` tracking `origin/master`
- Node v24.15.0; npm 11.12.1; pnpm 10.17.1 (matches `packageManager: pnpm@10.17.1`); Python 3.12.10 (stdlib only — no python-docx)
- OpenCode: embedded session (no `opencode` CLI on PATH); Superpowers plugin materialized in opencode cache (see CAPABILITY_RECOVERY.md)
- GitHub CLI (`gh`): NOT installed. GitHub access via MCP (github-mcp, auth header = user's file-backed token — PROTECTED, never printed)
- Browsers/Playwright: NOT installed locally (`node_modules/playwright` absent; no `.bin/playwright`). Chrome process hints in env (`CHROME_CRASHPAD_PIPE_NAME`) but no verified browser automation. Verification must use CI + remote/preview, or install Playwright later (see TOOLING_GAPS.md)
- Vercel CLI 58.9.0 available (npm global). MUST NOT operate Vercel resources without explicit user authorization (AGENTS.md)
- Wrangler: NOT installed. No Cloudflare CLI tooling local (deploy-cloudflare.yml runs in CI)
- Disk: C: 2.1 GB free (CONSTRAINED — reason external corpus lives on D:); D: 266 GB free
- Env vars present (names only, values never read): GITHUB_TOKEN, OPENCODE_* (client/server), OneDrive, EFC_*; no secrets printed or stored by this mission
- Working tree: `M opencode.json` (protected user change) + `?? .ai/audits/` (this mission) + `?? .pnpm-store/` (pre-existing cache noise)
