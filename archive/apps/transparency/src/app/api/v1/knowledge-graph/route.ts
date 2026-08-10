import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const kgPath = path.resolve(process.cwd(), '../../registry/knowledge-graph.json');
    const kg = JSON.parse(fs.readFileSync(kgPath, 'utf8'));

    return NextResponse.json({
      version: 'v1',
      generatedAt: new Date().toISOString(),
      data: kg
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
