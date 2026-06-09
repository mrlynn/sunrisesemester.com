/**
 * List databases and reflection counts on a cluster (no writes).
 *
 *   node --env-file=.env.local scripts/probe-mongodb.mjs
 *   MONGODB_URI="mongodb+srv://..." node scripts/probe-mongodb.mjs
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.TARGET_MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI.");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();

const admin = client.db().admin();
const { databases } = await admin.listDatabases();

console.log("Databases on cluster:\n");
for (const { name, sizeOnDisk } of databases) {
  const db = client.db(name);
  const cols = await db.listCollections().toArray();
  const colNames = cols.map((c) => c.name).sort();
  let extra = "";
  if (name === "dailyreflections" || colNames.includes("reflections")) {
    const n = await db.collection("reflections").countDocuments().catch(() => -1);
    extra = `  → reflections: ${n} docs`;
  }
  console.log(`  ${name} (${Math.round(sizeOnDisk / 1024)} KB)${extra}`);
  if (colNames.length && colNames.length <= 20) {
    console.log(`     collections: ${colNames.join(", ")}`);
  }
}

await client.close();
process.exit(0);
