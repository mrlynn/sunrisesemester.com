import EventsPage from "@/components/EventsPage";
import { listAllEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events",
  description: "Upcoming events and announcements from Sunrise Semester.",
};

export default async function EventsRoute() {
  const raw = await listAllEvents();
  const events = raw.map((ev) => ({
    _id: String(ev._id),
    title: ev.title,
    eventDate: new Date(ev.eventDate).toISOString(),
    location: ev.location || "",
    body: ev.body || "",
    flyerImage: ev.flyerImage || "",
  }));
  return <EventsPage events={events} />;
}
