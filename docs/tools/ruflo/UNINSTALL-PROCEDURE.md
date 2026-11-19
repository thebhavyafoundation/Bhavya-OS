# Ruflo — Uninstall Procedure

Ruflo is installed **only** in the remote sandbox. There is nothing to uninstall
from the laptop or from the application.

## 1. Stop and remove the remote sandbox

```bash
# list first
sandbox ls --scope bhavya-foundation --project bhavya-os

# remove (destructive — confirm the exact name first)
sandbox rm bhavya-ruflo --scope bhavya-foundation --project bhavya-os
sandbox rm bhavya-ruflo-restored --scope bhavya-foundation --project bhavya-os
```

This destroys the sandbox filesystem, including the Ruflo install, the Ollama
model store and any task artifacts. Snapshots are separate objects; remove them
too if they should not persist:

```bash
sandbox snapshots rm snap_<id> --scope bhavya-foundation --project bhavya-os
```

## 2. Remove the repository-side additions

The following paths exist only for Ruflo:

```
scripts/ruflo/bootstrap-remote.sh
scripts/ruflo/check-remote.sh
docs/tools/ruflo/
```

They are inert documentation and scripts. Removing them has no runtime effect.

## 3. Remove the agent-side MCP entry (if one was added)

If the Ruflo MCP server was registered in an OpenCode config, remove the
`ruflo` entry from it. The project config is `opencode.json`; a user-scoped entry
would be in `~/.config/opencode/opencode.jsonc`.

## 4. Remove the local token file (if one was created)

The MCP bearer token is stored outside the repository, by convention at
`~/.config/opencode/ruflo-mcp-token`. Delete that file. It is inert without the
sandbox, and the sandbox's own copy lives at
`/vercel/.claude-flow/mcp-http-token`.

## 5. Verify removal

```bash
# no sandbox remains
sandbox ls --scope bhavya-foundation --project bhavya-os

# no tracked application file referenced Ruflo
git ls-files | grep -i ruflo   # expect only scripts/ruflo/* and docs/tools/ruflo/*

# no Ruflo dependency in the app
git grep -n "ruflo" -- package.json pnpm-lock.yaml apps packages || echo "clean"
```

## 6. What is NOT affected

Uninstalling Ruflo does not affect the application, the production deployment,
the curriculum content, the design system, CI, or the preview pipeline. Ruflo
was an optional coordination layer and never a dependency of the product.
