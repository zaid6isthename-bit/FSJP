import React from 'react';
import { fileService } from '../services/fileService';

export default function FilePreviewModal({ isOpen, onClose, file, onDownload }) {
  if (!isOpen || !file) return null;

  const contentUrl = fileService.getFileContentUrl(file.id);
  const isPdf = file.mimeType === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
  const isImage = file.mimeType?.startsWith('image/') || (file.name && /\.(png|jpe?g|gif)$/i.test(file.name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl bg-surface-elevated border border-border-strong flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-border-subtle/60">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-primary text-[24px]">description</span>
            <div className="min-w-0">
              <h3 className="font-headline-sm text-sm text-text-primary font-semibold truncate">
                {file.name}
              </h3>
              <span className="font-label-md text-xs text-text-tertiary">
                {file.subject} · {file.module} · Sem {file.semester} · Shared by {file.ownerName || 'Peer'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            {onDownload && (
              <button
                onClick={() => onDownload(file)}
                className="px-space-md py-1.5 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-[#0A0D12] overflow-hidden flex items-center justify-center relative">
          {isPdf ? (
            <iframe
              src={contentUrl}
              title={file.name}
              className="w-full h-full border-0"
            />
          ) : isImage ? (
            <img
              src={contentUrl}
              alt={file.name}
              className="max-w-full max-h-full object-contain p-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-space-xl text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border-strong flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-primary text-[36px]">
                  article
                </span>
              </div>
              <h4 className="font-headline-sm text-base text-text-primary font-semibold">
                {file.name}
              </h4>
              <p className="font-body-md text-xs text-text-secondary mt-1">
                {file.description || 'Academic study material shared on the local peer network.'}
              </p>
              <div className="mt-space-md flex gap-space-md text-xs text-text-tertiary font-mono">
                <span>SIZE: {file.sizeFormatted || `${(file.sizeBytes / 1024).toFixed(1)} KB`}</span>
                <span>DOWNLOADS: {file.accessCount || 0}</span>
              </div>
              {onDownload && (
                <button
                  onClick={() => onDownload(file)}
                  className="mt-space-lg px-space-xl py-2 rounded-xl bg-primary-container text-canvas-deep font-semibold text-xs shadow-lg active:scale-95"
                >
                  Download File Directly (TCP)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
