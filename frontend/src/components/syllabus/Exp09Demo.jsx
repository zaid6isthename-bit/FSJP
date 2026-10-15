import React, { useState, useEffect } from 'react';

export default function Exp09Demo() {
  const palette = [
    { hex: '#FAFAF8', name: 'Paper White' },
    { hex: '#EFF5F2', name: 'Pine Mist' },
    { hex: '#FEF7EC', name: 'Ochre Cream' },
    { hex: '#F5F4EF', name: 'Soft Ivory' },
    { hex: '#EFEEE8', name: 'Architectural Gray' },
  ];

  const [colorIndex, setColorIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [countdown, setCountdown] = useState(5.0);
  const [domPulse, setDomPulse] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.2) {
          // Trigger color change
          setColorIndex((c) => (c + 1) % palette.length);
          setDomPulse(true);
          setTimeout(() => setDomPulse(false), 600);
          return 5.0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(tick);
  }, [isRunning, palette.length]);

  const currentColor = palette[colorIndex];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">DOM Dynamic Mutation: Auto Background Color Change</h3>
        <p className="text-xs text-[#5C6672]">
          Observe how JavaScript interval timers interact with the Document Object Model (DOM) to mutate styles every 5 seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live DOM Demo Canvas */}
        <div
          className="p-8 rounded-2xl border-2 border-[#E6E4DC] transition-all duration-700 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-card min-h-[300px]"
          style={{ backgroundColor: currentColor.hex }}
        >
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white text-[#101418] border border-[#E6E4DC] uppercase tracking-wider font-bold shadow-subtle">
              document.body.style.backgroundColor
            </span>

            <h4 className="text-2xl font-black text-[#101418] tracking-tight font-display">
              {currentColor.name}
            </h4>
            <div className="font-mono text-xs text-[#0E6E5C] bg-white px-3 py-1.5 rounded-lg border border-[#E6E4DC] inline-block font-bold shadow-subtle">
              {currentColor.hex}
            </div>

            <div className="text-xs font-mono text-[#5C6672] pt-2">
              Next color mutation in: <span className="font-bold text-[#101418] text-sm">{countdown.toFixed(1)}s</span>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2 justify-center pt-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#101418] hover:bg-[#252B33] text-white transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {isRunning ? 'pause' : 'play_arrow'}
                </span>
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={() => {
                  setColorIndex(0);
                  setCountdown(5.0);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#FAFAF8] text-[#101418] border border-[#E6E4DC] transition-all shadow-subtle cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* DOM Tree Inspector */}
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">account_tree</span>
            DOM Tree Hierarchy & Mutation Node
          </h4>

          <div className="p-4 rounded-xl bg-white border border-[#E6E4DC] font-mono text-xs space-y-2 shadow-subtle">
            <div className="text-[#8C96A2]">window</div>
            <div className="pl-4 text-[#8C96A2]">└── document</div>
            <div className="pl-8">
              <div
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-between ${
                  domPulse
                    ? 'bg-[#EFF5F2] text-[#0A4A3F] border-2 border-[#0E6E5C] font-bold shadow-subtle'
                    : 'bg-[#FAFAF8] text-[#101418] border border-[#E6E4DC]'
                }`}
              >
                <span>&lt;body style="background: {currentColor.hex}"&gt;</span>
                {domPulse && <span className="text-[10px] text-[#0E6E5C] font-bold">MUTATED</span>}
              </div>
            </div>
            <div className="pl-12 text-[#5C6672]">├── &lt;h4 id="title"&gt; {currentColor.name} &lt;/h4&gt;</div>
            <div className="pl-12 text-[#5C6672]">├── &lt;span id="timer"&gt; {countdown.toFixed(1)}s &lt;/span&gt;</div>
            <div className="pl-12 text-[#5C6672]">└── &lt;button id="ctrl"&gt; Pause/Resume &lt;/button&gt;</div>
          </div>

          <p className="text-xs text-[#5C6672] leading-relaxed">
            In standard browser architecture, <code className="text-[#101418] font-bold">setInterval(callback, 5000)</code> is managed by the browser's Web APIs timer queue. Upon firing, the event loop schedules the callback to directly assign a new hex value to <code className="text-[#0E6E5C] font-bold">document.body.style.backgroundColor</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
