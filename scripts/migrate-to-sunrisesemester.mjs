/**
 * Move Sunrise Semester collections out of the shared `convopilot` database
 * into a dedicated `sunrisesemester` database (same Atlas cluster).
 *
 * Type-preserving (uses the native driver, so ObjectId / Date / Binary are
 * copied exactly) and idempotent (re-running upserts by _id).
 *
 * Run: node --env-file=.env.local scripts/migrate-to-sunrisesemester.mjs
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const SOURCE_DB = "convopilot";
const TARGET_DB = "sunrisesemester";

// Collections owned by this app (verified to contain only Sunrise data).
const COLLECTIONS = [
  "events",
  "rsvps",
  "stories",
  "storysubmissions",
  "landings",
  "anniversaries",
  "serviceroles",
  "puzzles",
  "puzzleruns",
  "puzzleusers",
  "crosswordentries",
];

const client = new MongoClient(uri);
await client.connect();
const src = client.db(SOURCE_DB);
const dst = client.db(TARGET_DB);

let grandTotal = 0;
for (const name of COLLECTIONS) {
  const docs = await src.collection(name).find({}).toArray();
  if (docs.length === 0) {
    console.log(`${name}: 0 docs (nothing to copy)`);
    continue;
  }
  const ops = docs.map((d) => ({
    replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
  }));
  const res = await dst.collection(name).bulkWrite(ops, { ordered: false });
  const targetCount = await dst.collection(name).countDocuments();
  grandTotal += docs.length;
  console.log(
    `${name}: source=${docs.length}  ->  ${TARGET_DB}.${name} now has ${targetCount} ` +
      `(upserted=${res.upsertedCount}, modified=${res.modifiedCount})`,
  );
}

console.log(`\nDone. Copied ${grandTotal} documents into "${TARGET_DB}".`);
await client.close();
process.exit(0);
