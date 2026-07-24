import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const relPath = path.resolve(process.cwd(), '../../memory/releases/_meta.json');
    const rels = JSON.parse(fs.readFileSync(relPath, 'utf8'));

    return NextResponse.json({
      version: 'v1',
      generatedAt: new Date().toISOString(),
      data: rels.records
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
