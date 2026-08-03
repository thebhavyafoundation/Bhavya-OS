# Search & Knowledge MCP Servers

**Research Date:** August 3, 2026
**Researcher:** Bhavya Foundation OS Project
**Category:** Search & Knowledge Management

---

## Brave Search MCP Server

**Category:** Search & Knowledge
**Source:** https://github.com/brave/brave-search-mcp-server
**Status:** Active (Official Brave)

### Capability Summary

Official MCP server integrating the Brave Search API. Provides comprehensive search capabilities including web search, local business search, image search, video search, news search, and AI-powered summarization. Supports both STDIO and HTTP transports with configurable result types and safety levels.

### Installation

```bash
# Via npx
npx -y @brave/brave-search-mcp-server

# With HTTP mode
BRAVE_API_KEY="your_key" npx -y brave-search-mcp --http
```

### Dependencies

- Brave Search API key (free tier: 2,000 queries/month)
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: ~20MB
- Network: Required for all searches

### Security Notes

- API key should be stored in environment variables
- Rate limiting on free tier
- Search queries sent to Brave servers
- No local data storage by default

### Maintenance

- Officially maintained by Brave
- Regular updates
- Active development
- Commercial service backing

### Offline Support

No - requires internet for all searches.

### Browser Automation Alternative

Not a replacement - search is different from browsing. Could combine with Playwright for search + browse workflows.

### CLI Alternative

- `curl` with Brave Search API
- `ddgr` (DuckDuckGo CLI)
- `googler` (Google CLI)

### Bhavya Score

85/100

### Recommendation

**Install** - Excellent privacy-focused search with generous free tier. Good alternative to Google-based solutions.

### Evidence

- Source: https://github.com/brave/brave-search-mcp-server
- Date: August 3, 2026
- Why it matters: Privacy-focused search with comprehensive result types and AI summarization.

---

## Exa MCP Server

**Category:** Search & Knowledge
**Source:** https://github.com/exa-labs/exa-mcp-server
**Status:** Active (Official Exa)

### Capability Summary

MCP server for Exa's neural search engine. Provides semantic search, content extraction, and automatic summarization. Uses embeddings for finding similar content and supports both URL and text-based search with high-quality results.

### Installation

```bash
npx -y exa-mcp-server
```

### Dependencies

- Exa API key
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: ~20MB
- Network: Required

### Security Notes

- API key management required
- Queries sent to Exa servers
- Review Exa's privacy policy
- Rate limiting applies

### Maintenance

- Officially maintained by Exa Labs
- Active development
- Regular updates

### Offline Support

No - requires internet.

### Browser Automation Alternative

Not applicable - different use case.

### CLI Alternative

- Exa API directly
- Traditional search engines

### Bhavya Score

80/100

### Recommendation

**Pilot** - Good for semantic search needs. Evaluate for specific use cases.

### Evidence

- Source: https://github.com/exa-labs/exa-mcp-server
- Date: August 3, 2026
- Why it matters: Neural search provides better semantic understanding than keyword search.

---

## Memory MCP Server

**Category:** Search & Knowledge
**Source:** https://github.com/modelcontextprotocol/servers/memory
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for persistent memory storage. Provides key-value storage that survives across conversations, enabling AI assistants to remember user preferences, project context, and decisions. Supports structured memory with tagging and retrieval.

### Installation

```bash
npx -y @modelcontextprotocol/server-memory
```

### Dependencies

- Node.js 18+
- Local file system for storage

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: Minimal (memory files)
- Network: None

### Security Notes

- Local storage only - no external data transmission
- File permissions control access
- Consider encryption for sensitive data
- No built-in access control

### Maintenance

- Officially maintained as part of MCP reference servers
- Stable and simple

### Offline Support

Yes - fully functional offline.

### Browser Automation Alternative

Not applicable - different use case.

### CLI Alternative

- File storage
- SQLite database
- JSON files

### Bhavya Score

85/100

### Recommendation

**Install** - Essential for AI assistants that need to maintain context across sessions.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Persistent memory enables AI assistants to learn and remember user preferences.

---

## Knowledge Graph MCP Server

