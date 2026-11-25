/** Pure helpers used by the Dashboard. All numbers come from API data. */

const sum = (list, pick) => list.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

export function computeStats(places) {
  const total = places.length;
  const rated = places.filter((place) => Number(place.rating) > 0);

  return {
    total,
    averageRating: rated.length > 0 ? sum(rated, (place) => place.rating) / rated.length : null,
    averagePrice: total > 0 ? sum(places, (place) => place.price) / total : null,
    freeCount: places.filter((place) => Number(place.price) === 0).length,
    visitedCount: places.filter((place) => place.completed).length,
    featuredCount: places.filter((place) => place.featured).length,
    totalHours: sum(places, (place) => place.visitHours),
  };
}

/** [{ label, count }] sorted by count (desc), then by label. */
export function countBy(places, key) {
  const counts = new Map();
  places.forEach((place) => {
    const label = place[key] || 'Unknown';
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
