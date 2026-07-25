import connectDB from "@/lib/mongodb";
import SiteAnnouncement from "@/models/SiteAnnouncement";

export const ANNOUNCEMENT_FALLBACK = {
  key: "main",
  enabled: false,
  message: "",
  href: "",
  linkLabel: "Read more",
  dismissible: true,
  startsAt: null,
  endsAt: null,
  updatedAt: null,
};

function parseDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Whether the announcement should show on the public site right now. */
export function isAnnouncementActive(doc, now = new Date()) {
  if (!doc?.enabled) return false;
  const message = String(doc.message ?? "").trim();
  const href = String(doc.href ?? "").trim();
  if (!message || !href) return false;

  const startsAt = parseDate(doc.startsAt);
  const endsAt = parseDate(doc.endsAt);
  if (startsAt && now < startsAt) return false;
  if (endsAt && now > endsAt) return false;
  return true;
}

export function serializeAnnouncement(doc) {
  if (!doc) return { ...ANNOUNCEMENT_FALLBACK };
  return {
    key: doc.key || "main",
    enabled: Boolean(doc.enabled),
    message: String(doc.message ?? ""),
    href: String(doc.href ?? ""),
    linkLabel: String(doc.linkLabel ?? "Read more") || "Read more",
    dismissible: doc.dismissible !== false,
    startsAt: doc.startsAt ? new Date(doc.startsAt).toISOString() : null,
    endsAt: doc.endsAt ? new Date(doc.endsAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

/** Full announcement document for the admin editor (always returns a shape). */
export async function getAnnouncement() {
  if (!process.env.MONGODB_URI) {
    return { ...ANNOUNCEMENT_FALLBACK };
  }
  try {
    await connectDB();
    let doc = await SiteAnnouncement.findOne({ key: "main" }).lean();
    if (!doc) {
      doc = (
        await SiteAnnouncement.create({
          key: "main",
          ...ANNOUNCEMENT_FALLBACK,
        })
      ).toObject();
    }
    return serializeAnnouncement(doc);
  } catch {
    return { ...ANNOUNCEMENT_FALLBACK };
  }
}

/** Active announcement for the public site, or null if none. */
export async function getActiveAnnouncement() {
  const doc = await getAnnouncement();
  if (!isAnnouncementActive(doc)) return null;
  return {
    message: doc.message.trim(),
    href: doc.href.trim(),
    linkLabel: doc.linkLabel.trim() || "Read more",
    dismissible: doc.dismissible,
    updatedAt: doc.updatedAt,
  };
}
