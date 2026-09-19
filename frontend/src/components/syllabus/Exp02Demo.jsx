import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Exp02Demo({ experiment }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('two_int');
  const [a, setA] = useState(10);
  const [b, setB] = useState(20);
  const [c, setC] = useState(30);
  const [da, setDa] = useState(5.5);
  const [db, setDb] = useState(4.5);
  const [result, setResult] = useState(null);
  const [matchedSignature, setMatchedSignature] = useState('add(int, int)');

  const handleCompute = (e) => {
    e.preventDefault();
    if (activeTab === 'two_int') {
      const res = (parseInt(a, 10) || 0) + (parseInt(b, 10) || 0);
      setResult(res);
      setMatchedSignature('Calculator.add(int a, int b)');
    } else if (activeTab === 'three_int') {
      const res = (parseInt(a, 10) || 0) + (parseInt(b, 10) || 0) + (parseInt(c, 10) || 0);
      setResult(res);
      setMatchedSignature('Calculator.add(int a, int b, int c)');
    } else {
      const res = (parseFloat(da) || 0) + (parseFloat(db) || 0);
      setResult(res.toFixed(2));
      setMatchedSignature('Calculator.add(double a, double b)');
    }
  };

  const handleVisualize = () => {
    navigate('/visualizer', { state: { code: experiment?.code } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-canvas-border pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Polymorphic Method Overload Resolution</h3>
          <p className="text-xs text-slate-400">Observe compile-time signature resolution across varying parameter arity and types</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-canvas-border pb-3">
        {[
          { id: 'two_int', label: 'add(int, int)', badge: '2 params' },
          { id: 'three_int', label: 'add(int, int, int)', badge: '3 params' },
          { id: 'two_double', label: 'add(double, double)', badge: 'double types' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">{tab.badge}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <form onSubmit={handleCompute} className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-blue">input</span>
            Argument Values
          </h4>

          {activeTab === 'two_int' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">int a</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">int b</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'three_int' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">int a</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">int b</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">int c</label>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'two_double' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">double a</label>
                <input
                  type="number"
                  step="0.1"
                  value={da}
                  onChange={(e) => setDa(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">double b</label>
                <input
                  type="number"
                  step="0.1"
                  value={db}
                  onChange={(e) => setDb(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-glow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Invoke Overload
          </button>
        </form>

        {/* Resolution Inspector */}
        <div className="p-5 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-cyan">alt_route</span>
            Signature Matching Pipeline
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border space-y-1">
              <div className="text-[11px] text-slate-400">1. Available Overloads in Calculator:</div>
              <div className={`p-1.5 rounded text-[11px] ${activeTab === 'two_int' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500'}`}>
                int add(int a, int b)
              </div>
              <div className={`p-1.5 rounded text-[11px] ${activeTab === 'three_int' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500'}`}>
                int add(int a, int b, int c)
              </div>
              <div className={`p-1.5 rounded text-[11px] ${activeTab === 'two_double' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-500'}`}>
                double add(double a, double b)
              </div>
            </div>

            {result !== null && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1 animate-fadeIn">
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  Overload Selected: <span className="font-bold text-white">{matchedSignature}</span>
                </div>
                <div className="text-base font-bold text-white pt-1">
                  Return Value = {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
