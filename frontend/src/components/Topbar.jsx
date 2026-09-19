import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({
  profile,
  networkStatus,
  notifications = [],
  onOpenShareModal,
  onOpenTechnicalDetails,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-[248px] right-0 h-[72px] z-40 bg-canvas-deep/80 backdrop-blur-xl flex items-center justify-between px-space-xl border-b border-border-subtle/30">
      {/* Breadcrumb Info */}
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-sm text-text-tertiary">
          <span className="material-symbols-outlined text-[16px] text-tertiary">hub</span>
          <span className="font-body-md text-body-md text-text-secondary">Peer Mesh</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-body-md-medium text-body-md-medium text-text-primary">
            {profile?.deviceName || 'Local Node'}
          </span>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-space-lg">
        {/* Quick Search */}
        <div className="relative w-[340px]">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-text-tertiary text-[18px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full h-11 pl-10 pr-space-md rounded-xl bg-[#101318] text-text-primary placeholder:text-text-tertiary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-elevated transition-all border border-border-subtle/40"
            placeholder="Search notes, subjects, files... (Enter)"
            type="text"
          />
        </div>

        {/* Network Indicator Pill */}
        <button
          onClick={onOpenTechnicalDetails}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-accent-soft hover:bg-accent-soft/80 border border-primary/20 transition-all cursor-pointer"
          title="Click for socket details"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-md text-label-md text-primary-fixed">
            {networkStatus?.networkName || 'LTCE-AIML-Network'}
          </span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-space-sm rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container ring-2 ring-canvas-deep"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface-elevated border border-border-strong p-space-md shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle/50 mb-space-sm">
                <span className="font-headline-sm text-sm text-text-primary font-semibold">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="font-label-md text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-space-xs">
                {notifications.length === 0 ? (
                  <div className="py-space-lg text-center text-text-tertiary text-xs">
                    You're all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-space-sm rounded-xl cursor-pointer transition-colors ${
                        n.read ? 'bg-transparent text-text-tertiary' : 'bg-surface-active text-text-primary'
                      } hover:bg-surface-hover`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body-md-medium text-xs font-semibold">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                      </div>
                      <p className="font-body-md text-[11px] text-text-secondary mt-0.5 line-clamp-2">
                        {n.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="px-space-md py-space-xs h-10 rounded-xl bg-primary-container hover:bg-secondary-container text-canvas-deep font-body-md-medium text-xs font-semibold flex items-center gap-space-xs transition-all shadow-md shadow-glow-focus active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>Share Notes</span>
        </button>
      </div>
    </header>
  );
}
