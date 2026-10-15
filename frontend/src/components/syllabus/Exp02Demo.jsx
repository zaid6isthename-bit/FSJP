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
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E6E4DC] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#101418] font-display">Polymorphic Method Overload Resolution</h3>
          <p className="text-xs text-[#5C6672]">Observe compile-time signature resolution across varying parameter arity and types</p>
        </div>
        <button
          onClick={handleVisualize}
          className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FAFAF8] text-[#0E6E5C] border border-[#CFE0D8] transition-all shadow-subtle cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm text-[#0E6E5C]">visibility</span>
          Visualize in JVM VISION
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-[#E6E4DC] pb-3 overflow-x-auto">
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-[#101418] text-white border-[#101418] shadow-subtle'
                : 'bg-white text-[#5C6672] hover:text-[#101418] border-[#E6E4DC]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#FAFAF8] text-[#5C6672]'
            }`}>{tab.badge}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <form onSubmit={handleCompute} className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">input</span>
            Argument Values
          </h4>

          {activeTab === 'two_int' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">int a</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">int b</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'three_int' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">int a</label>
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">int b</label>
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">int c</label>
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'two_double' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">double a</label>
                <input
                  type="number"
                  step="0.1"
                  value={da}
                  onChange={(e) => setDa(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101418] mb-1">double b</label>
                <input
                  type="number"
                  step="0.1"
                  value={db}
                  onChange={(e) => setDb(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white transition-all shadow-subtle flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Invoke Overload
          </button>
        </form>

        {/* Resolution Inspector */}
        <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">alt_route</span>
            Signature Matching Pipeline
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] space-y-1.5">
              <div className="text-[11px] text-[#5C6672] font-semibold">1. Available Overloads in Calculator:</div>
              <div className={`p-1.5 rounded text-[11px] font-semibold ${activeTab === 'two_int' ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'text-[#8C96A2]'}`}>
                int add(int a, int b)
              </div>
              <div className={`p-1.5 rounded text-[11px] font-semibold ${activeTab === 'three_int' ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'text-[#8C96A2]'}`}>
                int add(int a, int b, int c)
              </div>
              <div className={`p-1.5 rounded text-[11px] font-semibold ${activeTab === 'two_double' ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'text-[#8C96A2]'}`}>
                double add(double a, double b)
              </div>
            </div>

            {result !== null && (
              <div className="p-4 rounded-xl bg-[#EFF5F2] border border-[#CFE0D8] text-[#0A4A3F] space-y-1 animate-fadeIn shadow-subtle">
                <div className="text-[11px] font-mono text-[#0E6E5C] flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  Overload Selected: <span className="font-bold text-[#101418]">{matchedSignature}</span>
                </div>
                <div className="text-base font-bold text-[#101418] pt-1">
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
