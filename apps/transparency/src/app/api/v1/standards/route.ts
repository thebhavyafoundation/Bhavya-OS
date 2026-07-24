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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
