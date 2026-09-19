import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Examples() {
  const [examples, setExamples] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function load() {
      const res = await api.getExamples();
      if (res.success && res.data) {
        setExamples(res.data);
      }
    }
    load();
  }, []);

  const categories = ['ALL', 'Objects', 'Exceptions', 'Loops', 'Arrays', 'Methods', 'Basics'];

  const filtered = selectedCategory === 'ALL'
    ? examples
    : examples.filter((e) => e.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-brand-cyan text-xs font-semibold mb-3">
            <span className="material-symbols-outlined text-sm">collections_bookmark</span>
            <span>Educational Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Curated Example Programs
          </h1>
          <p className="text-sm text-slate-400">
            Explore carefully crafted Java programs demonstrating object creation, loop journeys, stack frames, and intentional runtime failure forensics.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-glow-sm'
                  : 'bg-[#101624] text-slate-400 hover:text-white border border-canvas-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ex) => {
            const isCrash = ex.category === 'Exceptions';

            return (
              <div
                key={ex.id}
                className="bg-[#0D121D] rounded-2xl border border-canvas-border hover:border-slate-600 p-5 flex flex-col justify-between transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                        isCrash
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-blue-500/20 text-sky-300 border-blue-500/30'
                      }`}
                    >
                      {ex.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{ex.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-2 group-hover:text-sky-300 transition-colors">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {ex.description}
                  </p>

                  {/* Code Snippet Preview */}
                  <div className="bg-[#070A0F] p-3 rounded-xl border border-white/[0.04] font-mono text-[11px] text-slate-300 mb-4 max-h-36 overflow-hidden relative">
                    <pre className="whitespace-pre-wrap">{ex.code.slice(0, 180)}...</pre>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#070A0F] to-transparent pointer-events-none" />
                  </div>
                </div>

                <Link
                  to={`/visualizer?example=${ex.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-white bg-[#152033] hover:bg-blue-600 transition-all border border-canvas-border"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  Load in Visualizer
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
