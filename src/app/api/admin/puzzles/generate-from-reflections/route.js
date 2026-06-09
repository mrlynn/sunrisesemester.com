import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/requireAdmin";
import { generateWeeklyCrosswordFromReflections } from "@/lib/reflectionCrossword";
import { defaultWeeklyPuzzleTitle } from "@/lib/reflectionWeek";

function toDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const weekOf = toDate(body.weekOf) || new Date();
    const targetWords = Math.max(4, Math.min(20, Math.floor(Number(body.targetWords || 10))));

    const result = await generateWeeklyCrosswordFromReflections(weekOf, { targetWords });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      crosswordData: result.crosswordData,
      placedWords: result.placedWords,
      weekOf: result.weekOf,
      weekRangeLabel: result.weekRangeLabel,
      title: defaultWeeklyPuzzleTitle(result.weekOf),
      reflectionThemed: true,
      reflectionSummary: result.reflectionSummary,
      reflectionsUsed: result.reflectionsUsed,
      matchedEntries: result.matchedEntries,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
