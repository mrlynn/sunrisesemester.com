import { del } from "@vercel/blob";
import SiteResource, {
  SITE_RESOURCE_CATEGORIES,
  SITE_RESOURCE_KINDS,
  SITE_RESOURCE_MEETING_KEYS,
} from "@/models/SiteResource";
import { buildMeetingFormatUrlMap } from "@/lib/meetingFormats";

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 500;
const MAX_URL = 2000;
const MAX_SOURCE_NOTE = 500;
const MAX_FILE_NAME = 260;

function isHttpOrPathUrl(value) {
  const v = String(value ?? "").trim();
  if (!v) return false;
  if (v.startsWith("/")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeFile(file) {
  if (!file || typeof file !== "object") return null;
  const url = String(file.url ?? "").trim().slice(0, MAX_URL);
  const pathname = String(file.pathname ?? "").trim().slice(0, MAX_URL);
  if (!url || !pathname) return null;
  return {
    url,
    pathname,
    name: String(file.name ?? "").slice(0, MAX_FILE_NAME),
    size: Math.max(0, Number(file.size) || 0),
    contentType: String(file.contentType ?? "application/pdf").slice(0, 120),
  };
}

/**
 * Sanitize create/update payload. Returns { data } or { error }.
 */
export function sanitizeSiteResourceInput(body, { partial = false } = {}) {
  const raw = body && typeof body === "object" ? body : {};
  const data = {};

  if (!partial || "title" in raw) {
    const title = String(raw.title ?? "").trim().slice(0, MAX_TITLE);
    if (!title) {
      return { error: "Title is required." };
    }
    data.title = title;
  }

  if (!partial || "description" in raw) {
    data.description = String(raw.description ?? "").trim().slice(0, MAX_DESCRIPTION);
  }

  if (!partial || "category" in raw) {
    const category = String(raw.category ?? "link");
    if (!SITE_RESOURCE_CATEGORIES.includes(category)) {
      return { error: "Invalid category." };
    }
    data.category = category;
  }

  if (!partial || "kind" in raw) {
    const kind = String(raw.kind ?? "");
    if (!SITE_RESOURCE_KINDS.includes(kind)) {
      return { error: "Kind must be pdf or link." };
    }
    data.kind = kind;
  }

  if (!partial || "externalUrl" in raw) {
    data.externalUrl = String(raw.externalUrl ?? "").trim().slice(0, MAX_URL);
  }

  if (!partial || "file" in raw) {
    if (raw.file === null) {
      data.file = undefined;
    } else if (raw.file !== undefined) {
      const file = sanitizeFile(raw.file);
      if (!file) {
        return { error: "PDF file metadata is incomplete." };
      }
      data.file = file;
    }
  }

  if (!partial || "sourceNote" in raw) {
    data.sourceNote = String(raw.sourceNote ?? "").trim().slice(0, MAX_SOURCE_NOTE);
  }

  if (!partial || "meetingKey" in raw) {
    const meetingKey = String(raw.meetingKey ?? "").trim();
    if (meetingKey && !SITE_RESOURCE_MEETING_KEYS.includes(meetingKey)) {
      return { error: "Invalid meeting format key." };
    }
    data.meetingKey = meetingKey;
  }

  if (!partial || "sortOrder" in raw) {
    const n = Number(raw.sortOrder);
    data.sortOrder = Number.isFinite(n) ? Math.trunc(n) : 0;
  }

  if (!partial || "published" in raw) {
    data.published = Boolean(raw.published);
  }

  const kind = data.kind;
  if (kind === "link") {
    const url = data.externalUrl ?? "";
    if (!partial || "externalUrl" in raw || "kind" in raw) {
      if (!isHttpOrPathUrl(url)) {
        return { error: "A valid http(s) URL or site path is required for links." };
      }
    }
  }

  if (kind === "pdf") {
    if (!partial || "file" in raw || "kind" in raw) {
      if (!data.file && !partial) {
        return { error: "Upload a PDF before saving." };
      }
      if (partial && "file" in raw && !data.file && raw.file !== undefined) {
        return { error: "PDF file metadata is incomplete." };
      }
    }
  }

  return { data };
}

/** Validate a full document after merge (create or update). */
export function validateSiteResourceDoc(doc) {
  if (!doc?.title) {
    return "Title is required.";
  }
  if (!SITE_RESOURCE_KINDS.includes(doc.kind)) {
    return "Kind must be pdf or link.";
  }
  if (!SITE_RESOURCE_CATEGORIES.includes(doc.category)) {
    return "Invalid category.";
  }
  if (doc.kind === "link") {
    if (!isHttpOrPathUrl(doc.externalUrl)) {
      return "A valid http(s) URL or site path is required for links.";
    }
  }
  if (doc.kind === "pdf") {
    if (!doc.file?.url || !doc.file?.pathname) {
      return "Upload a PDF before saving.";
    }
  }
  return null;
}

export async function listPublishedSiteResources() {
  return SiteResource.find({ published: true })
    .sort({ sortOrder: 1, title: 1 })
    .select({
      title: 1,
      description: 1,
      category: 1,
      kind: 1,
      externalUrl: 1,
      file: 1,
      meetingKey: 1,
      sortOrder: 1,
    })
    .lean();
}

/** Published meeting-format resources → map of meetingKey → URL for /meetings. */
export async function getMeetingFormatUrlMap() {
  const docs = await SiteResource.find({
    published: true,
    category: "meeting-format",
  })
    .sort({ sortOrder: 1, title: 1 })
    .select({
      title: 1,
      description: 1,
      kind: 1,
      externalUrl: 1,
      file: 1,
      sourceNote: 1,
      meetingKey: 1,
      sortOrder: 1,
    })
    .lean();
  return buildMeetingFormatUrlMap(docs);
}

/** Best-effort delete of a Blob object by pathname or URL. */
export async function deleteResourceBlob(file) {
  const target = file?.pathname || file?.url;
  if (!target) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("BLOB_READ_WRITE_TOKEN unset; skipped blob delete:", target);
    return;
  }
  try {
    await del(target);
  } catch (err) {
    console.warn("Failed to delete blob:", target, err?.message || err);
  }
}

export function isInternalSitePath(url) {
  return typeof url === "string" && url.startsWith("/");
}
