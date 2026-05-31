import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import EventContribution from "@/models/EventContribution";
import Ride from "@/models/Ride";
import { getEventCoordination } from "@/lib/events";
import { normalizeCategory } from "@/lib/coordination";

const empty = {
  coordinationEnabled: false,
  bringSlots: [],
  contributions: [],
  rides: { offers: [], requests: [] },
};

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }
    await connectDB();
    const ev = await Event.findById(id)
      .select({ coordinationEnabled: 1, published: 1 })
      .lean();
    if (!ev || !ev.published || !ev.coordinationEnabled) {
      return NextResponse.json(empty);
    }
    const data = await getEventCoordination(id);
    return NextResponse.json({ coordinationEnabled: true, ...data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function clampInt(value, min, max, fallback) {
  let n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) n = fallback;
  return Math.min(Math.max(n, min), max);
}

function name(body) {
  const firstName = String(body.firstName ?? "").trim().slice(0, 80);
  const lastInitial = String(body.lastInitial ?? "").trim().charAt(0).toUpperCase();
  return { firstName, lastInitial };
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const kind = String(body.kind ?? "").trim();

    await connectDB();
    const ev = await Event.findById(id)
      .select({ coordinationEnabled: 1, published: 1, eventDate: 1, bringSlots: 1 })
      .lean();
    if (!ev || !ev.published || !ev.coordinationEnabled) {
      return NextResponse.json(
        { error: "Coordination is not open for this event." },
        { status: 404 },
      );
    }
    if (new Date(ev.eventDate) < new Date()) {
      return NextResponse.json(
        { error: "This event has already taken place." },
        { status: 400 },
      );
    }

    const { firstName, lastInitial } = name(body);
    if (!firstName) {
      return NextResponse.json({ error: "Please enter your first name." }, { status: 400 });
    }
    if (!lastInitial) {
      return NextResponse.json({ error: "Please enter your last initial." }, { status: 400 });
    }

    if (kind === "contribution") {
      let slot = null;
      let category = normalizeCategory(body.category);
      if (body.slot && mongoose.isValidObjectId(body.slot)) {
        const match = (ev.bringSlots || []).find((s) => String(s._id) === String(body.slot));
        if (match) {
          slot = match._id;
          category = match.category || category;
        }
      }
      const item = String(body.item ?? "").trim().slice(0, 120);
      if (!slot && !item) {
        return NextResponse.json(
          { error: "Tell us what you're bringing." },
          { status: 400 },
        );
      }
      await EventContribution.create({
        event: id,
        slot,
        category,
        item,
        quantity: clampInt(body.quantity, 1, 50, 1),
        firstName,
        lastInitial,
        note: String(body.note ?? "").trim().slice(0, 300),
      });
      return NextResponse.json({ ok: true });
    }

    if (kind === "ride") {
      const type = body.type === "offer" ? "offer" : body.type === "request" ? "request" : null;
      if (!type) {
        return NextResponse.json({ error: "Choose offer or request." }, { status: 400 });
      }
      await Ride.create({
        event: id,
        type,
        firstName,
        lastInitial,
        area: String(body.area ?? "").trim().slice(0, 120),
        seats: clampInt(body.seats, 0, 20, type === "offer" ? 1 : 1),
        time: String(body.time ?? "").trim().slice(0, 60),
        contact: String(body.contact ?? "").trim().slice(0, 200),
        note: String(body.note ?? "").trim().slice(0, 300),
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
