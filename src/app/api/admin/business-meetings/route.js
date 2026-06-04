import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import { assertMinutesEditor } from "@/lib/requireAdmin";
import {
  generateUniqueMeetingSlug,
  parseBusinessMeetingPayload,
} from "@/lib/businessMeetings";

export async function GET() {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  try {
    await connectDB();
    const items = await BusinessMeeting.find({})
      .sort({ meetingDate: -1 })
      .lean();
    return NextResponse.json(
      items.map((d) => ({
        ...d,
        _id: String(d._id),
      })),
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  try {
    const body = await request.json();
    const parsed = parseBusinessMeetingPayload(body);
    await connectDB();
    const slug = await generateUniqueMeetingSlug({
      desired: parsed.slug,
      meetingDate: parsed.meetingDate,
    });
    const doc = await BusinessMeeting.create({ ...parsed, slug });
    return NextResponse.json({ ...doc.toObject(), _id: String(doc._id) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
