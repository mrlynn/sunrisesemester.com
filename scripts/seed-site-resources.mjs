/**
 * Idempotent seed of the previous hardcoded /resources links into SiteResource.
 * Run: npm run seed:site-resources
 * (or: node --env-file=.env.local scripts/seed-site-resources.mjs)
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const FileSchema = new mongoose.Schema(
  {
    url: String,
    pathname: String,
    name: String,
    size: Number,
    contentType: String,
  },
  { _id: false },
);

const SiteResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "link" },
    kind: { type: String, required: true },
    externalUrl: { type: String, default: "" },
    file: FileSchema,
    sourceNote: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const SiteResource =
  mongoose.models.SiteResource || mongoose.model("SiteResource", SiteResourceSchema);

const SEED = [
  {
    title: "Sherpa Guide: Zoom Administration",
    description: "Internal guide for Zoom hosts and admins.",
    category: "guide",
    kind: "link",
    externalUrl: "/sherpa-guide",
    sortOrder: 10,
    published: true,
  },
  {
    title: "Alcoholics Anonymous World Services",
    description: "Official AA website.",
    category: "link",
    kind: "link",
    externalUrl: "https://www.aa.org/",
    sortOrder: 20,
    published: true,
  },
  {
    title: "The Big Book (online)",
    description: "Read the Big Book on aa.org.",
    category: "link",
    kind: "link",
    externalUrl: "https://www.aa.org/the-big-book",
    sortOrder: 30,
    published: true,
  },
  {
    title: "The Twelve Steps",
    description: "The Twelve Steps of Alcoholics Anonymous.",
    category: "link",
    kind: "link",
    externalUrl: "https://www.aa.org/12-steps-of-alcoholics-anonymous",
    sortOrder: 40,
    published: true,
  },
  {
    title: "The Twelve Traditions",
    description: "The Twelve Traditions of Alcoholics Anonymous.",
    category: "link",
    kind: "link",
    externalUrl: "https://www.aa.org/12-traditions-of-alcoholics-anonymous",
    sortOrder: 50,
    published: true,
  },
];

await mongoose.connect(MONGODB_URI);

let created = 0;
let skipped = 0;

for (const item of SEED) {
  const existing = await SiteResource.findOne({
    kind: "link",
    externalUrl: item.externalUrl,
  }).lean();
  if (existing) {
    skipped += 1;
    continue;
  }
  await SiteResource.create(item);
  created += 1;
  console.log(`Created: ${item.title}`);
}

console.log(`Done. Created ${created}, skipped ${skipped} existing.`);
await mongoose.disconnect();
