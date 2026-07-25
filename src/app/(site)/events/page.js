import EventsPage from "@/components/EventsPage";
import { listAllEvents } from "@/lib/events";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Events",
  description: "Upcoming events and announcements from Sunrise Semester.",
  path: "/events",
});

export default async function EventsRoute() {
  const raw = await listAllEvents();
  const events = raw.map((ev) => ({
    _id: String(ev._id),
    slug: ev.slug || "",
    title: ev.title,
    eventDate: new Date(ev.eventDate).toISOString(),
    location: ev.location || "",
    body: ev.body || "",
    flyerImage: ev.flyerImage || "",
    hasFlyer: Boolean(ev.flyer?.name),
    flyerName: ev.flyer?.name || "",
    rsvpEnabled: Boolean(ev.rsvpEnabled),
    rsvpCapacity: ev.rsvpCapacity || 0,
    rsvpCount: ev.rsvpCount || 0,
  }));
  return <EventsPage events={events} />;
}
