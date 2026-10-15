import React from 'react';

export default function CallStack({ stackFrames = [], onSelectFrame, selectedFrameId }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAF8] border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0E6E5C] text-base">layers</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#101418] font-display">Call Stack</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8] font-semibold">
          {stackFrames.length} {stackFrames.length === 1 ? 'frame' : 'frames'}
        </span>
      </div>

      {/* Stack Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {stackFrames.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5C6672] text-xs py-8 text-center">
            <span className="material-symbols-outlined text-2xl mb-1 text-[#8C96A2]">vertical_align_bottom</span>
            <p className="font-semibold text-[#101418]">Call stack is currently empty</p>
            <p className="text-[11px] text-[#8C96A2] mt-1">Method invocations will push frames here</p>
          </div>
        ) : (
          stackFrames.map((frame, index) => {
            const isTop = index === 0;
            const isSelected = selectedFrameId === frame.frameId;

            return (
              <div
                key={frame.frameId || index}
                onClick={() => onSelectFrame && onSelectFrame(frame.frameId)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isTop
                    ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] shadow-subtle'
                    : isSelected
                    ? 'bg-[#F5F4EF] border-[#101418]'
                    : 'bg-[#FAFAF8] border-[#E6E4DC] hover:border-[#8C96A2]'
                }`}
              >
                {isTop && (
                  <span className="absolute -top-2 right-3 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#0E6E5C] text-white font-bold">
                    ACTIVE FRAME
                  </span>
                )}

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#101418]">
                    <span className="text-[#0E6E5C]">{frame.className}.</span>
                    <span>{frame.methodName}()</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5C6672]">
                    line {frame.line}
                  </span>
                </div>

                {/* Parameters preview if any */}
                {frame.parameters && frame.parameters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#E6E4DC] text-[11px] font-mono">
                    <span className="text-[10px] text-[#8C96A2] uppercase font-sans font-semibold">params:</span>
                    {frame.parameters.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-1.5 py-0.5 rounded bg-white border border-[#E6E4DC] text-[#101418]"
                      >
                        {p.name} = {p.displayValue}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
