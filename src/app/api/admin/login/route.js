import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { COOKIE_NAME, signAdminToken } from "@/lib/auth";

function safeStringEqual(a, b) {
  const left = Buffer.from(String(a), "utf8");
  const right = Buffer.from(String(b), "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function POST(request) {
  try {
    if (!process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "AUTH_SECRET is not configured on the server." },
        { status: 503 },
      );
    }
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 503 },
      );
    }
    const body = await request.json();
    const password = body?.password ?? "";
    if (!safeStringEqual(password, expected)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    const token = await signAdminToken();
    const res = NextResponse.json({ ok: true });
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
