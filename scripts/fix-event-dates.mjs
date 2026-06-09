/**
 * One-time fix for events saved before Eastern timezone handling.
 *
 *   node --env-file=.env.local scripts/fix-event-dates.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import Event from "../src/models/Event.js";
import { fixLegacyEventDate, formatEventDate } from "../src/lib/eventDates.js";

await connectDB();
const events = await Event.find({}).select({ title: 1, slug: 1, eventDate: 1 });

let updated = 0;
for (const ev of events) {
  const before = new Date(ev.eventDate);
  const fixed = fixLegacyEventDate(ev.eventDate);
  if (fixed.toISOString() === before.toISOString()) continue;

  await Event.updateOne({ _id: ev._id }, { $set: { eventDate: fixed } });
  updated += 1;
  console.log(
    `Updated ${ev.slug || ev._id}: ${before.toISOString()} -> ${fixed.toISOString()} (${formatEventDate(fixed)})`,
  );
}

console.log(updated ? `\nDone. Updated ${updated} event(s).` : "\nNo events needed updating.");
process.exit(0);
