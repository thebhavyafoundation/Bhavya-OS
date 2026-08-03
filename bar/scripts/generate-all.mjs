import { execSync } from 'child_process';
import { join } from 'path';

const BAR = join(import.meta.dirname, '..');

console.log('╔══════════════════════════════════════════════════╗');
console.log('║   Bhavya Architecture Registry — Full Generate  ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log('');

function run(script, label) {
  console.log(`\n━━━ ${label} ━━━`);
  try {
    execSync(`node ${join(BAR, 'scripts', script)}`, { stdio: 'inherit', cwd: BAR });
  } catch (e) {
    console.error(`Failed: ${label}`);
    process.exit(1);
  }
}

run('generate-capabilities.mjs', 'Generating capabilities');
run('generate-entities.mjs', 'Generating workflows, skills, agents, services, packages, applications');
run('generate-supporting.mjs', 'Generating events, permissions, KO types, UI surfaces');
run('validate.mjs', 'Running validation');
run('generate-code.mjs', 'Generating TypeScript types, Zod, JSON Schema, OpenAPI');
run('generate-traceability.mjs', 'Generating traceability report');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║          Generation Complete                     ║');
console.log('╚══════════════════════════════════════════════════╝');
