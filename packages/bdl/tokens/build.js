const fs = require('fs');
const path = require('path');

const tokensPath = path.join(__dirname, 'tokens.json');
const rawData = fs.readFileSync(tokensPath, 'utf8');
const tokens = JSON.parse(rawData);

function generateCSS(tokens) {
  let css = '/* GENERATED FILE - DO NOT EDIT */\n:root {\n';
  
  // Flatten spacing
  for (const [key, value] of Object.entries(tokens.spacing)) {
    css += `  --spacing-${key}: ${value};\n`;
  }

  // Flatten colors for editorial
  css += '}\n\n.theme-editorial {\n';
  for (const [category, values] of Object.entries(tokens.colors.editorial)) {
    for (const [key, value] of Object.entries(values)) {
      css += `  --color-${category}-${key}: ${value};\n`;
    }
  }

  // Flatten colors for institutional
  css += '}\n\n.theme-institutional {\n';
  for (const [category, values] of Object.entries(tokens.colors.institutional)) {
    for (const [key, value] of Object.entries(values)) {
      css += `  --color-${category}-${key}: ${value};\n`;
    }
  }
  
  css += '}\n';
  return css;
}

function generateTS(tokens) {
  return `/* GENERATED FILE - DO NOT EDIT */\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\n`;
}

fs.writeFileSync(path.join(__dirname, 'tokens.css'), generateCSS(tokens));
fs.writeFileSync(path.join(__dirname, 'index.ts'), generateTS(tokens));

console.log('Tokens successfully compiled to CSS and TypeScript.');
