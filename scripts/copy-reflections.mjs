/**
 * Copy dailyreflections.reflections between MongoDB clusters (or same cluster).
 *
 * The app reads reflections from database "dailyreflections", collection
 * "reflections" — NOT from the database name in your connection string path.
 *
 * Required env:
 *   SOURCE_MONGODB_URI — where reflections currently live
 *   TARGET_MONGODB_URI — where production should read them (e.g. performance cluster)
 *
 * Optional:
 *   REFLECTIONS_DB=dailyreflections
 *   REFLECTIONS_COLLECTION=reflections
 *   DRY_RUN=1 — counts only, no writes
 *
 * Run:
 *   node --env-file=.env.local scripts/copy-reflections.mjs
 *
 * Or:
 *   SOURCE_MONGODB_URI="mongodb+srv://..." TARGET_MONGODB_URI="mongodb+srv://..." \
 *     node scripts/copy-reflections.mjs
 */
import { MongoClient } from "mongodb";

const sourceUri = process.env.SOURCE_MONGODB_URI || process.env.OLD_MONGODB_URI;
const targetUri = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI;
const dbName = process.env.REFLECTIONS_DB || "dailyreflections";
const collName = process.env.REFLECTIONS_COLLECTION || "reflections";
const dryRun = process.env.DRY_RUN === "1";

function hostLabel(uri) {
  try {
    const u = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "https://"));
    return u.hostname;
  } catch {
    return "(unknown host)";
  }
}

if (!sourceUri || !targetUri) {
  console.error("Set SOURCE_MONGODB_URI (or OLD_MONGODB_URI) and TARGET_MONGODB_URI (or MONGODB_URI).");
  process.exit(1);
}

console.log(`Database: ${dbName}`);
console.log(`Collection: ${collName}`);
console.log(`Source host: ${hostLabel(sourceUri)}`);
console.log(`Target host: ${hostLabel(targetUri)}`);
if (dryRun) console.log("DRY RUN — no writes\n");

const sourceClient = new MongoClient(sourceUri);
const targetClient = new MongoClient(targetUri);

await sourceClient.connect();
await targetClient.connect();

const src = sourceClient.db(dbName).collection(collName);
const dst = targetClient.db(dbName).collection(collName);

const sourceCount = await src.countDocuments();
const targetBefore = await dst.countDocuments();

console.log(`Source count: ${sourceCount}`);
console.log(`Target count (before): ${targetBefore}`);

if (sourceCount === 0) {
  console.error("\nSource has 0 documents. Point SOURCE_MONGODB_URI at the cluster that has reflections.");
  await sourceClient.close();
  await targetClient.close();
  process.exit(1);
}

const sample = await src.findOne({}, { projection: { month: 1, day: 1, title: 1 } });
if (sample) {
  console.log("Sample source doc:", JSON.stringify(sample));
} else {
  console.warn("Could not read a sample document.");
}

if (dryRun) {
  console.log("\nDry run complete. Re-run without DRY_RUN=1 to copy.");
  await sourceClient.close();
  await targetClient.close();
  process.exit(0);
}

let upserted = 0;
let modified = 0;
const BATCH = 200;
const cursor = src.find({});

let batch = [];
while (await cursor.hasNext()) {
  batch.push(await cursor.next());
  if (batch.length >= BATCH) {
    const ops = batch.map((d) => ({
      replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
    }));
    const res = await dst.bulkWrite(ops, { ordered: false });
    upserted += res.upsertedCount;
    modified += res.modifiedCount;
    batch = [];
    process.stdout.write(`  copied ${upserted + modified}...\r`);
  }
}
if (batch.length) {
  const ops = batch.map((d) => ({
    replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
  }));
  const res = await dst.bulkWrite(ops, { ordered: false });
  upserted += res.upsertedCount;
  modified += res.modifiedCount;
}

const targetAfter = await dst.countDocuments();
console.log(`\nUpserted: ${upserted}, modified: ${modified}`);
console.log(`Target count (after): ${targetAfter}`);

if (targetAfter < sourceCount) {
  console.error("Count mismatch after copy — investigate before switching production.");
  await sourceClient.close();
  await targetClient.close();
  process.exit(1);
}

console.log("Done. Reflections are on the target cluster at dailyreflections.reflections");
await sourceClient.close();
await targetClient.close();
process.exit(0);
