# MCP Installation Guide

**Research Date:** August 3, 2026
**Researcher:** Bhavya Foundation OS Project
**Purpose:** Step-by-step installation patterns for MCP servers

---

## Overview

This guide provides standardized installation patterns for MCP servers across different clients and operating systems. Follow these patterns for consistent, secure deployments.

## Installation Methods

### 1. NPX (Node.js Package Execute)

**Best for:** Node.js-based MCP servers
**Prerequisites:** Node.js 18+

```bash
# Basic pattern
npx -y @scope/package-name

# With arguments
npx -y @scope/package-name /path/to/allowed/dir

# With environment variables
BRAVE_API_KEY="your_key" npx -y @scope/package-name
```

**Advantages:**

- No global installation required
- Automatic dependency resolution
- Clean uninstalls

**Disadvantages:**

- Requires Node.js
- Network download on first run
- May have version conflicts

### 2. UVX (Python Package Execute)

**Best for:** Python-based MCP servers
**Prerequisites:** Python 3.10+, uv package manager

```bash
# Basic pattern
uvx package-name

# With arguments
uvx package-name /path/to/allowed/dir

# With environment variables
BRAVE_API_KEY="your_key" uvx package-name
```

**Advantages:**

- Python ecosystem support
- Isolated environments
- Clean uninstalls

**Disadvantages:**

- Requires Python
- Network download on first run
- May have dependency conflicts

### 3. Docker

**Best for:** Containerized deployments
**Prerequisites:** Docker installed and running

```bash
# Basic pattern
docker run -i --rm \
  --mount type=bind,src=/local/path,dst=/container/path \
  image-name /container/path

# With environment variables
docker run -i --rm \
  -e API_KEY="your_key" \
  image-name
```

**Advantages:**

- Complete isolation
- Reproducible environments
- Easy cleanup

**Disadvantages:**

- Requires Docker
- Larger resource usage
- More complex configuration

### 4. Remote HTTP

**Best for:** Hosted MCP servers
**Prerequisites:** Network access

```json
{
  "mcpServers": {
    "server-name": {
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

**Advantages:**

- No local installation
- Managed by provider
- Always up to date

**Disadvantages:**

- Requires network
- Less control
- Potential privacy concerns

## Client-Specific Installation

### Claude Desktop

**Config location:**

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Installation pattern:**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "your_key"
      }
    }
  }
}
```

### Cursor IDE

**Config location:** `~/.cursor/mcp.json` (or project `.cursor/mcp.json`)

**Installation pattern:**

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "your_key"
      }
    }
  }
}
```

### VS Code

**Config location:** `.vscode/mcp.json` (project-level)

**Installation pattern:**

```json
{
  "servers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "your_key"
      }
    }
  }
}
```

### Claude Code

**Installation pattern:**

```bash
# Add server
claude mcp add server-name npx -y @scope/package-name

# Add with transport
claude mcp add server-name -t http https://mcp.example.com/mcp

# Add to project scope
claude mcp add --scope project server-name npx -y @scope/package-name
```

## Windows-Specific Setup

### Path Handling

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\YourUser\\Documents"
      ]
    }
  }
}
```

**Important:** Use double backslashes (`\\`) in JSON paths.

### Execution Policy

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Finding npx Path

```powershell
where npx
# Output: C:\Program Files\nodejs\npx.cmd
```

## Linux/macOS Setup

### Standard Installation

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects"
      ]
    }
  }
}
```

### Docker Installation

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--mount",
        "type=bind,src=/Users/username/projects,dst=/projects",
        "mcp/filesystem",
        "/projects"
      ]
    }
  }
}
```

## Environment Variables

### Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Rotate keys** regularly
4. **Use minimal permissions** for API keys

### Common Environment Variables

| MCP Server   | Variable                       | Description                |
| ------------ | ------------------------------ | -------------------------- |
| GitHub       | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub PAT                 |
| Brave Search | `BRAVE_API_KEY`                | Brave Search API key       |
| Notion       | `NOTION_API_TOKEN`             | Notion integration token   |
| Slack        | `SLACK_BOT_TOKEN`              | Slack bot token            |
| Linear       | `LINEAR_API_KEY`               | Linear API key             |
| PostgreSQL   | `POSTGRES_CONNECTION_STRING`   | Database connection string |

### Setting Environment Variables

**In config file:**

```json
{
  "env": {
    "API_KEY": "your_key_here"
  }
}
```

**In shell (temporary):**

```bash
export API_KEY="your_key_here"
npx -y @scope/package-name
```

**Using .env file:**

```bash
# .env file
API_KEY=your_key_here

# In config (using dotenv)
{
  "command": "npx",
  "args": ["-y", "dotenv-cli", "--", "npx", "-y", "@scope/package-name"]
}
```

## Verification

### Testing Installation

1. **Check server starts:**

```bash
# Test with MCP Inspector
npx -y @modelcontextprotocol/inspector npx -y @scope/package-name
```

2. **Verify in client:**

- Open Claude Desktop/Cursor
- Check MCP settings
- Look for green status indicator

3. **Test tool execution:**

```
What MCP tools do you have available?
```

### Common Issues

**Server not starting:**

- Check Node.js version (18+)
- Verify command path
- Check environment variables
- Review client logs

**Tools not appearing:**

- Restart client after config changes
- Verify JSON syntax
- Check server process

**Permission errors:**

- Verify file system permissions
- Check Docker permissions
- Review API key scopes

## Updating MCP Servers

### NPX Updates

```bash
# Clear cache
npx clear-npx-cache

# Or use specific version
npx -y @scope/package-name@1.2.3
```

### Docker Updates

```bash
# Pull latest image
docker pull image-name

# Remove old container
docker rm container-name

# Start new container
docker run -i --rm image-name
```

### Global Updates

```bash
# Update global package
npm update -g @scope/package-name

# Or reinstall
npm install -g @scope/package-name@latest
```

## Troubleshooting

### Diagnostic Steps

1. **Check client logs:**
   - Claude Desktop: Help → View Logs
   - Cursor: Help → Toggle Developer Tools

2. **Test server manually:**

```bash
# Run server directly
npx -y @scope/package-name

# Check for errors
# Verify output format
```

3. **Verify configuration:**

```bash
# Validate JSON
cat mcp.json | jq .

# Check paths exist
ls -la /path/to/allowed/dir
```

### Common Solutions

**"Command not found":**

- Use full path to npx/node
- Check PATH environment variable
- Verify Node.js installation

**"Permission denied":**

- Check file permissions
- Use sudo (if appropriate)
- Verify Docker permissions

**"Connection refused":**

- Check network connectivity
- Verify API endpoint
- Check firewall settings

**"Invalid JSON":**

- Validate JSON syntax
- Check for trailing commas
- Verify escaping of special characters

## Security Checklist

Before deploying any MCP server:

- [ ] Verify source repository
- [ ] Check for recent updates
- [ ] Review permissions required
- [ ] Test in sandbox environment
- [ ] Verify authentication works
- [ ] Check logging configuration
- [ ] Review network requirements
- [ ] Document configuration
- [ ] Plan key rotation
- [ ] Set up monitoring

---

_Last Updated: August 3, 2026_
_Version: 1.0_
