import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  AlertCircle,
  Search,
} from 'lucide-react';
import { TUTORIALS } from '../../data/tutorials';
import { TutorialItem } from '../../types';

export const TutorialsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(TUTORIALS[0].id);
  const [search, setSearch] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const activeTutorial = TUTORIALS.find((t) => t.id === selectedId) || TUTORIALS[0];

  const filteredTutorials = TUTORIALS.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-100">Step-by-Step Tutorials</h1>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">
          Comprehensive, copy-pasteable guides covering installation, system hardening, and Linux Mint troubleshooting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tutorial Index List */}
        <div className="md:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter 14 tutorials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredTutorials.map((tut) => {
              const isSelected = tut.id === selectedId;
              return (
                <button
                  key={tut.id}
                  onClick={() => setSelectedId(tut.id)}
                  className={`w-full text-left p-3 rounded-lg border transition text-xs flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold'
                      : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="truncate text-zinc-200 font-medium">{tut.title}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{tut.category}</div>
                  </div>
                  <ChevronRight size={14} className={isSelected ? 'text-emerald-400' : 'text-zinc-400'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Tutorial Details */}
        <div className="md:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-zinc-800 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              {activeTutorial.category}
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mt-1">{activeTutorial.title}</h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{activeTutorial.description}</p>
          </div>

          {/* Steps list */}
          <div className="space-y-5 text-xs">
            {activeTutorial.steps.map((step, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-emerald-500/60 pl-3.5">
                <div className="font-semibold text-zinc-200 text-sm">
                  Step {idx + 1}: {step.title}
                </div>
                <p className="text-zinc-400 leading-relaxed text-xs">{step.description}</p>

                {step.command && (
                  <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Terminal size={12} className="text-emerald-400" />
                        Terminal Command
                      </span>
                      <button
                        onClick={() => handleCopy(step.command!)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                      >
                        {copiedCmd === step.command ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedCmd === step.command ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-emerald-400 text-xs whitespace-pre-wrap select-all">
                      {step.command}
                    </pre>
                  </div>
                )}

                {step.note && (
                  <div className="p-2.5 bg-amber-950/30 rounded border border-amber-800/40 text-amber-300 text-[11px] flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{step.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
