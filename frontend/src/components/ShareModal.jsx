import React, { useState, useRef } from 'react';
import { fileService } from '../services/fileService';

export default function ShareModal({ isOpen, onClose, onFileShared, defaultSemester = 3 }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [module, setModule] = useState('Module 1');
  const [semester, setSemester] = useState(defaultSemester);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to share');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject || 'General');
    formData.append('module', module || 'Module 1');
    formData.append('semester', semester);
    formData.append('description', description);

    try {
      const shared = await fileService.shareFile(formData);
      onFileShared(shared);
      onClose();
      // Reset form
      setFile(null);
      setSubject('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to share file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Auto-populate subject if filename contains hints
      if (!subject) {
        const name = selected.name.toLowerCase();
        if (name.includes('data structure') || name.includes('ds')) setSubject('Data Structures');
        else if (name.includes('os') || name.includes('operating')) setSubject('Operating Systems');
        else if (name.includes('ai') || name.includes('ml')) setSubject('Machine Learning');
        else if (name.includes('network') || name.includes('cn')) setSubject('Computer Networks');
        else if (name.includes('dbms') || name.includes('database')) setSubject('Database Management');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-elevated border border-border-strong p-space-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-border-subtle/60">
          <div className="flex items-center gap-space-sm">
            <div className="p-2 rounded-xl bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base text-text-primary font-semibold">
                Share Academic Material
              </h2>
              <p className="font-label-md text-xs text-text-secondary">
                Broadcast notes to classmates on your local network
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

        {error && (
          <div className="mt-space-md p-space-sm rounded-xl bg-status-error/15 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-space-md space-y-space-md">
          {/* File Selector Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`p-space-lg rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
              file
                ? 'border-primary/50 bg-primary-container/10'
                : 'border-border-strong hover:border-primary/40 bg-surface/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
            />
            {file ? (
              <div className="flex items-center gap-space-sm text-left w-full">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  description
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block font-body-md-medium text-xs text-text-primary truncate font-semibold">
                    {file.name}
                  </span>
                  <span className="block font-label-mono text-[10px] text-text-secondary">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to share
                  </span>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-text-tertiary text-[32px] mb-1">
                  cloud_upload
                </span>
                <span className="font-body-md-medium text-xs text-text-primary font-medium">
                  Click to browse or drop an academic file
                </span>
                <span className="font-label-md text-[11px] text-text-tertiary mt-0.5">
                  PDF, PPTX, DOCX, ZIP, Images (up to 500MB)
                </span>
              </>
            )}
          </div>

          {/* Academic Subject & Module */}
          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
                Module / Topic
              </label>
              <input
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                placeholder="e.g. Module 3: Trees"
                className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Semester & Description */}
          <div className="grid grid-cols-3 gap-space-md">
            <div className="col-span-1">
              <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lecture notes & solved examples"
                className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-border-subtle/50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-space-md py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-space-lg py-2 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold shadow-md shadow-glow-focus transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-canvas-deep border-t-transparent rounded-full animate-spin"></span>
                  <span>Storing & Sharing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span>Share to Network</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
