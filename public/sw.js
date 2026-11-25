const VERSION = '__PWA_VERSION__';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const API_CACHE = `${VERSION}-public-api`;
const PRECACHE = __PRECACHE_FILES__.concat(['offline.html', 'manifest.json', 'favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'images/shol.svg', 'images/orman.svg', 'images/monument.svg', 'images/orsh.svg', 'images/muzei.svg', 'images/mosque.svg', 'images/shonyraq.svg', 'images/su.svg', 'images/tau.svg', 'images/kol.svg', 'images/daala.svg', 'images/qala.svg']);
const MAX_RUNTIME_ENTRIES = 60;
const MAX_API_ENTRIES = 40;
const absolute = (path) => new URL(path, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll([...new Set(PRECACHE.map(absolute))]);
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, ASSET_CACHE, API_CACHE]);
    await Promise.all((await caches.keys()).filter((key) => key.startsWith('sis8-pwa-') && !keep.has(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}

function notifyClients(message) {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => clients.forEach((client) => client.postMessage(message)))
    .catch(() => {});
}

async function cachedApiResponse(cache, request) {
  const cached = await cache.match(request);
  if (!cached) return null;
  notifyClients({ type: 'PUBLIC_DATA_CACHE' });
  return cached;
}

async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(cache, MAX_API_ENTRIES);
      notifyClients({ type: 'PUBLIC_DATA_NETWORK' });
      return response;
    }
    if (response.status === 404 || response.status >= 500) {
      return (await cachedApiResponse(cache, request)) || response;
    }
    return response;
  } catch {
    const cached = await cachedApiResponse(cache, request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'You are offline and this public response has not been cached yet.' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    await trimCache(cache, MAX_RUNTIME_ENTRIES);
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.headers.has('Authorization')) return;
  if (/\/auth(?:\/|$)|token|session/i.test(url.pathname + url.search)) return;

  if (/\/api\/places(?:\/[1-9]\d*)?$/i.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(request, response.clone()).catch(() => {});
          return response;
        }
        return (await caches.match(absolute('offline.html'))) || response;
      } catch {
        const cached = await caches.match(request);
        return cached || (await caches.match(absolute('offline.html')));
      }
    })());
    return;
  }

  if (url.pathname.match(/\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i)) {
    event.respondWith(cacheFirst(request).catch(async () => (
      (await caches.match(request)) || new Response('This file is not available offline.', { status: 503 })
    )));
  }
});
