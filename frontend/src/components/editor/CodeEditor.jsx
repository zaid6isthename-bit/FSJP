import React, { useRef, useEffect } from 'react';

export default function CodeEditor({
  code,
  onChange,
  activeLine,
  errorLine,
  isRunning,
  onRun,
  onValidate,
  examples = [],
  onSelectExample,
  title,
  onTitleChange,
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = code.split('\n');

  // Sync scrolling between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key in code editor
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E6E4DC] overflow-hidden shadow-card">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#FAFAF8] border-b border-[#E6E4DC] gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E6E4DC]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E6E4DC]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E6E4DC]"></div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Program Title..."
            className="bg-transparent text-xs font-bold text-[#101418] placeholder-[#8C96A2] focus:outline-none focus:ring-1 focus:ring-[#0E6E5C] px-2 py-1 rounded border border-transparent hover:border-[#E6E4DC]"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Example Selector Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) onSelectExample(e.target.value);
              }}
              defaultValue=""
              className="bg-white text-[#101418] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E6E4DC] hover:border-[#101418] focus:outline-none cursor-pointer shadow-subtle"
            >
              <option value="" disabled>Load Example ▾</option>
              {examples.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.category})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 text-[#5C6672] hover:text-[#101418] rounded-lg hover:bg-white border border-transparent hover:border-[#E6E4DC] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>

          <button
            onClick={handleClear}
            title="Clear Editor"
            className="p-1.5 text-[#5C6672] hover:text-[#A93226] rounded-lg hover:bg-white border border-transparent hover:border-[#E6E4DC] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
          </button>

          <button
            onClick={onValidate}
            title="Validate Java Syntax"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#101418] bg-white hover:bg-[#F5F4EF] border border-[#E6E4DC] transition-all shadow-subtle flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-[#0E6E5C]">spellcheck</span>
            Validate
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            title="Execute & Simulate Trace (Ctrl + Enter)"
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0E6E5C] hover:bg-[#0A4A3F] shadow-subtle transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              {isRunning ? 'sync' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Simulating...' : 'Run Java'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Gutter + Code Surface */}
      <div className="relative flex-1 flex overflow-hidden min-h-[360px] bg-white">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-[#FAFAF8] border-r border-[#E6E4DC] select-none overflow-hidden shrink-0 text-right pr-3 leading-6"
        >
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isExec = activeLine === lineNum;
            const isErr = errorLine === lineNum;

            return (
              <div
                key={lineNum}
                className={`relative flex items-center justify-end h-6 font-mono text-[11px] ${
                  isErr
                    ? 'text-[#A93226] font-bold'
                    : isExec
                    ? 'text-[#0E6E5C] font-bold'
                    : 'text-[#8C96A2]'
                }`}
              >
                {isErr ? (
                  <span className="material-symbols-outlined text-[#A93226] text-[13px] absolute left-1">
                    error
                  </span>
                ) : isExec ? (
                  <span className="material-symbols-outlined text-[#0E6E5C] text-[13px] absolute left-1">
                    arrow_forward_ios
                  </span>
                ) : null}
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Text Area / Code Layer */}
        <div className="relative flex-1 h-full overflow-hidden">
          {/* Visual Execution Highlight overlay lines */}
          <div className="absolute inset-0 pointer-events-none py-3 overflow-hidden leading-6">
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const isExec = activeLine === lineNum;
              const isErr = errorLine === lineNum;

              if (!isExec && !isErr) return <div key={lineNum} className="h-6" />;

              return (
                <div
                  key={lineNum}
                  className={`h-6 w-full ${
                    isErr ? 'error-line' : 'executing-line'
                  }`}
                />
              );
            })}
          </div>

          {/* Actual Code Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full bg-transparent text-[#101418] font-mono text-xs leading-6 p-3 pl-3 resize-none focus:outline-none select-text z-10 whitespace-pre"
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFAF8] border-t border-[#E6E4DC] text-[11px] text-[#5C6672] font-mono">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#101418]">Java Educational Subset</span>
          <span>•</span>
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{code.length} chars</span>
        </div>
        <div>
          {errorLine ? (
            <span className="text-[#A93226] font-bold">Failure detected on line {errorLine}</span>
          ) : activeLine ? (
            <span className="text-[#0E6E5C] font-bold">Executing line {activeLine}</span>
          ) : (
            <span className="text-[#8C96A2]">Ready to simulate</span>
          )}
        </div>
      </div>
    </div>
  );
}
