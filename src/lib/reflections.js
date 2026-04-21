import connectDB from "@/lib/mongodb";

const REFLECTIONS_DB = "dailyreflections";
const REFLECTIONS_COLLECTION = "reflections";

export async function getReflection(month, day) {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  const conn = await connectDB();
  const client = conn.connection.getClient();
  const coll = client.db(REFLECTIONS_DB).collection(REFLECTIONS_COLLECTION);
  const doc = await coll.findOne(
    { month: Number(month), day: Number(day) },
    {
      projection: {
        embedding: 0,
        cleanedAt: 0,
        commentCleaned: 0,
        fixedAt: 0,
        fixedFromCorrupt: 0,
      },
    },
  );
  return doc;
}

export async function getTodaysReflection() {
  const now = new Date();
  return getReflection(now.getMonth() + 1, now.getDate());
}

export async function listReflectionsByMonth(month) {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  const conn = await connectDB();
  const client = conn.connection.getClient();
  const coll = client.db(REFLECTIONS_DB).collection(REFLECTIONS_COLLECTION);
  const docs = await coll
    .find(
      { month: Number(month) },
      { projection: { month: 1, day: 1, title: 1, reference: 1 } },
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
  const coll = client.db(REFLECTIONS_DB).collection(REFLECTIONS_COLLECTION);
  const docs = await coll
    .find({}, { projection: { month: 1, day: 1, title: 1 } })
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
  if (!doc) return null;
  const month = doc.month;
  const day = doc.day;
  const prev = previousDay(month, day);
  const next = nextDay(month, day);
  return {
    title: doc.title || "",
    quote: doc.quote || "",
    reference: doc.reference || "",
    comment: doc.comment || "",
    month,
    day,
    dateLabel: formatMonthDay(month, day),
    isToday: isToday(month, day, now),
    prev: { month: prev.month, day: prev.day, label: formatMonthDay(prev.month, prev.day) },
    next: { month: next.month, day: next.day, label: formatMonthDay(next.month, next.day) },
  };
}
