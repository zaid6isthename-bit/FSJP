import React, { useState } from 'react';

export default function Exp10Demo() {
  const [selectedColor, setSelectedColor] = useState('PINE');
  const [renderCount, setRenderCount] = useState(1);
  const [lastAction, setLastAction] = useState('Initial Mount');

  const colorMap = {
    PINE: { hex: '#0E6E5C', text: 'text-[#0A4A3F]', bg: 'bg-[#EFF5F2]', border: 'border-[#CFE0D8]' },
    OCHRE: { hex: '#B7791F', text: 'text-[#7B4A12]', bg: 'bg-[#FEF7EC]', border: 'border-[#F6E0B5]' },
    CRIMSON: { hex: '#A93226', text: 'text-[#A93226]', bg: 'bg-[#FAF0EC]', border: 'border-[#E4C4B2]' },
    INK: { hex: '#101418', text: 'text-[#101418]', bg: 'bg-[#FAFAF8]', border: 'border-[#E6E4DC]' },
  };

  const handleSelect = (color) => {
    if (color === selectedColor) return;
    setSelectedColor(color);
    setRenderCount((prev) => prev + 1);
    setLastAction(`User clicked ${color} button -> setSelectedColor("${color}")`);
  };

  const active = colorMap[selectedColor];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">React State Management: useState Hook</h3>
        <p className="text-xs text-[#5C6672]">
          Understand how functional React components manage local reactive state and trigger reconciliation re-renders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Color Picker */}
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] font-bold font-display">Interactive Component View</h4>

          {/* Color Display Canvas */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-300 text-center ${active.bg} ${active.border} shadow-subtle`}
          >
            <h3 className="text-2xl font-black text-[#101418] tracking-tight font-display">
              You selected <span className={active.text}>{selectedColor}</span>
            </h3>
            <p className="text-xs text-[#5C6672] mt-1 font-mono font-semibold">
              Hex Token: {active.hex}
            </p>
          </div>

          {/* 4 Selection Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.keys(colorMap).map((color) => {
              const item = colorMap[color];
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => handleSelect(color)}
                  className={`py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#101418] text-white border-[#101418] shadow-subtle scale-105'
                      : 'bg-white text-[#5C6672] hover:text-[#101418] border-[#E6E4DC]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.hex }}
                    />
                    {color}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* React State Flow Pipeline */}
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">cycle</span>
            useState Reconciliation Cycle
          </h4>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] space-y-1 shadow-subtle">
              <div className="text-[#5C6672] font-semibold">1. Hook Declaration:</div>
              <div className="text-[#0E6E5C] font-bold">const [selectedColor, setSelectedColor] = useState('PINE');</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] space-y-1 shadow-subtle">
              <div className="text-[#5C6672] font-semibold">2. Current State Snapshot:</div>
              <div className="text-[#101418] font-bold">selectedColor = "{selectedColor}"</div>
              <div className="text-[#8C96A2] text-[11px]">Component Re-render Count: {renderCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] space-y-1 shadow-subtle">
              <div className="text-[#5C6672] font-semibold">3. Last State Dispatch:</div>
              <div className="text-[#B7791F] text-[11px] font-bold">{lastAction}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E6E4DC] text-[#5C6672] text-xs leading-relaxed shadow-subtle">
            <strong className="text-[#101418]">Why it matters:</strong> React uses a virtual DOM diffing engine. Calling <code className="text-[#0E6E5C] font-bold">setSelectedColor</code> queues a state update, triggers component function execution, calculates virtual DOM diffs, and commits updates to the browser DOM without a full page reload.
          </div>
        </div>
      </div>
    </div>
  );
}
