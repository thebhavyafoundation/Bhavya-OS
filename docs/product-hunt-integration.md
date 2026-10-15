# Product Hunt Integration (ph-proxy)

**Created:** 2026-09-30
**Status:** ACTIVE — code complete, deploy + secrets are human-gated
**Owner:** Bhavya Foundation Engineering
**Upstream API:** https://api.producthunt.com/v2/docs

---

## 1. Overview

AI agents and Bhavya apps query Product Hunt (new tools, projects, trends) through a
small Cloudflare Worker (`ph-proxy`) that owns the OAuth credentials. Callers send
plain GraphQL documents; the Worker attaches the bearer token server-side.

| Piece               | Location                           | Role                                         |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| Worker              | `packages/ph-proxy/`               | OAuth client-only token + GraphQL forwarding |
| Typed client helper | `packages/product-hunt-client/`    | `productHuntQuery()` for agents and apps     |
| This document       | `docs/product-hunt-integration.md` | Setup, examples, agent patterns              |

Free-plan compatible: Cloudflare Workers free tier, GitHub Free, Product Hunt API
(read-only `public` scope at no cost).

---

## 2. Architecture

```text
   AI agent / app code                      ph-proxy Worker                      Product Hunt
   ───────────────────                      ───────────────                      ────────────
   @bhavya/product-hunt-client
   productHuntQuery(query, variables)
             │
             │ 1. POST /graphql
             │    { query, variables }          getClientToken(env)
             │    NO credentials ─────────────▶ │   POST /v2/oauth/token
             │    in the caller                 │   { client_id, client_secret,
             │                                  │     grant_type: client_credentials,
             │                                  │     scope: public }   ────────────▶ │
             │                                  │   ◀──── access_token ────────────── │
             │                                  │   (cached per isolate)
             │                                  │
             │                                  │ 2. POST /v2/api/graphql
             │                                  │    Authorization: Bearer <token> ──▶ │
             │                                  │    { query, variables }             │
             │                                  │ ◀── GraphQL JSON + rate-limit hdrs ──│
             │ 3. GraphQL JSON response         │
             │ ◀────────────────────────────────│
             │
             └──▶ agent summarizes results for the user
```

Endpoints:

| Endpoint                  | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `POST /graphql`           | Forward `{ query, variables? }` to PH API |
| `GET /` or `GET /healthz` | Health check (no auth)                    |
| `OPTIONS *`               | CORS preflight                            |

Worker URL (after deploy): `https://ph-proxy.thebhavyafoundation.workers.dev/graphql`
(workers.dev URLs are `<worker>.<account-subdomain>.workers.dev`; if the deployed URL
differs, update `PH_PROXY_URL` in `packages/product-hunt-client/src/index.ts` — one line).

---

## 3. Security model

```text
Secrets (PH_CLIENT_ID, PH_CLIENT_SECRET, optional PH_PROXY_TOKEN)
    │  live ONLY as Cloudflare Worker secrets (encrypted at rest)
    │  never in the repo, never in logs, never in client code
    ▼
ph-proxy Worker ── bearer token ──▶ Product Hunt API
    ▲
    │ plain GraphQL (no credentials)
AI agent / app
```

1. **Secrets are Worker-only.** `PH_CLIENT_ID` and `PH_CLIENT_SECRET` exist as
   Cloudflare Worker secrets. Nothing secret is committed to the repository.
2. **Agents hold no credentials.** `@bhavya/product-hunt-client` contains only the
   public Worker URL. Compromising agent code or an app bundle exposes no Product
   Hunt credentials.
3. **Client-only OAuth, `public` scope.** The token can read public data only — it
   cannot act as any Product Hunt user, post, vote, or mutate anything.
4. **Optional caller gate.** If the `PH_PROXY_TOKEN` secret is set, callers must send
   `Authorization: Bearer <PH_PROXY_TOKEN>` or receive `401`. Recommended once the
   Worker is live, so strangers cannot spend your rate limit. If unset, the proxy is
   open (public data only).
