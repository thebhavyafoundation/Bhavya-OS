import { execSync } from 'node:child_process';

console.log('Building Bhavya Foundation website...');
console.log('Working directory:', process.cwd());

// Build only the website package
execSync('pnpm --filter @bhavya/website build', {
  stdio: 'inherit',
  cwd: process.cwd(),
});

console.log('Build complete!');
