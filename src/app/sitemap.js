import { SITE_URL } from "@/lib/siteUrl";
import { listPublishedStories } from "@/lib/stories";
import { listAllEvents } from "@/lib/events";
import { listPublishedBusinessMeetings } from "@/lib/businessMeetings";

// Reflections has thousands of potential /reflections/[month]/[day] pages
// (one per day, going back years) — listing the evergreen index here rather
// than every day keeps the sitemap focused and avoids diluting crawl budget.
const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/meetings", changeFrequency: "weekly", priority: 0.9 },
  { path: "/newcomer", changeFrequency: "monthly", priority: 0.9 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.7 },
  { path: "/literature", changeFrequency: "monthly", priority: 0.6 },
  { path: "/our-group", changeFrequency: "weekly", priority: 0.6 },
  { path: "/reflections", changeFrequency: "daily", priority: 0.6 },
  { path: "/events", changeFrequency: "daily", priority: 0.7 },
  { path: "/business-meetings", changeFrequency: "monthly", priority: 0.4 },
  { path: "/servant-roles", changeFrequency: "monthly", priority: 0.5 },
  { path: "/share-your-story", changeFrequency: "yearly", priority: 0.4 },
  { path: "/subscribe", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap() {
  const now = new Date();

  const [stories, events, businessMeetings] = await Promise.all([
    listPublishedStories().catch(() => []),
    listAllEvents().catch(() => []),
    listPublishedBusinessMeetings().catch(() => []),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const storyEntries = stories
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${SITE_URL}/stories/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const eventEntries = events
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${SITE_URL}/events/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  const businessMeetingEntries = businessMeetings
    .filter((m) => m.slug)
    .map((m) => ({
      url: `${SITE_URL}/business-meetings/${m.slug}`,
      lastModified: m.meetingDate ? new Date(m.meetingDate) : now,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

  return [...staticEntries, ...storyEntries, ...eventEntries, ...businessMeetingEntries];
}
