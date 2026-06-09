import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { assertAdmin } from "@/lib/requireAdmin";
import { generateUniqueEventSlug } from "@/lib/events";
import { parseBringSlots } from "@/lib/bringSlots";
import { parseEventDateInput } from "@/lib/eventDates";

const MAX_FLYER_BYTES = 25 * 1024 * 1024;
const ALLOWED_FLYER_EXT = new Set(["pdf", "png", "jpg", "jpeg", "gif", "webp"]);

export async function GET(_request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await Event.findById(id).select({ "flyer.data": 0 }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function readFlyer(file) {
  if (!file || typeof file !== "object" || file.size === 0) return undefined;
  if (file.size > MAX_FLYER_BYTES) {
    throw new Error("Flyer exceeds the 25 MB limit.");
  }
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_FLYER_EXT.has(ext)) {
    throw new Error(`Flyer type .${ext} is not allowed. Use PDF or an image.`);
  }
  const buf = Buffer.from(await file.arrayBuffer());
  return { name: file.name, size: file.size, type: file.type, data: buf };
}

export async function PUT(request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const form = await request.formData();
    const get = (k) => String(form.get(k) ?? "").trim();
    const flyer = await readFlyer(form.get("flyer"));
    const removeFlyer = form.get("removeFlyer") === "true";

    await connectDB();
    const title = get("title").slice(0, 200);
    const slug = await generateUniqueEventSlug({
      desired: get("slug"),
      title,
      excludeId: id,
    });

    const update = {
      $set: {
        title,
        slug,
        eventDate: parseEventDateInput(get("eventDate")),
        location: get("location").slice(0, 300),
        body: String(form.get("body") ?? ""),
        flyerImage: get("flyerImage").slice(0, 500),
        published: form.get("published") === "true",
        rsvpEnabled: form.get("rsvpEnabled") === "true",
        rsvpCapacity: Math.max(Number.parseInt(get("rsvpCapacity"), 10) || 0, 0),
        coordinationEnabled: form.get("coordinationEnabled") === "true",
        bringSlots: parseBringSlots(form.get("bringSlots"), { keepIds: true }),
      },
    };
    if (flyer) {
      update.$set.flyer = flyer;
    } else if (removeFlyer) {
      update.$unset = { flyer: "" };
    }

    const doc = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      projection: { "flyer.data": 0 },
    }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
