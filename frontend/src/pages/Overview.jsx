import React, { useState } from 'react';
import TopologyGraph from '../components/TopologyGraph';

export default function Overview({
  profile,
  dashboardStats,
  peers = [],
  activities = [],
  activeTransfers = [],
  onOpenShareModal,
  onTriggerBroadcast,
  onSelectPeer,
}) {
  const [beaconPulsing, setBeaconPulsing] = useState(false);

  const handleBroadcastClick = () => {
    setBeaconPulsing(true);
    onTriggerBroadcast();
    setTimeout(() => setBeaconPulsing(false), 2500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const activePeers = peers.filter((p) => p.status === 'ONLINE');

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Welcome Banner & Peer Hub Status */}
      <div className="relative w-full rounded-2xl bg-surface-elevated p-space-xl shadow-xl overflow-hidden border border-border-subtle/40">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-mono text-label-mono text-tertiary uppercase tracking-widest px-space-xs py-0.5 rounded-full bg-tertiary-container/20 font-medium">
                Active Node Session
              </span>
              <span className="font-label-mono text-label-mono text-text-tertiary font-mono">
                #{profile?.id ? profile.id.substring(0, 8).toUpperCase() : 'NODE-LOCAL'}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
              {getGreeting()}, {profile?.name ? profile.name.split(' ')[0] : 'Student'}
            </h1>
            <p className="font-body-lg text-body-lg text-text-secondary">
              Here's what's happening across your local academic network.
            </p>
          </div>

          <div className="flex items-center gap-space-md">
            <button
              onClick={handleBroadcastClick}
              className={`px-space-md py-space-sm h-11 rounded-xl bg-surface-hover hover:bg-surface-active text-text-primary font-body-md-medium text-body-md-medium flex items-center gap-space-sm transition-all shadow-md active:scale-95 border border-border-subtle/50 ${
                beaconPulsing ? 'ring-2 ring-tertiary/50 bg-tertiary/10' : ''
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] text-tertiary ${beaconPulsing ? 'animate-spin' : ''}`}>
                sensors
              </span>
              <span>{beaconPulsing ? 'Beacon Active...' : 'Broadcast Beacon'}</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="px-space-lg py-space-sm h-11 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep font-body-md-medium text-body-md-medium flex items-center gap-space-sm transition-all shadow-lg shadow-glow-focus active:scale-95 font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Share Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {/* Card 1: Nearby Peers */}
        <div className="relative rounded-2xl bg-surface-elevated p-space-lg shadow-md hover:bg-surface-hover transition-all group overflow-hidden border border-border-subtle/40">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-tertiary/10 blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-start justify-between mb-space-md">
            <div className="p-space-xs rounded-xl bg-surface-active text-tertiary">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Nearby Peers
            </span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-lg text-headline-lg text-text-primary font-bold">
                {dashboardStats?.nearbyPeers || peers.length}
              </span>
              <span className="font-body-md text-body-md text-tertiary font-medium">
                Nodes online
              </span>
            </div>
            <span className="font-body-md text-xs text-text-secondary mt-1">
              {activePeers.length} active on local network
            </span>
          </div>
        </div>

        {/* Card 2: Available Files */}
        <div className="relative rounded-2xl bg-surface-elevated p-space-lg shadow-md hover:bg-surface-hover transition-all group overflow-hidden border border-border-subtle/40">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary-container/10 blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-start justify-between mb-space-md">
            <div className="p-space-xs rounded-xl bg-surface-active text-primary-container">
              <span className="material-symbols-outlined text-[22px]">library_books</span>
            </div>
            <span className="font-label-mono text-[10px] px-2 py-0.5 rounded-full bg-primary-container/10 text-primary-fixed border border-primary/20">
              P2P Mesh
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Available Files
            </span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-lg text-headline-lg text-text-primary font-bold">
                {dashboardStats?.availableFiles || 0}
              </span>
              <span className="font-body-md text-body-md text-primary font-medium">
                Academic chunks
              </span>
            </div>
            <span className="font-body-md text-xs text-text-secondary mt-1">
              Across nearby student devices
            </span>
          </div>
        </div>

        {/* Card 3: Your Shared Files */}
        <div className="relative rounded-2xl bg-surface-elevated p-space-lg shadow-md hover:bg-surface-hover transition-all group overflow-hidden border border-border-subtle/40">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-secondary/10 blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-start justify-between mb-space-md">
            <div className="p-space-xs rounded-xl bg-surface-active text-secondary">
              <span className="material-symbols-outlined text-[22px]">drive_folder_upload</span>
            </div>
            <span className="font-label-mono text-[10px] text-text-tertiary font-medium">
              Local Storage
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Your Shared Files
            </span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-lg text-headline-lg text-text-primary font-bold">
                {dashboardStats?.sharedFiles || 0}
              </span>
              <span className="font-body-md text-body-md text-text-secondary font-medium">
                Study docs
              </span>
            </div>
            <span className="font-body-md text-xs text-text-secondary mt-1">
              Accessible to LAN peers
            </span>
          </div>
        </div>

        {/* Card 4: Active Transfers */}
        <div className="relative rounded-2xl bg-surface-elevated p-space-lg shadow-md hover:bg-surface-hover transition-all group overflow-hidden border border-border-subtle/40">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-status-warning/10 blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-start justify-between mb-space-md">
            <div className="p-space-xs rounded-xl bg-surface-active text-status-warning">
              <span className="material-symbols-outlined text-[22px]">sync_alt</span>
            </div>
            <span className="flex items-center gap-1 font-label-mono text-[10px] px-2 py-0.5 rounded-full bg-status-warning/10 text-status-warning border border-status-warning/20">
              <span className="h-1.5 w-1.5 rounded-full bg-status-warning animate-pulse"></span>
              P2P SOCKET
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Active Transfers
            </span>
            <div className="flex items-baseline gap-space-xs mt-space-xs">
              <span className="font-headline-lg text-headline-lg text-text-primary font-bold">
                {activeTransfers.length}
              </span>
              <span className="font-body-md text-body-md text-status-warning font-medium">
                {activeTransfers.length > 0 ? 'Streaming...' : 'Idle'}
              </span>
            </div>
            <span className="font-body-md text-xs text-text-secondary mt-1">
              Direct peer socket streams
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Topology Visualizer (65%) and Nearby Peers List (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Left: Topology Interactive Map */}
        <div className="lg:col-span-8 rounded-2xl bg-surface-elevated p-space-lg shadow-lg flex flex-col justify-between relative overflow-hidden border border-border-subtle/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-text-primary font-bold">
                  Local Mesh Topology
                </span>
                <span className="px-space-xs py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-mono text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  LIVE UDP/TCP
                </span>
              </div>
              <p className="font-body-md text-xs text-text-secondary mt-0.5">
                Dynamic peer-to-peer constellation discovered on this Wi-Fi / Hotspot.
              </p>
            </div>
          </div>

          {/* Interactive Graph Component */}
          <TopologyGraph
            profile={profile}
            peers={peers}
            activeTransfers={activeTransfers}
            onSelectPeer={onSelectPeer}
          />
        </div>

        {/* Right: Nearby Peers List */}
        <div className="lg:col-span-4 rounded-2xl bg-surface-elevated p-space-lg shadow-lg flex flex-col border border-border-subtle/40">
          <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-base text-text-primary font-semibold">
                Nearby Peers
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-active text-text-tertiary font-mono text-[10px]">
                {peers.length}
              </span>
            </div>
            <button
              onClick={handleBroadcastClick}
              className="text-primary hover:underline text-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span>Refresh</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-space-xs pr-1 max-h-[360px]">
            {peers.length === 0 ? (
              <div className="py-space-xl flex flex-col items-center justify-center text-center text-text-tertiary">
                <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">wifi_find</span>
                <span className="text-xs font-medium text-text-secondary">
                  No nearby MESHNOTE devices yet
                </span>
                <p className="text-[11px] text-text-tertiary max-w-[220px] mt-1">
                  Connect another laptop to this Wi-Fi/hotspot and start MESHNOTE to pair automatically.
                </p>
              </div>
            ) : (
              peers.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  className="p-space-sm rounded-xl bg-surface hover:bg-surface-hover border border-border-subtle/40 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-surface-active text-primary flex items-center justify-center text-xs font-bold ring-1 ring-border-strong">
                        {peer.name ? peer.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-[#101318] ${
                          peer.status === 'ONLINE' ? 'bg-tertiary' : 'bg-text-disabled'
                        }`}
                      ></span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-body-md-medium text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                        {peer.name}
                      </span>
                      <span className="block font-label-md text-[11px] text-text-secondary truncate">
                        {peer.division} · {peer.sharedFileCount || 0} files
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="block font-label-mono text-[10px] text-text-tertiary">
                      {peer.lastSeenText}
                    </span>
                    <span className="text-[10px] text-primary group-hover:underline">
                      Browse →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Network Activity */}
      <div className="rounded-2xl bg-surface-elevated p-space-lg shadow-lg border border-border-subtle/40">
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
            <h3 className="font-headline-sm text-base text-text-primary font-bold">
              Recent Network Activity
            </h3>
          </div>
          <span className="font-label-mono text-[11px] text-text-tertiary">
            Real-time peer event log
          </span>
        </div>

        <div className="space-y-space-xs">
          {activities.length === 0 ? (
            <div className="py-space-lg text-center text-text-tertiary text-xs">
              No recent network events recorded yet.
            </div>
          ) : (
            activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-space-sm rounded-xl bg-surface/60 border border-border-subtle/30 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    {act.type === 'PEER_JOINED'
                      ? 'person_add'
                      : act.type === 'MATERIAL_SHARED'
                      ? 'upload_file'
                      : act.type === 'MATERIAL_DOWNLOADED'
                      ? 'download'
                      : 'info'}
                  </span>
                  <div>
                    <span className="font-semibold text-text-primary">{act.title}</span>
                    <span className="text-text-secondary ml-2">{act.description}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
