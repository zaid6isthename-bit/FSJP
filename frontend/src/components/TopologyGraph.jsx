import React, { useMemo } from 'react';

export default function TopologyGraph({ profile, peers = [], activeTransfers = [], onSelectPeer }) {
  const onlinePeers = useMemo(() => {
    return peers.filter((p) => p.status === 'ONLINE');
  }, [peers]);

  // Calculate radial coordinates for online peers around center (250, 180)
  const centerX = 260;
  const centerY = 190;
  const radius = 135;

  const peerNodes = useMemo(() => {
    if (onlinePeers.length === 0) return [];
    return onlinePeers.map((peer, idx) => {
      const angle = (idx / onlinePeers.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const isTransferring = activeTransfers.some((t) => t.peerNodeId === peer.id);
      return {
        ...peer,
        x,
        y,
        isTransferring,
      };
    });
  }, [onlinePeers, activeTransfers]);

  return (
    <div className="relative w-full h-[360px] rounded-xl bg-[#0B0E13] border border-border-subtle/40 overflow-hidden flex items-center justify-center select-none shadow-inner">
      {/* Background Grid & Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#1d2430_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute w-[450px] h-[450px] rounded-full border border-border-subtle/20 pointer-events-none"></div>
      <div className="absolute w-[270px] h-[270px] rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite] pointer-events-none"></div>

      {/* SVG Canvas for Connection Lines and Transfer Particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 520 380">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66A3FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#55DEA1" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Connection Lines to online peers */}
        {peerNodes.map((peer) => (
          <g key={`line-${peer.id}`}>
            <line
              x1={centerX}
              y1={centerY}
              x2={peer.x}
              y2={peer.y}
              stroke="url(#lineGrad)"
              strokeWidth={peer.isTransferring ? 2.5 : 1.5}
              strokeDasharray={peer.isTransferring ? '4 4' : '2 3'}
              className={peer.isTransferring ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''}
            />

            {/* Traveling Data Packet for Active Transfers */}
            {peer.isTransferring && (
              <circle r="4" fill="#66A3FF" filter="url(#glow)">
                <animateMotion
                  path={`M ${peer.x} ${peer.y} L ${centerX} ${centerY}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
      </svg>

      {/* Center Node: Local Machine */}
      <div
        className="absolute z-20 flex flex-col items-center cursor-pointer group"
        style={{ left: `${centerX}px`, top: `${centerY}px`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-tertiary/20 animate-ping opacity-60 pointer-events-none"></span>
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated border-2 border-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-tertiary text-[26px]">laptop_mac</span>
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-tertiary ring-2 ring-[#0B0E13] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </span>
        </div>
        <div className="mt-2 text-center">
          <span className="block font-headline-sm text-xs font-semibold text-text-primary tracking-tight">
            {profile?.name || 'You (Local Node)'}
          </span>
          <span className="block font-label-mono text-[10px] text-tertiary uppercase tracking-wider">
            Active Hub
          </span>
        </div>
      </div>

      {/* Discovered Peer Nodes */}
      {peerNodes.map((peer) => (
        <div
          key={peer.id}
          onClick={() => onSelectPeer && onSelectPeer(peer)}
          className="absolute z-20 flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
          style={{ left: `${peer.x}px`, top: `${peer.y}px`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            {peer.isTransferring && (
              <span className="absolute -inset-1.5 rounded-full bg-primary/40 animate-ping"></span>
            )}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md border ${
                peer.isTransferring
                  ? 'bg-primary-container/20 border-primary shadow-glow-focus'
                  : 'bg-surface-elevated border-border-strong hover:border-primary'
              }`}
            >
              <span className="material-symbols-outlined text-text-primary text-[20px]">
                person
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-tertiary ring-2 ring-[#0B0E13]"></span>
          </div>
          <div className="mt-1 text-center max-w-[90px]">
            <span className="block font-body-md-medium text-[11px] font-semibold text-text-primary truncate">
              {peer.name}
            </span>
            <span className="block font-label-mono text-[9px] text-text-tertiary truncate">
              {peer.sharedFileCount || 0} files
            </span>
          </div>
        </div>
      ))}

      {/* Empty Peer State Message */}
      {onlinePeers.length === 0 && (
        <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
          <span className="inline-block px-space-md py-1 rounded-full bg-surface-elevated/80 border border-border-subtle text-text-secondary text-xs backdrop-blur-md">
            Listening on UDP port 47777 · Nearby MESHNOTE devices will materialize here
          </span>
        </div>
      )}
    </div>
  );
}
