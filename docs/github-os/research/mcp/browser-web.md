# Browser & Web MCP Servers

**Research Date:** August 3, 2026
**Researcher:** Bhavya Foundation OS Project
**Category:** Browser & Web Automation

---

## Playwright MCP Server

**Category:** Browser & Web
**Source:** https://github.com/microsoft/playwright-mcp
**Status:** Active (Official Microsoft)

### Capability Summary

Microsoft's official MCP server for browser automation using Playwright. Provides LLMs with the ability to interact with web pages through structured accessibility snapshots, bypassing the need for screenshots or vision models. Supports Chromium, Firefox, and WebKit browsers with headless and headed modes.

### Installation

```bash
# Via npx (recommended)
npx @playwright/mcp@latest

# In Claude Code
claude mcp add playwright npx @playwright/mcp@latest

# Headless mode
npx @playwright/mcp@latest --headless

# Specific browser
npx @playwright/mcp@latest --browser=firefox
```

### Dependencies

- Node.js 18+
- Playwright browsers (auto-installed)
- Chromium, Firefox, or WebKit

### Hardware Impact

- RAM: 200-500MB (browser instance)
- CPU: Moderate (browser rendering)
- Disk: ~500MB (browser binaries)
- Network: Required for initial browser download

### Security Notes

- Uses accessibility tree instead of screenshots (more secure, less token cost)
- Browser runs in sandboxed mode by default
- Persistent profiles available for session continuity
- Extension mode for Chrome/Edge integration
- Network interception capabilities for security testing

### Maintenance

- Actively maintained by Microsoft
- Weekly updates aligned with Playwright releases
- Version 0.0.78 as of July 2026
- Extensive documentation at playwright.dev

### Offline Support

Limited - browser can run offline but most web content requires internet.

### Browser Automation Alternative

This IS the browser automation MCP - the gold standard.

### CLI Alternative

- Playwright CLI directly
- Selenium WebDriver
- Puppeteer CLI

### Bhavya Score

95/100

### Recommendation

**Install** - The definitive browser automation MCP. Accessibility tree approach is faster, cheaper, and more reliable than vision-based alternatives.

### Evidence

- Source: https://github.com/microsoft/playwright-mcp
- Date: August 3, 2026
- Why it matters: Microsoft-backed, accessibility-first approach makes it the most reliable browser automation option.

---

## Puppeteer MCP Server

**Category:** Browser & Web
**Source:** https://github.com/modelcontextprotocol/servers/puppeteer
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for Chrome/Chromium automation via Puppeteer. Provides navigation, screenshots, JavaScript execution, PDF generation, and form interaction. Lighter weight than Playwright but limited to Chromium-based browsers.

### Installation

```bash
npx -y @modelcontextprotocol/server-puppeteer
```

### Dependencies

- Node.js 18+
- Puppeteer (auto-installs Chromium)
- Chrome or Chromium browser

### Hardware Impact

- RAM: 150-400MB (browser instance)
- CPU: Moderate
- Disk: ~300MB (Chromium binary)
- Network: Required for initial download

### Security Notes

- Runs in headless mode by default
- Can execute arbitrary JavaScript in browser context
- Consider sandboxing for untrusted content
- No built-in access control on browser operations

### Maintenance

- Officially maintained as part of MCP reference servers
- Stable but less actively developed than Playwright
- Puppeteer itself is in maintenance mode at Google

### Offline Support

Limited - browser can run offline but web content requires internet.

### Browser Automation Alternative

This IS a browser automation MCP, but Playwright is preferred.

### CLI Alternative

- Puppeteer CLI
- Playwright CLI (recommended)
- Chrome DevTools Protocol directly

### Bhavya Score

70/100

### Recommendation

**Monitor** - Functional but Playwright is superior. Only use if specifically required for Chromium-only workflows.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Lighter alternative to Playwright but with less active development and browser support.

---

## Fetch MCP Server

**Category:** Browser & Web
**Source:** https://github.com/modelcontextprotocol/servers/fetch
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for HTTP fetching and web content retrieval. Provides structured access to web pages, APIs, and resources without full browser automation. Supports HTML-to-markdown conversion and basic content extraction.

### Installation

```bash
npx -y @modelcontextprotocol/server-fetch
```

### Dependencies

- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: Minimal
- Network: Required for all operations

### Security Notes

