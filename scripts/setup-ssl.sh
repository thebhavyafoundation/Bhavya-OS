#!/bin/bash
# ============================================================
# Bhavya Foundation — Setup SSL with Let's Encrypt
# Run once on the server after first deployment
# ============================================================

set -euo pipefail

DOMAIN="${1:-staging.bhavya.foundation}"
EMAIL="${2:-admin@bhavya.foundation}"
DEPLOY_PATH="/opt/bhavya"
COMPOSE_FILE="docker/compose.staging.yml"

echo "🔒 Setting up SSL for $DOMAIN"

# Stop nginx temporarily
cd "$DEPLOY_PATH"
docker compose -f "$COMPOSE_FILE" stop nginx

# Get certificate
docker run --rm \
  -v "$DEPLOY_PATH/docker/nginx/ssl:/etc/letsencrypt" \
  -v "$DEPLOY_PATH/docker/nginx/certbot:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# Update SSL config with correct domain
sed -i "s/staging.bhavya.foundation/$DOMAIN/g" \
  "$DEPLOY_PATH/docker/nginx/conf.d/ssl.conf"

# Restart nginx
docker compose -f "$COMPOSE_FILE" up -d nginx

echo "✅ SSL configured for $DOMAIN"
echo "   Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "   Key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"

# Set up auto-renewal
echo ""
echo "Auto-renewal is configured via the certbot service in compose.staging.yml"
echo "Certificates will be renewed every 12 hours"
