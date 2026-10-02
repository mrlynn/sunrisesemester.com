import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "./lib/auth";
import { MEMBER_COOKIE_NAME } from "./lib/memberAuth";
import { canAccessAdminPath, defaultAdminPath, isRole } from "./lib/roles";
import { ADMIN_PUBLIC_PATHS } from "./lib/adminPublicPaths";

const STATIC_ASSET_PATH =
  /\.(?:woff2?|ttf|otf|eot|png|jpe?g|gif|webp|svg|ico|css|js|map)$/i;

const MEMBER_PUBLIC_PATHS = new Set(["/member", "/member/login", "/member/register"]);
const MEMBER_PROTECTED_PATHS = ["/member/settings"];

function redirectToAdminLogin(request) {
  const res = NextResponse.redirect(new URL("/admin", request.url));
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

function redirectToMemberLogin(request) {
  const next = encodeURIComponent(request.nextUrl.pathname);
  return NextResponse.redirect(new URL(`/member/login?next=${next}`, request.url));
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (STATIC_ASSET_PATH.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse("AUTH_SECRET is not configured", { status: 503 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/member")) {
    if (MEMBER_PUBLIC_PATHS.has(pathname)) {
      return NextResponse.next();
    }
    const needsAuth = MEMBER_PROTECTED_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    if (!needsAuth) {
      return NextResponse.next();
    }
    const memberToken = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
    if (!memberToken) {
      return redirectToMemberLogin(request);
    }
    try {
      const { payload } = await jwtVerify(memberToken, new TextEncoder().encode(secret));
      if (payload.role !== "member") {
        return redirectToMemberLogin(request);
      }
      return NextResponse.next();
    } catch {
      return redirectToMemberLogin(request);
    }
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Sign-in, forgot-password, and reset-password must stay reachable without
  // a session (avoid redirect loops for someone who is, by definition, locked out).
  if (ADMIN_PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectToAdminLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = payload.role;
    if (!isRole(role)) {
      return redirectToAdminLogin(request);
    }
    if (!canAccessAdminPath(pathname, role)) {
      return NextResponse.redirect(new URL(defaultAdminPath(role), request.url));
    }
    return NextResponse.next();
  } catch {
    return redirectToAdminLogin(request);
  }
}

export const config = {
  matcher: ["/admin/:path+", "/member/:path+"],
};
