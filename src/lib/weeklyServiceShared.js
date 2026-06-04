export const WEEKLY_SERVICE_DAYS = [
  { key: "sun", label: "Sunday", chair: "", sherpa: "", openChair: false },
  { key: "mon", label: "Monday", chair: "", sherpa: "", openChair: false },
  { key: "tue", label: "Tuesday", chair: "", sherpa: "", openChair: false },
  { key: "wed", label: "Wednesday", chair: "", sherpa: "", openChair: false },
  { key: "thu", label: "Thursday", chair: "", sherpa: "", openChair: false },
  { key: "fri", label: "Friday", chair: "", sherpa: "", openChair: false },
  { key: "sat", label: "Saturday", chair: "", sherpa: "", openChair: true },
];

const DAY_KEYS = new Set(WEEKLY_SERVICE_DAYS.map((d) => d.key));

function trimStr(v, max = 120) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

export function defaultWeeklyServiceDays() {
  return WEEKLY_SERVICE_DAYS.map((d) => ({ ...d }));
}

export function parseWeeklyServicePayload(raw) {
  const notes = trimStr(raw?.notes, 500);
  const inputDays = Array.isArray(raw?.days) ? raw.days : [];
  const byKey = new Map(inputDays.map((d) => [trimStr(d?.key, 10), d]));

  const days = WEEKLY_SERVICE_DAYS.map((template) => {
    const row = byKey.get(template.key) || {};
    const openChair =
      template.key === "sat" ? Boolean(row.openChair ?? true) : false;
    return {
      key: template.key,
      label: template.label,
      chair: openChair ? "" : trimStr(row.chair),
      sherpa: openChair ? "" : trimStr(row.sherpa),
      openChair,
    };
  });

  return { notes, days };
}

export function normalizeWeeklyServiceDays(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return defaultWeeklyServiceDays();
  }
  return parseWeeklyServicePayload({ days }).days;
}

export function isValidDayKey(key) {
  return DAY_KEYS.has(key);
}
