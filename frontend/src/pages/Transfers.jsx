import React, { useState } from 'react';
import { transferService } from '../services/transferService';

export default function Transfers({ transfers = [], onRetryTransfer, onCancelTransfer, onPreviewFile }) {
  const [activeTab, setActiveTab] = useState('active');

  const activeTransfers = transfers.filter(
    (t) => t.status === 'QUEUED' || t.status === 'CONNECTING' || t.status === 'DOWNLOADING' || t.status === 'UPLOADING'
  );
  const completedTransfers = transfers.filter((t) => t.status === 'COMPLETED');
  const failedTransfers = transfers.filter((t) => t.status === 'FAILED' || t.status === 'CANCELLED');

  const totalSpeedBps = activeTransfers.reduce((sum, t) => sum + (t.speedBps || 0), 0);
  const totalSpeedMB = (totalSpeedBps / (1024 * 1024)).toFixed(1);

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            Direct P2P LAN Mesh Active
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
            Transfers
          </h1>
          <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
            Live peer-to-peer data streaming across local network sockets without internet dependencies.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-surface-elevated p-space-lg flex flex-col justify-between border border-border-subtle/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
              Active TCP Streams
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">sync</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-md">
            <span className="font-display text-4xl text-text-primary font-bold leading-none">
              {activeTransfers.length}
            </span>
            <span className="font-label-md text-xs text-tertiary font-medium">
              Inbound Sockets Direct
            </span>
          </div>
          <div className="mt-space-md flex items-center gap-space-xs text-text-secondary text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            Streaming buffer: 64 KB chunks
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-surface-elevated p-space-lg flex flex-col justify-between border border-border-subtle/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
              Aggregate Throughput
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-md">
            <span className="font-display text-4xl text-text-primary font-bold leading-none">
              {totalSpeedMB}
            </span>
            <span className="font-headline-sm text-sm text-text-secondary font-semibold">
              MB/s
            </span>
          </div>
          <div className="mt-space-md flex items-center justify-between font-label-mono text-[11px] text-text-tertiary">
            <span>LAN Interface Socket</span>
            <span>Zero cloud bottleneck</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-surface-elevated p-space-lg flex flex-col justify-between border border-border-subtle/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
              Air-Gap Cloud Metric
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">cloud_off</span>
          </div>
          <div className="flex items-baseline gap-space-sm mt-space-md">
            <span className="font-display text-4xl text-text-primary font-bold leading-none">
              0
            </span>
            <span className="font-headline-sm text-sm text-text-secondary font-semibold">
              KB Cloud Data
            </span>
          </div>
          <div className="mt-space-md inline-flex items-center gap-space-xs text-tertiary font-label-md text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            100% Local Campus LAN Only
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border-subtle/50 pb-space-xs">
        <div className="inline-flex p-1 rounded-xl bg-surface-container">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-space-md py-1.5 rounded-lg font-body-md-medium text-xs font-semibold transition-all flex items-center gap-space-xs ${
              activeTab === 'active'
                ? 'bg-surface-active text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>Active</span>
            <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded-full bg-primary-container/20 text-primary-fixed-dim">
              {activeTransfers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-space-md py-1.5 rounded-lg font-body-md-medium text-xs font-semibold transition-all flex items-center gap-space-xs ${
              activeTab === 'completed'
                ? 'bg-surface-active text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>Completed</span>
            <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-text-tertiary">
              {completedTransfers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('failed')}
            className={`px-space-md py-1.5 rounded-lg font-body-md-medium text-xs font-semibold transition-all flex items-center gap-space-xs ${
              activeTab === 'failed'
                ? 'bg-surface-active text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>Failed / Cancelled</span>
            <span className="font-label-mono text-[10px] px-1.5 py-0.5 rounded-full bg-status-error/20 text-status-error">
              {failedTransfers.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-space-sm text-text-tertiary text-xs font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            TCP Port 49000
          </span>
          <span>·</span>
          <span>UDP Beacon 47777</span>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-space-md">
          {activeTransfers.length === 0 ? (
            <div className="py-space-xl p-space-xl rounded-2xl bg-surface-elevated border border-border-subtle text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-text-tertiary mb-2 opacity-50">
                cloud_done
              </span>
              <h3 className="font-headline-sm text-sm text-text-primary font-semibold">
                No active socket transfers
              </h3>
              <p className="font-body-md text-xs text-text-secondary mt-1">
                Browse academic material in Discover or Nearby Peers and download to see live streaming progress.
              </p>
            </div>
          ) : (
            activeTransfers.map((t) => (
              <div
                key={t.id}
                className="p-space-lg rounded-2xl bg-surface-elevated border border-border-subtle/50 flex flex-col gap-space-sm shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="p-2 rounded-xl bg-primary-container/20 text-primary">
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-headline-sm text-sm font-semibold text-text-primary truncate">
                        {t.fileName}
                      </h4>
                      <p className="font-label-md text-xs text-text-secondary">
                        Transferring from <span className="text-text-primary font-medium">{t.peerName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md">
                    <div className="text-right font-mono text-xs">
                      <span className="block text-primary font-bold">
                        {t.speedFormatted || 'Calculating...'}
                      </span>
                      <span className="block text-text-tertiary text-[10px]">
                        {t.estimatedSecondsRemaining > 0 ? `${t.estimatedSecondsRemaining}s remaining` : 'Connecting...'}
                      </span>
                    </div>
                    <button
                      onClick={() => onCancelTransfer(t.id)}
                      className="p-2 rounded-xl bg-surface hover:bg-status-error/20 text-text-secondary hover:text-status-error transition-colors"
                      title="Cancel Transfer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0B0D10] h-2.5 rounded-full overflow-hidden border border-border-subtle/30">
                  <div
                    className="h-full bg-gradient-to-r from-primary-container to-tertiary transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, t.progress || 0)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                  <span>
                    {(t.bytesTransferred / (1024 * 1024)).toFixed(2)} MB of{' '}
                    {(t.bytesTotal / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <span>{t.progress ? t.progress.toFixed(1) : 0}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-space-xs">
          {completedTransfers.length === 0 ? (
            <div className="py-space-xl text-center text-text-tertiary text-xs">
              No completed transfers recorded in this session.
            </div>
          ) : (
            completedTransfers.map((t) => (
              <div
                key={t.id}
                className="p-space-md rounded-xl bg-surface-elevated border border-border-subtle/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">
                    check_circle
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-body-md-medium text-xs font-semibold text-text-primary truncate">
                      {t.fileName}
                    </h4>
                    <p className="font-label-md text-[11px] text-text-secondary">
                      {t.direction === 'DOWNLOAD' ? 'Downloaded from' : 'Sent to'} {t.peerName} ·{' '}
                      {(t.bytesTotal / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm">
                  <span className="font-label-mono text-[10px] text-text-tertiary hidden sm:inline">
                    Saved to data/downloads
                  </span>
                  <a
                    href={transferService.getDownloadedFileUrl(t.id)}
                    download
                    className="px-space-md py-1.5 rounded-xl bg-surface-hover hover:bg-surface-active text-text-primary text-xs font-medium flex items-center gap-1 border border-border-subtle"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_open</span>
                    <span>Open File</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'failed' && (
        <div className="space-y-space-xs">
          {failedTransfers.length === 0 ? (
            <div className="py-space-xl text-center text-text-tertiary text-xs">
              No failed transfers. All socket operations running smoothly!
            </div>
          ) : (
            failedTransfers.map((t) => (
              <div
                key={t.id}
                className="p-space-md rounded-xl bg-surface-elevated border border-status-error/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <span className="material-symbols-outlined text-status-error text-[22px]">
                    error
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-body-md-medium text-xs font-semibold text-text-primary truncate">
                      {t.fileName}
                    </h4>
                    <p className="font-label-md text-[11px] text-status-error truncate">
                      {t.errorMessage || 'Peer socket disconnected'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onRetryTransfer(t.id)}
                  className="px-space-md py-1.5 rounded-xl bg-primary-container text-canvas-deep text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>Retry</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
