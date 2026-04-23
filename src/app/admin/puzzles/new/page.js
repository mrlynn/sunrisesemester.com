import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import PuzzleEditorForm from "../puzzle-editor-form";

export const metadata = {
  title: "New puzzle (editor)",
};

export default async function AdminNewPuzzlePage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  return <PuzzleEditorForm mode="new" />;
}

