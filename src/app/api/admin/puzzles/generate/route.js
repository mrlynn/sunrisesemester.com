import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CrosswordEntry from "@/models/CrosswordEntry";
import { assertAdmin } from "@/lib/requireAdmin";
import { generateCrosswordFromEntries } from "@/lib/crosswordGenerator";

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const targetWords = Math.max(4, Math.min(20, Math.floor(Number(body.targetWords || 10))));
    const tag = String(body.tag || "").trim();

    await connectDB();
    const query = { enabled: true };
    if (tag) query.tags = tag;
    const entries = await CrosswordEntry.find(query).select({ answer: 1, clue: 1 }).lean();
    const result = generateCrosswordFromEntries(entries, { targetWords });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      crosswordData: result.crosswordData,
      placedWords: result.placedWords,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

