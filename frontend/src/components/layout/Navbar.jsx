import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Visualizer', path: '/visualizer' },
    { name: 'Examples', path: '/examples' },
    { name: 'Syllabus Lab', path: '/syllabus', badge: '13' },
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
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/demo"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 transition-all font-medium"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">play_circle</span>
            Guided Demo
          </Link>
          <Link
            to="/visualizer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow-sm hover:shadow-glow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            Launch Visualizer
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-canvas-border bg-[#070A0F] space-y-1">
          {navLinks.map((link) => {
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name} {link.badge && `(${link.badge})`}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/demo"
              onClick={() => setMobileOpen(false)}
              className="text-center text-xs font-medium px-4 py-2 rounded-xl bg-white/5 text-slate-300 border border-white/10"
            >
              Guided Demo
            </Link>
            <Link
              to="/visualizer"
              onClick={() => setMobileOpen(false)}
              className="text-center text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-600 text-white"
            >
              Launch Visualizer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
