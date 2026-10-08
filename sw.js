// Guarda la app para que abra sin internet.
// Al cambiar cualquier archivo, sube VERSION para que los celulares la actualicen.
const VERSION = 'leamos-v1';
const BASE = [
  './',
  './index.html',
  './app.js',
  './libro.js',
  './manifest.webmanifest',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];
const EXTERNOS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Archivos propios: primero la red (para recibir cambios), si no hay, lo guardado.
  // Las páginas se guardan siempre como index.html, sin el enlace (#de=…) que traen.
  if (url.origin === location.origin) {
    const clave = req.mode === 'navigate' ? './index.html' : req;
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(clave, copia)); }
          return r;
        })
        .catch(() => caches.match(clave, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Fuentes y el lector de PDF: lo guardado primero, porque no cambian.
  if (EXTERNOS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(g => g || fetch(req).then(r => {
        if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
        return r;
      }))
    );
  }
});
