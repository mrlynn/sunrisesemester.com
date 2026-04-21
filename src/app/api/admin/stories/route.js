import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }
  try {
    await connectDB();
    const items = await Story.find({}).sort({ updatedAt: -1 }).lean();
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
    await connectDB();
    const doc = await Story.create({
      title: String(body.title ?? "Untitled").slice(0, 200),
      slug: String(body.slug ?? "").slice(0, 120),
      excerpt: String(body.excerpt ?? "").slice(0, 500),
      body: String(body.body ?? ""),
      author: String(body.author ?? "").slice(0, 120),
      coverImage: String(body.coverImage ?? "").slice(0, 500),
      coverImageCredit: String(body.coverImageCredit ?? "").slice(0, 200),
      coverImageCreditUrl: String(body.coverImageCreditUrl ?? "").slice(0, 500),
      published: Boolean(body.published),
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    const msg = e?.code === 11000 ? "That slug is already in use." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
