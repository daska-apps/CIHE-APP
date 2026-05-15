// CIHE Portal — Service Worker for Web Push Notifications
const CACHE_NAME = 'cihe-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Handle incoming push messages
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'CIHE Portal';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/images/updated logo.png',
    badge: '/images/updated logo.png',
    tag: data.tag || 'cihe-notification',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    actions: data.actions || [],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(targetUrl);
      } else {
        self.clients.openWindow(targetUrl);
      }
    })
  );
});
