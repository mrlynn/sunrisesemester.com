import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";

export async function getCurrentPublishedPuzzle() {
  if (!process.env.MONGODB_URI) {
    return null;
  }
  await connectDB();
  const now = new Date();
  const puzzle = await Puzzle.findOne({
    status: "published",
    publishedAt: { $ne: null, $lte: now },
  })
    .sort({ publishedAt: -1 })
    .select({
      slug: 1,
      title: 1,
      weekOf: 1,
      publishedAt: 1,
      reflectionThemed: 1,
      reflectionSummary: 1,
    })
    .lean();
  return puzzle;
}

export function serializePuzzleSummary(puzzle) {
  if (!puzzle) return null;
  return {
    slug: puzzle.slug,
    title: puzzle.title || "",
    weekOf: puzzle.weekOf,
    publishedAt: puzzle.publishedAt ?? null,
    reflectionThemed: Boolean(puzzle.reflectionThemed),
    reflectionSummary: puzzle.reflectionSummary || "",
  };
}
