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
    <div className="flex flex-col h-full bg-[#0D121D] rounded-2xl border border-canvas-border overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#090D15] border-b border-canvas-border gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Program Title..."
            className="bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 px-2 py-0.5 rounded border border-transparent hover:border-canvas-border"
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
              className="bg-[#131B2B] text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-canvas-border hover:border-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Examples ▾</option>
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
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
          </button>

          <button
            onClick={handleClear}
            title="Clear Editor"
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>

          {/* Validate Button */}
          <button
            onClick={onValidate}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-[#162032] hover:bg-[#1E2C44] rounded-lg border border-canvas-border transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm text-sky-400">spellcheck</span>
            Validate
          </button>

          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-lg shadow-glow-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {isRunning ? 'sync' : 'play_arrow'}
            </span>
            {isRunning ? 'Simulating...' : 'Run (Ctrl+Enter)'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs">
        {/* Line Numbers with Execution Marker */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-[#090D15] text-slate-500 text-right pr-3 select-none py-3 border-r border-canvas-border overflow-hidden leading-6"
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
                    ? 'text-red-400 font-bold'
                    : isExec
                    ? 'text-sky-400 font-bold'
                    : 'text-slate-600'
                }`}
              >
                {isErr ? (
                  <span className="material-symbols-outlined text-red-500 text-[13px] absolute left-1">
                    error
                  </span>
                ) : isExec ? (
                  <span className="material-symbols-outlined text-sky-400 text-[13px] absolute left-1 animate-pulse">
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
                    isErr ? 'error-line' : 'executing-line shadow-glow-sm'
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
            className="absolute inset-0 w-full h-full bg-transparent text-slate-100 font-mono text-xs leading-6 p-3 pl-3 resize-none focus:outline-none select-text z-10 whitespace-pre"
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090D15] border-t border-canvas-border text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Java (Educational Subset)</span>
          <span>•</span>
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{code.length} chars</span>
        </div>
        <div>
          {errorLine ? (
            <span className="text-red-400 font-medium">Failure detected on line {errorLine}</span>
          ) : activeLine ? (
            <span className="text-sky-400 font-medium">Executing line {activeLine}</span>
          ) : (
            <span className="text-slate-500">Ready to simulate</span>
          )}
        </div>
      </div>
    </div>
  );
}
