import { SignJWT, jwtVerify } from "jose";

export const MEMBER_COOKIE_NAME = "ss_member";
const MEMBER_ROLE = "member";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return new TextEncoder().encode(raw);
}

export async function signMemberToken({ memberId, email }) {
  return new SignJWT({ sub: memberId, email, role: MEMBER_ROLE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function getMemberSessionFromToken(token) {
  if (!token) return null;
  const raw = process.env.AUTH_SECRET;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(raw));
    if (payload.role !== MEMBER_ROLE) return null;
    return {
      memberId: String(payload.sub || ""),
      email: String(payload.email || ""),
      role: MEMBER_ROLE,
    };
  } catch {
    return null;
  }
}

export async function verifyMemberToken(token) {
  const session = await getMemberSessionFromToken(token);
  return Boolean(session);
}