**Category:** Search & Knowledge
**Source:** https://github.com/modelcontextprotocol/servers/knowledge-graph
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for knowledge graph operations. Enables AI assistants to query and manipulate knowledge graphs, perform entity relationship analysis, and execute graph-based queries. Useful for complex data relationships and semantic connections.

### Installation

```bash
npx -y @modelcontextprotocol/server-knowledge-graph
```

### Dependencies

- Node.js 18+
- Graph database (Neo4j, etc.)
- Network access (if using remote graph)

### Hardware Impact

- RAM: 64-128MB
- CPU: Moderate (graph queries)
- Disk: Depends on graph size
- Network: Required for remote graphs

### Security Notes

- Graph database access requires authentication
- Query injection protection needed
- Access control on graph operations
- Sensitive data may be stored in graph

### Maintenance

- Officially maintained as part of MCP reference servers
- Active development

### Offline Support

Limited - depends on graph database location.

### Browser Automation Alternative

Not applicable - different use case.

### CLI Alternative

- Cypher queries (Neo4j)
- GraphQL
- Gremlin

### Bhavya Score

75/100

### Recommendation

**Monitor** - Useful for complex data relationships but requires graph database infrastructure.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Knowledge graphs enable complex relationship queries for AI understanding.

---

## Tavily MCP Server

**Category:** Search & Knowledge
**Source:** https://github.com/tavily-ai/tavily-mcp
**Status:** Active (Official Tavily)

### Capability Summary

AI-optimized search MCP server from Tavily. Provides search results formatted for LLM consumption with automatic summarization, source attribution, and relevance scoring. Designed specifically for AI research workflows.

### Installation

```bash
npx -y @tavily/mcp-server
```

### Dependencies

- Tavily API key
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: ~20MB
- Network: Required

### Security Notes

- API key management required
- Queries sent to Tavily servers
- Review privacy policy
- Rate limiting applies

### Maintenance

- Officially maintained by Tavily
- Active development
- Regular updates

### Offline Support

No - requires internet.

### Browser Automation Alternative

Not applicable - different use case.

### CLI Alternative

- Tavily API directly
- Traditional search engines

### Bhavya Score

75/100

### Recommendation

**Pilot** - Good for AI-optimized search but evaluate against Brave Search.

### Evidence

- Source: https://github.com/tavily-ai/tavily-mcp
- Date: August 3, 2026
- Why it matters: Purpose-built for AI consumption with automatic summarization.

---

## Jina Reader MCP

**Category:** Search & Knowledge
**Source:** https://github.com/jina-ai/reader-mcp
**Status:** Active (Official Jina)

### Capability Summary

MCP server for converting URLs to markdown content. Uses Jina's Reader API to extract clean, readable content from web pages. Simple and focused on content extraction rather than full browser automation.

### Installation

```bash
npx -y @jina-ai/reader-mcp
```

### Dependencies

- Jina API key
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: ~20MB
- Network: Required

### Security Notes

- API key management required
- Content sent to Jina servers
- Review privacy policy
- Rate limiting applies

### Maintenance

- Officially maintained by Jina AI
- Regular updates

### Offline Support

No - requires internet.

### Browser Automation Alternative

Simpler than Playwright for content extraction but less capable.

### CLI Alternative

- `curl` with HTML parsing
- `pandoc` for HTML conversion
- BeautifulSoup

### Bhavya Score

70/100

### Recommendation

**Monitor** - Simple content extraction but limited compared to full browser automation.

### Evidence

- Source: https://github.com/jina-ai/reader-mcp
- Date: August 3, 2026
- Why it matters: Simple URL-to-markdown conversion for content extraction.

---

## Codebase Memory MCP

**Category:** Search & Knowledge
**Source:** https://github.com/deusdata/codebase-memory-mcp
**Status:** Active (Community - Popular)

### Capability Summary

MCP server for codebase understanding and memory. Indexes code repositories for semantic search, explains code structures, and maintains context about codebase architecture. 35,342 GitHub stars indicate strong community adoption.

### Installation

```bash
npx -y codebase-memory-mcp
```

### Dependencies

- Node.js 18+
- Git repository access
- Network for indexing (if using cloud features)

### Hardware Impact

