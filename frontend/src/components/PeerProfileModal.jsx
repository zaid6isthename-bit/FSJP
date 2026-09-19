import React, { useState, useEffect } from 'react';
import { peerService } from '../services/peerService';

export default function PeerProfileModal({ isOpen, onClose, peer, onDownloadFile }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && peer) {
      loadPeerFiles();
    } else {
      setFiles([]);
    }
  }, [isOpen, peer]);

  const loadPeerFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await peerService.getPeerFiles(peer.id);
      setFiles(data || []);
    } catch (err) {
      setError('Could not connect to peer socket to retrieve file list');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !peer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-elevated border border-border-strong p-space-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Peer Info Header */}
        <div className="flex items-start justify-between pb-space-md border-b border-border-subtle/60">
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xl ring-1 ring-border-strong">
              {peer.name ? peer.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-lg text-text-primary font-bold">
                  {peer.name}
                </h2>
                <span className="flex items-center gap-1 font-label-mono text-[11px] px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  {peer.status || 'ONLINE'}
                </span>
              </div>
              <p className="font-body-md text-xs text-text-secondary mt-0.5">
                {peer.division} · Semester {peer.semester} · {peer.deviceName}
              </p>
              <p className="font-label-mono text-[10px] text-text-tertiary mt-1">
                Last seen: {peer.lastSeenText || 'Recently'} · IP: {peer.ipAddress}:{peer.p2pPort}
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

        {/* Peer Shared Files Section */}
        <div className="mt-space-md flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-space-sm">
            <span className="font-label-mono text-xs uppercase text-text-tertiary tracking-wider">
              Shared Academic Material ({files.length})
            </span>
            <button
              onClick={loadPeerFiles}
              disabled={loading}
              className="font-label-md text-xs text-primary hover:underline flex items-center gap-1"
            >
              <span className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>Refresh list</span>
            </button>
          </div>

          {loading ? (
            <div className="py-space-xl flex flex-col items-center justify-center text-text-tertiary">
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></span>
              <span className="text-xs">Querying peer via TCP socket...</span>
            </div>
          ) : error ? (
            <div className="py-space-lg p-space-md rounded-xl bg-status-error/10 border border-status-error/20 text-status-error text-xs text-center">
              {error}
            </div>
          ) : files.length === 0 ? (
            <div className="py-space-xl text-center text-text-tertiary text-xs">
              This peer has no public files shared right now.
            </div>
          ) : (
            <div className="space-y-space-xs">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-space-md rounded-xl bg-surface hover:bg-surface-hover border border-border-subtle/50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      description
                    </span>
                    <div className="min-w-0">
                      <span className="block font-body-md-medium text-xs font-semibold text-text-primary truncate">
                        {file.name}
                      </span>
                      <span className="block font-label-md text-[11px] text-text-secondary truncate">
                        {file.subject} · {file.module} · {file.sizeFormatted || `${(file.sizeBytes / 1024).toFixed(1)} KB`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onDownloadFile(file, peer);
                      onClose();
                    }}
                    className="px-space-md py-1.5 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
