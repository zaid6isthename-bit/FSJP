import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ profile, networkStatus, activeTransfersCount, peersCount, onOpenTechnicalDetails }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[248px] bg-[#101318] z-50 flex flex-col justify-between overflow-y-auto border-r border-border-subtle select-none">
      <div className="flex flex-col">
        {/* Emblem & Logo Header */}
        <div className="h-[72px] px-space-lg flex items-center gap-space-md border-b border-border-subtle/40">
          <img
            alt="MESHNOTE Emblem"
            className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            src="/emblem.svg"
            onClick={onOpenTechnicalDetails}
            title="Click to view Technical Network Details"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-text-primary tracking-tight leading-none font-semibold">
              MESHNOTE
            </span>
            <span className="font-label-md text-label-md text-text-tertiary mt-space-xs font-medium">
              Local Academic Network
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-space-md py-space-sm">
          {/* Main Section */}
          <div className="mb-space-lg">
            <div className="px-space-sm mb-space-xs font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Main
            </div>
            <nav className="space-y-space-xs">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  <span className="font-body-md-medium text-body-md-medium">Overview</span>
                </div>
              </NavLink>

              <NavLink
                to="/discover"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span className="font-body-md-medium text-body-md-medium">Discover</span>
                </div>
              </NavLink>

              <NavLink
                to="/my-library"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  <span className="font-body-md-medium text-body-md-medium">My Library</span>
                </div>
              </NavLink>

              <NavLink
                to="/shared-with-me"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">drive_file_move</span>
                  <span className="font-body-md-medium text-body-md-medium">Shared With Me</span>
                </div>
              </NavLink>

              <NavLink
                to="/transfers"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                  <span className="font-body-md-medium text-body-md-medium">Transfers</span>
                </div>
                {activeTransfersCount > 0 && (
                  <span className="font-label-mono text-label-mono px-space-xs py-0.5 rounded-full bg-accent-soft text-primary-fixed animate-pulse">
                    {activeTransfersCount}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Network Section */}
          <div className="mb-space-lg">
            <div className="px-space-sm mb-space-xs font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Network
            </div>
            <nav className="space-y-space-xs">
              <NavLink
                to="/nearby-peers"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span className="font-body-md-medium text-body-md-medium">Nearby Peers</span>
                </div>
                <span className="font-label-mono text-label-mono px-space-xs py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-medium">
                  {peersCount || 0}
                </span>
              </NavLink>

              <NavLink
                to="/network-activity"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">ssid_chart</span>
                  <span className="font-body-md-medium text-body-md-medium">Network Activity</span>
                </div>
              </NavLink>
            </nav>
          </div>

          {/* Personal Section */}
          <div className="mb-space-md">
            <div className="px-space-sm mb-space-xs font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              Personal
            </div>
            <nav className="space-y-space-xs">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  <span className="font-body-md-medium text-body-md-medium">Profile</span>
                </div>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-space-sm rounded-xl transition-all ${
                    isActive
                      ? 'bg-surface-active text-primary-fixed-dim font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="font-body-md-medium text-body-md-medium">Settings</span>
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Network Badge & Current User Card */}
      <div className="p-space-sm space-y-space-sm border-t border-border-subtle/30">
        <div
          onClick={onOpenTechnicalDetails}
          className="p-space-md rounded-xl bg-surface-elevated hover:bg-surface-hover cursor-pointer flex flex-col gap-space-xs shadow-[0_10px_30px_rgba(0,0,0,0.22)] border border-border-subtle/50 transition-all"
          title="Click to inspect socket & network telemetry"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-mono text-label-mono text-text-tertiary uppercase tracking-wider">
              LOCAL NETWORK
            </span>
            <span className="material-symbols-outlined text-tertiary text-[16px]">
              wifi_tethering
            </span>
          </div>
          <div className="flex items-center gap-space-xs mt-space-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="font-body-md-medium text-body-md-medium text-text-primary">
              {networkStatus?.connected ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="font-body-md text-body-md text-text-secondary truncate max-w-[130px]">
              {networkStatus?.networkName || 'Local Academic Network'}
            </span>
            <span className="font-label-mono text-label-mono text-text-tertiary">
              {peersCount || 0} peers
            </span>
          </div>
        </div>

        {/* User Card */}
        <NavLink
          to="/profile"
          className="p-space-sm rounded-xl bg-surface-elevated flex items-center justify-between hover:bg-surface-hover transition-colors border border-border-subtle/40"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-border-strong">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'Z'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary ring-2 ring-[#101318]"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-md-medium text-body-md-medium text-text-primary truncate">
                {profile?.name || 'Local Student'}
              </span>
              <span className="font-label-md text-label-md text-text-tertiary truncate">
                {profile?.division || 'AI & ML'} · Sem {profile?.semester || 3}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-text-disabled text-[18px]">
            chevron_right
          </span>
        </NavLink>
      </div>
    </aside>
  );
}
