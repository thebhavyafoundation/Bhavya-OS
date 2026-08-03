# Core Infrastructure MCP Servers

**Research Date:** August 3, 2026
**Researcher:** Bhavya Foundation OS Project
**Category:** Core Infrastructure

---

## GitHub MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/github/github-mcp-server
**Status:** Active (Official)

### Capability Summary

The official GitHub MCP server provides AI assistants with direct access to GitHub repositories, issues, pull requests, code search, and GitHub Actions. It supports both remote (hosted by GitHub) and local (Docker-based) deployment modes, enabling repository management, code review, issue triaging, and workflow automation through natural language.

### Installation

```bash
# Remote (recommended - hosted by GitHub)
# Add via MCP Registry in VS Code/Cursor

# Local via Docker
docker pull ghcr.io/github/github-mcp-server

# Via npx (deprecated - use Docker instead)
npx -y @modelcontextprotocol/server-github
```

### Dependencies

- GitHub Personal Access Token (PAT) with appropriate scopes
- Docker (for local deployment)
- Node.js 18+ (for npx method)
- Go 1.24+ (for building from source)

### Hardware Impact

- RAM: 128-256MB (Docker container)
- CPU: Minimal (API proxy)
- Disk: ~100MB Docker image
- Network: Requires internet for GitHub API

### Security Notes

- Uses GitHub PAT with scoped permissions
- Supports read-only mode configuration
- Token should be stored in environment variables, never committed
- Organization admins can control MCP access via policies
- Enterprise Managed Users may have PAT restrictions

### Maintenance

- Officially maintained by GitHub
- Active development with frequent updates
- npm package deprecated in April 2025; Docker is primary
- Documentation: https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide

### Offline Support

No - requires internet access to GitHub API.

### Browser Automation Alternative

GitHub has its own web interface; Playwright could automate web-based GitHub interactions but lacks the structured API access.

### CLI Alternative

- `gh` CLI (GitHub CLI) - same functionality, scriptable
- Git commands for repository operations

### Bhavya Score

95/100

### Recommendation

**Install** - Essential for any project using GitHub. Official support, excellent documentation, and critical for AI-assisted development workflows.

### Evidence

- Source: https://github.com/github/github-mcp-server
- Date: August 3, 2026
- Why it matters: Official GitHub integration enables AI assistants to manage repositories, issues, and PRs directly.

---

## GitLab MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/zereight/gitlab-mcp
**Status:** Active (Community)

### Capability Summary

Community-built MCP server providing access to GitLab repositories, issues, merge requests, pipelines, and CI/CD configuration. Supports self-hosted and gitlab.com instances with full API coverage for DevOps workflows.

### Installation

```bash
npx -y gitlab-mcp
# or
pip install gitlab-mcp
```

### Dependencies

- GitLab Personal Access Token
- Python 3.10+ or Node.js 18+
- Network access to GitLab instance

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal
- Disk: ~50MB
- Network: Requires access to GitLab API

### Security Notes

- Uses Personal Access Tokens with scoped permissions
- Self-hosted instances should use HTTPS
- Token rotation recommended regularly
- Community-maintained; review code before production use

### Maintenance

- Community maintained (zereight)
- 1,843 GitHub stars
- Updated regularly but not official
- Check for security updates before deploying

### Offline Support

No - requires network access to GitLab API.

### Browser Automation Alternative

Playwright could automate GitLab web interface but loses structured API access.

### CLI Alternative

- `glab` CLI (GitLab CLI)
- Git commands for repository operations
- GitLab API directly

### Bhavya Score

75/100

### Recommendation

**Pilot** - Good for GitLab users, but community-maintained. Evaluate for security before production deployment.

### Evidence

- Source: https://github.com/zereight/gitlab-mcp
- Date: August 3, 2026
- Why it matters: GitLab integration for teams using self-hosted or git.com for DevOps workflows.

---

## Filesystem MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/modelcontextprotocol/servers/filesystem
**Status:** Active (Official Reference)

### Capability Summary

