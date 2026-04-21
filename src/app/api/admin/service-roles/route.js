import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceRole from "@/models/ServiceRole";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const items = await ServiceRole.find({}).sort({ order: 1, title: 1 }).lean();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    await connectDB();
    const doc = await ServiceRole.create({
      title: String(body.title ?? "Untitled").slice(0, 120),
      holder: String(body.holder ?? "").slice(0, 120),
      email: String(body.email ?? "").slice(0, 200),
      description: String(body.description ?? "").slice(0, 500),
      termLabel: String(body.termLabel ?? "").slice(0, 120),
      order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
      published: Boolean(body.published),
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
