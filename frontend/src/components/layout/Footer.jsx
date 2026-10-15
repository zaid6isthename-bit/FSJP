import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#E6E4DC] bg-[#FAFAF8] py-12 text-[#5C6672] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#101418] text-white flex items-center justify-center font-display font-bold text-xs">
                JVM
              </div>
              <span className="font-display font-bold text-[#101418] tracking-tight text-base">JVM VISION</span>
            </div>
            <p className="text-[#5C6672] text-xs max-w-md leading-relaxed">
              An educational Java runtime visualization and failure analysis platform.
              Explore call stacks, heap allocations, object references, and deterministic failure forensics step-by-step.
            </p>
            <p className="text-[11px] text-[#8C96A2] mt-3">
              Built with Java 21, Spring Boot 3, Spring JDBC, and React 19.
            </p>
          </div>

          <div>
            <h4 className="text-[#101418] font-bold text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/visualizer" className="hover:text-[#101418] transition-colors">Visualizer Workbench</Link></li>
              <li><Link to="/examples" className="hover:text-[#101418] transition-colors">Example Library</Link></li>
              <li><Link to="/history" className="hover:text-[#101418] transition-colors">Saved Sessions</Link></li>
              <li><Link to="/about" className="hover:text-[#101418] transition-colors">Architecture & Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#101418] font-bold text-xs uppercase tracking-wider mb-3">Flagship Demos</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-[#101418] font-medium">Object Creation:</span> Student.study()</li>
              <li><span className="text-[#A93226] font-medium">Crash Analysis:</span> NullPointerException</li>
              <li><span className="text-[#B7791F] font-medium">Math Error:</span> Division by Zero</li>
              <li><span className="text-[#0E6E5C] font-medium">Watchdog:</span> Infinite Loop Limit</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E6E4DC] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C96A2]">
          <p>© 2026 JVM VISION. Educational Interactive Java Runtime Simulator.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Write code. Watch it come alive.</p>
        </div>
      </div>
    </footer>
  );
}
