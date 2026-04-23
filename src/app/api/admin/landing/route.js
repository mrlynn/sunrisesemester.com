import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Landing from "@/models/Landing";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    await connectDB();
    const doc = await Landing.findOne({ key: "main" }).lean();
    if (!doc) {
      return NextResponse.json({
        key: "main",
        heroTitle: "Sunrise Semester",
        heroSubtitle: "",
        body: "",
      });
    }
    return NextResponse.json(doc);
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
    const doc = await Landing.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          heroTitle: String(body.heroTitle ?? "").slice(0, 200),
          heroSubtitle: String(body.heroSubtitle ?? "").slice(0, 400),
          body: String(body.body ?? ""),
        },
        $setOnInsert: { key: "main" },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
