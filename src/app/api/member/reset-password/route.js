import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { MEMBER_COOKIE_NAME, signMemberToken } from "@/lib/memberAuth";
import { resetPasswordWithToken } from "@/lib/passwordReset";

function setMemberCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(MEMBER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
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
    const limited = await checkRateLimit(`reset-password:${ip}`, {
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

    const result = await resetPasswordWithToken(body?.token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }

    const token = await signMemberToken({
      memberId: result.member._id,
      email: result.member.email,
    });
    const res = NextResponse.json({ ok: true, message: result.message });
    setMemberCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message || "Reset failed." }, { status: 400 });
  }
}
