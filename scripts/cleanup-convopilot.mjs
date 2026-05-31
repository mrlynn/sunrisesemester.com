/**
 * Remove the migrated Sunrise Semester data from the shared `convopilot`
 * database — SAFELY:
 *   - Only deletes documents whose _id also exists in `sunrisesemester`
 *     (i.e. exactly the docs we copied). Any non-Sunrise document is left
 *     untouched, even if a collection name were shared.
 *   - Drops a collection only if it is completely empty afterward.
 *
 * Run AFTER verifying the app works against `sunrisesemester`.
 * Run: node --env-file=.env.local scripts/cleanup-convopilot.mjs
 *
 * NOTE: .env.local now points at /sunrisesemester, but this script connects
 * by explicit db name, so the URI's default database is irrelevant.
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const SOURCE_DB = "convopilot";
const TARGET_DB = "sunrisesemester";

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

for (const name of COLLECTIONS) {
  // Ids of the docs we actually migrated.
  const migratedIds = await dst
    .collection(name)
    .find({}, { projection: { _id: 1 } })
    .map((d) => d._id)
    .toArray();

  if (migratedIds.length === 0) {
    console.log(`${name}: nothing migrated; leaving convopilot untouched.`);
    continue;
  }

  const del = await src
    .collection(name)
    .deleteMany({ _id: { $in: migratedIds } });

  const remaining = await src.collection(name).countDocuments();
  let dropped = false;
  if (remaining === 0) {
    await src.collection(name).drop().catch(() => {});
    dropped = true;
  }
  console.log(
    `${name}: deleted ${del.deletedCount} migrated doc(s) from convopilot; ` +
      `${remaining} non-migrated doc(s) remain${dropped ? "; empty collection dropped." : "."}`,
  );
}

console.log("\nCleanup complete.");
await client.close();
process.exit(0);
