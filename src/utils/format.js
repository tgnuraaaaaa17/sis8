/**
 * format.js — UI-да қолданылатын шағын көмекші функциялар.
 * (Модуль деңгейіндегі функция — hook ЕМЕС, қазақстан ережелерін бұзбайды.)
 */

/** 4500 → "$4,500". */
export function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  if (number === 0) return 'Free';
  return `$${number.toLocaleString('en-US')}`;
}

/** 4.8 → "4.8". */
export function formatRating(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(1) : '—';
}

/** 4 → "4 h". */
export function formatHours(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `${number} h` : '—';
}

/** "2024-03-12" → "12 Mar 2024". */
export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "2024-03-12T09:20:31.000Z" → "09:20:31" (жүктелген сәтін көрсету үшін). */
export function formatTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-GB');
}

/** "open" → "Open to visit", "seasonal" → "Seasonal", "closed" → "Closed". */
export function formatStatus(value) {
  switch (value) {
    case 'open':
      return 'Open to visit';
    case 'seasonal':
      return 'Seasonal only';
    case 'closed':
      return 'Closed';
    default:
      return value || '—';
  }
}
