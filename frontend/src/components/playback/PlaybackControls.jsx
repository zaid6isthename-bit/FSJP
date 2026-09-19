import React, { useEffect } from 'react';

export default function PlaybackControls({
  currentIndex,
  totalEvents,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onRestart,
  onJumpToEnd,
  speed,
  onSpeedChange,
}) {
  const speeds = [0.5, 1, 2, 4];

  // Keyboard Shortcuts: Space (Play/Pause), Left Arrow (Prev), Right Arrow (Next), R (Restart)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing inside textarea or input
      if (['TEXTAREA', 'INPUT', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onPlay, onPause, onStepForward, onStepBackward, onRestart]);

  const isAtStart = currentIndex <= 0;
  const isAtEnd = currentIndex >= totalEvents - 1;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-[#090D15] rounded-xl border border-canvas-border shadow-lg">
      {/* Primary Transport Controls */}
      <div className="flex items-center gap-1.5">
        {/* Restart */}
        <button
          onClick={onRestart}
          disabled={isAtStart || totalEvents === 0}
          title="Restart (R)"
          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">first_page</span>
        </button>

        {/* Step Backward */}
        <button
          onClick={onStepBackward}
          disabled={isAtStart || totalEvents === 0}
          title="Step Backward (Left Arrow)"
          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">skip_previous</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalEvents === 0 || (isAtEnd && !isPlaying)}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs shadow-glow-sm transition-all active:scale-95 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={isAtEnd || totalEvents === 0}
          title="Step Forward (Right Arrow)"
          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">skip_next</span>
        </button>

        {/* Jump to End */}
        <button
          onClick={onJumpToEnd}
          disabled={isAtEnd || totalEvents === 0}
          title="Jump to End"
          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">last_page</span>
        </button>
      </div>

      {/* Step Counter */}
      <div className="font-mono text-xs text-slate-300">
        <span className="text-sky-400 font-bold">{totalEvents > 0 ? currentIndex + 1 : 0}</span>
        <span className="text-slate-500"> / {totalEvents}</span>
        <span className="text-slate-500 text-[10px] ml-1.5">events</span>
      </div>

      {/* Playback Speed Selector */}
      <div className="flex items-center gap-1 bg-[#101624] p-1 rounded-lg border border-canvas-border">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              speed === s
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
