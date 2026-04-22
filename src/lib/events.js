import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function listUpcomingEvents() {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  return Event.find({ published: true, eventDate: { $gte: new Date() } })
    .sort({ eventDate: 1 })
    .lean();
}

export async function listAllEvents() {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  return Event.find({ published: true }).sort({ eventDate: 1 }).lean();
}
