import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import CrosswordEntry from "@/models/CrosswordEntry";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import CrosswordBankClient from "./ui";

export const metadata = { title: "Crossword bank (editor)" };

export default async function CrosswordBankPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  await connectDB();
  const limit = 25;
  const [total, items] = await Promise.all([
    CrosswordEntry.countDocuments({}),
    CrosswordEntry.find({}).sort({ updatedAt: -1 }).limit(limit).lean(),
  ]);
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <CrosswordBankClient
      initialData={{
        items: JSON.parse(JSON.stringify(items)),
        total,
        page: 1,
        pages,
        limit,
      }}
    />
  );
}