- RAM: 128-512MB (depends on codebase size)
- CPU: Moderate (indexing)
- Disk: Depends on codebase size
- Network: Optional

### Security Notes

- Local code processing by default
- Cloud features may send code externally
- Review privacy settings
- Consider air-gapped mode for sensitive code

### Maintenance

- Community maintained
- Very active (35,342 stars)
- Regular updates
- Strong community support

### Offline Support

Limited - core features work offline but indexing may require network.

### Browser Automation Alternative

Not applicable - code analysis tool.

### CLI Alternative

- `ripgrep` for code search
- `ag` (The Silver Searcher)
- Language servers

### Bhavya Score

85/100

### Recommendation

**Pilot** - Excellent for codebase understanding but evaluate for security with sensitive code.

### Evidence

- Source: https://github.com/deusdata/codebase-memory-mcp
- Date: August 3, 2026
- Why it matters: Popular tool for AI-assisted code understanding and navigation.

---

## Context7 MCP

**Category:** Search & Knowledge
**Source:** https://github.com/upstash/context7
**Status:** Active (Official Context7)

### Capability Summary

MCP server for up-to-date documentation retrieval. Provides current documentation for programming libraries and frameworks, helping AI assistants avoid hallucination with accurate, version-specific information.

### Installation

```bash
npx -y @upstash/context7-mcp
```

### Dependencies

- Context7 API access
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: ~20MB
- Network: Required

### Security Notes

- Documentation queries sent to Context7
- No sensitive data in documentation queries
- Review service terms

### Maintenance

- Officially maintained by Upstash
- Regular updates
- Growing documentation coverage

### Offline Support

No - requires internet for documentation retrieval.

### Browser Automation Alternative

Not applicable - documentation retrieval tool.

### CLI Alternative

- Official documentation websites
- Package documentation
- Man pages

### Bhavya Score

80/100

### Recommendation

**Install** - Valuable for ensuring AI assistants use current, accurate documentation.

### Evidence

- Source: https://github.com/upstash/context7
- Date: August 3, 2026
- Why it matters: Prevents hallucination by providing accurate, current documentation.

---

## Comparison Matrix

| MCP Server      | Search Type        | Cost      | Privacy  | Offline | Recommendation |
| --------------- | ------------------ | --------- | -------- | ------- | -------------- |
| Brave Search    | Web search         | Free/Paid | High     | No      | Install        |
| Exa             | Semantic search    | Paid      | Medium   | No      | Pilot          |
| Memory          | Key-value          | Free      | High     | Yes     | Install        |
| Knowledge Graph | Graph queries      | Free      | Variable | Limited | Monitor        |
| Tavily          | AI search          | Paid      | Medium   | No      | Pilot          |
| Jina Reader     | Content extraction | Free/Paid | Medium   | No      | Monitor        |
| Codebase Memory | Code search        | Free      | High     | Limited | Pilot          |
| Context7        | Documentation      | Free      | High     | No      | Install        |

## Priority for Bhavya Foundation

1. **Must Install:** Brave Search MCP, Memory MCP, Context7 MCP
2. **Should Install:** Codebase Memory MCP
3. **Evaluate:** Exa MCP, Tavily MCP (for specific search needs)
4. **Monitor:** Knowledge Graph MCP, Jina Reader MCP

## Search Strategy Recommendations

### For General Web Search

- **Primary:** Brave Search MCP (privacy-focused, generous free tier)
- **Backup:** Exa MCP (for semantic search needs)

### For Code Understanding

- **Primary:** Codebase Memory MCP
- **Backup:** Git MCP for repository operations

### For Documentation

- **Primary:** Context7 MCP (current documentation)
- **Secondary:** Direct documentation access

### For AI Memory

- **Primary:** Memory MCP (simple key-value)
- **Advanced:** Knowledge Graph MCP (complex relationships)

## Security Considerations

1. **API key management** - use environment variables, rotate regularly
2. **Query privacy** - be aware of what data is sent to search services
3. **Rate limiting** - respect service limits to avoid blocks
4. **Local alternatives** - consider local search for sensitive data
5. **Audit logging** - track search queries for compliance

---

_Last Updated: August 3, 2026_
_Source: Official MCP repositories, Brave, Exa, and community documentation_
