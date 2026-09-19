import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-canvas-border bg-[#070A0F] py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-brand-cyan">view_in_ar</span>
              <span className="font-bold text-white tracking-tight text-base">JVM VISION</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              An educational Java runtime visualization and failure analysis platform.
              Explore call stacks, heap allocations, object references, and deterministic failure forensics step-by-step.
            </p>
            <p className="text-[11px] text-slate-500 mt-3">
              Built with Java 21, Spring Boot 3, Spring JDBC, and React 19.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/visualizer" className="hover:text-white transition-colors">Visualizer Workbench</Link></li>
              <li><Link to="/examples" className="hover:text-white transition-colors">Example Library</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Saved Sessions</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Architecture & Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Flagship Demos</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-300">Object Creation:</span> Student.study()</li>
              <li><span className="text-red-400">Crash Analysis:</span> NullPointerException</li>
              <li><span className="text-amber-400">Math Error:</span> Division by Zero</li>
              <li><span className="text-emerald-400">Watchdog:</span> Infinite Loop Limit</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-canvas-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 JVM VISION. Educational Interactive Java Runtime Simulator.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Write code. Watch it come alive.</p>
        </div>
      </div>
    </footer>
  );
}
