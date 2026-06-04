import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import { assertMinutesEditor } from "@/lib/requireAdmin";
import {
  generateUniqueMeetingSlug,
  parseBusinessMeetingPayload,
} from "@/lib/businessMeetings";

export async function GET(_request, context) {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await BusinessMeeting.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...doc, _id: String(doc._id) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const parsed = parseBusinessMeetingPayload(body);
    await connectDB();
    const slug = await generateUniqueMeetingSlug({
      desired: parsed.slug,
      meetingDate: parsed.meetingDate,
      excludeId: id,
    });
    const doc = await BusinessMeeting.findByIdAndUpdate(
      id,
      { $set: { ...parsed, slug } },
      { new: true, runValidators: true },
    ).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...doc, _id: String(doc._id) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    await BusinessMeeting.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
