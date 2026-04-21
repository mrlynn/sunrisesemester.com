import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";

export async function listPublishedStories() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectDB();
  return Story.find({ published: true })
    .sort({ updatedAt: -1 })
    .select("title slug excerpt author coverImage coverImageCredit coverImageCreditUrl updatedAt")
    .lean();
}

export async function getStoryBySlug(slug) {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  await connectDB();
  return Story.findOne({ slug, published: true }).lean();
}
