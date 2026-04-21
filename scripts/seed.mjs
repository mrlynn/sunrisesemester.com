/**
 * One-time (or idempotent) seed for Atlas.
 * Run: node --env-file=.env.local scripts/seed.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import Landing from "../src/models/Landing.js";

await connectDB();

await Landing.updateOne(
  { key: "main" },
  {
    $setOnInsert: {
      key: "main",
      heroTitle: "Sunrise Semester",
      heroSubtitle: "A home group of Alcoholics Anonymous",
      body: `Welcome to our group site.

This block is **Markdown**. Edit it anytime from the editor after you sign in.`,
    },
  },
  { upsert: true },
);

console.log("Landing document is ready in MongoDB (upserted if missing).");

process.exit(0);
