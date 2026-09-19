import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ShareModal from './ShareModal';
import TechnicalDetailsModal from './TechnicalDetailsModal';
import FilePreviewModal from './FilePreviewModal';
import PeerProfileModal from './PeerProfileModal';
import SetupModal from './SetupModal';
import { profileService } from '../services/profileService';
import { peerService } from '../services/peerService';
import { transferService } from '../services/transferService';
import { dashboardService, networkService, notificationService, activityService } from '../services/networkServices';

export default function Layout() {
  const [profile, setProfile] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [peers, setPeers] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTechnicalDetailsOpen, setIsTechnicalDetailsOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedPeer, setSelectedPeer] = useState(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prof, net, prs, trs, notifs, acts, stats] = await Promise.all([
        profileService.getProfile().catch(() => null),
        networkService.getStatus().catch(() => null),
        peerService.getPeers().catch(() => []),
        transferService.getAllTransfers().catch(() => []),
        notificationService.getNotifications().catch(() => []),
        activityService.getActivities(20).catch(() => []),
        dashboardService.getStats().catch(() => null),
      ]);

      if (prof) setProfile(prof);
      if (net) setNetworkStatus(net);
      if (prs) setPeers(prs);
      if (trs) setTransfers(trs);
      if (notifs) setNotifications(notifs);
      if (acts) setActivities(acts);
      if (stats) setDashboardStats(stats);
    } catch (e) {
      console.error('Error loading initial data:', e);
    }
  };

  // Polling strategy per user specifications:
  // Peers: 4s
  // Transfers: 1.5s only while active, 5s otherwise
  // Notifications & Stats: 5s
  useEffect(() => {
    const hasActiveTransfers = transfers.some(
      (t) => t.status === 'QUEUED' || t.status === 'CONNECTING' || t.status === 'DOWNLOADING' || t.status === 'UPLOADING'
    );

    const peerInterval = setInterval(async () => {
      try {
        const prs = await peerService.getPeers();
        setPeers(prs || []);
      } catch (e) {}
    }, 4000);

    const transferInterval = setInterval(async () => {
      try {
        const trs = await transferService.getAllTransfers();
        setTransfers(trs || []);
      } catch (e) {}
    }, hasActiveTransfers ? 1500 : 5000);

    const statsInterval = setInterval(async () => {
      try {
        const [stats, notifs, acts, net] = await Promise.all([
          dashboardService.getStats().catch(() => null),
          notificationService.getNotifications().catch(() => []),
          activityService.getActivities(20).catch(() => []),
          networkService.getStatus().catch(() => null),
        ]);
        if (stats) setDashboardStats(stats);
        if (notifs) setNotifications(notifs);
        if (acts) setActivities(acts);
        if (net) setNetworkStatus(net);
      } catch (e) {}
    }, 5000);

    return () => {
      clearInterval(peerInterval);
      clearInterval(transferInterval);
      clearInterval(statsInterval);
    };
  }, [transfers]);

  // Handle actions
  const handleTriggerBroadcast = async () => {
    try {
      const prs = await peerService.triggerDiscovery();
      setPeers(prs || []);
      const stats = await dashboardService.getStats();
      setDashboardStats(stats);
    } catch (err) {
      console.error('Failed to trigger broadcast beacon:', err);
    }
  };

  const handleDownloadFile = async (file, peerOverride) => {
    const peerId = file.peerId || peerOverride?.id;
    if (!peerId) {
      alert('Could not determine peer node for download');
      return;
    }

    try {
      const transfer = await transferService.downloadFile(peerId, file.id);
      setTransfers((prev) => [transfer, ...prev]);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    }
  };

  const handleCancelTransfer = async (transferId) => {
    try {
      const updated = await transferService.cancelTransfer(transferId);
      setTransfers(transfers.map((t) => (t.id === transferId ? updated : t)));
    } catch (err) {
      alert(`Cancel failed: ${err.message}`);
    }
  };

  const handleRetryTransfer = async (transferId) => {
    try {
      const newTransfer = await transferService.retryTransfer(transferId);
      setTransfers((prev) => [newTransfer, ...prev]);
    } catch (err) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {}
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (e) {}
  };

  const activeTransfersCount = transfers.filter(
    (t) => t.status === 'QUEUED' || t.status === 'CONNECTING' || t.status === 'DOWNLOADING' || t.status === 'UPLOADING'
  ).length;

  return (
    <div className="min-h-screen bg-canvas-deep flex text-on-surface">
      {/* Persistent Sidebar */}
      <Sidebar
        profile={profile}
        networkStatus={networkStatus}
        activeTransfersCount={activeTransfersCount}
        peersCount={peers.length}
        onOpenTechnicalDetails={() => setIsTechnicalDetailsOpen(true)}
      />

      {/* Main Wrapper */}
      <div className="pl-[248px] min-h-screen flex-1 flex flex-col">
        {/* Persistent Topbar */}
        <Topbar
          profile={profile}
          networkStatus={networkStatus}
          notifications={notifications}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenTechnicalDetails={() => setIsTechnicalDetailsOpen(true)}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        />

        {/* Network Disconnected Alert Banner if socket offline */}
        {networkStatus && !networkStatus.connected && (
          <div className="mt-[72px] mx-space-xl p-space-sm rounded-xl bg-status-warning/20 border border-status-warning/30 text-status-warning text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">wifi_off</span>
              <span className="font-semibold">Disconnected from local network socket</span>
            </div>
            <button
              onClick={handleTriggerBroadcast}
              className="px-3 py-1 rounded-lg bg-surface text-text-primary text-[11px] font-bold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Main Routed View */}
        <main className={`w-full ${networkStatus && !networkStatus.connected ? 'pt-space-md' : 'pt-[72px]'} px-space-xl pb-space-xl flex-1 max-w-[1440px] mx-auto`}>
          <div className="pt-space-md">
            <Outlet
              context={{
                profile,
                networkStatus,
                peers,
                transfers,
                activities,
                dashboardStats,
                onOpenShareModal: () => setIsShareModalOpen(true),
                onTriggerBroadcast: handleTriggerBroadcast,
                onPreviewFile: (file) => setPreviewFile(file),
                onSelectPeer: (peer) => setSelectedPeer(peer),
                onDownloadFile: handleDownloadFile,
                onCancelTransfer: handleCancelTransfer,
                onRetryTransfer: handleRetryTransfer,
                onProfileUpdated: (p) => setProfile(p),
                onOpenTechnicalDetails: () => setIsTechnicalDetailsOpen(true),
              }}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        defaultSemester={profile?.semester || 3}
        onFileShared={(newFile) => {
          // Trigger refresh of stats and activity
          dashboardService.getStats().then(setDashboardStats).catch(() => {});
          activityService.getActivities(20).then(setActivities).catch(() => {});
          handleTriggerBroadcast();
        }}
      />

      <TechnicalDetailsModal
        isOpen={isTechnicalDetailsOpen}
        onClose={() => setIsTechnicalDetailsOpen(false)}
        networkStatus={networkStatus}
        profile={profile}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={(f) => handleDownloadFile(f)}
      />

      <PeerProfileModal
        isOpen={!!selectedPeer}
        peer={selectedPeer}
        onClose={() => setSelectedPeer(null)}
        onDownloadFile={handleDownloadFile}
      />

      <SetupModal
        isOpen={isSetupModalOpen}
        currentProfile={profile}
        onClose={() => setIsSetupModalOpen(false)}
        onProfileSaved={(p) => setProfile(p)}
      />
    </div>
  );
}
