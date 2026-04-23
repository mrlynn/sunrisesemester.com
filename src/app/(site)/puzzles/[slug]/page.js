import PuzzleSolvePage from "@/components/PuzzleSolvePage";

export default async function PuzzleSlugPage({ params }) {
  const { slug } = await params;
  return <PuzzleSolvePage slug={slug} />;
}

