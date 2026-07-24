#!/bin/bash
# ============================================================
# Bhavya Foundation — Quick Rollback
# Rolls back to the previous backup
# Usage: ./scripts/server-rollback.sh [backup-timestamp]
# ============================================================

set -euo pipefail

DEPLOY_PATH="/opt/bhavya"
BACKUP_PATH="$DEPLOY_PATH/backups"
COMPOSE_FILE="docker/compose.staging.yml"

# Find backup to restore
if [ -n "${1:-}" ]; then
  BACKUP_DIR="$BACKUP_PATH/$1"
else
  # Get latest backup
  BACKUP_DIR=$(ls -1d "$BACKUP_PATH"/*/ 2>/dev/null | sort -r | head -1)
fi

if [ -z "$BACKUP_DIR" ] || [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ No backup found to restore"
  echo "Available backups:"
  ls -1 "$BACKUP_PATH" 2>/dev/null || echo "  (none)"
  exit 1
fi

echo "🔄 Rolling back to: $(basename "$BACKUP_DIR")"
echo ""

# Show manifest
if [ -f "$BACKUP_DIR/manifest.json" ]; then
  echo "📋 Backup manifest:"
  cat "$BACKUP_DIR/manifest.json"
  echo ""
fi

# Restore directories
for dir in registry content governance memory navigation config; do
  if [ -d "$BACKUP_DIR/$dir" ]; then
    echo "  📁 Restoring $dir..."
    rm -rf "$DEPLOY_PATH/$dir"
    cp -r "$BACKUP_DIR/$dir" "$DEPLOY_PATH/$dir"
  fi
done

# Restore .env if backed up
if [ -f "$BACKUP_DIR/.env" ]; then
  echo "  📁 Restoring .env..."
  cp "$BACKUP_DIR/.env" "$DEPLOY_PATH/.env"
fi

# Restart services
echo ""
echo "🔄 Restarting services..."
cd "$DEPLOY_PATH"
docker compose -f "$COMPOSE_FILE" up -d --force-recreate

# Wait for health
echo ""
echo "⏳ Waiting for services to become healthy..."
sleep 20

# Verify
STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://staging.bhavya.foundation" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "✅ Rollback complete — website responding with $STATUS"
else
  echo "⚠️  Website returning $STATUS — manual verification recommended"
fi
