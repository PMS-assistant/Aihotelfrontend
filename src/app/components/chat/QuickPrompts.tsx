import { BrainCircuit } from 'lucide-react';

const PROMPTS = [
  'Why are cancellations high this week?',
  'How is next weekend looking?',
  'Are we underpricing Saturday?',
  "Today's pickup vs last week?",
  'Show me the 7-day revenue forecast',
  "What's today's live snapshot?",
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: 'rgba(124,58,237,0.15)' }}
      >
        <BrainCircuit size={22} style={{ color: '#a78bfa' }} />
      </div>
      <h2 className="text-base mb-1" style={{ color: '#f1f5f9', fontWeight: 600 }}>
        Meridian Intelligence
      </h2>
      <p className="text-sm mb-8 text-center" style={{ color: '#64748b', maxWidth: '320px' }}>
        Ask anything about your hotel's performance, demand signals, or revenue opportunities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-150 hover:border-purple-500/40"
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
