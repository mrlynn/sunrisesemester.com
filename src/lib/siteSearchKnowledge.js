import { meetings, ZOOM_ID, ZOOM_URL } from "@/lib/meetingsSchedule";
import { listPublishedStories } from "@/lib/stories";
import { listPublishedSiteResources } from "@/lib/siteResources";
import { listUpcomingEvents } from "@/lib/events";
import { listPublishedServiceRoles } from "@/lib/serviceRoles";
import { listPublishedBusinessMeetings } from "@/lib/businessMeetings";
import connectDB from "@/lib/mongodb";

/**
 * Static catalog of public pages + curated AA / group facts.
 * Dynamic content (stories, resources, events) is merged at request time.
 */
export const SITE_PAGE_DOCS = [
  {
    id: "page-home",
    type: "page",
    title: "Home",
    href: "/",
    keywords: "sunrise semester home welcome group aa",
    body: "Sunrise Semester is an online Alcoholics Anonymous (AA) group. The site shares meeting times, newcomer guidance, stories, literature, resources, and group service information.",
  },
  {
    id: "page-meetings",
    type: "page",
    title: "Meetings",
    href: "/meetings",
    keywords: "zoom schedule time when join meeting weekday saturday sunday men women",
    body: `Weekly Zoom meetings (Eastern time). Zoom ID ${ZOOM_ID}. Join: ${ZOOM_URL}. Weekday Daily Sunrise Mon–Fri 7:15–8:15 AM. Saturday Men's Meeting 8:00–9:15 AM. Saturday Women's Meeting 9:30 AM. Sunday Morning 8:00–9:00 AM.`,
  },
  {
    id: "page-newcomer",
    type: "page",
    title: "Newcomer welcome",
    href: "/newcomer",
    keywords: "new first time beginner visitor what to expect muted camera self test",
    body: "Guidance for first-time visitors: you can stay muted and camera off; there is no fee or pledge; the only requirement for AA membership is a desire to stop drinking. Explains what happens in a meeting and how to share if you want to.",
  },
  {
    id: "page-stories",
    type: "page",
    title: "Stories",
    href: "/stories",
    keywords: "experience strength hope share recovery story",
    body: "Personal recovery stories shared by members of the group.",
  },
  {
    id: "page-share-story",
    type: "page",
    title: "Share your story",
    href: "/share-your-story",
    keywords: "submit write contribute testimony",
    body: "Form for members to submit a recovery story for editorial review.",
  },
  {
    id: "page-resources",
    type: "page",
    title: "Resources",
    href: "/resources",
    keywords: "pdf links formats downloads helpful materials",
    body: "Published group resources: links and PDFs including meeting formats and other helpful materials.",
  },
  {
    id: "page-literature",
    type: "page",
    title: "Literature",
    href: "/literature",
    keywords: "big book how it works promises steps readings aa.org",
    body: "Key AA literature used in Sunrise Semester meetings, including How It Works (Big Book Chapter 5) and The Promises, with links to aa.org PDFs.",
  },
  {
    id: "page-reflections",
    type: "page",
    title: "Daily reflections",
    href: "/reflections",
    keywords: "daily reflection meditation reading archive",
    body: "Daily Reflections archive for reading and reflection.",
  },
  {
    id: "page-events",
    type: "page",
    title: "Events",
    href: "/events",
    keywords: "special gathering anniversary workshop fellowship",
    body: "Upcoming group events beyond the regular weekly meeting schedule.",
  },
  {
    id: "page-our-group",
    type: "page",
    title: "Our group",
    href: "/our-group",
    keywords: "about us who we are anniversaries fellowship",
    body: "About Sunrise Semester as a group, including public sobriety anniversaries when members choose to share them.",
  },
  {
    id: "page-group-service",
    type: "page",
    title: "Group service / business meetings",
    href: "/business-meetings",
    keywords: "business meeting minutes group conscience service agenda",
    body: "Public archive of group business meeting minutes and group conscience notes.",
  },
  {
    id: "page-servant-roles",
    type: "page",
    title: "Servant roles",
    href: "/servant-roles",
    keywords: "chair secretary treasurer sherpa service position commitment",
    body: "Group service positions (servant roles) and who currently holds them.",
  },
  {
    id: "page-sherpa",
    type: "page",
    title: "Sherpa guide",
    href: "/sherpa-guide",
    keywords: "host zoom host key waiting room disruptors meeting leader training",
    body: "Guide for Sherpas who host Sunrise Semester Zoom meetings: claiming host, timeline, host tools, disruptors, and meeting formats.",
  },
  {
    id: "page-report",
    type: "page",
    title: "Report a concern",
    href: "/report",
    keywords: "safety concern anonymous report problem abuse",
    body: "Anonymous form to report a concern to trusted servants. For safety or meeting issues that need attention.",
  },
  {
    id: "page-subscribe",
    type: "page",
    title: "Email updates",
    href: "/subscribe",
    keywords: "newsletter email list updates opt in",
    body: "Optional email updates from the group (double opt-in).",
  },
  {
    id: "page-member",
    type: "page",
    title: "Member account",
    href: "/member",
    keywords: "login register profile anniversary account optional",
    body: "Optional member accounts for profile settings and public anniversary preferences. Not required to attend meetings.",
  },
];

