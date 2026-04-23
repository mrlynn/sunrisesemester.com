import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import PuzzleRun from "@/models/PuzzleRun";
import PuzzleUser from "@/models/PuzzleUser";
import { randomUUID } from "crypto";
import { PUZZLE_USER_COOKIE } from "@/lib/puzzleUser";

export async function POST(request, { params }) {
  try {
    const slug = String((await params)?.slug ?? "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
    const userId = existing || randomUUID();

    await connectDB();
    const puzzle = await Puzzle.findOne({ slug, status: "published" });
    if (!puzzle) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const user = await PuzzleUser.findOne({ userId }).lean();
    const displayName = user?.displayName || "Anonymous";

    const now = new Date();
    const run = await PuzzleRun.findOneAndUpdate(
      { puzzleId: puzzle._id, userId },
      { $setOnInsert: { puzzleId: puzzle._id, userId, displayName, startedAt: now } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();

    const res = NextResponse.json({
      run: {
        startedAt: run.startedAt,
        lastSavedAt: run.lastSavedAt,
        completedAt: run.completedAt,
        elapsedMs: run.elapsedMs,
        checksUsed: run.checksUsed,
        revealsUsed: run.revealsUsed,
        gridState: run.gridState,
      },
    });
    if (!existing) {
      const isProd = process.env.NODE_ENV === "production";
      res.cookies.set(PUZZLE_USER_COOKIE, userId, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2,
      });
    }
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

