import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Anniversary from "@/models/Anniversary";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    await connectDB();
    const items = await Anniversary.find({}).sort({ sobrietyDate: 1 }).lean();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    const body = await request.json();
    const sobrietyDate = parseDate(body.sobrietyDate);
    if (!sobrietyDate) {
      return NextResponse.json(
        { error: "A valid sobriety date is required (YYYY-MM-DD)." },
        { status: 400 },
      );
    }
    await connectDB();
    const doc = await Anniversary.create({
      name: String(body.name ?? "").slice(0, 120),
      sobrietyDate,
      note: String(body.note ?? "").slice(0, 500),
      published: Boolean(body.published),
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}
