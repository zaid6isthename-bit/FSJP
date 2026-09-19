import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exp03Demo({ experiment }) {
  const navigate = useNavigate();
  const [numerator, setNumerator] = useState(10);
  const [denominator, setDenominator] = useState(0);
  const [log, setLog] = useState([]);
  const [dogCreated, setDogCreated] = useState(true);

  const runInheritance = () => {
    const events = [
      '1. Dog class inherits fields and methods from Animal base class',
      '2. new Dog("Golden Retriever") invokes constructor',
      '3. super("Canine") delegates species initialization to Animal',
      '4. d.bark() executed: "Golden Retriever barks loudly!"',
    ];
    setLog(events);
  };

  const runExceptionDemo = () => {
    const num = parseInt(numerator, 10);
    const den = parseInt(denominator, 10);
    const entries = [];
    entries.push(`Evaluating: int result = ${num} / ${den};`);
    if (den === 0) {
      entries.push('💥 Arithmetic Exception occurred: / by zero');
      entries.push('Searching call stack for matching catch block...');
      entries.push('✓ Caught by: catch (ArithmeticException e)');
      entries.push('Handler action executed: "Handled: Division by zero caught safely"');
      entries.push('Program execution resumed normally after catch block.');
    } else {
      const res = Math.floor(num / den);
      entries.push(`✓ Execution successful without error. Result = ${res}`);
    }
    setLog(entries);
  };

  const handleVisualize = () => {
    navigate('/visualizer', { state: { code: experiment?.code } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-canvas-border pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Inheritance Hierarchy & Exception Safety</h3>
          <p className="text-xs text-slate-400">Examine class inheritance chains and structured try-catch exception handling</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Inheritance Box */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-brand-blue">account_tree</span>
              1. Inheritance Hierarchy
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-blue-400 font-semibold">Animal (super)</div>
              <div className="pl-4 text-slate-500">├── species: "Canine"</div>
              <div className="text-cyan-400 font-semibold mt-1.5">└── Dog (subclass extends Animal)</div>
              <div className="pl-8 text-slate-400">├── breed: "Golden Retriever"</div>
              <div className="pl-8 text-slate-400">└── bark() member method</div>
            </div>
            <button
              onClick={runInheritance}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
            >
              Test Inheritance & super() delegation
            </button>
          </div>

          {/* Exception Box */}
          <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-amber-400">warning</span>
              2. Structured Try-Catch Demonstration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Numerator</label>
                <input
                  type="number"
                  value={numerator}
                  onChange={(e) => setNumerator(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Denominator (Try 0)</label>
                <input
                  type="number"
                  value={denominator}
                  onChange={(e) => setDenominator(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
            </div>
            <button
              onClick={runExceptionDemo}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30 transition-all"
            >
              Execute try &#123; {numerator} / {denominator} &#125; catch
            </button>
          </div>
        </div>

        {/* Execution Pipeline Trace */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-brand-cyan">terminal</span>
              Lifecycle Trace
            </h4>

            {log.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {log.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border ${
                      entry.includes('💥')
                        ? 'bg-rose-950/30 text-rose-300 border-rose-500/30'
                        : entry.includes('✓')
                        ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-900 text-slate-300 border-canvas-border'
                    }`}
                  >
                    {entry}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs rounded-xl bg-slate-900/50 border border-dashed border-canvas-border">
                Click one of the test actions on the left to trace execution steps.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
