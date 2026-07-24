# Bhavya Foundation — Deployment Guide

## Prerequisites

1. DigitalOcean account
2. Domain name (bhavya.foundation)
3. GitHub repository with secrets configured
4. SSH key pair

## Quick Start

### 1. Manual Actions Required

Before automation can run, complete these steps:

#### DigitalOcean Setup
- [ ] Create DigitalOcean API token
- [ ] Generate SSH key pair: `ssh-keygen -t ed25519 -f ~/.ssh/bhavya-deploy`
- [ ] Add SSH public key to DigitalOcean

#### GitHub Secrets
Add these secrets to your GitHub repository:

| Secret | Value |
|--------|-------|
| `STAGING_SSH_KEY` | Private key from `~/.ssh/bhavya-deploy` |
| `STAGING_HOST` | Server IP after Terraform apply |
| `DO_API_TOKEN` | DigitalOcean API token |

#### Domain Setup
- [ ] Point nameservers to DigitalOcean
- [ ] Purchase domain if not already owned

### 2. Deploy Infrastructure

```bash
# Initialize Terraform
cd terraform
terraform init

# Set variables
export DO_token="your-digitalocean-api-token"
export pvt_key="~/.ssh/bhavya-deploy"

# Plan
terraform plan -var="do_token=$DO_token" -var="pvt_key=$pvt_key"

# Apply
terraform apply -var="do_token=$DO_token" -var="pvt_key=$DO_pvt_key"

# Save outputs
terraform output > ../deploy-outputs.txt
```

### 3. Setup Server

```bash
# Get server IP from Terraform output
SERVER_IP=$(terraform output -raw floating_ip)

# Run server setup
cd ..
bash scripts/server-setup.sh $SERVER_IP
```

### 4. Configure GitHub Secrets

After Terraform creates the server:

```bash
# Get the server IP
SERVER_IP=$(cd terraform && terraform output -raw floating_ip)

# Add to GitHub secrets:
# STAGING_SSH_KEY = contents of ~/.ssh/bhavya-deploy
# STAGING_HOST = $SERVER_IP
```

### 5. Deploy

Push to `main` branch to trigger automatic deployment:

```bash
git push origin main
```

Or deploy manually:

```bash
bash scripts/server-setup.sh <server-ip>
```

## Architecture

```
Internet
    │
    ▼
┌─────────────┐
│  DigitalOcean│
│  Floating IP │
└──────┬──────┘
       │
┌──────▼──────┐
│   Nginx     │
│   (SSL)     │
└──────┬──────┘
       │
┌──────▼──────────────────────────┐
│  Docker Network (bhavya-net)    │
│                                 │
│  ┌─────────┐  ┌─────────┐     │
│  │ Website │  │  Admin  │     │
│  │  :3000  │  │  :3003  │     │
│  └─────────┘  └─────────┘     │
│                                 │
│  ┌─────────┐  ┌─────────┐     │
│  │ Runtime │  │  Design │     │
│  │  :8080  │  │  :3010  │     │
│  └─────────┘  └─────────┘     │
│                                 │
│  ┌─────────────┐              │
│  │ Monitoring  │              │
│  │   :3004     │              │
│  └─────────────┘              │
└─────────────────────────────────┘
```

## Services

| Service | Port | Health Check |
|---------|------|--------------|
| Website | 3000 | `GET /` |
| Admin | 3003 | `GET /api/health` |
| Runtime | 8080 | `GET /health` |
| Design System | 3010 | `GET /` |
| Nginx | 80, 443 | `GET /health` |
| Monitoring | 3004 | Web UI |

## URLs

| Service | URL |
|---------|-----|
| Website | https://staging.bhavya.foundation |
| Admin | https://staging.bhavya.foundation/admin/ |
| API | https://staging.bhavya.foundation/api/ |
| Design System | https://staging.bhavya.foundation/design/ |
| Monitoring | https://staging.bhavya.foundation/monitoring/ |

## Cron Jobs

| Schedule | Task |
|----------|------|
| Daily 2 AM | Automated backup |
| Weekly Monday 3 AM | Pull latest and rebuild |

## Backup

```bash
# Manual backup
ssh deploy@<server-ip> "cd /opt/bhavya && bash scripts/server-backup.sh"

# List backups
ssh deploy@<server-ip> "ls -la /opt/bhavya/backups/"

# Restore from backup
ssh deploy@<server-ip> "cd /opt/bhavya && bash scripts/server-rollback.sh <timestamp>"
```

## Rollback

```bash
# Via GitHub Actions
# Go to Actions → Deploy to Staging → Run workflow → Check "Rollback"

# Via SSH
ssh deploy@<server-ip> "cd /opt/bhavya && bash scripts/server-rollback.sh"

# Via Docker Compose
ssh deploy@<server-ip> "cd /opt/bhavya && docker compose -f docker/compose.staging.yml down && docker compose -f docker/compose.staging.yml up -d"
```

## Monitoring

```bash
# Check health
bash scripts/health-monitor.sh https://staging.bhavya.foundation

# View logs
ssh deploy@<server-ip> "cd /opt/bhavya && docker compose -f docker/compose.staging.yml logs -f"

# Check specific service
ssh deploy@<server-ip> "cd /opt/bhavya && docker compose -f docker/compose.staging.yml logs -f website"
```

## SSL Renewal

SSL certificates auto-renew every 12 hours via the certbot service. To manually renew:

```bash
ssh deploy@<server-ip> "docker exec bhavya-certbot certbot renew"
```

## Troubleshooting

### Website not loading
```bash
# Check container status
docker compose -f docker/compose.staging.yml ps

# Check logs
docker compose -f docker/compose.staging.yml logs nginx
docker compose -f docker/compose.staging.yml logs website
```

### SSL certificate issues
```bash
# Check certificate
openssl s_client -connect staging.bhavya.foundation:443 -servername staging.bhavya.foundation

# Force renewal
docker exec bhavya-certbot certbot renew --force-renewal
```

### High memory usage
```bash
# Check resource usage
docker stats

# Restart heavy services
docker compose -f docker/compose.staging.yml restart website
```
