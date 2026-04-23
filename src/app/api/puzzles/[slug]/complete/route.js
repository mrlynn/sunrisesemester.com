import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import PuzzleRun from "@/models/PuzzleRun";
import PuzzleUser from "@/models/PuzzleUser";
import { randomUUID } from "crypto";
import { PUZZLE_USER_COOKIE } from "@/lib/puzzleUser";

function toSmallInt(value, { min = 0, max = 1000 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

const CHECK_PENALTY_MS = 15_000;
const REVEAL_PENALTY_MS = 60_000;

export async function POST(request, { params }) {
  try {
    const slug = String((await params)?.slug ?? "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
    const userId = existing || randomUUID();

    const body = await request.json().catch(() => ({}));
    const gridState = body.gridState ?? null;
    const checksUsed = toSmallInt(body.checksUsed, { min: 0, max: 200 });
    const revealsUsed = toSmallInt(body.revealsUsed, { min: 0, max: 200 });

    await connectDB();
    const puzzle = await Puzzle.findOne({ slug, status: "published" });
    if (!puzzle) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const user = await PuzzleUser.findOne({ userId }).lean();
    const displayName = user?.displayName || "Anonymous";

    const now = new Date();

    const existingRun = await PuzzleRun.findOne({ puzzleId: puzzle._id, userId });
    if (!existingRun) {
      return NextResponse.json({ error: "Run not started." }, { status: 400 });
    }
    if (existingRun.completedAt) {
      return NextResponse.json({
        run: {
          completedAt: existingRun.completedAt,
          elapsedMs: existingRun.elapsedMs,
        },
      });
    }

    const baseElapsed = Math.max(0, now.getTime() - new Date(existingRun.startedAt).getTime());
    const penalty = checksUsed * CHECK_PENALTY_MS + revealsUsed * REVEAL_PENALTY_MS;
    const elapsedMs = baseElapsed + penalty;

    const run = await PuzzleRun.findOneAndUpdate(
      { puzzleId: puzzle._id, userId },
      {
        $set: {
          displayName,
          gridState,
          lastSavedAt: now,
          completedAt: now,
          elapsedMs,
          checksUsed,
          revealsUsed,
        },
      },
      { returnDocument: "after" },
    ).lean();

    const res = NextResponse.json({
      run: {
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        elapsedMs: run.elapsedMs,
        checksUsed: run.checksUsed,
        revealsUsed: run.revealsUsed,
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

