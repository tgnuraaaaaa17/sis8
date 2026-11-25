import { initialDataSample } from '../api/initial-data-sample.js';

const PUBLIC_PLACE_IDS = new Set(initialDataSample.map(({ id }) => Number(id)));
const PUBLIC_FIELDS = [
  'id', 'name', 'description', 'category', 'city', 'region', 'price',
  'rating', 'visitHours', 'status', 'featured', 'tags', 'createdAt', 'image',
];

function appUrl(path) {
  const manifestUrl = document.querySelector('link[rel="manifest"]')?.href || window.location.href;
  const base = new URL('.', manifestUrl);
  return new URL(path, base).href;
}

function publicSnapshot(value) {
  const sanitize = (place) => {
    if (!place || !PUBLIC_PLACE_IDS.has(Number(place.id))) return null;
    return Object.fromEntries(PUBLIC_FIELDS
      .filter((field) => Object.hasOwn(place, field))
      .map((field) => [field, place[field]]));
  };

  if (Array.isArray(value)) return value.map(sanitize).filter(Boolean);
  return sanitize(value);
}

function announceSource(cached) {
  window.dispatchEvent(new CustomEvent('sis8:public-data-source', {
    detail: { cached },
  }));
}

async function publicApiCache() {
  if (!('caches' in window)) return null;
  const keys = await caches.keys();
  const shellKey = keys.filter((key) => /^sis8-pwa-.+-shell$/.test(key)).at(-1);
  if (shellKey) return caches.open(shellKey.replace(/-shell$/, '-public-api'));
  const apiKey = keys.filter((key) => /^sis8-pwa-.+-public-api$/.test(key)).at(-1);
  return apiKey ? caches.open(apiKey) : null;
}

/** Store only the public catalogue records shipped with the homework starter. */
export async function savePublicApiSnapshot(path, value) {
  try {
    const snapshot = publicSnapshot(value);
    if (!snapshot || (Array.isArray(snapshot) && snapshot.length === 0)) return false;

    const cache = await publicApiCache();
    if (!cache) return false;

    const response = new Response(JSON.stringify(snapshot), {
      headers: {
        'Content-Type': 'application/json',
        'X-PWA-Cache': 'PUBLIC-SNAPSHOT',
      },
    });
    await cache.put(appUrl(path), response);
    return true;
  } catch {
    // The app remains usable when Cache Storage is unavailable or full.
    return false;
  }
}

/** Read a saved public response when the local API request itself fails. */
export async function readPublicApiSnapshot(path) {
  try {
    const cache = await publicApiCache();
    const response = await cache?.match(appUrl(path));
    if (!response) return null;

    const snapshot = publicSnapshot(await response.json());
    if (!snapshot) return null;
    announceSource(true);
    return Array.isArray(snapshot)
      ? snapshot.map((place) => ({ ...place, completed: false }))
      : { ...snapshot, completed: false };
  } catch {
    return null;
  }
}

export function announceFreshPublicData() {
  announceSource(false);
}
