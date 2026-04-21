import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import ServiceRole from "@/models/ServiceRole";
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
    const doc = await ServiceRole.findById(id).lean();
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
    await connectDB();
    const doc = await ServiceRole.findByIdAndUpdate(
      id,
      {
        $set: {
          title: String(body.title ?? "").slice(0, 120),
          holder: String(body.holder ?? "").slice(0, 120),
          email: String(body.email ?? "").slice(0, 200),
          description: String(body.description ?? "").slice(0, 500),
          termLabel: String(body.termLabel ?? "").slice(0, 120),
          order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
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
    await ServiceRole.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
