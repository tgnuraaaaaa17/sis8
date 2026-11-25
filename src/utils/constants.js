/** Shared constants for the places feature. */

export const PAGE_LIMIT = 8;
export const DEFAULT_SORT = 'name';

export const CATEGORIES = [
  'Nature',
  'Mountain',
  'Lake',
  'Steppe',
  'Monument',
  'Museum',
  'Mosque',
  'Landmark',
  'Palace',
  'Sport',
  'Mall',
  'Science',
  'Culture',
];

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open to visit' },
  { value: 'seasonal', label: 'Seasonal only' },
  { value: 'closed', label: 'Closed' },
];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Recently added' },
];

/** Initial state of the create / edit form. */
export const EMPTY_DRAFT = {
  id: null,
  name: '',
  description: '',
  category: 'Nature',
  city: '',
  region: '',
  price: '',
  rating: '',
  visitHours: '',
  status: 'open',
  featured: false,
  tags: '',
};
