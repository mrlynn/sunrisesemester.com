/**
 * Backfill slugs for events created before the slug field existed.
 * Idempotent: only touches events without a slug.
 * Run: node --env-file=.env.local scripts/backfill-event-slugs.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import Event from "../src/models/Event.js";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

await connectDB();

const events = await Event.find({
  $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
})
  .sort({ eventDate: 1 })
  .select({ "flyer.data": 0 })
  .lean();

console.log(`Found ${events.length} event(s) without a slug.`);

for (const ev of events) {
  const base = slugify(ev.title) || "event";
  let candidate = base;
  let n = 2;
  // Ensure uniqueness against all other events.
  while (await Event.exists({ slug: candidate, _id: { $ne: ev._id } })) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  await Event.updateOne({ _id: ev._id }, { $set: { slug: candidate } });
  console.log(`  ${ev.title}  ->  /events/${candidate}`);
}

console.log("Done.");
process.exit(0);
