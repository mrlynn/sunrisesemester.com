import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import PuzzleRun from "@/models/PuzzleRun";

export async function GET(_request, { params }) {
  try {
    const slug = String((await params)?.slug ?? "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    await connectDB();
    const puzzle = await Puzzle.findOne({ slug, status: "published" }).lean();
    if (!puzzle) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const rows = await PuzzleRun.find({
      puzzleId: puzzle._id,
      completedAt: { $ne: null },
      elapsedMs: { $ne: null },
    })
      .sort({ elapsedMs: 1, completedAt: 1 })
      .limit(25)
      .lean();

    return NextResponse.json({
      leaderboard: rows.map((r) => ({
        displayName: r.displayName || "Anonymous",
        elapsedMs: r.elapsedMs,
        completedAt: r.completedAt,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

