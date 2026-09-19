import React, { useState } from 'react';
import { profileService } from '../services/profileService';

export default function SetupModal({ isOpen, onClose, currentProfile, onProfileSaved }) {
  const [name, setName] = useState(currentProfile?.name || 'Zaid Mohammed');
  const [division, setDivision] = useState(currentProfile?.division || 'AI & ML');
  const [semester, setSemester] = useState(currentProfile?.semester || 3);
  const [deviceName, setDeviceName] = useState(currentProfile?.deviceName || 'Zaid-Laptop');
  const [discoverable, setDiscoverable] = useState(currentProfile?.discoverable ?? true);
  const [sharingEnabled, setSharingEnabled] = useState(currentProfile?.sharingEnabled ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = await profileService.setupProfile({
        name,
        division,
        semester,
        deviceName,
        discoverable,
        sharingEnabled,
      });
      onProfileSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-surface-elevated border border-border-strong p-space-xl shadow-2xl overflow-hidden">
        <div className="text-center mb-space-lg">
          <img src="/emblem.svg" alt="Emblem" className="w-12 h-12 mx-auto mb-space-sm" />
          <h2 className="font-headline-sm text-lg text-text-primary font-bold">
            Configure Your MESHNOTE Node
          </h2>
          <p className="font-body-md text-xs text-text-secondary mt-1">
            Set up how your laptop appears to nearby peers on the local network.
          </p>
        </div>

        {error && (
          <div className="mb-space-md p-space-sm rounded-xl bg-status-error/15 border border-status-error/30 text-status-error text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div>
            <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
                Division / Branch
              </label>
              <input
                type="text"
                required
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                placeholder="e.g. AI & ML"
                className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
              />
            </div>
            <div>
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
          </div>

          <div>
            <label className="block font-label-mono text-[11px] text-text-secondary uppercase mb-1">
              Device Name
            </label>
            <input
              type="text"
              required
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Zaid-Laptop"
              className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary font-body-md text-xs border border-border-subtle focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-border-subtle/50 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-body-md text-xs text-text-primary">Discoverable by Nearby Peers</span>
              <input
                type="checkbox"
                checked={discoverable}
                onChange={(e) => setDiscoverable(e.target.checked)}
                className="w-4 h-4 rounded text-primary bg-surface border-border-strong focus:ring-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-body-md text-xs text-text-primary">Enable P2P File Sharing</span>
              <input
                type="checkbox"
                checked={sharingEnabled}
                onChange={(e) => setSharingEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-primary bg-surface border-border-strong focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-space-md flex justify-end gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-xl text-text-secondary hover:text-text-primary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-space-lg py-2 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              {loading ? 'Saving...' : "You're Connected →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
