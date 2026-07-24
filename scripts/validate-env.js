#!/usr/bin/env node
// ============================================================
// Bhavya Foundation — Environment Validation
// Validates all required environment variables before startup
// Usage: node scripts/validate-env.js [environment]
// ============================================================

const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || process.env.NODE_ENV || 'development';

const schemas = {
  development: {
    required: ['NODE_ENV', 'BASE_URL'],
    optional: ['RUNTIME_PORT', 'LOG_LEVEL', 'AI_GATEWAY_URL'],
  },
  production: {
    required: [
      'NODE_ENV',
      'BASE_URL',
      'SECRET_KEY',
      'JWT_SECRET',
      'COOKIE_SECRET',
    ],
    optional: [
      'RUNTIME_PORT',
      'LOG_LEVEL',
      'DATABASE_URL',
      'REDIS_URL',
      'AI_GATEWAY_URL',
      'BACKUP_ENABLED',
    ],
  },
  staging: {
    required: ['NODE_ENV', 'BASE_URL', 'SECRET_KEY'],
    optional: ['JWT_SECRET', 'COOKIE_SECRET', 'LOG_LEVEL'],
  },
};

const defaults = {
  NODE_ENV: 'development',
  BASE_URL: 'http://localhost:3000',
  RUNTIME_PORT: '8080',
  LOG_LEVEL: 'info',
  LOG_FORMAT: 'json',
  AI_GATEWAY_URL: 'http://localhost:8082',
  BACKUP_ENABLED: 'true',
  BACKUP_INTERVAL: '3600',
  BACKUP_RETENTION_DAYS: '30',
  ENABLE_SEARCH: 'true',
  ENABLE_LOCALIZATION: 'true',
  ENABLE_DOCUMENTS: 'true',
  ENABLE_NOTIFICATIONS: 'true',
};

function validateEnvironment(env) {
  const schema = schemas[env] || schemas.development;
  const errors = [];
  const warnings = [];

  // Check required variables
  for (const key of schema.required) {
    if (!process.env[key]) {
      errors.push(`Missing required: ${key}`);
    }
  }

  // Check optional variables (warn if missing)
  for (const key of schema.optional) {
    if (!process.env[key]) {
      warnings.push(`Missing optional: ${key}`);
    }
  }

  // Validate specific values
  if (process.env.NODE_ENV && !['development', 'production', 'staging'].includes(process.env.NODE_ENV)) {
    errors.push(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  }

  if (process.env.BASE_URL && !process.env.BASE_URL.startsWith('http')) {
    errors.push(`BASE_URL must start with http:// or https://`);
  }

  if (process.env.RUNTIME_PORT) {
    const port = parseInt(process.env.RUNTIME_PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push(`Invalid RUNTIME_PORT: ${process.env.RUNTIME_PORT}`);
    }
  }

  return { errors, warnings };
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return false;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  return true;
}

// Main
console.log(`\n🔍 Validating environment: ${environment}\n`);

// Load .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (loadEnvFile(envPath)) {
  console.log('✅ Loaded .env file');
} else {
  console.log('⚠️  No .env file found, using environment variables');
}

// Apply defaults
for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

// Validate
const { errors, warnings } = validateEnvironment(environment);

// Report
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  for (const w of warnings) {
    console.log(`   ${w}`);
  }
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  for (const e of errors) {
    console.log(`   ${e}`);
  }
  console.log('\n💥 Environment validation failed!\n');
  process.exit(1);
}

console.log('\n✅ Environment validation passed!\n');

// Print current config (sanitized)
console.log('📋 Current configuration:');
const sensitiveKeys = ['SECRET_KEY', 'JWT_SECRET', 'COOKIE_SECRET', 'DATABASE_URL', 'SMTP_PASS'];
for (const key of Object.keys(defaults).concat(schema?.required || []).sort()) {
  const value = process.env[key];
  if (value) {
    const display = sensitiveKeys.includes(key) ? '***' : value;
    console.log(`   ${key}=${display}`);
  }
}

console.log('');
process.exit(0);
