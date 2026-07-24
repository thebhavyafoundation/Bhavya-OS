import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const stdPath = path.resolve(process.cwd(), '../../registry/standards.json');
    const stds = JSON.parse(fs.readFileSync(stdPath, 'utf8'));

    return NextResponse.json({
      version: 'v1',
      generatedAt: new Date().toISOString(),
      data: stds.items
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
