import { notFound } from "next/navigation";
import EventDetail from "@/components/EventDetail";
import { getEventBySlug, listEventAttendees, getEventCoordination } from "@/lib/events";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) return { title: "Event" };
  const description = ev.location
    ? `${ev.title} — ${ev.location}`
    : `${ev.title} — Sunrise Semester event.`;
  return pageSocialMetadata({
    title: ev.title,
    description,
    image: ev.flyerImage,
    imageAlt: ev.title,
    type: "article",
    path: ev.slug ? `/events/${ev.slug}` : undefined,
  });
}

export default async function EventDetailRoute({ params }) {
  const { slug } = await params;
  const raw = await getEventBySlug(slug);
  if (!raw) notFound();

  const initialAttendees = raw.rsvpEnabled ? await listEventAttendees(raw._id) : [];
  const initialCoordination = raw.coordinationEnabled
    ? await getEventCoordination(raw._id)
    : null;

  const event = {
    _id: String(raw._id),
    slug: raw.slug || "",
    title: raw.title,
    eventDate: new Date(raw.eventDate).toISOString(),
    location: raw.location || "",
    body: raw.body || "",
    flyerImage: raw.flyerImage || "",
    hasFlyer: Boolean(raw.flyer?.name),
    flyerName: raw.flyer?.name || "",
    rsvpEnabled: Boolean(raw.rsvpEnabled),
    rsvpCapacity: raw.rsvpCapacity || 0,
    rsvpCount: raw.rsvpCount || 0,
    coordinationEnabled: Boolean(raw.coordinationEnabled),
  };
  return (
    <EventDetail
      event={event}
      initialAttendees={initialAttendees}
      initialCoordination={initialCoordination}
    />
  );
}
