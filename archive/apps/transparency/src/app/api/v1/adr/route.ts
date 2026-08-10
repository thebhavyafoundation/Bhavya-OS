import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const graphPath = path.resolve(process.cwd(), '../../registry/knowledge-graph.json');
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    const adrs = graph.nodes.filter((n: any) => n.type === 'adr');

    return NextResponse.json({
      version: 'v1',
      generatedAt: new Date().toISOString(),
      data: adrs
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
