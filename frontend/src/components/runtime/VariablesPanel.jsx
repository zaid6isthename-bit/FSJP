import React from 'react';

export default function VariablesPanel({ variables = [], highlightedVariable, onHoverObject }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFAF8] border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0E6E5C] text-base">data_object</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#101418] font-display">Local Variables</span>
        </div>
        <span className="text-[10px] font-mono text-[#5C6672]">
          {variables.length} active
        </span>
      </div>

      {/* Variables List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-xs">
        {variables.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5C6672] text-xs py-6 text-center">
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
                    ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] shadow-subtle'
                    : 'bg-[#FAFAF8] border-[#E6E4DC] hover:border-[#8C96A2]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#5C6672] font-medium">{v.type}</span>
                  <span className="text-[#101418] font-bold">{v.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {v.isReference ? (
                    <span className="px-2 py-0.5 rounded bg-white text-[#0E6E5C] font-bold border border-[#CFE0D8] flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      {v.displayValue}
                    </span>
                  ) : v.type === 'null' ? (
                    <span className="text-[#A93226] font-semibold italic">null</span>
                  ) : (
                    <span className="text-[#101418] font-bold">{v.displayValue}</span>
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
