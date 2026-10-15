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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFAF8] border-b border-[#E6E4DC]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#101418] text-base">terminal</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#101418] font-display">Program Output</span>
        </div>
        {output && (
          <button
            onClick={handleCopy}
            title="Copy Output"
            className="text-[11px] text-[#5C6672] hover:text-[#101418] flex items-center gap-1 hover:bg-white px-2 py-0.5 rounded border border-transparent hover:border-[#E6E4DC] transition-colors"
          >
            <span className="material-symbols-outlined text-xs">content_copy</span>
            Copy
          </button>
        )}
      </div>

      {/* Terminal View */}
      <div
        ref={terminalRef}
        className="flex-1 p-3 font-mono text-xs overflow-y-auto bg-[#FAFAF8] text-[#101418] whitespace-pre-wrap leading-relaxed select-text"
      >
        {output ? (
          <div className="font-semibold">{output}</div>
        ) : (
          <p className="text-[#8C96A2] italic">No output produced yet. Calls to System.out.println() will appear here.</p>
        )}
      </div>
    </div>
  );
}
