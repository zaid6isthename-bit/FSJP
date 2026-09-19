import React, { useState } from 'react';

export default function Exp10Demo() {
  const [selectedColor, setSelectedColor] = useState('BLUE');
  const [renderCount, setRenderCount] = useState(1);
  const [lastAction, setLastAction] = useState('Initial Mount');

  const colorMap = {
    RED: { hex: '#ef4444', text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' },
    BLUE: { hex: '#3b82f6', text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
    GREEN: { hex: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
    YELLOW: { hex: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
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
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">React State Management: useState Hook</h3>
        <p className="text-xs text-slate-400">
          Understand how functional React components manage local reactive state and trigger reconciliation re-renders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Color Picker */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-5">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Interactive Component View</h4>

          {/* Color Display Canvas */}
          <div
            className={`p-8 rounded-2xl border transition-all duration-300 text-center ${active.bg} ${active.border}`}
          >
            <h3 className="text-2xl font-bold text-white tracking-tight">
              You selected <span className={active.text}>{selectedColor}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-mono">
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
                  className={`py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-glow-sm scale-105'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-canvas-border hover:border-slate-600'
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
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-cyan">cycle</span>
            useState Reconciliation Cycle
          </h4>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border space-y-1">
              <div className="text-slate-400">1. Hook Declaration:</div>
              <div className="text-cyan-400">const [selectedColor, setSelectedColor] = useState('BLUE');</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border space-y-1">
              <div className="text-slate-400">2. Current State Snapshot:</div>
              <div className="text-emerald-400 font-bold">selectedColor = "{selectedColor}"</div>
              <div className="text-slate-500 text-[11px]">Component Re-render Count: {renderCount}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border space-y-1">
              <div className="text-slate-400">3. Last State Dispatch:</div>
              <div className="text-amber-400 text-[11px]">{lastAction}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-blue-300 text-xs leading-relaxed">
            <strong className="text-white">Why it matters:</strong> React uses a virtual DOM diffing engine. Calling <code className="text-cyan-300">setSelectedColor</code> queues a state update, triggers component function execution, calculates virtual DOM diffs, and commits updates to the browser DOM without a full page reload.
          </div>
        </div>
      </div>
    </div>
  );
}
