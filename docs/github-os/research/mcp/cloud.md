# Cloud Provider MCP Servers

**Research Date:** August 3, 2026
**Researcher:** Bhavya Foundation OS Project
**Category:** Cloud Infrastructure

---

## AWS MCP Servers

**Category:** Cloud
**Source:** https://github.com/awslabs/mcp
**Status:** Active (Official AWS)

### Capability Summary

AWS maintains 66+ official MCP servers covering a wide range of AWS services. These servers enable AI assistants to manage EC2, S3, Lambda, RDS, and other AWS resources through structured tool calls. AWS is a platinum member of the Agentic AI Foundation (AAIF).

### Installation

```bash
# AWS MCP servers are available via npm
npx -y @aws/mcp-server

# Individual service servers
npx -y @aws/mcp-server-s3
npx -y @aws/mcp-server-lambda
npx -y @aws/mcp-server-ec2
```

### Dependencies

- AWS credentials (IAM roles or access keys)
- Node.js 18+
- AWS CLI configured
- Network access to AWS APIs

### Hardware Impact

- RAM: 64-128MB per server
- CPU: Minimal
- Disk: Minimal
- Network: Required for all AWS operations

### Security Notes

- **Use IAM roles** instead of access keys where possible
- Follow least-privilege principle
- Enable CloudTrail for audit logging
- Use VPC endpoints for private access
- Never commit credentials to version control
- Consider AWS Organizations SCPs for guardrails

### Maintenance

- Officially maintained by AWS Labs
- 8,800+ GitHub stars
- Regular updates and new services
- Enterprise support available
- AWS re:Invent sessions on MCP

### Offline Support

No - requires network access to AWS APIs.

### Browser Automation Alternative

AWS Management Console could be automated with Playwright but loses structured API access.

### CLI Alternative

- AWS CLI directly
- AWS SDK
- Terraform/Pulumi for IaC

### Bhavya Score

85/100

### Recommendation

**Install** - Essential for AWS-based projects. Official support with extensive service coverage.

### Evidence

- Source: https://github.com/awslabs/mcp
- Date: August 3, 2026
- Why it matters: Official AWS integration with 66+ service-specific MCP servers.

---

## Google Cloud MCP Servers

**Category:** Cloud
**Source:** https://github.com/googleapis/mcp-servers
**Status:** Active (Official Google Cloud)

### Capability Summary

Google Cloud offers 46+ managed MCP endpoints for services like BigQuery, Spanner, GKE, and Cloud Storage. Most endpoints are now GA (Generally Available). Google created the Agent2Agent (A2A) protocol as a complement to MCP.

### Installation

```bash
# Google Cloud MCP servers are available via remote endpoints
# Example: BigQuery
{
  "mcpServers": {
    "bigquery": {
      "url": "https://bigquery.googleapis.com/mcp/sse",
      "headers": {
        "Authorization": "Bearer $(gcloud auth print-access-token)"
      }
    }
  }
}

# Or via npm
npx -y @google-cloud/mcp-server
```

### Dependencies

- Google Cloud credentials
- gcloud CLI configured
- Node.js 18+ (for local servers)
- Network access

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal
- Disk: Minimal
- Network: Required for all operations

### Security Notes

- Use IAM roles and service accounts
- Enable Cloud Audit Logs
- Use Private Service Connect for private access
- Follow Google Cloud security best practices
- Consider Organization Policies for guardrails

### Maintenance

- Officially maintained by Google Cloud
- 14.8K stars on Google Cloud Toolbox
- Active development
- Regular updates and new services
- Enterprise support available

### Offline Support

No - requires network access to Google Cloud APIs.

### Browser Automation Alternative

Google Cloud Console could be automated with Playwright but loses structured API access.

### CLI Alternative

- gcloud CLI directly
- Google Cloud SDK
- Terraform/Pulumi for IaC

### Bhavya Score

85/100

### Recommendation

**Install** - Essential for Google Cloud projects. Official support with managed remote endpoints.

### Evidence

- Source: https://github.com/googleapis/mcp-servers
- Date: August 3, 2026
- Why it matters: Official Google Cloud integration with managed remote MCP endpoints.

---

## Azure MCP Server

**Category:** Cloud
**Source:** https://github.com/microsoft/mcp
**Status:** Active (Official Microsoft)

### Capability Summary

Microsoft's official MCP server covering 40+ Azure services including Storage, Cosmos DB, Key Vault, AKS, Monitor, SQL, and App Service. Built into Visual Studio 2026 and supports both stdio and HTTP remote transports.

### Installation

```bash
# Azure MCP server
npx -y @azure/mcp@latest server start

# Via Visual Studio 2026 (built-in)
# Azure Skills Plugin bundles all Azure tools
```

