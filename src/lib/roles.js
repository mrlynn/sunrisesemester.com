export const ROLES = ["admin", "editor", "secretary"];

export const ROLE_LABELS = {
  admin: "Administrator",
  editor: "Editor",
  secretary: "Secretary",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Full access, including managing users.",
  editor: "Manage site content (stories, events, puzzles, landing, etc.).",
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

export const ADMIN_NAV = [
  { href: "/admin/landing", label: "Landing", roles: ["admin", "editor"] },
  { href: "/admin/stories", label: "Stories", roles: ["admin", "editor"] },
  { href: "/admin/anniversaries", label: "Anniversaries", roles: ["admin", "editor"] },
  { href: "/admin/events", label: "Events", roles: ["admin", "editor"] },
  { href: "/admin/puzzles", label: "Puzzles", roles: ["admin", "editor"] },
  { href: "/admin/crossword-bank", label: "Crossword bank", roles: ["admin", "editor"] },
  { href: "/admin/service-roles", label: "Service", roles: ["admin", "editor"] },
  { href: "/admin/business-meetings", label: "Minutes", roles: ["admin", "editor", "secretary"] },
  { href: "/admin/weekly-service", label: "Weekly service", roles: ["admin", "editor", "secretary"] },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
];

export function navItemsForRole(role) {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}
