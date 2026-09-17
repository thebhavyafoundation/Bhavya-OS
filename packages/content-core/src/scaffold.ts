#!/usr/bin/env node

// ── Scaffolding CLI ──────────────────────────────────────
// Helps developers create new missions, pages, API routes, and content.
// Run: pnpm scaffold

import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../..");

// ── Helpers ──────────────────────────────────────────────

function ensureDir(dirPath: string): void {
  const full = path.join(ROOT, dirPath);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
}

function write_file(filePath: string, content: string): void {
  const full = path.join(ROOT, filePath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content);
  console.log(`  ✓ Created ${filePath}`);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

// ── Mission Scaffolding ──────────────────────────────────

function createMission(name: string, port: number): void {
  const kebab = toKebabCase(name);
  const pascal = toPascalCase(name);
  const appDir = `apps/${kebab}`;

  console.log(`\n  Creating mission: ${pascal}\n`);

  // package.json
  write_file(
    `${appDir}/package.json`,
    `{
  "name": "@bhavya/${kebab}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port ${port}",
    "build": "next build",
    "start": "next start --port ${port}",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@bhavya/content-core": "workspace:*",
    "@bhavya/ui": "workspace:*",
    "next": "15.5.20",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@bhavya/eslint": "workspace:*",
    "@bhavya/typescript": "workspace:*"
  }
}`,
  );

  // tsconfig.json
  write_file(
    `${appDir}/tsconfig.json`,
    `{
  "extends": "@bhavya/typescript/next.config.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
  );

  // next.config.ts
  write_file(
    `${appDir}/next.config.ts`,
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bhavya/content-core", "@bhavya/ui"],
};

export default nextConfig;`,
  );

  // Layout
  write_file(
    `${appDir}/src/app/layout.tsx`,
    `import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "${pascal} — Bhavya Foundation",
  description: "Bhavya Foundation ${pascal} Mission",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}`,
  );

  // Page
  write_file(
    `${appDir}/src/app/page.tsx`,
    `import { getDocuments } from "@bhavya/content-core";

export default function ${pascal}Dashboard() {
  const docs = getDocuments();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">${pascal} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Documents</h2>
          <p className="text-3xl font-bold text-green-600">{docs.length}</p>
        </div>
      </div>
    </div>
  );
}`,
  );

  // Sidebar component
  write_file(
    `${appDir}/src/components/Sidebar.tsx`,
    `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-8">${pascal}</h1>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={\`block px-4 py-2 rounded mb-1 \${
              pathname === link.href ? "bg-green-600" : "hover:bg-gray-800"
            }\`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}`,
  );

  console.log(`\n  Mission ${pascal} created at ${appDir}/`);
  console.log(`  Run: pnpm dev --filter=@bhavya/${kebab}\n`);
}

// ── Page Scaffolding ─────────────────────────────────────

function createPage(app: string, page: string): void {
  const kebab = toKebabCase(page);
  const pascal = toPascalCase(page);
  const appDir = `apps/${app}`;
  const pageDir = `${appDir}/src/app/${kebab}`;

  console.log(`\n  Creating page: ${pascal} in ${app}\n`);

  write_file(
    `${pageDir}/page.tsx`,
    `export default function ${pascal}Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">${pascal}</h1>
      <p className="text-gray-600">Page content goes here.</p>
    </div>
  );
}`,
  );

  console.log(`\n  Page created at ${pageDir}/\n`);
}

// ── API Route Scaffolding ────────────────────────────────

function createApiRoute(app: string, route: string): void {
  const kebab = toKebabCase(route);
  const pascal = toPascalCase(route);
  const appDir = `apps/${app}`;
  const routeDir = `${appDir}/src/app/api/${kebab}`;

  console.log(`\n  Creating API route: /api/${kebab} in ${app}\n`);

  write_file(
    `${routeDir}/route.ts`,
    `import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: Implement GET /api/${kebab}
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Implement POST /api/${kebab}
    return NextResponse.json({ success: true, data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}`,
  );

  console.log(`\n  API route created at ${routeDir}/\n`);
}

// ── Document Scaffolding ─────────────────────────────────

function createDocument(category: string, title: string): void {
  const kebab = toKebabCase(title);
  const id = `${category.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  console.log(`\n  Creating document: ${title}\n`);

  if (category === "rfc") {
    write_file(
      `rfcs/${kebab}.md`,
      `# ${title}

**Status:** draft
**Date:** ${new Date().toISOString().split("T")[0]}
**Author:** Your Name

## Summary

Brief description of this RFC.

## Motivation

Why this change is needed.

## Proposed Solution

Detailed description of the proposed approach.

## Alternatives Considered

Other approaches that were evaluated.

## Implementation Plan

Phased approach to implementation.`,
    );
  } else if (category === "standard") {
    write_file(
      `standards/${kebab}.md`,
      `# ${title}

**Status:** draft
**Date:** ${new Date().toISOString().split("T")[0]}
**Owner:** Engineering Team

## Purpose

Define standards for ${title.toLowerCase()}.

## Requirements

### Requirement 1

Description of first requirement.

### Requirement 2

Description of second requirement.

## Implementation

How to implement these standards.`,
    );
  } else if (category === "adr") {
    const adrDir = path.join(ROOT, "docs/adr");
    const existing = fs.existsSync(adrDir) ? fs.readdirSync(adrDir) : [];
    const maxNum = existing.reduce((max, f) => {
      const m = f.match(/^ADR-(\d+)/);
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    const adrId = `ADR-${String(maxNum + 1).padStart(3, "0")}`;
    write_file(
      `docs/adr/${adrId}-${toKebabCase(title)}.md`,
      `# ${adrId}: ${title}

**Status:** Proposed | **Date:** ${new Date().toISOString().split("T")[0]} | **Deciders:**

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Alternatives Considered

## Consequences

What becomes easier or more difficult to do because of this change?`,
    );
  }

  console.log(`\n  Document created with ID: ${id}\n`);
}

// ── Entity Scaffolding ───────────────────────────────────

function createEntity(type: string, name: string): void {
  const kebab = toKebabCase(name);
  const id = `entity-${kebab}`;

  console.log(`\n  Creating entity: ${name}\n`);

  console.log(`  Entity ID: ${id}`);
  console.log(`  Type: ${type}`);
  console.log(`  Name: ${name}`);
  console.log(`\n  Add to data/entities.json manually or via API.\n`);
}

// ── CLI ──────────────────────────────────────────────────

function showHelp(): void {
  console.log(`
  Bhavya Foundation — Scaffolding CLI

  Usage:
    pnpm scaffold <command> [options]

  Commands:
    mission <name> <port>     Create a new mission app
    page <app> <page>         Create a new page in an app
    api <app> <route>         Create a new API route in an app
    document <category> <title>  Create a new document (rfc|standard|adr)
    entity <type> <name>      Create a new entity

  Examples:
    pnpm scaffold mission forest 3003
    pnpm scaffold page volunteer skills
    pnpm scaffold api volunteer certifications
    pnpm scaffold document rfc "New Feature Proposal"
    pnpm scaffold document standard "Code Review Process"
    pnpm scaffold document adr "Use PostgreSQL for Production"
    pnpm scaffold entity technology "AI Gateway"
  `);
}

// ── Main ─────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "mission":
    if (args.length < 3) {
      console.error("  Usage: pnpm scaffold mission <name> <port>");
      process.exit(1);
    }
    createMission(args[1], parseInt(args[2], 10));
    break;

  case "page":
    if (args.length < 3) {
      console.error("  Usage: pnpm scaffold page <app> <page>");
      process.exit(1);
    }
    createPage(args[1], args[2]);
    break;

  case "api":
    if (args.length < 3) {
      console.error("  Usage: pnpm scaffold api <app> <route>");
      process.exit(1);
    }
    createApiRoute(args[1], args[2]);
    break;

  case "document":
    if (args.length < 3) {
      console.error("  Usage: pnpm scaffold document <category> <title>");
      process.exit(1);
    }
    createDocument(args[1], args[2]);
    break;

  case "entity":
    if (args.length < 3) {
      console.error("  Usage: pnpm scaffold entity <type> <name>");
      process.exit(1);
    }
    createEntity(args[1], args[2]);
    break;

  case "help":
  case undefined:
    showHelp();
    break;

  default:
    console.error(`  Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
