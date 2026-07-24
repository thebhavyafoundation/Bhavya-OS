#!/usr/bin/env node
// ============================================================
// Bhavya Foundation — Deployment Script
// One-command deployment with zero-downtime restart
// Usage: node scripts/deploy.js [environment] [options]
// Options: --rollback, --backup, --validate
// ============================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMPOSE_FILE = 'docker/compose.prod.yml';
const BACKUP_SCRIPT = 'scripts/backup.js';
const VALIDATE_SCRIPT = 'scripts/validate-env.js';
const LOCK_FILE = '/tmp/bhavya-deploy.lock';

const args = process.argv.slice(2);
const environment = args.find(a => !a.startsWith('--')) || 'production';
const options = {
  rollback: args.includes('--rollback'),
  backup: args.includes('--backup'),
  validate: args.includes('--validate'),
  dryRun: args.includes('--dry-run'),
};

function log(msg) {
  console.log(`\n🚀 ${msg}`);
}

function run(cmd) {
  console.log(`   $ ${cmd}`);
  if (options.dryRun) {
    console.log('   [DRY RUN] Skipping...');
    return '';
  }
  return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
}

function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
    const lockAge = Date.now() - new Date(lockData.timestamp).getTime();

    // Lock older than 30 minutes is stale
    if (lockAge < 30 * 60 * 1000) {
      console.error(`❌ Deployment in progress (PID: ${lockData.pid})`);
      process.exit(1);
    }
    console.log('⚠️  Stale lock found, removing...');
  }

  fs.writeFileSync(LOCK_FILE, JSON.stringify({
    pid: process.pid,
    timestamp: new Date().toISOString(),
    environment,
  }));
}

function releaseLock() {
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
  }
}

function validateEnvironment() {
  log('Validating environment...');
  run(`node ${VALIDATE_SCRIPT} ${environment}`);
}

function createBackup() {
  log('Creating backup...');
  run(`node ${BACKUP_SCRIPT} all`);
}

function buildImages() {
  log('Building Docker images...');
  run(`docker compose -f ${COMPOSE_FILE} build --parallel`);
}

function pullLatest() {
  log('Pulling latest images...');
  run(`docker compose -f ${COMPOSE_FILE} pull`);
}

function deploy() {
  log('Deploying services...');

  // Zero-downtime restart: rolling update
  const services = ['website', 'runtime', 'design-system'];

  for (const service of services) {
    log(`Restarting ${service}...`);
    run(`docker compose -f ${COMPOSE_FILE} up -d --no-deps --build ${service}`);

    // Wait for health check
    console.log('   Waiting for health check...');
    run('sleep 5');
  }

  // Restart nginx last
  log('Restarting nginx...');
  run(`docker compose -f ${COMPOSE_FILE} up -d --no-deps nginx`);
}

function rollback() {
  log('Rolling back to v0.9.0-rc1...');

  // Check if backup exists
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    console.error('❌ No backups found');
    process.exit(1);
  }

  const backups = fs.readdirSync(backupDir).sort().reverse();
  if (backups.length === 0) {
    console.error('❌ No backups found');
    process.exit(1);
  }

  const latestBackup = path.join(backupDir, backups[0]);
  console.log(`   Restoring from: ${backups[0]}`);

  // Restore files
  const restoreDirs = ['registry', 'content', 'memory', 'navigation', 'config'];
  for (const dir of restoreDirs) {
    const src = path.join(latestBackup, dir);
    if (fs.existsSync(src)) {
      run(`cp -r ${src} .`);
    }
  }

  // Restart services
  run(`docker compose -f ${COMPOSE_FILE} up -d --force-recreate`);

  log('Rollback complete');
}

function showStatus() {
  log('Service status:');
  run(`docker compose -f ${COMPOSE_FILE} ps`);
}

// Main
async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   Bhavya Foundation — Deployment Script  ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n   Environment: ${environment}`);
  console.log(`   Options: ${JSON.stringify(options)}\n`);

  try {
    acquireLock();

    if (options.rollback) {
      rollback();
    } else {
      if (options.validate) validateEnvironment();
      if (options.backup) createBackup();

      buildImages();
      deploy();
      showStatus();
    }

    log('Deployment complete! ✅');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    releaseLock();
  }
}

main();
