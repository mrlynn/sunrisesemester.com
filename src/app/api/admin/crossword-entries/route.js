import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CrosswordEntry from "@/models/CrosswordEntry";
import { assertAdmin } from "@/lib/requireAdmin";

function normalizeAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toInt(value, { min = 1, max = 200 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export async function GET(request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const q = String(searchParams.get("q") || "").trim();
    const tag = String(searchParams.get("tag") || "").trim();
    const enabledParam = searchParams.get("enabled");
    const enabled =
      enabledParam === "true" ? true : enabledParam === "false" ? false : undefined;
    const page = toInt(searchParams.get("page") || 1, { min: 1, max: 10000 });
    const limit = toInt(searchParams.get("limit") || 25, { min: 5, max: 100 });

    await connectDB();
    const filter = {};
    if (typeof enabled === "boolean") {
      filter.enabled = enabled;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filter.$or = [
        { answerNormalized: re },
        { answer: re },
        { clue: re },
      ];
    }

    const [total, items] = await Promise.all([
      CrosswordEntry.countDocuments(filter),
      CrosswordEntry.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({ items, total, page, pages, limit });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const answer = String(body.answer ?? "").trim();
    const clue = String(body.clue ?? "").trim();
    const answerNormalized = normalizeAnswer(answer);
    if (!answerNormalized || answerNormalized.length < 3) {
      return NextResponse.json({ error: "Answer must be at least 3 letters (A–Z)." }, { status: 400 });
    }
    if (!clue) {
      return NextResponse.json({ error: "Clue is required." }, { status: 400 });
    }
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
      : [];
    const difficulty = Math.max(1, Math.min(5, Math.floor(Number(body.difficulty || 1))));
    const enabled = body.enabled === false ? false : true;

    await connectDB();
    const doc = await CrosswordEntry.create({
      answer,
      answerNormalized,
      clue,
      tags,
      difficulty,
      enabled,
    });
    return NextResponse.json(doc.toObject());
  } catch (e) {
    const msg = e?.code === 11000 ? "That answer already exists in the library." : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

