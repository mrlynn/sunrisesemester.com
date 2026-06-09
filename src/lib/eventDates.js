/** Wall-clock timezone for community events (Valley Forge / Philadelphia area). */
export const EVENT_TIMEZONE = "America/New_York";

function partsInTimeZone(date, timeZone = EVENT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type) => {
    const value = parts.find((p) => p.type === type)?.value;
    if (value == null) return 0;
    return type === "hour" ? parseInt(value, 10) % 24 : parseInt(value, 10);
  };
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function compareParts(a, b) {
  return (
    a.year - b.year
    || a.month - b.month
    || a.day - b.day
    || a.hour - b.hour
    || a.minute - b.minute
    || a.second - b.second
  );
}

/** Parse a datetime-local value (YYYY-MM-DDTHH:mm) as Eastern wall time. */
export function parseEventDateInput(value) {
  const match = String(value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return new Date(value);

  const target = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: 0,
  };

  let lo = Date.UTC(target.year, target.month - 1, target.day, target.hour - 14, target.minute);
  let hi = Date.UTC(target.year, target.month - 1, target.day, target.hour + 14, target.minute);

  for (let i = 0; i < 50; i += 1) {
    const mid = Math.floor((lo + hi) / 2);
    const cmp = compareParts(partsInTimeZone(new Date(mid)), target);
    if (cmp < 0) lo = mid + 1;
    else if (cmp > 0) hi = mid - 1;
    else return new Date(mid);
  }

  return new Date(lo);
}

/** Format a stored Date for a datetime-local input in Eastern time. */
export function formatEventDateInput(date) {
  if (!date) return "";
  const p = partsInTimeZone(new Date(date));
  const pad = (n) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/**
 * Events saved before timezone handling treated datetime-local values as UTC.
 * Reinterpret stored UTC components as Eastern wall time.
 */
export function fixLegacyEventDate(stored) {
  const d = new Date(stored);
  if (Number.isNaN(d.getTime())) return d;
  const pad = (n) => String(n).padStart(2, "0");
  const local = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return parseEventDateInput(local);
}

/** Format a stored Date for public display in Eastern time. */
export function formatEventDate(date, options = {}) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: EVENT_TIMEZONE,
      ...options,
    });
  } catch {
    return "";
  }
}
