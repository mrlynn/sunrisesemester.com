import connectDB from "@/lib/mongodb";
import Anniversary from "@/models/Anniversary";

const DAY_MS = 86_400_000;

export async function listPublishedAnniversaries() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectDB();
  const docs = await Anniversary.find({ published: true })
    .sort({ sobrietyDate: 1 })
    .lean();
  return docs.map(serializeAnniversary);
}

export function serializeAnniversary(doc, now = new Date()) {
  if (!doc) return null;
  const sobrietyDate = new Date(doc.sobrietyDate);
  const years = computeYears(sobrietyDate, now);
  const nextAnniversary = computeNextAnniversary(sobrietyDate, now);
  const daysToNext = Math.round((nextAnniversary - now) / DAY_MS);
  return {
    _id: String(doc._id),
    name: doc.name,
    note: doc.note || "",
    sobrietyDateIso: sobrietyDate.toISOString(),
    sobrietyDateLabel: formatMonthDayYear(sobrietyDate),
    years,
    nextAnniversaryIso: nextAnniversary.toISOString(),
    nextAnniversaryLabel: formatMonthDayYear(nextAnniversary),
    daysToNext,
    isWithinWeek: daysToNext >= 0 && daysToNext <= 7,
  };
}

function computeYears(start, now) {
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - start.getUTCMonth();
  const dayDiff = now.getUTCDate() - start.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }
  return Math.max(0, years);
}

function computeNextAnniversary(start, now) {
  const thisYear = new Date(
    Date.UTC(now.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  if (thisYear.getTime() >= startOfDay(now).getTime()) {
    return thisYear;
  }
  return new Date(
    Date.UTC(now.getUTCFullYear() + 1, start.getUTCMonth(), start.getUTCDate()),
  );
}

function startOfDay(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
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

function formatMonthDayYear(d) {
  const m = MONTH_NAMES[d.getUTCMonth()] || "";
  return `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
