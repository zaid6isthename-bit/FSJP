// JVM VISION — Service Worker Uninstaller
// This file exists only to immediately unregister any previously installed service worker.
// The old MESHNOTE app installed a service worker that is now intercepting all fetch requests
// and causing "Network error connecting to simulator" in the new JVM VISION app.

self.addEventListener('install', () => {
  // Skip waiting so we activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients and immediately unregister
  event.waitUntil(
    self.clients.claim().then(() => {
      return self.registration.unregister();
    })
  );
});

// Do NOT intercept any fetch requests — pass everything through
self.addEventListener('fetch', (event) => {
  // No-op: let browser handle normally
});
