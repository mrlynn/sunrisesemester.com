import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import Rsvp from "@/models/Rsvp";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }
    await connectDB();
    const ev = await Event.findById(id).select({ rsvpEnabled: 1, published: 1 }).lean();
    if (!ev || !ev.published || !ev.rsvpEnabled) {
      return NextResponse.json({ count: 0, headcount: 0, attendees: [] });
    }
    const rsvps = await Rsvp.find({ event: id })
      .select({ firstName: 1, lastInitial: 1, partySize: 1, createdAt: 1 })
      .sort({ createdAt: 1 })
      .lean();
    const attendees = rsvps.map((r) => ({
      id: String(r._id),
      firstName: r.firstName,
      lastInitial: r.lastInitial,
      partySize: r.partySize || 1,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    }));
    const headcount = attendees.reduce((sum, a) => sum + a.partySize, 0);
    return NextResponse.json({ count: attendees.length, headcount, attendees });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const firstName = String(body.firstName ?? "").trim();
    const lastInitial = String(body.lastInitial ?? "").trim().charAt(0).toUpperCase();
    const note = String(body.note ?? "").trim().slice(0, 500);
    let partySize = Number.parseInt(body.partySize, 10);
    if (!Number.isFinite(partySize)) partySize = 1;
    partySize = Math.min(Math.max(partySize, 1), 10);

    if (!firstName) {
      return NextResponse.json({ error: "Please enter your first name." }, { status: 400 });
    }
    if (!lastInitial) {
      return NextResponse.json({ error: "Please enter your last initial." }, { status: 400 });
    }

    await connectDB();
    const ev = await Event.findById(id).lean();
    if (!ev || !ev.published || !ev.rsvpEnabled) {
      return NextResponse.json({ error: "RSVPs are not open for this event." }, { status: 404 });
    }
    if (new Date(ev.eventDate) < new Date()) {
      return NextResponse.json({ error: "This event has already taken place." }, { status: 400 });
    }

    if (ev.rsvpCapacity > 0) {
      const agg = await Rsvp.aggregate([
        { $match: { event: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: null, total: { $sum: "$partySize" } } },
      ]);
      const current = agg[0]?.total ?? 0;
      const spotsRemaining = ev.rsvpCapacity - current;
      if (partySize > spotsRemaining) {
        return NextResponse.json(
          {
            error:
              spotsRemaining <= 0
                ? "This event is full."
                : `Only ${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} remaining.`,
            spotsRemaining: Math.max(spotsRemaining, 0),
          },
          { status: 409 },
        );
      }
    }

    await Rsvp.create({
      event: id,
      firstName: firstName.slice(0, 80),
      lastInitial,
      partySize,
      note,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
