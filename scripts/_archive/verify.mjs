import fs from 'fs';
const ts = fs.readFileSync('apps/ai-institute/src/data/academy-lessons.ts','utf8');
const ids = [...ts.matchAll(/"(llme-\d-\d|agent-\d-\d)":\s*\{/g)].map(m=>m[1]);
console.log('found', ids.length, ids.join(','));
for(const id of ids){
  const re = new RegExp('"'+id+'":[^]*?reading:\\s*`([\\s\\S]*?)`');
  const mm = ts.match(re);
  if(mm){
    const wc = mm[1].trim().split(/\s+/).filter(Boolean).length;
    console.log(id, wc, wc>=400 && wc<=700 ? 'OK' : 'FAIL');
  } else {
    console.log(id, 'NO READING');
  }
}
// also check keyConcepts count etc via simple heuristic
for(const id of ids){
  const blockRe = new RegExp('"'+id+'":\\s*\\{[\\s\\S]*?reflection:\\s*\\{[^}]*\\},\\s*\\n\\s*\\},');
  const m = ts.match(blockRe);
  // just log presence
}
const helperExists = ts.includes('// HELPER FUNCTIONS') && ts.includes('export function getLessonContent');
console.log('helper exists', helperExists);
console.log('lessonContents closes with };', ts.includes('  },\n};\n\n//') || ts.includes('},\n};'));
