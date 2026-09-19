import React, { useRef, useEffect } from 'react';

export default function OutputConsole({ output = '' }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-xl">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090D15] border-b border-canvas-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sky-400 text-base">terminal</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Program Output</span>
        </div>
        {output && (
          <button
            onClick={handleCopy}
            title="Copy Output"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 hover:bg-white/[0.05] px-2 py-0.5 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-xs">content_copy</span>
            Copy
          </button>
        )}
      </div>

      {/* Terminal View */}
      <div
        ref={terminalRef}
        className="flex-1 p-3 font-mono text-xs overflow-y-auto bg-[#070A0F] text-slate-200 whitespace-pre-wrap leading-relaxed select-text"
      >
        {output ? (
          <div>{output}</div>
        ) : (
          <p className="text-slate-600 italic">No output produced yet. Calls to System.out.println() will appear here.</p>
        )}
      </div>
    </div>
  );
}
