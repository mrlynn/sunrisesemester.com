import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import { assertAdmin } from "@/lib/requireAdmin";
import { validateCrosswordData } from "@/lib/crosswordValidation";

function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

export async function GET(_request, { params }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    await connectDB();
    const id = String((await params)?.id ?? "");
    const doc = await Puzzle.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const id = String((await params)?.id ?? "");
    const body = await request.json().catch(() => ({}));

    const status = ["draft", "published", "archived"].includes(String(body.status))
      ? String(body.status)
      : "draft";
    const publishedAt = toDate(body.publishedAt);

    const update = {
      slug: String(body.slug ?? "").trim().slice(0, 64),
      title: String(body.title ?? "").trim().slice(0, 120),
      status,
      weekOf: toDate(body.weekOf),
      publishedAt,
      crosswordData: body.crosswordData ?? null,
    };

    Object.keys(update).forEach((k) => {
      if (update[k] === "" || update[k] === null) {
        delete update[k];
      }
    });

    if ("crosswordData" in body && (!body.crosswordData || typeof body.crosswordData !== "object")) {
      return NextResponse.json({ error: "crosswordData must be a JSON object." }, { status: 400 });
    }
    if ("crosswordData" in body) {
      const valid = validateCrosswordData(body.crosswordData);
      if (!valid.ok) {
        return NextResponse.json({ error: valid.error }, { status: 400 });
      }
    }

    await connectDB();
    const needsPublishedAt = status === "published" && !publishedAt;
    const patch = needsPublishedAt ? { ...update, publishedAt: new Date() } : update;
    const doc = await Puzzle.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    const msg = e?.code === 11000 ? "That slug is already in use." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

