import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "./lib/auth";
import { canAccessAdminPath, defaultAdminPath, isRole } from "./lib/roles";

const STATIC_ASSET_PATH =
  /\.(?:woff2?|ttf|otf|eot|png|jpe?g|gif|webp|svg|ico|css|js|map)$/i;

function redirectToLogin(request) {
  const res = NextResponse.redirect(new URL("/admin", request.url));
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (STATIC_ASSET_PATH.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Sign-in page must stay reachable without a session (avoid redirect loops).
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse("AUTH_SECRET is not configured", { status: 503 });
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const role = payload.role;
    if (!isRole(role)) {
      return redirectToLogin(request);
    }
    if (!canAccessAdminPath(pathname, role)) {
      return NextResponse.redirect(new URL(defaultAdminPath(role), request.url));
    }
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

export const config = {
  // Protect /admin/* sub-routes only — not /admin (login).
  matcher: ["/admin/:path+"],
};