### Dependencies

- Azure credentials (Managed Identity or service principal)
- Node.js 18+ or .NET
- Azure CLI configured
- Network access

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal
- Disk: Minimal
- Network: Required

### Security Notes

- Use Azure Managed Identity where possible
- Enable Azure Activity Log for auditing
- Use Private Link for private access
- Follow Azure security best practices
- Consider Azure Policy for guardrails
- Entra ID integration for authentication

### Maintenance

- Officially maintained by Microsoft
- 3,000+ GitHub stars
- Built into Visual Studio 2026
- Active development
- Enterprise support available

### Offline Support

No - requires network access to Azure APIs.

### Browser Automation Alternative

Azure Portal could be automated with Playwright but loses structured API access.

### CLI Alternative

- Azure CLI directly
- Azure PowerShell
- Terraform/Pulumi for IaC

### Bhavya Score

85/100

### Recommendation

**Install** - Essential for Azure projects. Official support with Visual Studio integration.

### Evidence

- Source: https://github.com/microsoft/mcp
- Date: August 3, 2026
- Why it matters: Official Azure integration built into Visual Studio 2026.

---

## Cloudflare MCP Server

**Category:** Cloud
**Source:** https://github.com/cloudflare/mcp-server-cloudflare
**Status:** Active (Official Cloudflare)

### Capability Summary

Official Cloudflare MCP server covering Workers, KV, R2, D1, and other edge services. Enables AI assistants to manage edge computing resources, storage, and security policies. Cloudflare Workers provide the fastest way to deploy MCP servers at the edge.

### Installation

```bash
npx -y @cloudflare/mcp-server-cloudflare
```

### Dependencies

- Cloudflare API token
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: Minimal
- Network: Required

### Security Notes

- Use API tokens with minimal permissions
- Enable Cloudflare audit logs
- Use Zero Trust for access control
- Consider Cloudflare Portals for managed MCP

### Maintenance

- Officially maintained by Cloudflare
- 3,566+ GitHub stars
- Active development
- Regular updates
- Enterprise support available

### Offline Support

No - requires network access to Cloudflare APIs.

### Browser Automation Alternative

Cloudflare Dashboard could be automated with Playwright but loses structured API access.

### CLI Alternative

- Wrangler CLI
- Cloudflare API
- Terraform for infrastructure

### Bhavya Score

80/100

### Recommendation

**Install** - Essential for Cloudflare-based projects. Edge computing integration is unique.

### Evidence

- Source: https://github.com/cloudflare/mcp-server-cloudflare
- Date: August 3, 2026
- Why it matters: Official Cloudflare integration for edge computing and storage.

---

## Vercel MCP Server

**Category:** Cloud
**Source:** https://mcp.vercel.com
**Status:** Active (Official Vercel)

### Capability Summary

Official Vercel MCP server for deployment and edge configuration. Provides read-only access to Vercel account data, projects, and deployments. Integrates with Vercel AI SDK 6 for full MCP support with agents and tool execution.

### Installation

```bash
# Remote MCP endpoint
claude mcp add --transport http vercel-mcp https://mcp.vercel.com
```

### Dependencies

- Vercel account
- OAuth authentication
- Network access

### Hardware Impact

- RAM: 32-64MB (local)
- CPU: Minimal
- Disk: Minimal
- Network: Required

### Security Notes

- OAuth authentication
- Read-only access by default
- Review Vercel's privacy policy
- Consider team-level access controls

### Maintenance

- Officially maintained by Vercel
- Active development
- Regular updates

### Offline Support

No - requires network access.

### Browser Automation Alternative

Vercel Dashboard could be automated with Playwright but loses structured API access.

### CLI Alternative

- Vercel CLI directly
- Vercel API
- Git integration

### Bhavya Score

75/100

### Recommendation

**Pilot** - Good for Vercel-deployed projects but limited to Vercel ecosystem.

### Evidence

- Source: https://mcp.vercel.com
- Date: August 3, 2026
- Why it matters: Official Vercel integration for deployment management.

---

## DigitalOcean MCP Server

**Category:** Cloud
**Source:** https://github.com/digitalocean/mcp-server
**Status:** Active (Official DigitalOcean)

### Capability Summary

Official DigitalOcean MCP server covering Droplets, Kubernetes, databases, and other services. Enables AI assistants to manage cloud infrastructure with 9 different service integrations.

### Installation

```bash
npx -y @digitalocean/mcp-server
```

### Dependencies

- DigitalOcean API token
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 32-64MB
- CPU: Minimal
- Disk: Minimal
- Network: Required

### Security Notes

- API token with minimal permissions
- Enable audit logging
- Consider team accounts with role-based access
- Use environment variables for credentials

### Maintenance

