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
    <header className="sticky top-0 z-50 w-full border-b border-[#E6E4DC] bg-[#FAFAF8]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#101418] text-white flex items-center justify-center font-display font-bold text-sm tracking-tight shadow-sm group-hover:bg-[#252B33] transition-colors">
            JVM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-tight text-[#101418] text-base">JVM VISION</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8] font-semibold">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#5C6672] -mt-0.5 font-normal">Runtime Visualization & Failure Analysis</p>
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
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#101418] text-white shadow-sm'
                    : 'text-[#5C6672] hover:text-[#101418] hover:bg-[#F5F4EF]'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            to="/demo"
            className="flex items-center gap-1.5 text-xs text-[#101418] hover:text-[#101418] px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F4EF] border border-[#E6E4DC] transition-all font-semibold shadow-subtle"
          >
            <svg className="w-4 h-4 text-[#B7791F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Guided Demo
          </Link>
          <Link
            to="/visualizer"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-[#0E6E5C] hover:bg-[#0A4A3F] text-white shadow-subtle active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Launch Visualizer
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden p-2 rounded-xl text-[#5C6672] hover:text-[#101418] hover:bg-[#F5F4EF] border border-[#E6E4DC] transition-colors"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-[#E6E4DC] bg-[#FAFAF8] space-y-1">
          {navLinks.map((link) => {
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-[#101418] text-white' : 'text-[#5C6672] hover:text-[#101418] hover:bg-[#F5F4EF]'
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
              className="text-center text-xs font-semibold px-4 py-2.5 rounded-xl bg-white text-[#101418] border border-[#E6E4DC]"
            >
              Guided Demo
            </Link>
            <Link
              to="/visualizer"
              onClick={() => setMobileOpen(false)}
              className="text-center text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#0E6E5C] text-white"
            >
              Launch Visualizer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
