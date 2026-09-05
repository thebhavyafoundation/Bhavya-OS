import fs from 'fs';
const s=fs.readFileSync('F:/Bhavya Foundation/apps/ai-institute/src/data/academy-lessons.ts','utf8');
// Extract lessonContents object via regex? Instead import via dynamic?
// Use simple parsing: count words
import { createRequire } from 'module';
const text = s;
// Find all reading blocks
const readingRegex = /reading:\s*`([\s\S]*?)`/g;
let m, idx=0;
const ids = ["math-1-1","math-1-2","math-1-3","math-2-1","math-2-2","math-2-3","math-3-1","math-3-2","math-3-3","ml-1-1","ml-1-2","ml-1-3","ml-2-1","ml-2-2","ml-2-3","ml-3-1","ml-3-2","ml-3-3"];
let readings = [];
while(m=readingRegex.exec(text)){ readings.push(m[1]); }
console.log('total readings found', readings.length);
// Now check each required id exists
for(const id of ids){
  if(!text.includes(`"${id}"`)) console.log('MISSING',id);
  else console.log('found',id);
}
// Word counts for those ids: find reading for each
for(const id of ids){
  const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?reading:\\s*\`([\\s\\S]*?)\``, 'm');
  const match = text.match(re);
  if(match){
    const words = match[1].trim().split(/\s+/).length;
    console.log(id, 'words', words, words>=400 && words<=700 ? 'OK' : 'OUT OF RANGE');
  }
}
// Check helper position: ensure math/ml appear before HELPER FUNCTIONS
let helperIdx = text.indexOf('// HELPER FUNCTIONS');
let mathIdx = text.indexOf('"math-1-1"');
console.log('helper after math?', helperIdx > mathIdx);
let lastMlIdx = text.indexOf('"ml-3-3"');
console.log('helper after ml?', helperIdx > lastMlIdx);
// Check keyConcepts etc via simple presence
for(const id of ids){
  const blockRe = new RegExp(`"${id}":[\\s\\S]*?keyConcepts:[\\s\\S]*?examples:[\\s\\S]*?exercises:[\\s\\S]*?reflection:`, 'm');
  console.log(id, 'structure', blockRe.test(text) ? 'ok' : 'fail');
}
