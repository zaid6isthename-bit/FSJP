import React from 'react';

export default function FailureForensicsPanel({ forensics, errorType, errorMessage, errorLine, onReplayFailure, onClose }) {
  if (!errorType && !forensics) return null;

  const refName = forensics?.reference || 'variable';
  const val = forensics?.value || 'null';
  const op = forensics?.operation || 'operation';
  const rootCause = forensics?.rootCause || errorMessage;
  const whatToCheck = forensics?.whatToCheck || [];

  return (
    <div className="w-full bg-[#FAF0EC] border-2 border-[#E4C4B2] rounded-2xl p-5 shadow-card animate-fade-slide-in relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4C4B2] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E4C4B2] flex items-center justify-center text-[#A93226] shadow-subtle">
            <span className="material-symbols-outlined text-2xl">report</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A93226] font-bold">
                RUNTIME FAILURE DETECTED
              </span>
              {errorLine && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-[#A93226] border border-[#E4C4B2] font-bold">
                  Line {errorLine}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#101418] tracking-tight font-display">{errorType}</h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReplayFailure}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#A93226] hover:bg-[#8B2319] text-white font-bold text-xs shadow-subtle transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">replay</span>
            Replay Failure
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#5C6672] hover:text-[#101418] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Forensic Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-mono">
        <div className="bg-white p-2.5 rounded-xl border border-[#E4C4B2] shadow-subtle">
          <span className="text-[10px] text-[#5C6672] uppercase font-sans font-bold block mb-0.5">Reference</span>
          <span className="text-[#A93226] font-bold">{refName}</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-[#E4C4B2] shadow-subtle">
          <span className="text-[10px] text-[#5C6672] uppercase font-sans font-bold block mb-0.5">Evaluated Value</span>
          <span className="text-[#101418] font-bold">{val}</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-[#E4C4B2] shadow-subtle">
          <span className="text-[10px] text-[#5C6672] uppercase font-sans font-bold block mb-0.5">Attempted Operation</span>
          <span className="text-[#101418] font-bold">{op}</span>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-[#101418] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-display">
          <span className="material-symbols-outlined text-sm text-[#A93226]">psychology</span>
          Why did this fail?
        </h4>
        <p className="text-xs text-[#101418] bg-white p-3 rounded-xl border border-[#E4C4B2] leading-relaxed font-normal shadow-subtle">
          {rootCause}
        </p>
      </div>

      {/* Forensic What to Check Recommendations */}
      {whatToCheck && whatToCheck.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[#101418] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-display">
            <span className="material-symbols-outlined text-sm text-[#B7791F]">checklist</span>
            What to check & fix
          </h4>
          <ul className="space-y-1.5 text-xs text-[#5C6672] bg-white p-3 rounded-xl border border-[#E4C4B2] shadow-subtle">
            {whatToCheck.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#B7791F] font-mono text-[11px] mt-0.5 font-bold">•</span>
                <span className="text-[#101418] font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
