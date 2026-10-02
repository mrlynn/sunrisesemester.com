/**
 * /admin paths that must be reachable without a valid session — the sign-in
 * page itself, plus the forgot/reset-password flow (which exists precisely
 * for people who don't currently have a valid session). Shared between
 * middleware.js (route gating) and AdminShell.js (chrome suppression) so the
 * two can't drift apart.
 */
export const ADMIN_PUBLIC_PATHS = new Set([
  "/admin",
  "/admin/forgot-password",
  "/admin/reset-password",
]);
