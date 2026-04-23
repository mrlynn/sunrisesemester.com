import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import PuzzleRun from "@/models/PuzzleRun";
import PuzzleUser from "@/models/PuzzleUser";
import { randomUUID } from "crypto";
import { PUZZLE_USER_COOKIE } from "@/lib/puzzleUser";

export async function GET(request, { params }) {
  try {
    const slug = String((await params)?.slug ?? "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
    const userId = existing || randomUUID();
    await connectDB();

    const puzzle = await Puzzle.findOne({ slug }).lean();
    if (!puzzle) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    if (puzzle.status !== "published") {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const [run, user] = await Promise.all([
      PuzzleRun.findOne({ puzzleId: puzzle._id, userId }).lean(),
      PuzzleUser.findOne({ userId }).lean(),
    ]);

    const payload = {
      puzzle: {
        slug: puzzle.slug,
        title: puzzle.title,
        weekOf: puzzle.weekOf,
        publishedAt: puzzle.publishedAt,
        crosswordData: puzzle.crosswordData,
      },
      me: {
        userId,
        displayName: user?.displayName || "Anonymous",
      },
      run: run
        ? {
            startedAt: run.startedAt,
            lastSavedAt: run.lastSavedAt,
            completedAt: run.completedAt,
            elapsedMs: run.elapsedMs,
            checksUsed: run.checksUsed,
            revealsUsed: run.revealsUsed,
            gridState: run.gridState,
          }
        : null,
    };

    const out = NextResponse.json(payload);
    if (!existing) {
      const isProd = process.env.NODE_ENV === "production";
      out.cookies.set(PUZZLE_USER_COOKIE, userId, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2,
      });
    }
    return out;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

