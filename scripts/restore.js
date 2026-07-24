#!/usr/bin/env node
// ============================================================
// Bhavya Foundation — Restore Script
// Restores from a backup snapshot
// Usage: node scripts/restore.js [backup-timestamp]
// ============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKUP_BASE = process.env.BACKUP_PATH || path.join(process.cwd(), 'backups');
const timestamp = process.argv[2];

function log(msg) {
  console.log(`\n🔄 ${msg}`);
}

function run(cmd) {
  console.log(`   $ ${cmd}`);
  return execSync(cmd, { encoding: 'utf8' });
}

function listBackups() {
  if (!fs.existsSync(BACKUP_BASE)) {
    console.log('No backups found');
    return [];
  }

  return fs.readdirSync(BACKUP_BASE).sort().reverse();
}

function restoreBackup(timestamp) {
  const backupDir = path.join(BACKUP_BASE, timestamp);

  if (!fs.existsSync(backupDir)) {
    console.error(`❌ Backup not found: ${timestamp}`);
    process.exit(1);
  }

  // Read manifest
  const manifestPath = path.join(backupDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`   Timestamp: ${manifest.timestamp}`);
    console.log(`   Files: ${manifest.files}`);
    console.log(`   Size: ${manifest.size}`);
  }

  // Restore directories
  const restoreDirs = ['registry', 'content', 'memory', 'navigation', 'config', 'governance'];

  for (const dir of restoreDirs) {
    const src = path.join(backupDir, dir);
    if (fs.existsSync(src)) {
      log(`Restoring ${dir}...`);

      // Backup current state first
      const currentDir = path.join(process.cwd(), dir);
      if (fs.existsSync(currentDir)) {
        const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        execSync(`cp -r ${currentDir} ${currentDir}.bak.${backupTimestamp}`);
      }

      // Restore
      execSync(`cp -r ${src} ${path.join(process.cwd(), dir)}`);
      console.log(`   ✅ ${dir} restored`);
    }
  }

  log('Verifying restore...');
  execSync('node scripts/validate-env.js production');

  log('Restore complete! Restart services to apply changes.');
}

// Main
const backups = listBackups();

if (backups.length === 0) {
  console.log('No backups available');
  process.exit(1);
}

if (!timestamp) {
  console.log('\nAvailable backups:\n');
  backups.forEach((b, i) => {
    const manifestPath = path.join(BACKUP_BASE, b, 'manifest.json');
    let info = '';
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      info = ` (${manifest.files} files, ${manifest.size})`;
    }
    console.log(`  ${i + 1}. ${b}${info}`);
  });
  console.log(`\nUsage: node scripts/restore.js <timestamp>`);
  process.exit(0);
}

restoreBackup(timestamp);
