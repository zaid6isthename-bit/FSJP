import React from 'react';

export default function TimelineScrubber({ currentIndex, totalEvents, events = [], onScrub }) {
  if (totalEvents <= 0) return null;

  const progressPercent = totalEvents > 1 ? (currentIndex / (totalEvents - 1)) * 100 : 0;

  const getEventDotColor = (type) => {
    switch (type) {
      case 'OBJECT_CREATED': return 'bg-purple-400';
      case 'METHOD_ENTER':
      case 'METHOD_EXIT': return 'bg-indigo-400';
      case 'FIELD_CHANGED':
      case 'VARIABLE_CHANGED': return 'bg-sky-400';
      case 'EXCEPTION_THROWN':
      case 'PROGRAM_FAILED': return 'bg-red-500 ring-2 ring-red-400/50';
      case 'OUTPUT_WRITTEN': return 'bg-emerald-400';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="w-full px-4 py-3 bg-[#090D15] rounded-xl border border-canvas-border shadow-lg space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-sky-400">history</span>
          Execution Timeline (Time Travel)
        </span>
        <span>
          Scrub to travel backward / forward in time
        </span>
      </div>

      {/* Scrubber Track */}
      <div className="relative w-full h-5 flex items-center">
        {/* Background Track */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Event Keyframe Markers (if less than 60 events, render dots) */}
        {totalEvents <= 60 && (
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-1">
            {events.map((ev, idx) => {
              const isPastOrCurrent = idx <= currentIndex;
              return (
                <div
                  key={idx}
                  title={`Step ${idx + 1}: ${ev.eventType}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    isPastOrCurrent ? getEventDotColor(ev.eventType) : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Interactive Input Range */}
        <input
          type="range"
          min="0"
          max={totalEvents - 1}
          value={currentIndex}
          onChange={(e) => onScrub(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 z-20"
        />

        {/* Scrubber Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-glow-md border-2 border-sky-500 pointer-events-none transition-all z-10"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
      </div>
    </div>
  );
}
