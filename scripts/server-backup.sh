#!/bin/bash
# ============================================================
# Bhavya Foundation — Automated Backup
# Runs on server via cron or manually
# Usage: ./scripts/server-backup.sh
# ============================================================

set -euo pipefail

DEPLOY_PATH="/opt/bhavya"
BACKUP_PATH="$DEPLOY_PATH/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y-%m-%dT%H-%M-%S)
BACKUP_DIR="$BACKUP_PATH/$TIMESTAMP"

echo "📦 Creating backup: $TIMESTAMP"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup registry
echo "  📁 Registry..."
cp -r "$DEPLOY_PATH/registry" "$BACKUP_DIR/registry"

# Backup content
echo "  📁 Content..."
cp -r "$DEPLOY_PATH/content" "$BACKUP_DIR/content"

# Backup governance
echo "  📁 Governance..."
cp -r "$DEPLOY_PATH/governance" "$BACKUP_DIR/governance"

# Backup memory
echo "  📁 Memory..."
cp -r "$DEPLOY_PATH/memory" "$BACKUP_DIR/memory"

# Backup navigation
echo "  📁 Navigation..."
cp -r "$DEPLOY_PATH/navigation" "$BACKUP_DIR/navigation"

# Backup config
echo "  📁 Config..."
cp -r "$DEPLOY_PATH/config" "$BACKUP_DIR/config"

# Backup environment
echo "  📁 Environment..."
cp "$DEPLOY_PATH/.env" "$BACKUP_DIR/.env" 2>/dev/null || true

# Create manifest
cat > "$BACKUP_DIR/manifest.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "type": "server-backup",
  "hostname": "$(hostname)",
  "git_sha": "$(cd "$DEPLOY_PATH" && git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_tag": "$(cd "$DEPLOY_PATH" && git describe --tags --always 2>/dev/null || echo 'unknown')"
}
EOF

# Calculate size
SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo ""
echo "✅ Backup complete: $BACKUP_DIR"
echo "   Size: $SIZE"

# Clean old backups
echo ""
echo "🗑️  Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_PATH" -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
REMAINING=$(ls -1 "$BACKUP_PATH" | wc -l)
echo "   Backups remaining: $REMAINING"

# Upload to DigitalOcean Spaces (if configured)
if command -v s3cmd &> /dev/null && [ -f "$DEPLOY_PATH/.s3cfg" ]; then
  echo ""
  echo "☁️  Uploading to DigitalOcean Spaces..."
  s3cmd sync "$BACKUP_DIR" "s3://bhavya-backups/$TIMESTAMP/" --config="$DEPLOY_PATH/.s3cfg"
  echo "   ✅ Uploaded to s3://bhavya-backups/$TIMESTAMP/"
fi
