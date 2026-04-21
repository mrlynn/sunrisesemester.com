import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET(_request, context) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    const doc = await Story.findById(id).lean();
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
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    await connectDB();
    const doc = await Story.findByIdAndUpdate(
      id,
      {
        $set: {
          title: String(body.title ?? "").slice(0, 200),
          slug: String(body.slug ?? "").slice(0, 120),
          excerpt: String(body.excerpt ?? "").slice(0, 500),
          body: String(body.body ?? ""),
          author: String(body.author ?? "").slice(0, 120),
          coverImage: String(body.coverImage ?? "").slice(0, 500),
          coverImageCredit: String(body.coverImageCredit ?? "").slice(0, 200),
          coverImageCreditUrl: String(body.coverImageCreditUrl ?? "").slice(0, 500),
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
    const msg = e?.code === 11000 ? "That slug is already in use." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await connectDB();
    await Story.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
