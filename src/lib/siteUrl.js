/**
 * Canonical site origin, used for metadataBase, sitemap/robots URLs, and
 * structured data. Single source of truth so it can't drift between files.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.sunrisesemester.com"
).replace(/\/+$/, "");
