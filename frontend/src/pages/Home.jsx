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
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-[#E6E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6E4DC] text-[#5C6672] text-xs font-mono mb-6 shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-[#0E6E5C]" />
              <span className="font-semibold">Interactive Java Runtime Simulator</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#101418] leading-[1.1] mb-6 font-display">
              See what your Java program{' '}
              <span className="underline decoration-4 decoration-[#0E6E5C] underline-offset-8">
                actually does.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5C6672] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              Stop guessing what happens between lines of code. Watch variables change, method frames enter and unwind, objects materialize in memory, and failure forensics reconstruct exceptions step-by-step.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/visualizer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0E6E5C] hover:bg-[#0A4A3F] shadow-subtle transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start Visualizing
              </Link>
              <Link
                to="/examples"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#101418] bg-white hover:bg-[#F5F4EF] border border-[#E6E4DC] shadow-subtle transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13l4 4-4 4V7z" />
                </svg>
                Explore Examples
              </Link>
            </div>
          </div>

          {/* Interactive Hero Cinematic Teaser */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-[#E6E4DC] p-4 sm:p-6 shadow-card relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6E4DC] text-xs">
              <div className="flex items-center gap-2 font-mono text-[#5C6672]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6E4DC]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6E4DC]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6E4DC]" />
                <span className="ml-2 text-[#101418] font-bold">Live Simulation Preview</span>
              </div>
              <span className="font-mono text-[#0A4A3F] text-[11px] bg-[#EFF5F2] px-2.5 py-0.5 rounded border border-[#CFE0D8] font-semibold">
                Step {heroStep + 1} of 4
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Code Preview Column */}
              <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E6E4DC] leading-relaxed space-y-1">
                <div className="text-[#8C96A2] font-medium">// Source Code (Executing)</div>
                <div className="text-[#5C6672]">1 | class Main &#123;</div>
                <div className="text-[#5C6672]">2 |   public static void main(String[] args) &#123;</div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 0 ? 'bg-[#EFF5F2] text-[#0A4A3F] border-l-2 border-[#0E6E5C] font-semibold' : 'text-[#101418]'}`}>
                  3 |     Student s = new Student("Zaid");
                </div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 1 ? 'bg-[#EFF5F2] text-[#0A4A3F] border-l-2 border-[#0E6E5C] font-semibold' : 'text-[#101418]'}`}>
                  4 |     s.study();
                </div>
                <div className={`px-2 py-0.5 rounded transition-all ${heroStep === 2 ? 'bg-[#EFF5F2] text-[#0A4A3F] border-l-2 border-[#0E6E5C] font-semibold' : 'text-[#101418]'}`}>
                  5 |     System.out.println("Marks: " + s.marks);
                </div>
                <div className="text-[#5C6672]">6 |   &#125;</div>
                <div className="text-[#5C6672]">7 | &#125;</div>
              </div>

              {/* Dynamic Runtime State Column */}
              <div className="space-y-3">
                {/* Call Stack Box */}
                <div className="bg-[#FAFAF8] p-3 rounded-xl border border-[#E6E4DC]">
                  <div className="text-[10px] text-[#5C6672] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold font-sans">
                    <svg className="w-3.5 h-3.5 text-[#0E6E5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Call Stack
                  </div>
                  <div className="text-[#101418] font-bold">{heroSteps[heroStep].stack}</div>
                </div>

                {/* Heap Box */}
                <div className="bg-[#FAFAF8] p-3 rounded-xl border border-[#E6E4DC]">
                  <div className="text-[10px] text-[#5C6672] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-semibold font-sans">
                    <svg className="w-3.5 h-3.5 text-[#0E6E5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m16-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Heap Allocation
                  </div>
                  <div className="text-[#101418] font-bold">{heroSteps[heroStep].heap}</div>
                </div>

                {/* Event Description */}
                <div className="bg-[#EFF5F2] p-2.5 rounded-xl border border-[#CFE0D8] text-[#0A4A3F] font-sans text-xs flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0E6E5C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{heroSteps[heroStep].desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Feature Showcases */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-[#101418] tracking-tight mb-3 font-display">
            Engineered for Deep Java Comprehension
          </h2>
          <p className="text-sm text-[#5C6672]">
            Every feature is designed to demystify how the Java memory model, methods, and exceptions operate in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E4DC] hover:border-[#101418] transition-all group shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-[#EFF5F2] border border-[#CFE0D8] flex items-center justify-center text-[#0E6E5C] mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">layers</span>
            </div>
            <h3 className="text-base font-bold text-[#101418] mb-2 font-display">Live Call Stack</h3>
            <p className="text-xs text-[#5C6672] leading-relaxed">
              Watch method invocation frames push into memory with parameters and smoothly unwind upon returning.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E4DC] hover:border-[#101418] transition-all group shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-[#F5F4EF] border border-[#E6E4DC] flex items-center justify-center text-[#101418] mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">memory</span>
            </div>
            <h3 className="text-base font-bold text-[#101418] mb-2 font-display">Heap Objects & References</h3>
            <p className="text-xs text-[#5C6672] leading-relaxed">
              Understand the difference between primitive stack values and references pointing to dynamically allocated objects.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E4DC] hover:border-[#101418] transition-all group shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-[#FEF7EC] border border-[#F6E0B5] flex items-center justify-center text-[#B7791F] mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <h3 className="text-base font-bold text-[#101418] mb-2 font-display">Time Travel Scrubbing</h3>
            <p className="text-xs text-[#5C6672] leading-relaxed">
              Drag the timeline backward to reconstruct past execution state, unwinding variables and heap mutations instantaneously.
            </p>
          </div>
        </div>

        {/* Failure Forensics Callout Banner */}
        <div className="bg-[#FAF0EC] border-2 border-[#E4C4B2] rounded-2xl p-8 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A93226] font-bold block mb-1">
              Deterministic Failure Analysis
            </span>
            <h3 className="text-2xl font-bold text-[#101418] tracking-tight mb-2 font-display">
              Don't just crash — understand why it failed.
            </h3>
            <p className="text-xs text-[#5C6672] leading-relaxed">
              When a NullPointerException, ArithmeticException, or ArrayIndexOutOfBoundsException triggers, JVM VISION generates deterministic forensic reports explaining the exact uninstantiated reference and what to check.
            </p>
          </div>
          <Link
            to="/visualizer?example=null-pointer-exception"
            className="px-5 py-3 rounded-xl bg-[#A93226] hover:bg-[#8B2319] text-white font-semibold text-xs transition-all active:scale-95 whitespace-nowrap shadow-subtle"
          >
            Try Crash Demo
          </Link>
        </div>
      </section>

      {/* Supported Java Subset Section */}
      <section className="py-16 bg-white border-t border-[#E6E4DC] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-bold text-[#101418] mb-2 font-display">Supported Educational Java Subset</h3>
          <p className="text-xs text-[#5C6672] mb-6">
            JVM VISION is a controlled educational interpreter designed for core programming concepts:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            {['int', 'double', 'boolean', 'String', 'class', 'new', 'constructors', 'methods', 'for / while', 'if / else', 'arrays', 'try / catch'].map((item) => (
              <span key={item} className="px-3.5 py-1.5 rounded-lg bg-[#FAFAF8] border border-[#E6E4DC] text-[#101418] font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
