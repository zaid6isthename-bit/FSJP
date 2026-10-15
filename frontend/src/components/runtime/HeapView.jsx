import React from 'react';

export default function HeapView({ heapObjects = [], heapArrays = [], highlightedObjectId }) {
  const hasItems = heapObjects.length > 0 || heapArrays.length > 0;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAF8] border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#101418] text-base">memory</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#101418] font-display">Heap Memory</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5F4EF] text-[#101418] border border-[#E6E4DC] font-semibold">
          {heapObjects.length + heapArrays.length} allocations
        </span>
      </div>

      {/* Heap Cards Container */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {!hasItems ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5C6672] text-xs py-8 text-center">
            <span className="material-symbols-outlined text-2xl mb-1 text-[#8C96A2]">deployed_code</span>
            <p className="font-semibold text-[#101418]">Heap is currently empty</p>
            <p className="text-[11px] text-[#8C96A2] mt-1">Objects created with 'new' will materialize here</p>
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
                      ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] shadow-subtle'
                      : 'bg-[#FAFAF8] border-[#E6E4DC] hover:border-[#8C96A2]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E4DC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0E6E5C]"></span>
                      <span className="font-mono text-xs font-bold text-[#101418]">{obj.className}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#101418] border border-[#E6E4DC] font-semibold">
                      Object #{obj.objectId}
                    </span>
                  </div>

                  {/* Object Fields */}
                  <div className="space-y-1.5 font-mono text-xs">
                    {obj.fields && Object.keys(obj.fields).length > 0 ? (
                      Object.entries(obj.fields).map(([fieldName, fieldVar]) => (
                        <div
                          key={fieldName}
                          className="flex items-center justify-between px-2 py-1 rounded bg-white border border-[#E6E4DC]"
                        >
                          <span className="text-[#5C6672]">{fieldName}:</span>
                          <span className={fieldVar.isReference ? 'text-[#0E6E5C] font-bold' : 'text-[#101418] font-medium'}>
                            {fieldVar.displayValue}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-[#8C96A2] italic">No fields defined</p>
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
                      ? 'bg-[#EFF5F2] border-2 border-[#0E6E5C] shadow-subtle'
                      : 'bg-[#FAFAF8] border-[#E6E4DC]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E4DC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#101418]"></span>
                      <span className="font-mono text-xs font-bold text-[#101418]">{arr.elementTypeName}[]</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#101418] border border-[#E6E4DC] font-semibold">
                      Array #{arr.arrayId} (len: {arr.elements?.length || 0})
                    </span>
                  </div>

                  {/* Array Elements Grid */}
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {arr.elements && arr.elements.map((elem, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded bg-white border border-[#E6E4DC] text-center min-w-[32px]"
                      >
                        <span className="text-[9px] text-[#8C96A2] block">[{idx}]</span>
                        <span className="text-[#101418] font-semibold">{elem}</span>
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
