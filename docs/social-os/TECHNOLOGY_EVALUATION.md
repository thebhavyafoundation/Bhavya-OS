# Social OS — Technology Evaluation

## Candidate Evaluation

### Candidate 1: Postiz

| Criterion                | Score       | Evidence                                                                                                                                  |
| ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Open-source maturity     | 9/10        | 29,600+ GitHub stars, 5,300+ forks, 193 releases, since Sept 2024                                                                         |
| Long-term sustainability | 9/10        | $1M ARR, Product Hunt #1 (May 2026), active development                                                                                   |
| Community activity       | 9/10        | 5,300+ forks, active Discord, many community guides                                                                                       |
| Documentation quality    | 8/10        | Comprehensive docs at docs.postiz.com, API docs, MCP docs                                                                                 |
| MCP readiness            | 9/10        | Official MCP server (remote HTTP), agent CLI, n8n/Make integrations                                                                       |
| Automation capability    | 9/10        | Public REST API, webhooks, MCP, n8n, Make.com, agent CLI                                                                                  |
| Platform coverage        | 10/10       | 30+ platforms (X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Reddit, Threads, Bluesky, Mastodon, Discord, Telegram, Pinterest, etc.) |
| Integration complexity   | 7/10        | Docker Compose, PostgreSQL, Redis, Temporal (moderate complexity)                                                                         |
| Self-hosting             | 9/10        | Full Docker support, no feature limits, AGPL-3.0                                                                                          |
| Vendor lock-in           | 8/10        | AGPL, self-hosted, no lock-in, standard OAuth                                                                                             |
| Educational suitability  | 7/10        | General purpose, not education-specific                                                                                                   |
| Maintenance burden       | 6/10        | Requires Docker, PostgreSQL, Redis, Temporal                                                                                              |
| Cost                     | 9/10        | Free self-hosted, $29/mo cloud                                                                                                            |
| Future roadmap           | 9/10        | Active development, agent-focused, MCP-first                                                                                              |
| **Total**                | **112/140** |                                                                                                                                           |

### Candidate 2: TryPost

| Criterion                | Score      | Evidence                                                                                                                   |
| ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Open-source maturity     | 5/10       | 466 stars, 112 forks, since Jan 2026 (7 months old)                                                                        |
| Long-term sustainability | 6/10       | Active but young, single maintainer                                                                                        |
| Community activity       | 5/10       | 466 stars, small community                                                                                                 |
| Documentation quality    | 7/10       | Good docs at docs.trypost.it, MCP docs                                                                                     |
| MCP readiness            | 8/10       | Built-in MCP server at /mcp/trypost                                                                                        |
| Automation capability    | 7/10       | REST API, MCP                                                                                                              |
| Platform coverage        | 7/10       | 12 platforms (Instagram, Facebook, LinkedIn, X, TikTok, YouTube, Pinterest, Threads, Bluesky, Mastodon, Telegram, Discord) |
| Integration complexity   | 7/10       | Docker, Laravel, PostgreSQL, Redis                                                                                         |
| Self-hosting             | 8/10       | Docker support, no feature limits                                                                                          |
| Vendor lock-in           | 7/10       | AGPL, self-hosted                                                                                                          |
| Educational suitability  | 6/10       | General purpose                                                                                                            |
| Maintenance burden       | 6/10       | Laravel stack                                                                                                              |
| Cost                     | 9/10       | Free self-hosted                                                                                                           |
| Future roadmap           | 7/10       | Active development                                                                                                         |
| **Total**                | **92/140** |                                                                                                                            |

### Candidate 3: Upload-Post MCP

| Criterion                | Score      | Evidence                                               |
| ------------------------ | ---------- | ------------------------------------------------------ |
| Open-source maturity     | 3/10       | 3 stars, 2 forks, since May 2026                       |
| Long-term sustainability | 4/10       | New, small team                                        |
| Community activity       | 2/10       | 3 stars                                                |
| Documentation quality    | 7/10       | Good docs                                              |
| MCP readiness            | 10/10      | Pure MCP server, 40+ tools                             |
| Automation capability    | 8/10       | 40 tools, API                                          |
| Platform coverage        | 8/10       | 13+ platforms                                          |
| Integration complexity   | 9/10       | Just add MCP config                                    |
| Self-hosting             | 6/10       | MCP server self-hostable, requires Upload-Post account |
| Vendor lock-in           | 4/10       | Requires Upload-Post API key, hosted service           |
| Educational suitability  | 5/10       | General purpose                                        |
| Maintenance burden       | 9/10       | Stateless proxy                                        |
| Cost                     | 7/10       | Free tier, paid plans                                  |
| Future roadmap           | 5/10       | Small team                                             |
| **Total**                | **84/140** |                                                        |

### Candidate 4: PostSyncer (Additional)

| Criterion                | Score      | Evidence                       |
| ------------------------ | ---------- | ------------------------------ |
| Open-source maturity     | 2/10       | Hosted service, no public repo |
| Long-term sustainability | 5/10       | Hosted service                 |
| Community activity       | 3/10       | Limited community              |
| Documentation quality    | 6/10       | Basic docs                     |
| MCP readiness            | 9/10       | 40+ tools                      |
| Automation capability    | 7/10       | MCP tools                      |
| Platform coverage        | 8/10       | 10+ platforms                  |
| Integration complexity   | 9/10       | Remote MCP server              |
| Self-hosting             | 2/10       | Hosted only                    |
| Vendor lock-in           | 3/10       | Hosted service                 |
| Educational suitability  | 5/10       | General purpose                |
| Maintenance burden       | 10/10      | No maintenance (hosted)        |
| Cost                     | 6/10       | Paid service                   |
| Future roadmap           | 5/10       | Unknown                        |
| **Total**                | **80/140** |                                |

## Comparison Matrix

| Criterion   | Postiz  | TryPost | Upload-Post | PostSyncer  |
| ----------- | ------- | ------- | ----------- | ----------- |
| Stars       | 29,600  | 466     | 3           | N/A         |
| Platforms   | 30+     | 12      | 13+         | 10+         |
| MCP         | Yes     | Yes     | Yes         | Yes         |
| Self-hosted | Yes     | Yes     | Partial     | No          |
| License     | AGPL    | AGPL    | MIT         | Proprietary |
| **Total**   | **112** | **92**  | **84**      | **80**      |

## Recommendation

**Postiz is the clear winner** with a score of 112/140.

### Why Postiz

1. **Community trust.** 29,600 stars证明社区信任。
2. **Platform coverage.** 30+ platforms覆盖所有需求。
3. **MCP readiness.** Official MCP server + agent CLI.
4. **Self-hosted.** Docker部署，无功能限制。
5. **Compliance.** Official OAuth，不存储用户token。
6. **Sustainability.** $1M ARR，Product Hunt #1，长期可行。
7. **Agent-first.** Built for the agentic era。

### Why Not Others

| Candidate   | Rejection Reason                                      |
| ----------- | ----------------------------------------------------- |
| TryPost     | Too young (7 months), only 466 stars, 12 platforms    |
| Upload-Post | Requires hosted API key, vendor lock-in, only 3 stars |
| PostSyncer  | Hosted only, no self-hosting, proprietary             |
