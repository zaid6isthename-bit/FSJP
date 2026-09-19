import React from 'react';

export default function FailureForensicsPanel({ forensics, errorType, errorMessage, errorLine, onReplayFailure, onClose }) {
  if (!errorType && !forensics) return null;

  const refName = forensics?.reference || 'variable';
  const val = forensics?.value || 'null';
  const op = forensics?.operation || 'operation';
  const rootCause = forensics?.rootCause || errorMessage;
  const whatToCheck = forensics?.whatToCheck || [];

  return (
    <div className="w-full bg-gradient-to-br from-red-950/40 via-[#180F15] to-[#0D121D] border-2 border-red-500/50 rounded-2xl p-5 shadow-glow-error animate-fade-slide-in relative overflow-hidden">
      {/* Background ambient red glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-red-500/20 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <span className="material-symbols-outlined text-2xl">report</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                RUNTIME FAILURE DETECTED
              </span>
              {errorLine && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  Line {errorLine}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{errorType}</h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReplayFailure}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-glow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">replay</span>
            Replay Failure
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Forensic Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-mono">
        <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Reference</span>
          <span className="text-red-400 font-bold">{refName}</span>
        </div>
        <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Evaluated Value</span>
          <span className="text-white font-bold">{val}</span>
        </div>
        <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Attempted Operation</span>
          <span className="text-sky-300 font-bold">{op}</span>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-red-400">psychology</span>
          Why did this fail?
        </h4>
        <p className="text-xs text-slate-200 bg-black/40 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
          {rootCause}
        </p>
      </div>

      {/* Forensic What to Check Recommendations */}
      {whatToCheck && whatToCheck.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-amber-400">checklist</span>
            What to check & fix
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/[0.06]">
            {whatToCheck.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-mono text-[11px] mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
