export function shortName(value = '') {
  if (typeof value !== 'string') return '';

  const parts = value.trim().split(/\s+/);

  if (parts.length === 0) return '';

  return parts
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + ''))
    .join(' ');
}

export function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}
