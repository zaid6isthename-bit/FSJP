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
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6E4DC] text-[#5C6672] text-xs font-mono font-semibold mb-3 shadow-subtle">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">collections_bookmark</span>
            <span>Educational Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101418] tracking-tight mb-3 font-display">
            Curated Example Programs
          </h1>
          <p className="text-sm text-[#5C6672]">
            Explore carefully crafted Java programs demonstrating object creation, loop journeys, stack frames, and intentional runtime failure forensics.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#101418] text-white shadow-subtle'
                  : 'bg-white text-[#5C6672] hover:text-[#101418] border border-[#E6E4DC] hover:border-[#101418]'
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
                className="bg-white rounded-2xl border border-[#E6E4DC] hover:border-[#101418] p-5 flex flex-col justify-between transition-all shadow-card group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                        isCrash
                          ? 'bg-[#FAF0EC] text-[#A93226] border-[#E4C4B2]'
                          : 'bg-[#EFF5F2] text-[#0A4A3F] border-[#CFE0D8]'
                      }`}
                    >
                      {ex.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#8C96A2]">{ex.difficulty}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#101418] tracking-tight mb-2 group-hover:text-[#0E6E5C] transition-colors font-display">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-[#5C6672] leading-relaxed mb-4">
                    {ex.description}
                  </p>

                  {/* Code Snippet Preview */}
                  <div className="bg-[#FAFAF8] p-3 rounded-xl border border-[#E6E4DC] font-mono text-[11px] text-[#101418] mb-4 max-h-36 overflow-hidden relative">
                    <pre className="whitespace-pre-wrap">{ex.code.slice(0, 180)}...</pre>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FAFAF8] to-transparent pointer-events-none" />
                  </div>
                </div>

                <Link
                  to={`/visualizer?example=${ex.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-[#101418] bg-[#FAFAF8] hover:bg-[#101418] hover:text-white transition-all border border-[#E6E4DC]"
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
