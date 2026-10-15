import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#101418] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6E4DC] text-[#5C6672] text-xs font-mono font-semibold mb-4 shadow-subtle">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">architecture</span>
            <span>System Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#101418] tracking-tight mb-4 font-display">
            How JVM VISION Works
          </h1>
          <p className="text-sm sm:text-base text-[#5C6672] max-w-2xl mx-auto leading-relaxed">
            JVM VISION is not a generic code editor or compiler wrapper. It is a purpose-built educational execution simulator designed to teach the inner mechanics of Java.
          </p>
        </div>

        {/* Execution Pipeline Architecture */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-card">
          <h2 className="text-xl font-bold text-[#101418] mb-6 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-[#0E6E5C]">account_tree</span>
            The 5-Stage Execution Pipeline
          </h2>

          <div className="space-y-4 text-xs text-[#5C6672]">
            {/* Stage 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#101418] text-white font-mono font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-[#101418] text-sm mb-1 font-display">Tokenizer (Lexer)</h3>
                <p className="leading-relaxed text-[#5C6672]">
                  Scans source characters into typed tokens (keywords like <code className="text-[#0E6E5C] font-mono font-semibold">class</code>, <code className="text-[#0E6E5C] font-mono font-semibold">new</code>, <code className="text-[#0E6E5C] font-mono font-semibold">void</code>, identifiers, and literals) while recording precise line and column numbers.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#101418] text-white font-mono font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-[#101418] text-sm mb-1 font-display">Recursive Descent Parser</h3>
                <p className="leading-relaxed text-[#5C6672]">
                  Enforces Java grammatical rules for classes, methods, constructors, variables, assignments, loops, and conditional statements.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#101418] text-white font-mono font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-[#101418] text-sm mb-1 font-display">Abstract Syntax Tree (AST)</h3>
                <p className="leading-relaxed text-[#5C6672]">
                  Builds a hierarchical tree of AST nodes (<code className="text-[#0E6E5C] font-mono font-semibold">ClassNode</code>, <code className="text-[#0E6E5C] font-mono font-semibold">MethodNode</code>, <code className="text-[#0E6E5C] font-mono font-semibold">ObjectCreationNode</code>) retaining source coordinates so the visualizer highlights active lines.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#101418] text-white font-mono font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-[#101418] text-sm mb-1 font-display">Controlled AST Interpreter</h3>
                <p className="leading-relaxed text-[#5C6672]">
                  Walks the AST without invoking OS processes or shell execution. Enforces strict safety limits (max 10,000 steps, max 5,000 loop iterations, max 100 stack frames).
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#E6E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#101418] text-white font-mono font-bold flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-[#101418] text-sm mb-1 font-display">Immutable Snapshot Trace Engine</h3>
                <p className="leading-relaxed text-[#5C6672]">
                  Every runtime action records a snapshot of the Call Stack, Heap Objects, and Local Variables. This allows instantaneous time-travel scrubbing forward and backward with zero recalculation lag.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Viva Credibility & Security Note */}
        <div className="bg-white rounded-2xl border border-[#E6E4DC] p-6 sm:p-8 shadow-card">
          <h2 className="text-xl font-bold text-[#101418] mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-[#0E6E5C]">security</span>
            Security & Academic Viva Integrity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#5C6672] leading-relaxed">
            <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E6E4DC]">
              <h4 className="text-[#101418] font-bold text-sm mb-1 font-display">No Arbitrary Server Code Execution</h4>
              <p>User code is never compiled with <code className="text-[#101418] font-mono font-semibold">javac</code> or spawned via <code className="text-[#101418] font-mono font-semibold">ProcessBuilder</code> on the server. The custom AST interpreter executes strictly inside safe sandboxed heap structures.</p>
            </div>
            <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E6E4DC]">
              <h4 className="text-[#101418] font-bold text-sm mb-1 font-display">Pure Spring JDBC Persistence</h4>
              <p>Uses direct <code className="text-[#101418] font-mono font-semibold">JdbcTemplate</code> parameterized queries to eliminate ORM magic and SQL injection risks, giving students complete transparency during viva examinations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
