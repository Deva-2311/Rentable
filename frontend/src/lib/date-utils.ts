/**
 * RENTABLE Date & Duration Formatting Utilities
 * Standardized across borrower, owner, admin, checkout, and product details.
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Safely parse a date value from MongoDB, API responses, or HTML inputs.
 * Normalizes date-only strings (YYYY-MM-DD) to local midnight to prevent
 * timezone boundary shifts (e.g., date displayed one day early).
 */
export function parseDateSafe(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Match YYYY-MM-DD or YYYY-MM-D
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }

    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/**
 * Consistently format dates as "17 Oct 2026"
 */
export function formatDateDisplay(
  date: string | Date | null | undefined,
  fallback = '—',
): string {
  const d = parseDateSafe(date);
  if (!d) return fallback;

  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format date with time as "17 Oct 2026, 06:25 PM"
 */
export function formatDateTimeDisplay(
  date: string | Date | null | undefined,
  fallback = '—',
): string {
  const d = parseDateSafe(date);
  if (!d) return fallback;

  const dateStr = formatDateDisplay(d, fallback);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour is 12 AM

  return `${dateStr}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Calculate rental duration in days using one consistent calendar-day rule.
 * Normalizes start and end dates to UTC calendar boundaries at 00:00:00 to eliminate
 * daylight-saving, hour-of-day, and timezone boundary skews.
 * Enforces a minimum of 1 day for any valid same-day or multi-day rental.
 */
export function calculateDurationDays(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
): number {
  const s = parseDateSafe(start);
  const e = parseDateSafe(end);
  if (!s || !e) return 1;

  const sUtc = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
  const eUtc = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());

  const diffMs = eUtc - sUtc;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

/**
 * Format duration as "1 Day" or "3 Days"
 */
export function formatDurationDisplay(days: number | null | undefined): string {
  const count = typeof days === 'number' && days > 0 ? days : 1;
  return `${count} ${count === 1 ? 'Day' : 'Days'}`;
}

/**
 * Format currency amounts in INR: "₹1,200"
 */
export function formatCurrency(amount: number | null | undefined): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}
