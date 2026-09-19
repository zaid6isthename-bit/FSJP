import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fileService } from '../services/fileService';

const SUBJECT_FILTERS = ['All', 'Data Structures', 'Operating Systems', 'Machine Learning', 'Computer Networks', 'Database Management'];

export default function Discover({ onPreviewFile, onDownloadFile }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFiles(query);
  }, [query]);

  const loadFiles = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fileService.searchFiles(searchTerm);
      setFiles(results || []);
    } catch (err) {
      setError('Could not retrieve files from local mesh');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((f) => {
    if (selectedSubject !== 'All' && f.subject !== selectedSubject) {
      return false;
    }
    if (selectedType !== 'All' && f.type !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl">
      {/* Header Banner */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          Decentralized Academic Knowledge Hub
        </div>
        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
          Discover Academic Material
        </h1>
        <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl">
          Browse and search study notes, past papers, and project files indexed directly from nearby classmate laptops.
        </p>
      </div>

      {/* Search Bar & Subject Filter Pills */}
      <div className="flex flex-col gap-space-md">
        <div className="relative w-full max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-[20px]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search by subject, topic, module, owner, or filename..."
            className="w-full h-12 pl-12 pr-space-lg rounded-2xl bg-surface-elevated text-text-primary placeholder:text-text-tertiary font-body-md text-sm border border-border-strong focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all shadow-md"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-space-xs pt-1">
          {SUBJECT_FILTERS.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedSubject === subj
                  ? 'bg-primary-container text-canvas-deep font-semibold shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border-subtle/50'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div>
        <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-lg">
          <span className="font-label-mono text-xs text-text-tertiary uppercase tracking-wider">
            Indexed Study Material ({filteredFiles.length})
          </span>
          <div className="flex items-center gap-2">
            <span className="font-label-mono text-[11px] text-text-tertiary">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface text-text-secondary text-xs rounded-lg px-2 py-1 border border-border-subtle focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="PDF">PDF</option>
              <option value="PPTX">Presentation</option>
              <option value="DOCX">Document</option>
              <option value="IMAGE">Image</option>
              <option value="ARCHIVE">Archive / Zip</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-space-xl flex flex-col items-center justify-center text-text-tertiary">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>
            <span className="text-xs">Aggregating files from local peers...</span>
          </div>
        ) : error ? (
          <div className="p-space-lg rounded-2xl bg-status-error/10 border border-status-error/20 text-status-error text-center text-xs">
            {error}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-space-xl p-space-xl rounded-2xl bg-surface-elevated border border-border-subtle text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-text-tertiary mb-2">
              folder_off
            </span>
            <h3 className="font-headline-sm text-sm text-text-primary font-semibold">
              No matching files found
            </h3>
            <p className="font-body-md text-xs text-text-secondary max-w-sm mt-1">
              No academic notes match your search query. Try clearing filters or share the first notes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="rounded-2xl bg-surface-elevated p-space-lg border border-border-subtle/50 hover:border-primary/40 transition-all flex flex-col justify-between shadow-md hover:shadow-xl group"
              >
                <div>
                  {/* Top Bar: Subject Badge & Type */}
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-mono text-[10px] px-2.5 py-0.5 rounded-full bg-accent-soft text-primary-fixed font-medium border border-primary/20">
                      {file.subject}
                    </span>
                    <span className="font-label-mono text-[10px] text-text-tertiary font-bold">
                      {file.type}
                    </span>
                  </div>

                  {/* File Title */}
                  <h3
                    onClick={() => onPreviewFile && onPreviewFile(file)}
                    className="font-headline-sm text-sm text-text-primary font-semibold group-hover:text-primary transition-colors cursor-pointer line-clamp-2"
                    title={file.name}
                  >
                    {file.name}
                  </h3>

                  <p className="font-body-md text-xs text-text-secondary mt-1 line-clamp-2">
                    {file.description || `${file.module} · Semester ${file.semester} academic material.`}
                  </p>
                </div>

                <div className="pt-space-md mt-space-md border-t border-border-subtle/40 flex items-center justify-between">
                  {/* Owner & Size */}
                  <div className="flex items-center gap-space-xs min-w-0">
                    <div className="w-6 h-6 rounded-full bg-surface-active text-primary flex items-center justify-center text-[10px] font-bold ring-1 ring-border-strong">
                      {file.ownerName ? file.ownerName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <span className="block font-body-md text-[11px] text-text-secondary truncate">
                        {file.ownerName || 'Peer'}
                      </span>
                      <span className="block font-label-mono text-[9px] text-text-tertiary">
                        {file.sizeFormatted || `${(file.sizeBytes / 1024).toFixed(1)} KB`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onPreviewFile && onPreviewFile(file)}
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
                      title="Preview"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button
                      onClick={() => onDownloadFile && onDownloadFile(file)}
                      className="px-space-md py-1.5 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
