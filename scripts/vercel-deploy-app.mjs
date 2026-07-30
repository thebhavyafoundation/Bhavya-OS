import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const app = process.argv[2];

if (!app) {
  console.error('Usage: node scripts/vercel-deploy-app.mjs <app-name>');
  process.exit(1);
}

const validApps = [
  'website', 'dashboard', 'forest', 'heritage', 'research',
  'volunteer', 'knowledge', 'library', 'admin', 'docs',
  'transparency', 'design-system'
];

if (!validApps.includes(app)) {
  console.error(`Invalid app: ${app}. Valid apps: ${validApps.join(', ')}`);
  process.exit(1);
}

const packageNames = {
  admin: 'admin-app',
  docs: 'docs-app',
};

const packageName = packageNames[app] || app;
const projectName = `bhavya-foundation-${app}`;

// Save original vercel.json
const originalVercel = readFileSync('vercel.json', 'utf-8');

try {
  // Write app-specific vercel.json
  const appVercel = {
    installCommand: 'pnpm install --no-frozen-lockfile',
    buildCommand: `node scripts/vercel-build-app.mjs ${app}`,
    framework: 'nextjs',
    outputDirectory: `apps/${app}/.next`,
  };

  writeFileSync('vercel.json', JSON.stringify(appVercel, null, 2));
  console.log(`Deploying @bhavya/${packageName} as ${projectName}...`);

  // Link project
  try {
    execSync(`vercel link --yes --project ${projectName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch {
    // Project might not exist yet, try to create it
    console.log(`Creating Vercel project ${projectName}...`);
    execSync(`vercel --yes --name ${projectName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  }

  // Deploy
  execSync('vercel deploy --prod --yes', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log(`✓ ${app} deployed successfully!`);
} finally {
  // Restore original vercel.json
  writeFileSync('vercel.json', originalVercel);
  console.log('Restored root vercel.json');
}
