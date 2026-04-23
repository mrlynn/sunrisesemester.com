import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import { assertAdmin } from "@/lib/requireAdmin";
import { validateCrosswordData } from "@/lib/crosswordValidation";

function toDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function toSlugFromWeekOf(weekOf) {
  const d = toDate(weekOf);
  if (!d) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    await connectDB();
    const items = await Puzzle.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(
      items.map((p) => ({
        _id: p._id,
        slug: p.slug,
        title: p.title,
        weekOf: p.weekOf,
        publishedAt: p.publishedAt,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const weekOf = toDate(body.weekOf) || new Date();
    const slug = String(body.slug ?? "").trim().slice(0, 64) || toSlugFromWeekOf(weekOf);
    const title = String(body.title ?? "").trim().slice(0, 120) || `Crossword: Week of ${slug}`;
    const crosswordData = body.crosswordData ?? null;
    const status = String(body.status ?? "draft") === "published" ? "published" : "draft";
    const publishedAt = body.publishedAt ? toDate(body.publishedAt) : null;

    if (!crosswordData || typeof crosswordData !== "object") {
      return NextResponse.json({ error: "crosswordData is required (JSON object)." }, { status: 400 });
    }
    const valid = validateCrosswordData(crosswordData);
    if (!valid.ok) {
      return NextResponse.json({ error: valid.error }, { status: 400 });
    }

    await connectDB();
    const doc = await Puzzle.create({
      slug,
      title,
      weekOf,
      status,
      publishedAt: status === "published" ? publishedAt || new Date() : null,
      crosswordData,
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    const msg = e?.code === 11000 ? "That slug is already in use." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

