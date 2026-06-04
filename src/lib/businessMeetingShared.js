export const STANDARD_SCHEDULE_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI"];

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

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function meetingSlugFromDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
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

export function emptyCommitmentSchedule(columnCount = 2) {
  const columns = ["Chair", "Sherpa"].slice(0, columnCount);
  while (columns.length < columnCount) {
    columns.push(`Role ${columns.length + 1}`);
  }
  return {
    title: "",
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

function parseCommitmentSchedules(raw) {
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
      return { title, columns, rows };
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
    commitmentSchedules: parseCommitmentSchedules(raw?.commitmentSchedules),
  };
}

export function slugifyMeetingSlug(value) {
  return slugify(value);
}
