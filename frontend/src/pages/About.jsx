import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-brand-cyan text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-sm">architecture</span>
            <span>System Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            How JVM VISION Works
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            JVM VISION is not a generic code editor or compiler wrapper. It is a purpose-built educational execution simulator designed to teach the inner mechanics of Java.
          </p>
        </div>

        {/* Execution Pipeline Architecture */}
        <div className="bg-[#0D121D] rounded-2xl border border-canvas-border p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400">account_tree</span>
            The 5-Stage Execution Pipeline
          </h2>

          <div className="space-y-6 text-xs text-slate-300">
            {/* Stage 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#090D15] border border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-sky-300 font-mono font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Tokenizer (Lexer)</h3>
                <p className="leading-relaxed text-slate-400">
                  Scans source characters into typed tokens (keywords like <code className="text-sky-300">class</code>, <code className="text-sky-300">new</code>, <code className="text-sky-300">void</code>, identifiers, and literals) while recording precise line and column numbers.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#090D15] border border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Recursive Descent Parser</h3>
                <p className="leading-relaxed text-slate-400">
                  Enforces Java grammatical rules for classes, methods, constructors, variables, assignments, loops, and conditional statements.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#090D15] border border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Abstract Syntax Tree (AST)</h3>
                <p className="leading-relaxed text-slate-400">
                  Builds a hierarchical tree of AST nodes (<code className="text-purple-300">ClassNode</code>, <code className="text-purple-300">MethodNode</code>, <code className="text-purple-300">ObjectCreationNode</code>) retaining source coordinates so the visualizer highlights active lines.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#090D15] border border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Controlled AST Interpreter</h3>
                <p className="leading-relaxed text-slate-400">
                  Walks the AST without invoking OS processes or shell execution. Enforces strict safety limits (max 10,000 steps, max 5,000 loop iterations, max 100 stack frames).
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#090D15] border border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Immutable Snapshot Trace Engine</h3>
                <p className="leading-relaxed text-slate-400">
                  Every runtime action records a snapshot of the Call Stack, Heap Objects, and Local Variables. This allows instantaneous time-travel scrubbing forward and backward with zero recalculation lag.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Viva Credibility & Security Note */}
        <div className="bg-[#0D121D] rounded-2xl border border-canvas-border p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">security</span>
            Security & Academic Viva Integrity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
            <div className="bg-[#090D15] p-4 rounded-xl border border-white/[0.05]">
              <h4 className="text-white font-semibold mb-1">No Arbitrary Server Code Execution</h4>
              <p>User code is never compiled with <code className="text-slate-300">javac</code> or spawned via <code className="text-slate-300">ProcessBuilder</code> on the server. The custom AST interpreter executes strictly inside safe sandboxed heap structures.</p>
            </div>
            <div className="bg-[#090D15] p-4 rounded-xl border border-white/[0.05]">
              <h4 className="text-white font-semibold mb-1">Pure Spring JDBC Persistence</h4>
              <p>Uses direct <code className="text-slate-300">JdbcTemplate</code> parameterized queries to eliminate ORM magic and SQL injection risks, giving students complete transparency during viva examinations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
