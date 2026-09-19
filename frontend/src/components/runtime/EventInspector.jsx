import React from 'react';

export default function EventInspector({ currentEvent }) {
  if (!currentEvent) {
    return (
      <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border p-4 items-center justify-center text-center text-slate-500 text-xs shadow-xl">
        <span className="material-symbols-outlined text-2xl text-slate-600 mb-1">info</span>
        <p>No event selected</p>
      </div>
    );
  }

  const getEventBadge = (type) => {
    switch (type) {
      case 'PROGRAM_STARTED':
      case 'PROGRAM_COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'OBJECT_CREATED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'FIELD_CHANGED':
      case 'VARIABLE_CHANGED':
      case 'ARRAY_CHANGED':
        return 'bg-blue-500/20 text-sky-300 border-blue-500/30';
      case 'METHOD_ENTER':
      case 'METHOD_EXIT':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'CONDITION_EVALUATED':
      case 'LOOP_ITERATION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'EXCEPTION_THROWN':
      case 'PROGRAM_FAILED':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090D15] border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-base">manage_search</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Event Inspector</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
          Step #{currentEvent.sequence}
        </span>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getEventBadge(currentEvent.eventType)}`}>
            {currentEvent.eventType}
          </span>
          <span className="text-slate-400">line {currentEvent.line}</span>
        </div>

        <p className="text-white font-sans text-xs leading-relaxed bg-[#101624] p-2.5 rounded-lg border border-canvas-border">
          {currentEvent.description}
        </p>

        {/* Metadata Details */}
        {currentEvent.metadata && Object.keys(currentEvent.metadata).length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Event Details
            </span>
            <div className="bg-black/30 p-2 rounded-lg border border-white/[0.04] space-y-1">
              {Object.entries(currentEvent.metadata).map(([key, val]) => {
                if (key === 'whatToCheck' || key === 'rootCause') return null;
                return (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{key}:</span>
                    <span className="text-sky-300 font-semibold">{String(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
