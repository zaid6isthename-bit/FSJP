import React from 'react';

export default function CallStack({ stackFrames = [], onSelectFrame, selectedFrameId }) {
  return (
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090D15] border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-cyan text-base">layers</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Call Stack</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-brand-cyan border border-blue-500/20">
          {stackFrames.length} {stackFrames.length === 1 ? 'frame' : 'frames'}
        </span>
      </div>

      {/* Stack Body */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {stackFrames.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center">
            <span className="material-symbols-outlined text-2xl mb-1 text-slate-600">vertical_align_bottom</span>
            <p>Call stack is currently empty</p>
            <p className="text-[11px] text-slate-600 mt-1">Method invocations will push frames here</p>
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
                    ? 'bg-gradient-to-r from-blue-950/40 via-[#111A2E] to-[#14223D] border-blue-500/40 shadow-glow-sm'
                    : isSelected
                    ? 'bg-[#152033] border-slate-500'
                    : 'bg-[#101624] border-canvas-border hover:border-slate-600'
                }`}
              >
                {isTop && (
                  <span className="absolute -top-2 right-3 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-sky-500 text-black font-bold">
                    ACTIVE FRAME
                  </span>
                )}

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                    <span className="text-brand-cyan">{frame.className}.</span>
                    <span className="text-white">{frame.methodName}()</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    line {frame.line}
                  </span>
                </div>

                {/* Parameters preview if any */}
                {frame.parameters && frame.parameters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                    {frame.parameters.map((p) => (
                      <span
                        key={p.name}
                        className="px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-white/[0.05]"
                      >
                        {p.name} = <span className="text-sky-300">{p.displayValue}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Return value if method just returned */}
                {frame.returnValueDisplay && (
                  <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">keyboard_return</span>
                    <span>returned: {frame.returnValueDisplay}</span>
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
