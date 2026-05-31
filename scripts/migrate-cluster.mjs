/**
 * Copy all collections from one Atlas cluster/database to another.
 * Type-preserving (native driver) and idempotent (upsert by _id).
 *
 * Required env:
 *   OLD_MONGODB_URI — source cluster URI (includes database name)
 *   MONGODB_URI     — target cluster URI (includes database name)
 *
 * Run:
 *   OLD_MONGODB_URI="mongodb+srv://..." MONGODB_URI="mongodb+srv://..." \
 *     node scripts/migrate-cluster.mjs
 *
 * Optional:
 *   DRY_RUN=1       — list collections and counts only, no writes
 *   COLLECTIONS=a,b — comma-separated subset (default: all non-system collections)
 */
import { MongoClient } from "mongodb";

const oldUri = process.env.OLD_MONGODB_URI;
const newUri = process.env.MONGODB_URI;
const dryRun = process.env.DRY_RUN === "1";
const subset = process.env.COLLECTIONS?.split(",").map((s) => s.trim()).filter(Boolean);

if (!oldUri || !newUri) {
  console.error("Set OLD_MONGODB_URI and MONGODB_URI.");
  process.exit(1);
}

function dbName(uri) {
  const path = new URL(uri.replace("mongodb+srv://", "https://")).pathname.replace(/^\//, "");
  return path.split("?")[0] || "test";
}

const sourceDbName = dbName(oldUri);
const targetDbName = dbName(newUri);

console.log(`Source: ${sourceDbName} @ old cluster`);
console.log(`Target: ${targetDbName} @ new cluster`);
if (dryRun) console.log("DRY RUN — no writes\n");

const oldClient = new MongoClient(oldUri);
const newClient = new MongoClient(newUri);

await oldClient.connect();
await newClient.connect();

const src = oldClient.db(sourceDbName);
const dst = newClient.db(targetDbName);

let names = (await src.listCollections().toArray())
  .map((c) => c.name)
  .filter((n) => !n.startsWith("system."));
if (subset?.length) {
  names = names.filter((n) => subset.includes(n));
}
names.sort();

if (names.length === 0) {
  console.log("No collections to migrate.");
  await oldClient.close();
  await newClient.close();
  process.exit(0);
}

console.log(`Collections (${names.length}): ${names.join(", ")}\n`);

const summary = [];
let grandTotal = 0;

for (const name of names) {
  const sourceCount = await src.collection(name).countDocuments();
  if (dryRun) {
    const targetCount = await dst.collection(name).countDocuments();
    console.log(`${name}: source=${sourceCount}  target=${targetCount}`);
    summary.push({ name, sourceCount, targetCount, status: "dry-run" });
    continue;
  }

  if (sourceCount === 0) {
    console.log(`${name}: 0 docs (skip)`);
    summary.push({ name, sourceCount, targetCount: 0, status: "empty" });
    continue;
  }

  const cursor = src.collection(name).find({});
  let batch = [];
  let upserted = 0;
  let modified = 0;
  const BATCH = 500;

  while (await cursor.hasNext()) {
    batch.push(await cursor.next());
    if (batch.length >= BATCH) {
      const ops = batch.map((d) => ({
        replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
      }));
      const res = await dst.collection(name).bulkWrite(ops, { ordered: false });
      upserted += res.upsertedCount;
      modified += res.modifiedCount;
      batch = [];
    }
  }
  if (batch.length) {
    const ops = batch.map((d) => ({
      replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true },
    }));
    const res = await dst.collection(name).bulkWrite(ops, { ordered: false });
    upserted += res.upsertedCount;
    modified += res.modifiedCount;
  }

  // Copy indexes (skip _id_)
  const indexes = await src.collection(name).indexes();
  for (const idx of indexes) {
    if (idx.name === "_id_") continue;
    const { key, name: idxName, ...opts } = idx;
    delete opts.v;
    delete opts.ns;
    try {
      await dst.collection(name).createIndex(key, { ...opts, name: idxName });
    } catch (e) {
      if (!e.message?.includes("already exists")) {
        console.warn(`  index ${idxName} on ${name}: ${e.message}`);
      }
    }
  }

  const targetCount = await dst.collection(name).countDocuments();
  grandTotal += sourceCount;
  const ok = targetCount >= sourceCount;
  console.log(
    `${name}: source=${sourceCount} -> target=${targetCount} ` +
      `(upserted=${upserted}, modified=${modified})${ok ? "" : " MISMATCH"}`,
  );
  summary.push({ name, sourceCount, targetCount, status: ok ? "ok" : "mismatch" });
}

if (!dryRun) {
  console.log(`\nDone. Migrated ${grandTotal} documents.`);
  const bad = summary.filter((s) => s.status === "mismatch");
  if (bad.length) {
    console.error("\nCount mismatches:", bad.map((b) => b.name).join(", "));
    process.exit(1);
  }
}

await oldClient.close();
await newClient.close();
process.exit(0);
