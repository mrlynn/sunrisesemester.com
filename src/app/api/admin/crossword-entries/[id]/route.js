import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CrosswordEntry from "@/models/CrosswordEntry";
import { assertAdmin } from "@/lib/requireAdmin";

function normalizeAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export async function PUT(request, { params }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const id = String((await params)?.id ?? "");
    const body = await request.json().catch(() => ({}));

    const update = {};
    if ("answer" in body) {
      const answer = String(body.answer ?? "").trim();
      const answerNormalized = normalizeAnswer(answer);
      if (!answerNormalized || answerNormalized.length < 3) {
        return NextResponse.json({ error: "Answer must be at least 3 letters (A–Z)." }, { status: 400 });
      }
      update.answer = answer;
      update.answerNormalized = answerNormalized;
    }
    if ("clue" in body) {
      const clue = String(body.clue ?? "").trim();
      if (!clue) {
        return NextResponse.json({ error: "Clue is required." }, { status: 400 });
      }
      update.clue = clue;
    }
    if ("tags" in body) {
      update.tags = Array.isArray(body.tags)
        ? body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
        : [];
    }
    if ("difficulty" in body) {
      update.difficulty = Math.max(1, Math.min(5, Math.floor(Number(body.difficulty || 1))));
    }
    if ("enabled" in body) {
      update.enabled = body.enabled === false ? false : true;
    }

    await connectDB();
    const doc = await CrosswordEntry.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    const msg = e?.code === 11000 ? "That answer already exists in the library." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

