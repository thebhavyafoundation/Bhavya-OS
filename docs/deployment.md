# Bhavya Foundation — Deployment Runbook

## Prerequisites

- Docker 24+ and Docker Compose v2
- Node.js 20+ and pnpm 9+
- Access to the repository
- `.env` file configured (copy from `.env.example`)

## Quick Start

```bash
# 1. Clone and configure
git clone <repo-url>
cp .env.example .env
# Edit .env with production values

# 2. Deploy
node scripts/deploy.js production --validate --backup

# 3. Verify
docker compose -f docker/compose.prod.yml ps
curl http://localhost/health
```

## Services

| Service | Port | Health Check |
|---------|------|--------------|
| Nginx | 80, 443 | `curl http://localhost/health` |
| Website | 3000 | `curl http://localhost:3000/` |
| Runtime API | 8080 | `curl http://localhost:8080/health` |
| Design System | 3010 | `curl http://localhost:3010/` |

## Commands

### Deploy
```bash
# Full deployment with validation and backup
node scripts/deploy.js production --validate --backup

# Deploy without backup
node scripts/deploy.js production --validate

# Dry run
node scripts/deploy.js production --dry-run
```

### Rollback
```bash
# Rollback to last backup
node scripts/deploy.js production --rollback

# List available backups
node scripts/restore.js

# Restore specific backup
node scripts/restore.js 2026-07-24T12-00-00-000Z
```

### Backup
```bash
# Backup all
node scripts/backup.js all

# Backup specific type
node scripts/backup.js registry
node scripts/backup.js content
node scripts/backup.js runtime
```

### Validate
```bash
# Validate environment
node scripts/validate-env.js production

# Check service health
docker compose -f docker/compose.prod.yml ps
docker compose -f docker/compose.prod.yml logs --tail=100
```

## Zero-Downtime Restart

The deployment script performs rolling restarts:

1. Website → 2. Runtime → 3. Design System → 4. Nginx

Each service waits for its health check to pass before proceeding.

## Troubleshooting

### Service won't start
```bash
# Check logs
docker compose -f docker/compose.prod.yml logs website
docker compose -f docker/compose.prod.yml logs runtime

# Check health
docker inspect --format='{{.State.Health.Status}}' bhavya-website
```

### Build fails
```bash
# Clean and rebuild
docker compose -f docker/compose.prod.yml down
docker compose -f docker/compose.prod.yml build --no-cache
docker compose -f docker/compose.prod.yml up -d
```

### Rollback needed
```bash
# Immediate rollback
node scripts/deploy.js production --rollback

# Or manually
docker compose -f docker/compose.prod.yml down
git checkout v0.9.0-rc1
docker compose -f docker/compose.prod.yml up -d
```

## Health Check Endpoints

- `GET /health` — Nginx health
- `GET /` — Website health (HTTP 200)
- `GET /api/health` — Runtime API health (JSON response)
- `GET /api/ready` — Runtime readiness check

## Monitoring

### Logs
```bash
# All services
docker compose -f docker/compose.prod.yml logs -f

# Specific service
docker compose -f docker/compose.prod.yml logs -f website

# JSON format
docker compose -f docker/compose.prod.yml logs -f --format json
```

### Metrics
```bash
# Runtime metrics (Prometheus format)
curl http://localhost:8080/metrics

# Container stats
docker stats
```

## Environment Variables

See `.env.example` for all configuration options. Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `BASE_URL` | Public URL | `https://bhavya.foundation` |
| `SECRET_KEY` | Application secret | Required |
| `LOG_LEVEL` | Log level | `info` |
| `BACKUP_ENABLED` | Enable backups | `true` |

## Security Notes

- All containers run as non-root user (`bhavya:1001`)
- Secrets should be provided via environment variables or Docker secrets
- Never commit `.env` files to version control
- Use HTTPS in production (configure SSL certificates in `docker/nginx/ssl/`)
