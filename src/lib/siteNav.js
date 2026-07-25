/**
 * Public site navigation — primary bar stays short; secondary lives under More / mobile groups.
 */

export const SITE_NAV_PRIMARY = [
  { href: "/meetings", label: "Meetings", emphasis: true },
  { href: "/newcomer", label: "Newcomer" },
  { href: "/stories", label: "Stories" },
  { href: "/resources", label: "Resources" },
  { href: "/our-group", label: "Our group" },
];

export const SITE_NAV_MORE = [
  { href: "/reflections", label: "Reflections" },
  { href: "/literature", label: "Literature" },
  { href: "/events", label: "Events" },
  { href: "/business-meetings", label: "Group service" },
];

/** Mobile drawer / footer-oriented groups */
export const SITE_NAV_GROUPS = [
  {
    id: "attend",
    label: "Attend",
    items: [
      { href: "/meetings", label: "Meetings" },
      { href: "/newcomer", label: "Newcomer" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    id: "read",
    label: "Read & reflect",
    items: [
      { href: "/stories", label: "Stories" },
      { href: "/reflections", label: "Reflections" },
      { href: "/literature", label: "Literature" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    id: "group",
    label: "The group",
    items: [
      { href: "/our-group", label: "Our group" },
      { href: "/business-meetings", label: "Group service" },
      { href: "/subscribe", label: "Email updates" },
    ],
  },
];

export function isSiteNavActive(pathname, href) {
  if (!pathname || !href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
