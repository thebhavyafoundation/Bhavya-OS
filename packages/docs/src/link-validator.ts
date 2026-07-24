import fs from 'fs';
import path from 'path';

export interface LinkValidationResult {
  valid: boolean;
  brokenLinks: { source: string; target: string }[];
  orphanedNodes: string[];
}

export function validateKnowledgeLinks(repoRoot: string): LinkValidationResult {
  const brokenLinks: { source: string; target: string }[] = [];
  const orphanedNodes: string[] = [];

  const graphPath = path.join(repoRoot, 'registry', 'knowledge-graph.json');
  if (!fs.existsSync(graphPath)) {
    return { valid: false, brokenLinks: [{ source: 'system', target: 'registry/knowledge-graph.json missing' }], orphanedNodes: [] };
  }

  const graphData = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const nodeMap = new Map<string, any>();
  const incomingLinks = new Map<string, number>();

  for (const node of graphData.nodes) {
    nodeMap.set(node.id, node);
    if (!incomingLinks.has(node.id)) incomingLinks.set(node.id, 0);
  }

  for (const node of graphData.nodes) {
    for (const link of node.links) {
      if (!nodeMap.has(link)) {
        brokenLinks.push({ source: node.id, target: link });
      } else {
        incomingLinks.set(link, (incomingLinks.get(link) || 0) + 1);
      }
    }
  }

  for (const [id, count] of incomingLinks.entries()) {
    const node = nodeMap.get(id);
    if (count === 0 && node && node.links.length === 0) {
      orphanedNodes.push(id);
    }
  }

  return {
    valid: brokenLinks.length === 0,
    brokenLinks,
    orphanedNodes,
  };
}