- No browser sandboxing - direct HTTP requests
- Consider rate limiting for production use
- Validate URLs before fetching
- Be aware of SSRF risks with internal URLs

### Maintenance

- Officially maintained as part of MCP reference servers
- Simple and stable

### Offline Support

No - requires network access for all operations.

### Browser Automation Alternative

Not a replacement - fetch is simpler but cannot execute JavaScript or interact with dynamic content.

### CLI Alternative

- `curl` or `wget`
- HTTP clients (Postman, Insomnia)
- Browser developer tools

### Bhavya Score

75/100

### Recommendation

**Pilot** - Useful for simple content retrieval but limited compared to full browser automation.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Lightweight alternative to full browser automation for simple HTTP operations.

---

## Firecrawl MCP Server

**Category:** Browser & Web
**Source:** https://github.com/mendableai/firecrawl-mcp-server
**Status:** Active (Community - Popular)

### Capability Summary

Web scraping MCP server with JavaScript rendering, crawling, and content extraction. Supports structured data extraction, screenshots, and batch processing. Popular for AI-powered web research and data collection workflows.

### Installation

```bash
npx -y @mendable/firecrawl-mcp
```

### Dependencies

- Firecrawl API key (free tier available)
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal (processing is server-side)
- Disk: Minimal
- Network: Required for all operations

### Security Notes

- Uses external Firecrawl API - data sent to third party
- API key management required
- Rate limiting on free tier
- Review Firecrawl's privacy policy for data handling

### Maintenance

- Actively maintained by Mendable AI
- 7,042 GitHub stars
- Regular updates and new features
- Commercial service backing

### Offline Support

No - requires Firecrawl API access.

### Browser Automation Alternative

More powerful for scraping but requires API. Playwright is better for interactive automation.

### CLI Alternative

- `curl` with manual parsing
- Scrapy framework
- Beautiful Soup (Python)

### Bhavya Score

80/100

### Recommendation

**Pilot** - Excellent for web scraping use cases. Evaluate data privacy implications for sensitive projects.

### Evidence

- Source: https://github.com/mendableai/firecrawl-mcp-server
- Date: August 3, 2026
- Why it matters: Purpose-built for web scraping with AI-friendly output formats.

---

## Chrome DevTools MCP

**Category:** Browser & Web
**Source:** https://github.com/chromedevtools/chrome-devtools-mcp
**Status:** Active (Official Chrome DevTools)

### Capability Summary

AI-driven control of live Chrome via Chrome DevTools Protocol. Enables browser automation, debugging, performance analysis, and network monitoring. Provides deeper access to browser internals than Playwright or Puppeteer.

### Installation

```bash
npx -y chrome-devtools-mcp
```

### Dependencies

- Chrome or Chromium browser
- Node.js 18+
- Chrome DevTools Protocol access

### Hardware Impact

- RAM: 200-500MB (browser + DevTools)
- CPU: Moderate to High
- Disk: ~200MB
- Network: Optional (for remote debugging)

### Security Notes

- Requires Chrome with remote debugging enabled
- Full browser control - treat as privileged access
- Network interception capabilities
- Memory and performance profiling access

### Maintenance

- Actively maintained by Chrome DevTools team
- 47,598 GitHub stars
- Regular updates aligned with Chrome releases

### Offline Support

Limited - browser can run offline but debugging features may require internet.

### Browser Automation Alternative

More powerful than Playwright for debugging but more complex.

### CLI Alternative

- Chrome DevTools Protocol directly
- Lighthouse CLI
- WebPageTest

### Bhavya Score

85/100

### Recommendation

**Pilot** - Excellent for performance debugging and advanced browser analysis. More complex than Playwright for simple automation.

### Evidence

- Source: https://github.com/chromedevtools/chrome-devtools-mcp
- Date: August 3, 2026
- Why it matters: Unparalleled access to Chrome internals for performance analysis and debugging.

---

## Browserbase MCP

**Category:** Browser & Web
**Source:** https://github.com/browserbase/mcp-server-browserbase
**Status:** Active (Commercial)

### Capability Summary

Cloud browser automation via Browserbase platform. Provides scalable browser sessions for AI agents with built-in session management, proxy support, and enterprise-grade infrastructure.

### Installation

```bash
npx -y @browserbase/mcp-server
```

### Dependencies

