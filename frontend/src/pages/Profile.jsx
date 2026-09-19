import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

export default function Profile({ profile, onProfileUpdated }) {
  const [name, setName] = useState(profile?.name || '');
  const [division, setDivision] = useState(profile?.division || '');
  const [semester, setSemester] = useState(profile?.semester || 3);
  const [deviceName, setDeviceName] = useState(profile?.deviceName || '');
  const [discoverable, setDiscoverable] = useState(profile?.discoverable ?? true);
  const [sharingEnabled, setSharingEnabled] = useState(profile?.sharingEnabled ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDivision(profile.division || '');
      setSemester(profile.semester || 3);
      setDeviceName(profile.deviceName || '');
      setDiscoverable(profile.discoverable ?? true);
      setSharingEnabled(profile.sharingEnabled ?? true);
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await profileService.updateProfile({
        name,
        division,
        semester,
        deviceName,
        discoverable,
        sharingEnabled,
      });
      onProfileUpdated(updated);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(`Error: ${err.message || 'Failed to save'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-xl max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-tertiary uppercase font-medium">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          Node Identity
        </div>
        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
          Student Profile
        </h1>
        <p className="font-body-lg text-body-lg text-text-secondary">
          Your local academic identity broadcasted via UDP discovery packets.
        </p>
      </div>

      {message && (
        <div
          className={`p-space-md rounded-2xl text-xs font-medium border ${
            message.startsWith('Error')
              ? 'bg-status-error/15 border-status-error/30 text-status-error'
              : 'bg-tertiary-container/20 border-tertiary/30 text-tertiary'
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile Form Card */}
      <div className="rounded-2xl bg-surface-elevated p-space-xl border border-border-subtle/40 shadow-lg">
        {/* Node Banner */}
        <div className="flex items-center gap-space-md pb-space-lg border-b border-border-subtle/50 mb-space-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-2xl ring-1 ring-border-strong">
            {name ? name.charAt(0).toUpperCase() : 'Z'}
          </div>
          <div>
            <h3 className="font-headline-sm text-base text-text-primary font-bold">
              {name || 'Student'}
            </h3>
            <p className="font-body-md text-xs text-text-secondary">
              {division} · Semester {semester} · {deviceName}
            </p>
            <span className="font-mono text-[10px] text-text-tertiary mt-1 block">
              Node ID: {profile?.id || 'Generating...'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-space-lg">
          <div>
            <label className="block font-label-mono text-xs text-text-secondary uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface text-text-primary font-body-md text-sm border border-border-subtle focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-mono text-xs text-text-secondary uppercase mb-1">
                Branch / Division
              </label>
              <input
                type="text"
                required
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface text-text-primary font-body-md text-sm border border-border-subtle focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-mono text-xs text-text-secondary uppercase mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-surface text-text-primary font-body-md text-sm border border-border-subtle focus:border-primary focus:outline-none"
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
            <label className="block font-label-mono text-xs text-text-secondary uppercase mb-1">
              Device Name
            </label>
            <input
              type="text"
              required
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface text-text-primary font-body-md text-sm border border-border-subtle focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-space-md border-t border-border-subtle/50 space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-surface/60 border border-border-subtle/40">
              <div>
                <span className="block font-body-md-medium text-xs font-semibold text-text-primary">
                  Broadcast Node Presence (UDP Beacon)
                </span>
                <span className="block font-label-md text-[11px] text-text-tertiary">
                  When enabled, other MESHNOTE laptops on this Wi-Fi can discover your device.
                </span>
              </div>
              <input
                type="checkbox"
                checked={discoverable}
                onChange={(e) => setDiscoverable(e.target.checked)}
                className="w-5 h-5 rounded text-primary bg-surface border-border-strong cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-surface/60 border border-border-subtle/40">
              <div>
                <span className="block font-body-md-medium text-xs font-semibold text-text-primary">
                  Allow Incoming Peer File Requests (TCP)
                </span>
                <span className="block font-label-md text-[11px] text-text-tertiary">
                  When disabled, remote peers cannot stream files from your local storage.
                </span>
              </div>
              <input
                type="checkbox"
                checked={sharingEnabled}
                onChange={(e) => setSharingEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-primary bg-surface border-border-strong cursor-pointer"
              />
            </label>
          </div>

          <div className="flex justify-end pt-space-md">
            <button
              type="submit"
              disabled={saving}
              className="px-space-xl py-2.5 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep font-semibold text-xs shadow-md shadow-glow-focus transition-all active:scale-95"
            >
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
