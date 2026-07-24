#!/bin/bash
# ============================================================
# Bhavya Foundation — First-Time Server Setup
# Run once after Terraform creates the server
# Usage: ./scripts/server-setup.sh <server-ip>
# ============================================================

set -euo pipefail

SERVER_IP="${1:?Usage: ./scripts/server-setup.sh <server-ip>}"
DEPLOY_PATH="/opt/bhavya"
REPO_URL="https://github.com/bhavya-foundation/bhavya-os.git"

echo "🖥️  Setting up server: $SERVER_IP"

# Copy SSH key
echo "  � copying SSH key..."
ssh-copy_id -i ~/.ssh/id_rsa.pub deploy@"$SERVER_IP" 2>/dev/null || true

# Clone repository
echo "  📦 Cloning repository..."
ssh deploy@"$SERVER_IP" "git clone $REPO_URL $DEPLOY_PATH"

# Copy environment file
echo "  🔑 Setting up environment..."
scp .env.example deploy@"$SERVER_IP":"$DEPLOY_PATH/.env"
echo ""
echo "  ⚠️  Edit $DEPLOY_PATH/.env on the server with production values"

# Install dependencies
echo "  📚 Installing dependencies..."
ssh deploy@"$SERVER_IP" "cd $DEPLOY_PATH && pnpm install --frozen-lockfile"

# Build apps
echo "  🔨 Building applications..."
ssh deploy@"$SERVER_IP" "cd $DEPLOY_PATH && pnpm run build"

# Setup SSL
echo "  🔒 Setting up SSL..."
ssh deploy@"$SERVER_IP" "cd $DEPLOY_PATH && bash scripts/setup-ssl.sh staging.bhavya.foundation admin@bhavya.foundation"

# Start services
echo "  🚀 Starting services..."
ssh deploy@"$SERVER_IP" "cd $DEPLOY_PATH && docker compose -f docker/compose.staging.yml up -d"

# Install cron jobs
echo "  ⏰ Setting up cron jobs..."
ssh deploy@"$SERVER_IP" << 'CRON'
(crontab -l 2>/dev/null; echo "0 2 * * * cd /opt/bhavya && bash scripts/server-backup.sh >> /opt/bhavya/logs/backup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 1 cd /opt/bhavya && docker compose -f docker/compose.staging.yml pull && docker compose -f docker/compose.staging.yml up -d >> /opt/bhavya/logs/update.log 2>&1") | crontab -
CRON

# Verify
echo ""
echo "⏳ Waiting for services..."
sleep 30

STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://staging.bhavya.foundation" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo ""
  echo "✅ Server setup complete!"
  echo "   URL: https://staging.bhavya.foundation"
  echo "   SSH: ssh deploy@$SERVER_IP"
else
  echo ""
  echo "⚠️  Server setup complete but website returning $STATUS"
  echo "   Check logs: ssh deploy@$SERVER_IP 'cd /opt/bhavya && docker compose -f docker/compose.staging.yml logs'"
fi
