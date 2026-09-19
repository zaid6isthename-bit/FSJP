import React from 'react';

export default function TechnicalDetailsModal({ isOpen, onClose, networkStatus, profile }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-surface-elevated border border-border-strong p-space-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-border-subtle/60">
          <div className="flex items-center gap-space-sm">
            <div className="p-2 rounded-xl bg-tertiary-container/20 text-tertiary">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base text-text-primary font-semibold">
                Technical Telemetry & Network Details
              </h2>
              <p className="font-label-md text-xs text-text-secondary">
                Live Java sockets and local mesh runtime parameters (Viva Demo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Technical Properties Grid */}
        <div className="mt-space-lg space-y-space-md font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#0B0D10] border border-border-subtle/50 space-y-2">
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-text-tertiary">NODE IDENTIFIER (UUID):</span>
              <span className="text-primary truncate max-w-[280px]">
                {networkStatus?.nodeId || profile?.id || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-text-tertiary">LOCAL LAN IP:</span>
              <span className="text-text-primary font-semibold">
                {networkStatus?.localIp || '127.0.0.1'}
              </span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-text-tertiary">SPRING BOOT REST PORT:</span>
              <span className="text-text-primary">{networkStatus?.apiPort || 8080} (HTTP REST)</span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-text-tertiary">JAVA TCP P2P PORT:</span>
              <span className="text-tertiary font-semibold">
                {networkStatus?.p2pPort || 49000} (ServerSocket)
              </span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span className="text-text-tertiary">JAVA UDP DISCOVERY PORT:</span>
              <span className="text-tertiary font-semibold">
                {networkStatus?.discoveryPort || 47777} (DatagramSocket)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div className="p-3 rounded-xl bg-[#0B0D10] border border-border-subtle/50 space-y-1">
              <span className="text-[10px] text-text-tertiary uppercase">DISCOVERY PROTOCOL</span>
              <div className="text-text-primary font-semibold">UDP Broadcast HELLO</div>
              <div className="text-[11px] text-text-secondary">Interval: 5s · Timeout: 15s</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0B0D10] border border-border-subtle/50 space-y-1">
              <span className="text-[10px] text-text-tertiary uppercase">TRANSFER PROTOCOL</span>
              <div className="text-text-primary font-semibold">TCP Streaming Sockets</div>
              <div className="text-[11px] text-text-secondary">Chunk buffer: 64 KB</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-tertiary-container/10 border border-tertiary/20 text-tertiary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-semibold text-[11px]">Campus Air-Gap Verified: 0 Cloud Calls</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-tertiary/20">
              100% LAN ONLY
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-space-lg pt-space-md border-t border-border-subtle/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-space-lg py-2 rounded-xl bg-surface hover:bg-surface-hover text-text-primary text-xs font-medium transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
