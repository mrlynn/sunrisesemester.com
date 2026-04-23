import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PuzzleUser from "@/models/PuzzleUser";
import { randomUUID } from "crypto";
import { PUZZLE_USER_COOKIE } from "@/lib/puzzleUser";

export async function GET(request) {
  try {
    const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
    const userId = existing || randomUUID();
    await connectDB();
    const user = await PuzzleUser.findOne({ userId }).lean();
    const res = NextResponse.json({
      user: user
        ? { userId: user.userId, displayName: user.displayName }
        : { userId, displayName: "Anonymous" },
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

export async function PUT(request) {
  try {
    const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
    const userId = existing || randomUUID();
    const body = await request.json().catch(() => ({}));
    const displayName = String(body.displayName ?? "Anonymous").trim().slice(0, 40) || "Anonymous";

    await connectDB();
    const user = await PuzzleUser.findOneAndUpdate(
      { userId },
      { $set: { displayName }, $setOnInsert: { userId } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();

    const res = NextResponse.json({ user: { userId: user.userId, displayName: user.displayName } });
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