Official reference implementation for secure filesystem access through MCP. Provides sandboxed file operations including read, write, create, delete, move, and search within specified directories. Supports both Docker and npx deployment with configurable directory restrictions.

### Installation

```bash
# Via npx
npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir

# Via Docker
docker run -i --rm \
  --mount type=bind,src=/path/to/allowed/dir,dst=/projects/allowed/dir \
  mcp/filesystem /projects/allowed/dir
```

### Dependencies

- Node.js 18+ (for npx)
- Docker (optional, for containerized deployment)
- File system access permissions

### Hardware Impact

- RAM: 32-64MB
- CPU: Negligible
- Disk: Minimal (package size)
- Network: None (local operations only)

### Security Notes

- Sandbox restricts access to specified directories only
- Directory traversal (../) prevented by design
- Read-only mode available with `ro` flag
- Never expose to network without authentication
- Docker deployment provides additional isolation

### Maintenance

- Officially maintained as part of MCP reference servers
- Updated with MCP specification changes
- Stable and well-documented

### Offline Support

Yes - fully functional offline for local file operations.

### Browser Automation Alternative

Not applicable - filesystem operations are fundamentally different from web browsing.

### CLI Alternative

- Shell commands (ls, cat, echo, etc.)
- File managers
- Text editors

### Bhavya Score

90/100

### Recommendation

**Install** - Essential for any AI assistant needing local file access. Security model is well-designed for sandboxed operations.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Secure file access is foundational for code editing and document management workflows.

---

## Git MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/modelcontextprotocol/servers/git
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for Git repository operations. Enables AI assistants to read repository state, view diffs, check commit history, create branches, and perform Git operations through structured tool calls. Works with local Git repositories.

### Installation

```bash
npx -y @modelcontextprotocol/server-git
# or
pip install mcp-server-git
```

### Dependencies

- Git installed on system
- Python 3.10+ or Node.js 18+
- Local Git repository access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal (Git operations are fast)
- Disk: None (uses existing Git data)
- Network: None (local operations only)

### Security Notes

- Read-only by default for safety
- Write operations (commit, branch) require explicit enablement
- Works on local repositories only
- No network access required

### Maintenance

- Officially maintained as part of MCP reference servers
- Stable and well-tested

### Offline Support

Yes - fully functional offline.

### Browser Automation Alternative

Not applicable - Git operations are CLI-based.

### CLI Alternative

- `git` CLI directly
- `gh` CLI for GitHub-specific operations

### Bhavya Score

85/100

### Recommendation

**Install** - Useful for repository analysis and commit history exploration without direct CLI access.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Structured Git access enables AI assistants to understand codebase evolution and history.

---

## SQLite MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/modelcontextprotocol/servers/sqlite
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for SQLite database operations. Provides read/write access to SQLite databases with schema inspection, query execution, and table management capabilities. Ideal for lightweight local data storage and prototyping.

### Installation

```bash
npx -y @modelcontextprotocol/server-sqlite /path/to/database.db
# or
pip install mcp-server-sqlite
```

### Dependencies

- Python 3.10+ or Node.js 18+
- SQLite library
- File system access for database files

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: Database file size
- Network: None (local operations only)

### Security Notes

- Direct file access - secure database files appropriately
- Consider read-only mode for analysis
- SQL injection protection built into parameterized queries
- No authentication on database access

### Maintenance

- Officially maintained as part of MCP reference servers
- Stable and reliable

### Offline Support

Yes - fully functional offline.

### Browser Automation Alternative

Not applicable - database operations are fundamentally different.

### CLI Alternative

- `sqlite3` CLI
- DB Browser for SQLite (GUI)
- Direct SQL queries

### Bhavya Score

80/100

### Recommendation

**Pilot** - Excellent for prototyping and local data. Use PostgreSQL MCP for production databases.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: SQLite provides fast local data storage for development and testing workflows.

---

## PostgreSQL MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/modelcontextprotocol/servers/postgres
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for PostgreSQL database operations. Provides read-only access by default for safety, with schema inspection, query execution, and table management. Supports connection pooling and parameterized queries for security.

