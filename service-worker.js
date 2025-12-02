const CACHE_NAME = 'fmax-calculator-v1';
const urlsToCache = [
  './calcul_fmax.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  // Si vous utilisez d'autres fichiers CSS ou JS externes, ajoutez-les ici
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Ouverture du cache et mise en cache des URLs...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Récupération des ressources (pour le mode hors-ligne)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Le cache contient la ressource, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on va chercher la ressource sur le réseau
        return fetch(event.request);
      })
  );
});

// Mise à jour du Service Worker (Nettoyage des anciens caches)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