- Officially maintained by DigitalOcean
- Active development
- Regular updates

### Offline Support

No - requires network access to DigitalOcean API.

### Browser Automation Alternative

DigitalOcean Dashboard could be automated with Playwright but loses structured API access.

### CLI Alternative

- doctl CLI
- DigitalOcean API
- Terraform for infrastructure

### Bhavya Score

75/100

### Recommendation

**Pilot** - Good for DigitalOcean users but limited ecosystem compared to major clouds.

### Evidence

- Source: https://github.com/digitalocean/mcp-server
- Date: August 3, 2026
- Why it matters: Official DigitalOcean integration for developer-friendly cloud.

---

## Terraform MCP Server

**Category:** Cloud
**Source:** https://github.com/hashicorp/terraform-mcp-server
**Status:** Active (Official HashiCorp)

### Capability Summary

Official Terraform MCP server for infrastructure as code. Provides access to Terraform Registry, HCP Terraform workspaces, and private module registries. Enables AI assistants to understand and generate Terraform configurations.

### Installation

```bash
npx -y @hashicorp/terraform-mcp-server
```

### Dependencies

- Terraform installed
- HCP Terraform account (optional)
- Node.js 18+
- Network access

### Hardware Impact

- RAM: 64-128MB
- CPU: Minimal
- Disk: Minimal
- Network: Required for registry access

### Security Notes

- Terraform state files contain sensitive data
- Use remote state with encryption
- Limit workspace access
- Enable audit logging
- Use Terraform Cloud for team management

### Maintenance

- Officially maintained by HashiCorp
- Active development
- Regular updates
- Enterprise support available

### Offline Support

Limited - local Terraform works offline but registry requires network.

### Browser Automation Alternative

Terraform Cloud Dashboard could be automated but loses structured API access.

### CLI Alternative

- `terraform` CLI directly
- Terraform Cloud UI
- Pulumi as alternative

### Bhavya Score

80/100

### Recommendation

**Install** - Essential for Terraform users. Official support with registry integration.

### Evidence

- Source: https://github.com/hashicorp/terraform-mcp-server
- Date: August 3, 2026
- Why it matters: Official Terraform integration for infrastructure as code workflows.

---

## Comparison Matrix

| Cloud Provider | Services | Stars   | Remote | Cost        | Recommendation |
| -------------- | -------- | ------- | ------ | ----------- | -------------- |
| AWS            | 66+      | 8,800+  | Both   | Pay-per-use | Install        |
| Google Cloud   | 46+      | 14,800+ | Remote | Pay-per-use | Install        |
| Azure          | 40+      | 3,000+  | Both   | Pay-per-use | Install        |
| Cloudflare     | 13+      | 3,566   | Both   | Free/Paid   | Install        |
| Vercel         | 1        | N/A     | Remote | Free/Paid   | Pilot          |
| DigitalOcean   | 9        | N/A     | Both   | Pay-per-use | Pilot          |
| Terraform      | Registry | N/A     | Both   | Free/Paid   | Install        |

## Priority for Bhavya Foundation

### Primary Cloud (choose based on existing infrastructure)

1. **AWS:** Install AWS MCP servers if using AWS
2. **Google Cloud:** Install Google Cloud MCP if using GCP
3. **Azure:** Install Azure MCP if using Azure

### Secondary Services

4. **Cloudflare:** Install if using edge computing
5. **Terraform:** Install if using IaC
6. **Vercel:** Pilot if deploying to Vercel
7. **DigitalOcean:** Pilot if using DigitalOcean

## Cloud Provider Selection Guide

### Choose AWS if:

- Already using AWS services
- Need broadest service coverage (66+ servers)
- Enterprise requirements
- Need managed remote MCP

### Choose Google Cloud if:

- Already using GCP
- Want managed remote endpoints
- Need BigQuery, Spanner, or GKE integration
- Prefer GA-ready services

### Choose Azure if:

- Already using Azure
- Need Visual Studio integration
- Enterprise Microsoft ecosystem
- Need Entra ID integration

### Choose Cloudflare if:

- Need edge computing
- Want lowest cost (100K req/day free)
- Need global distribution
- Want Zero Trust security

## Security Considerations

1. **IAM everywhere** - use roles instead of static credentials
2. **Least privilege** - grant minimum required permissions
3. **Audit logging** - enable cloud-native audit trails
4. **Network security** - use VPC endpoints and private access
5. **Credential management** - use cloud-native secret management
6. **Compliance** - ensure MCP usage meets regulatory requirements
7. **Cost monitoring** - track API usage to avoid surprise bills

---

_Last Updated: August 3, 2026_
_Source: Official MCP repositories, AWS, Google Cloud, Microsoft, Cloudflare, and community documentation_
