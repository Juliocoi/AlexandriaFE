/**
 * Converts HTML <input type="date"> value (YYYY-MM-DD) to API format (DD/MM/YYYY).
 */
export function toApiDate(isoDate: string): string {
  const trimmed = isoDate.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

/**
 * Converts API date format (DD/MM/YYYY) to HTML <input type="date"> value (YYYY-MM-DD).
 */
export function toInputDate(apiDate: string): string {
  const trimmed = apiDate.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) return trimmed;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}
