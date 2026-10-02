export const STANDARD_SCHEDULE_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI"];

/** Group operates on Eastern time; "current month" for commitments uses this zone. */
export const COMMITMENT_TIMEZONE = "America/New_York";

export const DEFAULT_AGENDA_TITLES = [
  "Secretary's Report",
  "Treasurer's Report",
  "GSR Report",
  "Grapevine",
  "Intergroup Report",
  "Supplies / Coffee",
  "Literature",
  "Coins / Beginners Packets",
];

const APPLIES_TO_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalize a YYYY-MM month key, or return "". */
export function normalizeAppliesToMonth(value) {
  const raw = String(value ?? "").trim();
  return APPLIES_TO_MONTH_RE.test(raw) ? raw : "";
}

/** YYYY-MM from a meeting date (date-only values are stored/read as UTC). */
export function monthKeyFromDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** Advance a YYYY-MM key (or date) by one calendar month. */
export function nextMonthKey(monthOrDate) {
  const key =
    typeof monthOrDate === "string" && APPLIES_TO_MONTH_RE.test(monthOrDate)
      ? monthOrDate
      : monthKeyFromDate(monthOrDate);
  if (!key) return "";
  const [ys, ms] = key.split("-");
  const y = Number(ys);
  const m = Number(ms);
  if (m === 12) return `${y + 1}-01`;
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

/**
 * Commitments voted at a business meeting apply to the following calendar month.
 * July BM → August schedule.
 */
export function defaultAppliesToMonth(meetingDate) {
  const key = monthKeyFromDate(meetingDate);
  return key ? nextMonthKey(key) : "";
}

/** Current calendar month in Eastern time as YYYY-MM. */
export function currentMonthKey(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: COMMITMENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  if (!year || !month) return "";
  return `${year}-${month}`;
}

/** "August 2026" from YYYY-MM. */
export function formatMonthLabel(monthKey) {
  const key = normalizeAppliesToMonth(monthKey);
  if (!key) return "";
  const [ys, ms] = key.split("-");
  const d = new Date(Date.UTC(Number(ys), Number(ms) - 1, 1));
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Effective month a schedule covers. Prefers stored appliesToMonth; otherwise
 * meeting month + 1 (legacy minutes without the field).
 */
export function resolveAppliesToMonth(schedule, meetingDate) {
  return (
    normalizeAppliesToMonth(schedule?.appliesToMonth) || defaultAppliesToMonth(meetingDate)
  );
}

export function meetingSlugFromDate(date) {
  return monthKeyFromDate(date);
}

export function formatMeetingDateLabel(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function defaultAgendaSections() {
  return DEFAULT_AGENDA_TITLES.map((title, index) => ({
    key: slugify(title) || `section-${index}`,
    title,
    content: "",
    motion: { movedBy: "", secondedBy: "", outcome: "" },
  }));
}

export function emptyScheduleRow(day = "", cellCount = 2) {
  return {
    day,
    cells: Array.from({ length: Math.max(cellCount, 1) }, () => ""),
  };
}

export function emptyCommitmentSchedule(columnCount = 2, appliesToMonth = "") {
  const columns = ["Chair", "Sherpa"].slice(0, columnCount);
  while (columns.length < columnCount) {
    columns.push(`Role ${columns.length + 1}`);
  }
  return {
    title: "",
    appliesToMonth: normalizeAppliesToMonth(appliesToMonth),
    columns,
    rows: STANDARD_SCHEDULE_DAYS.map((day) => emptyScheduleRow(day, columns.length)),
  };
}

function trimStr(v, max = 5000) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

function parseMotion(raw) {
  if (!raw || typeof raw !== "object") {
    return { movedBy: "", secondedBy: "", outcome: "" };
  }
  return {
    movedBy: trimStr(raw.movedBy, 120),
    secondedBy: trimStr(raw.secondedBy, 120),
    outcome: trimStr(raw.outcome, 120),
  };
}

function parseSections(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s, index) => {
      const title = trimStr(s?.title, 200);
      if (!title) return null;
      const key = trimStr(s?.key, 80) || slugify(title) || `section-${index}`;
      return {
        key,
        title,
        content: trimStr(s?.content, 20000),
        motion: parseMotion(s?.motion),
      };
    })
    .filter(Boolean);
}

function parseAttachedReports(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({
      label: trimStr(r?.label, 80),
      title: trimStr(r?.title, 200),
      content: trimStr(r?.content, 20000),
    }))
    .filter((r) => r.label || r.title || r.content);
}

function parseCommitmentSchedules(raw, meetingDate) {
  const fallbackMonth = defaultAppliesToMonth(meetingDate);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((sched) => {
      const title = trimStr(sched?.title, 200);
      const columns = Array.isArray(sched?.columns)
        ? sched.columns.map((c) => trimStr(c, 80)).filter(Boolean)
        : [];
      if (columns.length === 0) return null;
      const rows = Array.isArray(sched?.rows)
        ? sched.rows.map((row) => {
            const day = trimStr(row?.day, 20);
            const cells = Array.isArray(row?.cells)
              ? row.cells.map((c) => trimStr(c, 120))
              : [];
            while (cells.length < columns.length) cells.push("");
            return { day, cells: cells.slice(0, columns.length) };
          })
        : [];
      return {
        title,
        appliesToMonth: normalizeAppliesToMonth(sched?.appliesToMonth) || fallbackMonth,
        columns,
        rows,
      };
    })
    .filter(Boolean);
}

export function parseBusinessMeetingPayload(raw) {
  const meetingDate = new Date(raw?.meetingDate);
  if (Number.isNaN(meetingDate.getTime())) {
    throw new Error("A valid meeting date is required.");
  }

  const adj = raw?.adjournment && typeof raw.adjournment === "object" ? raw.adjournment : {};

  return {
    meetingDate,
    slug: trimStr(raw?.slug, 80) || meetingSlugFromDate(meetingDate),
    published: Boolean(raw?.published),
    chair: trimStr(raw?.chair, 120),
    openedAt: trimStr(raw?.openedAt, 40),
    openingNotes: trimStr(raw?.openingNotes, 4000),
    sections: parseSections(raw?.sections),
    oldBusiness: trimStr(raw?.oldBusiness, 20000),
    newBusiness: trimStr(raw?.newBusiness, 20000),
    adjournment: {
      movedBy: trimStr(adj.movedBy, 120),
      time: trimStr(adj.time, 40),
      closingNotes: trimStr(adj.closingNotes, 500),
    },
    signOff: trimStr(raw?.signOff, 200),
    attachedReports: parseAttachedReports(raw?.attachedReports),
    commitmentSchedules: parseCommitmentSchedules(raw?.commitmentSchedules, meetingDate),
  };
}

export function slugifyMeetingSlug(value) {
  return slugify(value);
}
