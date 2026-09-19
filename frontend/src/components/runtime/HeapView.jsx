import React from 'react';

export default function HeapView({ heapObjects = [], heapArrays = [], highlightedObjectId }) {
  const hasItems = heapObjects.length > 0 || heapArrays.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090D15] border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400 text-base">memory</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Heap Memory</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {heapObjects.length + heapArrays.length} allocations
        </span>
      </div>

      {/* Heap Cards Container */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {!hasItems ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center">
            <span className="material-symbols-outlined text-2xl mb-1 text-slate-600">deployed_code</span>
            <p>Heap is currently empty</p>
            <p className="text-[11px] text-slate-600 mt-1">Objects created with 'new' will materialize here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Heap Objects */}
            {heapObjects.map((obj) => {
              const isHighlighted = highlightedObjectId === obj.objectId;

              return (
                <div
                  key={obj.objectId}
                  className={`p-3 rounded-xl border transition-all relative ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-[#1E1B38] to-[#141B2D] border-purple-400/60 shadow-glow-md ring-1 ring-purple-400/30'
                      : 'bg-[#101624] border-canvas-border hover:border-slate-600'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                      <span className="font-mono text-xs font-bold text-white">{obj.className}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                      Object #{obj.objectId}
                    </span>
                  </div>

                  {/* Object Fields */}
                  <div className="space-y-1.5 font-mono text-xs">
                    {obj.fields && Object.keys(obj.fields).length > 0 ? (
                      Object.entries(obj.fields).map(([fieldName, fieldVar]) => (
                        <div
                          key={fieldName}
                          className="flex items-center justify-between px-2 py-1 rounded bg-black/30 border border-white/[0.04]"
                        >
                          <span className="text-slate-400">{fieldName}:</span>
                          <span className={fieldVar.isReference ? 'text-sky-400 font-semibold' : 'text-slate-200'}>
                            {fieldVar.displayValue}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">No fields defined</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Heap Arrays */}
            {heapArrays.map((arr) => {
              const isHighlighted = highlightedObjectId === arr.arrayId;

              return (
                <div
                  key={arr.arrayId}
                  className={`p-3 rounded-xl border transition-all ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-[#122438] to-[#101624] border-sky-400 shadow-glow-sm'
                      : 'bg-[#101624] border-canvas-border'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span className="font-mono text-xs font-bold text-white">{arr.elementTypeName}[]</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">
                      Array #{arr.arrayId} (len: {arr.elements?.length || 0})
                    </span>
                  </div>

                  {/* Array Elements Grid */}
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {arr.elements && arr.elements.map((elem, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded bg-black/40 border border-white/[0.05] text-center min-w-[32px]"
                      >
                        <span className="text-[9px] text-slate-500 block">[{idx}]</span>
                        <span className="text-slate-200">{elem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
