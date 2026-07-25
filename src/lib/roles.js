export const ROLES = ["admin", "editor", "secretary"];

export const ROLE_LABELS = {
  admin: "Administrator",
  editor: "Editor",
  secretary: "Secretary",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Full access, including managing users.",
  editor: "Manage site content (stories, events, landing, etc.).",
  secretary: "Business meeting minutes only.",
};

export function isRole(value) {
  return ROLES.includes(value);
}

export function canManageUsers(role) {
  return role === "admin";
}

export function canEditContent(role) {
  return role === "admin" || role === "editor";
}

export function canEditMinutes(role) {
  return role === "admin" || role === "editor" || role === "secretary";
}

/** Default page after sign-in for each role. */
export function defaultAdminPath(role) {
  if (role === "secretary") return "/admin/business-meetings";
  return "/admin/landing";
}

/**
 * Whether a signed-in role may open an /admin/* path (pages only).
 * API routes enforce permissions separately via assertAuth.
 */
export function canAccessAdminPath(pathname, role) {
  if (!pathname.startsWith("/admin")) return false;
  if (pathname === "/admin") return true;

  if (pathname.startsWith("/admin/users")) {
    return canManageUsers(role);
  }
  if (
    pathname.startsWith("/admin/business-meetings") ||
    pathname.startsWith("/admin/weekly-service")
  ) {
    return canEditMinutes(role);
  }

  return canEditContent(role);
}

/** Flat list — prefer navGroupsForRole() for the admin shell UI. */
export const ADMIN_NAV = [
  {
    href: "/admin/landing",
    label: "Landing",
    group: "content",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/stories",
    label: "Stories",
    group: "content",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/resources",
    label: "Resources",
    group: "content",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/events",
    label: "Events",
    group: "content",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/anniversaries",
    label: "Anniversaries",
    group: "content",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/members",
    label: "Members",
    group: "group",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/service-roles",
    label: "Service roles",
    group: "group",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/weekly-service",
    label: "Weekly service",
    group: "group",
    roles: ["admin", "editor", "secretary"],
  },
  {
    href: "/admin/business-meetings",
    label: "Minutes",
    group: "group",
    roles: ["admin", "editor", "secretary"],
  },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    group: "outreach",
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/users",
    label: "Users",
    group: "system",
    roles: ["admin"],
  },
];

export const ADMIN_NAV_GROUPS = [
  { id: "content", label: "Content" },
  { id: "group", label: "Group life" },
  { id: "outreach", label: "Outreach" },
  { id: "system", label: "System" },
];

export function navItemsForRole(role) {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

/** Grouped nav for the admin sidebar, filtered by role. Omits empty groups. */
export function navGroupsForRole(role) {
  const items = navItemsForRole(role);
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.group === group.id),
  })).filter((group) => group.items.length > 0);
}