- Browserbase API key
- Node.js 18+
- Account on browserbase.com

### Hardware Impact

- RAM: 32-64MB (local)
- CPU: Minimal (processing is cloud-based)
- Disk: Minimal
- Network: Required for all operations

### Security Notes

- Cloud-based - data sent to Browserbase
- Enterprise security features available
- Session isolation between users
- API key management required

### Maintenance

- Commercially maintained
- Active development
- Enterprise support available

### Offline Support

No - requires cloud connection.

### Browser Automation Alternative

Cloud alternative to local Playwright/Puppeteer with better scaling.

### CLI Alternative

- Playwright CLI (local)
- Puppeteer CLI (local)
- Browserbase CLI

### Bhavya Score

70/100

### Recommendation

**Monitor** - Good for scalable cloud browser needs but adds external dependency and cost.

### Evidence

- Source: https://github.com/browserbase/mcp-server-browserbase
- Date: August 3, 2026
- Why it matters: Enterprise-grade cloud browser for scaling AI agent web interactions.

---

## Anycrawl MCP

**Category:** Browser & Web
**Source:** https://github.com/anycontext/anycrawl-mcp
**Status:** Active (Community)

### Capability Summary

Web scraping and content extraction MCP server with focus on structured data. Supports JavaScript rendering, anti-bot bypassing, and multiple output formats including markdown and structured JSON.

### Installation

```bash
npx -y anycrawl-mcp
```

### Dependencies

- Anycrawl API key
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal
- Disk: Minimal
- Network: Required

### Security Notes

- External API dependency
- Review data handling policies
- Rate limiting on free tier

### Maintenance

- Community maintained
- Regular updates
- Growing adoption

### Offline Support

No - requires API access.

### Browser Automation Alternative

Specialized for scraping vs. general automation.

### CLI Alternative

- Scrapy
- BeautifulSoup
- curl

### Bhavya Score

70/100

### Recommendation

**Monitor** - Alternative to Firecrawl for web scraping. Evaluate based on specific feature needs.

### Evidence

- Source: https://github.com/anycontext/anycrawl-mcp
- Date: August 3, 2026
- Why it matters: Specialized web scraping with anti-bot capabilities.

---

## Comparison Matrix

| MCP Server      | Browser Support           | JavaScript | Cost      | Complexity | Recommendation |
| --------------- | ------------------------- | ---------- | --------- | ---------- | -------------- |
| Playwright      | Chromium, Firefox, WebKit | Full       | Free      | Medium     | Install        |
| Puppeteer       | Chromium only             | Full       | Free      | Low        | Monitor        |
| Fetch           | None                      | No         | Free      | Low        | Pilot          |
| Firecrawl       | Via API                   | Full       | Free/Paid | Medium     | Pilot          |
| Chrome DevTools | Chrome                    | Full       | Free      | High       | Pilot          |
| Browserbase     | Cloud browsers            | Full       | Paid      | Medium     | Monitor        |
| Anycrawl        | Via API                   | Full       | Free/Paid | Medium     | Monitor        |

## Priority for Bhavya Foundation

1. **Must Install:** Playwright MCP (browser automation standard)
2. **Should Install:** Fetch MCP (simple HTTP operations)
3. **Evaluate:** Firecrawl MCP (web scraping needs)
4. **Monitor:** Chrome DevTools MCP (debugging), Browserbase (scaling)

## Key Decision Points

### Playwright vs Puppeteer

- **Choose Playwright** for cross-browser support and accessibility-first approach
- **Choose Puppeteer** only if specifically need Chromium-only and lighter weight

### Local vs Cloud

- **Choose Local** (Playwright/Puppeteer) for privacy, control, and no cost
- **Choose Cloud** (Browserbase) for scaling, proxy needs, and managed infrastructure

### Automation vs Scraping

- **Choose Automation** (Playwright) for interactive workflows
- **Choose Scraping** (Firecrawl/Anycrawl) for bulk content extraction

## Security Considerations

1. **Browser isolation** - run browsers in sandboxed environments
2. **Network controls** - limit outbound connections
3. **Data privacy** - be aware of what data is sent to cloud services
4. **API key management** - rotate keys regularly
5. **Rate limiting** - respect service limits to avoid blocks

---

_Last Updated: August 3, 2026_
_Source: Official MCP repositories, Microsoft, and community documentation_
