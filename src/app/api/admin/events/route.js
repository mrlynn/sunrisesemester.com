import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const items = await Event.find({}).sort({ eventDate: 1 }).lean();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    await connectDB();
    const doc = await Event.create({
      title: String(body.title ?? "Untitled").slice(0, 200),
      eventDate: new Date(body.eventDate),
      location: String(body.location ?? "").slice(0, 300),
      body: String(body.body ?? ""),
      flyerImage: String(body.flyerImage ?? "").slice(0, 500),
      published: Boolean(body.published ?? true),
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
