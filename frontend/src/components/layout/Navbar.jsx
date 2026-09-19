import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Visualizer', path: '/visualizer' },
    { name: 'Examples', path: '/examples' },
    { name: 'History', path: '/history' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-canvas-border bg-[#070A0F]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-indigo p-0.5 shadow-glow-sm group-hover:shadow-glow-md transition-all">
            <div className="w-full h-full bg-[#070A0F] rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-brand-cyan text-xl">view_in_ar</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">JVM VISION</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-brand-cyan border border-blue-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">Runtime Visualization & Failure Analysis</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/visualizer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Start Visualizing
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-canvas-border bg-[#0B0F17] px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/[0.06]"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/visualizer"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Start Visualizing
          </Link>
        </div>
      )}
    </header>
  );
}
