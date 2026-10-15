import React from 'react';

export default function TimelineScrubber({ currentIndex, totalEvents, events = [], onScrub }) {
  if (totalEvents <= 0) return null;

  const progressPercent = totalEvents > 1 ? (currentIndex / (totalEvents - 1)) * 100 : 0;

  const getEventDotColor = (type) => {
    switch (type) {
      case 'OBJECT_CREATED': return 'bg-[#101418]';
      case 'METHOD_ENTER':
      case 'METHOD_EXIT': return 'bg-[#5C6672]';
      case 'FIELD_CHANGED':
      case 'VARIABLE_CHANGED': return 'bg-[#0E6E5C]';
      case 'EXCEPTION_THROWN':
      case 'PROGRAM_FAILED': return 'bg-[#A93226] ring-2 ring-[#E4C4B2]';
      case 'OUTPUT_WRITTEN': return 'bg-[#0E6E5C]';
      default: return 'bg-[#8C96A2]';
    }
  };

  return (
    <div className="w-full px-4 py-3 bg-white rounded-xl border border-[#E6E4DC] shadow-card space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-[#5C6672]">
        <span className="flex items-center gap-1.5 font-semibold text-[#101418]">
          <span className="material-symbols-outlined text-sm text-[#0E6E5C]">history</span>
          Execution Timeline (Time Travel)
        </span>
        <span className="text-[#8C96A2]">
          Scrub to travel backward / forward in time
        </span>
      </div>

      {/* Scrubber Track */}
      <div className="relative w-full h-5 flex items-center">
        {/* Background Track */}
        <div className="w-full h-2 bg-[#EFEEE8] rounded-full overflow-hidden relative border border-[#E6E4DC]">
          <div
            className="h-full bg-[#0E6E5C] transition-all"
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
                    isPastOrCurrent ? getEventDotColor(ev.eventType) : 'bg-[#D9D7CE]'
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
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-card border-2 border-[#0E6E5C] pointer-events-none transition-all z-10"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
      </div>
    </div>
  );
}
