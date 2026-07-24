const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Error: Please provide a component name. Example: pnpm bdl:create Button');
  process.exit(1);
}

const primitivesDir = path.join(__dirname, '..', 'primitives', componentName);

if (fs.existsSync(primitivesDir)) {
  console.error(`Error: Component ${componentName} already exists.`);
  process.exit(1);
}

fs.mkdirSync(primitivesDir, { recursive: true });

const files = {
  [`${componentName}.tsx`]: `import * as React from 'react';\nimport { ${componentName}Props } from './${componentName}.types';\nimport './${componentName}.tokens';\n\nexport const ${componentName} = React.forwardRef<HTMLElement, ${componentName}Props>(({ className, ...props }, ref) => {\n  return (\n    <div ref={ref as any} className={\`bdl-${componentName.toLowerCase()} \${className || ''}\`} {...props}>\n      {props.children}\n    </div>\n  );\n});\n\n${componentName}.displayName = '${componentName}';\n`,
  [`${componentName}.types.ts`]: `import * as React from 'react';\n\nexport interface ${componentName}Props extends React.HTMLAttributes<HTMLElement> {\n  /** Add semantic props here */\n}\n`,
  [`${componentName}.tokens.ts`]: `/* Token mapping for ${componentName} */\n`,
  [`${componentName}.test.tsx`]: `import { render } from '@testing-library/react';\nimport { ${componentName} } from './${componentName}';\n\ndescribe('${componentName}', () => {\n  it('renders correctly', () => {\n    const { container } = render(<${componentName} />);\n    expect(container).toBeInTheDocument();\n  });\n});\n`,
  [`${componentName}.stories.tsx`]: `import type { Meta, StoryObj } from '@storybook/react';\nimport { ${componentName} } from './${componentName}';\n\nconst meta: Meta<typeof ${componentName}> = {\n  title: 'Primitives/${componentName}',\n  component: ${componentName},\n};\nexport default meta;\n\ntype Story = StoryObj<typeof ${componentName}>;\nexport const Default: Story = {};\n`,
  [`${componentName}.docs.mdx`]: `# ${componentName}\n\n## Purpose\n\n## Anatomy\n`,
  [`${componentName}.accessibility.ts`]: `/* Accessibility checks for ${componentName} */\n`,
  [`${componentName}.spec.ts`]: `/* Visual regression specification for ${componentName} */\n`,
  [`index.ts`]: `export * from './${componentName}';\nexport * from './${componentName}.types';\n`,
  [`metadata.json`]: `{\n  "name": "${componentName}",\n  "category": "Primitive",\n  "version": "1.0.0",\n  "status": "Draft",\n  "since": "BDL 0.2",\n  "accessibility": "AA",\n  "owner": "BDL Team"\n}\n`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(primitivesDir, filename), content);
}

// Update Manifest Placeholder
console.log(`\n✅ Scaffolded ${componentName} in packages/bdl/primitives/${componentName}`);
console.log(`✅ Generated 10 strict files complying with BPS-002.`);
