import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import Rsvp from "@/models/Rsvp";
import EventContribution from "@/models/EventContribution";
import Ride from "@/models/Ride";

export function slugifyEvent(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueEventSlug({ desired, title, excludeId } = {}) {
  await connectDB();
  const base = slugifyEvent(desired) || slugifyEvent(title) || "event";
  let candidate = base;
  let n = 2;
  // Append a numeric suffix until the slug is unique among other events.
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Event.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

async function attachRsvpCounts(events) {
  if (events.length === 0) return events;
  const ids = events
    .filter((ev) => ev.rsvpEnabled)
    .map((ev) => ev._id);
  if (ids.length === 0) {
    return events.map((ev) => ({ ...ev, rsvpCount: 0 }));
  }
  const agg = await Rsvp.aggregate([
    { $match: { event: { $in: ids } } },
    { $group: { _id: "$event", total: { $sum: "$partySize" } } },
  ]);
  const counts = new Map(agg.map((row) => [String(row._id), row.total]));
  return events.map((ev) => ({
    ...ev,
    rsvpCount: counts.get(String(ev._id)) ?? 0,
  }));
}

export async function listUpcomingEvents() {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const events = await Event.find({ published: true, eventDate: { $gte: new Date() } })
    .select({ "flyer.data": 0 })
    .sort({ eventDate: 1 })
    .lean();
  return attachRsvpCounts(events);
}

export async function listAllEvents() {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const events = await Event.find({ published: true })
    .select({ "flyer.data": 0 })
    .sort({ eventDate: 1 })
    .lean();
  return attachRsvpCounts(events);
}

export async function listEventAttendees(id) {
  if (!process.env.MONGODB_URI || !mongoose.isValidObjectId(id)) return [];
  await connectDB();
  const rsvps = await Rsvp.find({ event: id })
    .select({ firstName: 1, lastInitial: 1, partySize: 1, createdAt: 1 })
    .sort({ createdAt: 1 })
    .lean();
  return rsvps.map((r) => ({
    id: String(r._id),
    firstName: r.firstName,
    lastInitial: r.lastInitial,
    partySize: r.partySize || 1,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
  }));
}

function serializeBringSlots(slots) {
  return (slots || []).map((s) => ({
    id: String(s._id),
    category: s.category || "other",
    label: s.label || "",
    quantity: s.quantity || 1,
  }));
}

// Gathers everything the coordination board needs: admin-defined bring slots,
// individual contributions (who's bringing what), and ride offers/requests.
// `includeContact` is admin-only and controls whether private ride contact
// details are returned — the public board must never receive them.
export async function getEventCoordination(id, { includeContact = false } = {}) {
  const empty = { bringSlots: [], contributions: [], rides: { offers: [], requests: [] } };
  if (!process.env.MONGODB_URI || !mongoose.isValidObjectId(id)) return empty;
  await connectDB();
  const ev = await Event.findById(id).select({ bringSlots: 1 }).lean();
  if (!ev) return empty;

  const [contribs, rides] = await Promise.all([
    EventContribution.find({ event: id }).sort({ createdAt: 1 }).lean(),
    Ride.find({ event: id }).sort({ createdAt: 1 }).lean(),
  ]);

  const contributions = contribs.map((c) => ({
    id: String(c._id),
    slot: c.slot ? String(c.slot) : null,
    category: c.category || "other",
    item: c.item || "",
    quantity: c.quantity || 1,
    firstName: c.firstName,
    lastInitial: c.lastInitial,
    note: c.note || "",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
  }));

  const mapRide = (r) => ({
    id: String(r._id),
    type: r.type,
    firstName: r.firstName,
    lastInitial: r.lastInitial,
    area: r.area || "",
    seats: r.seats ?? 0,
    time: r.time || "",
    note: r.note || "",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    ...(includeContact ? { contact: r.contact || "" } : {}),
  });

  return {
    bringSlots: serializeBringSlots(ev.bringSlots),
    contributions,
    rides: {
      offers: rides.filter((r) => r.type === "offer").map(mapRide),
      requests: rides.filter((r) => r.type === "request").map(mapRide),
    },
  };
}

export async function getEventBySlug(slugOrId) {
  if (!process.env.MONGODB_URI || !slugOrId) return null;
  await connectDB();
  const or = [{ slug: slugOrId }];
  if (mongoose.isValidObjectId(slugOrId)) {
    or.push({ _id: slugOrId });
  }
  const event = await Event.findOne({ published: true, $or: or })
    .select({ "flyer.data": 0 })
    .lean();
  if (!event) return null;
  const [withCount] = await attachRsvpCounts([event]);
  return withCount;
}
