/**
 * Parse pasted business-meeting notes into form-shaped fields.
 * Handles headings, Motion/Second/Result lines, and Day/Chair/Sherpa tables.
 */

import {
  defaultAppliesToMonth,
  meetingSlugFromDate,
} from "./businessMeetingShared.js";

const SPECIAL_HEADINGS = new Map([
  ["chair rotation", "schedule"],
  ["commitment schedule", "schedule"],
  ["old business", "oldBusiness"],
  ["new business", "newBusiness"],
  ["action items", "actionItems"],
  ["action item", "actionItems"],
  ["adjournment", "adjournment"],
  ["opening", "openingNotes"],
  ["opening notes", "openingNotes"],
]);

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday (Men's Meeting)",
  "Saturday (Women's Meeting)",
  "Saturday",
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHeading(line) {
  return String(line || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/\s+/g, " ");
}

function emptyMotion() {
  return { movedBy: "", secondedBy: "", outcome: "" };
}

function isLikelyHeading(line, nextLine) {
  const trimmed = String(line || "").trim();
  if (!trimmed || trimmed.length > 80) return false;
  if (/^(motion|second|result|vote|during discussion)\b/i.test(trimmed)) return false;
  // Sentences are never headings
  if (/[.!?]$/.test(trimmed)) return false;
  if (/^\d+[\).\]]\s/.test(trimmed)) return false;
  // Schedule cell values that look title-ish
  if (/^bring your own\b/i.test(trimmed)) return false;
  if (/^(n\/a|tbd|vacant|none)$/i.test(trimmed)) return false;

  const normalized = normalizeHeading(trimmed);
  // Table column headers — keep inside Chair Rotation body, not new sections
  if (["day", "chair", "sherpa", "role"].includes(normalized)) return false;
  if (looksLikeDay(trimmed)) return false;

  if (SPECIAL_HEADINGS.has(normalized)) return true;
  if (/report$/i.test(trimmed)) return true;

  // Title Case / short label headings common in secretary notes
  const words = trimmed.split(/\s+/);
  const titleLike =
    words.length <= 8 &&
    /^[A-Z0-9]/.test(trimmed) &&
    !/^(the|a|an|please|mike|kevin|laura|chuck|paul|billy|john|there)\b/i.test(trimmed);

  if (!titleLike) return false;
  if (nextLine === undefined) return false;
  return true;
}

function splitBlocks(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const blocks = [];
  let current = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const next = lines[i + 1];
    const trimmed = line.trim();
    if (!trimmed && !current) continue;

    if (isLikelyHeading(trimmed, next)) {
      if (current) blocks.push(current);
      current = { title: trimmed, lines: [] };
      continue;
    }

    if (!current) {
      current = { title: "Opening notes", lines: [line] };
      continue;
    }
    current.lines.push(line);
  }
  if (current) blocks.push(current);
  return blocks;
}

function extractMovedBy(motionLine) {
  const text = motionLine.replace(/^motion:\s*/i, "").trim();
  const m =
    text.match(/^(.+?)\s+moved\b/i) ||
    text.match(/^(.+?)\s+makes?\s+a\s+motion\b/i) ||
    text.match(/^(.+?)\s+made\s+a\s+motion\b/i);
  return m ? m[1].trim() : "";
}

/**
 * Pull Motion / Second / Result / Vote lines out of a body.
 * Returns { content, motion }.
 */
export function extractMotionFromBody(body) {
  const lines = String(body || "").split("\n");
  const kept = [];
  const motion = emptyMotion();
  const voteParts = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      kept.push(line);
      continue;
    }
    if (/^motion:\s*/i.test(trimmed)) {
      motion.movedBy = extractMovedBy(trimmed);
      // Keep the full motion sentence in content for readability
      kept.push(line);
      continue;
    }
    // Narrative form: "Mike L. made a motion to…"
    if (!motion.movedBy && /\bmade a motion\b/i.test(trimmed)) {
      const m = trimmed.match(/^(.+?)\s+made a motion\b/i);
      if (m) motion.movedBy = m[1].trim();
      kept.push(line);
      continue;
    }
    if (/^second:\s*/i.test(trimmed)) {
      motion.secondedBy = trimmed.replace(/^second:\s*/i, "").trim();
      continue;
    }
    if (/^result:\s*/i.test(trimmed)) {
      motion.outcome = trimmed.replace(/^result:\s*/i, "").trim();
      continue;
    }
    if (/^vote:\s*/i.test(trimmed)) {
      voteParts.push(trimmed.replace(/^vote:\s*/i, "").trim());
      continue;
    }
    kept.push(line);
  }

  if (voteParts.length) {
    const voteText = voteParts.join("; ");
    motion.outcome = motion.outcome ? `${motion.outcome} (${voteText})` : voteText;
  }

  // Trim trailing blank lines from content
  let content = kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { content, motion };
}

function looksLikeDay(line) {
  const t = String(line || "").trim();
  if (!t) return false;
  return DAY_LABELS.some((d) => t.toLowerCase().startsWith(d.toLowerCase()));
}

/**
 * Parse a Day / Chair / Sherpa style column dump into a commitment schedule.
 */
