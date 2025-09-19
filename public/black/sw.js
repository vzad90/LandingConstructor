// Service Worker для PWA (тільки для black сторінки)
const CACHE_NAME = 'landing-constructor-v1';
const urlsToCache = [
  '/',
  '/bAssets/css/main.css',
  '/bAssets/js/main.js',
  '/bImages/icon-192x192.png',
  '/bImages/icon-512x512.png',
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// Активація Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Обробка запитів
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Повертаємо кешовану версію або завантажуємо з мережі
      return response || fetch(event.request);
    }),
  );
});
