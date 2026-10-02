import { SITE_URL } from "@/lib/siteUrl";

const ORGANIZER = {
  "@type": "Organization",
  name: "Sunrise Semester",
  url: SITE_URL,
};

const SCHEMA_DAYS = {
  Mon: "https://schema.org/Monday",
  Tue: "https://schema.org/Tuesday",
  Wed: "https://schema.org/Wednesday",
  Thu: "https://schema.org/Thursday",
  Fri: "https://schema.org/Friday",
  Sat: "https://schema.org/Saturday",
  Sun: "https://schema.org/Sunday",
};

/**
 * Build schema.org Event JSON-LD for each entry in the recurring weekly
 * meeting schedule (src/lib/meetingsSchedule.js). Each meeting is modeled as
 * a single recurring Event with an eventSchedule, rather than one Event per
 * future occurrence — simplest correct representation for a standing weekly
 * meeting, though note Google's Event rich-result eligibility historically
 * favors concrete per-occurrence startDate over recurring schedules.
 */
export function buildMeetingsScheduleJsonLd(meetings, zoomUrl) {
  return meetings.map((meeting) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${meeting.title} — Sunrise Semester AA Meeting`,
    description: meeting.blurb,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: zoomUrl,
    },
    organizer: ORGANIZER,
    eventSchedule: {
      "@type": "Schedule",
      byDay: meeting.days.map((d) => SCHEMA_DAYS[d]).filter(Boolean),
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      scheduleTimezone: "America/New_York",
      repeatFrequency: "P1W",
    },
  }));
}

/** Very light markdown/whitespace cleanup for use as a JSON-LD description. */
function toPlainDescription(markdown, fallback) {
  const text = String(markdown || "")
    .replace(/[#*_`>[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return fallback;
  return text.length > 300 ? `${text.slice(0, 297)}...` : text;
}

/**
 * Build schema.org Event JSON-LD for a single /events/[slug] entry.
 * `location` is free text in the CMS (an address, "Zoom", a meeting link, or
 * blank), so we infer attendance mode: a URL means online, non-empty text
 * means an in-person Place, and blank falls back to the event's own page as
 * a virtual location so the markup stays valid either way.
 */
export function buildEventJsonLd(event) {
  const pageUrl = `${SITE_URL}/events/${event.slug}`;
  const location = String(event.location || "").trim();
  const isUrl = /^https?:\/\//i.test(location);

  const eventAttendanceMode = isUrl || !location
    ? "https://schema.org/OnlineEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode";

  const eventLocation = isUrl
    ? { "@type": "VirtualLocation", url: location }
    : location
      ? { "@type": "Place", name: location }
      : { "@type": "VirtualLocation", url: pageUrl };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    url: pageUrl,
    startDate: event.eventDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode,
    location: eventLocation,
    description: toPlainDescription(event.body, `${event.title} — Sunrise Semester event.`),
    ...(event.flyerImage ? { image: [event.flyerImage] } : {}),
    organizer: ORGANIZER,
  };
}

/** Render one or more JSON-LD objects as script tags in a server component. */
export function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        // eslint-disable-next-line react/no-danger
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
