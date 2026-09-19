import React from 'react';
import { transferService } from '../services/transferService';

export default function SharedWithMe({ transfers = [], onPreviewFile }) {
  const downloadedFiles = transfers.filter(
    (t) => t.direction === 'DOWNLOAD' && t.status === 'COMPLETED'
  );

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          Downloaded Academic Material
        </div>
        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
          Shared With Me
        </h1>
        <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
          Academic material downloaded from peers over your local campus network. Available offline in your downloads folder.
        </p>
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-lg">
          <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
            Downloaded Documents ({downloadedFiles.length})
          </span>
          <span className="font-label-mono text-[11px] text-text-tertiary">
            Physical path: data/downloads
          </span>
        </div>

        {downloadedFiles.length === 0 ? (
          <div className="py-space-xl p-space-xl rounded-2xl bg-surface-elevated border border-border-subtle text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-text-tertiary mb-2 opacity-50">
              cloud_download
            </span>
            <h3 className="font-headline-sm text-sm text-text-primary font-semibold">
              No downloaded files yet
            </h3>
            <p className="font-body-md text-xs text-text-secondary max-w-sm mt-1">
              Browse materials shared by classmates in Discover or Nearby Peers and download them directly over TCP.
            </p>
          </div>
        ) : (
          <div className="space-y-space-sm">
            {downloadedFiles.map((t) => (
              <div
                key={t.id}
                className="p-space-md rounded-2xl bg-surface-elevated border border-border-subtle/50 hover:border-border-strong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-tertiary-container/15 text-tertiary flex items-center justify-center font-bold text-sm ring-1 ring-border-strong flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline-sm text-sm font-semibold text-text-primary truncate">
                      {t.fileName}
                    </h3>
                    <p className="font-label-md text-xs text-text-secondary mt-0.5">
                      Received from <span className="text-text-primary font-medium">{t.peerName}</span> ·{' '}
                      {(t.bytesTotal / (1024 * 1024)).toFixed(2)} MB ·{' '}
                      <span className="text-text-tertiary">
                        {t.completedAt ? new Date(t.completedAt).toLocaleString() : 'Recently'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm sm:self-center self-end">
                  <a
                    href={transferService.getDownloadedFileUrl(t.id)}
                    download
                    className="px-space-md py-1.5 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_open</span>
                    <span>Open / Save</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
