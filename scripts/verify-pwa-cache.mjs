import assert from 'node:assert/strict';

class LocalStorageMock {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

class CacheMock {
  entries = new Map();
  async put(request, response) {
    this.entries.set(typeof request === 'string' ? request : request.url, response.clone());
  }
  async match(request) {
    const response = this.entries.get(typeof request === 'string' ? request : request.url);
    return response?.clone();
  }
  async keys() { return [...this.entries.keys()]; }
}

const cacheEntries = new Map([['sis8-pwa-test-shell', new CacheMock()]]);
const cacheStorage = {
  async keys() { return [...cacheEntries.keys()]; },
  async open(key) {
    if (!cacheEntries.has(key)) cacheEntries.set(key, new CacheMock());
    return cacheEntries.get(key);
  },
};
const sourceEvents = [];

globalThis.localStorage = new LocalStorageMock();
globalThis.caches = cacheStorage;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options) { this.type = type; this.detail = options?.detail; }
};
globalThis.window = {
  location: { href: 'https://demo.test/sis8/#/places' },
  caches: cacheStorage,
  dispatchEvent(event) { sourceEvents.push(event); },
};
globalThis.document = {
  querySelector() { return { href: 'https://demo.test/sis8/manifest.json' }; },
};

const [{ initialDataSample }, { API_CONFIG }, service] = await Promise.all([
  import('../src/api/initial-data-sample.js'),
  import('../src/api/settings.js'),
  import('../src/services/service.js'),
]);

const localRecords = initialDataSample.map((place) => (
  place.id === 1 ? { ...place, completed: true } : place
));
localRecords.push({ id: 99, name: 'Private test place', description: 'must not be copied' });
localStorage.setItem('fake-init-data', JSON.stringify(localRecords));
API_CONFIG.minDelay = 0;
API_CONFIG.maxDelay = 0;
API_CONFIG.errorChance = 0;

const list = await service.getPlaces();
assert.equal(list.total, initialDataSample.length + 1, 'fresh fake API reads remain unchanged');
await service.getPlace(1);

const apiCache = await caches.open('sis8-pwa-test-public-api');
const listResponse = await apiCache.match('https://demo.test/sis8/api/places?page=1&limit=1000&sort=name');
const cachedList = await listResponse.json();
assert.equal(cachedList.length, initialDataSample.length, 'only public seed records are cached');
assert.equal(cachedList.some((place) => place.id === 99), false, 'user-added records are excluded');
assert.equal(Object.hasOwn(cachedList.find((place) => place.id === 1), 'completed'), false, 'visited state is excluded');
assert.ok(await apiCache.match('https://demo.test/sis8/api/places/1'), 'details have their own cached response');

API_CONFIG.errorChance = 1;
const cachedSearch = await service.getPlaces({ search: 'Charyn' });
assert.equal(cachedSearch.total, 1, 'search works on the cached catalogue');
const cachedAll = await service.getAllPlaces();
assert.equal(cachedAll.length, initialDataSample.length, 'dashboard data falls back to the public cache');
assert.equal(cachedAll.some((place) => place.id === 99), false, 'private local entries stay out of fallback');
const cachedPlace = await service.getPlace(1);
assert.equal(cachedPlace.completed, false, 'personal visited state is not restored from public cache');
assert.ok(sourceEvents.some((event) => event.detail?.cached), 'the app announces when it reads cached data');

console.log('PWA public-data cache check passed: list/details are cached, user data is excluded, and failed API reads use the cache.');