5. **CORS is open (`*`)** because the data is public; combine with `PH_PROXY_TOKEN`
   if you want abuse protection. Browser callers pass the token via the helper's
   `proxyToken` option only when you enable the gate.
6. **Upstream errors are not echoed** with credentials — the Worker returns status
   codes and generic messages only.
7. **Local dev secrets** go in `packages/ph-proxy/.dev.vars` (gitignored — see root
   `.gitignore`). Never put real secrets in `wrangler.json`.

Product Hunt asks that integrations attribute Product Hunt with a link
(https://www.producthunt.com) — do so in any public-facing surface.

---

## 4. Step-by-step setup

### 4.1 Create a Product Hunt application

1. Sign in to Product Hunt (any account works).
2. Open the **API dashboard**: https://www.producthunt.com/v2/oauth/applications
3. Click **New application** (or "Create new application").
4. Fill the form:
   - **Name:** e.g. `Bhavya OS ph-proxy`
   - **Description:** e.g. `Read-only proxy for Bhavya Foundation AI agents`
   - **Redirect URI / Website:** required by the form but unused by client-only
     OAuth — enter `https://ph-proxy.thebhavyafoundation.workers.dev/`
5. Save, then copy from the application page:
   - **API key / Client ID** → `PH_CLIENT_ID`
   - **API secret / Client secret / Password** → `PH_CLIENT_SECRET`
6. Store them somewhere safe (password manager). They are entered only into
   Cloudflare in step 4.3 — never into the repo.

No scopes need requesting: apps default to read-only `public` scope.

### 4.2 Deploy the Worker

From the repository root (this machine is only the control center; wrangler talks
directly to Cloudflare):

```bash
pnpm install
pnpm --filter @bhavya/ph-proxy typecheck

# one-time Cloudflare login (opens a browser)
pnpm --filter @bhavya/ph-proxy exec wrangler login

# deploy  (note: "run deploy" — bare `pnpm deploy` is a different pnpm command)
pnpm --filter @bhavya/ph-proxy run deploy
```

Wrangler prints the live URL, expected to be
`https://ph-proxy.thebhavyafoundation.workers.dev`.

Alternative: Cloudflare dashboard → **Workers & Pages** → create a worker and paste
`packages/ph-proxy/src/index.ts` (it is dependency-free TypeScript). The wrangler CLI
path above is preferred and reproducible.

Deployment is a **human-gated action** (AGENTS.md §7) — run it yourself or explicitly
authorize the agent.

### 4.3 Set the secrets

**Option A — wrangler CLI (run locally, prompts for each value):**

```bash
pnpm --filter @bhavya/ph-proxy exec wrangler secret put PH_CLIENT_ID
pnpm --filter @bhavya/ph-proxy exec wrangler secret put PH_CLIENT_SECRET
# optional caller gate:
pnpm --filter @bhavya/ph-proxy exec wrangler secret put PH_PROXY_TOKEN
```

**Option B — Cloudflare dashboard:**
Workers & Pages → `ph-proxy` → **Settings → Variables and Secrets** → _Add_ →
type **Secret** → name/value as above → _Deploy_ (or Save).

`PH_CLIENT_ID` and `PH_CLIENT_SECRET` are required. `PH_PROXY_TOKEN` is optional
(recommended; any long random string, e.g. a 32-byte hex token).

### 4.4 Verify

Health check (bash):

```bash
curl https://ph-proxy.thebhavyafoundation.workers.dev/healthz
```

Query through the proxy (bash):

```bash
curl -X POST https://ph-proxy.thebhavyafoundation.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { posts(first: 2, order: NEWEST) { edges { node { id name } } } }"}'
```

PowerShell equivalent:

```powershell
Invoke-RestMethod -Method Post `
  -Uri https://ph-proxy.thebhavyafoundation.workers.dev/graphql `
  -ContentType "application/json" `
  -Body '{"query":"query { posts(first: 2, order: NEWEST) { edges { node { id name } } } }"}'
```

Expect `{"data":{"posts":{"edges":[...]}}}`. If the URL 404s, confirm the actual
workers.dev URL in the Cloudflare dashboard and fix `PH_PROXY_URL` in
`packages/product-hunt-client/src/index.ts`.

### 4.5 Local development (optional)

Create `packages/ph-proxy/.dev.vars` (gitignored):

```bash
PH_CLIENT_ID=your-client-id
PH_CLIENT_SECRET=your-client-secret
```

Then:

```bash
pnpm --filter @bhavya/ph-proxy dev   # wrangler dev on http://localhost:8787
```

Point the helper at it: `productHuntQuery(q, v, { proxyUrl: "http://localhost:8787/graphql" })`.

---

## 5. Using the helper

```ts
import { productHuntQuery } from "@bhavya/product-hunt-client";

interface RecentPostsData {
  posts: {
    edges: Array<{
      node: { id: string; name: string; tagline: string; votesCount: number };
    }>;
  };
}

const result = await productHuntQuery<RecentPostsData>(
  `query { posts(first: 10, order: NEWEST) {
      edges { node { id name tagline votesCount } }
  } }`,
);

if (result.errors?.length) {
  console.error(result.errors.map((e) => e.message));
} else {
  console.log(result.data?.posts.edges.map((e) => e.node.name));
}
```

API notes:

- `productHuntQuery(query, variables?, options?)` — throws `ProductHuntProxyError`
  on network/HTTP failures; GraphQL errors arrive normally in `result.errors`
  (always check them before reading `data`).
- `options.proxyUrl` — override endpoint (local dev, staging).
- `options.proxyToken` — only if you enabled the `PH_PROXY_TOKEN` gate.
- Never add Product Hunt credentials to this client; the Worker owns them.

---

## 6. Example GraphQL queries

All three run as-is through `POST /graphql` (verified against the v2 schema:
`posts`, `post`, `PostsOrder`, `Post.topics`).

### 6.1 Recent posts — 10, newest first

```graphql
query RecentPosts {
  posts(first: 10, order: NEWEST) {
    totalCount
    edges {
      node {
        id
        name
        tagline
        votesCount
        createdAt
        url
        topics(first: 3) {
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    }
  }
}
```

### 6.2 Posts filtered by topic and date

`topic` takes a **slug** (e.g. `artificial-intelligence`), `postedAfter` an ISO-8601
`DateTime`. Note: `postedAfter` defaults to one month ago if omitted.

```graphql
query PostsByTopicSince($topic: String!, $since: DateTime!) {
  posts(first: 10, order: NEWEST, topic: $topic, postedAfter: $since) {
    totalCount
    edges {
      node {
        id
        name
        tagline
        votesCount
        createdAt
        url
        website
      }
    }
  }
}
```

```json
{
  "variables": {
    "topic": "artificial-intelligence",
    "since": "2026-09-01T00:00:00Z"
  }
}
```

`order` accepts `NEWEST`, `RANKING`, `VOTES`, `FEATURED_AT`.

### 6.3 Single post by ID

```graphql
query PostById($id: ID!) {
  post(id: $id) {
    id
    name
    tagline
    description
    votesCount
    commentsCount
    createdAt
    url
    website
    topics(first: 5) {
      edges {
        node {
          name
          slug
        }
      }
    }
    makers {
      name
      username
      url
    }
  }
}
```

```json
{ "variables": { "id": "12345" } }
```

(`post(slug: "...")` also works.)

---

## 7. AI agent usage pattern

Pattern: **natural language → GraphQL → summarize.** The agent never handles
credentials — it only chooses a query.

```text
User:     "What AI tools launched on Product Hunt this week?"

Agent:
  1. Map intent → GraphQL
       posts(topic: "artificial-intelligence",
             postedAfter: <now - 7 days>,
             order: NEWEST, first: 10)
  2. Call productHuntQuery(query, { since })          ← no credentials
  3. If result.errors → report/repair query, do NOT summarize stale data
  4. Summarize data.posts.edges → bullets:

     This week's AI launches on Product Hunt:
     • Tool A — <tagline> (142 votes)
     • Tool B — <tagline> (98 votes)
       ...
     Sources: producthunt.com links per item.
```

Worked TypeScript (agent step 2–4):

```ts
import { productHuntQuery } from "@bhavya/product-hunt-client";

const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

const { data, errors } = await productHuntQuery<{
  posts: {
    edges: Array<{
      node: { name: string; tagline: string; votesCount: number; url: string };
    }>;
  };
}>(
  `query ($since: DateTime!) {
     posts(first: 10, order: NEWEST, topic: "artificial-intelligence", postedAfter: $since) {
       edges { node { name tagline votesCount url } }
     }
   }`,
  { since },
);

if (errors?.length) throw new Error(errors.map((e) => e.message).join("; "));

const summary = data!.posts.edges
  .map(
    ({ node }) =>
      `- ${node.name} — ${node.tagline} (${node.votesCount} votes) ${node.url}`,
  )
  .join("\n");
```

Agent guidance:

- Prefer **small `first:` values** (≤ 10) — the API budget is complexity-based.
- Always check `errors` before trusting `data`.
- Cite Product Hunt links in outputs (attribution).
- Treat HTTP 429 as "back off and retry later", never as an empty result.

---

## 8. Rate limits and fair use

From the official docs (https://api.producthunt.com/v2/docs/rate_limits/headers):

| Limit                   | Value                                     |
| ----------------------- | ----------------------------------------- |
| GraphQL endpoint        | 6250 **complexity points** per 15 minutes |
| Other `/v2/*` endpoints | up to 450 requests per 15 minutes         |
| On overflow             | HTTP 429 until the window resets          |

The Worker forwards Product Hunt's rate-limit headers on every response:

- `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Reset`

Complexity scales with requested fields and page size — request only the fields you
use. The token endpoint is cached per isolate, so token fetches are rare. Product
Hunt reserves the right to rate-limit unfair use; the API is non-commercial by
default (contact hello@producthunt.com for business use).

---

## 9. OpenCode + Cloudflare MCP compatibility

- **No `opencode.json` changes.** The existing remote Cloudflare MCP servers
  (`cloudflare`, `cloudflare-bindings`, `cloudflare-builds`,
  `cloudflare-observability`, `cloudflare-docs`) already cover inspecting the
  Worker, its builds, and its logs. No local MCP config is added.
- **Agent-deployable, human-gated.** An agent with authorization can run the deploy
  and secret commands in §4; per AGENTS.md §7 deploy and secrets remain human-gated.
- **Helper is plain TypeScript** — usable from apps, scripts, and agents without any
  MCP dependency.

---

## 10. Files in this integration

| File                                         | Action | Purpose                            |
| -------------------------------------------- | ------ | ---------------------------------- |
| `packages/ph-proxy/src/index.ts`             | NEW    | Worker: token + GraphQL forward    |
| `packages/ph-proxy/wrangler.json`            | NEW    | Worker config (name `ph-proxy`)    |
| `packages/ph-proxy/package.json`             | NEW    | `@bhavya/ph-proxy`                 |
| `packages/ph-proxy/tsconfig.json`            | NEW    | Workers typecheck                  |
| `packages/product-hunt-client/src/index.ts`  | NEW    | `productHuntQuery()` helper        |
| `packages/product-hunt-client/package.json`  | NEW    | `@bhavya/product-hunt-client`      |
| `packages/product-hunt-client/tsconfig.json` | NEW    | Typecheck                          |
| `docs/product-hunt-integration.md`           | NEW    | This document                      |
| `packages/CONTEXT.md`                        | EDIT   | Register the two packages          |
| `.gitignore`                                 | EDIT   | Ignore `.dev.vars` (local secrets) |

Related authorities: `AGENTS.md` (execution contract), `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`
(canonical sources), `packages/CONTEXT.md` (package registry).
