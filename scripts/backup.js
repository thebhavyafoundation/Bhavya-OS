#!/usr/bin/env node
// ============================================================
// Bhavya Foundation — Backup Script
// Creates snapshots of registry, content, and runtime data
// Usage: node scripts/backup.js [type]
// Types: registry, content, runtime, all
// ============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKUP_BASE = process.env.BACKUP_PATH || path.join(process.cwd(), 'backups');
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(BACKUP_BASE, timestamp);

const sources = {
  registry: { path: 'registry', description: 'Registry snapshots' },
  content: { path: 'content', description: 'Content documents' },
  memory: { path: 'memory', description: 'Memory and state' },
  navigation: { path: 'navigation', description: 'Navigation configs' },
  config: { path: 'config', description: 'App configuration' },
  governance: { path: 'governance', description: 'Governance documents' },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createBackup(types) {
  console.log(`\n📦 Creating backup: ${timestamp}\n`);

  ensureDir(backupDir);

  const manifest = {
    timestamp: new Date().toISOString(),
    types: [],
    files: 0,
    size: 0,
  };

  for (const type of types) {
    const source = sources[type];
    if (!source) {
      console.log(`⚠️  Unknown backup type: ${type}`);
      continue;
    }

    const srcPath = path.join(process.cwd(), source.path);
    const destPath = path.join(backupDir, type);

    if (!fs.existsSync(srcPath)) {
      console.log(`⚠️  Source not found: ${source.path}`);
      continue;
    }

    console.log(`   📁 ${source.description}...`);
    copyDir(srcPath, destPath);

    // Count files
    const count = parseInt(execSync(`find "${destPath}" -type f | wc -l`, { encoding: 'utf8' }).trim());
    manifest.types.push({ type, files: count });
    manifest.files += count;

    console.log(`   ✅ ${count} files backed up`);
  }

  // Write manifest
  fs.writeFileSync(
    path.join(backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Calculate total size
  const sizeOutput = execSync(`du -sh "${backupDir}"`, { encoding: 'utf8' }).trim();
  manifest.size = sizeOutput.split('\t')[0];

  console.log(`\n✅ Backup complete: ${backupDir}`);
  console.log(`   Files: ${manifest.files}`);
  console.log(`   Size: ${manifest.size}\n`);

  return backupDir;
}

function cleanOldBackups() {
  if (!fs.existsSync(BACKUP_BASE)) return;

  const entries = fs.readdirSync(BACKUP_BASE);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  let cleaned = 0;
  for (const entry of entries) {
    const entryPath = path.join(BACKUP_BASE, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory() && stat.mtime < cutoff) {
      fs.rmSync(entryPath, { recursive: true });
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🗑️  Cleaned ${cleaned} old backups (>${RETENTION_DAYS} days)`);
  }
}

// Main
const args = process.argv.slice(2);
const type = args[0] || 'all';

const types = type === 'all' ? Object.keys(sources) : [type];
createBackup(types);
cleanOldBackups();
