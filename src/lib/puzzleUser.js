import { randomUUID } from "crypto";

export const PUZZLE_USER_COOKIE = "ss_puid";

export function getOrSetPuzzleUserId(request, response) {
  const existing = request.cookies.get(PUZZLE_USER_COOKIE)?.value;
  if (existing) {
    return existing;
  }
  const userId = randomUUID();
  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set(PUZZLE_USER_COOKIE, userId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  return userId;
}

