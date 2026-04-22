import connectDB from "@/lib/mongodb";
import Landing from "@/models/Landing";

const FALLBACK = {
  key: "main",
  heroTitle: "Sunrise Semester",
  heroSubtitle: "A home group of Alcoholics Anonymous",
  body: `Welcome. Add **MONGODB_URI** in \`.env.local\` and run \`npm run seed\` to store your real welcome copy in Atlas.

This placeholder page lets you build and deploy before the database is wired up.`,
};

export async function getLanding() {
  if (!process.env.MONGODB_URI) {
    return FALLBACK;
  }
  try {
    await connectDB();
    let doc = await Landing.findOne({ key: "main" }).lean();
    if (!doc) {
      doc = (
        await Landing.create({
          key: "main",
          heroTitle: FALLBACK.heroTitle,
          heroSubtitle: FALLBACK.heroSubtitle,
          body: "",
        })
      ).toObject();
    }
    return doc;
  } catch {
    return FALLBACK;
  }
}
