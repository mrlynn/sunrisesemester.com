import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";

export async function GET() {
  try {
    await connectDB();
    const puzzles = await Puzzle.find({ status: "published", publishedAt: { $ne: null } })
      .sort({ publishedAt: -1 })
      .limit(20)
      .select({ slug: 1, title: 1, weekOf: 1, publishedAt: 1 })
      .lean();
    return NextResponse.json({
      puzzles: puzzles.map((p) => ({
        slug: p.slug,
        title: p.title,
        weekOf: p.weekOf,
        publishedAt: p.publishedAt,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

