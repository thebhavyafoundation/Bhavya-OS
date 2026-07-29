# Agent platform

`@bhavya/agent-platform` is the first vertical slice of the autonomous agent
platform. Its research workflow is a LangGraph graph:

`plan -> gather (Crawl4AI) -> synthesize (OmniRoute) -> persist (Qdrant + Supabase) -> n8n notification`

The graph accepts ports rather than constructing provider clients internally.
This keeps external side effects explicit and makes OpenHands, Playwright,
Context7, GitHub MCP, Docling, and Aider approval-gated host integrations.

Required runtime configuration for the HTTP adapters:

- `OMNIROUTE_URL` and optional `OMNIROUTE_API_KEY`
- `CRAWL4AI_URL`
- `QDRANT_URL`, optional `QDRANT_API_KEY`, and optional `QDRANT_COLLECTION`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- optional `N8N_AGENT_WEBHOOK_URL`

The Supabase migration lives at
`packages/agent-platform/supabase/migrations/20260728000000_agent_research.sql`.
Run it through the Supabase migration workflow; do not apply it to production
without the normal environment approval.
