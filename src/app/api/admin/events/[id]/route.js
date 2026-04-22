import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET(_request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await Event.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    await connectDB();
    const doc = await Event.findByIdAndUpdate(
      id,
      {
        $set: {
          title: String(body.title ?? "").slice(0, 200),
          eventDate: new Date(body.eventDate),
          location: String(body.location ?? "").slice(0, 300),
          body: String(body.body ?? ""),
          flyerImage: String(body.flyerImage ?? "").slice(0, 500),
          published: Boolean(body.published),
        },
      },
      { new: true, runValidators: true },
    ).lean();
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
