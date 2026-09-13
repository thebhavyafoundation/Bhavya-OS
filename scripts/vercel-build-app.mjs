import { execSync } from 'node:child_process';

const app = process.argv[2];

if (!app) {
  console.error('Usage: node scripts/vercel-build-app.mjs <app-name>');
  process.exit(1);
}

const validApps = [
  'ai-institute', 'admin', 'docs', 'design-system',
  'github-os', 'ioc', 'social-os', 'bhavya-intelligence-network'
];

if (!validApps.includes(app)) {
  console.error(`Invalid app: ${app}. Valid apps: ${validApps.join(', ')}`);
  process.exit(1);
}

// Package name mapping for apps with non-standard names
const packageMap = {
  'admin': 'admin-app',
  'docs': 'docs-app',
  'design-system': 'design-system-app',
  'github-os': 'app-github-os',
  'ioc': 'app-ioc',
  'social-os': 'app-social-os',
};

const packageName = packageMap[app] || app;

console.log(`Building @bhavya/${packageName}...`);
console.log('Working directory:', process.cwd());

execSync(`pnpm --filter @bhavya/${packageName} build`, {
  stdio: 'inherit',
  cwd: process.cwd(),
});

console.log(`Build complete for @bhavya/${packageName}!`);
