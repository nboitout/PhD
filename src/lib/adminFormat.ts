// Shared formatting helpers for the admin dashboard.
// - Timestamps render in Romanian local time (EET/EEST) rather than UTC.
// - Durations show in seconds, switching to minutes past 1 min.

const RO_TZ = 'Europe/Bucharest';

/**
 * Format an instant in Romanian local time (EET/EEST).
 * Accepts an ISO string, epoch ms, or Date. Returns DD/MM/YYYY HH:mm (24h).
 */
export function fmtRo(
  input: string | number | Date,
  opts?: { dateOnly?: boolean; withSeconds?: boolean }
): string {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return '—';
  const o: Intl.DateTimeFormatOptions = {
    timeZone: RO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  if (!opts?.dateOnly) {
    o.hour = '2-digit';
    o.minute = '2-digit';
    o.hour12 = false;
    if (opts?.withSeconds) o.second = '2-digit';
  }
  return new Intl.DateTimeFormat('en-GB', o).format(d);
}

/** Calendar date (YYYY-MM-DD) of an instant in Europe/Bucharest. */
export function roDate(input: string | number | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Hour of day (0–23) of an instant in Europe/Bucharest. */
export function roHour(input: string | number | Date): number {
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return NaN;
  return parseInt(
    new Intl.DateTimeFormat('en-GB', { timeZone: RO_TZ, hour: '2-digit', hour12: false }).format(d),
    10
  ) % 24;
}

/**
 * Format a duration given in seconds. Stays in seconds up to 1 minute, then
 * switches to minutes (e.g. 59 -> "59s", 95 -> "1m 35s", 180 -> "3m").
 */
export function fmtDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s === 0 ? `${m}m` : `${m}m ${String(s).padStart(2, '0')}s`;
}
