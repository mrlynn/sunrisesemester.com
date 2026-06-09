import connectDB from "@/lib/mongodb";

const REFLECTIONS_DB = "dailyreflections";
const REFLECTIONS_COLLECTION = "dailyThoughts";

const CALENDAR_MONTH_FILTER = { month: { $gte: 1, $lte: 12 } };

function reflectionsCollection(client) {
  return client.db(REFLECTIONS_DB).collection(REFLECTIONS_COLLECTION);
}

function dayFilter(month, day) {
  return {
    month: Number(month),
    day: Number(day),
    active: { $ne: false },
  };
}

/** Maps dailyThoughts (and legacy reflections) docs to the UI shape. */
export function normalizeReflectionDoc(doc) {
  if (!doc) return null;
  return {
    month: doc.month,
    day: doc.day,
    title: doc.title || "",
    quote: doc.quote || doc.thought || "",
    reference: doc.reference || "",
    comment: doc.comment || doc.challenge || "",
  };
}

export async function getReflection(month, day) {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  const conn = await connectDB();
  const client = conn.connection.getClient();
  const coll = reflectionsCollection(client);
  const doc = await coll.findOne(dayFilter(month, day));
  return normalizeReflectionDoc(doc);
}

export async function getTodaysReflection() {
  const now = new Date();
  return getReflection(now.getMonth() + 1, now.getDate());
}

function reflectionsCollection() {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  return connectDB().then((conn) => {
    const client = conn.connection.getClient();
    return client.db(REFLECTIONS_DB).collection(REFLECTIONS_COLLECTION);
  });
}

const REFLECTION_LIST_PROJECTION = {
  embedding: 0,
  cleanedAt: 0,
  commentCleaned: 0,
  fixedAt: 0,
  fixedFromCorrupt: 0,
};

/** Fetch daily reflections for each { month, day } in `days`. */
export async function getReflectionsForDays(days) {
  if (!days?.length || !process.env.MONGODB_URI) {
    return [];
  }
  const coll = await reflectionsCollection();
  if (!coll) return [];

  const or = days.map(({ month, day }) => ({
    month: Number(month),
    day: Number(day),
  }));

  const docs = await coll
    .find({ $or: or }, { projection: REFLECTION_LIST_PROJECTION })
    .toArray();

  const key = (m, d) => `${m},${d}`;
  const order = new Map(days.map((d, i) => [key(d.month, d.day), i]));
  docs.sort((a, b) => (order.get(key(a.month, a.day)) ?? 99) - (order.get(key(b.month, b.day)) ?? 99));
  return docs;
}

export async function listReflectionsByMonth(month) {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  const conn = await connectDB();
  const client = conn.connection.getClient();
  const coll = reflectionsCollection(client);
  const docs = await coll
    .find(
      { month: Number(month), active: { $ne: false } },
      { projection: { month: 1, day: 1, title: 1, reference: 1, thought: 1 } },
    )
    .sort({ day: 1 })
    .toArray();
  return docs.map((d) => ({
    month: d.month,
    day: d.day,
    title: d.title || "",
    reference: d.reference || "",
  }));
}

export async function listReflectionSummaries() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  const conn = await connectDB();
  const client = conn.connection.getClient();
  const coll = reflectionsCollection(client);
  const docs = await coll
    .find(
      { active: { $ne: false }, ...CALENDAR_MONTH_FILTER },
      { projection: { month: 1, day: 1, title: 1 } },
    )
    .sort({ month: 1, day: 1 })
    .toArray();
  return docs.map((d) => ({
    month: d.month,
    day: d.day,
    title: d.title || "",
  }));
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function shiftDay(month, day, delta) {
  const d = new Date(Date.UTC(2024, month - 1, day));
  d.setUTCDate(d.getUTCDate() + delta);
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export function nextDay(month, day) {
  return shiftDay(month, day, 1);
}

export function previousDay(month, day) {
  return shiftDay(month, day, -1);
}

export function formatMonthDay(month, day) {
  const name = MONTH_NAMES[month - 1] || "";
  return name ? `${name} ${day}` : "";
}

function isToday(month, day, now = new Date()) {
  return month === now.getMonth() + 1 && day === now.getDate();
}

export function serializeReflection(doc, now = new Date()) {
  const normalized = normalizeReflectionDoc(doc);
  if (!normalized) return null;
  const { month, day } = normalized;
  const prev = previousDay(month, day);
  const next = nextDay(month, day);
  return {
    title: normalized.title,
    quote: normalized.quote,
    reference: normalized.reference,
    comment: normalized.comment,
    month,
    day,
    dateLabel: formatMonthDay(month, day),
    isToday: isToday(month, day, now),
    prev: { month: prev.month, day: prev.day, label: formatMonthDay(prev.month, prev.day) },
    next: { month: next.month, day: next.day, label: formatMonthDay(next.month, next.day) },
  };
}
