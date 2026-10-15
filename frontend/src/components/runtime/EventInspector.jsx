import React from 'react';

export default function EventInspector({ currentEvent }) {
  if (!currentEvent) {
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] p-4 items-center justify-center text-center text-[#5C6672] text-xs shadow-card">
        <span className="material-symbols-outlined text-2xl text-[#8C96A2] mb-1">info</span>
        <p className="font-semibold text-[#101418]">No event selected</p>
      </div>
    );
  }

  const getEventBadge = (type) => {
    switch (type) {
      case 'PROGRAM_STARTED':
      case 'PROGRAM_COMPLETED':
        return 'bg-[#EFF5F2] text-[#0A4A3F] border-[#CFE0D8]';
      case 'OBJECT_CREATED':
        return 'bg-[#F5F4EF] text-[#101418] border-[#E6E4DC]';
      case 'FIELD_CHANGED':
      case 'VARIABLE_CHANGED':
      case 'ARRAY_CHANGED':
        return 'bg-[#EFF5F2] text-[#0E6E5C] border-[#CFE0D8]';
      case 'METHOD_ENTER':
      case 'METHOD_EXIT':
        return 'bg-[#F5F4EF] text-[#101418] border-[#E6E4DC]';
      case 'CONDITION_EVALUATED':
      case 'LOOP_ITERATION':
        return 'bg-[#FEF7EC] text-[#B7791F] border-[#F6E0B5]';
      case 'EXCEPTION_THROWN':
      case 'PROGRAM_FAILED':
        return 'bg-[#FAF0EC] text-[#A93226] border-[#E4C4B2]';
      default:
        return 'bg-[#FAFAF8] text-[#5C6672] border-[#E6E4DC]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFAF8] border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#B7791F] text-base">manage_search</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#101418] font-display">Event Inspector</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E6E4DC] text-[#5C6672] font-semibold">
          Step #{currentEvent.sequence}
        </span>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getEventBadge(currentEvent.eventType)}`}>
            {currentEvent.eventType}
          </span>
          <span className="text-[#5C6672]">line {currentEvent.line}</span>
        </div>

        <p className="text-[#101418] font-sans text-xs leading-relaxed bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E6E4DC] font-medium">
          {currentEvent.description}
        </p>

        {/* Metadata Details */}
        {currentEvent.metadata && Object.keys(currentEvent.metadata).length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#5C6672] font-bold block mb-1">
              Event Details
            </span>
            <div className="bg-[#FAFAF8] p-2 rounded-lg border border-[#E6E4DC] space-y-1">
              {Object.entries(currentEvent.metadata).map(([key, val]) => {
                if (key === 'whatToCheck' || key === 'rootCause') return null;
                return (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-[#5C6672]">{key}:</span>
                    <span className="text-[#101418] font-bold">{String(val)}</span>
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
