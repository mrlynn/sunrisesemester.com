import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteAnnouncement from "@/models/SiteAnnouncement";
import { assertAdmin } from "@/lib/requireAdmin";
import { serializeAnnouncement } from "@/lib/siteAnnouncement";

function parseOptionalDate(value) {
  if (value === null || value === undefined || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    await connectDB();
    const doc = await SiteAnnouncement.findOne({ key: "main" }).lean();
    return NextResponse.json(serializeAnnouncement(doc));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    const body = await request.json();
    await connectDB();
    const doc = await SiteAnnouncement.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          enabled: Boolean(body.enabled),
          message: String(body.message ?? "").slice(0, 240),
          href: String(body.href ?? "").slice(0, 500),
          linkLabel: String(body.linkLabel ?? "Read more").slice(0, 40) || "Read more",
          dismissible: body.dismissible !== false,
          startsAt: parseOptionalDate(body.startsAt),
          endsAt: parseOptionalDate(body.endsAt),
        },
        $setOnInsert: { key: "main" },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return NextResponse.json(serializeAnnouncement(doc));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
