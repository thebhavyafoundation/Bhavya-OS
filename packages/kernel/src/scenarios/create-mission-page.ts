// Scenario 1: Create Mission Page
// Input: "Create a new mission page"
// Output: Real files, navigation, tests, docs, report

import { resolve } from "node:path";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import type {
  ExecutionContext,
  Artifact,
  ExecutionReport,
} from "../types/index.js";

export interface CreatePageInput {
  name: string;
  title: string;
  description: string;
  mission: "forest" | "knowledge" | "heritage" | "community";
  content?: string;
}

export interface CreatePageContext {
  root: string;
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
  };
  memory: { set: (entry: Record<string, unknown>) => Promise<void> };
}

export class CreateMissionPage {
  private ctx: CreatePageContext;

  constructor(ctx: CreatePageContext) {
    this.ctx = ctx;
  }

  async execute(input: CreatePageInput): Promise<ExecutionReport> {
    const startTime = Date.now();
    const executionId = `exec:${crypto.randomUUID()}`;
    const artifacts: Artifact[] = [];
    const events: string[] = [];
    const memoryUpdates: string[] = [];

    const context: ExecutionContext = {
      executionId,
      correlationId: `corr:${crypto.randomUUID()}`,
      retryCount: 0,
      maxRetries: 3,
      state: "running",
      timestamps: { started: new Date(), lastUpdated: new Date() },
      metadata: { scenario: "create-mission-page" },
    };

    try {
      // 1. Create page directory
      const pageDir = resolve(
        this.ctx.root,
        `apps/website/src/app/${input.name}`,
      );
      if (!existsSync(pageDir)) {
        mkdirSync(pageDir, { recursive: true });
      }

      // 2. Generate page component
      const pageContent = this.generatePageComponent(input);
      const pagePath = resolve(pageDir, "page.tsx");
      writeFileSync(pagePath, pageContent);
      artifacts.push({
        path: `apps/website/src/app/${input.name}/page.tsx`,
        action: "created",
        content: pageContent,
        metadata: {},
      });

      // 3. Generate page styles
      const stylesContent = this.generatePageStyles(input);
      const stylesPath = resolve(pageDir, "styles.module.css");
      writeFileSync(stylesPath, stylesContent);
      artifacts.push({
        path: `apps/website/src/app/${input.name}/styles.module.css`,
        action: "created",
        content: stylesContent,
        metadata: {},
      });

      // 4. Update navigation
      const navPath = resolve(this.ctx.root, "navigation/public.json");
      if (existsSync(navPath)) {
        const nav = JSON.parse(readFileSync(navPath, "utf-8"));
        nav.items = nav.items || [];
        nav.items.push({
          label: input.title,
          href: `/${input.name}`,
          mission: input.mission,
        });
        writeFileSync(navPath, JSON.stringify(nav, null, 2));
        artifacts.push({
          path: "navigation/public.json",
          action: "updated",
          metadata: {},
        });
      }

      // 5. Generate metadata
      const metadataContent = this.generateMetadata(input);
      const metadataPath = resolve(pageDir, "metadata.ts");
      writeFileSync(metadataPath, metadataContent);
      artifacts.push({
        path: `apps/website/src/app/${input.name}/metadata.ts`,
        action: "created",
        content: metadataContent,
        metadata: {},
      });

      // 6. Generate test file
      const testContent = this.generateTest(input);
      const testDir = resolve(this.ctx.root, ".tests/unit");
      if (!existsSync(testDir)) mkdirSync(testDir, { recursive: true });
      const testPath = resolve(testDir, `${input.name}.test.tsx`);
      writeFileSync(testPath, testContent);
      artifacts.push({
        path: `.tests/unit/${input.name}.test.tsx`,
        action: "created",
        content: testContent,
        metadata: {},
      });

      // 7. Update memory
      await this.ctx.memory.set({
        type: "project",
        content: `Mission page created: ${input.title} (${input.name})`,
        tags: ["page", "mission", input.mission, "created"],
        source: "create-mission-page",
        confidence: 1,
      });
      memoryUpdates.push(`Page ${input.name} documented in memory`);

      // 8. Emit events
      await this.ctx.events.emit("page.created", {
        name: input.name,
        title: input.title,
        mission: input.mission,
        artifacts: artifacts.length,
      });
      events.push("page.created");

      // 9. Update metrics
      const metricsPath = resolve(this.ctx.root, ".metrics/engineering.json");
      if (existsSync(metricsPath)) {
        const metrics = JSON.parse(readFileSync(metricsPath, "utf-8"));
        metrics.data.commits.total++;
        metrics.data.commits.thisWeek++;
        writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
      }

      context.state = "completed";
      context.timestamps.completed = new Date();

      return {
        executionId,
        tasks: [],
        artifacts,
        events,
        memoryUpdates,
        status: "success",
        duration: Date.now() - startTime,
        timestamp: new Date(),
        context,
      };
    } catch (_error) {
      context.state = "failed";
      context.timestamps.completed = new Date();

      return {
        executionId,
        tasks: [],
        artifacts,
        events,
        memoryUpdates,
        status: "failed",
        duration: Date.now() - startTime,
        timestamp: new Date(),
        context,
      };
    }
  }

  private generatePageComponent(input: CreatePageInput): string {
    return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${input.title} | Bhavya Foundation',
  description: '${input.description}',
};

export default function ${this.toPascalCase(input.name)}Page() {
  return (
    <main className="min-h-screen bg-cream-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-charcoal-black mb-6">
          ${input.title}
        </h1>
        <p className="text-lg text-earth-stone max-w-3xl">
          ${input.description}
        </p>
      </section>
    </main>
  );
}
`;
  }

  private generatePageStyles(input: CreatePageInput): string {
    return `/* ${input.title} Page Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero {
  padding: 6rem 0;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.125rem;
  color: #8B7355;
  max-width: 48rem;
}
`;
  }

  private generateMetadata(input: CreatePageInput): string {
    return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${input.title} | Bhavya Foundation',
  description: '${input.description}',
  openGraph: {
    title: '${input.title}',
    description: '${input.description}',
    type: 'website',
  },
};
`;
  }

  private generateTest(input: CreatePageInput): string {
    return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ${this.toPascalCase(input.name)}Page from './page';

describe('${input.title} Page', () => {
  it('renders correctly', () => {
    render(<${this.toPascalCase(input.name)}Page />);
    expect(screen.getByText('${input.title}')).toBeDefined();
  });

  it('has correct metadata', () => {
    const metadata = require('./metadata');
    expect(metadata.metadata.title).toContain('${input.title}');
  });
});
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  }
}
