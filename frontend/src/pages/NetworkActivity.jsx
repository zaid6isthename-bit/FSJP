import React from 'react';

export default function NetworkActivity({ activities = [] }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'PEER_JOINED':
        return { icon: 'person_add', color: 'text-tertiary', bg: 'bg-tertiary-container/20' };
      case 'PEER_LEFT':
        return { icon: 'person_remove', color: 'text-text-disabled', bg: 'bg-surface-variant' };
      case 'MATERIAL_SHARED':
        return { icon: 'upload_file', color: 'text-primary', bg: 'bg-primary-container/20' };
      case 'MATERIAL_DOWNLOADED':
      case 'TRANSFER_COMPLETED':
        return { icon: 'download', color: 'text-secondary', bg: 'bg-secondary/20' };
      case 'TRANSFER_FAILED':
        return { icon: 'error', color: 'text-status-error', bg: 'bg-status-error/20' };
      case 'SHARING_PAUSED':
        return { icon: 'pause', color: 'text-status-warning', bg: 'bg-status-warning/20' };
      case 'SHARING_RESUMED':
        return { icon: 'play_arrow', color: 'text-tertiary', bg: 'bg-tertiary-container/20' };
      default:
        return { icon: 'notifications', color: 'text-text-secondary', bg: 'bg-surface' };
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          Audit & Mesh Event Log
        </div>
        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
          Network Activity
        </h1>
        <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
          Real-time record of peer discoveries, downloads, material updates, and local network socket sessions.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="rounded-2xl bg-surface-elevated p-space-xl border border-border-subtle/40 shadow-lg">
        <div className="flex items-center justify-between pb-space-md border-b border-border-subtle/50 mb-space-lg">
          <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
            Event Log ({activities.length})
          </span>
          <span className="font-label-mono text-[11px] text-text-tertiary font-mono">
            Source: Local H2 database table activity_log
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-space-xl text-center text-text-tertiary text-xs">
            No network events recorded yet. Connect to a peer or share notes to see activity here!
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border-subtle space-y-space-lg">
            {activities.map((act) => {
              const style = getEventIcon(act.type);
              return (
                <div key={act.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[37px] top-1.5 w-7 h-7 rounded-xl ${style.bg} ${style.color} flex items-center justify-center border border-border-strong group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {style.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-space-md rounded-2xl bg-surface hover:bg-surface-hover border border-border-subtle/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <h4 className="font-body-md-medium text-xs font-semibold text-text-primary">
                        {act.title}
                      </h4>
                      <span className="font-label-mono text-[10px] text-text-tertiary">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-body-md text-xs text-text-secondary mt-1">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
