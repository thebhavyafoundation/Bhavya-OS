'use client';

import Link from 'next/link';
import { builders, builderColors } from '@/lib/builders';

interface BuilderCardProps {
  builderId: string;
  onInvoke?: () => void;
  disabled?: boolean;
}

export default function BuilderCard({ builderId, onInvoke, disabled }: BuilderCardProps) {
  const builder = builders.find(b => b.id === builderId);
  if (!builder) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${builderColors[builderId] || 'bg-gray-500'} flex items-center justify-center text-white text-lg`}>
            {builder.icon === 'book' && '📖'}
            {builder.icon === 'clipboard-check' && '✅'}
            {builder.icon === 'graduation-cap' && '🎓'}
            {builder.icon === 'file-text' && '📄'}
            {builder.icon === 'globe' && '🌐'}
            {builder.icon === 'video' && '🎬'}
            {builder.icon === 'presentation' && '📽️'}
            {builder.icon === 'file' && '📑'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{builder.name}</h3>
            <p className="text-sm text-gray-500">{builder.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {builder.capability.replace('_', ' ')}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {builder.inputType} → {builder.outputType}
        </span>
      </div>
      {onInvoke && (
        <button
          onClick={onInvoke}
          disabled={disabled}
          className="mt-3 w-full py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Run Builder
        </button>
      )}
    </div>
  );
}
