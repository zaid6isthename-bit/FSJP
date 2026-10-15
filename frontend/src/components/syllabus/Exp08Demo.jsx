import React, { useState } from 'react';

export default function Exp08Demo() {
  const [emailInput, setEmailInput] = useState('zaid@college.edu');

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
      <div className="border-b border-[#E6E4DC] pb-4">
        <h3 className="text-base font-bold text-[#101418] font-display">JavaScript Client-Side Email Validation</h3>
        <p className="text-xs text-[#5C6672]">
          Educational validation checking string index bounds, @ symbol positioning, and domain structure before form submission
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Validation Sandbox */}
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] font-bold font-display">Live Input Field</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF7EC] text-[#B7791F] border border-[#F6E0B5] font-semibold">
              Educational Validation Example
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#101418]">Email Address</label>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E4DC] text-[#101418] focus:border-[#0E6E5C] focus:outline-none shadow-subtle font-medium"
              placeholder="e.g. zaid@college.edu"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setEmailInput('zaid@college.edu')}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white text-[#101418] border border-[#E6E4DC] hover:border-[#101418] font-medium transition-all cursor-pointer shadow-subtle"
            >
              Test Valid (zaid@college.edu)
            </button>
            <button
              onClick={() => setEmailInput('zaidcollege.edu')}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white text-[#101418] border border-[#E6E4DC] hover:border-[#101418] font-medium transition-all cursor-pointer shadow-subtle"
            >
              Missing @ (zaidcollege.edu)
            </button>
            <button
              onClick={() => setEmailInput('zaid@college')}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-white text-[#101418] border border-[#E6E4DC] hover:border-[#101418] font-medium transition-all cursor-pointer shadow-subtle"
            >
              Missing Domain (zaid@college)
            </button>
          </div>

          {/* Result Alert Box */}
          <div
            className={`p-4 rounded-xl border font-mono text-xs shadow-subtle ${
              status.isValid
                ? 'bg-[#EFF5F2] text-[#0A4A3F] border-[#CFE0D8]'
                : 'bg-[#FAF0EC] text-[#A93226] border-[#E4C4B2]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <span className="material-symbols-outlined text-base">
                {status.isValid ? 'check_circle' : 'error'}
              </span>
              {status.isValid ? '✓ Valid email format' : '⚠ Please enter a valid email address.'}
            </div>
            <div className="text-[11px] font-sans">
              {status.isValid
                ? 'All educational string validation checks passed.'
                : 'String failed one or more rule checks.'}
            </div>
          </div>
        </div>

        {/* Validation Rule Breakdown */}
        <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E6E4DC] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#5C6672] flex items-center gap-2 font-bold font-display">
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">rule</span>
            Syllabus Rule Evaluation
          </h4>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] flex items-center justify-between shadow-subtle">
              <div>
                <span className="text-[#101418] font-bold">1. Presence of '@' (atIndex &gt;= 1)</span>
                <div className="text-[10px] text-[#5C6672] font-sans">Must have username before @</div>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                status.hasAt ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'bg-[#FAF0EC] text-[#A93226] border border-[#E4C4B2]'
              }`}>
                {status.hasAt ? 'PASS' : 'FAIL'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] flex items-center justify-between shadow-subtle">
              <div>
                <span className="text-[#101418] font-bold">2. '.' after '@' (dotIndex &gt; atIndex + 1)</span>
                <div className="text-[10px] text-[#5C6672] font-sans">Must have domain name between @ and .</div>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                status.hasDotAfterAt ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'bg-[#FAF0EC] text-[#A93226] border border-[#E4C4B2]'
              }`}>
                {status.hasDotAfterAt ? 'PASS' : 'FAIL'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E4DC] flex items-center justify-between shadow-subtle">
              <div>
                <span className="text-[#101418] font-bold">3. Extension Length (dotIndex + 2 &lt; length)</span>
                <div className="text-[10px] text-[#5C6672] font-sans">Must have at least 2 chars for TLD (.edu, .com)</div>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                status.hasDomainExtension ? 'bg-[#EFF5F2] text-[#0A4A3F] border border-[#CFE0D8]' : 'bg-[#FAF0EC] text-[#A93226] border border-[#E4C4B2]'
              }`}>
                {status.hasDomainExtension ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
