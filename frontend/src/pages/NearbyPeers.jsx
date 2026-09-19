import React, { useState } from 'react';

export default function NearbyPeers({ peers = [], onSelectPeer, onTriggerBroadcast }) {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    onTriggerBroadcast();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const filtered = peers.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) ||
      p.division?.toLowerCase().includes(s) ||
      p.deviceName?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            Zero-Config Peer Discovery Active (UDP 47777)
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
            Nearby Peers
          </h1>
          <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
            Students currently detected on your local Wi-Fi network or hotspot. No cloud account required.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={handleRefresh}
            className="h-11 px-space-md rounded-xl bg-surface-elevated hover:bg-surface-hover text-text-primary font-body-md-medium text-xs font-semibold shadow-sm transition-all flex items-center gap-space-xs border border-border-subtle/50 active:scale-95"
          >
            <span className={`material-symbols-outlined text-[18px] text-tertiary ${refreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{refreshing ? 'Scanning Subnet...' : 'Refresh Discovery'}</span>
          </button>
        </div>
      </div>

      {/* Peer Search Filter */}
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-[18px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter nearby peers by name, division, device..."
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-elevated text-text-primary placeholder:text-text-tertiary text-xs border border-border-subtle focus:outline-none focus:ring-1 focus:ring-primary-container"
        />
      </div>

      {/* Peers List */}
      <div>
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-lg">
          <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
            Connected Classmates ({filtered.length})
          </span>
          <span className="font-label-mono text-[11px] text-text-tertiary">
            Heartbeat timeout: 15 seconds
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-space-xl p-space-xl rounded-2xl bg-surface-elevated border border-border-subtle text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-text-tertiary mb-2 opacity-50">
              wifi_tethering_off
            </span>
            <h3 className="font-headline-sm text-sm text-text-primary font-semibold">
              No nearby MESHNOTE peers detected
            </h3>
            <p className="font-body-md text-xs text-text-secondary max-w-sm mt-1">
              Ensure another laptop is connected to the same Wi-Fi router or mobile hotspot and has MESHNOTE running.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-space-md px-space-lg py-2 rounded-xl bg-primary-container text-canvas-deep font-semibold text-xs shadow-md active:scale-95"
            >
              Send UDP Ping Beacon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filtered.map((peer) => (
              <div
                key={peer.id}
                className="rounded-2xl bg-surface-elevated p-space-lg border border-border-subtle/50 hover:border-primary/40 transition-all flex flex-col justify-between shadow-md hover:shadow-xl group"
              >
                <div>
                  {/* Top Bar: Online status & Last seen */}
                  <div className="flex items-center justify-between mb-space-md">
                    <span
                      className={`inline-flex items-center gap-1 font-label-mono text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        peer.status === 'ONLINE'
                          ? 'bg-tertiary-container/20 text-tertiary border border-tertiary/20'
                          : 'bg-surface-variant text-text-disabled'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          peer.status === 'ONLINE' ? 'bg-tertiary animate-pulse' : 'bg-text-disabled'
                        }`}
                      ></span>
                      {peer.status || 'ONLINE'}
                    </span>
                    <span className="font-label-mono text-[10px] text-text-tertiary">
                      {peer.lastSeenText}
                    </span>
                  </div>

                  {/* Peer Identity */}
                  <div className="flex items-center gap-space-md mb-space-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary-container/15 text-primary flex items-center justify-center font-bold text-lg ring-1 ring-border-strong group-hover:scale-105 transition-transform">
                      {peer.name ? peer.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-headline-sm text-sm text-text-primary font-bold truncate group-hover:text-primary transition-colors">
                        {peer.name}
                      </h3>
                      <p className="font-body-md text-xs text-text-secondary truncate">
                        {peer.division} · Semester {peer.semester}
                      </p>
                      <p className="font-label-mono text-[10px] text-text-tertiary truncate">
                        Device: {peer.deviceName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Shared Files & Browse CTA */}
                <div className="pt-space-md mt-space-md border-t border-border-subtle/40 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      inventory_2
                    </span>
                    <span className="font-body-md-medium text-xs font-semibold text-text-primary">
                      {peer.sharedFileCount || 0}
                    </span>
                    <span className="text-text-tertiary text-[11px]">files shared</span>
                  </div>

                  <button
                    onClick={() => onSelectPeer(peer)}
                    className="px-space-md py-1.5 rounded-xl bg-surface-hover hover:bg-surface-active text-text-primary border border-border-subtle text-xs font-medium flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span>Browse Files</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
