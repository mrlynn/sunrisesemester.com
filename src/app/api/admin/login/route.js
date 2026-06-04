import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { COOKIE_NAME, signSessionToken } from "@/lib/auth";
import { findEditorUserByEmail } from "@/lib/editorUsers";
import { verifyPassword } from "@/lib/password";

function safeStringEqual(a, b) {
  const left = Buffer.from(String(a), "utf8");
  const right = Buffer.from(String(b), "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function POST(request) {
  try {
    if (!process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "AUTH_SECRET is not configured on the server." },
        { status: 503 },
      );
    }
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (email) {
      if (!process.env.MONGODB_URI) {
        return NextResponse.json(
          { error: "User sign-in requires MONGODB_URI to be configured." },
          { status: 503 },
        );
      }
      const user = await findEditorUserByEmail(email);
      if (!user || !user.active) {
        return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
      }
      if (!verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
      }
      const token = await signSessionToken({
        userId: String(user._id),
        email: user.email,
        role: user.role,
      });
      const res = NextResponse.json({
        ok: true,
        role: user.role,
        email: user.email,
      });
      setSessionCookie(res, token);
      return res;
    }

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json(
        { error: "Sign in with your email, or configure ADMIN_PASSWORD for legacy access." },
        { status: 503 },
      );
    }
    if (!safeStringEqual(password, expected)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    const token = await signSessionToken({
      userId: "legacy",
      email: "",
      role: "admin",
    });
    const res = NextResponse.json({ ok: true, role: "admin", email: "" });
    setSessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
