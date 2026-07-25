/**
 * Stable keys that connect /meetings format buttons to SiteResource PDFs.
 */
export const MEETING_FORMAT_SLOTS = [
  { key: "weekday-mon", label: "Weekday — Monday" },
  { key: "weekday-tue", label: "Weekday — Tuesday" },
  { key: "weekday-wed", label: "Weekday — Wednesday" },
  { key: "weekday-thu", label: "Weekday — Thursday" },
  { key: "weekday-fri", label: "Weekday — Friday" },
  { key: "saturday-men", label: "Saturday — Men's meeting" },
  { key: "sunday", label: "Sunday morning" },
];

export const MEETING_FORMAT_KEYS = MEETING_FORMAT_SLOTS.map((s) => s.key);

export const MEETING_FORMATS_FALLBACK_HREF = "/resources#meeting-formats";

/** Title / filename heuristics when meetingKey is not set on a resource. */
const HEURISTICS = [
  { key: "weekday-mon", patterns: [/\bmonday\b/i, /\bmon(?:day)?\s*format\b/i, /\bformat.*\bmon\b/i] },
  { key: "weekday-tue", patterns: [/\btuesday\b/i, /\btue(?:sday)?\s*format\b/i, /\bformat.*\btue\b/i] },
  { key: "weekday-wed", patterns: [/\bwednesday\b/i, /\bwed(?:nesday)?\s*format\b/i, /\bformat.*\bwed\b/i] },
  { key: "weekday-thu", patterns: [/\bthursday\b/i, /\bthu(?:rs(?:day)?)?\s*format\b/i, /\bformat.*\bthu\b/i] },
  { key: "weekday-fri", patterns: [/\bfriday\b/i, /\bfri(?:day)?\s*format\b/i, /\bformat.*\bfri\b/i] },
  {
    key: "saturday-men",
    patterns: [/\bmen'?s\b/i, /\bsaturday\s*men/i, /\bmen\s*meeting\b/i],
  },
  { key: "sunday", patterns: [/\bsunday\b/i] },
];

function resourceHref(doc) {
  if (doc.kind === "pdf" && doc.file?.url) return doc.file.url;
  if (doc.kind === "link" && doc.externalUrl) return doc.externalUrl;
  return null;
}

function haystack(doc) {
  return [doc.title, doc.file?.name, doc.sourceNote, doc.description]
    .filter(Boolean)
    .join(" ");
}

function inferMeetingKey(doc) {
  const text = haystack(doc);
  if (!text) return null;
  for (const { key, patterns } of HEURISTICS) {
    if (patterns.some((re) => re.test(text))) {
      return key;
    }
  }
  return null;
}

/**
 * Build { [meetingKey]: url } from published meeting-format resources.
 * Explicit `meetingKey` wins; otherwise title/filename heuristics apply.
 */
export function buildMeetingFormatUrlMap(resources) {
  const map = {};
  const scored = [];

  for (const doc of resources || []) {
    const href = resourceHref(doc);
    if (!href) continue;
    const explicit =
      doc.meetingKey && MEETING_FORMAT_KEYS.includes(doc.meetingKey)
        ? doc.meetingKey
        : null;
    const inferred = explicit ? null : inferMeetingKey(doc);
    const key = explicit || inferred;
    if (!key) continue;
    scored.push({
      key,
      href,
      explicit: Boolean(explicit),
      sortOrder: Number(doc.sortOrder) || 0,
    });
  }

  scored.sort((a, b) => {
    if (a.explicit !== b.explicit) return a.explicit ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  for (const row of scored) {
    if (!map[row.key]) {
      map[row.key] = row.href;
    }
  }
  return map;
}

export function resolveMeetingFormatHref(key, formatUrls) {
  if (key && formatUrls?.[key]) return formatUrls[key];
  return MEETING_FORMATS_FALLBACK_HREF;
}
