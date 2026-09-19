import React, { useState, useEffect } from 'react';
import { fileService } from '../services/fileService';

export default function MyLibrary({ onOpenShareModal, onPreviewFile }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyFiles();
  }, []);

  const loadMyFiles = async () => {
    setLoading(true);
    try {
      const data = await fileService.getMyFiles();
      setFiles(data || []);
    } catch (err) {
      setError('Could not load local shared library');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async (file) => {
    try {
      if (file.shared) {
        const updated = await fileService.pauseSharing(file.id);
        setFiles(files.map((f) => (f.id === file.id ? updated : f)));
      } else {
        const updated = await fileService.resumeSharing(file.id);
        setFiles(files.map((f) => (f.id === file.id ? updated : f)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update sharing state');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this file from your library?')) return;
    try {
      await fileService.deleteFile(id);
      setFiles(files.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete file');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            Local Storage & Sharing Node
          </div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
            My Library
          </h1>
          <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
            Manage your shared academic files. Pause or resume visibility on the local peer mesh anytime.
          </p>
        </div>

        <button
          onClick={onOpenShareModal}
          className="h-11 px-space-lg rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep font-body-md-medium text-xs font-semibold flex items-center gap-space-xs shadow-md shadow-glow-focus transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload & Share</span>
        </button>
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-lg">
          <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
            Your Uploaded Notes ({files.length})
          </span>
          <span className="font-label-mono text-[11px] text-text-tertiary">
            Stored securely in data/shared
          </span>
        </div>

        {loading ? (
          <div className="py-space-xl flex flex-col items-center justify-center text-text-tertiary">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>
            <span className="text-xs">Loading your files...</span>
          </div>
        ) : error ? (
          <div className="p-space-lg rounded-2xl bg-status-error/10 border border-status-error/20 text-status-error text-center text-xs">
            {error}
          </div>
        ) : files.length === 0 ? (
          <div className="py-space-xl p-space-xl rounded-2xl bg-surface-elevated border border-border-subtle text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-text-tertiary mb-2 opacity-50">
              inventory_2
            </span>
            <h3 className="font-headline-sm text-sm text-text-primary font-semibold">
              Your library is currently empty
            </h3>
            <p className="font-body-md text-xs text-text-secondary max-w-sm mt-1">
              Upload your notes, question banks, or reference slides to share them with nearby students.
            </p>
            <button
              onClick={onOpenShareModal}
              className="mt-space-md px-space-lg py-2 rounded-xl bg-primary-container text-canvas-deep font-semibold text-xs shadow-md active:scale-95"
            >
              Share Your First File
            </button>
          </div>
        ) : (
          <div className="space-y-space-sm">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-space-md rounded-2xl bg-surface-elevated border border-border-subtle/50 hover:border-border-strong transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center font-bold text-sm ring-1 ring-border-strong flex-shrink-0">
                    {file.type}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onPreviewFile(file)}
                        className="font-headline-sm text-sm font-semibold text-text-primary truncate hover:text-primary cursor-pointer transition-colors"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          file.shared
                            ? 'bg-tertiary-container/20 text-tertiary border border-tertiary/30'
                            : 'bg-surface-active text-text-tertiary'
                        }`}
                      >
                        {file.shared ? 'SHARING ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                    <p className="font-label-md text-xs text-text-secondary mt-0.5">
                      {file.subject} · {file.module} · Sem {file.semester} · {file.sizeFormatted || `${(file.sizeBytes / 1024).toFixed(1)} KB`} ·{' '}
                      <span className="text-text-tertiary">{file.accessCount || 0} downloads by peers</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs sm:self-center self-end">
                  <button
                    onClick={() => onPreviewFile(file)}
                    className="p-2 rounded-xl bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary text-xs font-medium transition-colors border border-border-subtle/40"
                    title="Preview Document"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>

                  <button
                    onClick={() => handleToggleShare(file)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                      file.shared
                        ? 'bg-surface text-text-secondary hover:text-status-warning hover:border-status-warning/40 border-border-subtle'
                        : 'bg-tertiary-container/20 text-tertiary border-tertiary/30 hover:bg-tertiary-container/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {file.shared ? 'pause_circle' : 'play_circle'}
                    </span>
                    <span>{file.shared ? 'Pause Sharing' : 'Resume'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 rounded-xl bg-surface hover:bg-status-error/20 text-text-secondary hover:text-status-error text-xs font-medium transition-colors border border-border-subtle/40"
                    title="Delete File"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
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
