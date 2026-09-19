import React, { useState } from 'react';

export default function Exp08Demo() {
  const [emailInput, setEmailInput] = useState('zaid@college.edu');
  const [hasValidated, setHasValidated] = useState(false);

  const checkValidation = (email) => {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    const hasAt = atIndex >= 1;
    const hasDotAfterAt = dotIndex > atIndex + 1;
    const hasDomainExtension = dotIndex + 2 < email.length;
    const isValid = hasAt && hasDotAfterAt && hasDomainExtension;

    return {
      hasAt,
      hasDotAfterAt,
      hasDomainExtension,
      isValid,
    };
  };

  const status = checkValidation(emailInput);

  return (
    <div className="space-y-6">
      <div className="border-b border-canvas-border pb-4">
        <h3 className="text-base font-semibold text-white">JavaScript Client-Side Email Validation</h3>
        <p className="text-xs text-slate-400">
          Educational validation checking string index bounds, @ symbol positioning, and domain structure before form submission
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Validation Sandbox */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Input Field</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Educational Validation Example
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Email Address</label>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setHasValidated(true);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-canvas-border text-white focus:outline-none focus:border-brand-blue"
              placeholder="e.g. zaid@college.edu"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => {
                setEmailInput('zaid@college.edu');
                setHasValidated(true);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
            >
              Test Valid (zaid@college.edu)
            </button>
            <button
              onClick={() => {
                setEmailInput('zaidcollege.edu');
                setHasValidated(true);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
            >
              Missing @ (zaidcollege.edu)
            </button>
            <button
              onClick={() => {
                setEmailInput('zaid@college');
                setHasValidated(true);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
            >
              Missing Domain (zaid@college)
            </button>
          </div>

          {/* Result Alert Box */}
          <div
            className={`p-4 rounded-xl border font-mono text-xs ${
              status.isValid
                ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/20 text-rose-300 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <span className="material-symbols-outlined text-base">
                {status.isValid ? 'check_circle' : 'error'}
              </span>
              {status.isValid ? '✓ Valid email format' : '⚠ Please enter a valid email address.'}
            </div>
            <div className="text-[11px] opacity-80 font-sans">
              {status.isValid
                ? 'All educational string validation checks passed.'
                : 'String failed one or more rule checks.'}
            </div>
          </div>
        </div>

        {/* Validation Rule Breakdown */}
        <div className="p-6 rounded-2xl bg-canvas-card border border-canvas-border space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-brand-cyan">rule</span>
            Syllabus Rule Evaluation
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border flex items-center justify-between">
              <div>
                <span className="text-slate-300">1. Presence of '@' (atIndex &gt;= 1)</span>
                <div className="text-[10px] text-slate-500 font-sans">Must have username before @</div>
              </div>
              <span className={status.hasAt ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {status.hasAt ? 'PASS' : 'FAIL'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border flex items-center justify-between">
              <div>
                <span className="text-slate-300">2. '.' after '@' (dotIndex &gt; atIndex + 1)</span>
                <div className="text-[10px] text-slate-500 font-sans">Must have domain name between @ and .</div>
              </div>
              <span className={status.hasDotAfterAt ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {status.hasDotAfterAt ? 'PASS' : 'FAIL'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-canvas-border flex items-center justify-between">
              <div>
                <span className="text-slate-300">3. Extension Length (dotIndex + 2 &lt; length)</span>
                <div className="text-[10px] text-slate-500 font-sans">Must have at least 2 chars for TLD (.edu, .com)</div>
              </div>
              <span className={status.hasDomainExtension ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {status.hasDomainExtension ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
