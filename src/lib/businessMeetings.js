import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import {
  currentMonthKey,
  formatMeetingDateLabel,
  formatMonthLabel,
  meetingSlugFromDate,
  nextMonthKey,
  normalizeAppliesToMonth,
  resolveAppliesToMonth,
  slugifyMeetingSlug,
} from "@/lib/businessMeetingShared";

export {
  STANDARD_SCHEDULE_DAYS,
  DEFAULT_AGENDA_TITLES,
  COMMITMENT_TIMEZONE,
  meetingSlugFromDate,
  formatMeetingDateLabel,
  formatMonthLabel,
  currentMonthKey,
  nextMonthKey,
  defaultAppliesToMonth,
  normalizeAppliesToMonth,
  resolveAppliesToMonth,
  defaultAgendaSections,
  emptyScheduleRow,
  emptyCommitmentSchedule,
  parseBusinessMeetingPayload,
} from "@/lib/businessMeetingShared";

function trimStr(v, max = 80) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

export async function generateUniqueMeetingSlug({ desired, meetingDate, excludeId }) {
  await connectDB();
  const base = trimStr(desired) || meetingSlugFromDate(meetingDate) || "meeting";
  let slug = slugifyMeetingSlug(base) || "meeting";
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await BusinessMeeting.exists(query);
    if (!exists) return candidate;
    n += 1;
  }
}

function serializeDoc(doc) {
  return {
    _id: String(doc._id),
    meetingDate: doc.meetingDate,
    slug: doc.slug,
    published: Boolean(doc.published),
    chair: doc.chair || "",
    openedAt: doc.openedAt || "",
    openingNotes: doc.openingNotes || "",
    sections: Array.isArray(doc.sections) ? doc.sections : [],
    oldBusiness: doc.oldBusiness || "",
    newBusiness: doc.newBusiness || "",
    adjournment: doc.adjournment || { movedBy: "", time: "", closingNotes: "" },
    signOff: doc.signOff || "",
    attachedReports: Array.isArray(doc.attachedReports) ? doc.attachedReports : [],
    commitmentSchedules: Array.isArray(doc.commitmentSchedules)
      ? doc.commitmentSchedules
      : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listPublishedBusinessMeetings() {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const docs = await BusinessMeeting.find({ published: true })
    .sort({ meetingDate: -1 })
    .lean();
  return docs.map((d) => ({
    _id: String(d._id),
    slug: d.slug,
    meetingDate: d.meetingDate,
    label: formatMeetingDateLabel(d.meetingDate),
    chair: d.chair || "",
    published: true,
  }));
}

export async function getPublishedBusinessMeetingBySlug(slug) {
  if (!process.env.MONGODB_URI) return null;
  await connectDB();
  const doc = await BusinessMeeting.findOne({ slug, published: true }).lean();
  if (!doc) return null;
  return serializeDoc(doc);
}

export async function getBusinessMeetingById(id) {
  await connectDB();
  const doc = await BusinessMeeting.findById(id).lean();
  if (!doc) return null;
  return serializeDoc(doc);
}

function emptyCommitmentView(appliesToMonth = "") {
  const month = normalizeAppliesToMonth(appliesToMonth);
  return {
    schedules: [],
    source: null,
    appliesToMonth: month,
    monthLabel: formatMonthLabel(month),
  };
}

/**
 * Commitment tables that apply to a calendar month (YYYY-MM).
 * Business meetings set schedules for the following month; legacy docs without
 * appliesToMonth fall back to meeting month + 1.
 */
export async function getCommitmentSchedulesForMonth(monthKey) {
  const target = normalizeAppliesToMonth(monthKey) || currentMonthKey();
  if (!target) return emptyCommitmentView("");

  if (!process.env.MONGODB_URI) {
    return emptyCommitmentView(target);
  }

  await connectDB();
  const docs = await BusinessMeeting.find({
    published: true,
    commitmentSchedules: { $elemMatch: { columns: { $exists: true, $ne: [] } } },
  })
    .sort({ meetingDate: -1 })
    .limit(36)
    .select({ commitmentSchedules: 1, slug: 1, meetingDate: 1, _id: 1 })
    .lean();

  for (const doc of docs) {
    const schedules = (doc.commitmentSchedules || [])
      .filter((s) => Array.isArray(s.columns) && s.columns.length > 0)
      .map((s) => ({
        ...s,
        appliesToMonth: resolveAppliesToMonth(s, doc.meetingDate),
      }))
      .filter((s) => s.appliesToMonth === target);

    if (schedules.length > 0) {
      return {
        schedules,
        source: {
          _id: String(doc._id),
          slug: doc.slug,
          label: formatMeetingDateLabel(doc.meetingDate),
          meetingDate: doc.meetingDate,
        },
        appliesToMonth: target,
        monthLabel: formatMonthLabel(target),
      };
    }
  }

  return emptyCommitmentView(target);
}

/** Current + next month commitment views for public hub and admin pin. */
export async function getCommitmentScheduleViews(now = new Date()) {
  const currentKey = currentMonthKey(now);
  const nextKey = nextMonthKey(currentKey);
  const [current, next] = await Promise.all([
    getCommitmentSchedulesForMonth(currentKey),
    getCommitmentSchedulesForMonth(nextKey),
  ]);
  return { current, next };
}

/**
 * @deprecated Prefer getCommitmentSchedulesForMonth / getCommitmentScheduleViews.
 * Kept for any callers expecting the old shape; returns the current month.
 */
export async function getLatestPublishedCommitmentSchedules() {
  const view = await getCommitmentSchedulesForMonth(currentMonthKey());
  return {
    schedules: view.schedules,
    source: view.source,
    appliesToMonth: view.appliesToMonth,
    monthLabel: view.monthLabel,
  };
}
