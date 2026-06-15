import connectDB from "@/lib/mongodb";
import RateLimitHit from "@/models/RateLimitHit";

/**
 * Simple MongoDB-backed rate limiter for serverless routes.
 * @param {string} key - Unique key, e.g. "subscribe:1.2.3.4"
 * @param {{ limit: number, windowMs: number }} options
 */
export async function checkRateLimit(key, { limit, windowMs }) {
  await connectDB();
  const now = Date.now();
  const hit = await RateLimitHit.findOne({ key });

  if (!hit) {
    await RateLimitHit.create({ key, count: 1, windowStart: new Date(now) });
    return { allowed: true };
  }

  const windowAge = now - hit.windowStart.getTime();
  if (windowAge >= windowMs) {
    hit.count = 1;
    hit.windowStart = new Date(now);
    await hit.save();
    return { allowed: true };
  }

  if (hit.count >= limit) {
    return { allowed: false };
  }

  hit.count += 1;
  await hit.save();
  return { allowed: true };
}

export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
