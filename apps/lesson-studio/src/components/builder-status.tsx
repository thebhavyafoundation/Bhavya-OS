'use client';

interface BuilderStatusProps {
  status: {
    id: string;
    capability: string;
    builder: string;
    status: string;
    progress: number;
    steps: { name: string; status: string; duration?: number }[];
    qualityGates: { gate: string; status: string; checks: { name: string; status: string; message?: string }[] }[];
  };
}

export default function BuilderStatus({ status }: BuilderStatusProps) {
  const colorMap: Record<string, string> = {
    queued: 'bg-gray-500',
    running: 'bg-blue-500 animate-pulse',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Build #{status.id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {status.capability} → {status.builder}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colorMap[status.status]}`} />
          <span className="text-sm font-medium capitalize text-gray-700">{status.status}</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            status.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${status.progress}%` }}
        />
      </div>

      <div className="space-y-1">
        {status.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${
              step.status === 'completed' ? 'bg-green-500' :
              step.status === 'running' ? 'bg-blue-500 animate-pulse' :
              step.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
            }`} />
            <span className={step.status === 'completed' ? 'text-gray-700' : 'text-gray-500'}>
              {step.name}
            </span>
            {step.duration && (
              <span className="text-xs text-gray-400">({step.duration}ms)</span>
            )}
          </div>
        ))}
      </div>

      {status.qualityGates.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quality Gates</h4>
          {status.qualityGates.map((gate, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  gate.status === 'passed' ? 'bg-green-500' :
                  gate.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-gray-700">{gate.gate}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  gate.status === 'passed' ? 'bg-green-100 text-green-700' :
                  gate.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{gate.status}</span>
              </div>
              {gate.checks.filter(c => c.status !== 'passed').map((check, j) => (
                <p key={j} className="text-xs text-gray-500 ml-4 mt-0.5">{check.name}: {check.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