### Installation

```bash
npx -y @modelcontextprotocol/server-postgres
# or
pip install mcp-server-postgres
```

### Dependencies

- PostgreSQL client libraries
- Python 3.10+ or Node.js 18+
- Database connection string

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal (database operations are server-side)
- Disk: None (database is remote)
- Network: Database connection required

### Security Notes

- **Read-only by default** - critical safety feature
- Use read-only database credentials
- Connection string should use environment variables
- Parameterized queries prevent SQL injection
- Consider connection pooling for production

### Maintenance

- Officially maintained as part of MCP reference servers
- Regular updates for compatibility
- Well-documented security practices

### Offline Support

No - requires database connection.

### Browser Automation Alternative

Not applicable - database operations are fundamentally different.

### CLI Alternative

- `psql` CLI
- pgAdmin (GUI)
- Direct database connections

### Bhavya Score

90/100

### Recommendation

**Install** - Essential for any project using PostgreSQL. Read-only default is excellent security practice.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: PostgreSQL is the most popular open-source database; structured access enables AI-assisted data analysis.

---

## Docker MCP Server

**Category:** Core Infrastructure
**Source:** https://github.com/modelcontextprotocol/servers/docker
**Status:** Active (Official Reference)

### Capability Summary

Official MCP server for Docker container management. Enables AI assistants to manage containers, images, networks, and volumes through structured tool calls. Supports container lifecycle operations, log inspection, and resource monitoring.

### Installation

```bash
npx -y @modelcontextprotocol/server-docker
# or
pip install mcp-server-docker
```

### Dependencies

- Docker Engine installed and running
- Docker API access
- Python 3.10+ or Node.js 18+

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal (Docker API proxy)
- Disk: None (Docker manages storage)
- Network: Docker socket access

### Security Notes

- **Docker socket access is equivalent to root** - extreme caution required
- Consider rootless Docker or socket proxy
- Limit container operations to specific namespaces
- Monitor all container operations for security

### Maintenance

- Officially maintained as part of MCP reference servers
- Active development

### Offline Support

Limited - Docker operations work locally but images may need to be pulled.

### Browser Automation Alternative

Not applicable - container management is fundamentally different.

### CLI Alternative

- `docker` CLI
- Docker Compose
- Kubernetes CLI (for orchestrated workloads)

### Bhavya Score

70/100

### Recommendation

**Monitor** - Powerful but security-sensitive. Only deploy in trusted environments with appropriate controls.

### Evidence

- Source: https://github.com/modelcontextprotocol/servers
- Date: August 3, 2026
- Why it matters: Container management is essential for modern development workflows.

---

## Comparison Matrix

| MCP Server | Maturity | Security  | Offline | RAM       | Recommendation |
| ---------- | -------- | --------- | ------- | --------- | -------------- |
| GitHub     | High     | Good      | No      | 128-256MB | Install        |
| GitLab     | Medium   | Variable  | No      | 64-128MB  | Pilot          |
| Filesystem | High     | Excellent | Yes     | 32-64MB   | Install        |
| Git        | High     | Good      | Yes     | 32-64MB   | Install        |
| SQLite     | High     | Good      | Yes     | 32-64MB   | Pilot          |
| PostgreSQL | High     | Excellent | No      | 64-128MB  | Install        |
| Docker     | High     | Sensitive | Limited | 64-128MB  | Monitor        |

## Priority for Bhavya Foundation

1. **Must Install:** GitHub MCP, Filesystem MCP, PostgreSQL MCP
2. **Should Install:** Git MCP, SQLite MCP
3. **Evaluate:** GitLab MCP (if using GitLab)
4. **Monitor:** Docker MCP (security-sensitive)

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use read-only database credentials** where possible
3. **Limit filesystem access** to specific directories
4. **Monitor Docker operations** closely
5. **Rotate tokens** regularly
6. **Use environment variables** for secrets
7. **Enable audit logging** for production deployments

---

_Last Updated: August 3, 2026_
_Source: Official MCP repositories, GitHub, and community documentation_
