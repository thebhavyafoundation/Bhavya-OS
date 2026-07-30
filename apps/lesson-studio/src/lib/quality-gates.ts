const gates = [
  { id: 'structure', label: 'Structure Check', icon: 'check-circle' },
  { id: 'content', label: 'Content Quality', icon: 'star' },
  { id: 'accessibility', label: 'Accessibility', icon: 'eye' },
  { id: 'grade-level', label: 'Grade Appropriateness', icon: 'bar-chart' },
  { id: 'outcomes', label: 'Learning Outcomes', icon: 'target' },
  { id: 'integrity', label: 'Registry Integrity', icon: 'shield' },
];

export interface GateResult {
  id: string;
  status: 'passed' | 'warning' | 'failed';
  checks: { name: string; status: string; message?: string }[];
}

export function getGatesForBuilder(builderId: string): string[] {
  const map: Record<string, string[]> = {
    lesson: ['structure', 'content', 'grade-level', 'outcomes', 'integrity'],
    assessment: ['structure', 'content', 'grade-level', 'outcomes'],
    'teacher-guide': ['structure', 'content'],
    workbook: ['structure', 'content', 'grade-level'],
    website: ['structure', 'accessibility', 'integrity'],
    video: ['structure', 'content', 'accessibility'],
    slides: ['structure', 'accessibility'],
    pdf: ['structure'],
  };
  return map[builderId] || gates.map(g => g.id);
}

export function getGateLabel(id: string): string {
  return gates.find(g => g.id === id)?.label || id;
}

export function getGateIcon(id: string): string {
  return gates.find(g => g.id === id)?.icon || 'check-circle';
}

export function gateStatusColor(status: string): string {
  switch (status) {
    case 'passed': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'failed': return 'text-red-600';
    default: return 'text-gray-400';
  }
}

export function checkColor(status: string): string {
  switch (status) {
    case 'passed': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
