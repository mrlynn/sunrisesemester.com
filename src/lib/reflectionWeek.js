const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Monday 00:00 local time for the calendar week containing `date`. */
export function startOfWeekMonday(date) {
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) {
    return null;
  }
  d.setHours(0, 0, 0, 0);
  const weekday = d.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Seven { month, day } pairs (Mon–Sun) for the week starting on Monday. */
export function calendarDaysInWeek(weekOfDate) {
  const start = startOfWeekMonday(weekOfDate);
  if (!start) return [];
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ month: d.getMonth() + 1, day: d.getDate() });
  }
  return out;
}

export function formatMonthDayShort(month, day) {
  const name = MONTH_NAMES[month - 1] || "";
  return name ? `${name} ${day}` : "";
}

/** e.g. "May 25 – May 31, 2026" */
export function formatWeekRange(weekOfDate) {
  const days = calendarDaysInWeek(weekOfDate);
  if (days.length === 0) return "";
  const start = startOfWeekMonday(weekOfDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const y = start.getFullYear();
  const a = formatMonthDayShort(days[0].month, days[0].day);
  const b = formatMonthDayShort(days[6].month, days[6].day);
  if (days[0].month === days[6].month) {
    return `${MONTH_NAMES[days[0].month - 1]} ${days[0].day}–${days[6].day}, ${y}`;
  }
  return `${a} – ${b}, ${y}`;
}

export function defaultWeeklyPuzzleTitle(weekOfDate) {
  return `Crossword: Week of ${formatWeekRange(weekOfDate)}`;
}