export function parseChairSchedule(body) {
  const lines = String(body || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Drop narrative until we hit column headers or a day label
  let start = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const n = lines[i].toLowerCase();
    if (n === "day" || looksLikeDay(lines[i])) {
      start = i;
      break;
    }
  }

  let columns = ["Chair", "Sherpa"];
  let i = start;
  if (lines[i]?.toLowerCase() === "day") {
    i += 1;
    const cols = [];
    while (i < lines.length && !looksLikeDay(lines[i]) && cols.length < 6) {
      const header = lines[i];
      if (!/^(the|following|chair schedule)/i.test(header)) {
        cols.push(header);
      }
      i += 1;
      if (cols.length >= 2 && looksLikeDay(lines[i])) break;
    }
    if (cols.length >= 1) columns = cols;
  }

  const rows = [];
  while (i < lines.length) {
    if (!looksLikeDay(lines[i])) {
      i += 1;
      continue;
    }
    const day = lines[i];
    i += 1;
    const cells = [];
    while (i < lines.length && !looksLikeDay(lines[i]) && cells.length < columns.length) {
      cells.push(lines[i]);
      i += 1;
    }
    while (cells.length < columns.length) cells.push("");
    rows.push({ day, cells: cells.slice(0, columns.length) });
  }

  if (rows.length === 0) return null;
  return {
    title: "Chair Rotation",
    appliesToMonth: "",
    columns,
    rows,
  };
}

function classifyBlock(title) {
  const normalized = normalizeHeading(title);
  if (SPECIAL_HEADINGS.has(normalized)) return SPECIAL_HEADINGS.get(normalized);
  return "section";
}

/**
 * @param {string} notes
 * @param {{ meetingDate?: string }} [options] meetingDate as YYYY-MM-DD
 * @returns {{ ok: true, value: object, warnings: string[] } | { ok: false, error: string }}
 */
export function parseBusinessMeetingNotes(notes, options = {}) {
  const text = String(notes || "").trim();
  if (!text) {
    return { ok: false, error: "Paste some meeting notes first." };
  }

  const blocks = splitBlocks(text);
  if (blocks.length === 0) {
    return { ok: false, error: "Could not find any headings or content to parse." };
  }

  const warnings = [];
  const sections = [];
  let oldBusiness = "";
  let newBusiness = "";
  let openingNotes = "";
  let actionItems = "";
  let adjournmentNotes = "";
  const commitmentSchedules = [];

  for (const block of blocks) {
    const body = block.lines.join("\n").trim();
    const kind = classifyBlock(block.title);

    if (kind === "schedule") {
      const schedule = parseChairSchedule(body);
      if (schedule) commitmentSchedules.push(schedule);
      else warnings.push(`Could not parse a chair table under “${block.title}”.`);
      continue;
    }

    if (kind === "oldBusiness") {
      oldBusiness = [oldBusiness, body].filter(Boolean).join("\n\n");
      continue;
    }

    if (kind === "newBusiness") {
      // Prefer splitting nested Title-Case subsections that carry motions into agenda sections
      const nested = splitBlocks(`${block.title}\n${body}`);
      // First block is "New Business" itself; remainder may be subsections if splitBlocks re-detects
      // Re-split the body alone for subsections
      const subBlocks = splitBlocks(body);
      const hasSubs =
        subBlocks.length > 1 ||
        (subBlocks.length === 1 && normalizeHeading(subBlocks[0].title) !== normalizeHeading(block.title));

      if (
        hasSubs &&
        subBlocks.some((b) => /motion:/i.test(b.lines.join("\n")) || /\bmade a motion\b/i.test(b.lines.join("\n")))
      ) {
        const narrative = [];
        for (const sub of subBlocks) {
          const subBody = sub.lines.join("\n").trim();
          const subKind = classifyBlock(sub.title);
          if (subKind !== "section") {
            narrative.push([sub.title, subBody].filter(Boolean).join("\n"));
            continue;
          }
          if (/motion:/i.test(subBody) || /\bmade a motion\b/i.test(subBody)) {
            const { content, motion } = extractMotionFromBody(subBody);
            sections.push({
              key: slugify(sub.title) || `section-${sections.length}`,
              title: sub.title,
              content,
              motion,
            });
          } else {
            narrative.push([sub.title, subBody].filter(Boolean).join("\n\n"));
          }
        }
        if (narrative.length) {
          newBusiness = [newBusiness, narrative.join("\n\n")].filter(Boolean).join("\n\n");
        }
      } else {
        newBusiness = [newBusiness, body].filter(Boolean).join("\n\n");
      }
      continue;
    }

    if (kind === "actionItems") {
      actionItems = [actionItems, body].filter(Boolean).join("\n\n");
      continue;
    }

    if (kind === "adjournment") {
      adjournmentNotes = [adjournmentNotes, body].filter(Boolean).join("\n\n");
      continue;
    }

    if (kind === "openingNotes") {
      openingNotes = [openingNotes, body].filter(Boolean).join("\n\n");
      continue;
    }

    // Default: agenda section
    const { content, motion } = extractMotionFromBody(body);
    sections.push({
      key: slugify(block.title) || `section-${sections.length}`,
      title: block.title,
      content,
      motion,
    });
  }

  if (actionItems) {
    sections.push({
      key: "action-items",
      title: "Action Items",
      content: actionItems,
      motion: emptyMotion(),
    });
  }

  const meetingDate = options.meetingDate || "";
  const appliesToMonth = meetingDate ? defaultAppliesToMonth(meetingDate) : "";
  const value = {
    meetingDate,
    slug: meetingDate ? meetingSlugFromDate(meetingDate) : "",
    published: false,
    chair: "",
    openedAt: "",
    openingNotes,
    sections,
    oldBusiness,
    newBusiness,
    adjournment: {
      movedBy: "",
      time: "",
      closingNotes: adjournmentNotes,
    },
    signOff: "",
    attachedReports: [],
    commitmentSchedules: commitmentSchedules.map((s) => ({
      ...s,
      appliesToMonth: s.appliesToMonth || appliesToMonth,
    })),
  };

  if (sections.length === 0 && !oldBusiness && !newBusiness && commitmentSchedules.length === 0) {
    return {
      ok: false,
      error: "Nothing usable was found. Use headings like “Treasurer’s Report”, “Old Business”, “New Business”.",
    };
  }

  return { ok: true, value, warnings };
}
