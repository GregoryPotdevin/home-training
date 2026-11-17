// Service worker : l'app s'ouvre même hors connexion internet.
const CACHE = 'home-trainer-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './js/config.js', './js/cloud.js', './js/mascot.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png',
  './icons/favicon-32.png', './icons/icon.svg'];
// Ressources externes qu'on peut garder en cache (polices, SDK Firebase versionné)
const CACHEABLE = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs)\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // Fichiers de l'app : réseau d'abord (mises à jour immédiates), cache si hors ligne
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
    return;
  }
  // Polices et SDK Firebase : cache d'abord. Tout le reste (Firestore, connexion Google) passe sans cache.
  if (CACHEABLE.test(req.url)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
      return r;
    })));
  }
});
