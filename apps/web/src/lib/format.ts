import { differenceInCalendarDays, format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

function toDate(value: string | Date): Date | null {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

/** "just now", "5m", "3h", "2d", then "12 Oct" / "12 Oct 2025". */
export function formatRelativeTime(value: string | Date): string {
  const date = toDate(value);
  if (!date) return "";
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (seconds < 60) return "just now";
  const days = differenceInCalendarDays(new Date(), date);
  if (days < 7) {
    return formatDistanceToNowStrict(date)
      .replace(/ minutes?/, "m")
      .replace(/ hours?/, "h")
      .replace(/ days?/, "d")
      .replace(/ seconds?/, "s");
  }
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return format(date, sameYear ? "d MMM" : "d MMM yyyy");
}

export function formatDate(value: string | Date, pattern = "d MMM yyyy"): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "-";
}

export function formatMonthYear(value: string | Date): string {
  return formatDate(value, "MMMM yyyy");
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatCompactNumber(count)} ${count === 1 ? singular : plural}`;
}

/** ISO date (yyyy-MM-dd) for <input type="date"> values. */
export function toDateInputValue(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

/** Full number with thousands separators, e.g. 3,865. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}
