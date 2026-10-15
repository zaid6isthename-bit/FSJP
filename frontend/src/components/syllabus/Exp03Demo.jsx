import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exp03Demo({ experiment }) {
  const navigate = useNavigate();
  const [numerator, setNumerator] = useState(10);
  const [denominator, setDenominator] = useState(0);
  const [log, setLog] = useState([]);

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
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E6E4DC] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#101418] font-display">Inheritance Hierarchy & Exception Safety</h3>
          <p className="text-xs text-[#5C6672]">Examine class inheritance chains and structured try-catch exception handling</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAFAF8] text-[#0E6E5C] border border-[#CFE0D8] transition-all shadow-subtle cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-[#0E6E5C]">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Inheritance Box */}
          <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
              <span className="material-symbols-outlined text-sm text-[#0E6E5C]">account_tree</span>
              1. Inheritance Hierarchy
            </h4>
            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] font-mono text-xs text-[#101418] shadow-subtle">
              <div className="text-[#0E6E5C] font-bold">Animal (super)</div>
              <div className="pl-4 text-[#5C6672]">├── species: "Canine"</div>
              <div className="text-[#101418] font-bold mt-1.5">└── Dog (subclass extends Animal)</div>
              <div className="pl-8 text-[#5C6672]">├── breed: "Golden Retriever"</div>
              <div className="pl-8 text-[#5C6672]">└── bark() member method</div>
            </div>
            <button
              onClick={runInheritance}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-white text-[#101418] border border-[#E6E4DC] hover:bg-[#101418] hover:text-white transition-all shadow-subtle cursor-pointer"
            >
              Test Inheritance & super() delegation
            </button>
          </div>

          {/* Exception Box */}
          <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
              <span className="material-symbols-outlined text-sm text-[#B7791F]">warning</span>
              2. Structured Try-Catch Demonstration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">Numerator</label>
                <input
                  type="number"
                  value={numerator}
                  onChange={(e) => setNumerator(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">Denominator (Try 0)</label>
                <input
                  type="number"
                  value={denominator}
                  onChange={(e) => setDenominator(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
            </div>
            <button
              onClick={runExceptionDemo}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white transition-all shadow-subtle cursor-pointer"
            >
              Execute try &#123; num / den &#125; catch
            </button>
          </div>
        </div>

        {/* Execution Events Log */}
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 mb-3 font-bold font-display">
              <span className="material-symbols-outlined text-sm text-[#0E6E5C]">timeline</span>
              Live Interception Log
            </h4>

            {log.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {log.map((entry, idx) => {
                  const isErr = entry.includes('💥');
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                        isErr
                          ? 'bg-[#FAF0EC] border-[#E4C4B2] text-[#A93226] font-bold shadow-subtle'
                          : 'bg-white border-[#E6E4DC] text-[#101418] font-medium'
                      }`}
                    >
                      {entry}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-[#8C96A2] font-mono text-xs rounded-xl bg-white border border-dashed border-[#E6E4DC]">
                Click either test action on the left to observe lifecycle logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
