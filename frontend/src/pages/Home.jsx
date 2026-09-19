import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Cinematic hero mini-simulation sequence
  const [heroStep, setHeroStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const heroSteps = [
    {
      line: 2,
      code: 'Student s = new Student("Zaid");',
      stack: 'main()',
      heap: 'Student #1 { name: "Zaid" }',
      desc: 'Allocated Student #1 on Heap & assigned reference s',
    },
    {
      line: 3,
      code: 's.study();',
      stack: 'study()  ►  main()',
      heap: 'Student #1 { name: "Zaid", marks: 10 }',
      desc: 'Pushed study() stack frame & mutated marks 0 ➔ 10',
    },
    {
      line: 4,
      code: 'System.out.println("Marks: " + s.marks);',
      stack: 'main()',
      heap: 'Student #1 { name: "Zaid", marks: 10 }',
      desc: 'Flushed output to console: "Marks: 10"',
    },
    {
      line: 5,
      code: '// Execution Completed',
      stack: '(empty)',
      heap: 'Student #1 (persisted)',
      desc: 'Program execution completed smoothly',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-canvas-border">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-sky-500/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-brand-cyan text-xs font-semibold mb-6 shadow-glow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              <span>Interactive Java Runtime Simulator</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
              See what your Java program{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                actually does.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Stop guessing what happens between lines of code. Watch variables change, method frames enter and unwind, objects materialize in memory, and failure forensics reconstruct exceptions step-by-step.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/visualizer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-glow-md hover:shadow-glow-brand transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Start Visualizing
              </Link>
              <Link
                to="/examples"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-slate-300 bg-[#121927] hover:bg-[#182338] border border-canvas-border hover:border-slate-600 transition-all"
              >
                <span className="material-symbols-outlined">explore</span>
                Explore Examples
              </Link>
            </div>
          </div>

          {/* Interactive Hero Cinematic Teaser */}
          <div className="max-w-5xl mx-auto bg-[#0D121D] rounded-2xl border border-canvas-border p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-white font-semibold">Live Simulation Preview</span>
              </div>
              <span className="font-mono text-sky-400 text-[11px] bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Step {heroStep + 1} of 4
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Code Preview Column */}
              <div className="bg-[#070A0F] p-4 rounded-xl border border-white/[0.05] leading-relaxed space-y-1">
                <div className="text-slate-500">// Source Code (Executing)</div>
                <div className="text-slate-400">1 | class Main &#123;</div>
                <div className="text-slate-400">2 |   public static void main(String[] args) &#123;</div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 0 ? 'bg-sky-500/20 text-sky-300 border-l-2 border-sky-400' : 'text-slate-300'}`}>
                  3 |     Student s = new Student("Zaid");
                </div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 1 ? 'bg-sky-500/20 text-sky-300 border-l-2 border-sky-400' : 'text-slate-300'}`}>
                  4 |     s.study();
                </div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 2 ? 'bg-sky-500/20 text-sky-300 border-l-2 border-sky-400' : 'text-slate-300'}`}>
                  5 |     System.out.println("Marks: " + s.marks);
                </div>
                <div className="text-slate-400">6 |   &#125;</div>
                <div className="text-slate-400">7 | &#125;</div>
              </div>

              {/* Dynamic Runtime State Column */}
              <div className="space-y-3">
                {/* Call Stack Box */}
                <div className="bg-[#101624] p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-sky-400">layers</span>
                    Call Stack
                  </div>
                  <div className="text-sky-300 font-semibold">{heroSteps[heroStep].stack}</div>
                </div>

                {/* Heap Box */}
                <div className="bg-[#101624] p-3 rounded-xl border border-white/[0.06]">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-purple-400">memory</span>
                    Heap Allocation
                  </div>
                  <div className="text-purple-300 font-semibold">{heroSteps[heroStep].heap}</div>
                </div>

                {/* Event Description */}
                <div className="bg-blue-950/30 p-2.5 rounded-xl border border-blue-500/20 text-slate-300 font-sans text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-brand-cyan">info</span>
                  <span>{heroSteps[heroStep].desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Showcases */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Engineered for Deep Java Comprehension
          </h2>
          <p className="text-sm text-slate-400">
            Every feature is designed to demystify how the Java memory model, methods, and exceptions operate in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-[#0D121D] p-6 rounded-2xl border border-canvas-border hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">layers</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Live Call Stack</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch method invocation frames push into memory with parameters and smoothly unwind upon returning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0D121D] p-6 rounded-2xl border border-canvas-border hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">memory</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Heap Objects & References</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand the difference between primitive stack values and references pointing to dynamically allocated objects.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0D121D] p-6 rounded-2xl border border-canvas-border hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Time Travel Scrubbing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag the timeline backward to reconstruct past execution state, unwinding variables and heap mutations instantaneously.
            </p>
          </div>
        </div>

        {/* Failure Forensics Callout Banner */}
        <div className="bg-gradient-to-r from-red-950/40 via-[#18111B] to-[#0D121D] border border-red-500/30 rounded-2xl p-8 shadow-glow-error flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold block mb-1">
              Deterministic Failure Analysis
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Don't just crash — understand why it failed.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a NullPointerException, ArithmeticException, or ArrayIndexOutOfBoundsException triggers, JVM VISION generates deterministic forensic reports explaining the exact uninstantiated reference and what to check.
            </p>
          </div>
          <Link
            to="/visualizer?example=null-pointer-exception"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all active:scale-95 whitespace-nowrap shadow-glow-sm"
          >
            Try Crash Demo
          </Link>
        </div>
      </section>

      {/* Supported Java Subset Section */}
      <section className="py-16 bg-[#090D15] border-t border-canvas-border text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-bold text-white mb-2">Supported Educational Java Subset</h3>
          <p className="text-xs text-slate-400 mb-6">
            JVM VISION is a controlled educational interpreter designed for core programming concepts:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            {['int', 'double', 'boolean', 'String', 'class', 'new', 'constructors', 'methods', 'for / while', 'if / else', 'arrays', 'try / catch'].map((item) => (
              <span key={item} className="px-3 py-1 rounded-lg bg-[#101624] border border-canvas-border text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
