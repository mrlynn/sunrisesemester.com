import { NextResponse } from "next/server";
import { getCurrentPublishedPuzzle, serializePuzzleSummary } from "@/lib/puzzles";

export async function GET() {
  try {
    const puzzle = await getCurrentPublishedPuzzle();

    if (!puzzle) {
      return NextResponse.json({ puzzle: null });
    }
    return NextResponse.json({
      puzzle: serializePuzzleSummary(puzzle),
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

