import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ss_admin";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return new TextEncoder().encode(raw);
}

export { COOKIE_NAME };

export async function signSessionToken({ userId, email, role }) {
  return new SignJWT({ sub: userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());
}

/** @deprecated Use signSessionToken — kept for legacy env password login */
export async function signAdminToken() {
  return signSessionToken({
    userId: "legacy",
    email: "",
    role: "admin",
  });
}

export async function getSessionFromToken(token) {
  if (!token) return null;
  const raw = process.env.AUTH_SECRET;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(raw));
    const role = payload.role;
    if (typeof role !== "string" || !role) return null;
    return {
      userId: String(payload.sub || ""),
      email: String(payload.email || ""),
      role,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token) {
  const session = await getSessionFromToken(token);
  return Boolean(session);
}
