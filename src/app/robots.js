import { SITE_URL } from "@/lib/siteUrl";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/member/",
        "/subscribe/confirm",
        "/unsubscribe",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
