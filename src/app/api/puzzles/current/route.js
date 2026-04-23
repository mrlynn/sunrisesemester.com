import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const puzzle = await Puzzle.findOne({
      status: "published",
      publishedAt: { $ne: null, $lte: now },
    })
      .sort({ publishedAt: -1 })
      .lean();

    if (!puzzle) {
      return NextResponse.json({ puzzle: null });
    }
    return NextResponse.json({
      puzzle: {
        slug: puzzle.slug,
        title: puzzle.title,
        weekOf: puzzle.weekOf,
        publishedAt: puzzle.publishedAt,
        crosswordData: puzzle.crosswordData,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