export const AA_GROUP_FACTS = [
  {
    id: "aa-basics",
    type: "topic",
    title: "What is AA?",
    href: "/newcomer",
    keywords: "alcoholics anonymous aa what is program recovery",
    body: "Alcoholics Anonymous is a fellowship of people who share their experience, strength, and hope to solve their common problem and help others recover from alcoholism. AA is not allied with any sect, denomination, politics, organization, or institution. There are no dues or fees; AA is self-supporting through member contributions. The only requirement for membership is a desire to stop drinking.",
  },
  {
    id: "aa-steps",
    type: "topic",
    title: "The Twelve Steps (overview)",
    href: "/literature",
    keywords: "twelve 12 steps how it works program",
    body: "AA's Twelve Steps are a suggested program of recovery described in the book Alcoholics Anonymous (the Big Book). Sunrise Semester meetings often open with How It Works (Chapter 5), which introduces the Steps. Direct people to /literature and aa.org for the full text rather than quoting copyrighted literature at length.",
  },
  {
    id: "aa-traditions",
    type: "topic",
    title: "Anonymity and traditions",
    href: "/our-group",
    keywords: "anonymity tradition privacy last name public media",
    body: "AA traditions emphasize anonymity at the level of press, radio, films, and similar public media. On this site and in chat, prefer first names only. Do not press visitors for personal identifying details. What is said in meetings is treated with respect and confidentiality within the fellowship's customs.",
  },
  {
    id: "group-identity",
    type: "topic",
    title: "About Sunrise Semester",
    href: "/our-group",
    keywords: "online zoom eastern morning sunrise semester group",
    body: "Sunrise Semester is an online AA group meeting primarily in the morning Eastern time over Zoom. It welcomes newcomers and long-time members. The website helps people find meetings, literature, resources, stories, events, and group service information.",
  },
  {
    id: "crisis-boundary",
    type: "topic",
    title: "When this site cannot help",
    href: "/newcomer",
    keywords: "emergency crisis medical detox suicide help hotline",
    body: "This assistant and website are not medical care, crisis counseling, or a substitute for emergency services. For immediate danger, contact local emergency services. For detox or medical questions, consult a qualified professional. Encourage attending an AA meeting and connecting with the fellowship for recovery support.",
  },
];

function meetingDocs() {
  return meetings.map((m) => ({
    id: `meeting-${m.id}`,
    type: "meeting",
    title: `${m.title} (${m.label})`,
    href: "/meetings",
    keywords: `${m.title} ${m.label} ${m.shortLabel} ${(m.days || []).join(" ")} zoom schedule`,
    body: `${m.blurb} Time: ${m.time} Eastern. Days: ${(m.days || []).join(", ")}. Join Zoom ID ${ZOOM_ID}.`,
  }));
}

function storyDocs(stories) {
  return (stories || []).slice(0, 40).map((s) => ({
    id: `story-${s.slug}`,
    type: "story",
    title: s.title,
    href: `/stories/${s.slug}`,
    keywords: `story ${s.author || ""} recovery`,
    body: String(s.excerpt || "").slice(0, 400),
  }));
}

function resourceDocs(resources) {
  return (resources || []).slice(0, 60).map((r) => {
    const href =
      r.kind === "link" && r.externalUrl
        ? r.externalUrl
        : r.kind === "pdf" && r.file?.url
          ? r.file.url
          : "/resources";
    return {
      id: `resource-${String(r._id)}`,
      type: "resource",
      title: r.title,
      href,
      keywords: `resource ${r.category || ""} ${r.kind || ""} ${r.meetingKey || ""}`,
      body: String(r.description || "").slice(0, 400),
    };
  });
}

function eventDocs(events) {
  return (events || []).slice(0, 20).map((e) => ({
    id: `event-${e.slug}`,
    type: "event",
    title: e.title,
    href: `/events/${e.slug}`,
    keywords: `event ${e.location || ""}`,
    body: `${String(e.body || "").slice(0, 280)} Date: ${
      e.eventDate ? new Date(e.eventDate).toISOString().slice(0, 10) : "TBA"
    }.${e.location ? ` Location: ${e.location}.` : ""}`,
  }));
}

function roleDocs(roles) {
  return (roles || []).map((r) => ({
    id: `role-${r._id}`,
    type: "role",
    title: r.title,
    href: "/servant-roles",
    keywords: `servant role service ${r.title} ${r.holder || ""}`,
    body: `${r.description || ""} Currently held by: ${r.holder || "see page"}. ${r.termLabel || ""}`.slice(
      0,
      400,
    ),
  }));
}

function businessMeetingDocs(docs) {
  return (docs || []).slice(0, 24).map((d) => ({
    id: `biz-${d.slug}`,
    type: "business-meeting",
    title: d.label || `Business meeting ${d.slug}`,
    href: `/business-meetings/${d.slug}`,
    keywords: `business meeting minutes ${d.slug} ${d.chair || ""}`,
    body: `Published group business meeting minutes${d.chair ? ` (chair: ${d.chair})` : ""}.`,
  }));
}

/**
 * Load the full searchable corpus for this request.
 */
export async function loadSiteSearchCorpus() {
  let stories = [];
  let resources = [];
  let events = [];
  let roles = [];
  let businessMeetings = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      [stories, resources, events, roles, businessMeetings] = await Promise.all([
        listPublishedStories(),
        listPublishedSiteResources(),
        listUpcomingEvents(),
        listPublishedServiceRoles(),
        listPublishedBusinessMeetings(),
      ]);
    } catch (err) {
      console.error("site search corpus: partial load failed", err);
    }
  }

  return [
    ...SITE_PAGE_DOCS,
    ...AA_GROUP_FACTS,
    ...meetingDocs(),
    ...storyDocs(stories),
    ...resourceDocs(resources),
    ...eventDocs(events),
    ...roleDocs(roles),
    ...businessMeetingDocs(businessMeetings),
  ];
}
