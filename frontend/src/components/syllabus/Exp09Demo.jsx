import React, { useState, useEffect } from 'react';

export default function Exp09Demo() {
  const palette = [
    { hex: '#0f172a', name: 'Deep Slate' },
    { hex: '#1e1b4b', name: 'Midnight Indigo' },
    { hex: '#064e3b', name: 'Emerald Forest' },
    { hex: '#3b0764', name: 'Royal Purple' },
    { hex: '#172554', name: 'Oceanic Blue' },
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
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">DOM Dynamic Mutation: Auto Background Color Change</h3>
        <p className="text-xs text-slate-400">
          Observe how JavaScript interval timers interact with the Document Object Model (DOM) to mutate styles every 5 seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live DOM Demo Canvas */}
        <div
          className="p-8 rounded-2xl border border-canvas-border transition-all duration-700 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl min-h-[300px]"
          style={{ backgroundColor: currentColor.hex }}
        >
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 uppercase tracking-wider">
              document.body.style.backgroundColor
            </span>

            <h4 className="text-xl font-extrabold text-white tracking-tight">
              {currentColor.name}
            </h4>
            <div className="font-mono text-xs text-cyan-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 inline-block">
              {currentColor.hex}
            </div>

            <div className="text-xs font-mono text-slate-300 pt-2">
              Next color mutation in: <span className="font-bold text-white text-sm">{countdown.toFixed(1)}s</span>
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2 justify-center pt-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all flex items-center gap-1.5"
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
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* DOM Tree Inspector */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-cyan">account_tree</span>
            DOM Tree Hierarchy & Mutation Node
          </h4>

          <div className="p-4 rounded-xl bg-slate-900 border border-canvas-border font-mono text-xs space-y-2">
            <div className="text-slate-500">window</div>
            <div className="pl-4 text-slate-500">└── document</div>
            <div className="pl-8">
              <div
                className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-between ${
                  domPulse
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-glow-sm'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <span>&lt;body style="background: {currentColor.hex}"&gt;</span>
                {domPulse && <span className="text-[10px] text-cyan-300 animate-pulse">DOM MUTATED</span>}
              </div>
            </div>
            <div className="pl-12 text-slate-400">├── &lt;h4 id="title"&gt; {currentColor.name} &lt;/h4&gt;</div>
            <div className="pl-12 text-slate-400">├── &lt;span id="timer"&gt; {countdown.toFixed(1)}s &lt;/span&gt;</div>
            <div className="pl-12 text-slate-400">└── &lt;button id="ctrl"&gt; Pause/Resume &lt;/button&gt;</div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            In standard browser architecture, <code className="text-white">setInterval(callback, 5000)</code> is managed by the browser's Web APIs timer queue. Upon firing, the event loop schedules the callback to directly assign a new hex value to <code className="text-cyan-300">document.body.style.backgroundColor</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
