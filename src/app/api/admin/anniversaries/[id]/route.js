import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Anniversary from "@/models/Anniversary";
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
    const doc = await Anniversary.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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
    const sobrietyDate = parseDate(body.sobrietyDate);
    if (!sobrietyDate) {
      return NextResponse.json(
        { error: "A valid sobriety date is required (YYYY-MM-DD)." },
        { status: 400 },
      );
    }
    await connectDB();
    const doc = await Anniversary.findByIdAndUpdate(
      id,
      {
        $set: {
          name: String(body.name ?? "").slice(0, 120),
          sobrietyDate,
          note: String(body.note ?? "").slice(0, 500),
          published: Boolean(body.published),
        },
      },
      { new: true, runValidators: true },
    ).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
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
    await Anniversary.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}
