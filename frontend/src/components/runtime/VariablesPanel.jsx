import React from 'react';

export default function VariablesPanel({ variables = [], highlightedVariable, onHoverObject }) {
  return (
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090D15] border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">data_object</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Local Variables</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {variables.length} active
        </span>
      </div>

      {/* Variables List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-xs">
        {variables.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-6 text-center">
            <p>No local variables declared in current frame</p>
          </div>
        ) : (
          variables.map((v) => {
            const isHighlighted = highlightedVariable === v.name;

            return (
              <div
                key={v.name}
                onMouseEnter={() => v.targetObjectId && onHoverObject && onHoverObject(v.targetObjectId)}
                onMouseLeave={() => onHoverObject && onHoverObject(null)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg border transition-all ${
                  isHighlighted
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-sm'
                    : 'bg-[#101624] border-canvas-border hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">{v.type}</span>
                  <span className="text-white font-bold">{v.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {v.isReference ? (
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      {v.displayValue}
                    </span>
                  ) : v.type === 'null' ? (
                    <span className="text-red-400 font-semibold italic">null</span>
                  ) : (
                    <span className="text-sky-300 font-semibold">{v.displayValue}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
