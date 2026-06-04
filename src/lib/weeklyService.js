import connectDB from "@/lib/mongodb";
import WeeklyServiceSchedule from "@/models/WeeklyServiceSchedule";
import {
  defaultWeeklyServiceDays,
  parseWeeklyServicePayload,
} from "@/lib/weeklyServiceShared";

export {
  WEEKLY_SERVICE_DAYS,
  defaultWeeklyServiceDays,
  parseWeeklyServicePayload,
} from "@/lib/weeklyServiceShared";

function serialize(doc) {
  const days =
    Array.isArray(doc.days) && doc.days.length > 0
      ? doc.days.map((d) => ({
          key: d.key,
          label: d.label,
          chair: d.chair || "",
          sherpa: d.sherpa || "",
          openChair: Boolean(d.openChair),
        }))
      : defaultWeeklyServiceDays();

  return {
    key: doc.key || "current",
    notes: doc.notes || "",
    days,
    updatedAt: doc.updatedAt,
  };
}

export async function getWeeklyServiceSchedule() {
  if (!process.env.MONGODB_URI) {
    return { key: "current", notes: "", days: defaultWeeklyServiceDays(), updatedAt: null };
  }
  await connectDB();
  const doc = await WeeklyServiceSchedule.findOne({ key: "current" }).lean();
  if (!doc) {
    return { key: "current", notes: "", days: defaultWeeklyServiceDays(), updatedAt: null };
  }
  return serialize(doc);
}

export async function saveWeeklyServiceSchedule(raw) {
  const parsed = parseWeeklyServicePayload(raw);
  await connectDB();
  const doc = await WeeklyServiceSchedule.findOneAndUpdate(
    { key: "current" },
    { $set: parsed, $setOnInsert: { key: "current" } },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return serialize(doc);
}
