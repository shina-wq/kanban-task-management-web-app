/** A local date as an ISO string, e.g. "2026-11-19". `offsetDays` moves it from today. */
export function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today's local date as an ISO string, e.g. "2026-11-19". */
export function todayIso(): string {
  return isoDate();
}
