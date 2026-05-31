import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { assertAdmin } from "@/lib/requireAdmin";
import { generateUniqueEventSlug } from "@/lib/events";
import { parseBringSlots } from "@/lib/bringSlots";

const MAX_FLYER_BYTES = 25 * 1024 * 1024;
const ALLOWED_FLYER_EXT = new Set(["pdf", "png", "jpg", "jpeg", "gif", "webp"]);

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const items = await Event.find({})
      .select({ "flyer.data": 0 })
      .sort({ eventDate: 1 })
      .lean();
    return NextResponse.json(items);
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

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const form = await request.formData();
    const get = (k) => String(form.get(k) ?? "").trim();
    const flyer = await readFlyer(form.get("flyer"));

    await connectDB();
    const title = get("title").slice(0, 200) || "Untitled";
    const slug = await generateUniqueEventSlug({ desired: get("slug"), title });
    const doc = await Event.create({
      title,
      slug,
      eventDate: new Date(get("eventDate")),
      location: get("location").slice(0, 300),
      body: String(form.get("body") ?? ""),
      flyerImage: get("flyerImage").slice(0, 500),
      flyer,
      published: form.get("published") === "true",
      rsvpEnabled: form.get("rsvpEnabled") === "true",
      rsvpCapacity: Math.max(Number.parseInt(get("rsvpCapacity"), 10) || 0, 0),
      coordinationEnabled: form.get("coordinationEnabled") === "true",
      bringSlots: parseBringSlots(form.get("bringSlots")),
    });
    const obj = doc.toObject();
    delete obj.flyer?.data;
    return NextResponse.json(obj);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
