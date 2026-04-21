import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import mongoose from "mongoose";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import Anniversary from "@/models/Anniversary";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import AnniversaryForm from "../AnniversaryForm";

export const metadata = {
  title: "Edit anniversary",
};

export default async function EditAnniversaryPage({ params }) {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to edit anniversaries.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const doc = await Anniversary.findById(id).lean();
  if (!doc) {
    notFound();
  }
  const initial = JSON.parse(JSON.stringify(doc));
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AnniversaryForm mode="edit" initial={initial} />
    </Container>
  );
}
