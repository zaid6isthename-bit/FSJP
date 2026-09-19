import React from 'react';

export default function Settings({ networkStatus, onOpenTechnicalDetails }) {
  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          System Preferences
        </div>
        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
          Settings
        </h1>
        <p className="font-body-lg text-body-lg text-text-secondary">
          Configure socket ports, storage directories, and telemetry inspection.
        </p>
      </div>

      {/* Network & Ports */}
      <div className="rounded-2xl bg-surface-elevated p-space-xl border border-border-subtle/40 shadow-lg space-y-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">router</span>
            <h3 className="font-headline-sm text-sm text-text-primary font-bold">
              Network Socket Configuration
            </h3>
          </div>
          <button
            onClick={onOpenTechnicalDetails}
            className="text-xs text-primary hover:underline font-mono"
          >
            Inspect Sockets Telemetry →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40">
            <span className="text-[10px] text-text-tertiary block">UDP DISCOVERY PORT</span>
            <span className="text-text-primary font-bold text-sm">
              {networkStatus?.discoveryPort || 47777}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40">
            <span className="text-[10px] text-text-tertiary block">TCP FILE SERVER PORT</span>
            <span className="text-text-primary font-bold text-sm">
              {networkStatus?.p2pPort || 49000}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40">
            <span className="text-[10px] text-text-tertiary block">SPRING BOOT REST PORT</span>
            <span className="text-text-primary font-bold text-sm">
              {networkStatus?.apiPort || 8080}
            </span>
          </div>
        </div>
      </div>

      {/* Storage Directories */}
      <div className="rounded-2xl bg-surface-elevated p-space-xl border border-border-subtle/40 shadow-lg space-y-space-md">
        <div className="flex items-center gap-2 pb-space-sm border-b border-border-subtle/50">
          <span className="material-symbols-outlined text-secondary text-[20px]">folder</span>
          <h3 className="font-headline-sm text-sm text-text-primary font-bold">
            Local Storage Folders
          </h3>
        </div>

        <div className="space-y-space-sm text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40 flex items-center justify-between">
            <div>
              <span className="text-text-tertiary block text-[10px]">LOCAL DATABASE (H2 FILE)</span>
              <span className="text-text-primary">data/database/meshnotedb.mv.db</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-active text-text-secondary text-[10px]">
              PERSISTENT
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40 flex items-center justify-between">
            <div>
              <span className="text-text-tertiary block text-[10px]">SHARED MATERIAL DIRECTORY</span>
              <span className="text-text-primary">data/shared/</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary text-[10px]">
              SAFE UUID
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface/60 border border-border-subtle/40 flex items-center justify-between">
            <div>
              <span className="text-text-tertiary block text-[10px]">DOWNLOADS DIRECTORY</span>
              <span className="text-text-primary">data/downloads/</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-tertiary-container/10 text-tertiary text-[10px]">
              AIR-GAPPED
            </span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-2xl bg-surface-elevated p-space-xl border border-border-subtle/40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <img src="/emblem.svg" alt="MESHNOTE" className="w-10 h-10" />
          <div>
            <h4 className="font-headline-sm text-sm font-bold text-text-primary">
              MESHNOTE v1.0.0
            </h4>
            <p className="font-body-md text-xs text-text-secondary mt-0.5">
              Semester 3 Full Stack Java Academic Project · Zero Cloud Architecture
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTechnicalDetails}
          className="px-space-md py-2 rounded-xl bg-surface-hover hover:bg-surface-active text-text-primary text-xs font-semibold border border-border-subtle transition-all active:scale-95"
        >
          Viva Telemetry
        </button>
      </div>
    </div>
  );
}
