import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Puzzle from "@/models/Puzzle";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import PuzzleEditorForm from "../puzzle-editor-form";

export const metadata = {
  title: "Edit puzzle (editor)",
};

export default async function AdminPuzzleIdPage({ params }) {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  const { id } = await params;
  await connectDB();
  const doc = await Puzzle.findById(id).lean();
  if (!doc) {
    redirect("/admin/puzzles");
  }
  return <PuzzleEditorForm mode="edit" initialPuzzle={JSON.parse(JSON.stringify(doc))} />;
}

