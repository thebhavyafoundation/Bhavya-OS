import { execSync } from 'node:child_process';

const app = process.argv[2];

if (!app) {
  console.error('Usage: node scripts/vercel-build-app.mjs <app-name>');
  process.exit(1);
}

const validApps = [
  'website', 'dashboard', 'forest', 'heritage', 'research',
  'volunteer', 'knowledge', 'library', 'admin', 'docs',
  'transparency', 'design-system', 'bhavya-ai-lab'
];

if (!validApps.includes(app)) {
  console.error(`Invalid app: ${app}. Valid apps: ${validApps.join(', ')}`);
  process.exit(1);
}

console.log(`Building @bhavya/${app}...`);
console.log('Working directory:', process.cwd());

execSync(`pnpm --filter @bhavya/${app === 'admin' ? 'admin-app' : app === 'docs' ? 'docs-app' : app} build`, {
  stdio: 'inherit',
  cwd: process.cwd(),
});

console.log(`Build complete for @bhavya/${app}!`);
