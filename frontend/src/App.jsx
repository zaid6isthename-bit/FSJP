import React from 'react';
import { BrowserRouter, Routes, Route, useOutletContext, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Discover from './pages/Discover';
import MyLibrary from './pages/MyLibrary';
import SharedWithMe from './pages/SharedWithMe';
import Transfers from './pages/Transfers';
import NearbyPeers from './pages/NearbyPeers';
import NetworkActivity from './pages/NetworkActivity';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Routed View Wrappers that extract context from Layout
function OverviewView() {
  const ctx = useOutletContext();
  return (
    <Overview
      profile={ctx.profile}
      dashboardStats={ctx.dashboardStats}
      peers={ctx.peers}
      activities={ctx.activities}
      activeTransfers={ctx.transfers}
      onOpenShareModal={ctx.onOpenShareModal}
      onTriggerBroadcast={ctx.onTriggerBroadcast}
      onSelectPeer={ctx.onSelectPeer}
    />
  );
}

function DiscoverView() {
  const ctx = useOutletContext();
  return (
    <Discover
      onPreviewFile={ctx.onPreviewFile}
      onDownloadFile={ctx.onDownloadFile}
    />
  );
}

function MyLibraryView() {
  const ctx = useOutletContext();
  return (
    <MyLibrary
      onOpenShareModal={ctx.onOpenShareModal}
      onPreviewFile={ctx.onPreviewFile}
    />
  );
}

function SharedWithMeView() {
  const ctx = useOutletContext();
  return (
    <SharedWithMe
      transfers={ctx.transfers}
      onPreviewFile={ctx.onPreviewFile}
    />
  );
}

function TransfersView() {
  const ctx = useOutletContext();
  return (
    <Transfers
      transfers={ctx.transfers}
      onRetryTransfer={ctx.onRetryTransfer}
      onCancelTransfer={ctx.onCancelTransfer}
      onPreviewFile={ctx.onPreviewFile}
    />
  );
}

function NearbyPeersView() {
  const ctx = useOutletContext();
  return (
    <NearbyPeers
      peers={ctx.peers}
      onSelectPeer={ctx.onSelectPeer}
      onTriggerBroadcast={ctx.onTriggerBroadcast}
    />
  );
}

function NetworkActivityView() {
  const ctx = useOutletContext();
  return <NetworkActivity activities={ctx.activities} />;
}

function ProfileView() {
  const ctx = useOutletContext();
  return (
    <Profile
      profile={ctx.profile}
      onProfileUpdated={ctx.onProfileUpdated}
    />
  );
}

function SettingsView() {
  const ctx = useOutletContext();
  return (
    <Settings
      networkStatus={ctx.networkStatus}
      onOpenTechnicalDetails={ctx.onOpenTechnicalDetails}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OverviewView />} />
          <Route path="overview" element={<Navigate to="/" replace />} />
          <Route path="discover" element={<DiscoverView />} />
          <Route path="my-library" element={<MyLibraryView />} />
          <Route path="shared-with-me" element={<SharedWithMeView />} />
          <Route path="transfers" element={<TransfersView />} />
          <Route path="nearby-peers" element={<NearbyPeersView />} />
          <Route path="network-activity" element={<NetworkActivityView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
