/**
 * services/service.js — the only place where the app talks to the API.
 *
 * The starter fake API (src/api/fakeApi.js, kept unmodified) is localStorage-backed.
 * This service reads the public catalogue once, mirrors a privacy-safe snapshot
 * into the service worker cache, then applies search, filters, sorting, and paging.
 */
import { createItem, deleteItem, getItem, getItemsList, updateItem } from '../api/fakeApi.js';
import { DEFAULT_SORT, PAGE_LIMIT } from '../utils/constants.js';
import {
  announceFreshPublicData,
  readPublicApiSnapshot,
  savePublicApiSnapshot,
} from './publicDataCache.js';

const ALL = 1000; // more than the number of records the demo database can hold

const IMAGE_BY_CATEGORY = {
  Nature: 'images/orman.svg',
  Mountain: 'images/tau.svg',
  Lake: 'images/kol.svg',
  Steppe: 'images/daala.svg',
  Monument: 'images/monument.svg',
  Museum: 'images/muzei.svg',
  Mosque: 'images/mosque.svg',
  Landmark: 'images/qala.svg',
  Palace: 'images/qala.svg',
  Sport: 'images/shol.svg',
  Mall: 'images/shonyraq.svg',
  Science: 'images/daala.svg',
  Culture: 'images/muzei.svg',
};

export class PlaceNotFoundError extends Error {
  constructor(id) {
    super(`Place “${id}” was not found.`);
    this.name = 'PlaceNotFoundError';
  }
}

/** Only positive whole numbers can be real ids. */
export function isValidPlaceId(id) {
  return /^[1-9]\d*$/.test(String(id));
}

const byName = (a, b) => a.name.localeCompare(b.name);
const PUBLIC_LIST_QUERY = `page=1&limit=${ALL}&sort=name`;
const PUBLIC_LIST_CACHE_KEY = `api/places?${PUBLIC_LIST_QUERY}`;

const COMPARATORS = {
  name: byName,
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'rating-desc': (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0) || byName(a, b),
  'price-asc': (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0) || byName(a, b),
  'price-desc': (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0) || byName(a, b),
  newest: (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')) || byName(a, b),
};

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

/**
 * Search + filters + sorting + pagination.
 * Returns { data, total, page, limit, totalPages, facets }.
 * `page` is clamped to the real range, so a stale URL never shows an empty page.
 */
export async function getPlaces({
  search = '',
  category = '',
  region = '',
  status = '',
  sort = DEFAULT_SORT,
  page = 1,
  limit = PAGE_LIMIT,
} = {}) {
  let data;
  try {
    ({ data } = await getItemsList(PUBLIC_LIST_QUERY));
    await savePublicApiSnapshot(PUBLIC_LIST_CACHE_KEY, data);
    announceFreshPublicData();
  } catch (error) {
    data = await readPublicApiSnapshot(PUBLIC_LIST_CACHE_KEY);
    if (!data) throw error;
  }

  if (search.trim()) {
    const normalizedSearch = search.trim().toLowerCase();
    data = data.filter((place) => (
      place.name.toLowerCase().includes(normalizedSearch)
      || place.description.toLowerCase().includes(normalizedSearch)
    ));
  }

  const facets = {
    categories: unique(data.map((place) => place.category)),
    regions: unique(data.map((place) => place.region)),
  };

  const filtered = data
    .filter((place) => !category || place.category === category)
    .filter((place) => !region || place.region === region)
    .filter((place) => !status || place.status === status)
    .sort(COMPARATORS[sort] || COMPARATORS[DEFAULT_SORT]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total,
    page: currentPage,
    limit,
    totalPages,
    facets,
  };
}

/** Every place (used by the Dashboard for statistics). */
export async function getAllPlaces() {
  try {
    const result = await getItemsList(PUBLIC_LIST_QUERY);
    await savePublicApiSnapshot(PUBLIC_LIST_CACHE_KEY, result.data);
    announceFreshPublicData();
    return result.data;
  } catch (error) {
    const cached = await readPublicApiSnapshot(PUBLIC_LIST_CACHE_KEY);
    if (cached) return cached;
    throw error;
  }
}

/** One place by id. Throws PlaceNotFoundError for invalid or missing ids. */
export async function getPlace(id) {
  if (!isValidPlaceId(id)) throw new PlaceNotFoundError(id);

  try {
    const place = await getItem(id);
    await savePublicApiSnapshot(`api/places/${id}`, place);
    announceFreshPublicData();
    return place;
  } catch (error) {
    if (error?.message === 'Item not found') throw new PlaceNotFoundError(id);
    const cached = await readPublicApiSnapshot(`api/places/${id}`);
    if (cached) return cached;
    throw error;
  }
}

/**
 * createItem() stores only name + description, so the record is completed with
 * updateItem(). That keeps fakeApi.js untouched.
 */
export async function createPlace(values) {
  const created = await createItem({ name: values.name, description: values.description });

  return updateItem(created.id, {
    ...values,
    image: IMAGE_BY_CATEGORY[values.category] || 'images/orman.svg',
    createdAt: new Date().toISOString().slice(0, 10),
    completed: false,
  });
}

export function updatePlace(id, values) {
  return updateItem(id, values);
}

export function setVisited(id, completed) {
  return updateItem(id, { completed });
}

export function deletePlace(id) {
  return deleteItem(id);
}
