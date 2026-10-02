import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { COOKIE_NAME, signSessionToken } from "@/lib/auth";
import { resetEditorPasswordWithToken } from "@/lib/editorPasswordReset";

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
      return NextResponse.json({ error: "AUTH_SECRET is not configured." }, { status: 503 });
    }
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const ip = clientIp(request);
    const limited = await checkRateLimit(`admin-reset-password:${ip}`, {
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const password = String(body?.password ?? "");
    const confirmPassword = String(body?.confirmPassword ?? "");
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const result = await resetEditorPasswordWithToken(body?.token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }

    const token = await signSessionToken({
      userId: result.user._id,
      email: result.user.email,
      role: result.user.role,
    });
    const res = NextResponse.json({ ok: true, role: result.user.role, message: result.message });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message || "Reset failed." }, { status: 400 });
  }
}
